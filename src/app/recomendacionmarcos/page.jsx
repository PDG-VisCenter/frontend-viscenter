'use client';

import React, { useRef, useEffect, useState } from "react";
import { Modal, Button, Upload, Spin, Typography, Row, Col, Card } from "antd";
import { UploadOutlined, CameraOutlined, FileImageOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { FaceMesh } from "@mediapipe/face_mesh";
import { FaceLandmarker, DrawingUtils } from "@mediapipe/tasks-vision";
import * as cam from "@mediapipe/camera_utils";
import Webcam from "react-webcam";
import axios from "axios";

const { Title, Paragraph } = Typography;

function FaceLandmarkerComponent() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [camera, setCamera] = useState(null);
  const [faceMesh, setFaceMesh] = useState(null);
  const [faceShape, setFaceShape] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(true);

  useEffect(() => {
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
  }, [cameraActive]);

  function onResults(results) {
    if (webcamRef.current != null) {
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;
    } else {
        console.log("stoped");
    }

    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d");
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
      results.image,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );
    if (results.multiFaceLandmarks) {
      const drawingUtils = new DrawingUtils(canvasCtx);
      results.multiFaceLandmarks.forEach((landmarks) => {
        drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_TESSELATION,
          { color: "#FFFFFF", lineWidth: 1 }
        );
        drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE,
          { color: "#FF0000" }
        );
        drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW,
          { color: "#FF0000" }
        );
        drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_LEFT_EYE,
          { color: "#FF0000" }
        );
        drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW,
          { color: "#FF0000" }
        );
        drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_FACE_OVAL,
          { color: "#FFFFFF" }
        );
        drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_LIPS,
          { color: "#FFFFFF" }
        );
        drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS,
          { color: "#FF0000" }
        );
        drawingUtils.drawConnectors(
          landmarks,
          FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS,
          { color: "#FF0000" }
        );
      });
    }
    canvasCtx.restore();
  }

  const handleStartCamera = () => {
    setCameraActive(true);
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
    return false;
  };

  const handleCaptureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setUploadedImage(imageSrc);
    processImage(imageSrc);
    handleStopCamera();
  };

  const processImage = (imageSrc) => {
    const img = new Image();
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
      const imageBase64 = imageSrc.split(",")[1];
      const response = await axios({
        method: "POST",
        url: "https://classify.roboflow.com/face-shape-d4mv0/1",
        params: {
          api_key: "JSTj20botXDts9LyY3uf",
        },
        data: imageBase64,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      console.log(response.data);
      const faceShapeResult = response.data.predictions[0].class;
      setFaceShape(faceShapeResult);

    } catch (error) {
      console.error("Error al subir la imagen:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Modal
        title="Bienvenido"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleOk}
        footer={[
          <Button key="ok" type="primary" onClick={handleOk}>
            OK
          </Button>
        ]}
      >
        <Title level={4}>Herramienta de Recomendación de Marcos de Lentes</Title>
        <Paragraph>
          Utilice esta herramienta para escanear su rostro y recibir recomendaciones sobre los marcos de lentes que mejor se adaptan a su tipo de rostro.
        </Paragraph>
      </Modal>

      <div className="site-layout-content" style={{ padding: '24px', minHeight: 'calc(100vh - 64px)' }}>
        <Title level={2} style={{ textAlign: 'center', color: '#FF4D4F' }}>Recomendación de Marcos de Lentes</Title>
        <Row gutter={16}>
          <Col span={24} md={12}>
            <Card>
              {cameraActive && (
                <div style={{ position: 'relative', width: '100%' }}>
                  <Webcam
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      borderRadius: '8px',
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
          <Col span={24} md={12}>
            <Card>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {!cameraActive ? (
                  <Button
                    type="primary"
                    icon={<CameraOutlined />}
                    onClick={handleStartCamera}
                    style={{ marginBottom: '16px' }}
                  >
                    Iniciar Cámara
                  </Button>
                ) : (
                  <>
                    <Button
                      type="danger"
                      icon={<CloseCircleOutlined />}
                      onClick={handleStopCamera}
                      style={{ marginBottom: '16px' }}
                    >
                      Detener Cámara
                    </Button>
                    <Button
                      type="default"
                      icon={<CameraOutlined />}
                      onClick={handleCaptureImage}
                      style={{ marginBottom: '16px' }}
                    >
                      Capturar Imagen
                    </Button>
                  </>
                )}
                <Upload
                  customRequest={(options) => handleUpload(options.file)}
                  showUploadList={false}
                  accept="image/*"
                  style={{ marginBottom: '16px' }}
                >
                  <Button icon={<UploadOutlined />}>Subir Imagen</Button>
                </Upload>
                {loading && <Spin />}
                {faceShape && (
                  <Title level={4} style={{ marginTop: '16px' }}>
                    Tipo de Rostro: {faceShape}
                  </Title>
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default FaceLandmarkerComponent;
