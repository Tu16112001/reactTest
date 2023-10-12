import { Button, Col, Row } from 'antd';
import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();
  const handleOnClick = () => {
    navigate('/');
  };
  return (
    <Row>
      <Col md={7}></Col>
      <Col md={10}>
        <h2>This Page Is not Available</h2>
        <h4>
          The link may be broken, or the page may have been removed. Check to see if the link you are trying to open is
          correct.
        </h4>
        <Button type="primary" onClick={handleOnClick}>
          Go to home page
        </Button>
      </Col>
      <Col md={7}></Col>
    </Row>
  );
}

export default NotFound;
