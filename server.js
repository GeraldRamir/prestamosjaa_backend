import express from 'express';
import dotenv from 'dotenv';
import conectarDB from './config/db.js';
import prestamistaroutes from './routes/prestamistaroutes.js';
import clientesRoutes from './routes/clientesRoutes.js';
import cors from 'cors';
import pagosRoutes from "./routes/pagosRoutes.js";


const app = express();
app.use(express.json());
dotenv.config();
conectarDB();
const dominiosPermitidos = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: (origin, callback) => {
        // Permitir peticiones sin origen (por ejemplo, desde Postman o `file://`)
        if (!origin || dominiosPermitidos.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("No permitido por CORS"));
        }
    },
    credentials: true
};

// app.use(express.static(path.join(__dirname, 'frontend/build')));
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
//   });
app.use(cors(corsOptions));



app.use('/api/prestamista', prestamistaroutes);

app.use('/api/clientes', clientesRoutes);

app.use("/api/pagos", pagosRoutes);

const PORT= process.env.PORT || 4000;

app.listen(PORT,()=>{
    console.log(`Servidor funcionando en el puerto ${PORT}`);

})


