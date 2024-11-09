import { brands, categoriesAndSubcategories, materials, shapes } from '@/data/searchFilters';
import { Cascader, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';

function ProductInfo() {
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
        <Input size='large' />
      </Form.Item>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label='Precio'
            required
          >
            <InputNumber
              addonAfter='Bs'
              size='large'
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name='brand'
            label='Marca'
            rules={[
              {
                required: true,
                message: 'Por favor, elige una marca',
              },
            ]}
          >
            <Select
              placeholder='Elige una marca'
              size='large'
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
            rules={[
              {
                required: true,
                message: 'Por favor, elige una categoria',
              },
            ]}
          >
            <Cascader
              placeholder='Elige una categoria y subcategoria'
              size='large'
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
            rules={[
              {
                message: 'Por favor, elige una forma',
              },
            ]}
          >
            <Select
              placeholder='Elige una forma'
              size='large'
              options={shapes}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name='material'
            label='Material'
            rules={[
              {
                required: true,
                message: 'Por favor, elige un material',
              },
            ]}
          >
            <Select
              placeholder='Elige un material'
              size='large'
              options={materials}
            />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item label='Descripcion'>
        <TextArea rows={4} />
      </Form.Item>
    </Form>
  );
}

export default ProductInfo;
