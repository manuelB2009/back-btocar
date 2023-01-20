var models = require('../models');
models.connectToDataBase();

class ClienteController {

  //obtener todos los clientes
  getAllClientes(req, res){

    models.Cliente.find({}, (err, doc) => {
      if (err) {
        console.log("error retornando clientes");
        return;
      }
      if (doc !== null) {
        let clientes = doc;
        //console.log("listado de clientes");
        //console.log(doc);
        return res.status(200).send({
          success: true,
          message: 'Clientes recibidos satisfactoriamente',
          clientes,
        });
      }
      else {
        console.log("Clientes no encontrados")
        return res.status(404).send({
          success: false,
          message: 'Fallo retorno clientes'
        });
      }
    });

  }

  //Guardar clientes
  addCliente(req, res){

    if (!req.body.nombres_cliente) {
      return res.status(400).send({
        success: false,
        message: "nombres_cliente requerido"
      });
    }


    if (!req.body.cc_cliente) {
      return res.status(400).send({
        success: false,
        message: "cc_cliente requerido"
      });
    }

    //console.log("req.body")
    //console.log(req.body)
    models.Cliente.find({ cc_cliente: req.body.cc_cliente }, (err, docs) => {
      if (!err) {
        let numero_total_clientes = docs.length;
        if (numero_total_clientes > 0) {
          return res.status(403).send({
            success: false,
            message: "num CC ya ha sido registrado"
          })
        }

        let cliente_nuevo = new models.Cliente({
          nombres_cliente: req.body.nombres_cliente || "",
          apellidos_cliente: req.body.apellidos_cliente || "",
          cc_cliente: req.body.cc_cliente || "",
          cel_cliente: req.body.cel_cliente || "",
          correo_cliente: req.body.correo_cliente || "",
          direccion_cliente: req.body.direccion_cliente || ""
        })

        cliente_nuevo.save((err) => {
          if (err) {
            //console.log(`error guardar cliente: ${err}`);
            return res.status(403).send({
              success: false,
              message: "Cliente no agregado. Reintente"
            })
          }
          else {
            //console.log(`guardar cliente: OK`);
            return res.status(201).send({
              success: true,
              message: "cliente agregado",
              cliente_nuevo
            });
          }
        });
      }
    });
  }


  //obtener cliente por Id
  getOneCliente(req, res){

    if (!req.params.id) {
     return res.status(400).send({
       success: false,
       message: 'id es requerido',
       });
     }

    let id = req.params.id;
    //console.log(id)

    models.Cliente.findOne({ _id: id }, (err, doc) => {
      if (err) {
        //console.log("error retornando cliente por id");
        return res.status(403).send({
          success: false,
          message: 'error retornando cliente por id'
        });
      }
      if (doc !== null) {
        let cliente = doc;
        return res.status(200).send({
          success: true,
          message: 'Cliente encontrado exitosamente',
          cliente,
        });
      }
      else {
        //console.log("cliente no encontrado")
        return res.status(404).send({
          success: false,
          message: 'Cliente no encontrado',
        });
      }
    });
  }


  //eliminar cliente por Id
  deleteOneCliente(req, res){

    if (!req.params.id) {
     return res.status(400).send({
       success: false,
       message: 'id es requerido',
       });
     }

    let id = req.params.id;
    models.Cliente.deleteOne({ _id: id}, (err, doc) => {
      if (err) {
        return res.status(404).send({
          success: false,
          message: 'Cliente no encontrado',
        });
      }
      //console.log("cliente eliminado");
      return res.status(200).send({
        success: true,
        message: 'Cliente eliminado exitosamente',
      });
    })
  }


