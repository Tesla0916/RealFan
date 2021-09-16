import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import React from 'react';
import styles from './index.less';

// Layout组件这里，react的props需要用any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BasicLayout: React.FC = (props: React.PropsWithChildren<any>) => {
  return (
    <ConfigProvider locale={zhCN}>
      <div className={styles.normal}>
        this is layout
        {props.children}
      </div>
    </ConfigProvider>

  );
};

export default BasicLayout;
