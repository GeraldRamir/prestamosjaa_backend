import express from "express";
import {
  obtenerPagosPorCliente,
  agregarPago,
  actualizarPago,
  eliminarPago
} from "../controllers/pagosController.js";

const router = express.Router();

// Rutas para los pagos
router.get("/:id", obtenerPagosPorCliente);  // Obtener pagos del cliente
router.post("/:clienteId", agregarPago);    // Crear un nuevo pago
router.put("/:clienteId/:pagoId", actualizarPago); // Editar pago
router.delete("/:clienteId/:pagoId", eliminarPago); // Eliminar pago

export default router;
