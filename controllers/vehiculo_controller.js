var models = require('../models');
models.connectToDataBase();

var currentDate = new Date();
var date = currentDate.getDate();
var month = currentDate.getMonth(); //Be careful! January is 0 not 1
var strMonts = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
var monthName = strMonts[month]
var year = currentDate.getFullYear();

let fecha = date + monthName + year;

class VehiculoController {

  //obtener todos los vehiculos
  getAllVehiculos(req, res){

    models.Vehiculo.find({}, (err, doc) => {
      if (err) {
        console.log("error retornando vehiculos");
        return;
      }
      if (doc !== null) {
        let vehiculos = doc;
        //console.log("listado de vehiculos");
        //console.log(doc);
        return res.status(200).send({
          success: true,
          message: 'Vehículos recibidos satisfactoriamente',
          vehiculos,
        });
      }
      else {
        console.log("Vehículos no encontrados")
        return res.status(404).send({
          success: false,
          message: 'Fallo retorno Vehículos'
        });
      }
    });

  }

  //Guardar vehiculos
  addVehiculo(req, res){

    if (!req.body.placa_vh) {
      return res.status(400).send({
        success: false,
        message: "placa_vh requerido"
      });
    }

    if (!req.body.cliente_idCliente) {
      return res.status(400).send({
        success: false,
        message: "cliente_idCliente requerido"
      });
    }

    if (!req.body.tipoVehiculos) {
      return res.status(400).send({
        success: false,
        message: "tipoVehiculos requerido"
      });
    }

    //console.log("req.body")
    //console.log(req.body)

    let vehiculo_nuevo = new models.Vehiculo({
      fecha_modif_vh: fecha,
      placa_vh: req.body.placa_vh || "",
      marca_vh: req.body.marca_vh || "",
      modelo_vh: req.body.modelo_vh || "",
      otros_vh: req.body.otros_vh || "",
      tipoVehiculos: req.body.tipoVehiculos || "automovil",
      cliente_idCliente: req.body.cliente_idCliente || "1",
      aceite: req.body.aceite || "sin aceite",
      filtro_aceite: req.body.filtro_aceite || "sin filtro_aceite",
      filtro_aire: req.body.filtro_aire || "sin filtro_aire",
      filtro_combustible: req.body.filtro_combustible || "sin filtro_combustible",
      filtro_cabina: req.body.filtro_cabina || "sin filtro_cabina",
      caja: req.body.caja || "sin caja",
      transmision: req.body.transmision || "sin transmision",
      aditivo: req.body.aditivo || "sin aditivo",
      vitrina: req.body.vitrina || "sin vitrina",
      aceite_km_actual: req.body.aceite_km_actual || "",
      aceite_km_proximo: req.body.aceite_km_proximo || "",
      caja_km_actual: req.body.caja_km_actual || "",
      caja_km_proximo: req.body.caja_km_proximo || "",
      transmision_km_actual: req.body.transmision_km_actual || "",
      transmision_km_proximo: req.body.transmision_km_proximo || ""
    })

    vehiculo_nuevo.save((err) => {
      if (err) {
        console.log(`error guardar vehiculo: ${err}`);
        return res.status(403).send({
          success: false,
          message: "Veh'iculo no agregado. Reintente"
        })
      }
      else {
        //console.log(`guardar cliente: OK`);
        return res.status(201).send({
          success: true,
          message: "Veh'iculo agregado",
          vehiculo_nuevo
        });
      }
    });

  }


  //obtener vehiculo por Id
  getOneVehiculo(req, res){

    if (!req.params.id) {
     return res.status(400).send({
       success: false,
       message: 'id es requerido',
       });
     }

    let id = req.params.id;
    //console.log(id)

    models.Vehiculo.findOne({ _id: id }, (err, doc) => {
      if (err) {
        //console.log("error retornando vehiculo por id");
        return res.status(403).send({
          success: false,
          message: 'error retornando vehiculo por id'
        });
      }
      if (doc !== null) {
        let vehiculo = doc;
        return res.status(200).send({
          success: true,
          message: 'Vehiculo encontrado exitosamente',
          vehiculo,
        });
      }
      else {
        //console.log("vehiculo no encontrado")
        return res.status(404).send({
          success: false,
          message: 'Vehiculo no encontrado',
        });
      }
    });
  }


