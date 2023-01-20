var models = require('../models');
const request = require('request')
models.connectToDataBase();

var currentDate = new Date();
var date = currentDate.getDate();
var month = currentDate.getMonth(); //Be careful! January is 0 not 1
var strMonts = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
var monthName = strMonts[month]
var year = currentDate.getFullYear();

let fecha = date + monthName + year;


class VehiculoController {

  //obtener todos los servicios
  getAllServicios(req, res){

    models.Servicio.find({}, (err, doc) => {
      if (err) {
        console.log("error retornando servicios");
        return;
      }
      if (doc !== null) {
        let serviciosAux = doc;
        let servicios = [];
        for (var i = serviciosAux.length - 1; i >= 0; i--) {
          servicios.push(serviciosAux[i]);
        }
        //console.log("listado de servicios");
        //console.log(doc);
        return res.status(200).send({
          success: true,
          message: 'Servicios recibidos satisfactoriamente',
          servicios,
        });
      }
      else {
        console.log("Servicios no encontrados")
        return res.status(404).send({
          success: false,
          message: 'Fallo retorno servicios'
        });
      }
    });

  }

  //Guardar Servicio
  addServicio(req, res){


    if (!req.body.estado_pago_svcio) {
      return res.status(400).send({
        success: false,
        message: "estado_pago_svcio requerido"
      });
    }

  /* if (!req.body.nro_factura_svcio) {
      return res.status(400).send({
        success: false,
        message: "nro factura requerido"
      });
    }*/

    if (!req.body.total_precio_servicio) {
      return res.status(400).send({
        success: false,
        message: "total_precio_servicio requerido"
      });
    }

    if (!req.body.cliente_idCliente) {
      return res.status(400).send({
        success: false,
        message: "cliente_idCliente requerido"
      });
    }


    //console.log("req.body")
    //console.log(req.body)

    models.Servicio.find((err, doc) => {
      if (err) {
        //console.log("error retornando servicio por id");
        return res.status(403).send({
          success: false,
          message: 'error retornando servicio por id'
        });
      }
      if (doc !== null) {
          //inicia consecutivo de nro facturas
        //si quieres iniciar con el numero 40 pones 39 en nro_factura linea 97
        let nro_factura = 49; //-------------------->>>>  aqu'i iniciar'a con el 50
        for (var i = 0; i < doc.length; i++) {
          if (doc[i].nro_factura_svcio > nro_factura) {
            nro_factura = doc[i].nro_factura_svcio
          }
        }
        //console.log(nro_factura);

        let servicio_nuevo = new models.Servicio({
          fecha_letras_svcio: fecha,
          nro_factura_svcio: nro_factura + 1,
          aceite_km_actual: req.body.aceite_km_actual || "",
          aceite_km_proximo: req.body.aceite_km_proximo || "",
          caja_km_actual: req.body.caja_km_actual || "",
          caja_km_proximo: req.body.caja_km_proximo || "",
          transmision_km_actual: req.body.transmision_km_actual || "",
          transmision_km_proximo: req.body.transmision_km_proximo || "",
          descripcion_mano_obra_svcio: req.body.descripcion_mano_obra_svcio || "",
          valor_mano_obra_svcio: req.body.valor_mano_obra_svcio || 0,
          estado_pago_svcio: req.body.estado_pago_svcio,
          otros_svcio: req.body.otros_svcio || "",
          productos_array: req.body.productos_array || null,
          vehiculo_idVehiculo: req.body.vehiculo_idVehiculo || "0",
          //valor_cancelado_svcio: req.body.valor_cancelado_svcio || req.body.total_precio_servicio,
          cliente_idCliente: req.body.cliente_idCliente || "0",
          total_precio_servicio: req.body.total_precio_servicio || 0,
          total_precio_condescuento: req.body.total_precio_condescuento || req.body.total_precio_servicio,
        })

        if (req.body.estado_pago_svcio == "credito") {
          servicio_nuevo.valor_cancelado_svcio = req.body.valor_cancelado_svcio || 0;
        }
        if (req.body.estado_pago_svcio == "contado") {
          servicio_nuevo.valor_cancelado_svcio = req.body.valor_cancelado_svcio || req.body.total_precio_servicio;
        }

        servicio_nuevo.save((err) => {
        if (err) {
          //console.log(`error guardar Servicio: ${err}`);
          return res.status(403).send({
            success: false,
            message: "Servicio no agregado. Reintente"
          })
        }

        let entradaNva = new models.Entrada({
          fecha_letras_en: fecha,
          valor_ent: servicio_nuevo.total_precio_condescuento,
          servicios_idServicio: servicio_nuevo._id
        });

        entradaNva.save((err) => {
          if (err) {
            console.log(`error guardar entrada: ${err}`);
            return res.status(403).send({
              success: false,
              message: "Entrada no agregada. Reintente"
            })
          }

          if (servicio_nuevo.vehiculo_idVehiculo == '0') {
            let servicio_placa_cliente = new models.ServicioPlacaCliente({
              fecha_inicial_svcio: servicio_nuevo.fecha_inicial_svcio,
              fecha_letras_svcio: fecha,
              nro_factura_svcio: servicio_nuevo.nro_factura_svcio,
              estado_pago_svcio: servicio_nuevo.estado_pago_svcio,
              servicio_idServicio: servicio_nuevo._id,
              placa_vh: "no vehiculo",
              nombres_cliente: "",
              apellidos_cliente: "",
              cc_cliente: "",
              total_precio_condescuento: servicio_nuevo.total_precio_condescuento,
              valor_cancelado_svcio: servicio_nuevo.valor_cancelado_svcio
            });

              models.Cliente.findOne({_id: servicio_nuevo.cliente_idCliente}, (err, cliAct) => {
                if (err) {
                  //console.log("error retornando clientes");
                  return res.status(403).send({
                    success: false,
                    message: "error retornando clientes. Reintente"
                  });
                }

                let nombres = cliAct.nombres_cliente;
                let apellidos = cliAct.apellidos_cliente;
                let cc = cliAct.cc_cliente;

                servicio_placa_cliente.nombres_cliente = nombres;
                servicio_placa_cliente.apellidos_cliente = apellidos;
                servicio_placa_cliente.cc_cliente = cc;

                servicio_placa_cliente.save((err) => {
                  if (err) {
                    //console.log(`error guardar Servicio: ${err}`);
                    return res.status(403).send({
                      success: false,
                      message: "Servicio no agregado. Reintente"
                    })
                  }
                  //console.log(servicio_nuevo.estado_pago_svcio);
                  if (servicio_nuevo.estado_pago_svcio == "credito") {
                    let total = servicio_nuevo.total_precio_condescuento;
                    let pagoActual = servicio_nuevo.valor_cancelado_svcio;
                    let idServicio = servicio_nuevo._id;


                    if (total != pagoActual) {
                      request.post('http://localhost:5000/api/v1/credito/', {
                        json: {
                          total_cr: total,
                          pago_cr: pagoActual,
                          servicios_idServicio: idServicio
                        }
                      }, (error, res2, body) => {
                        if (error) {
                          //console.error(error)
                          return;
                        }
                //        console.log(`statusCode: ${res.statusCode}`)
                //        console.log("Credito agregado")
                        return;
                      });
                    }
                  }

                  return res.status(201).send({
                    success: true,
                    message: "Servicio agregado",
                    servicio_nuevo
                  })
                });
              });

          }
        else {
          models.Vehiculo.findOne({_id: servicio_nuevo.vehiculo_idVehiculo}, (err, vehAct) => {
            if (err) {
              //console.log("error retornando clientes");
              return res.status(403).send({
                success: false,
                message: "error retornando veh'iculos. Reintente"
              })
            }
            //console.log(vehAct);
            if (vehAct == null) {
              return res.status(403).send({
                success: false,
                message: "error retornando placa"
              })
            }

            vehAct.cambio_aceite = false;
            vehAct.cambio_filtro_aceite = false;
            vehAct.cambio_filtro_aire = false;
            vehAct.cambio_filtro_combustible = false;
            vehAct.cambio_filtro_cabina = false;
            vehAct.cambio_caja = false;
            vehAct.cambio_transmision = false;
            vehAct.cambio_aditivo = false;
            vehAct.cambio_vitrina = false;

            let aceites = '';
            let filtrosAceite = '';
            let filtrosAire = '';
            let filtrosCombustible = '';
            let cabinas = '';
            let cajas = '';
            let transmisiones = '';
            let aditivos = '';
            let vitrinas = '';

            let ganancias = 0

            if(servicio_nuevo.productos_array){
              for (var i = 0; i < servicio_nuevo.productos_array.length; i++) {
                  if (servicio_nuevo.productos_array[i].aceite) {
                    aceites = aceites + servicio_nuevo.productos_array[i].aceite + ' ';
                    vehAct.cambio_aceite = true;
                    vehAct.aceite_km_actual = servicio_nuevo.aceite_km_actual;
                    vehAct.aceite_km_proximo = servicio_nuevo.aceite_km_proximo;
                  }
                  if (servicio_nuevo.productos_array[i].aceite1) {
                    aceites = aceites + servicio_nuevo.productos_array[i].aceite1 + ' ';
                    vehAct.cambio_aceite = true;
                    vehAct.aceite_km_actual = servicio_nuevo.aceite_km_actual;
                    vehAct.aceite_km_proximo = servicio_nuevo.aceite_km_proximo;
                  }
                  if (servicio_nuevo.productos_array[i].aceite2) {
                    aceites = aceites + servicio_nuevo.productos_array[i].aceite2 + ' ';
                    vehAct.cambio_aceite = true;
                    vehAct.aceite_km_actual = servicio_nuevo.aceite_km_actual;
                    vehAct.aceite_km_proximo = servicio_nuevo.aceite_km_proximo;
                  }
                  if (servicio_nuevo.productos_array[i].aceite3) {
                    aceites = aceites + servicio_nuevo.productos_array[i].aceite3 + ' ';
                    vehAct.cambio_aceite = true;
                    vehAct.aceite_km_actual = servicio_nuevo.aceite_km_actual;
                    vehAct.aceite_km_proximo = servicio_nuevo.aceite_km_proximo;
                  }
                  if (servicio_nuevo.productos_array[i].aceite4) {
                    aceites = aceites + servicio_nuevo.productos_array[i].aceite4 + ' ';
                    vehAct.cambio_aceite = true;
                    vehAct.aceite_km_actual = servicio_nuevo.aceite_km_actual;
                    vehAct.aceite_km_proximo = servicio_nuevo.aceite_km_proximo;
                  }

                  if (servicio_nuevo.productos_array[i].filtro_aire1) {
                    filtrosAire = filtrosAire + servicio_nuevo.productos_array[i].filtro_aire1 + ' ';
                    vehAct.cambio_filtro_aire = true;
                  }
                  if (servicio_nuevo.productos_array[i].filtro_aire2) {
                    filtrosAire = filtrosAire + servicio_nuevo.productos_array[i].filtro_aire2 + ' ';
                    vehAct.cambio_filtro_aire = true;
                  }

                  if (servicio_nuevo.productos_array[i].filtro_aceite1) {
                    filtrosAceite = filtrosAceite + servicio_nuevo.productos_array[i].filtro_aceite1 + ' ';
                    vehAct.cambio_filtro_aceite = true;
                  }
                  if (servicio_nuevo.productos_array[i].filtro_aceite2) {
                    filtrosAceite = filtrosAceite + servicio_nuevo.productos_array[i].filtro_aceite2 + ' ';
                    vehAct.cambio_filtro_aceite = true;
                  }

                  if (servicio_nuevo.productos_array[i].filtro_combustible1) {
                    filtrosCombustible = filtrosCombustible + servicio_nuevo.productos_array[i].filtro_combustible1 + ' ';
                    vehAct.cambio_filtro_combustible = true;
                  }
                  if (servicio_nuevo.productos_array[i].filtro_combustible2) {
                    filtrosCombustible = filtrosCombustible + servicio_nuevo.productos_array[i].filtro_combustible2 + ' ';
                    vehAct.cambio_filtro_combustible = true;
                  }
                  if (servicio_nuevo.productos_array[i].filtro_combustible3) {
                    filtrosCombustible = filtrosCombustible + servicio_nuevo.productos_array[i].filtro_combustible3 + ' ';
                    vehAct.cambio_filtro_combustible = true;
                  }

                  if (servicio_nuevo.productos_array[i].filtro_cabina) {
                    cabinas = cabinas + servicio_nuevo.productos_array[i].filtro_cabina + ' ';
                    vehAct.cambio_filtro_cabina = true;
                  }

                  if (servicio_nuevo.productos_array[i].caja1) {
                    cajas = cajas + servicio_nuevo.productos_array[i].caja1 + ' ';
                    vehAct.cambio_caja = true;
                    vehAct.caja_km_actual = servicio_nuevo.caja_km_actual;
                    vehAct.caja_km_proximo = servicio_nuevo.caja_km_proximo;
                  }

                  if (servicio_nuevo.productos_array[i].caja2) {
                    cajas = cajas + servicio_nuevo.productos_array[i].caja2 + ' ';
                    vehAct.cambio_caja = true;
                    vehAct.caja_km_actual = servicio_nuevo.caja_km_actual;
                    vehAct.caja_km_proximo = servicio_nuevo.caja_km_proximo;
                  }

                  if (servicio_nuevo.productos_array[i].transmision1) {
                    transmisiones = transmisiones + servicio_nuevo.productos_array[i].transmision1 + ' ';
                    vehAct.cambio_transmision = true;
                    vehAct.transmision_km_actual = servicio_nuevo.transmision_km_actual;
                    vehAct.transmision_km_proximo = servicio_nuevo.transmision_km_proximo;
                  }
                  if (servicio_nuevo.productos_array[i].transmision2) {
                    transmisiones = transmisiones + servicio_nuevo.productos_array[i].transmision2 + ' ';
                    vehAct.cambio_transmision = true;
                    vehAct.transmision_km_actual = servicio_nuevo.transmision_km_actual;
                    vehAct.transmision_km_proximo = servicio_nuevo.transmision_km_proximo;
                  }

                  if (servicio_nuevo.productos_array[i].aditivo1) {
                    aditivos = aditivos + servicio_nuevo.productos_array[i].aditivo1 + ' ';
                    vehAct.cambio_aditivo = true;
                  }
                  if (servicio_nuevo.productos_array[i].aditivo2) {
                    aditivos = aditivos + servicio_nuevo.productos_array[i].aditivo2 + ' ';
                    vehAct.cambio_aditivo = true;
                  }
                  if (servicio_nuevo.productos_array[i].aditivo3) {
                    aditivos = aditivos + servicio_nuevo.productos_array[i].aditivo3 + ' ';
                    vehAct.cambio_aditivo = true;
                  }
                  if (servicio_nuevo.productos_array[i].aditivo4) {
                    aditivos = aditivos + servicio_nuevo.productos_array[i].aditivo4 + ' ';
                    vehAct.cambio_aditivo = true;
                  }

                  if (servicio_nuevo.productos_array[i].vitrina1) {
                    vitrinas = vitrinas + servicio_nuevo.productos_array[i].vitrina1 + ' ';
                    vehAct.cambio_vitrina = true;
                  }
                  if (servicio_nuevo.productos_array[i].vitrina2) {
                    vitrinas = vitrinas + servicio_nuevo.productos_array[i].vitrina2 + ' ';
                    vehAct.cambio_vitrina = true;
                  }
                  if (servicio_nuevo.productos_array[i].vitrina3) {
                    vitrinas = vitrinas + servicio_nuevo.productos_array[i].vitrina3 + ' ';
                    vehAct.cambio_vitrina = true;
                  }
                  if (servicio_nuevo.productos_array[i].vitrina4) {
                    vitrinas = vitrinas + servicio_nuevo.productos_array[i].vitrina4 + ' ';
                    vehAct.cambio_vitrina = true;
                  }
                }

                vehAct.aceite = aceites;
                vehAct.filtro_aceite = filtrosAceite;
                vehAct.filtro_aire = filtrosAire;
                vehAct.filtro_combustible = filtrosCombustible;
                vehAct.caja = cajas;
                vehAct.transmision = transmisiones;
                vehAct.aditivo = aditivos;
                vehAct.vitrina = vitrinas;
                vehAct.filtro_cabina = cabinas;
            }

            vehAct.fecha_modif_vh = fecha;

            models.Vehiculo.updateOne(
              { _id: servicio_nuevo.vehiculo_idVehiculo},
              { $set: vehAct},
              (err, doc) => {
                if (err) {
                  return res.status(404).send({
                    success: false,
                    message: 'Vehiculo no encontrado',
                  });
                }

                let placa = vehAct.placa_vh;

                let servicio_placa_cliente = new models.ServicioPlacaCliente({
                  fecha_inicial_svcio: servicio_nuevo.fecha_inicial_svcio,
                  fecha_letras_svcio: fecha,
                  nro_factura_svcio: servicio_nuevo.nro_factura_svcio,
                  estado_pago_svcio: servicio_nuevo.estado_pago_svcio,
                  servicio_idServicio: servicio_nuevo._id,
                  placa_vh: placa,
                  nombres_cliente: "",
                  apellidos_cliente: "",
                  cc_cliente: "",
                  total_precio_condescuento: servicio_nuevo.total_precio_condescuento,
                  valor_cancelado_svcio: servicio_nuevo.valor_cancelado_svcio
                });

                models.Cliente.findOne({_id: servicio_nuevo.cliente_idCliente}, (err, cliAct) => {
                  if (err) {
                    //console.log("error retornando clientes");
                    return res.status(403).send({
                      success: false,
                      message: "error retornando clientes. Reintente"
                    });
                  }

                  let nombres = cliAct.nombres_cliente;
                  let apellidos = cliAct.apellidos_cliente;
                  let cc = cliAct.cc_cliente;

                  servicio_placa_cliente.nombres_cliente = nombres;
                  servicio_placa_cliente.apellidos_cliente = apellidos;
                  servicio_placa_cliente.cc_cliente = cc;
                  servicio_placa_cliente.fecha_letras_svcio = fecha;

                  //console.log(servicio_placa_cliente);
                  servicio_placa_cliente.save((err) => {
                    if (err) {
                      //console.log(`error guardar Servicio: ${err}`);
                      return res.status(403).send({
                        success: false,
                        message: "Servicio no agregado. Reintente"
                      })
                    }
                    //console.log(servicio_nuevo.estado_pago_svcio);
                    if (servicio_nuevo.estado_pago_svcio == "credito") {

                      let total = servicio_nuevo.total_precio_condescuento;
                      let pagoActual = servicio_nuevo.valor_cancelado_svcio;
                      let idServicio = servicio_nuevo._id;


                      if (total != pagoActual) {
                        request.post('http://localhost:5000/api/v1/credito/', {
                          json: {
                            total_cr: total,
                            saldo_cr: total - pagoActual,
                            pago_cr: pagoActual,
                            servicios_idServicio: idServicio
                          }
                        }, (error, res2, body) => {
                          if (error) {
                            //console.error(error)
                            return;
                          }
                  //        console.log(`statusCode: ${res.statusCode}`)
                  //        console.log("Credito agregado")
                          return;
                        });
                      }
                    }


                    return res.status(201).send({
                      success: true,
                      message: "Servicio agregado",
                      servicio_nuevo
                    })
                  });
                });
              });
            });
            }
          })
        });

        }
    });

  }

