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

const { Title, Paragraph } = Typography;
const { Option } = Select;

function FaceLandmarkerComponent() {
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
    categoryName: null,
    brandName: null,
    material: null,
    color: null,
  });

  const faceShapeInfo = {
    Oval: {
      translation: 'Ovalado',
      description:
        'El rostro ovalado tiene proporciones equilibradas, con la frente ligeramente más ancha que la mandíbula.',
      recommendedFrame: 'rectangulares',
    },
    Round: {
      translation: 'Redondo',
      description: 'El rostro redondo tiene mejillas llenas y una línea de mandíbula suave.',
      recommendedFrame: 'cuadrados',
    },
    Square: {
      translation: 'Cuadrado',
      description: 'El rostro cuadrado tiene una mandíbula prominente y frente ancha.',
      recommendedFrame: 'redondos',
    },
    Heart: {
      translation: 'Corazón',
      description: 'El rostro en forma de corazón tiene una frente ancha y una mandíbula estrecha.',
      recommendedFrame: 'ovalados',
    },
    Oblong: {
      translation: 'Alargado',
      description: 'El rostro alargado es más largo que ancho, con una barbilla prominente.',
      recommendedFrame: 'cat-eye',
    },
    Unlabeled: {
      translation: 'No etiquetado',
      description: 'No se ha podido determinar un tipo de rostro claro.',
      recommendedFrame: 'Marcos universales',
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
      const response = await axios.get(`http://localhost:5203/api/Product/search-shape`, {
        params: {
          searchTerm,
          page,
          size,
        },
      });

      const { data, totalCount } = response.data;
      setProducts(data);
      setPagination((prev) => ({ ...prev, total: totalCount }));
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
      const { averageRating, categoryName, brandName, material, color } = filters;
      return (
        (averageRating === null || product.averageRating === averageRating) &&
        (categoryName === null || product.categoryName === categoryName) &&
        (brandName === null || product.brandName === brandName) &&
        (material === null || product.material === material) &&
        (color === null || product.color === color)
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
      categoryName: null,
      brandName: null,
      material: null,
      color: null,
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchRecommendedFrames(faceShape.recommendedFrame, 1, pagination.size);
  };

  const handleProceed = () => setShowInfoPage(false);

  return (
    <ConfigProvider
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
        {showInfoPage ? (
          <FaceShapeInfoPage onProceed={handleProceed} />
        ) : (
          <div
            className='site-layout-content'
            style={{ minHeight: 'calc(100vh - 64px)' }}
          >
            <Title
              level={2}
              style={{ textAlign: 'center', color: '#fe0034' }}
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
                        <Paragraph style={{ marginTop: '16px', fontSize: '18px' }}>
                          Tipo de rostro detectado: <strong>{faceShape.shape}</strong>
                        </Paragraph>
                        <Paragraph style={{ fontSize: '16px' }}>Descripción: {faceShape.description}</Paragraph>
                        <Paragraph style={{ fontSize: '16px' }}>
                          Marco recomendado: <strong>{faceShape.recommendedFrame}</strong>
                        </Paragraph>
                        <Paragraph style={{ fontSize: '16px' }}>
                          Fiabilidad: <strong>{faceShape.confidence}</strong>
                        </Paragraph>
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
                              value={filters.categoryName}
                              onChange={(value) => handleFilterChange('categoryName', value)}
                              style={{ width: '100%' }}
                              placeholder='Seleccionar'
                            >
                              {[...new Set(products.map((product) => product.categoryName))].map((category) => (
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
                              value={filters.brandName}
                              onChange={(value) => handleFilterChange('brandName', value)}
                              style={{ width: '100%' }}
                              placeholder='Seleccionar'
                            >
                              {[...new Set(products.map((product) => product.brandName))].map((brand) => (
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

                          <div style={{ marginBottom: '8px' }}>
                            <label style={{ fontWeight: 'bold', marginRight: '8px' }}>Color:</label>
                            <Select
                              value={filters.color}
                              onChange={(value) => handleFilterChange('color', value)}
                              style={{ width: '100%' }}
                              placeholder='Seleccionar'
                            >
                              {[...new Set(products.map((product) => product.color))].map((color) => (
                                <Option
                                  key={color}
                                  value={color}
                                >
                                  {color}
                                </Option>
                              ))}
                            </Select>
                          </div>

                          <Button
                            type='default'
                            onClick={handleClearFilters}
                            style={{ marginTop: '16px', width: '100%' }}
                          >
                            Limpiar Filtros
                          </Button>
                        </div>

                        <Row
                          gutter={16}
                          style={{ marginTop: '16px' }}
                        >
                          {applyFilters(products).map((product) => (
                            <Col
                              span={8}
                              key={product.productID}
                            >
                              <Card
                                hoverable
                                style={{ marginTop: '16px' }}
                                cover={
                                  <Image
                                    alt={product.name}
                                    src={product.images.length > 0 ? marcos : marcos}
                                    height={200}
                                    style={{ objectFit: 'cover' }}
                                  />
                                }
                              >
                                <Card.Meta
                                  title={product.name}
                                  description={
                                    <>
                                      <p>SKU: {product.code}</p>
                                      <p>Precio: ${product.price}</p>
                                      <Rate
                                        value={product.averageRating}
                                        disabled
                                      />
                                    </>
                                  }
                                />
                              </Card>
                            </Col>
                          ))}
                        </Row>
                      </>
                    )
                  )}
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </div>
    </ConfigProvider>
  );
}

export default FaceLandmarkerComponent;
