import Pago from "../models/Pago.js";
import Cliente from "../models/Clientes.js";

// Función para calcular los totales de cada columna
const calcularTotales = (pagos) => {
  let totales = {
    capital: 0,
    avance: 0,
    abono: 0,
    intereses: 0,
    atrasos: 0,
    total: 0,
  };

  // Sumar los valores de cada columna
  pagos.forEach(pago => {
    totales.capital += pago.capital;
    totales.avance += pago.avance;
    totales.abono += pago.abono;
    totales.intereses += pago.intereses;
    totales.atrasos += pago.atrasos;
    totales.total += pago.capital + pago.avance + pago.abono + pago.intereses + pago.atrasos;
  });

  return totales;
};

// Crear pagos automáticamente cuando se agrega un cliente
const crearPagosParaCliente = async (clienteId) => {
  try {
    const cliente = await Cliente.findById(clienteId);
    if (!cliente) {
      throw new Error("Cliente no encontrado");
    }

    let pagosExistentes = await Pago.findOne({ cliente: clienteId });

    if (!pagosExistentes) {
      const valorPrestamo = cliente.ValorPrestamo;
      const Interes= cliente.Interes;
      const fechaInicio = new Date();

      const pagoInicial = {
        quincena: fechaInicio,
        capital: valorPrestamo,
        avance: 0,
        abono: 0,
        intereses: Interes,
        total: valorPrestamo, // El total inicial puede ser igual al valor del préstamo
        atrasos: 0,
      };

      pagosExistentes = await Pago.create({
        cliente: clienteId,
        pagos: [pagoInicial],
        totales: [], // Inicializamos el array de totales vacío
        totalGeneral: valorPrestamo, // Inicializamos el totalGeneral con el valor del préstamo
      });

      // Calculamos los totales y asignamos a `totales` y `totalGeneral`
      const totales = calcularTotales(pagosExistentes.pagos);
      pagosExistentes.totales = [
        totales.capital,
        totales.avance,
        totales.abono,
        totales.intereses,
        totales.atrasos,
      ];
      pagosExistentes.totalGeneral = totales.capital + totales.avance + totales.abono + totales.intereses + totales.atrasos;

      // Guardamos el documento con los totales calculados
      await pagosExistentes.save();

      console.log(`Pagos creados para el cliente ${clienteId} con totales calculados.`);
    } else {
      console.log(`El cliente ${clienteId} ya tiene una tabla de pagos.`);
    }
  } catch (error) {
    console.error("Error al crear pagos:", error);
    throw new Error("No se pudieron crear los pagos.");
  }
};

