import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { BuildOutlined } from '@ant-design/icons';
import { message, Button } from 'antd';
import { history } from 'umi';
import Main from './Main';

const SettingsPage: React.FC = () => {
    const [activeKey, setActiveKey] = useState<'main'|'cities'>('main')

    const onClick = () => updateFromSource().then(() => {
      message.success('تم تحديث المدن بنجاح، حدث الجدول يا بردر!')
    }).catch(() => {
      message.error('شكله في موضوع غلط، ماتحدثوش المدن، كان موضوعك مستعجل حدث يدوي!!')
    })

    return (
        <PageContainer
            onBack={history.back}
            title="إعدادات النظام"
            content="إعدادات عامة للتحكم بالنظام"
            tabActiveKey={activeKey}
            onTabChange={setActiveKey}
            extra={activeKey === 'cities' ? <Button onClick={onClick} icon={<BuildOutlined />} type="primary">تحديث المدن (كويك ديليفري)</Button> : null}
            tabList={[
                {
                  tab: 'عام',
                  key: 'main',
                },
                {
                  tab: 'المدن',
                  key: 'cities',
                },
              ]}
        >
            {activeKey === 'main' ? <Main /> : null}
        </PageContainer>
    )
}

export default SettingsPage;