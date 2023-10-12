import { Button, Col, Divider, Form, Input, Row } from 'antd';
import axios from 'axios';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { API_LOGIN } from '../services/Constant';

function Login() {
  const [error, setError] = useState('');
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { setAuthTokens, setLogin, login } = useContext(AuthContext);
  const onSubmitForm = (value) => {
    axios
      .post(API_LOGIN, value)
      .then((res) => {
        const newValue = { ...res.data, email: value.email };
        form.setFieldsValue({
          email: '',
          password: '',
        });
        setError('');
        setLogin(true);
        setAuthTokens(newValue);
        localStorage.setItem('admin', JSON.stringify(newValue));
        localStorage.setItem('login', JSON.stringify(true));
        navigate('/');
      })
      .catch((err) => {
        console.log(err);
        if (!err?.response) {
          setError('No Server Response');
        } else if (err.response?.status === 400) {
          setError(err.response?.data.message);
        } else if (err.response?.status === 401) {
          setError('Wrong Password');
        } else {
          setError('Login Failed');
        }
      });
  };
  return (
    <Row>
      {!login ? (
        <React.Fragment>
          <Col md={9}></Col>
          <Col md={6}>
            <h2>Login</h2>
            <Divider></Divider>
            <Form form={form} layout="vertical" className="form" onFinish={onSubmitForm}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Email is required!' },
                  {
                    type: 'email',
                    message: 'Email not valid!',
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: 'Password is required!' },
                  { min: 5, message: 'Password must be at least 5 characters' },
                ]}
              >
                <Input type="password" />
              </Form.Item>
              <span style={{ color: 'red' }}>{error}</span>
              {/* <span style={{ color: 'red' }}>{error}</span> */}
              <Divider></Divider>
              <Button htmlType="submit" type="primary" style={{ float: 'right' }}>
                Submit
              </Button>
            </Form>
          </Col>
          <Col md={9}></Col>
        </React.Fragment>
      ) : (
        <h1>you are already logged in?</h1>
      )}
    </Row>
  );
}

export default Login;
