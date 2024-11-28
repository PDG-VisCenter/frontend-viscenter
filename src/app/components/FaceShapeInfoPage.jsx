import React, { useState, useRef } from 'react';
import { Card, Typography, Divider, Modal, ConfigProvider, Carousel, Button, Row, Col } from 'antd';
import Image from 'next/image';
import { InfoCircleOutlined, EyeOutlined } from '@ant-design/icons';
import oval from '../../assets/img/recomendaciones/ovalShape.png';
import heart from '../../assets/img/recomendaciones/heartShape.png';
import oblong from '../../assets/img/recomendaciones/oblongShape.png';
import round from '../../assets/img/recomendaciones/roundShape.png';
import square from '../../assets/img/recomendaciones/squareShape.png';
import model from '../../assets/img/recomendaciones/trainedModel.png';
import Header from '../../components/Header';
import { createStyles } from 'antd-style';

const useStyle = createStyles(({ prefixCls, css }) => ({
  linearGradientButton: css`
    &.${prefixCls}-btn-primary:not([disabled]):not(.${prefixCls}-btn-dangerous) {
      border-width: 0;

      > span {
        position: relative;
      }

      &::before {
        content: '';
        background: linear-gradient(135deg, #fe0034, #6253e1, #04befe);
        position: absolute;
        inset: 0;
        opacity: 1;
        transition: all 0.3s;
        border-radius: inherit;
      }

      &:hover::before {
        opacity: 0;
      }
    }
  `,
}));

const FaceShapeInfoPage = ({ onProceed }) => {
  const [visibleModal, setVisibleModal] = useState(null);
  const [imageModal, setImageModal] = useState(null);
  const carouselRef = useRef(null);

  const { styles } = useStyle();
  const { Title, Paragraph, Text } = Typography;

  const faceShapeInfo = {
    Oval: {
      title: 'Ovalado',
      description: 'Una forma equilibrada, suave y alargada. Adecuado para la mayoría de los estilos de gafas.',
      detailedInfo:
        'El rostro ovalado tiene una estructura facial simétrica, que permite llevar casi cualquier estilo de gafas, especialmente aquellas que resaltan su equilibrio natural.',
      image: oval,
    },
    Round: {
      title: 'Redondo',
      description: 'Curvas suaves sin ángulos definidos. Las monturas angulares ayudan a resaltar el rostro.',
      detailedInfo:
        'Las características del rostro redondo incluyen mejillas completas y una barbilla más suave. Monturas angulares y más amplias ayudan a añadir definición y contraste.',
      image: round,
    },
    Square: {
      title: 'Cuadrado',
      description: 'Líneas fuertes y una mandíbula definida. Monturas redondeadas suavizan los ángulos.',
      detailedInfo:
        'Un rostro cuadrado se caracteriza por una mandíbula fuerte y frente ancha. Las gafas redondas o con bordes suaves ayudan a balancear la dureza de las líneas faciales.',
      image: square,
    },
    Heart: {
      title: 'Corazón',
      description:
        'Frente ancha y barbilla estrecha. Monturas que equilibren la parte inferior del rostro son ideales.',
      detailedInfo:
        'El rostro en forma de corazón presenta una frente más ancha y barbilla puntiaguda. Monturas que añaden anchura en la parte inferior logran un efecto de equilibrio.',
      image: heart,
    },
    Oblong: {
      title: 'Alargado',
      description: 'Forma alargada con frente alta. Las monturas profundas ayudan a acortar visualmente el rostro.',
      detailedInfo:
        'El rostro alargado tiene una estructura facial que se beneficia de monturas profundas y anchas, que crean un efecto visual más balanceado.',
      image: oblong,
    },
  };

  const showInfoModal = (key) => {
    setVisibleModal(key);
  };

  const showImageModal = (image) => {
    setImageModal(image);
  };

  return (
    <ConfigProvider
      button={{
        className: styles.linearGradientButton,
      }}
      theme={{
        token: {
          colorPrimary: '#fe0034',
          colorBgSolidHover: '#c8306c',
          colorText: '#000',
          colorTextSecondary: '#555',
          borderRadius: 4,
        },
      }}
    >
      <div style={{ backgroundColor: '#f0f2f5' }}>
        <Header />
        <Title level={2} style={{ textAlign: 'center', color: '#fe0034', paddingTop: '20px' }}>
          Tipos de Rostro y Recomendaciones
        </Title>
        <Paragraph style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto', fontSize: '16px' }}>
          Conozca su tipo de rostro y obtenga recomendaciones personalizadas de marcos de lentes para realzar sus
          características únicas.
        </Paragraph>
        <Divider />

        <Row gutter={[16, 16]} justify="center">
          {Object.entries(faceShapeInfo).map(([key, { title, description, detailedInfo, image }]) => (
            <Col span={8} key={key} lg={7}>
              <Card
                hoverable
                cover={
                  <Image
                    alt={title}
                    src={image}
                    layout='responsive'
                    width={800} // Ajusta el ancho deseado
                    height={600} // Ajusta la altura deseada
                    style={{ objectFit: 'cover' }}
                  />
                }
                style={{ borderRadius: '8px', overflow: 'hidden', textAlign: 'center' }}
                actions={[
                  <EyeOutlined key='view' onClick={() => showImageModal(image)} />,
                  <InfoCircleOutlined key='info' onClick={() => showInfoModal(key)} />,
                ]}
              >
                <Title level={4} style={{ textAlign: 'center' }}>
                  {title}
                </Title>
                <Paragraph style={{ textAlign: 'center' }}>{description}</Paragraph>
              </Card>

              {/* Modal for detailed info */}
              <Modal
                title={`${title} - Detalles`}
                open={visibleModal === key}
                onCancel={() => setVisibleModal(null)}
                footer={null}
              >
                <Paragraph>{detailedInfo}</Paragraph>
              </Modal>

              {/* Modal for image preview */}
              <Modal
                open={imageModal === image}
                onCancel={() => setImageModal(null)}
                footer={null}
                centered
              >
                <Image
                  src={image}
                  alt={title}
                  layout='responsive'
                  width={800}
                  height={600}
                />
              </Modal>
            </Col>
          ))}
        </Row>

        <Divider />

        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <Title level={3} style={{ color: '#fe0034' }}>
            Tecnología para Detección de Rostros
          </Title>
          <Paragraph style={{ maxWidth: '800px', margin: '0 auto', color: '#595959' }}>
            Usamos un modelo de redes neuronales convolucionales (CNN) que ha sido entrenado con más de{' '}
            <Text strong>10,000 imágenes</Text> para reconocer patrones de diferentes tipos de rostros.
          </Paragraph>
          <Image
            width={600}
            height={350}
            src={model}
            preview={false}
            style={{ marginTop: '20px' }}
            alt='Diagrama CNN'
          />
        </div>

        <Divider />

        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <Title level={3} style={{ color: '#fe0034' }}>
            Recomendaciones Estéticas de Gafas
          </Title>
          <Paragraph style={{ maxWidth: '800px', margin: '0 auto', color: '#595959' }}>
            Con esta herramienta, recibirá recomendaciones de estilos de gafas que mejor se adapten a su tipo de rostro.
            Esto le ayudará a elegir monturas que realcen sus características y mejoren su apariencia.
          </Paragraph>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px', paddingBottom: '50px' }}>
          <Button type='primary' size='large' onClick={onProceed}>
            Pasar a la herramienta de recomendación
          </Button>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default FaceShapeInfoPage;
