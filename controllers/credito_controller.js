var models = require('../models');
models.connectToDataBase();

var currentDate = new Date();
var date = currentDate.getDate();
var month = currentDate.getMonth(); //Be careful! January is 0 not 1
var strMonts = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
var monthName = strMonts[month]
var year = currentDate.getFullYear();

let fecha = date + monthName + year;

class CreditoController {

  //obtener todos los creditos
  getAllcreditos(req, res){

    models.Credito.find({}, (err, doc) => {
      if (err) {
        console.log("error retornando creditos");
        return;
      }
      if (doc !== null) {
        let creditosAux = doc;
        let creditos = [];
        for (var i = creditosAux.length - 1; i > 0; i--) {
          creditos.push(creditosAux[i]);
        }

        //console.log("listado de creditos");
        //console.log(doc);
        return res.status(200).send({
          success: true,
          message: 'creditos recibidos satisfactoriamente',
          creditos,
        });
      }
      else {
        console.log("creditos no encontrados")
        return res.status(404).send({
          success: false,
          message: 'Fallo retorno creditos'
        });
      }
    });

  }

  //Agregar cr'edito
  addcredito(req, res){

    if (!req.body.servicios_idServicio) {
      return res.status(400).send({
        success: false,
        message: "servicios_idServicio requerido"
      });
    }

    if (!req.body.total_cr) {
      return res.status(400).send({
        success: false,
        message: "total_cr requerido"
      });
    }

    if (!req.body.pago_cr || req.body.pago_cr == 0) {
      req.body.pago_cr = 0;
    }

    //console.log("req.body")
    //console.log(req.body)
    let credito_nuevo = new models.Credito({
      total_cr: req.body.total_cr,
      pago_cr: req.body.pago_cr,
      fecha_letras_cr: fecha,
      servicios_idServicio: req.body.servicios_idServicio || ""
    });

    let saldo = req.body.total_cr - req.body.pago_cr;
    credito_nuevo.saldo_cr = saldo;

    if (saldo <= 0) {
      return res.status(201).send({
        success: false,
        message: "credito ya est'a pago."
      });
    }

    credito_nuevo.save((err) => {
      if (err) {
        //console.log(`error guardar credito: ${err}`);
        return res.status(403).send({
          success: false,
          message: "credito no agregado. Reintente"
        });
      }
      else {
        //console.log(`guardar credito: OK`);
        return res.status(201).send({
          success: true,
          message: "credito agregado",
          credito_nuevo
        });
      }
    });
  }

  //obtener credito por Id
  getOnecredito(req, res){

    if (!req.params.id) {
     return res.status(400).send({
       success: false,
       message: 'id es requerido',
       });
     }

    let id = req.params.id;
    //console.log(id)

    models.Credito.findOne({ _id: id }, (err, doc) => {
      if (err) {
        //console.log("error retornando credito por id");
        return res.status(403).send({
          success: false,
          message: 'error retornando credito por id'
        });
      }
      if (doc !== null) {
        let credito = doc;
        return res.status(200).send({
          success: true,
          message: 'credito encontrado exitosamente',
          credito,
        });
      }
      else {
        //console.log("credito no encontrado")
        return res.status(404).send({
          success: false,
          message: 'credito no encontrado',
        });
      }
    });
  }

  //eliminar credito por Id
  deleteOnecredito(req, res){

    if (!req.params.id) {
     return res.status(400).send({
       success: false,
       message: 'id es requerido',
       });
     }

    let id = req.params.id;
    models.Credito.deleteOne({ _id: id}, (err, doc) => {
      if (err) {
        return res.status(404).send({
          success: false,
          message: 'credito no encontrado',
        });
      }
      //console.log("credito eliminado");
      return res.status(200).send({
        success: true,
        message: 'credito eliminado exitosamente',
      });
    })
  }

  //actualizar credito por Id
  updatecredito(req, res){

    if (!req.params.id) {
     return res.status(400).send({
       success: false,
       message: 'id es requerido',
       });
     }

     let id = req.params.id;
     models.Credito.findOne({ _id: id }, (err, doc) => {
       if (err) {
         //console.log("error retornando credito por id");
         return res.status(403).send({
           success: false,
           message: 'id no encontrado en creditos'
         });
       }
       if (doc !== null) {
         let creditoViejo = doc;
         let saldo = creditoViejo.saldo_cr;
         let pago = req.body.pago_cr;

         if (pago > saldo) {
           creditoViejo.saldo_cr = (pago - saldo) * (-1);
         } else {
           creditoViejo.saldo_cr = saldo - pago;
         }

         creditoViejo.pago_cr = pago;
         creditoViejo.fecha_letras_cr = fecha;

         models.Credito.updateOne(
           { _id: id},
           { $set: creditoViejo},
           (err, doc) => {
             if (err) {
               return res.status(404).send({
                 success: false,
                 message: 'credito no encontrado',
               });
             }
             return res.status(201).send({
               success: true,
               message: 'credito actualizado satisfactoriamente',
               creditoViejo
             });
           }
         )
       }
       else {
         //console.log("credito no encontrado")
         return res.status(404).send({
           success: false,
           message: 'credito detalle no encontrado',
         });
       }
     })
   }

