import { Button, Col, Divider, Form, Image, Input, Modal, Pagination, Row, Space, Table } from 'antd';
import Column from 'antd/es/table/Column';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { API_PRODUCT, getProductImageUrl } from '../../services/Constant';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxios from '../../utils/useAxios';

function ListProduct() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
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
  const api = useAxios();

  const onInput = (e) => {
    setQuery(e.target.value);
  };
  useEffect(() => {
    const fectchApi = async () => {
      try {
        const response = await api.get(
          API_PRODUCT + `/find?query=${query}&size=${pagination.size}&sort=id&page=${page}`,
        );
        console.log(response)
        setProducts(response.data.content);
        console.log(getProductImageUrl(response.data.content[1].image));
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
  }, [render || page || query]);

  const editCategory = (product) => {
    navigate('/product/update/' + product.id);
  };

  const deleteCategory = async (product) => {
    console.log(product);
    try {
      const response = await api.delete(API_PRODUCT + '/' + product.id);
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

  const openDeleteConfirmModal = (product) => {
    const message = 'Are you sure delete product ' + product.name;

    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      onOk: () => deleteCategory(product),
      okText: 'Delete',
      cancelText: 'Cancel',
      content: message,
    });
  };

  return (
    <>
      <h1>List Products</h1>
      <Divider></Divider>
      <Col md={6}>
        <Form.Item label="Product Search">
          <Input placeholder="Product Search" onChange={(e) => onInput(e)}></Input>
        </Form.Item>
      </Col>
      <Divider></Divider>
      <Row>
        <Col md={24}>
          <Table dataSource={products} size="small" rowKey="id" pagination={false}>
            <Column title="Category Id" key="id" dataIndex="id" width={120} align="center"></Column>
            <Column
              title="Image"
              key="image"
              dataIndex="image"
              width={140}
              align="center"
              render={(_, record) => (
                <Space size="middle">
                  <Image width={80} height={80} src={getProductImageUrl(record.image)}></Image>
                </Space>
              )}
            ></Column>
            <Column title="Name" key="name" dataIndex="price"></Column>
            <Column title="Price" key="price" dataIndex="price" width={120}></Column>
            <Column title="Quantity" key="quantity" dataIndex="description" width={120}></Column>
            <Column title="Discount" key="discount" dataIndex="rating" width={120}></Column>
            <Column title="Category" key="categoryName" dataIndex="category" width={140}></Column>
            <Column title="Status" key="status" dataIndex="status" width={120}></Column>
            <Column
              title="Action"
              key="action"
              align="center"
              width={240}
              render={(_, record) => (
                <Space size="middle">
                  <Button key={record.key} type="primary" size="small" onClick={() => editCategory(record)}>
                    <EditOutlined style={{ marginRight: 4 }} />
                    Edit
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
    </>
  );
}

export default ListProduct;
