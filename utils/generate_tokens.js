const jwt = require('jsonwebtoken');
const { project_key } = require('../config/config');

const jwtSecret = project_key.jwt

const generateToken = (_id) => {
      try {
        const token = jwt.sign({ _id }, jwtSecret);
        return token;
      } catch (err) {
        console.error(err);
        throw new Error("Failed to generate token");
      }
    };
    module.exports = generateToken