import React from 'react';
import { message, Divider, Descriptions, Empty } from 'antd';
import { ProForm, ProFormText, ProCard, PageContainer } from '@ant-design/pro-components';
import { useModel, Helmet, history } from '@umijs/max';
import { get } from 'lodash'
import { changePassword } from '@/services/users';

const Me: React.FC = () => {
    const [form] = ProForm.useForm();
    const { initialState } = useModel('@@initialState');

    const { currentUser } = initialState;

    const onFinish = async (values: any) => {
        return changePassword(values).then(() => {
            message.success('تم تغيير كلمة المرور بنجاح!');
            form.resetFields();
        }).catch(() => {
            message.error('خطأ، كلمة المرور الحالية غير صحيحة!')
        })
    }

    if(!currentUser) return <Empty />;
    return <>
        <Helmet>
            <title>حِـسابي الشخصي</title>
        </Helmet>
        <PageContainer
            onBack={history.back}
            title="حِـسابي الشخصي"
        >
            <Descriptions bordered size="small">
                <Descriptions.Item label="الإسم">{currentUser.name}</Descriptions.Item>
                <Descriptions.Item label="المجموعة">{get(currentUser, 'permissions.name', '-')}</Descriptions.Item>
                <Descriptions.Item label="البريد الإلكتروني">{currentUser.email}</Descriptions.Item>
                <Descriptions.Item label="رقم الهاتف">{currentUser.phone}</Descriptions.Item>
                {currentUser.mobile ? <Descriptions.Item label="رقم الهاتف">{currentUser.mobile}</Descriptions.Item> : null}
            </Descriptions>
            <Divider />
            <ProCard  layout="center" ghost gutter={8} style={{ marginBlockStart: 8 }}>
            <ProCard boxShadow colSpan={{ xs: 24, sm: 24, md: 6, lg: 8, xl: 10 }} layout="center" title="تغير كلمة المرور">
                <ProForm form={form} grid onFinish={onFinish}>
                    <ProFormText name="current_password" rules={[{
                        required: true,
                        message: 'كلمة المرور الحالية ضروري منها'
                    }]} colProps={{ xs: 24 }} label="كلمة المرور الحالية" />
                    <ProFormText hasFeedback name="new_password" rules={[{
                        required: true,
                        message: 'كلمة المرور الجديدة ضروري منها'
                    }]} colProps={{ xs: 24, md: 12 }} label="كلمة المرور الجديدة" />
                    <ProFormText name="confirm_password" rules={[
                        {
                            required: true,
                            message: 'تأكيد كلمة المرور الجديدة ضروري منه'
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (!value || getFieldValue('new_password') === value) {
                                return Promise.resolve();
                              }
                              return Promise.reject(new Error('كلمة المرور وتأكيدها غير متطابقين!'));
                            }
                        })
                    ]} dependencies={['new_password']}
                    hasFeedback colProps={{ xs: 24, md: 12 }} label="تأكيد كلمة المرور" />
                </ProForm>
            </ProCard>
        </ProCard>
        </PageContainer>
    </>
}

export default Me;