import { useState } from 'react';
import { Segmented, Descriptions, Alert, Divider, Typography, Drawer, Image } from 'antd';
import { ProFormSelect, ProCard } from '@ant-design/pro-components';

import { searchCity } from '@/services/cities';
import { searchItem } from '@/services/storages';

import { size, map, get } from 'lodash';
import { useIntl } from 'umi';
import FixNumber from '@/FixNumber';
import isMobile from '@/isMobile'
import { IMAGE_BASE } from '@/URL';

const { Paragraph, Text } = Typography;

const FastSearch: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
    const [viewMode, setViewMode] = useState<'showAll'|'normal'>('normal');
    const [options, setOptions] = useState([]);
    const [subs, setSubs] = useState([]);
    const [qnt, setQnt] = useState<number>(0);
    const [productOptions, setProductOptions] = useState([]);
    const [showAlert, setAlert] = useState(false);
    const [text, setText] = useState<string>('');
    const [sub2Text, setSub2Text] = useState<string>('');
    const [subText, setSubText] = useState<string>('');
    const [productText, setProductText] = useState<string>('');
    const [shortProductText, setShortProductText] = useState<string>('');
    const [image, setImage] = useState<string|null>(null);
    const intl = useIntl();

    const format = num => FixNumber(intl.formatNumber(num, { style: 'currency', currency: 'lyd', minimumFractionDigits: 0, maximumFractionDigits: 2 }));

    const findItems = q => {
        if(q==='') return [];
        return searchCity(q).then(response => {
            setOptions(map(response, i => ({ value: i.id, label: `${i.city} ${size(i.sub_cities) > 0 ? ` - (${size(i.sub_cities)})` : ''}`, name: i.city, cost: i.cost, notes: i.notes, subs: i.sub_cities })));
        }).catch(() => {
            return null;
        });
    }

    const findProductItems = q => {
        if(q==='') return [];
        return searchItem(q, viewMode).then(response => {
                setProductOptions(map(response, i => ({ value: i.id, label: `${i.name} - ${i.code}`, ...i })));
            }).catch(() => {
                return null;
            });
    }

    const onSelect = (_, item) => {
        setSub2Text('');
        setSubs(item.subs);
        setText(`التوصـيل لـ ${item.name} متاح بسعر ${format(item.cost)}`);
        setSubText(`التوصيل خلال ${item.notes}`);
    }
    const onProductSelect = (_, item) => {
        setAlert(false);
        setShortProductText(`🔔الكود: (${item.code})🔔\n✅فقط بـ: ${format(item.sellprice)}✅`)
        setProductText(`
            ${item.desc || ''}\r🔔الكود: (${item.code})🔔\n✅فقط بـ: ${format(item.sellprice)}✅`);

        if(item.qnt === 0) setAlert(true);
        else setAlert(false);
        setQnt(item.qnt);
        setImage(get(item, ['images', 0], null))
    }

    const onSelectSub = (_, sub) => {
        setSub2Text(`التوصـيل لـ ${sub.name} متاح بسعر ${format(sub.price)}`);
    }

    const onProductClear = () => {
        setAlert(false);
        setProductText('');
        setImage(null);
        setQnt(0);
        setShortProductText('');
    }

    return (
        <Drawer
            open={open}
            width={isMobile() ? "100%" : "50%"}
            onClose={onClose}
            title="البحث السريع"
        >
            <Divider orientation='left'>مدينة</Divider>
            <ProFormSelect
                name="search"
                label="إبحث عن"
                fieldProps={{
                    options,
                    className: "ahmedrhuma-custom-select-input",
                    filterOption: false,
                    onSearch: findItems,
                    notFoundContent: null,
                    labelInValue: true,
                    showArrow: false,
                    onSelect: onSelect,
                    defaultActiveFirstOption: false,
                    placeholder: 'إبحث عن...',
                    showSearch: true
                }}
            />
            {size(subs) > 0 ? <ProFormSelect
                name="search"
                label="إبحث عن"
                fieldProps={{
                    options: subs,
                    id: 'id',
                    optionLabelProp: 'name',
                    optionFilterProp: 'name',
                    fieldNames: { label: 'name', value: 'id' },
                    className: "ahmedrhuma-custom-select-input",
                    filterOption: true,
                    optionItemRender(item) {
                        return `${item.name} - ${item.price}`
                    },
                    notFoundContent: null,
                    showArrow: false,
                    onSelect: onSelectSub,
                    defaultActiveFirstOption: false,
                    placeholder: 'إبحث عن...',
                    showSearch: true
                }}
            /> : null}
            {text ? <Paragraph copyable>{text}</Paragraph> : null}
            {sub2Text ? <Paragraph copyable>{sub2Text}</Paragraph> : null}
            {subText ? <Paragraph copyable>{subText}</Paragraph> : null}

            <Divider orientation='left'>منتج</Divider>
            <ProCard ghost style={{ marginBottom: '10px' }} layout="center">
                <Segmented options={[{ label: 'الموجود بس', value: 'normal' }, { label: 'كل شي', value: 'showAll' }]} value={viewMode} onChange={setViewMode} />
            </ProCard>
            <ProFormSelect
                name="search"
                label="إبحث عن"
                fieldProps={{
                    onClear: onProductClear,
                    options: productOptions,
                    className: "ahmedrhuma-custom-select-input",
                    filterOption: false,
                    onSearch: findProductItems,
                    notFoundContent: null,
                    labelInValue: true,
                    showArrow: false,
                    onSelect: onProductSelect,
                    defaultActiveFirstOption: false,
                    placeholder: 'إبحث عن...',
                    showSearch: true
                }}
            />

            {showAlert ? <Alert showIcon type="warning" message="المنتج هذا تم!" /> : null}
            {productText ? <Paragraph copyable>{productText}</Paragraph> : null}
            {shortProductText ? <Paragraph copyable>{shortProductText}</Paragraph> : null}
            {productText && !showAlert ? <Descriptions bordered size="small">
                <Descriptions.Item label="الكمية المتاحة"><Text strong>{qnt}</Text></Descriptions.Item>
            </Descriptions> : null}
            {image ? <Image style={{ width: '100%' }} src={IMAGE_BASE+image} preview={false} /> : null}
        </Drawer>
    )
}

export default FastSearch;