// Obtener pagos de un cliente
const obtenerPagosPorCliente = async (req, res) => {
  const { id } = req.params;

  try {
    const pagosCliente = await Pago.findOne({ cliente: id });

    if (!pagosCliente) {
      return res.status(404).json({ msg: "No se encontraron pagos para este cliente." });
    }

    // Calcular los totales de cada columna
    const totales = calcularTotales(pagosCliente.pagos);

    res.json({ pagos: pagosCliente.pagos, totales }); // Devolvemos los pagos junto con los totales
  } catch (error) {
    console.error("Error al obtener pagos:", error);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Agregar un nuevo pago al array del cliente
// Agregar un nuevo pago al array del cliente
const agregarPago = async (req, res) => {
  const { clienteId, quincena, capital, avance, abono, intereses, total, atrasos } = req.body;

  try {
    let pagoCliente = await Pago.findOne({ cliente: clienteId });

    // Si no existe el pago para el cliente, creamos uno nuevo
    if (!pagoCliente) {
      pagoCliente = new Pago({
        cliente: clienteId,
        pagos: [{ quincena, capital, avance, abono, intereses, total, atrasos }],
        totales: [], // Inicializamos el array de totales vacío
        totalGeneral: 0, // Inicializamos el totalGeneral en cero
      });
    } else {
      // Si ya existe, agregamos el nuevo pago
      pagoCliente.pagos.push({ quincena, capital, avance, abono, intereses, total, atrasos });
    }

    // Recalcular los totales de cada columna (capital, avance, abono, intereses, atrasos)
    const totales = calcularTotales(pagoCliente.pagos);

    // Asignar los totales al array `totales`
    pagoCliente.totales = [
      totales.capital,
      totales.avance,
      totales.abono,
      totales.intereses,
      totales.atrasos
    ];

    // Calcular y asignar el `totalGeneral` (suma de todos los totales)
    pagoCliente.totalGeneral = totales.capital + totales.avance + totales.abono + totales.intereses + totales.atrasos;

    // Guardar los cambios en la base de datos
    await pagoCliente.save();

    // Responder con el pagoCliente actualizado y los totales
    res.json({ pagoCliente, totales });
  } catch (error) {
    console.error("Error al agregar pago:", error);
    res.status(500).json({ error: "No se pudo agregar el pago." });
  }
};




// Editar un pago dentro del array
// Editar un pago dentro del array
const actualizarPago = async (req, res) => {
  const { clienteId, pagoId } = req.params;
  const { quincena, capital, avance, abono, intereses, total, atrasos } = req.body;

  try {
    // Buscar y actualizar el pago del cliente
    const pagoCliente = await Pago.findOneAndUpdate(
      { cliente: clienteId, "pagos._id": pagoId },
      { 
        $set: { 
          "pagos.$.quincena": quincena,
          "pagos.$.capital": capital,
          "pagos.$.avance": avance,
          "pagos.$.abono": abono,
          "pagos.$.intereses": intereses,
          "pagos.$.total": total,
          "pagos.$.atrasos": atrasos
        }
      },
      { new: true }
    );

    if (!pagoCliente) {
      return res.status(404).json({ msg: "Pago no encontrado." });
    }

    // Recalcular los totales de cada columna
    const totales = calcularTotales(pagoCliente.pagos);

    // Actualizar el totalGeneral
    pagoCliente.totalGeneral = totales.total;

    // Actualizar el array de totales
    pagoCliente.totales = [
      totales.capital,
      totales.avance,
      totales.abono,
      totales.intereses,
      totales.atrasos
    ];

    // Guardar los cambios en la base de datos
    await pagoCliente.save();

    // Enviar la respuesta con los pagos actualizados y los totales calculados
    res.json({ pagoCliente, totales });
  } catch (error) {
    console.error("Error al actualizar pago:", error);
    res.status(500).json({ error: "No se pudo actualizar el pago." });
  }
};


// Eliminar un pago del array de pagos del cliente
// Eliminar un pago del array de pagos del cliente
const eliminarPago = async (req, res) => {
  const { clienteId, pagoId } = req.params;

  try {
    const pagoCliente = await Pago.findOneAndUpdate(
      { cliente: clienteId },
      { $pull: { pagos: { _id: pagoId } } },
      { new: true }
    );

    if (!pagoCliente) {
      return res.status(404).json({ msg: "Pago no encontrado." });
    }

    // Recalcular los totales de cada columna después de eliminar un pago
    const totales = calcularTotales(pagoCliente.pagos);

    // Actualizar el totalGeneral
    pagoCliente.totalGeneral = totales.total;

    // Guardar los cambios en la base de datos
    await pagoCliente.save();

    res.json({ msg: "Pago eliminado correctamente.", totales });
  } catch (error) {
    console.error("Error al eliminar pago:", error);
    res.status(500).json({ error: "No se pudo eliminar el pago." });
  }
};


// Eliminar todos los pagos de un cliente
const eliminarPagosPorCliente = async (clienteId) => {
  try {
    await Pago.findOneAndUpdate(
      { cliente: clienteId },
      { $set: { pagos: [] } } // Vacía el array de pagos sin eliminar el documento
    );
    console.log(`Pagos eliminados para el cliente ${clienteId}`);
  } catch (error) {
    console.error("Error al eliminar pagos:", error);
    throw new Error("No se pudieron eliminar los pagos.");
  }
};

export {
  obtenerPagosPorCliente,
  agregarPago,
  actualizarPago,
  eliminarPago,
  eliminarPagosPorCliente,
  crearPagosParaCliente
};