  //actualizar cliente por Id
  updateCliente(req, res){

    if (!req.params.id) {
     return res.status(400).send({
       success: false,
       message: 'id es requerido',
       });
     }

     let id = req.params.id;
     models.Cliente.findOne({ _id: id }, (err, doc) => {
       if (err) {
         //console.log("error retornando cliente por id");
         return res.status(403).send({
           success: false,
           message: 'id no encontrado en clientes'
         });
       }
       if (doc !== null) {
         let clienteViejo = doc;

         if (req.body.nombres_cliente != clienteViejo.nombres_cliente) {
           clienteViejo.nombres_cliente = req.body.nombres_cliente
         }
         if (req.body.apellidos_cliente != clienteViejo.apellidos_cliente) {
           clienteViejo.apellidos_cliente = req.body.apellidos_cliente
         }
         if (req.body.cc_cliente != clienteViejo.cc_cliente) {
           clienteViejo.cc_cliente = req.body.cc_cliente
         }
         if (req.body.cel_cliente != clienteViejo.cel_cliente) {
           clienteViejo.cel_cliente = req.body.cel_cliente
         }
         if (req.body.correo_cliente != clienteViejo.correo_cliente) {
           clienteViejo.correo_cliente = req.body.correo_cliente
         }
         if (req.body.direccion_cliente != clienteViejo.direccion_cliente) {
           clienteViejo.direccion_cliente = req.body.direccion_cliente
         }

         models.Cliente.updateOne(
           { _id: id},
           { $set: clienteViejo},
           (err, doc) => {
             if (err) {
               return res.status(404).send({
                 success: false,
                 message: 'Cliente no encontrado',
               });
             }
             return res.status(201).send({
               success: true,
               message: 'Cliente actualizado satisfactoriamente'
             });
           }
         )}
       else {
         //console.log("cliente no encontrado")
         return res.status(404).send({
           success: false,
           message: 'Cliente detalle no encontrado',
           clienteViejo,
         });
       }
     })
   }

   //obtener cliente por cc
   getOneClienteCc(req, res){

     if (!req.params.cc) {
      return res.status(400).send({
        success: false,
        message: 'id es requerido',
        });
      }

     let cc = req.params.cc;
     //console.log(id)

     models.Cliente.findOne({ cc_cliente: cc }, (err, doc) => {
       if (err) {
         //console.log("error retornando cliente por id");
         return res.status(403).send({
           success: false,
           message: 'error retornando cliente por cc'
         });
       }
       if (doc !== null) {
         let cliente = doc;
         return res.status(200).send({
           success: true,
           message: 'Cliente encontrado exitosamente',
           cliente,
         });
       }
       else {
         //console.log("cliente no encontrado")
         return res.status(404).send({
           success: false,
           message: 'Cliente no encontrado',
         });
       }
     });
   }


   //eliminar cliente por cc
   deleteOneClienteCc(req, res){

     if (!req.params.cc) {
      return res.status(400).send({
        success: false,
        message: 'id es requerido',
        });
      }

     let cc = req.params.cc;
     models.Cliente.deleteOne({ cc_cliente: cc}, (err, doc) => {
       if (err) {
         return res.status(404).send({
           success: false,
           message: 'Cliente no encontrado',
         });
       }
       //console.log("cliente eliminado");
       return res.status(200).send({
         success: true,
         message: 'Cliente eliminado exitosamente',
       });
     })
   }


   //actualizar cliente por cc
   updateClienteCc(req, res){

     if (!req.params.cc) {
      return res.status(400).send({
        success: false,
        message: 'cc es requerido',
        });
      }

      let cc = req.params.cc;
      models.Cliente.findOne({ cc_cliente: cc }, (err, doc) => {
        if (err) {
          //console.log("error retornando cliente por id");
          return res.status(403).send({
            success: false,
            message: 'cc no encontrado en clientes'
          });
        }
        if (doc !== null) {
          let clienteViejo = doc;

          if (req.body.nombres_cliente != clienteViejo.nombres_cliente) {
            clienteViejo.nombres_cliente = req.body.nombres_cliente
          }
          if (req.body.apellidos_cliente != clienteViejo.apellidos_cliente) {
            clienteViejo.apellidos_cliente = req.body.apellidos_cliente
          }
          if (req.body.cc_cliente != clienteViejo.cc_cliente) {
            clienteViejo.cc_cliente = req.body.cc_cliente
          }
          if (req.body.cel_cliente != clienteViejo.cel_cliente) {
            clienteViejo.cel_cliente = req.body.cel_cliente
          }
          if (req.body.correo_cliente != clienteViejo.correo_cliente) {
            clienteViejo.correo_cliente = req.body.correo_cliente
          }
          if (req.body.direccion_cliente != clienteViejo.direccion_cliente) {
            clienteViejo.direccion_cliente = req.body.direccion_cliente
          }

          models.Cliente.updateOne(
            { cc_cliente: cc},
            { $set: clienteViejo},
            (err, doc) => {
              if (err) {
                return res.status(404).send({
                  success: false,
                  message: 'Cliente no encontrado',
                });
              }
              return res.status(201).send({
                success: true,
                message: 'Cliente actualizado satisfactoriamente'
              });
            }
          )}
        else {
          //console.log("cliente no encontrado")
          return res.status(404).send({
            success: false,
            message: 'Cliente detalle no encontrado',
            clienteViejo,
          });
        }
      })
    }


}

const clienteController = new ClienteController();
export default clienteController;
