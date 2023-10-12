import { Button, Checkbox, Col, Divider, Form, Input, InputNumber, Modal, Row, Select, Upload } from 'antd';
import { useEffect, useState } from 'react';

import { ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import useAxios from '../../utils/useAxios';
import { API_CATEGORY, API_PRODUCT, deteleProductImage } from '../../services/Constant';

function AddProduct() {
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const productId = useParams();
  const [form] = Form.useForm();
  const api = useAxios();

  useEffect(() => {
    if (productId.id) {
      const fectchApi = async () => {
        try {
          const response = await api.get(API_PRODUCT + '/' + productId.id);
          form.setFieldsValue({
            id: productId.id,
            name: response.data.name,
            price: response.data.price,
            discount: response.data.discount,
            status: response.data.status,
            quantity: response.data.quantity,
            description: response.data.description,
            categoryId: response.data.categoryId,
            isFeatured: response.data.isFeatured,
            image: null,
          });
        } catch (error) {
          console.log(error);
        }
      };
      fectchApi();
    }
    const loadData = async () => {
      try {
        const responseCategories = await api.get(API_CATEGORY);
        setCategories(responseCategories.data);

      } catch (error) {
        console.log(error);
      }
    };
    loadData();
  }, []);

  const handleImageRemoved = async (info) => {
    console.log('removed');

    if (info.fileName) {
      try {
        await api.delete(deteleProductImage(info.fileName));
      } catch (error) {
        console.log(error);
      }
    } else if (info.response && info.response.filename) {
      try {
        await api.delete(deteleProductImage(info.response.filename));
      } catch (error) {
        console.log(error);
      }
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    if (e.fileList.length > 1) {
      return [e.fileList[0]];
    }

    return e && e.fileList;
  };

  const onSubmitForm = (formValue) => {
    console.log(formValue);
    if (formValue.image !== null) {
      formValue = {
        ...formValue,
        image: formValue.image[0].response,
      };
      console.log(formValue);
    }
    if (!productId.id) {
      api
        .post(API_PRODUCT, formValue)
        .then((res) => {
          console.log(res);
          form.setFieldsValue({
            name: '',
            price: '',
            discount: '',
            description: '',
            image: null,
            featured: false,
          });
          Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            title: 'OK',
            content: 'Add Product success',
            onOk: () => navigate('/products/list'),
            cancelText: 'Continue Add Product?',
            okText: 'List Products',
          });
        })
        .catch((res) => {
          if (res.response?.status === 403) {
            setError('You are not admin, you do not have permission!');
          } else {
            setError(res.response.data.message);
          }
        });
    } else {
      api
        .patch(API_PRODUCT + '/' + productId.id, formValue)
        .then((res) => {
          console.log(res);
          Modal.success({
            title: 'OK',
            content: 'Edit Product success',
            onOk: () => navigate('/products/list'),
            okText: 'List Products',
          });
        })
        .catch((res) => {
          if (res.response?.status === 403) {
            setError('You are not admin, you do not have permission!');
          } else {
            setError(res.response.data.message);
          }
        });
    }
  };
  return (
    <div>
      <h1>{productId.id ? 'Update Products' : 'Add Products'}</h1>
      <Divider></Divider>
      <Form form={form} layout="vertical" className="form" onFinish={onSubmitForm} key={productId.id}>
        <Row>
          <Col md={12}>
            <Col md={18}>
              {productId.id && (
                <Form.Item label="Product ID" name="id">
                  <Input readOnly />
                </Form.Item>
              )}

              <Form.Item label="Name" name="name" rules={[{ required: true, min: 2 }]}>
                <Input />
              </Form.Item>

              <Form.Item
                label="Price"
                name="price"
                rules={[
                  { required: true, message: 'This field is required!' },
                  {
                    type: 'number',
                    message: 'Please input number!',
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/$\s?|(,*)/g, '')}
                  style={{ width: '100%' }}
                  addonAfter={'$'}
                ></InputNumber>
              </Form.Item>

              <Form.Item
                label="Quantity"
                name="quantity"
                rules={[
                  { required: true, message: 'This field is required!' },
                  {
                    type: 'number',
                    message: 'Please input number!',
                  },
                ]}
              >
              <InputNumber
              style={{ width: '100%' }}
                ></InputNumber>
              </Form.Item>

              <Form.Item
                label="Discount"
                name="discount"
                rules={[
                  { required: true, message: 'This field is required!' },
                  {
                    type: 'number',
                    message: 'Please input number!',
                  },
                ]}
              >
                <InputNumber
                  min={0}
                  max={100}
                  formatter={(value) => `${value}`}
                  parser={(value) => value.replace('%', '')}
                  style={{ width: '100%' }}
                  addonAfter={'%'}
                ></InputNumber>
              </Form.Item>

              <Form.Item label="Featured" name="isFeatured" valuePropName="checked">
                <Checkbox style={{ marginRight: 8 }}>Click here!</Checkbox>
              </Form.Item>


            </Col>
          </Col>
          <Col md={1}>
            <Divider type="vertical" style={{ height: '100%' }}></Divider>
          </Col>
          <Col md={11}>
            <Col md={18}>
            <Form.Item label="Status" name="status" rules={[{ required: true }]}>
                <Select placeholder="Select product status">
                  <Select.Option value="0">In Stock</Select.Option>
                  <Select.Option value="1">Out Of Stock</Select.Option>
                  <Select.Option value="2">Discontinue</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="Category" name="categoryId" rules={[{ required: true }]}>
                <Select placeholder="Select Category">
                  {categories &&
                    categories.map((item) => (
                      <Select.Option value={item.id} key={item.id}>
                        {item.name}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Main Image"
                name="image"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={[{ required: productId.id ? false : true }]}
              >
                <Upload
                  listType="picture"
                  accept=".jpg,.png,.gif"
                  maxCount={1}
                  onRemove={handleImageRemoved}
                  action={API_PRODUCT + '/images'}
                >
                  <Button icon={<UploadOutlined />}></Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col md={24}>
              <Form.Item label="Description" name="description">
                <ReactQuill theme="snow"></ReactQuill>
              </Form.Item>
            </Col>
            <span style={{ color: 'red' }}>{error}</span>
            <Divider></Divider>
            <Col md={18}>
              <Button htmlType="submit" type="primary" style={{ float: 'left' }}>
                Submit
              </Button>
            </Col>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default AddProduct;
