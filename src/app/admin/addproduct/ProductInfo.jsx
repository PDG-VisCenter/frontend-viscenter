import { brands, categoriesAndSubcategories, materials, shapes } from '@/data/searchFilters';
import { Cascader, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useSelector } from 'react-redux';

function ProductInfo({ onProductDataChange }) {
  const productData = useSelector((state) => state.addProduct);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onProductDataChange({ [name]: value });
  };

  return (
    <Form
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      layout='vertical'
      style={{
        paddingTop: 25,
        paddingLeft: 40,
        paddingRight: 40,
      }}
    >
      <Form.Item
        label='Nombre'
        required
      >
        <Input
          name='name'
          value={productData.name}
          onChange={handleInputChange}
          size='large'
        />
      </Form.Item>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label='Precio'
            required
          >
            <InputNumber
              type='number'
              name='price'
              addonAfter='Bs'
              value={productData.price}
              min={0}
              step={1}
              onChange={(value) => onProductDataChange({ price: value })}
              size='large'
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name='brand'
            label='Marca'
            initialValue={productData.brand}
            required
          >
            <Select
              placeholder='Elige una marca'
              size='large'
              onChange={(value) => onProductDataChange({ brand: value })}
              options={brands}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name='category'
            label='Categoria y Subcategoria'
            initialValue={productData.category}
            required
          >
            <Cascader
              placeholder='Elige una categoria y subcategoria'
              size='large'
              onChange={(value) => onProductDataChange({ category: value })}
              options={categoriesAndSubcategories}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name='shape'
            label='Forma'
            initialValue={productData.shape}
            required
          >
            <Select
              placeholder='Elige una forma'
              size='large'
              onChange={(value) => onProductDataChange({ shape: value })}
              options={shapes}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name='material'
            label='Material'
            initialValue={productData.material}
            required
          >
            <Select
              placeholder='Elige un material'
              size='large'
              onChange={(value) => onProductDataChange({ material: value })}
              options={materials}
            />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item label='Descripcion'>
        <TextArea
          name='description'
          rows={4}
          onChange={handleInputChange}
          value={productData.description}
        />
      </Form.Item>
    </Form>
  );
}

export default ProductInfo;
