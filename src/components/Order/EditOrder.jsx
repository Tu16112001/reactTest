import { Button, Col, Divider, Form, Input, Modal, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { API_ORDER } from '../../services/Constant';
import useAxios from '../../utils/useAxios';

function EditOrder() {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const orderId = useParams();
  const [form] = Form.useForm();
  const api = useAxios();

  useEffect(() => {
    if (orderId.id) {
      console.log();
      const fectchApi = async () => {
        try {
          const response = await api.get(API_ORDER + '/' + orderId.id);
          form.setFieldsValue({
            id: orderId.id,
            customerName: response.data.customerName,
            address: response.data.address,
            phone: response.data.phone,
            email: response.data.email,
            invoicePayment: response.data.invoicePayment,
            invoiceStatus: response.data.invoiceStatus,
          });
        } catch (error) {
          console.log(error);
        }
      };

      fectchApi();
    }
  }, []);

  const onSubmitForm = (value) => {
    api
      .patch(API_ORDER + '/' + orderId.id, value)
      .then((res) => {
        console.log(res);
        Modal.success({
          title: 'OK',
          content: 'Edit Order success',
          onOk: () => navigate('/order/list'),
          okText: 'List Orders',
        });
      })
      .catch((res) => {
        if (res.response?.status === 403) {
          setError('You are not admin, you do not have permission!');
        } else {
          setError(res.response.data.message);
        }
      });
  };
  return (
    <div>
      <h1>Update Orders</h1>
      <Divider></Divider>
      <Form form={form} layout="vertical" className="form" onFinish={onSubmitForm} key={orderId.id}>
        <Row>
          <Col md={10}>
            <Form.Item label="Id" name="id">
              <Input readOnly />
            </Form.Item>
            <Form.Item label="Customer Name" name="customerName" rules={[{ required: true, min: 5 }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Address" name="address" rules={[{ required: true, min: 5 }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Phone" name="phone" rules={[{ required: true, message: 'This field is required!' }]}>
              <Input />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'This field is required!' },
                {
                  type: 'email',
                  message: 'Email not valid!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Payment" name="invoicePayment" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="0">COD</Select.Option>
                <Select.Option value="1">Online</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Invoice Status" name="invoiceStatus" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="0">Success</Select.Option>
                <Select.Option value="1">Pending</Select.Option>
                <Select.Option value="2">Delivering</Select.Option>
              </Select>
            </Form.Item>
            <span style={{ color: 'red' }}>{error}</span>
            <Divider></Divider>
            <Button htmlType="submit" type="primary" style={{ float: 'right' }}>
              Submit
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default EditOrder;
