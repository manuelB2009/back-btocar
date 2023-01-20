var models = require('../models');
models.connectToDataBase();

var currentDate = new Date();
var date = currentDate.getDate();
var month = currentDate.getMonth(); //Be careful! January is 0 not 1
var strMonts = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
var monthName = strMonts[month]
var year = currentDate.getFullYear();

let fecha = date + monthName + year;

class EntradaController {

  //obtener todos los Entradas
  getAllEntradas(req, res){

    models.Entrada.find({}, (err, doc) => {
      if (err) {
        console.log("error retornando Entradas");
        return;
      }
      if (doc !== null) {
        let Entradas = doc;
        //console.log("listado de Entradas");
        //console.log(doc);
        return res.status(200).send({
          success: true,
          message: 'Entradas recibidos satisfactoriamente',
          Entradas,
        });
      }
      else {
        console.log("Entradas no encontrados")
        return res.status(404).send({
          success: false,
          message: 'Fallo retorno Entradas'
        });
      }
    });

  }


  //Guardar Entrada
  addEntrada(req, res){

    if (!req.body.servicios_idServicio) {
      return res.status(400).send({
        success: false,
        message: "servicios_idServicio requerido"
      });
    }

    //console.log("req.body")
    //console.log(req.body)

    let Entrada_nuevo = new models.Entrada({
      fecha_letras_en: fecha,
      datos_extra_ent: req.body.datos_extra_ent || "",
      valor_ent: req.body.valor_ent || 0,
      servicios_idServicio: req.body.servicios_idServicio || 0
    })

    Entrada_nuevo.save((err) => {
      if (err) {
        //console.log(`error guardar Entrada: ${err}`);
        return res.status(403).send({
          success: false,
          message: "Entrada no agregada. Reintente"
        })
      }
      else {
        //console.log(`guardar Entrada: OK`);
        return res.status(201).send({
          success: true,
          message: "Entrada agregado",
          Entrada_nuevo
        });
      }
    });

  }

  //obtener Entrada por Id
  getOneEntrada(req, res){

    if (!req.params.id) {
     return res.status(400).send({
       success: false,
       message: 'id es requerido',
       });
     }

    let id = req.params.id;
    //console.log(id)

    models.Entrada.findOne({ _id: id }, (err, doc) => {
      if (err) {
        //console.log("error retornando Entrada por id");
        return res.status(403).send({
          success: false,
          message: 'error retornando Entrada por id'
        });
      }
      if (doc !== null) {
        let Entrada = doc;
        return res.status(200).send({
          success: true,
          message: 'Entrada encontrado exitosamente',
          Entrada,
        });
      }
      else {
        //console.log("Entrada no encontrado")
        return res.status(404).send({
          success: false,
          message: 'Entrada no encontrado',
        });
      }
    });
  }

  //eliminar Entrada por Id
  deleteOneEntrada(req, res){

    if (!req.params.id) {
     return res.status(400).send({
       success: false,
       message: 'id es requerido',
       });
     }

    let id = req.params.id;
    models.Entrada.deleteOne({ _id: id}, (err, doc) => {
      if (err) {
        return res.status(404).send({
          success: false,
          message: 'Entrada no encontrado',
        });
      }
      //console.log("Entrada eliminado");
      return res.status(200).send({
        success: true,
        message: 'Entrada eliminado exitosamente',
      });
    })
  }

  //actualizar Entrada por Id
  updateEntrada(req, res){

    if (!req.params.id) {
     return res.status(400).send({
       success: false,
       message: 'id es requerido',
       });
     }

     let id = req.params.id;
     models.Entrada.findOne({ _id: id }, (err, doc) => {
       if (err) {
         //console.log("error retornando Entrada por id");
         return res.status(403).send({
           success: false,
           message: 'id no encontrado en Entradas'
         });
       }
       if (doc !== null) {
         let EntradaViejo = doc;

         if (req.body.valor_ent != EntradaViejo.valor_ent) {
           EntradaViejo.valor_ent = req.body.valor_ent
         }
         if (req.body.servicios_idServicio != EntradaViejo.servicios_idServicio) {
           EntradaViejo.servicios_idServicio = req.body.servicios_idServicio
         }

         if (req.body.datos_extra_ent) {
           if (req.body.datos_extra_ent != EntradaViejo.datos_extra_ent) {
             EntradaViejo.datos_extra_ent = req.body.datos_extra_ent
           }
         }


         EntradaViejo.fecha_letras_en = fecha;

         models.Entrada.updateOne(
           { _id: id},
           { $set: EntradaViejo},
           (err, doc) => {
             if (err) {
               return res.status(404).send({
                 success: false,
                 message: 'Entrada no encontrado',
               });
             }
             return res.status(201).send({
               success: true,
               message: 'Entrada actualizado satisfactoriamente',
               EntradaViejo
             });
           }
         )}
       else {
         //console.log("Entrada no encontrado")
         return res.status(404).send({
           success: false,
           message: 'Entrada detalle no encontrado',
         });
       }
     })
   }

}

const entradaController = new EntradaController();
export default entradaController;
