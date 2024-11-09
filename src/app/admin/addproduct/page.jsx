'use client';

import { Button, Flex, Layout, message, Steps, theme } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Content } from 'antd/es/layout/layout';
import HeaderSeller from '../components/HeaderSeller';
import ProductInfo from './ProductInfo';
import ProductReview from './ProductReview';
import ProductVariants from './ProductVariants';
import { setProduct } from '@/lib/features/addProductSlice';
import SiderMenuSeller from '../components/SiderMenuSeller';
import Title from 'antd/es/typography/Title';
import { useState } from 'react';

function AddProduct() {
  const dispatch = useDispatch();
  const productData = useSelector((state) => state.product);
  const [currentStep, setCurrentStep] = useState(0);
  const { token } = theme.useToken();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const contentStyle = {
    lineHeight: '260px',
    textAlign: 'center',
    color: token.colorTextTertiary,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 24,
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleProductDataChange = (newData) => {
    dispatch(setProduct(newData));
  };

  const steps = [
    {
      title: 'Información del Producto',
      render: () => <ProductInfo onProductDataChange={handleProductDataChange} />,
    },
    {
      title: 'Variantes del Producto',
      render: () => <ProductVariants />,
    },
    {
      title: 'Revisión',
      render: () => <ProductReview />,
    },
  ];

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <HeaderSeller />
      <Layout>
        <SiderMenuSeller selectedItem='2' />
        <Content
          style={{
            margin: '8px 16px',
            overflow: 'auto',
            height: '88vh',
          }}
        >
          <div
            style={{
              padding: 32,
              minHeight: '88vh',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              overflow: 'auto',
            }}
          >
            <Title
              level={2}
              style={{ textAlign: 'center', marginBottom: 20 }}
            >
              Crear Producto
            </Title>
            <Steps
              current={currentStep}
              items={items}
            />
            <div style={contentStyle}>{steps[currentStep].render()}</div>
            <Flex
              justify='space-between'
              align='center'
              style={{
                marginTop: 20,
              }}
            >
              {currentStep > 0 && (
                <Button
                  size='large'
                  onClick={() => prevStep()}
                >
                  Anterior
                </Button>
              )}
              {currentStep < steps.length - 1 && (
                <Button
                  type='primary'
                  size='large'
                  onClick={() => nextStep()}
                  style={{ marginLeft: 'auto' }}
                >
                  Siguiente
                </Button>
              )}
              {currentStep === steps.length - 1 && (
                <div
                  style={{
                    width: '200px',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <Button
                    type='primary'
                    size='large'
                    danger
                  >
                    Cancelar
                  </Button>
                  <Button
                    type='primary'
                    size='large'
                    onClick={() => message.success('Processing complete!')}
                  >
                    Guardar
                  </Button>
                </div>
              )}
            </Flex>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default AddProduct;
