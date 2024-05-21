require("dotenv").config();

const Hapi = require("@hapi/hapi");
const routes = require("../server/routes");
const loadModel = require("../services/loadModel");
const InputError = require("../exceptions/InputError");

(async () => {
  try {
    const server = Hapi.server({
      port: process.env.PORT || 3000,
      host: process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost",
      routes: {
        cors: {
          origin: ["*"],
        },
      },
    });

    const model = await loadModel();
    server.app.model = model;
    server.route(routes);

    server.ext("onPreResponse", (request, h) => {
      const { response } = request;

      if (response instanceof InputError) {
        return h
          .response({
            status: "fail",
            message: "Terjadi kesalahan dalam melakukan prediksi",
          })
          .code(400);
      }

      if (response.isBoom && response.output.statusCode === 413) {
        return h
          .response({
            status: "fail",
            message:
              "Payload content length greater than maximum allowed: 1000000",
          })
          .code(413);
      }

      return h.continue;
    });

    await server.start();
    console.log(`Server started at: ${server.info.uri}`);
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1); // Exit the process with a failure code
  }
})();
