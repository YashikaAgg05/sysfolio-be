// // const mysql = require('mysql');
// // require('dotenv').config();

// // const db = mysql.createConnection({
// //   host: process.env.DB_HOST,
// //   user: process.env.DB_USER,
// //   password: process.env.DB_PASSWORD,
// //   database: process.env.DB_NAME
// // });

// // db.connect(err => {
// //   if (err) throw err;
// //   console.log("MySQL connected...");
// // });

// // module.exports = db;


// const mysql = require("mysql");

// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "n3u3da!", // Replace if you set a MySQL password
//   database: "sysfolio"
// });

// db.connect((err) => {
//   if (err) throw err;
//   console.log("✅ MySQL Connected");
// });

// module.exports = db;


const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "n3u3da!",
  database: "sysfolio"
});

db.connect(err => {
  if (err) {
    console.error("DB connection failed:", err.message);
  } else {
    console.log("✅ MySQL Connected");
  }
});

module.exports = db;
