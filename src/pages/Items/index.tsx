import { PageContainer, ProTable } from '@ant-design/pro-components';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { TagsOutlined, ExclamationCircleFilled, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Tag, Image, Form, message, Modal, Divider, Space, Typography, Popover, Button } from 'antd';
import { Link, history, useIntl, connect, useAccess } from 'umi';
import React, { useCallback, useRef, useState } from 'react';
import AddItems from './AddItems';
import ItemType from './ItemType';
import { deleteItem, fetchItems } from '@/services/items';
import { get, size, find } from 'lodash';
import { IMAGE_BASE } from '@/URL';


const { confirm } = Modal;

const ItemsPage: React.FC<{ types: Items.Types[] }> = ({ types }) => {
    const [typeModal, setTypeModal] = useState<boolean>(false);
    const [modal, setModal] = useState<{open: boolean; mode: 'new'|'edit'; record:Items.ItemData}>({ open: false, mode: 'new', record: {} as Items.ItemData})
    const [form] = Form.useForm<Items.ItemData>();
    const actionRef = useRef<ActionType>();
    const intl = useIntl();
    const access = useAccess();

    const createLinks = (links: Items.LinkData[]) => {
        return (
            <Space split={<Divider type="vertical" />}>
                {links.map(link => <Typography.Link key={link.link} href={link.link} target="_blank" >{link.name}</Typography.Link>)}
            </Space>
        )
    }

    const removeRecord = (record: Items.ItemData) => {
        confirm({
            title: <div>متأكد من حذف الصنف <strong>{record.name}</strong>؟</div>,
            icon: <ExclamationCircleFilled />,
            direction: 'rtl',
            okText: 'تم',
            maskClosable: true,
            cancelText: 'إلغاء',
            content: 'بينمسح بكل ومعاش فيها كيف تتراجع عن عملية الحذف، شني مني؟',
            onOk() {
              return deleteItem(record.id).then(() => {
                message.success(<div>تم حذف الصنف <strong>{record.name}</strong> بنجاح!</div>)
                actionRef?.current?.reload();
              }).catch(() => {
                message.error(intl.formatMessage({ id: 'pages.items.delete_failed', defaultMessage: 'في مشكلة صارت في حذف المنتج، ياريت تجرب مرة ثانية بعدين!' }))
              })
            },
            onCancel() {},
          });
    }

    const editRecord = (record: Items.ItemData) => {
        form?.setFieldsValue(record);
        setModal({
            open: true,
            mode: 'edit',
            record
        })
    }

    const columns: ProColumns<Items.ItemData>[] = [
        {
            title: '#',
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
            render: (_) => {
                const counter =
                  ((+parseInt(get(actionRef, 'current.pageInfo.current')) || 0) - 1) *
                  (+parseInt(get(actionRef, 'current.pageInfo.pageSize')) || 10);
                return (
                  <div className="ant-pro-field-index-column css-dev-only-do-not-override-lo9b88 ant-pro-field-index-column-border">
                    {parseInt(String(counter)) + parseInt(get(_, 'props.text', 0)) + 1}
                  </div>
                );
            },
            search: false
        },
        {
            title: intl.formatMessage({ id: 'pages.items.name', defaultMessage: 'الإسم' }),
            dataIndex: 'name',
            copyable: true,
            width: 250,
            render: (_, row) => <Link to={`/product/${row.id}`}>{row.name}</Link>
        },
        {
            title: intl.formatMessage({ id: 'pages.items.name', defaultMessage: 'الكود' }),
            dataIndex: 'code',
            width: 50
        },
        {
            title: intl.formatMessage({ id: 'pages.items.name', defaultMessage: 'النوع' }),
            dataIndex: 'type',
            valueType: 'select',
            width: 100,
            render: (_, row) => {
                const type = find(types, d => String(d.id) === String(row.type));
                if(type){
                    return <Tag color={type.color}>{type.name}</Tag>
                }
                return '-';
            }
        },
        {
            title: intl.formatMessage({ id: 'pages.items.name', defaultMessage: 'الوزن (غ)' }),
            dataIndex: 'weight',
            width: 100,
            ellipsis: true
        },
        {
            title: intl.formatMessage({ id: 'pages.items.image', defaultMessage: 'صور العنصر' }),
            dataIndex: 'images',
            width: 150,
            search: false,
            render: (_, row) => size(row.images) > 0 ? <Image
                height={70}
                fallback="data:image/png;base64,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"
                src={IMAGE_BASE+get(row.images, [0])}
            /> : '-'
        },
        {
            search: false,
            title: 'روابط',
            width: 100,
            dataIndex: 'links',
            render: links => (Array.isArray(links) && links.length > 0) ? <Popover content={createLinks(links)} title={intl.formatMessage({ id: 'pages.items.links', defaultMessage: 'الروابط' })} trigger="click">
                <Button>{intl.formatMessage({id: 'global.click_here', defaultMessage: 'إضغط هنا' })}</Button>
            </Popover> : null
        },
        {
            title: intl.formatMessage({ id: 'global.operations', defaultMessage: 'عمليات' }),
            valueType: 'option',
            key: 'option',
            width: 100,
            render: (text, record) => [
                access.updateItems ? <Button onClick={editRecord.bind(null, record)} icon={<EditOutlined />} type="primary" key="edit" /> : null,
                access.deleteItems ? <Button onClick={removeRecord.bind(null, record)} icon={<DeleteOutlined />} type="primary" danger key="delete" /> : null
            ],
        },
    ];

    if(!access.updateItems && !access.deleteItems) columns.pop();

    const valueEnum = useCallback(() => {
        const res: any = {};
        for(let i=0; i<size(types); i++) {
            res[types[i].id] = {
                text: types[i].name
            }
        }

        return res;
    }, [types]);

    columns[3].valueEnum = valueEnum;

    const loadData = async (params = {}) => fetchItems(params);

    const onClose = () => {
        setModal({
            mode: 'new',
            open:false,
            record: {} as Items.ItemData
        });
        setTimeout(() => { actionRef?.current?.reload(); }, 0);
    }

    const onClickAddNew = () => {
        form?.resetFields();
        setModal({
            mode: 'new',
            open: true,
            record: {} as Items.ItemData
        });
    }

    const typeModalClose = () => setTypeModal(false);

    const typeModalOpen = () => setTypeModal(true);

    return (
        <>
            <ItemType open={typeModal} onClose={typeModalClose} />
            <AddItems images={modal.record.images} form={form} id={modal.record?.id} mode={modal.mode} open={modal.open} onClose={onClose} />
            <PageContainer onBack={history.back} extra={access.manageItems ? <Button onClick={typeModalOpen} icon={<TagsOutlined />} type="primary">أنواع الأصناف</Button> : null}>
                <ProTable<Items.ItemData>
                    columns={columns}
                    actionRef={actionRef}
                    cardBordered
                    request={loadData}
                    columnsState={{
                        persistenceKey: 'delivery-items-page',
                        persistenceType: 'localStorage'
                    }}
                    rowKey="id"
                    search={{
                        labelWidth: 'auto',
                    }}
                    options={{
                        setting: {
                            listsHeight: 400,
                        }
                    }}
                    pagination={{
                        showSizeChanger: true,
                        showQuickJumper: true,
                        defaultPageSize: 10,
                    }}
                    scroll={{ x: 'max-width' }}
                    dateFormatter="string"
                    toolBarRender={() => access.createItems ? [
                        <Button onClick={onClickAddNew} key="button" icon={<PlusOutlined />} type="primary">
                            إضافة عنصر
                        </Button>
                    ] : []}
                />
            </PageContainer>
        </>
    );
};

const ItemsPageConnected = connect((state: any) => ({ types: state.types.types }))(ItemsPage);
export default ItemsPageConnected;