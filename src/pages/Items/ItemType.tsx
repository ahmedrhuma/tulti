import React, { useState, useRef } from 'react';
import { ExclamationCircleFilled, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Tag, Form, message, Modal, Drawer, Button } from 'antd';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { map, startCase } from 'lodash';
import { connect } from 'umi';
import isMobile from '@/isMobile';
import { ProFormSelect, ProForm, ProFormText, ProTable } from '@ant-design/pro-components';
import { createType, updateType, deleteType } from '@/services/item-types';

const { confirm } = Modal;

const ITEM_TYPES: string[] = [
    "magenta",
    "red",
    "volcano",
    "orange",
    "gold",
    "lime",
    "green",
    "cyan",
    "blue",
    "geekblue",
    "purple"
]

const ItemTypePage: React.FC<{ types: Items.Types[], loading: boolean; open: boolean; onClose: () => void }> = ({ types, loading, open, onClose }) => {
    const [mode, setMode] = useState<number| null>(null);
    const [form] = Form.useForm<Items.Types>();
    const actionRef = useRef<ActionType>();

    const removeRecord = (record: Items.Types) => {
        confirm({
            title: <div>متأكد من حذف النوع <strong>{record.name}</strong>؟</div>,
            icon: <ExclamationCircleFilled />,
            content: 'بينمسح بكل ومعاش فيها كيف تتراجع عن عملية الحذف، شني مني؟',
            onOk() {
              return deleteType(record.id).then(() => {
                message.success(<div>تم حذف النوع <strong>{record.name}</strong> بنجاح!</div>)
                actionRef?.current?.reload();
              }).catch(() => {
                message.error(<div>مشكلة في عملية حذف النوع <strong>{record.name}</strong> حاول مرة ثانية بعدين!</div>)
              })
            },
            onCancel() {},
          });
    }

    const editRecord = (record: Items.Types) => {
        form?.setFieldsValue({ name: record.name, color: record.color, code: record.code });
        setMode(record.id);
    }

    const columns: ProColumns<Items.Types>[] = [
        {
            title: '#',
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
            search: false
        },
        {
            title: 'النوع',
            dataIndex: 'name',
            copyable: true,
            ellipsis: true
        },
        {
            title: 'الكود',
            dataIndex: 'code',
            copyable: true,
            ellipsis: true
        },
        {
            title: 'اللون',
            dataIndex: 'color',
            render: c => <Tag color={c as string}>{startCase(c as string)}</Tag>
        },
        {
            title: 'عمليات',
            valueType: 'option',
            key: 'option',
            render: (text, record) => [
                <Button onClick={editRecord.bind(null, record)} icon={<EditOutlined />} type="primary" key="edit" />,
                <Button onClick={removeRecord.bind(null, record)} icon={<DeleteOutlined />} type="primary" danger key="delete" />
            ]
        },
    ];

    const onClickAddNew = () => {
        form?.resetFields();
        setMode(null);
    }

    const onFinish = (data: Items.Types) => {
        if(mode === null) {
            return createType(data).then(() => {
                form.resetFields();
            }).catch(() => {
                message.error(<div>خطأ أثناء إضافة <strong>{data.name}</strong> الرجاء المحاولة مرة أخرى لاحقاً!</div>)
            })
        }
        return updateType(mode, data).then(() => {
            form.resetFields();
        }).catch(() => {
            message.error(<div>خطأ أثناء تعديل <strong>{data.name}</strong> الرجاء المحاولة مرة أخرى لاحقاً!</div>)
        });
    }

    const onReset = () => {
        form.resetFields();
        setMode(null);
    }

    return (
        <>
        <Drawer width={isMobile() ? "100%" : "50%"} title="أنواع الاصناف" placement="right" onClose={onClose} open={open}>
            <ProForm
                onFinish={onFinish}
                onReset={onReset}
                autoFocusFirstInput
                grid
                form={form}
            >
                <ProFormText
                    colProps={{ xs:24, md: 8 }}
                    name="name"
                    label="النوع"
                    rules={[
                        {
                            required: true,
                            message: 'ضروري تكتب إسم النوع!'
                        }
                    ]}
                    placeholder="تنظيم..."
                />
                <ProFormText
                    colProps={{ xs:24, md: 8 }}
                    name="code"
                    label="الكود"
                    rules={[
                        {
                            required: true,
                            message: 'ضروري تكتب الكود!'
                        }
                    ]}
                    placeholder="P,O,A..."
                />
                <ProFormSelect
                    options={map(ITEM_TYPES, t => ({ value: t, label: startCase(t) }))}
                    colProps={{ xs:24, md: 8 }}
                    fieldProps={{
                        optionItemRender(item) {
                            return <Tag color={item.value}>{item.label}</Tag>
                        },
                    }}
                    rules={[
                        {
                            required: true,
                            message: 'ضروري تختار اللون!'
                        }
                    ]}
                    name="color"
                    label="اللون"
                    extra="إختار لون مميز باش يسهل تحديد نوع المنتج بعدين طول"
                />
                </ProForm>
            <ProTable<Items.Types>
                loading={loading}
                columns={columns}
                actionRef={actionRef}
                cardBordered
                dataSource={types}
                columnsState={{
                    persistenceKey: 'delivery-items-type-page',
                    persistenceType: 'localStorage'
                }}
                rowKey="id"
                search={false}
                options={{
                    setting: {
                        listsHeight: 400,
                    }
                }}
                pagination={false}
                dateFormatter="string"
                toolBarRender={() => [
                    <Button onClick={onClickAddNew} key="button" icon={<PlusOutlined />} type="primary">
                        إضافة نوع
                    </Button>
                ]}
            />
        </Drawer>
        </>
    );
};

const ItemTypePageConnected = connect((state: any) => ({ loading: state.loading.effects['types/fetch'], types: state.types.types }))(ItemTypePage);

export default ItemTypePageConnected;