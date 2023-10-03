import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={<div>Made with ❤️ <a href="https://rhuma.net"target="_blank">Ahmed Rhuma</a> ©{currentYear}</div>}

    />
  );
};

export default Footer;
