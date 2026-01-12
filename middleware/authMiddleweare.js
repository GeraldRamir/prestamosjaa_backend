import jwt from 'jsonwebtoken';
import Prestamista from '../models/Prestamista.js';
const checkAuth = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            req.prestamista = await Prestamista.findById(decoded.id).select('-password -confirmado -token');
            if (!req.prestamista) {
                return res.status(401).json({ msg: 'Prestamista no autorizado' });
            }

            next();
        } catch (error) {
            return res.status(401).json({ msg: 'Token no válido' });
        }
    } else {
        return res.status(401).json({ msg: 'Token no proporcionado' });
    }
};
export default checkAuth;