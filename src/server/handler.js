const predictClassificationCancer = require("../services/inferenceService");
const crypto = require("crypto");
const InputError = require("../exceptions/InputError");
const storeData = require("../services/storeData");

const postPredictHandler = async (request, h) => {
  try {
    const { model } = request.server.app;
    const { image } = request.payload;

    const { confidenceScore, label, suggestion } =
      await predictClassificationCancer(model, image);
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
      id,
      result: label,
      suggestion,
      createdAt,
    };

    await storeData(id, data);

    return h
      .response({
        status: "success",
        message:
          confidenceScore >= 100 || confidenceScore < 1
            ? "Model is predicted successfully"
            : "Model is predicted successfully but under threshold. Please use the correct picture",
        data,
      })
      .code(201);
  } catch (error) {
    throw new InputError("Terjadi kesalahan dalam melakukan prediksi", 400);
  }
};

module.exports = postPredictHandler;
