import { Outlet, useLocation, Helmet, useRouteProps } from 'umi';
import { Layout as AntdLayout, Menu } from 'antd';
import { MessageOutlined, SettingOutlined } from '@ant-design/icons';
import './index.less';

const { Sider, Content } = AntdLayout;

export default function Layout() {
  const location = useLocation();
  const { meta } = useRouteProps();
  console.log('meta', meta)
  const currentPath = location.pathname;

  const menuItems = [
    {
      key: '/',
      icon: <MessageOutlined />,
      label: '对话',
    },
    {
      key: '/model',
      icon: <SettingOutlined />,
      label: '模型管理',
    },
  ];

  return (
    <>
      <Helmet>
        <title>{meta?.title}</title>
      </Helmet>
      <AntdLayout className='container'>
        <Sider theme="light" className="sider">
          <div className="logo">Ollama Web</div>
          <Menu
            mode="inline"
            selectedKeys={[currentPath]}
            items={menuItems}
            className="nav-menu"
          />
        </Sider>
        <Content className="content">
          <Outlet />
        </Content>
      </AntdLayout>
    </>
  );
}