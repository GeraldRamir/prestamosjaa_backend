import mongoose from "mongoose";

const clientesSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    telefono:{
        type: Number,
        required: true
    },
    copiaCedula: {
        type: Number,
        required: true,
        unique: true
    },
    Empresa: {
        type: String,
        required: true
    },
    ClaveTarjeta:{
        type: Number,
        required: true,
        unique:true
    },
    FechaIngreso: {
        type: Date,
        required: true,
        default: Date.now
    },
    FechaPago: {
        type: Date,
        required: true,
        default: Date.now
    },
    Banco:{
        type: String,
        required: true
    },
    NumeroCuenta:{
        type: Number,
        required: true
    },
    ValorPrestamo:{
        type: Number,
        required: true
    },
    Interes:{
        type: Number,
        required: true
    },
    Prestamista:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Prestamista',
    },
    ubicacion: {
        lat: { type: Number, required: false },
        lng: { type: Number, required: false },
      },
      nombreUbicacion: String,
}, {
    timestamps: true,
});

const Cliente = mongoose.model('Clientes', clientesSchema);
export default Cliente;