   //obtener credito por placa
   getOnecreditoPlaca(req, res){

     if (!req.params.placa) {
      return res.status(400).send({
        success: false,
        message: 'placa es requerido',
        });
      }

     let placa = req.params.placa;
     //console.log(placa)

     models.Vehiculo.findOne({ placa_vh: placa}, (err, doc) => {
       if (err) {
         //console.log("error retornando vehiculo por placa");
         return res.status(403).send({
           success: false,
           message: 'error retornando vehiculo por placa'
         });
       }
       if (doc !== null) {
         //console.log(doc);
         let idCliente = doc.cliente_idCliente;
         let idVehiculo = doc._id;

         models.Servicio.find({vehiculo_idVehiculo: idVehiculo}, (err, doc2) => {
           if (err) {
             //console.log("error retornando servicio por vehiculo");
             return res.status(403).send({
               success: false,
               message: 'error retornando servicio por vehiculo'
             });
           }
           if (doc2 != null) {
             //console.log(doc2);
             let servicios = [];
             for (var i = 0; i < doc2.length; i++) {
               let id_svcio = doc2[i]._id;
               servicios.push([
                 {"id_svcio": id_svcio},
               ])
             }

             let servicios_ids = servicios;

             let idServicios = "[";
             for (var i = 0; i < servicios_ids.length; i++) {
               //idServicios.push([servicios_ids[i][0].id_svcio])
               if (i == servicios_ids.length - 1) {
                 idServicios = idServicios + '{ "servicios_idServicio":"' + servicios_ids[i][0].id_svcio + '"}';
               } else {
                  idServicios = idServicios + '{ "servicios_idServicio":"' + servicios_ids[i][0].id_svcio + '"},';
               }
             }
             idServicios = idServicios + "]";
             models.Credito.find({ $or: JSON.parse(idServicios)},
              (err3, doc3) => {
                if (err3) {
                  //console.log("error retornando creidito por vehiculo");
                  return res.status(403).send({
                    success: false,
                    message: 'error retornando credito por vehiculo'
                  });
                }
                let creditos = doc3;
                if (doc3 != null) {
                  return res.status(201).send({
                    success: true,
                    creditos
                  });
                }
             });
           }
         });
       }
     })

    /* models.Credito.findOne({ _id: id }, (err, doc) => {
       if (err) {
         //console.log("error retornando credito por id");
         return res.status(403).send({
           success: false,
           message: 'error retornando credito por id'
         });
       }
       if (doc !== null) {
         let credito = doc;
         return res.status(200).send({
           success: true,
           message: 'credito encontrado exitosamente',
           credito,
         });
       }
       else {
         //console.log("credito no encontrado")
         return res.status(404).send({
           success: false,
           message: 'credito no encontrado',
         });
       }
     });*/
   }


   //obtener credito por placa
   getOnecreditoPlaca(req, res){

     if (!req.params.placa) {
      return res.status(400).send({
        success: false,
        message: 'placa es requerido',
        });
      }

     let placa = req.params.placa;
     //console.log(placa)

     models.Vehiculo.findOne({ placa_vh: placa}, (err, doc) => {
       if (err) {
         //console.log("error retornando vehiculo por placa");
         return res.status(403).send({
           success: false,
           message: 'error retornando vehiculo por placa'
         });
       }
       if (doc !== null) {
         //console.log(doc);
         let idCliente = doc.cliente_idCliente;
         let idVehiculo = doc._id;

         models.Servicio.find({vehiculo_idVehiculo: idVehiculo}, (err, doc2) => {
           if (err) {
             //console.log("error retornando servicio por vehiculo");
             return res.status(403).send({
               success: false,
               message: 'error retornando servicio por vehiculo'
             });
           }
           if (doc2 != null) {
             //console.log(doc2);
             let servicios = [];
             for (var i = 0; i < doc2.length; i++) {
               let id_svcio = doc2[i]._id;
               servicios.push([
                 {"id_svcio": id_svcio},
               ])
             }

             let servicios_ids = servicios;

             let idServicios = "[";
             for (var i = 0; i < servicios_ids.length; i++) {
               //idServicios.push([servicios_ids[i][0].id_svcio])
               if (i == servicios_ids.length - 1) {
                 idServicios = idServicios + '{ "servicios_idServicio":"' + servicios_ids[i][0].id_svcio + '"}';
               } else {
                  idServicios = idServicios + '{ "servicios_idServicio":"' + servicios_ids[i][0].id_svcio + '"},';
               }
             }
             idServicios = idServicios + "]";
             models.Credito.find({ $or: JSON.parse(idServicios)},
              (err3, doc3) => {
                if (err3) {
                  //console.log("error retornando creidito por vehiculo");
                  return res.status(403).send({
                    success: false,
                    message: 'error retornando credito por vehiculo'
                  });
                }
                let creditos = doc3;
                if (doc3 != null) {
                  return res.status(201).send({
                    success: true,
                    creditos
                  });
                }
             });
           }
         });
       }
     });
   }

