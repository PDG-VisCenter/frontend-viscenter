'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Select, Button, Upload, Spin, Typography, Row, Col, Card, ConfigProvider, Rate } from 'antd';
import { UploadOutlined, CameraOutlined, FileImageOutlined, RedoOutlined } from '@ant-design/icons';
import { FaceMesh } from '@mediapipe/face_mesh';
import { FaceLandmarker, DrawingUtils } from '@mediapipe/tasks-vision';
import * as cam from '@mediapipe/camera_utils';
import Webcam from 'react-webcam';
import axios from 'axios';
import Image from 'next/image';
import marcos from '../../assets/img/citas/marcosLentes.jpg';
import FaceShapeInfoPage from '../components/FaceShapeInfoPage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Modal } from 'antd';
import { createStyles } from 'antd-style';

const { Title, Paragraph } = Typography;
const { Option } = Select;

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

function FaceLandmarkerComponent() {
  const { styles } = useStyle();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [camera, setCamera] = useState(null);
  const [faceMesh, setFaceMesh] = useState(null);
  const [faceShape, setFaceShape] = useState('');
  const [loading, setLoading] = useState(false);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, size: 10, total: 0 });
  const [showInfoPage, setShowInfoPage] = useState(true);
  const [filters, setFilters] = useState({
    averageRating: null,
    category: null,
    brand: null,
    material: null,
    color: null,
  });

  const faceShapeInfo = {
    Oval: {
      translation: 'Ovalado',
      description:
        'El rostro ovalado tiene proporciones equilibradas, con la frente ligeramente más ancha que la mandíbula.',
      recommendedFrame: 'Rectangular',
      info: 'Los marcos rectangulares ayudan a mantener el equilibrio de las proporciones naturales del rostro ovalado.',
    },
    Round: {
      translation: 'Redondo',
      description: 'El rostro redondo tiene mejillas llenas y una línea de mandíbula suave.',
      recommendedFrame: 'Cuadrado',
      info: 'Los marcos cuadrados o angulares añaden definición y contraste al rostro redondo.',
    },
    Square: {
      translation: 'Cuadrado',
      description: 'El rostro cuadrado tiene una mandíbula prominente y frente ancha.',
      recommendedFrame: 'Redondo',
      info: 'Los marcos redondos suavizan las líneas angulares y proporcionan equilibrio al rostro cuadrado.',
    },
    Heart: {
      translation: 'Corazón',
      description: 'El rostro en forma de corazón tiene una frente ancha y una mandíbula estrecha.',
      recommendedFrame: 'Ovalado',
      info: 'Los marcos ovalados equilibran las proporciones entre la frente y la mandíbula estrecha.',
    },
    Oblong: {
      translation: 'Alargado',
      description: 'El rostro alargado es más largo que ancho, con una barbilla prominente.',
      recommendedFrame: 'Cat-Eye',
      info: 'Los marcos estilo cat-eye añaden amplitud visual y acentúan las mejillas para equilibrar el rostro alargado.',
    },
    Unlabeled: {
      translation: 'No etiquetado',
      description: 'No se ha podido determinar un tipo de rostro claro.',
      recommendedFrame: 'Irregular',
      info: 'Los marcos irregulares son una opción versátil adecuada para cualquier tipo de rostro.',
    },
  };

  useEffect(() => {
    if (faceShape.recommendedFrame) {
      fetchRecommendedFrames(faceShape.recommendedFrame, pagination.page, pagination.size);
    }

    const faceMeshInstance = new FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMeshInstance.setOptions({
      maxNumFaces: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
    });

    faceMeshInstance.onResults(onResults);
    setFaceMesh(faceMeshInstance);

    if (cameraActive && webcamRef.current && webcamRef.current.video) {
      const newCamera = new cam.Camera(webcamRef.current.video, {
        onFrame: async () => {
          if (webcamRef.current && webcamRef.current.video) {
            await faceMesh.send({ image: webcamRef.current.video });
          }
        },
        width: 640,
        height: 480,
      });
      setCamera(newCamera);
      newCamera.start();
    } else if (camera) {
      camera.stop();
    }

    return () => {
      if (camera) {
        camera.stop();
      }
    };
  }, [cameraActive, pagination.page, faceShape.recommendedFrame]);

  const fetchRecommendedFrames = async (searchTerm, page, size) => {
    try {
      const response = await axios.get(`http://localhost:5203/api/Product/shape/${searchTerm}`);

      setProducts(response.data);
    } catch (error) {
      console.error('Error al obtener productos recomendados:', error.message);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const applyFilters = (products) => {
    return products.filter((product) => {
      const { averageRating, category, brand, material } = filters;
      return (
        (averageRating === null || product.averageRating === averageRating) &&
        (category === null || product.category === category) &&
        (brand === null || product.brand === brand) &&
        (material === null || product.material === material)
      );
    });
  };

  const handlePaginationChange = (page) => {
    setPagination((prev) => ({ ...prev, page }));
    fetchRecommendedFrames(faceShape.recommendedFrame, page, pagination.size);
  };

  function onResults(results) {
    if (webcamRef.current != null) {
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;
    } else {
      console.log('stoped');
    }

    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext('2d');
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

    if (results.multiFaceLandmarks) {
      const drawingUtils = new DrawingUtils(canvasCtx);
      results.multiFaceLandmarks.forEach((landmarks) => {
        drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_TESSELATION, {
          color: '#FFFFFF',
          lineWidth: 1,
        });
        drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE, { color: '#FF0000' });
        drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_EYE, { color: '#FF0000' });
        drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_FACE_OVAL, { color: '#FFFFFF' });
        drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LIPS, { color: '#FFFFFF' });
      });
    }
    canvasCtx.restore();
  }

  const handleStartCamera = () => {
    setCameraActive(true);
    setButtonsDisabled(true);
  };

  const handleStopCamera = () => {
    setCameraActive(false);
  };

  const handleUpload = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result);
      processImage(reader.result);
    };
    reader.readAsDataURL(file);
    setButtonsDisabled(true);
    return false;
  };

  const handleCaptureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setUploadedImage(imageSrc);
    processImage(imageSrc);
    handleStopCamera();
  };

  const processImage = (imageSrc) => {
    const img = document.createElement('img');
    img.src = imageSrc;
    img.onload = async () => {
      canvasRef.current.width = img.width;
      canvasRef.current.height = img.height;
      if (faceMesh) {
        await faceMesh.send({ image: img });
      }
      uploadImage(imageSrc);
    };
  };

  const uploadImage = async (imageSrc) => {
    setLoading(true);
    try {
      const imageBase64 = imageSrc.split(',')[1];
      const response = await axios({
        method: 'POST',
        url: 'https://classify.roboflow.com/face-shape-d4mv0/1',
        params: { api_key: process.env.NEXT_PUBLIC_FACE_SHAPE_MODEL_KEY },
        data: imageBase64,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      const { class: detectedFaceShape, confidence } = response.data.predictions[0];
      const faceShapeData = faceShapeInfo[detectedFaceShape] || faceShapeInfo['Unlabeled'];
      setFaceShape({
        shape: faceShapeData.translation,
        description: faceShapeData.description,
        recommendedFrame: faceShapeData.recommendedFrame,
        info: faceShapeData.info,
        confidence: (confidence * 100).toFixed(2) + '%',
      });

      fetchRecommendedFrames(faceShapeData.recommendedFrame, pagination.page, pagination.size);
    } catch (error) {
      console.error('Error al subir la imagen:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    window.location.reload();
  };

  const handleClearFilters = () => {
    setFilters({
      averageRating: null,
      category: null,
      brand: null,
      material: null,
      color: null,
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchRecommendedFrames(faceShape.recommendedFrame, 1, pagination.size);
  };

  const handleProceed = () => setShowInfoPage(false);

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
      <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', overflow: 'hidden' }}>
        <Header />
        {showInfoPage ? (
          <FaceShapeInfoPage onProceed={handleProceed} />
        ) : (
          <div
            className='site-layout-content'
            style={{ minHeight: 'calc(100vh - 64px)' }}
          >
            <Title
              level={2}
              style={{ textAlign: 'center', color: '#fe0034', fontSize: '32px', paddingTop: '4px' }}
            >
              Recomendación de Marcos de Lentes
            </Title>
            <Row gutter={16}>
              <Col
                span={24}
                md={12}
              >
                <Card>
                  {cameraActive && (
                    <div style={{ position: 'relative', width: '100%' }}>
                      <Webcam
                        ref={webcamRef}
                        screenshotFormat='image/jpeg'
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          borderRadius: '8px',
                          border: '2px solid red',
                        }}
                      />
                      <canvas
                        ref={canvasRef}
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '8px',
                          border: '2px solid red',
                        }}
                      />
                    </div>
                  )}
                  {uploadedImage && (
                    <canvas
                      ref={canvasRef}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '8px',
                        border: '2px solid red',
                      }}
                    />
                  )}
                </Card>
              </Col>
              <Col
                span={24}
                md={12}
              >
                <Card>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Button
                      type='primary'
                      icon={<CameraOutlined />}
                      onClick={handleStartCamera}
                      style={{ marginBottom: '16px' }}
                      disabled={buttonsDisabled || cameraActive}
                    >
                      Iniciar Cámara
                    </Button>

                    <Upload
                      customRequest={(options) => handleUpload(options.file)}
                      showUploadList={false}
                      accept='image/*'
                      disabled={buttonsDisabled}
                    >
                      <Button
                        icon={<UploadOutlined />}
                        disabled={cameraActive || buttonsDisabled}
                      >
                        Subir Imagen
                      </Button>
                    </Upload>

                    {cameraActive && (
                      <Button
                        type='primary'
                        icon={<FileImageOutlined />}
                        onClick={handleCaptureImage}
                        style={{ marginTop: '16px' }}
                      >
                        Capturar Imagen
                      </Button>
                    )}

                    {(uploadedImage || cameraActive) && (
                      <Button
                        icon={<RedoOutlined />}
                        onClick={handleReset}
                        style={{ marginTop: '16px' }}
                      >
                        Volver a Intentar
                      </Button>
                    )}
                  </div>
                  {loading ? (
                    <Spin style={{ marginTop: '16px' }} />
                  ) : (
                    faceShape && (
                      <>
                        <Paragraph style={{ marginTop: '16px', fontSize: '22px' }}>
                          Tipo de rostro detectado: <strong>{faceShape.shape}</strong>
                        </Paragraph>
                        <Paragraph style={{ fontSize: '22px' }}>Descripción: {faceShape.description}</Paragraph>
                        <Paragraph style={{ fontSize: '22px' }}>
                          Marco recomendado: <strong>{faceShape.recommendedFrame}</strong>
                        </Paragraph>
                        <Paragraph style={{ fontSize: '22px' }}>
                          Fiabilidad: <strong>{faceShape.confidence}</strong>
                        </Paragraph>
                        <Paragraph style={{ fontSize: '22px' }}>Motivo: {faceShape.info}</Paragraph>
                        <Row
                          gutter={16}
                          style={{ marginTop: '16px' }}
                        >
                          <Button
                            type='primary'
                            onClick={() => setIsModalVisible(true)}
                            style={{
                              fontSize: '18px',
                              height: '50px',
                              padding: '0 24px',
                            }}
                          >
                            Ver Productos Recomendados
                          </Button>
                        </Row>
                      </>
                    )
                  )}
                </Card>
              </Col>
            </Row>
          </div>
        )}
        <Modal
          title={
            <div style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center' }}>
              Productos Recomendados
            </div>
          }
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width='90%'
        >
          <Row
            gutter={[16, 16]}
            style={{ height: '100%' }}
          >
            {/* Columna de filtros */}
            <Col
              xs={24}
              sm={4}
              style={{
                padding: '16px',
                borderRight: '1px solid #d9d9d9',
                height: '100%',
                overflowY: 'auto',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                  marginTop: '16px',
                  padding: '10px',
                }}
              >
                <div style={{ marginBottom: '8px' }}>
                  <label style={{ fontWeight: 'bold', marginRight: '8px' }}>Rating:</label>
                  <Select
                    value={filters.averageRating}
                    onChange={(value) => handleFilterChange('averageRating', value)}
                    style={{ width: '100%' }}
                    placeholder='Seleccionar'
                  >
                    {[0, 1, 2, 3, 4, 5].map((rating) => (
                      <Option
                        key={rating}
                        value={rating}
                      >
                        {rating}
                      </Option>
                    ))}
                  </Select>
                </div>

                <div style={{ marginBottom: '8px' }}>
                  <label style={{ fontWeight: 'bold', marginRight: '8px' }}>Categoría:</label>
                  <Select
                    value={filters.category}
                    onChange={(value) => handleFilterChange('category', value)}
                    style={{ width: '100%' }}
                    placeholder='Seleccionar'
                  >
                    {[...new Set(products.map((product) => product.category))].map((category) => (
                      <Option
                        key={category}
                        value={category}
                      >
                        {category}
                      </Option>
                    ))}
                  </Select>
                </div>

                <div style={{ marginBottom: '8px' }}>
                  <label style={{ fontWeight: 'bold', marginRight: '8px' }}>Marca:</label>
                  <Select
                    value={filters.brand}
                    onChange={(value) => handleFilterChange('brand', value)}
                    style={{ width: '100%' }}
                    placeholder='Seleccionar'
                  >
                    {[...new Set(products.map((product) => product.brand))].map((brand) => (
                      <Option
                        key={brand}
                        value={brand}
                      >
                        {brand}
                      </Option>
                    ))}
                  </Select>
                </div>

                <div style={{ marginBottom: '8px' }}>
                  <label style={{ fontWeight: 'bold', marginRight: '8px' }}>Material:</label>
                  <Select
                    value={filters.material}
                    onChange={(value) => handleFilterChange('material', value)}
                    style={{ width: '100%' }}
                    placeholder='Seleccionar'
                  >
                    {[...new Set(products.map((product) => product.material))].map((material) => (
                      <Option
                        key={material}
                        value={material}
                      >
                        {material}
                      </Option>
                    ))}
                  </Select>
                </div>

                <Button
                  type='default'
                  onClick={handleClearFilters}
                  style={{ type: 'primary', marginTop: '16px', width: '100%' }}
                >
                  Limpiar Filtros
                </Button>
              </div>
            </Col>

            {/* Columna de productos */}
            <Col
              xs={24}
              sm={20}
              style={{
                padding: '16px',
                height: '100%',
                overflowY: 'auto',
              }}
            >
              <Row
                gutter={16}
                style={{ marginTop: '16px' }}
              >
                {applyFilters(products).map((product) => (
                  <Col
                    key={product.id}
                    xs={24}
                    sm={12}
                    md={8}
                    lg={6}
                  >
                    <Card
                      hoverable
                      style={{ marginTop: '16px' }}
                      cover={
                        <Image
                          alt={product.name}
                          src={product.image != null ? product.image : marcos}
                          height={200}
                          width={200}
                          style={{ objectFit: 'cover' }}
                        />
                      }
                      onClick={() => window.open(`products/${product.id}`, '_blank')}
                    >
                      <Card.Meta
                        title={product.name}
                        description={
                          <Rate
                            disabled
                            defaultValue={product.averageRating}
                          />
                        }
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Modal>

        <Footer />
      </div>
    </ConfigProvider>
  );
}

export default FaceLandmarkerComponent;
