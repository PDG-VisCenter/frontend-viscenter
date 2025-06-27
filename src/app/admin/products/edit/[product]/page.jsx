'use client';

import { brands, categoriesAndSubcategories, materials, shapes } from '@/data/searchFilters';
import { Button, Empty, Form, InputNumber, message, Select, Skeleton, Space } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { addCartItem } from '@/lib/features/cartItemSlice';
import { fetchColorsByProduct } from '@/lib/features/colorsSlice';
import { fetchProductById, updateProduct } from '@/lib/features/productSlice';
import { fetchProductItemsByProduct } from '@/lib/features/productItemsSlice';
import Footer from '@/components/Footer';
import HeaderSimple from '@/components/HeaderSimple';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import TextArea from 'antd/es/input/TextArea';
import Title from 'antd/es/typography/Title';

function generatePath(category, subCategory = '') {
  const categoryPath = {
    'Marcos de lentes': 'eyeglasses',
    'Lentes de sol': 'sunglasses',
    Accesorios: 'accessories',
  };

  const subCategoryPath = {
    Hombres: 'men',
    Mujeres: 'women',
    Niños: 'kids',
    Extras: 'extras',
    Limpieza: 'cleaning',
  };

  const categorySlug = categoryPath[category] || '';
  const subCategorySlug = subCategoryPath[subCategory] || '';

  return `/${categorySlug}/${subCategorySlug}`;
}

function Product({ params }) {
  const [activeImage, setActiveImage] = useState(0);
  const [activeColorItem, setActiveColorItem] = useState(0);
  const dispatch = useDispatch();
  const router = useRouter();
  const productItem = useSelector((state) => state.product.product);
  const productSpecifications = useSelector((state) => state.productItems.productItems);
  const colorItems = useSelector((state) => state.colors.colors);
  const productStatus = useSelector((state) => state.product.status);
  const error = useSelector((state) => state.product.error);
  const { data: session, status } = useSession();
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchProductById(params.product));
    dispatch(fetchProductItemsByProduct(params.product));
    dispatch(fetchColorsByProduct(params.product));
  }, [dispatch, params.product]);

  useEffect(() => {
    form.setFieldsValue({
      name: productItem.name,
      salePrice: productItem.salePrice,
      description: productItem.description,
      brand: productItem.brand,
      shape: productItem.shape,
      material: productItem.material,
    });
  }, [productItem]);

  const handleSave = async () => {
    const values = form.getFieldsValue();
    console.log(values);

    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('originalPrice', values.salePrice);
    formData.append('description', values.description);
    formData.append('brandId', values.brand);
    formData.append('shape', values.shape);
    formData.append('material', values.material);

    try {
      await dispatch(updateProduct({ id: productItem.id, newProduct: formData })).unwrap();
      message.success('Producto actualizado correctamente');
    } catch (e) {
      console.error(e);
      message.error('Error al actualizar el producto');
    }
  };

  if (productStatus === 'loading') {
    return (
      <Skeleton.Node
        active
        style={{
          width: 160,
        }}
      />
    );
  }
  if (productStatus === 'failed') {
    return <div>{error}</div>;
  }

  return (
    <div>
      <HeaderSimple />
      <main className='pd-pg'>
        <section className='pd-pg__img--container'>
          <Title
            level={2}
            style={{ textAlign: 'center', marginBottom: 20 }}
          >
            Editar Producto
          </Title>
          {productSpecifications[activeColorItem]?.images &&
          productSpecifications[activeColorItem]?.images.length > 0 ? (
            <div className='pd-pg__img--wrapper'>
              <Image
                src={productSpecifications[activeColorItem]?.images[activeImage]}
                alt={`${productItem.name} front view`}
                className='pd-pg__active-img'
                width={800}
                height={500}
              />
              <div className='pd-pg__img-thumbs'>
                {productSpecifications[activeColorItem].images?.map((image, index) => (
                  <button
                    key={`${productSpecifications[activeColorItem]?.id}-${index}`}
                    className={`pd-pg__img-thumbnail--wrapper ${activeImage === index ? 'active' : ''}`}
                    type='button'
                    onClick={() => setActiveImage(index)}
                  >
                    <Image
                      src={image}
                      alt={`${productItem.name} thumbnail ${index + 1}`}
                      className='pd-pg__img-thumbnail'
                      width={80}
                      height={70}
                      style={{
                        objectFit: 'contain',
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <Empty description='No images available' />
            </div>
          )}
        </section>
        <section className='pd-pg__details--container'>
          <div className='pd-pg__code'>
            <p className='pd-pg__product-code'>Code: {productSpecifications[activeColorItem]?.productCode}</p>
          </div>
          <br />
          <div className='pd-pg__color--wrapper'>
            <span className=' pd-pg__opt-label pd-pg__color-label'>Stock: </span>
            <span className='pd-pg__color'>{productSpecifications[activeColorItem]?.stock}</span>
          </div>
          <br />
          {colorItems && colorItems.length > 0 && (
            <div className='pd-pg__color--wrapper'>
              <span className='pd-pg__opt-label pd-pg__color-label'>Color: </span>
              <span className='pd-pg__color'>{colorItems[activeColorItem]?.name}</span>
              <br />
              <br />
              {colorItems.map((color, index) => (
                <Button
                  key={color.id}
                  type='primary'
                  shape='circle'
                  style={{
                    backgroundColor: `${color.hexCode}`,
                    marginRight: '10px',
                  }}
                  onClick={() => setActiveColorItem(index)}
                />
              ))}
            </div>
          )}
          <br />
          <Form
            form={form}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            layout='vertical'
          >
            <Form.Item label='Nombre'>
              <TextArea
                name='nombre'
                value={productItem.name}
              />
            </Form.Item>
            <Form.Item label='Precio'>
              <InputNumber
                type='number'
                name='price'
                addonAfter='Bs'
                value={productItem.salePrice}
                min={0}
                step={1}
                size='large'
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Form.Item label='Descripcion'>
              <TextArea
                name='description'
                rows={4}
                value={productItem.description}
              />
            </Form.Item>
            <Form.Item
              name='brand'
              label='Marca'
              initialValue={productItem.brand}
              required
            >
              <Select
                placeholder='Elige una marca'
                size='large'
                options={brands}
              />
            </Form.Item>
            <Form.Item
              name='shape'
              label='Forma'
              initialValue={productItem.shape}
              required
            >
              <Select
                placeholder='Elige una forma'
                size='large'
                options={shapes}
              />
            </Form.Item>
            <Form.Item
              name='material'
              label='Material'
              initialValue={productItem.material}
              required
            >
              <Select
                placeholder='Elige un material'
                size='large'
                options={materials}
              />
            </Form.Item>
          </Form>
          <Space size={270}>
            <Button
              type='primary'
              color='cyan'
              variant='solid'
              size='large'
              onClick={handleSave}
            >
              Save
            </Button>
            <Button
              type='primary'
              size='large'
              danger
            >
              Cancel
            </Button>
          </Space>
        </section>
      </main>
      <br />
      <br />
      <Footer />
    </div>
  );
}

export default Product;
