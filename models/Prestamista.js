import mongoose from "mongoose";
import bcrypt from "bcrypt";
import generarID from "../helpers/generarID.js";

const prestamistaSchema= mongoose.Schema({
    nombre:{
        type:String,
        required:true,
        trim: true
    },
    
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    telefono:{
        type:String,
        default: null,
        trim:true
    },
    token: {
        type: String,
        default: generarID()
    },
    confirmado: {
        type: Boolean,
        default: false
    }
})

prestamistaSchema.pre('save', async function(next){
    if(!this.isModified("password")){
        next();
    }
    const salt= await bcrypt.genSalt(10);
    this.password= await bcrypt.hash(this.password, salt);
});
prestamistaSchema.methods.compararPassword= async function(passwordFormulario){
    return await bcrypt.compare(passwordFormulario, this.password);
};

const Prestamista= mongoose.model('Prestamista', prestamistaSchema);
export default Prestamista;