  //eliminar vehiculo por Id
  deleteOneVehiculo(req, res){

    if (!req.params.id) {
     return res.status(400).send({
       success: false,
       message: 'id es requerido',
       });
     }

    let id = req.params.id;
    models.Vehiculo.deleteOne({ _id: id}, (err, doc) => {
      if (err) {
        return res.status(404).send({
          success: false,
          message: 'Vehiculo no encontrado',
        });
      }
      //console.log("vehiculo eliminado");
      return res.status(200).send({
        success: true,
        message: 'Vehiculo eliminado exitosamente',
      });
    })
  }


  //actualizar vehiculo por Id
  updateVehiculo(req, res){

    if (!req.params.id) {
     return res.status(400).send({
       success: false,
       message: 'id es requerido',
       });
     }

     let id = req.params.id;
     models.Vehiculo.findOne({ _id: id }, (err, doc) => {
       if (err) {
         //console.log("error retornando vehiculo por id");
         return res.status(403).send({
           success: false,
           message: 'id no encontrado en vehiculos'
         });
       }
       if (doc !== null) {
         let vehiculoViejo = doc;

         if (req.body.placa_vh != vehiculoViejo.placa_vh) {
           vehiculoViejo.placa_vh = req.body.placa_vh
         }
         if (req.body.marca_vh != vehiculoViejo.marca_vh) {
           vehiculoViejo.marca_vh = req.body.marca_vh
         }
         if (req.body.modelo_vh != vehiculoViejo.modelo_vh) {
           vehiculoViejo.modelo_vh = req.body.modelo_vh
         }
         if (req.body.otros_vh != vehiculoViejo.otros_vh) {
           vehiculoViejo.otros_vh = req.body.otros_vh
         }
         if (req.body.tipoVehiculos != vehiculoViejo.tipoVehiculos) {
           vehiculoViejo.tipoVehiculos = req.body.tipoVehiculos
         }
         if (req.body.cliente_idCliente != vehiculoViejo.cliente_idCliente) {
           vehiculoViejo.cliente_idCliente = req.body.cliente_idCliente
         }

         if (req.body.aceite != vehiculoViejo.aceite) {
           vehiculoViejo.aceite = req.body.aceite
         }
         if (req.body.filtro_aceite != vehiculoViejo.filtro_aceite) {
           vehiculoViejo.filtro_aceite = req.body.filtro_aceite
         }
         if (req.body.filtro_aire != vehiculoViejo.filtro_aire) {
           vehiculoViejo.filtro_aire = req.body.filtro_aire
         }
         if (req.body.filtro_combustible != vehiculoViejo.filtro_combustible) {
           vehiculoViejo.filtro_combustible = req.body.filtro_combustible
         }
         if (req.body.filtro_cabina != vehiculoViejo.filtro_cabina) {
           vehiculoViejo.filtro_cabina = req.body.filtro_cabina
         }
         if (req.body.caja != vehiculoViejo.caja) {
           vehiculoViejo.caja = req.body.caja
         }
         if (req.body.transmision != vehiculoViejo.transmision) {
           vehiculoViejo.transmision = req.body.transmision
         }
         if (req.body.aditivo != vehiculoViejo.aditivo) {
           vehiculoViejo.aditivo = req.body.aditivo
         }
         if (req.body.vitrina != vehiculoViejo.vitrina) {
           vehiculoViejo.vitrina = req.body.vitrina
         }

         if(req.body.aceite_km_actual != vehiculoViejo.aceite_km_actual) {
           vehiculoViejo.aceite_km_actual = req.body.aceite_km_actual
         }
         if(req.body.aceite_km_proximo != vehiculoViejo.aceite_km_proximo) {
           vehiculoViejo.aceite_km_proximo = req.body.aceite_km_proximo
         }
         if(req.body.caja_km_actual != vehiculoViejo.caja_km_actual) {
           vehiculoViejo.caja_km_actual = req.body.caja_km_actual
         }
         if(req.body.caja_km_proximo != vehiculoViejo.caja_km_proximo) {
           vehiculoViejo.caja_km_proximo = req.body.caja_km_proximo
         }
         if(req.body.transmision_km_actual != vehiculoViejo.transmision_km_actual) {
           vehiculoViejo.transmision_km_actual = req.body.transmision_km_actual
         }
         if(req.body.transmision_km_proximo != vehiculoViejo.transmision_km_proximo) {
           vehiculoViejo.transmision_km_proximo = req.body.transmision_km_proximo
         }

          vehiculoViejo.fecha_modif_vh = fecha;


         models.Vehiculo.updateOne(
           { _id: id},
           { $set: vehiculoViejo},
           (err, doc) => {
             if (err) {
               return res.status(404).send({
                 success: false,
                 message: 'Vehiculo no encontrado',
               });
             }
             return res.status(201).send({
               success: true,
               message: 'Vehiculo actualizado satisfactoriamente',
               vehiculoViejo
             });
           }
         )}
       else {
         //console.log("Vehiculo no encontrado")
         return res.status(404).send({
           success: false,
           message: 'Vehiculo detalle no encontrado',
         });
       }
     })
   }


