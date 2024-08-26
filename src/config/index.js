const dotenv = require('dotenv');
dotenv.config();

const config = {
  faceDetection: {
    inputSize: process.env.FACE_DETECTION_INPUT_SIZE ? parseInt(process.env.FACE_DETECTION_INPUT_SIZE) : 608,
    scoreThreshold: process.env.FACE_DETECTION_THRESHOLD ? parseFloat(process.env.FACE_DETECTION_THRESHOLD) : 0.5,
  },
  dir: String(process.env.DIR),
  thread: process.env.THREAD ? parseInt(process.env.THREAD) : 1
}

module.exports = config;