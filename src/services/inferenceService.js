const tf = require("@tensorflow/tfjs-node");

const predictClassificationCancer = async (model, image) => {
  const tensor = tf.node
    .decodeJpeg(image)
    .resizeNearestNeighbor([224, 224])
    .expandDims()
    .toFloat();
  const prediction = model.predict(tensor);
  const scoreArray = await prediction.data();
  const score = scoreArray[0];
  const threshold = 0.5;
  const label = score >= threshold ? "Cancer" : "Non-cancer";
  const confidenceScore = score * 100;
  let suggestion;

  if (label === "Cancer") {
    suggestion = "Segera periksa ke dokter!";
  } else {
    suggestion =
      "Anda tidak terdeteksi cancer, Tetap jaga kondisi kesahatan anda!";
  }
  return { confidenceScore, label, suggestion };
};

module.exports = predictClassificationCancer;
