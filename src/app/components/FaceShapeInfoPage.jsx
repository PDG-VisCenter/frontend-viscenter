import React from 'react';
import { Row, Col, Card, Button, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const FaceShapeInfoPage = ({ onProceed }) => {
  const faceShapeInfo = {
    Oval: { title: "Ovalado", description: "Descripción ovalada...", image: "/path/to/oval-image.jpg" },
    Round: { title: "Redondo", description: "Descripción redonda...", image: "/path/to/round-image.jpg" },
    Square: { title: "Cuadrado", description: "Descripción cuadrada...", image: "/path/to/square-image.jpg" },
    Heart: { title: "Corazón", description: "Descripción corazón...", image: "/path/to/heart-image.jpg" },
    Oblong: { title: "Alargado", description: "Descripción alargado...", image: "/path/to/oblong-image.jpg" },
  };

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2} style={{ textAlign: 'center' }}>Tipos de Rostro</Title>
      <Row gutter={16}>
        {Object.entries(faceShapeInfo).map(([key, { title, description, image }]) => (
          <Col span={8} key={key}>
            <Card hoverable cover={<img alt={title} src={image} />}>
              <Title level={4}>{title}</Title>
              <Paragraph>{description}</Paragraph>
            </Card>
          </Col>
        ))}
      </Row>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Button type="primary" onClick={onProceed}>Pasar a la herramienta de recomendación</Button>
      </div>
    </div>
  );
};

export default FaceShapeInfoPage;
