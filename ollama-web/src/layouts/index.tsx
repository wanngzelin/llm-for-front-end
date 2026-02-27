import { Outlet, useLocation, Helmet, useRouteProps, history } from 'umi';
import { Layout as AntdLayout, Button, Menu } from 'antd';
import { MessageOutlined, SettingOutlined } from '@ant-design/icons';

const { Sider, Content } = AntdLayout;

export default function Layout() {
  const location = useLocation();
  const { meta } = useRouteProps();
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

  const menuClick = (info: { key: string; keyPath: string[]; }) => {
    history.push(info.key)
  }

  return (
    <>
      <Helmet>
        <title>{meta?.title}</title>
      </Helmet>
      <AntdLayout className='h-full'>
        <Sider
          theme="light"
          className="shadow-md"
        >
          <div className="h-16 text-lg font-bold text-slate-900 bg-gray-50 display-center">Ollama Web</div>
          <Menu
            onClick={menuClick}
            mode="inline"
            selectedKeys={[currentPath]}
            items={menuItems}
            className="border-none h-[calc(100% - 64px)]"
          />
        </Sider>
        <Content className="p-4 m-0 min-h-screen bg-gray-50">
          <Outlet />
        </Content>
      </AntdLayout>
    </>
  );
}