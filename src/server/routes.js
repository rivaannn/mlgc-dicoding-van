const postPredictHandler = require("../server/handler");

const routes = [
  {
    method: "POST",
    path: "/predict",
    handler: postPredictHandler,
    options: {
      payload: {
        allow: "multipart/form-data",
        multipart: true,
        maxBytes: 1 * 1024 * 1024,
      },
    },
  },
];

module.exports = routes;
