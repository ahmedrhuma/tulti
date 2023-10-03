import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { updateNotificationsSettings, getNotificationsSettings } from '@/services/system';
import { ProCard, ProForm, ProFormSwitch } from '@ant-design/pro-components'

const SettingsMainPage: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState({
        sales: false,
        reservations: false,
        patches: false,
        financials: false
    });

    useEffect(() => {
        getNotificationsSettings().then((d) => {
            setData(d);
        }).finally(() => setLoading(false));
    }, [])

    const onChange = (key, value) => {

        updateNotificationsSettings({ notifications: { [key]: value } }).then(res => {
            console.log(key, value, res)
            setData(res);
        }).catch(() => {
            message.error('خطأ في تعديل اعدادات الإشعارات يا مان!')
        })
    }
    return (
        <ProCard layout="center" ghost gutter={8} style={{ marginBlockStart: 8 }}>
            <ProCard loading={loading} boxShadow colSpan={{ xs: 24, sm: 24, md: 6, lg: 8, xl: 10 }} layout="center" title="إعدادات الإشعارات العامة">
                <ProForm submitter={false} grid>
                    <ProFormSwitch onChange={onChange?.bind(null, 'sales')} fieldProps={{ checked: data.sales }} name="sales" colProps={{ xs: 24, md: 12 }} label="المبيعات" />
                    <ProFormSwitch onChange={onChange?.bind(null, 'patches')} fieldProps={{ checked: data.patches }} name="patches" colProps={{ xs: 24, md: 12 }} label="الشحنات" />
                    <ProFormSwitch onChange={onChange?.bind(null, 'reservations')} fieldProps={{ checked: data.reservations }} name="reservations" colProps={{ xs: 24, md: 12 }} label="الحجوزات" />
                    <ProFormSwitch onChange={onChange?.bind(null, 'financials')} fieldProps={{ checked: data.financials }} name="financials" colProps={{ xs: 24, md: 12 }} label="المالية" />
                </ProForm>
            </ProCard>
        </ProCard>
    )
}

export default SettingsMainPage;