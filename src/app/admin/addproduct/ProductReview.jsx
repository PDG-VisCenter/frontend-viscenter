import { brands, categoriesAndSubcategories, colors } from '@/data/searchFilters';
import { Descriptions } from 'antd';
import Title from 'antd/es/typography/Title';
import { useSelector } from 'react-redux';

function getCategoryAndSubcategoryLabel(categoryArray) {
  if (categoryArray == null) return '';

  const category = categoriesAndSubcategories.find((cat) => cat.value === categoryArray[0]);
  const subcategory = category.children.find((sub) => sub.value === categoryArray[1]);

  return `${category.label} / ${subcategory.label}`;
}

function getBrandLabel(brandId) {
  if (brandId == null) return '';
  const brand = brands.find((brand) => brand.value === brandId);
  return brand.label;
}

function getColorLabelByValue(colorId) {
  const color = colors.find((c) => c.value === colorId);
  return color ? color.label : '';
}

function ProductReview() {
  const productData = useSelector((state) => state.addProduct);
  const productItemsData = useSelector((state) => state.addProductItem.addProductItems);
  console.log(productItemsData);

  const productDetailsItems = [
    {
      label: 'Nombre',
      children: `${productData.name || ''}`,
    },
    {
      label: 'Precio',
      children: `Bs. ${productData.price || '0'}`,
    },
    {
      label: 'Marca',
      children: getBrandLabel(productData.brand),
    },
    {
      label: 'Categoria',
      children: getCategoryAndSubcategoryLabel(productData.category),
    },
    {
      label: 'Forma',
      children: `${productData.shape || ''}`,
    },
    {
      label: 'Material',
      children: `${productData.material || ''}`,
    },
    {
      label: 'Colores/Items',
      children: (
        <>
          {productItemsData.map((item) => (
            <div key={item.id}>{getColorLabelByValue(item.color)}</div>
          ))}
          <br />
          Database version: 3.4
          <br />
          Package: dds.mongo.mid
        </>
      ),
    },
    {
      label: 'Descripción',
      children: `${productData.description || ''}`,
    },
  ];

  return (
    <div>
      <Title
        level={3}
        style={{
          marginTop: 30,
          marginBottom: 20,
        }}
      >
        Detalles del Producto
      </Title>
      <Descriptions
        bordered
        column={{
          xs: 1,
          sm: 1,
          md: 1,
          lg: 1,
          xl: 1,
          xxl: 1,
        }}
        items={productDetailsItems}
        style={{
          marginLeft: 300,
          marginRight: 300,
          marginBottom: 20,
        }}
      />
    </div>
  );
}

export default ProductReview;
