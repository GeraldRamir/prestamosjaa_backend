import mongoose from "mongoose";

const pagoSchema = new mongoose.Schema({
  quincena: { type: Date, required: true },
  capital: { type: Number, required: true },
  avance: { type: Number, required: true },
  abono: { type: Number, required: true },
  intereses: { type: Number, required: true },
  total: { type: Number, required: true },
  atrasos: { type: Number, required: true, default: 0 },
});

const pagosSchema = new mongoose.Schema(
  {
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cliente",
      required: true,
    },
    pagos: [pagoSchema], // Se almacena como un array de objetos
    totales: [{ type: Number }], // Array que almacenará las sumas de cada columna
    totalGeneral: { type: Number, required: false }, // Deberías asegurar que se calcule antes de guardarlo
  },
  {
    timestamps: true,
  }
);

const Pago = mongoose.model("Pago", pagosSchema);
export default Pago;
