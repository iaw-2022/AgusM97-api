const { auth } = require("express-oauth2-jwt-bearer");

module.exports = auth({
  audience: "https://proyecto-IAW/api",
  issuerBaseURL: `https://dev-0f-5co-0.us.auth0.com/`,
});
