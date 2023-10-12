import { Button, Col, Row } from 'antd';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

function Unauthorized() {
  const { setLogin, setAuthTokens } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleOnClick = () => {
    localStorage.removeItem('admin');
    setLogin(false);
    localStorage.removeItem('admin');
    setAuthTokens(null);
    navigate('/login');
  };
  return (
    <Row>
      <Col md={7}></Col>
      <Col md={10}>
        <h2>Unauthorized</h2>
        <h4>You do not have access to the requested page.Click! Log out and try another account</h4>
        <Button type="primary" onClick={handleOnClick}>
          LogOut
        </Button>
      </Col>
      <Col md={7}></Col>
    </Row>
  );
}

export default Unauthorized;
