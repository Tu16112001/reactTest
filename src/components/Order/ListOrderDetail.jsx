import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Col, Pagination, Row, Table } from 'antd';
import Column from 'antd/es/table/Column';
import useAxios from '../../utils/useAxios';
import { API_ORDER } from '../../services/Constant';

function ListOrderDetail({ orderId }) {
  const [OrderDetails, setOrderDetails] = useState([]);
  const [pagination, setPagination] = useState({
    size: 5,
    totalElements: 0,
    totalPages: 1,
  });
  const [page, setPage] = useState(0);
  const api = useAxios();

  const onChange = (pageNumber, pageSize) => {
    console.log(pageNumber, pageSize);
    setPage(pageNumber - 1);
  };

  useEffect(() => {
    const fectchApi = async () => {
      try {
        const response = await api.get(
          API_ORDER + `/page/order/` + orderId + `?size=${pagination.size}&sort=id&page=${page}`,
        );
        setPagination({
          ...pagination,
          totalElements: response.data.totalElements,
          totalPages: response.data.totalPages,
        });
        setOrderDetails(response.data.content);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    fectchApi();
  }, [page]);
  return (
    <Row>
      <Col md={20}>
        <Table dataSource={OrderDetails} size="small" rowKey="nameProduct" pagination={false}>
          <Column title="Product Name" key="nameProduct" dataIndex="nameProduct"></Column>
          <Column title="Price" key="price" dataIndex="price"></Column>
          <Column title="Quantity" key="quantity" dataIndex="quantity"></Column>
          <Column title="Total" key="subTotal" dataIndex="subTotal"></Column>
        </Table>
        <Row style={{ marginTop: 12, marginBottom: 10 }}>
          <Col>
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

ListOrderDetail.propTypes = {
  orderId: PropTypes.number,
};

export default ListOrderDetail;
