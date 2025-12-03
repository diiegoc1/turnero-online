const express = require("express");

const cors = require("cors");

const conexion = require("./database");

const app = express();
const port = 3000;

app.use(cors());

app.use(express.json());

app.get("/turnos", (req, res) => {
  conexion.query("SELECT * FROM turnos", (err, results) => {
    if (err) {
      res.status(500).send("ERROR database ");
      return;
    }
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${port}`);
  console.log("📍 Prueba la ruta: http://localhost:3000/turnos");
});



app.post("/turnos", (req, res) => {
  console.log("📨 Recibiendo POST en /turnos:", req.body);

  const { servicio_id, cliente_nombre, fecha, hora, servicio, precio } = req.body;

  
  if (!servicio_id || !cliente_nombre || !fecha || !hora || !servicio || !precio) {
    return res.status(400).json({ error: "Faltan campos requeridos" });
  }

  const estado = "confirmado";

  const query =
    "INSERT INTO turnos (servicio_id, cliente_nombre, fecha, hora, estado, servicio, precio) VALUES (?, ?, ?, ?, ?, ?, ?)";

  conexion.query(
    query,
    [servicio_id, cliente_nombre, fecha, hora, estado, servicio, precio],
    (err, results) => {
      if (err) {
        console.error("❌ Error en query:", err);
        return res.status(500).json({ error: "Error en base de datos" });
      }

      console.log("✅ Turno insertado con ID:", results.insertId);
      res.json({
        success: true,
        message: "Turno guardado",
        id: results.insertId, 
        servicio_id,
        cliente_nombre,
        fecha,
        hora,
        estado,
        servicio,
        precio,
      });
    }
  );
});


app.put("/turnos/:id/cancelar", (req, res) => {
  const turnoId = req.params.id;

  console.log(`📝 Solicitando cancelación para turno ID: ${turnoId}`);

  const query = "UPDATE turnos SET estado = 'cancelado' WHERE id = ?";

  conexion.query(query, [turnoId], (err, results) => {
    if (err) {
      console.error("❌ Error al cancelar turno:", err);
      return res.status(500).json({ error: "Error en base de datos al cancelar turno" });
    }

    if (results.affectedRows === 0) {
      console.error("❌ Turno no encontrado");
      return res.status(404).json({ error: "Turno no encontrado" });
    }

    console.log("✅ Turno cancelado en BD:", results);
    res.json({
      success: true,
      message: "Turno cancelado exitosamente",
      id: turnoId,
    });
  });
});

