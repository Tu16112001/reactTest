import { Button, Col, Divider, Modal, Pagination, Row, Space, Table, Tag } from 'antd';
import Column from 'antd/es/table/Column';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { API_CATEGORY } from '../../services/Constant';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxios from '../../utils/useAxios';

function Categorieslist() {
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    size: 5,
    totalElements: 0,
    totalPages: 1,
  });
  const [page, setPage] = useState(0);
  const [render, setRender] = useState(false);
  const navigate = useNavigate();
  const api = useAxios();

  const onChange = (pageNumber, pageSize) => {
    console.log(pageNumber, pageSize);
    setPage(pageNumber - 1);
  };

  useEffect(() => {
    const fectchApi = async () => {
      try {
        const response = await api.get(API_CATEGORY + `/page?size=${pagination.size}&sort=id&page=${page}`);
        setCategories(response.data.content);
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
  }, [render || page]);

  const editCategory = (category) => {
    navigate('/categorie/update/' + category.id);
  };

  const deleteCategory = async (category) => {
    console.log(category);
    try {
      const response = await api.delete(API_CATEGORY + '/' + category.id);
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

  const openDeleteConfirmModal = (category) => {
    const message = 'Are you sure delete category ' + category.name;

    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      onOk: () => deleteCategory(category),
      okText: 'Delete',
      cancelText: 'Cancel',
      content: message,
    });
  };

  return (
    <>
      <h1>Categories List</h1>
      <Divider></Divider>

      <Row>
        <Col md={24}>
          <Table dataSource={categories} size="small" rowKey="id" pagination={false}>
            <Column title="Category Id" key="id" dataIndex="id" width={140} align="center"></Column>
            <Column title="Category Name" key="name" dataIndex="name"></Column>
            <Column
              title="Category Status"
              key="status"
              dataIndex="status"
              align="center"
              width={180}
              render={(_, { status }) => {
                let color = 'volcano';
                let name = 'In-visible';
                if (status === 'Visible') {
                  color = 'green';
                  name = 'Visible';
                }

                return <Tag color={color}>{name}</Tag>;
              }}
            ></Column>
            <Column
              title="Action"
              key="action"
              align="center"
              width={340}
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

export default Categorieslist;
