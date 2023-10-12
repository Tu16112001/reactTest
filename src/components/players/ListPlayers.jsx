import { Button, Col, Divider, Image, Modal, Pagination, Row, Space, Table } from 'antd';
import Column from 'antd/es/table/Column';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { API_PLAYER, getPlayerImageUrl } from '../../services/Constant';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxios from '../../utils/useAxios';

function ListPlayer() {
  const [players, setPlayers] = useState([]);
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

  useEffect(() => {
    const fectchApi = async () => {
      try {
        const response = await api.get(
          API_PLAYER + `/paged?size=${pagination.size}&sort=id&page=${page}`,
        );
        console.log(response)
        setPlayers(response.data.content);
        console.log(getPlayerImageUrl(response.data.content[1].image));
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

  const editCategory = (player) => {
    navigate('/player/update/' + player.id);
  };

  const deleteCategory = async (player) => {
    console.log(player);
    try {
      const response = await api.delete(API_PLAYER + '/' + player.id);
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

  const openDeleteConfirmModal = (player) => {
    const message = 'Are you sure delete player ' + player.name;

    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      onOk: () => deleteCategory(player),
      okText: 'Delete',
      cancelText: 'Cancel',
      content: message,
    });
  };

  return (
    <>
      <h1>List Players</h1>
      <Divider></Divider>
      <Row>
        <Col md={24}>
          <Table dataSource={players} size="small" rowKey="id" pagination={false}>
            <Column title="Id" key="id" dataIndex="id" width={60} align="center"></Column>
            <Column
              title="Image"
              key="image"
              dataIndex="image"
              width={140}
              align="center"
              render={(_, record) => (
                <Space size="middle">
                  <Image width={100} height={100} src={getPlayerImageUrl(record.image)}></Image>
                </Space>
              )}
            ></Column>
            <Column title="Name" key="name" dataIndex="name"></Column>
            <Column title="Position" key="position" dataIndex="position" width={120} align="center"></Column>
            <Column title="National" key="national" dataIndex="national" width={120} align="center"></Column>
            <Column title="Weight" key="weight" dataIndex="weight" width={100} align="center"></Column>
            <Column title="Number" key="number" dataIndex="number" width={60} align="center"></Column>
            <Column title="Height" key="height" dataIndex="height" width={100} align="center"></Column>
            <Column title="Date Of Birth" key="dateOfBirth" dataIndex="dateOfBirth" width={140} align="center"></Column>
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

export default ListPlayer;
