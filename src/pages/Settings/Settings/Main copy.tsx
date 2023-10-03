import React from 'react';
import { message } from 'antd';
import { changePassword } from '@/services/users';
import { ProCard, ProForm, ProFormText } from '@ant-design/pro-components'

const SettingsMainPage: React.FC = () => {
    const onFinish = async values => {
        return changePassword(values).then(() => {
            message.success('تم تغيير كلمة المرور بنجاح!')
        }).catch((e) => {
            console.log('error', e)
            message.error('خطأ، كلمة المرور الحالية غير صحيحة!')
        })
    }
    return (
        <ProCard  layout="center" ghost gutter={8} style={{ marginBlockStart: 8 }}>
            <ProCard boxShadow colSpan={{ xs: 24, sm: 24, md: 6, lg: 8, xl: 10 }} layout="center" title="تغير كلمة المرور">
                <ProForm grid onFinish={onFinish}>
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
    )
}

export default SettingsMainPage;