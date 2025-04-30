import mongoose from "mongoose";

const clientesSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  telefono: {
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
  ClaveTarjeta: {
    type: Number,
    required: true,
    unique: true
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
  Banco: {
    type: String,
    required: true
  },
  NumeroCuenta: {
    type: Number,
    required: true
  },
  ValorPrestamo: {
    type: Number,
    required: true
  },
  Interes: {
    type: Number,
    required: true
  },
  Prestamista: {
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

// Método para devolver fechas en formato YYYY-MM-DD
clientesSchema.methods.toJSON = function () {
  const cliente = this.toObject();
  if (cliente.FechaIngreso) {
    cliente.FechaIngreso = cliente.FechaIngreso.toISOString().slice(0, 10);
  }
  if (cliente.FechaPago) {
    cliente.FechaPago = cliente.FechaPago.toISOString().slice(0, 10);
  }
  return cliente;
};

const Cliente = mongoose.model('Cliente', clientesSchema);
export default Cliente;