  //obtener Servicio por Id
  getOneServicio(req, res){

    if (!req.params.id) {
     return res.status(400).send({
       success: false,
       message: 'id es requerido',
       });
     }

    let id = req.params.id;
    //console.log(id)

    models.Servicio.findOne({ _id: id }, (err, doc) => {
      if (err) {
        //console.log("error retornando servicio por id");
        return res.status(403).send({
          success: false,
          message: 'error retornando servicio por id'
        });
      }
      if (doc !== null) {
        let servicio = doc;
        return res.status(200).send({
          success: true,
          message: 'Servicio encontrado exitosamente',
          servicio,
        });
      }
      else {
        //console.log("servicio no encontrado")
        return res.status(404).send({
          success: false,
          message: 'Servicio no encontrado',
        });
      }
    });
  }

  //obtener Servicio por Id
  getOneServicioCompletoByIdCliente(req, res){

    if (!req.params.idCliente) {
     return res.status(400).send({
       success: false,
       message: 'idCliente es requerido',
       });
     }

    let idCliente = req.params.idCliente;
    //console.log(idCliente)

    models.Cliente.findOne({ _id: idCliente }, (err, doc) => {
      if (err) {
        //console.log("error retornando servicio por id");
        return res.status(403).send({
          success: false,
          message: 'error retornando cliente'
        });
      }
      if (doc !== null) {
        let cc_cliente_var = doc.cc_cliente;
        models.ServicioPlacaCliente.find({ cc_cliente: cc_cliente_var }, (err, docSer) => {
          if (err) {
            return res.status(403).send({
              success: false,
              message: 'error retornando servicio completo'
            });
          }
          if (docSer !== null) {
            let serviciosCompletos = docSer;

            return res.status(200).send({
              success: true,
              message: 'Servicio completo encontrado exitosamente',
              serviciosCompletos,
            });
          }
      });
    }
  })
}


