const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Configura conexión MySQL
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "admin123",
  database: "proyec_final"
});

// Validación sencilla de datos factura
function validFactura(f) {
  return f.NumeroFactura && f.FechaFactura && f.CodigoProveedor
    && f.Categoria && !isNaN(f.Subtotal) && !isNaN(f.ITBMS) && !isNaN(f.Total);
}

//-------------------- PROVEEDORES --------------------
// Listar proveedores
app.get("/proveedores", (req, res) => {
  db.query("SELECT * FROM Proveedores", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});
// Agregar proveedor
app.post("/proveedores", (req, res) => {
  const p = req.body;
  db.query("INSERT INTO Proveedores SET ?", p, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Proveedor registrado", id: result.insertId });
  });
});
// Eliminar proveedor
app.delete("/proveedores/:id", (req, res) => {
  db.query("DELETE FROM Proveedores WHERE CodigoProveedor=?", [req.params.id], (err) => {
    if (err) return res.status(500).json({error: err.message});
    res.json({ message: "Proveedor eliminado"});
  });
});

//-------------------- CATEGORIAS --------------------
// Listar categorías
app.get("/categorias", (req, res) => {
  db.query("SELECT * FROM Categorias", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});
// Agregar categoría
app.post("/categorias", (req, res) => {
  const c = req.body;
  db.query("INSERT INTO Categorias SET ?", c, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Categoría registrada", id: result.insertId });
  });
});
// Eliminar categoría
app.delete("/categorias/:id", (req, res) => {
  db.query("DELETE FROM Categorias WHERE Categoria=?", [req.params.id], (err) => {
    if (err) return res.status(500).json({error: err.message});
    res.json({ message: "Categoría eliminada"});
  });
});

//-------------------- FACTURAS --------------------
// Listar facturas
app.get("/facturas", (req, res) => {
  db.query("SELECT * FROM Facturas", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});
// Registrar factura
app.post("/facturas", (req, res) => {
  const f = req.body;
  if (!validFactura(f)) {
    return res.status(400).json({ error: "Datos incompletos o inválidos" });
  }
  db.query("INSERT INTO Facturas SET ?", f, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Factura registrada correctamente", id: result.insertId });
  });
});
// Eliminar factura
app.delete("/facturas/:id", (req, res) => {
  db.query("DELETE FROM Facturas WHERE NumeroFactura=?", [req.params.id], (err) => {
    if (err) return res.status(500).json({error: err.message});
    res.json({ message: "Factura eliminada"});
  });
});

app.listen(3000, () => {
  console.log("API corriendo en http://localhost:3000");
});
