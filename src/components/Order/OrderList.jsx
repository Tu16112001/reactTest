import { Button, Col, Divider, Form, Input, Modal, Pagination, Row, Select, Space, Table } from 'antd';
import Column from 'antd/es/table/Column';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListOrderDetail from './ListOrderDetail';
import useAxios from '../../utils/useAxios';
import { API_ORDER } from '../../services/Constant';

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [query, setQuery] = useState('');
  const api = useAxios();
  const [invoiceStatus, setInvoiceStatus] = useState([0, 1, 2]);
  const [pagination, setPagination] = useState({
    size: 5,
    totalElements: 0,
    totalPages: 1,
  });
  const [page, setPage] = useState(0);
  const [render, setRender] = useState(false);
  const navigate = useNavigate();

  const onChange = (pageNumber, pageSize) => {
    console.log(pageNumber, pageSize);
    setPage(pageNumber - 1);
  };

  const onInput = (e) => {
    setQuery(e.target.value);
  };

  useEffect(() => {
    const fectchApi = async () => {
      try {
        const response = await api.get(
          API_ORDER + `/find?query=${query}&status=${invoiceStatus}&size=${pagination.size}&sort=id&page=${page}`,
        );
        setOrders(response.data.content);
        console.log(response);
        setPagination({
          ...pagination,
          totalElements: response.data.totalElements,
          totalPages: response.data.totalPages,
        });
      } catch (error) {
        console.log(error);
      }
    };
    fectchApi();
  }, [render, page, query, invoiceStatus]);

  const deleteOrder = async (order) => {
    console.log(order);
    try {
      const response = await api.delete(API_ORDER + '/' + order.id);
      console.log(response);
      setRender(!render);
    } catch (error) {
      if (error.response?.status === 403) {
        Modal.error({
          title: 'Error',
          okText: 'OK',
          content: 'You are not admin, you do not have permission!',
        });
      } else {
        Modal.error({
          title: 'Error deleting',
          content: error?.response?.data?.message,
          okText: 'OK',
        });
      }
    }
  };

  const editOrder = (order) => {
    navigate('/order/update/' + order.id);
  };

  const onSelect = (value) => {
    setInvoiceStatus(value);
  };

  const openDeleteConfirmModal = (order) => {
    const message = 'Are you sure delete order ' + order.name;

    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      onOk: () => deleteOrder(order),
      okText: 'Delete',
      cancelText: 'Cancel',
      content: message,
    });
  };

  const openOrderDetail = (order) => {
    Modal.info({
      title: 'Order Detail List',
      okText: 'Cancel',
      content: <ListOrderDetail orderId={order.id} />,
      width: 440,
    });
  };
  return (
    <Row>
      <h1>List Orders</h1>
      <Divider></Divider>
      <Col md={6}>
        <Form>
          <Form.Item label="Order Search">
            <Input placeholder="Input account user" onChange={(e) => onInput(e)}></Input>
          </Form.Item>
        </Form>
      </Col>
      <Col md={4} style={{ textAlign: 'left', marginLeft: 'auto' }}>
        <Form>
          <Form.Item label="Invoice Status" name="invoiceStatus" initialValue="All">
            <Select onChange={(e) => onSelect(e)}>
              <Select.Option value="0,1,2">All</Select.Option>
              <Select.Option value="0">Success</Select.Option>
              <Select.Option value="1">Pending</Select.Option>
              <Select.Option value="2">Delivering</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Col>
      <Divider></Divider>
      <Col md={24}>
        <Table dataSource={orders} size="small" rowKey="id" pagination={false}>
          <Column title="Id" key="id" dataIndex="id" width={50} align="center"></Column>
          <Column title="Customer Name" key="customerName" dataIndex="customerName" width={150} align="center"></Column>
          <Column title="Address" key="address" dataIndex="address" align="center"></Column>
          <Column title="Phone" key="phone" dataIndex="phone" width={140} align="center"></Column>
          <Column title="Email" key="email" dataIndex="email" width={160} align="center"></Column>
          <Column title="Payment" key="invoicePayment" dataIndex="invoicePayment" width={60} align="center"></Column>
          <Column
            title="Invoice Status"
            key="invoiceStatus"
            dataIndex="invoiceStatus"
            width={60}
            align="center"
            render={(_, { invoiceStatus }) => {
              let name = 'Pending';
              if (invoiceStatus === 0) {
                name = 'Success';
              }
              if (invoiceStatus === 2) {
                name = 'Delivering';
              }

              return <div>{name}</div>;
            }}
          ></Column>
          <Column title="User Name" key="accountName" dataIndex="accountName" width={200} align="center"></Column>
          <Column
            title="Action"
            key="action"
            align="center"
            width={240}
            render={(_, record) => (
              <Space size="middle">
                <Button key={record.key} type="primary" size="small" onClick={() => editOrder(record)}>
                  <EditOutlined style={{ marginRight: 4 }} />
                  Edit
                </Button>
                <Button key={record.key} type="primary" size="small" onClick={() => openOrderDetail(record)}>
                  Order Detail
                </Button>
                <Button
                  key={record.key}
                  type="primary"
                  danger
                  size="small"
                  onClick={() => openDeleteConfirmModal(record)}
                >
                  <DeleteOutlined style={{ marginRight: 4 }} />
                  Delete
                </Button>
              </Space>
            )}
          ></Column>
        </Table>
        <Row style={{ marginTop: 12 }}>
          <Col md={24} style={{ textAlign: 'right' }}>
            <Pagination
              defaultCurrent={0}
              defaultPageSize={pagination.size}
              total={pagination.totalElements}
              onChange={onChange}
            ></Pagination>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default OrderList;
