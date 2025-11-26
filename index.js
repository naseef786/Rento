const app = require("./app"); // if you have a separate server.js file
const serverless = require("serverless-http");

module.exports = (req, res) => {
  const handler = serverless(app);
  return handler(req, res);
};