'use client';

import { addProduct, updateProduct } from '@/lib/features/productSlice';
import { addProductItem, fetchProductItemsByProduct } from '@/lib/features/productItemsSlice';
import { Button, Flex, Layout, message, Steps, theme } from 'antd';
import { fetchLastAddedProduct, setProductId } from '@/lib/features/addProductItemSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Content } from 'antd/es/layout/layout';
import HeaderSeller from '../components/HeaderSeller';
import ProductInfo from './ProductInfo';
import ProductReview from './ProductReview';
import ProductVariants from './ProductVariants';
import { setProduct } from '@/lib/features/addProductSlice';
import SiderMenuSeller from '../components/SiderMenuSeller';
import Title from 'antd/es/typography/Title';

function base64ToFile(base64String, fileName) {
  const regex = /^data:(.+);base64,/;
  const matches = base64String.match(regex);
  const mimeType = matches ? matches[1] : 'application/octet-stream';
  const base64Data = base64String.replace(regex, '');
  const byteCharacters = atob(base64Data);
  const byteArray = new Uint8Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteArray[i] = byteCharacters.charCodeAt(i);
  }

  const file = new File([byteArray], fileName, { type: mimeType });

  return file;
}

function AddProduct() {
  const dispatch = useDispatch();
  const product = new FormData();
  const productData = useSelector((state) => state.addProduct);
  const productItemsData = useSelector((state) => state.addProductItem.addProductItems);
  const productId = useSelector((state) => state.addProductItem.productId);
  const productSpecifications = useSelector((state) => state.productItems.productItems);
  const productItemsStatus = useSelector((state) => state.productItems.status);
  const [currentStep, setCurrentStep] = useState(0);
  const { token } = theme.useToken();

  useEffect(() => {
    if (productId) {
      const addProductItemPromises = productItemsData.map((item) => {
        const productItemFormData = new FormData();
        productItemFormData.append('productId', productId);
        productItemFormData.append('colorId', item.color);
        productItemFormData.append('productCode', item.productCode);
        productItemFormData.append('stock', item.stock);

        item.images.forEach((image) => {
          productItemFormData.append('fileImages', base64ToFile(image.url, image.name));
        });

        return dispatch(addProductItem(productItemFormData))
          .unwrap()
          .catch((error) => {
            message.error('Error al guardar el item. Intenta de nuevo');
            throw new Error('Error saving product item:', error);
          });
      });

      Promise.all(addProductItemPromises).then(() => {
        dispatch(fetchProductItemsByProduct(productId));
      });
    }
  }, [dispatch, productId]);

  useEffect(() => {
    if (productItemsStatus === 'success') {
      const updateProductItem = async () => {
        try {
          const aux = new FormData();
          aux.append('stripeId', '');
          aux.append('categoryId', 4);
          aux.append('brandId', 1);
          aux.append('name', '');
          aux.append('shape', '');
          aux.append('material', '');
          aux.append('description', '');
          aux.append('originalPrice', 0);
          aux.append('image', productSpecifications[0].images[0]);
          await dispatch(updateProduct({ id: productId, newProduct: aux })).unwrap();
          message.success('Variantes guardadas correctamente');
        } catch (error) {
          throw new Error('Error updating product:', error);
        }
      };

      updateProductItem();
    }
  }, [productItemsStatus, dispatch]);

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

  const handleSubmit = async () => {
    product.append('stripeId', productData.stripeId);
    product.append('categoryId', productData.category[1]);
    product.append('brandId', productData.brand);
    product.append('name', productData.name);
    product.append('shape', productData.shape);
    product.append('material', productData.material);
    product.append('description', productData.description);
    product.append('originalPrice', productData.price);

    try {
      await dispatch(addProduct(product)).unwrap();
    } catch (error) {
      message.error('Error al guardar el producto. Intenta de nuevo');
      throw new Error('Error saving product:', error);
    }

    try {
      const id = await dispatch(fetchLastAddedProduct()).unwrap();
      dispatch(setProductId(id));
    } catch (error) {
      throw new Error('Error fetching product ID:', error);
    }

    message.success('Producto guardado correctamente');
  };

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
                    onClick={handleSubmit}
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
