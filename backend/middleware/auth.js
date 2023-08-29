const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "../config/.env" });

module.exports = async (req, res, next) => {
  try {
    // Extract the token from the requests header
    const token = req.headers.authorization.split(' ')[1];
    // Decode and extract the user ID from the token
    const userId = jwt.verify(token, process.env.TOKEN).userId;
    // Compare the user ID from the request body with the extracted one
    if (req.params.id == userId) {
      next();
    } else {
      return res.status(401).json({
        success: false,
        message: "Authentication failed, request not authorized!",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};