   //obtener vehiculo y cliente por cc cliente
   getVehiculoCcCliente(req, res){

     if (!req.params.ccCliente) {
      return res.status(400).send({
        success: false,
        message: 'cc cliente es requerida',
        });
      }

     let ccCliente = req.params.ccCliente;
     //console.log(ccCliente)

     models.Cliente.findOne({ cc_cliente: ccCliente }, (err, doc) => {
       if (err) {
         //console.log("error retornando cc cliente");
         return res.status(403).send({
           success: false,
           message: 'error retornando cc cliente'
         });
       }
       if (doc !== null) {
         let cliente = doc;
         //console.log(cliente);

         let clienteId = cliente._id;
         models.Vehiculo.find({ cliente_idCliente: clienteId }, (err, doc1) => {
           if (err) {
             //console.log("error retornando vehiculo por cc cliente ln 273");
             return res.status(403).send({
               success: false,
               message: 'error retornando vehiculo por cc cliente'
             });
           }
           if (doc1 !== null) {
             let vehiculo = doc1;
             return res.status(200).send({
               success: true,
               message: 'Vehiculo encontrado exitosamente',
               vehiculo,
               cliente,
             });
           }
           else {
             //console.log("vehiculo no encontrado")
             return res.status(404).send({
               success: false,
               message: 'Vehiculo o cc no concuerdan',
             });
           }
         });
       }
       else {
         //console.log("vehiculo no encontrado")
         return res.status(404).send({
           success: false,
           message: 'Vehiculo o cc no concuerdan',
         });
       }
     });
   }

   //obtener vehiculo y cliente por placa
   getVehiculoClientePlaca(req, res){

     if (!req.params.placa) {
      return res.status(400).send({
        success: false,
        message: 'placa es requerida',
        });
      }

     let placa = req.params.placa;
     //console.log(placa)

     models.Vehiculo.findOne({ placa_vh: placa }, (err, doc) => {
       if (err) {
         //console.log("error retornando vehiculo por placa ln 273");
         return res.status(403).send({
           success: false,
           message: 'error retornando vehiculo por placa'
         });
       }
       if (doc !== null) {
         let vehiculo = doc;
         let clienteId = vehiculo.cliente_idCliente;

         models.Cliente.findOne({ _id: clienteId }, (err, doc1) => {
           if (err) {
             //console.log("error retornando cliente");
             return res.status(403).send({
               success: false,
               message: 'error retornando cliente'
             });
           }
           if (doc1 !== null) {
             let cliente = doc1;
             //console.log(cliente);
             return res.status(200).send({
               success: true,
               message: 'Vehiculo encontrado exitosamente',
               vehiculo,
               cliente,
             });
           }
           else {
             //console.log("vehiculo no encontrado")
             return res.status(404).send({
               success: false,
               message: 'Cliente y placa no concuerdan',
             });
           }
         });
       }
       else {
         //console.log("vehiculo no encontrado")
         return res.status(404).send({
           success: false,
           message: 'Vehiculo no encontrado',
         });
       }
     });


   }

}

const vehiculoController = new VehiculoController();
export default vehiculoController;
