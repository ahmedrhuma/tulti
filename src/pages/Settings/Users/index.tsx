import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
// Antd
import { UnlockOutlined, RollbackOutlined, SaveOutlined, CloseCircleOutlined, UserOutlined,  MailOutlined, PhoneOutlined, MobileOutlined, ExclamationCircleOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Typography, notification, Alert, Button, message, Modal } from 'antd';
import { PageContainer, ProTable, DrawerForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import type { ProFormInstance, ProColumns, ActionType } from '@ant-design/pro-components';
// Umi
import isMobile from '@/isMobile';
import { history, useAccess } from 'umi';
import { get, map} from 'lodash';
import GroupSearch from '@/components/GroupSearch';
// Local
// import GroupSearch from '@/components/GroupSearch';
import { updateUser, addUser, removeUser, fetchUsers } from '@/services/users';

const { Paragraph, Text } = Typography;

const { confirm } = Modal;

const UsersPage: React.FC = () => {
  const access = useAccess();
  const [modalSettings, setModalSettings] = useState<{ record: User.Data; loading: boolean; errors: string[]|null; id?: number; visible: boolean; mode: 'new'|'edit'}>({ record: {} as User.Data, visible: false, mode: 'new', errors: null, loading: false } );
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();

  const handleUserOperation = (values: User.Data) => {
    //if(!access.manageUsers) return Promise.resolve(false);
    if(values.group) values.group = get(values.group, 'value', values.group);

    setModalSettings({ ...modalSettings, loading: true, errors: null });

    if(modalSettings.mode==='new') {
      return addUser(values).then((response: User.Data) => {
        setModalSettings({ ...modalSettings, visible: false, loading: false, errors: null });
        message.success(<span>تمام التمام، المُـستخدم <strong>{response.name}</strong> إنضاف والأمور طيبة!</span>);
        actionRef?.current?.reload();
      }).catch((e: any) => {
        // unknown error show message
        setModalSettings({ ...modalSettings, errors: null, loading: false });
        if(e.message === 'ER_DUP_ENTRY') {
            message.warning('البريد الإلكتروني مستخدم مسبقا، غيره ببريد آخر!');
        }
        else notification.error({
            message: 'خطأ غير معروف!',
            description:
            'حدث خطأ غير معروف، يرجى التأكد من الإتصال بالانترنت والمحاولة مرة أخرى!',
        });
      });
    }
    else if(modalSettings.mode==='edit'){
      return updateUser(Number(modalSettings?.id), values).then((response: User.Data) => {
        setModalSettings({ ...modalSettings, visible: false, loading: false, errors: null });
        message.success(<span>المُـستخدم <strong>{response.name}</strong> تعدل والأمور طيبة!</span>);
        actionRef?.current?.reload();
      }).catch((e: any) => {
        console.log(e.message);
        // data error
        // unknown error show message
        setModalSettings({ ...modalSettings, errors: null, loading: false });
        if(e.message === 'ER_DUP_ENTRY') {
          message.warning('البريد الإلكتروني مستخدم مسبقا، غيره ببريد آخر!');
        }
        else notification.error({
            message: 'خطأ غير معروف!',
            description:
            'حدث خطأ غير معروف، يرجى التأكد من الإتصال بالانترنت والمحاولة مرة أخرى!',
        });
      });
    }

    return Promise.reject(false);
  }

  const requestUsers = (params: API.Pagination & Partial<User.Data>) => fetchUsers(params).catch(() => ({ total: 0, data: [], success: false }));

  const resendPassword = (record: User.Data) => {
    //if(!access.manageUsers) return;
    confirm({
      okText: 'تأكيد',
      cancelText: 'إلغاء',
      direction: 'rtl',
      title: <span>هل أنت متأكد من تغيير وإعادة إرسال كلمة المرور للمسنخدم <strong>{record.name}</strong></span>,
      icon: <ExclamationCircleOutlined />,
      content: 'سيتم تغير كلمة المرور وإرسال كلمة مرور جديدة للمستخدم!',
      onOk() {
        return updateUser(Number(record?.id), { action: "reset_account" }).then(() => {
          actionRef?.current?.reload();
          message.success(<span>تم إعادة تعيين كلمة المرور للمستخدم <strong>{record.name}</strong> بنجاح!</span>);
        }).catch(() => {
          message.error('حدث خطأ أثناء إعادة تعيين كلمة المرور للمستخدم، يرجى المحاولة مرة أخرى لاحقا!');
        })
      },
      onCancel() {},
    });
  }

  const deleteUser = (record: User.Data) => {
    //if(!access.manageUsers) return;
    confirm({
      okText: 'تأكيد',
      cancelText: 'إلغاء',
      direction: 'rtl',
      title: <span>هل أنت متأكد من حذف المسنخدم <strong>{record.name}</strong></span>,
      icon: <ExclamationCircleOutlined />,
      content: 'المستخدم سيحذف بشكل نهائي ولن تستطيع التراجع عن العملية!',
      onOk() {
        return removeUser(Number(record?.id)).then(() => {
          actionRef?.current?.reload();
          message.success(<span>تم حذف المستخدم <strong>{record.name}</strong> بنجاح!</span>);
        }).catch(() => {})
      },
      onCancel() {},
    });
  }


  const columns: ProColumns<User.Data>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      title: '#',
      sorter: false,
      width: 48,
      render: (_) => {
        const counter = ((+parseInt(get(actionRef, 'current.pageInfo.current'))||0)-1) * (+parseInt(get(actionRef, 'current.pageInfo.pageSize'))||10);
        return <div className="ant-pro-field-index-column ant-pro-field-index-column-border">{(parseInt(String(counter))+parseInt(get(_, 'props.text', 0)))+1}</div>;
      }
    },
    {
      title: 'الإسم',
      sorter: true,
      dataIndex: 'name',
      render: (dom, entity) => {
        return (
          <a
            href={`/user/${entity.id}`}
            onClick={(e) => {
              e.preventDefault();
              history.push(`/user/${entity.id}`);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: 'البريد الإلكتروني',
      dataIndex: 'email',
      sorter: true,
    },
    {
      title: 'المجموعة',
      search: false,
      sorter: true,
      dataIndex: 'permissions',
      render: item => get(item, 'name', '-')
    },
    {
      title: 'عمليات',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        access.updateUsers ? <Button key="update" onClick={() => {
          formRef.current?.resetFields();
          setModalSettings({ loading: false, errors: null, mode: 'edit', visible: true, id: record.id , record });
          setTimeout(() => {
            formRef.current?.setFieldsValue({
              name: record.name,
              email: record.email,
              phone: record.phone,
              mobile: record.mobile,
              group: {
                value: record.group,
                label: record.permissions?.name
              },
              notes: record.notes
            })
          }, 0);

        }} icon={<EditOutlined />} /> : null,
        access.deleteUsers ? <Button onClick={deleteUser.bind(null, record)} key="delete" type="primary" danger icon={<DeleteOutlined />} /> : null,
        access.manageUsers ? <Button onClick={resendPassword.bind(null, record)} key="resend" type="dashed" danger icon={<UnlockOutlined />} /> : null
      ],
    },
  ];

  if(!access.updateUsers && !access.deleteUsers) columns.pop();

  return (
    <>
      <Helmet>
        <title>مستخدمي النظام</title>
      </Helmet>
      <PageContainer
        onBack={history.back}
        title="مُـستخدمي النظام"
        content="هُـنا يمكنك إضافة المستخدمين الخاصين بالنظام وتعيين مجموعات الصلاحيات الخاصة بهم."
      >
        <ProTable<User.Data, API.Pagination>
          headerTitle="قائمة المستخدمين المعرَّفة"
          actionRef={actionRef}
          rowKey="id"
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
          }}
          search={{
            labelWidth: 120,
          }}
          scroll={{ x: 'max-width' }}
          toolBarRender={() => access.createUsers ? [
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                formRef.current?.resetFields();
                setModalSettings({
                  visible: true,
                  loading: false,
                  errors: null,
                  mode: 'new',
                  record: {} as User.Data
                });
              }}
            >
              <PlusOutlined /> إضافة مستخدم جديد
            </Button>,
          ]: []}
          request={requestUsers}
          columns={columns}
        />
        <DrawerForm
          title={modalSettings.mode==='new'?'إضـافة مُـستخدم جديد':'تعديل المُـستخدم'}
          width={isMobile() ? "100%" : "50%"}
          autoFocusFirstInput
          formRef={formRef}
          grid={true}
          submitter= {{
            searchConfig: { 
              resetText: 'إلغـاء',
              submitText: 'تأكيد'
            },
            submitButtonProps: {
                loading: modalSettings.loading,
                icon: <SaveOutlined />
            },
            resetButtonProps: { 
              icon: <RollbackOutlined />
            }
        }}
          rowProps={{
            gutter: [16, 0],
          }}
          open={modalSettings.visible}
          drawerProps={{
            onClose: () => setModalSettings({ ...modalSettings, visible: false })
          }}
          onFinish={handleUserOperation}
        >
            {modalSettings.errors && (
                <div style={{ width: '100%' }} className="error-container">
                    <Paragraph>
                    <Text strong>
                        حدثت الأخطاء التالية، يرجى تعديلها والمحاولة مرة أخرى:
                    </Text>
                    </Paragraph>
                    {map(modalSettings.errors, (er: string) => (<Paragraph key={er}>
                    <CloseCircleOutlined className="redColored" /> {er}
                    </Paragraph>))}
                </div>
            )}
            <ProFormText
                rules={[
                {
                    required: true,
                    message: 'الإسـم إجباري!',
                },
                ]}
                name="name"
                fieldProps={{ addonBefore: <UserOutlined /> }}
                label="الإسم"
                colProps={{ sm: 24, md: 12 }}
            />
            <ProFormText
                rules={[
                {
                    required: true,
                    message: 'البريد الإلكتروني إجباري!',
                },
                {
                    type: 'email',
                    message: 'البريد الإلكتروني هذا مكتوب بشكل غير صحيح، تأكد منه!'
                }
                ]}
                name="email"
                fieldProps={{ className: 'withLtr', addonBefore: <MailOutlined /> }}
                label="البريد الإلكتروني"
                colProps={{ sm: 24, md: 12, xl: 12 }}
            />
            {modalSettings.mode==="new"?<Alert
                message="تنبيه"
                description={<div>سيتم تكوين كلمة سر عشوائية وإرسالها للمستخدم!</div>}
                type="warning"
                style={{ width: '100%' }}
                showIcon
            />:null}
          
            <GroupSearch colProps={{ sm: 24, md: 12, xl: 12 }} />
            <ProFormText
                colProps={{ sm: 24, md: 12, xl: 12 }}
                name="phone"
                rules={[{ required: true, message: 'رقم الهاتف إجباري!' }]}
                label="رقم الهاتف"
                fieldProps={{ className: 'withLtr', addonBefore: <MobileOutlined /> }}
                tooltip="يجب كتابة مفتاح الدولة مثل +21891"
                placeholder="+2189xxxxxxxxxx"
            />
            <ProFormText
                colProps={{ sm: 24, md: 12, xl: 12 }}
                name="mobile"
                label="هَـاتف بديل"
                fieldProps={{ className: 'withLtr', addonBefore: <PhoneOutlined /> }}
                tooltip="يجب كتابة مفتاح الدولة مثل +21891"
                placeholder="+2189xxxxxxxxxx"
            />
            <ProFormTextArea
                name="notes"
                label="ملاحظات"
                colProps={{ sm: 24 }}
            />
        </DrawerForm>
      </PageContainer>
    </>
  );
};

export default UsersPage;
