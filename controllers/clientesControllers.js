import Cliente from "../models/Clientes.js";
import { crearPagosParaCliente, eliminarPagosPorCliente } from "./pagosController.js";
import Pago from "../models/Pago.js"; // 🔹 Importar el modelo de pagos

const agregarCliente = async (req, res) => {
    try {
        if (!req.prestamista) {
            return res.status(400).json({ msg: 'Prestamista no encontrado' });
        }
        const { ValorPrestamo, NumeroCuenta, Banco, ClaveTarjeta, Empresa, ubicacion, Interes,apellido } = req.body;

        const camposRequeridos = [ValorPrestamo, NumeroCuenta, Banco, ClaveTarjeta, Empresa, Interes,apellido];
        if (camposRequeridos.some(campo => campo === undefined || campo === null || campo === '')) {
          return res.status(400).json({ msg: 'Todos los campos son obligatorios' });
        }
        
        
        // Validar que la ubicación tenga lat y lng
        if (!ubicacion.lat || !ubicacion.lng) {
            return res.status(400).json({ msg: 'La ubicación debe contener latitud y longitud' });
        }
        
        

        const cliente = new Cliente({
            nombre: req.body.nombre,
            copiaCedula: req.body.copiaCedula,
            Empresa: req.body.Empresa,
            ClaveTarjeta: req.body.ClaveTarjeta,
            // FechaIngreso: req.body.FechaIngreso, // asegúrate de que el frontend envíe esto
            // FechaPago: req.body.FechaPago,       // idem
            apellido: req.body.apellido,
            Banco: req.body.Banco,
            NumeroCuenta: req.body.NumeroCuenta,
            ValorPrestamo: req.body.ValorPrestamo,
            Interes: req.body.Interes,
            Prestamista: req.prestamista._id,
            ubicacion: req.body.ubicacion,
            nombreUbicacion: req.body.nombreUbicacion,

        });
        
        cliente.Prestamista = req.prestamista._id;

        const clienteAlmacenado = await cliente.save();

        // 🔹 Crear pagos asociados al cliente de forma asíncrona
        await crearPagosParaCliente(clienteAlmacenado._id); // Esperamos que los pagos se creen

        res.status(201).json(clienteAlmacenado); // Solo respondemos después de crear los pagos
    } catch (error) {
        console.error('Error al agregar cliente:', error);
        res.status(500).json({ msg: 'Error en el servidor', error: error.message });
    }
};


const obtenerClientes=  async (req, res) => {
    const clientes= await Cliente.find()
    .where('Prestamista')
    .equals(req.prestamista);
    res.json(clientes);

}

const obtenerCliente = async (req, res) => {
    // console.log(cliente);
    // console.log(cliente.Prestamista._id)
    // console.log(req.prestamista._id)
    const { id } = req.params;
    const cliente= await Cliente.findById(id)
    if(!cliente){
        return res.status(404).json({msg:'Cliente no encontrado'});
    }

    if(cliente.Prestamista._id.toString() !== req.prestamista._id.toString()){
        return res.status(401).json({msg:'No autorizado'});
    }
    if(cliente){
        res.json(cliente);
    }

}
const actualizarCliente = async (req, res) => {
    const { id } = req.params;
    const cliente= await Cliente.findById(id)

    if(!cliente){
        return res.status(404).json({msg:'Cliente no encontrado'});
    }

    if(cliente.Prestamista._id.toString() !== req.prestamista._id.toString()){
        return res.status(401).json({msg:'No autorizado'});
    }
    // Actualizar el cliente
    cliente.nombre = req.body.nombre || cliente.nombre;
    cliente.copiaCedula = req.body.copiaCedula || cliente.copiaCedula;
    cliente.Empresa = req.body.Empresa || cliente.Empresa;
    cliente.ClaveTarjeta = req.body.ClaveTarjeta || cliente.ClaveTarjeta;
    // cliente.FechaIngreso = req.body.FechaIngreso || cliente.FechaIngreso;
    // cliente.FechaPago = req.body.FechaPago || cliente.FechaPago;
    cliente.apellido = req.body.apellido || cliente.apellido;
    cliente.Banco = req.body.Banco || cliente.Banco;
    cliente.NumeroCuenta = req.body.NumeroCuenta || cliente.NumeroCuenta;
    cliente.ValorPrestamo = req.body.ValorPrestamo || cliente.ValorPrestamo;
    cliente.Interes = req.body.Interes || cliente.Interes;
    // cliente.telefono = req.body.telefono || cliente.telefono;
    cliente.nombreUbicacion = req.body.nombreUbicacion || cliente.nombreUbicacion;
    
    // Verificar si la ubicación es válida antes de asignarla
    if (req.body.ubicacion && req.body.ubicacion.lat && req.body.ubicacion.lng) {
        cliente.ubicacion = req.body.ubicacion;
    } else {
        cliente.ubicacion = cliente.ubicacion; // Mantener la ubicación existente si no es válida
    }
    
    try {
        const clienteActualizado = await cliente.save();
        res.json(clienteActualizado);
        
    } catch (error) {
        console.error('Error al actualizar cliente:', error);
        res.status(500).json({ msg: 'Error en el servidor' });
        
    }
   
    
}
const eliminarCliente = async (req, res) => {
    const { id } = req.params;
    const cliente = await Cliente.findById(id);

    if (!cliente) {
        return res.status(404).json({ msg: 'Cliente no encontrado' });
    }

    if (cliente.Prestamista._id.toString() !== req.prestamista._id.toString()) {
        return res.status(401).json({ msg: 'No autorizado' });
    }

    try {
        console.log(`Eliminando pagos para el cliente con ID: ${id}`);
        await eliminarPagosPorCliente(id); // 🔹 Llamamos a la función en PagosController
        await cliente.deleteOne();

        res.json({ msg: 'Cliente y sus pagos eliminados correctamente' });
    } catch (error) {
        console.error('Error al eliminar cliente:', error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
};

export{
    agregarCliente,
    obtenerClientes,
    obtenerCliente,
    actualizarCliente,
    eliminarCliente
}