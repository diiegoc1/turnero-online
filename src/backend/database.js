const mysql = require("mysql2");

const conexion = mysql.createConnection({
  host: "127.0.0.1", 
  port: 3306,
  user: "root",
  password: "admin", 
  database: "turnero",
});

conexion.connect((error) => {
  if (error) {
    console.error("ERROR al conectar", error);
    return;
  } else {
    console.log("Conectado a la base de datos");
  }
});

module.exports = conexion;
