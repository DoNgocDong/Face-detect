const config = require('./config/index.js');
const FaceDetection = require('./face-detection/index.js');
const CommonUtils = require('./utils/common.js');
const path = require("path");
const fs = require('fs').promises;
const pMap = require('p-map');

const opt = {
  process: 'Process',
  error: 'ERROR'
}

const logObj = {};

const log = {
  process: function(name, data) {
    logObj[name] = data;
    console.clear();
    console.table(logObj);
  },
  reset: function() {
    delete logObj[opt.process];
    delete logObj[opt.error];
  }
}

async function imageProcess(service, imagePath) {
  const data = await service.detectFace(imagePath);

  const age = Math.round(data.age);

  return {
    gender: data.gender,
    age: age
  }
}

async function processImagesFromDisk(imageDirectory, thread) {
  const faceDetection = new FaceDetection();
  await faceDetection.loadModels();

  log.process(opt.process, 'Ok, processing...');
  log.reset();

  files = await fs.readdir(imageDirectory);

  await pMap(files, async file => {
    try {
      if (file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.png')) {
        const imagePath = path.join(imageDirectory, file);

        const data = await imageProcess(faceDetection, imagePath);

        log.process(file, data);
      }
    } 
    catch (err) {
      log.process(`${opt.error} ${file}`, err);
    }
  }, {concurrency: thread});
}

async function execute() {
  log.process(opt.process, 'Initializze...');
  const inputDir = config.dir;
  const thread = config.thread;

  await processImagesFromDisk(inputDir, thread);
}

async function main() {
  try {
    await execute();
  } 
  catch (error) {
    log.process(opt.error, error);
  }
}

main(); 