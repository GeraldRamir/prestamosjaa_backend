import express from 'express';
import { agregarCliente, obtenerClientes, actualizarCliente, eliminarCliente, obtenerCliente } from '../controllers/clientesControllers.js';
import checkAuth from '../middleware/authMiddleweare.js';

const router= express.Router();
router.route("/")
.post(checkAuth,agregarCliente)
.get( checkAuth,obtenerClientes);

router.route("/:id")
.get(checkAuth,obtenerCliente)
.put(checkAuth,actualizarCliente)
.delete(checkAuth,eliminarCliente);


export default router;