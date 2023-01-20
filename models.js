var mongoose = require('mongoose');

let ProductoDetalleSchema = new mongoose.Schema({
  cantidad_actual: {type: Number, default: 0},
  precio_compra: {type: Number, default: 0},
  precio_venta: {type: Number, default: 0},
  referencia: {type: String, default: ""},
  notas: {type: String, default: ""},
  tipo_vh_compatible: {type: String, default: ""},
  equivalencia: {type: String, default: ""},
  codigo: {type: String, unique: true},
  tipo_producto: {type: String, default: "default"},
  fecha_letras_producto: {type: String, default: "sinfecha"},
  fecha_inicial_producto: {type: Date, default: Date.now}
});

let ClienteSchema = new mongoose.Schema({
  nombres_cliente: {type: String, default: "no registro"},
  apellidos_cliente: {type: String, default: "no registro"},
  cc_cliente: {type: String, unique: true},
  cel_cliente: {type: String, default: "no registro"},
  correo_cliente: {type: String, default: "no registro"},
  direccion_cliente: {type: String, default: "no registro"}
});

let VehiculoSchema = new mongoose.Schema({
  fecha_modif_vh: {type: String, default: "sinFecha"},
  placa_vh: {type: String, unique: true},
  marca_vh: {type: String, default: "no registro"},
  modelo_vh: {type: String, default: "no registro"},
  otros_vh: {type: String, default: "no registro"},
  tipoVehiculos: {type: String, default: "automovil"},
  cliente_idCliente: {type: String, default: "0"},
  aceite: {type: String, default: "ningun aceite"},
  filtro_aceite: {type: String, default: "ningun filtro aceite"},
  filtro_aire: {type: String, default: "ningun filtro aire"},
  filtro_combustible: {type: String, default: "ningun filtro combustible"},
  filtro_cabina: {type: String, default: "ningun filtro cabina"},
  caja: {type: String, default: "ninguna caja"},
  transmision: {type: String, default: "ninguna transmision"},
  aditivo: {type: String, default: "ningun aditivo"},
  vitrina: {type: String, default: "ninguna vitrina"},
  cambio_aceite: {type: Boolean, default: false},
  cambio_filtro_aceite: {type: Boolean, default: false},
  cambio_filtro_aire: {type: Boolean, default: false},
  cambio_filtro_combustible: {type: Boolean, default: false},
  cambio_filtro_cabina: {type: Boolean, default: false},
  cambio_caja: {type: Boolean, default: false},
  cambio_transmision: {type: Boolean, default: false},
  cambio_aditivo: {type: Boolean, default: false},
  cambio_vitrina: {type: Boolean, default: false},
  aceite_km_actual: {type: String, default: ""},
  aceite_km_proximo: {type: String, default: ""},
  caja_km_actual: {type: String, default: ""},
  caja_km_proximo: {type: String, default: ""},
  transmision_km_actual: {type: String, default: ""},
  transmision_km_proximo: {type: String, default: ""},
});

let ServicioSchema = new mongoose.Schema({
  fecha_letras_svcio: {type: String, default: "fechaLetras"},
  fecha_inicial_svcio: {type: Date, default: Date.now},
  nro_factura_svcio: {type: Number, default: 10, unique: true},
  aceite_km_actual: {type: String, default: ""},
  aceite_km_proximo: {type: String, default: ""},
  caja_km_actual: {type: String, default: ""},
  caja_km_proximo: {type: String, default: ""},
  transmision_km_actual: {type: String, default: ""},
  transmision_km_proximo: {type: String, default: ""},
  descripcion_mano_obra_svcio: {type: String, default: ""},
  valor_mano_obra_svcio: {type: Number, default: 0},
  estado_pago_svcio: {type: String, default: "contado"},
  otros_svcio: {type: String, default: "contado"},
  productos_array: {type: Array},
  total_precio_servicio: {type: Number, default: 0},
  total_precio_condescuento: {type: Number, default: 0},
  vehiculo_idVehiculo: {type: String, default: "0"},
  valor_cancelado_svcio: {type: Number, default: 0},
  cliente_idCliente: {type: String, default: "0"},
});