  //eliminar servicio por Id
  deleteOneServicio(req, res){

    if (!req.params.id) {
     return res.status(400).send({
       success: false,
       message: 'id es requerido',
       });
     }

    let id = req.params.id;
    models.Servicio.deleteOne({ _id: id}, (err, doc) => {
      if (err) {
        return res.status(404).send({
          success: false,
          message: 'Servicio no encontrado',
        });
      }
      models.ServicioPlacaCliente.deleteOne({ servicio_idServicio: id}, (err, docSrv) => {
        if (err) {
          return res.status(404).send({
            success: false,
            message: 'Servicio placa cliente no encontrado',
          });
        } 

        models.Entrada.deleteMany({ servicios_idServicio: id}, (err, docEl) => {
          if (err) {
            return res.status(404).send({
              success: false,
              message: 'Entrada no encontrado',
            });
          }

          models.Credito.deleteMany({ servicios_idServicio: id}, (err, doc) => {
                return res.status(200).send({
                success: true,
                message: 'Credito eliminado exitosamente',
            });
          });
        });
      });

    });
  }


   //obtener todos los servicios con vehiculo y cliente
   getAllServiciosClienteVehiculo(req, res){
     models.ServicioPlacaCliente.find({}, (err, doc) => {
     if (err) {
       console.log("error retornando servicios cliente placa");
       return;
     }
     if (doc !== null) {

       let serviciosAux = doc;
       //console.log(serviciosAux);
       let serviciosPlacaCliente = [];
       for (var i = serviciosAux.length - 1; i >= 0; i--) {
         serviciosPlacaCliente.push(serviciosAux[i]);
       }
       //console.log("listado de servicios");
       //console.log(doc);
       return res.status(200).send({
         success: true,
         message: 'Servicios recibidos satisfactoriamente',
         serviciosPlacaCliente,
       });
     }
     else {
       console.log("serviciosPlacaCliente no encontrados")
       return res.status(404).send({
         success: false,
         message: 'Fallo retorno serviciosPlacaCliente'
       });
     }
   }
 )}

//servicios por cliente
getServiciosByCliente(req, res){

  if (!req.params.cc) {
   return res.status(400).send({
     success: false,
     message: 'cc es requerido',
     });
   }

  let cc = req.params.cc;

  models.ServicioPlacaCliente.find({ cc_cliente: cc }, (err, doc) => {
  if (err) {
    console.log("error retornando servicios cliente placa");
    return;
  }
  if (doc !== null) {
    let serviciosPlacaCliente = doc;
    //console.log("listado de servicios");
    //console.log(doc);
    return res.status(200).send({
      success: true,
      message: 'Servicios por cc cliente recibidos satisfactoriamente',
      serviciosPlacaCliente,
    });
  }
  else {
    console.log("serviciosPlacaCliente no encontrados")
    return res.status(404).send({
      success: false,
      message: 'Fallo retorno serviciosPlacaCliente'
    });
  }
}
)}


}

const vehiculoController = new VehiculoController();
export default vehiculoController;
