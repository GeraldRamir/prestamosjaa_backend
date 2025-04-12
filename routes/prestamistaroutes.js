import express from 'express';
import { autenticar, comprobarToken, confirmar, nuevoPassword, olvidePassword, perfil, registrar } from '../controllers/prestamistaController.js';
import checkAuth from '../middleware/authMiddleweare.js';
const router = express.Router();

// Area publica
router.post('/',registrar);
router.get('/confirmar/:token',confirmar)
router.post('/login', autenticar);
router.post('/olvide-password', olvidePassword);
router.get('/olvide-password/:token', comprobarToken);
router.post('/olvide-password/:token', nuevoPassword);

// Area privada
router.get('/perfil', checkAuth, perfil);

export default router;
