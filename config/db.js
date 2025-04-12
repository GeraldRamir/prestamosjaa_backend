import mongoose from "mongoose";
const conectarDB= async ()=>{
    try{
        const db= await mongoose.connect(process.env.MONGO_URL,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
            // useFindAndModify:false,
            // useCreateIndex:true
        });

        const url= `${db.connection.host}:${db.connection.port}`

        console.log(`Conectado a la base de datos en: ${url}`);

    }catch(error){
        console.log(`error: ${error.message}`);
        process.exit(1);
    
    }
}

export default conectarDB;