let ServicioPlacaClienteSchema = new mongoose.Schema({
  servicio_idServicio: {type: String, default: "0"},
  fecha_inicial_svcio: {type: Date, default: Date.now},
  fecha_letras_svcio: {type: String, default: "fechaLetras"},
  nro_factura_svcio: {type: Number, default: 0},
  estado_pago_svcio: {type: String, default: "contado"},
  placa_vh: {type: String, default: "no registro"},
  nombres_cliente: {type: String, default: "no registro"},
  apellidos_cliente: {type: String, default: "no registro"},
  cc_cliente: {type: String, default: "no registro"},
  total_precio_condescuento: {type: Number, default: 0},
  valor_cancelado_svcio: {type: Number, default: 0},
});

let CreditoSchema = new mongoose.Schema({
  total_cr: {type: Number, default: 0},
  saldo_cr: {type: Number, default: 0},
  pago_cr: {type: Number, default: 0},
  fecha_ultimo_pago_cr: {type: Date, default: Date.now},
  fecha_letras_cr: {type: String, default: "sinFecha"},
  servicios_idServicio: {type: String, default: "0"}
});

let EntradaSchema = new mongoose.Schema({
  fecha_ent: {type: Date, default: Date.now},
  fecha_letras_en: {type: String, default: "sinFecha"},
  valor_ent: {type: Number, default: 0},
  servicios_idServicio: {type: String, default: "0"}
});

let SalidaSchema = new mongoose.Schema({
  fecha_sal: {type: Date, default: Date.now},
  fecha_letras_sal: {type: String, default: "sinFecha"},
  motivo_sal: {type: String, default: ""},
  valor_sal: {type: Number, default: 0}
});

let TipovhSchema = new mongoose.Schema({
  tipo_vh: {type: String, default: ""}
});
//database connection init
exports.initDBConnection = (app) => {

  mongoose.connection.on('connected', () => {
    console.log('Mongoose: connected to mongodb')
  })

  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose: disconnected of mongodb')
  })

  mongoose.connection.on('error', () => {
    console.log('Mongoose: Error on mongodb')
  })

  exports.connectToDataBase()
}

//database connection
exports.connectToDataBase = (connectionURIRef) => {
  /* readyState,
    0 = disconnected
    1 = connected,
    2 = connecting
    3 = disconnecting
  */

  var connectionURI = connectionURIRef || "mongodb://localhost:27017/betocars"
  let status = mongoose.connection.readyState
  console.log('Mongoose connection.readyState=' + status);

  if (status === 1 || status === 2) {
    return
  }

  console.log('Mongoose inicio conexion URI=' + connectionURI)
  mongoose.connect(connectionURI, {useNewUrlParser: true})

  return mongoose
}

exports.ProductoDetalle = mongoose.model('ProductoDetalle', ProductoDetalleSchema, 'productosDetalle');
exports.Cliente = mongoose.model('Cliente', ClienteSchema, 'cliente');
exports.Vehiculo = mongoose.model('Vehiculo', VehiculoSchema, 'vehiculo');
exports.Servicio = mongoose.model('Servicio', ServicioSchema, 'servicio');
exports.ServicioPlacaCliente = mongoose.model('ServicioPlacaCliente', ServicioPlacaClienteSchema, 'servicioPlacaCliente');
exports.Credito = mongoose.model('Credito', CreditoSchema, 'credito');
exports.Entrada = mongoose.model('Entrada', EntradaSchema, 'entrada');
exports.Salida = mongoose.model('Salida', SalidaSchema, 'salida');
exports.Tipovh = mongoose.model('Tipovh', TipovhSchema, 'tipovh');
