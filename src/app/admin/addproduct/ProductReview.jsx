import { Descriptions } from 'antd';
import Title from 'antd/es/typography/Title';

const productDetailsItems = [
  {
    label: 'Nombre',
    children: 'Cloud Database',
  },
  {
    label: 'Precio',
    children: 'Prepaid',
  },
  {
    label: 'Marca',
    children: '18:00:00',
  },
  {
    label: 'Categoria',
    children: '$80.00',
  },
  {
    label: 'Forma',
    children: '$20.00',
  },
  {
    label: 'Material',
    children: '$60.00',
  },
  {
    label: 'Colores',
    children: (
      <>
        Data disk type: MongoDB
        <br />
        Database version: 3.4
        <br />
        Package: dds.mongo.mid
      </>
    ),
  },
  {
    label: 'Descripción',
    children: (
      <>
        Data disk type: MongoDB
        <br />
        Database version: 3.4
        <br />
        Package: dds.mongo.mid
      </>
    ),
  },
];

function ProductReview() {
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
