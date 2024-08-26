const canvas = require("canvas");
const faceapi = require("face-api.js");
const config = require("../config/index.js");

const {Canvas, Image, ImageData} = canvas;

class FaceDetection {
  constructor() {
    faceapi.env.monkeyPatch({Canvas, Image, ImageData});
  }

  async loadModels() {
    await Promise.all([
      faceapi.nets.ageGenderNet.loadFromDisk('./models'),
      faceapi.nets.faceExpressionNet.loadFromDisk('./models'),
      faceapi.nets.faceLandmark68Net.loadFromDisk('./models'),
      faceapi.nets.faceRecognitionNet.loadFromDisk('./models'),
      faceapi.nets.mtcnn.loadFromDisk('./models'),
      faceapi.nets.ssdMobilenetv1.loadFromDisk('./models'),
      faceapi.nets.tinyYolov2.loadFromDisk('./models'),
      faceapi.nets.tinyFaceDetector.loadFromDisk('./models'),
    ]);
  }

  async detectFace(imagePath) {
    const input = await canvas.loadImage(imagePath);
    const detections = await faceapi.detectSingleFace(input, new faceapi.TinyFaceDetectorOptions({
      inputSize: config.faceDetection.inputSize,
      scoreThreshold: config.faceDetection.scoreThreshold
    })).withFaceLandmarks().withFaceExpressions().withAgeAndGender();

    return detections;
  }
}

module.exports = FaceDetection;