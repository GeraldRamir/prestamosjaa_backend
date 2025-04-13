import mongoose from "mongoose";

const conectarDB = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGO_URL); // 👈 Opciones eliminadas

        const url = `${db.connection.host}:${db.connection.port}`;
        console.log(`Conectado a la base de datos en: ${url}`);

    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default conectarDB;
