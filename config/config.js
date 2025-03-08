require('dotenv').config();

const config = {
  db: {
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    dialect: 'mysql',
  },


  project_key:{
      jwt:process.env.JWT_SECRET

  },

  
  smtp:{
      mail:process.env.SMTP_MAIL,
      password:process.env.SMTP_PASSWORD
  }

};

module.exports = config;
