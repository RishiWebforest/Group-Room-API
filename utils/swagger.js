// utils/swagger.js
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Group Room API",
      version: "1.0.0",
      description: "API for creating, joining, and checking group rooms",
    },
   servers: [{ url: "/api" }],
  },
  apis: ["./routes/*.js", "./controllers/*.js"], // Path to files with JSDoc
};

const specs = swaggerJsdoc(options);

export const swaggerDocs = (app) => {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(specs));
};