  //pagar ccuota
  pagarCuota(req, res){

     if (!req.body.servicios_idServicio) {
      return res.status(400).send({
        success: false,
        message: 'servicios_idServicio es requerido',
        });
      }

      if (!req.body.pago_cr) {
       return res.status(400).send({
         success: false,
         message: 'pago_cr es requerido',
         });
       }

      let idServicio = req.body.servicios_idServicio;
      //console.log(idServicio);
      models.Credito.find({ servicios_idServicio: idServicio }, (err, doc) => {

        if (err) {
          //console.log("error retornando credito por id");
          return res.status(403).send({
            success: false,
            message: 'idServicio no encontrado en creditos'
          });
        }

        let creditoReg = doc[doc.length - 1];
        let totalCr = creditoReg.total_cr;
        let pagoCr = req.body.pago_cr;
        let idServicio = req.body.servicios_idServicio;
        let idCredito = creditoReg._id;
        let saldoCr = creditoReg.saldo_cr - pagoCr;

        let cuota_credito = new models.Credito({
          total_cr: totalCr,
          pago_cr: pagoCr,
          fecha_letras_cr: fecha,
          saldo_cr: saldoCr,
          servicios_idServicio: idServicio
        });

        cuota_credito.save((err) => {
          if (err) {
            //console.log(`error guardar credito: ${err}`);
            return res.status(403).send({
              success: false,
              message: "cuota no paga"
            });
          }

          let valorCanceladoSvcio = cuota_credito.total_cr - cuota_credito.saldo_cr;

          models.Servicio.updateOne(
            { _id: cuota_credito.servicios_idServicio},
            { $set: {"valor_cancelado_svcio": valorCanceladoSvcio, fecha_letras_svcio: fecha}},
            (err, doc) => {
              if (err) {
                return res.status(404).send({
                  success: false,
                  message: 'servicio no encontrado',
                });
              }

              models.ServicioPlacaCliente.updateOne(
                { servicio_idServicio: cuota_credito.servicios_idServicio},
                { $set: {"valor_cancelado_svcio": valorCanceladoSvcio, "fecha_letras_svcio": fecha}},
                (err, doc) => {
                  if (err) {
                    return res.status(404).send({
                      success: false,
                      message: 'servicio completo no encontrado',
                    });
                  }
                  if (doc !== null) {

                    let entradaNva = new models.Entrada({
                      fecha_letras_en: fecha,
                      valor_ent: cuota_credito.pago_cr,
                      servicios_idServicio: cuota_credito.servicios_idServicio
                    });

              /*      entradaNva.save((err) => {
                      if (err) {
                        console.log(`error guardar entrada: ${err}`);
                        return res.status(403).send({
                          success: false,
                          message: "Entrada no agregada. Reintente"
                        })
                      }
                      //console.log(`guardar credito: OK`);
                      return res.status(201).send({
                        success: true,
                        message: "cuota paga",
                        cuota_credito
                      });
                    })*/
                  }
              })
            });
        });
      });
    }

    //obtener credito por placa
    getOnecreditoByServicio(req, res){

      if (!req.params.idservicio) {
       return res.status(400).send({
         success: false,
         message: 'idservicio es requerido',
         });
       }

      let idservicio = req.params.idservicio;
      //console.log(idservicio)

      models.Credito.find({ servicios_idServicio: idservicio}, (err, doc) => {
        if (err) {
          //console.log("error retornando vehiculo por placa");
          return res.status(403).send({
            success: false,
            message: 'error retornando creditos por id servicio'
          });
        }
        if (doc !== null) {
          let credito = doc;
          return res.status(201).send({
            success: true,
            message: 'credito por servicio',
            credito
          });
        } else {
          return res.status(403).send({
            success: false,
            message: 'credito no encontrado'
          });
        }
      })
    }

}

const creditoController = new CreditoController();
export default creditoController;
