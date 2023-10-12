import {
  TagsOutlined,
  UserOutlined,
  HomeOutlined,
  CodeOutlined,
  FileAddOutlined,
  UnorderedListOutlined,
  LaptopOutlined,
  ShoppingOutlined,
  // UserAddOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Avatar, Col, Layout, Menu, Modal, Row, theme } from 'antd';
import { Outlet, Route, Routes, useNavigate } from 'react-router-dom';
import AddOrEditCategory from '../components/categories/AddOrEdit';
import Categorieslist from '../components/categories/List';
import HomePage from '../components/home/home';
import AddProduct from '../components/product/AddProduct';
import ListProduct from '../components/product/ListProduct';
import PrivateRoute from '../utils/PrivateRoute';
import './DashboardPage.css';
import Login from './Login';
import Unauthorized from './Unauthorized';
import NotFound from './NotFound';
import OrderList from '../components/Order/OrderList';
import EditOrder from '../components/Order/EditOrder';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import ListPlayer from '../components/players/ListPlayers';
import AddPlayer from '../components/players/AddOrEditPlayers';

const { Header, Content, Footer, Sider } = Layout;

function DasboardPage() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();

  const { login, setLogin, authTokens, setAuthTokens } = useContext(AuthContext);

  const logOut = () => {
    setLogin(false);
    localStorage.removeItem('user');
    setAuthTokens(null);
    navigate('/login');
  };

  const openLogOutModal = () => {
    const message = 'Are you sure loged out?';

    Modal.confirm({
      title: 'Confirm',
      onOk: () => logOut(),
      okText: 'Log out',
      cancelText: 'Cancel',
      content: message,
    });
  };

  return (
    <Layout>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="logo">
          <h2>ShopRuner</h2>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          //defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <HomeOutlined />,
              label: 'Home',
              onClick: () => navigate('/'),
            },
            {
              key: '2',
              icon: <CodeOutlined />,
              label: 'Categories',
              children: [
                {
                  key: '21',
                  icon: <FileAddOutlined />,
                  label: 'Add or Edit Category',
                  onClick: () => navigate('/categorie/add'),
                },
                {
                  key: '22',
                  icon: <UnorderedListOutlined />,
                  label: 'Categories List',
                  onClick: () => navigate('/categories/list'),
                },
              ],
            },
            {
              key: '3',
              icon: <LaptopOutlined />,
              label: 'Player',
              children: [
                {
                  key: '31',
                  icon: <FileAddOutlined />,
                  label: 'Add or Edit Product',
                  onClick: () => navigate('/player/add'),
                },
                {
                  key: '32',
                  icon: <UnorderedListOutlined />,
                  label: 'Player List',
                  onClick: () => navigate('/players/list'),
                },
              ],
            },
            {
              key: '4',
              icon: <LaptopOutlined />,
              label: 'Products',
              children: [
                {
                  key: '41',
                  icon: <FileAddOutlined />,
                  label: 'Add or Edit Product',
                  onClick: () => navigate('/product/add'),
                },
                {
                  key: '42',
                  icon: <UnorderedListOutlined />,
                  label: 'Products List',
                  onClick: () => navigate('/products/list'),
                },
              ],
            },
            {
              key: '5',
              icon: <ShoppingOutlined />,
              label: 'Orders',
              children: [
                {
                  key: '51',
                  icon: <FileAddOutlined />,
                  label: 'Order List',
                  onClick: () => navigate('/order/list'),
                },
              ],
            },
            // {
            //   key: '6',
            //   icon: <UserAddOutlined />,
            //   label: 'Accounts',
            // },
            {
              key: '7',
              icon: <LogoutOutlined />,
              label: 'Logout',
              onClick: () => openLogOutModal(),
            },
          ]}
        />
      </Sider>
      <Layout style={{ marginLeft: 200 }}>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <Row>
            <Col md={20}></Col>
            {login && (
              <Col md={4}>
                <Avatar size="default" icon={<UserOutlined />} />
                {authTokens?.email}
              </Col>
            )}
          </Row>
        </Header>
        <Content
          style={{
            margin: '24px 16px 0',
            minHeight: 280,
          }}
        >
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
            }}
          >
            <div className="content-panel">
              <Routes>
                <Route element={<PrivateRoute />}>
                  <Route path="/categories/list" element={<Categorieslist />}></Route>
                  <Route path="/categorie/add" element={<AddOrEditCategory />} key="a"></Route>
                  <Route path="/categorie/update/:id" element={<AddOrEditCategory />} key="u"></Route>
                  <Route path="/products/list" element={<ListProduct />}></Route>
                  <Route path="/product/add" element={<AddProduct />} key="a"></Route>
                  <Route path="/product/update/:id" element={<AddProduct />} key="u"></Route>
                  <Route path="/players/list" element={<ListPlayer />}></Route>
                  <Route path="/player/add" element={<AddPlayer />} key="a"></Route>
                  <Route path="/player/update/:id" element={<AddPlayer />} key="u"></Route>
                  <Route path="/order/list" element={<OrderList />}></Route>
                  <Route path="/order/update/:id" element={<EditOrder />}></Route>
                </Route>
                <Route path="/" element={<HomePage />} exact></Route>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/unauthorized" element={<Unauthorized />}></Route>
                <Route path="/*" element={<NotFound />}></Route>
              </Routes>
              <Outlet></Outlet>
            </div>
          </div>
        </Content>
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
         
        </Footer>
      </Layout>
    </Layout>
  );
}

export default DasboardPage;
