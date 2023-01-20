var models = require('../models');
models.connectToDataBase();

var currentDate = new Date();
var date = currentDate.getDate();
var month = currentDate.getMonth(); //Be careful! January is 0 not 1
var strMonts = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
var monthName = strMonts[month]
var year = currentDate.getFullYear();

let fecha = date + monthName + year;

class SalidaController {

  //obtener todos los Salidas
  getAllSalidas(req, res){

    models.Salida.find({}, (err, doc) => {
      if (err) {
        console.log("error retornando Salidas");
        return;
      }
      if (doc !== null) {
        //console.log("listado de Salidas");
        //console.log(doc);
        let salidasAux = doc;
        let Salidas = [];
        for (var i = salidasAux.length - 1; i >= 0; i--) {
          Salidas.push(salidasAux[i]);
        }
        return res.status(200).send({
          success: true,
          message: 'Salidas recibidos satisfactoriamente',
          Salidas,
        });
      }
      else {
        console.log("Salidas no encontrados")
        return res.status(404).send({
          success: false,
          message: 'Fallo retorno Salidas'
        });
      }
    });

  }


  //Guardar Salida
  addSalida(req, res){

    if (!req.body.valor_sal) {
      return res.status(400).send({
        success: false,
        message: "valor_sal requerido"
      });
    }

    if (!req.body.motivo_sal) {
      return res.status(400).send({
        success: false,
        message: "motivo_sal requerido"
      });
    }

    //console.log("req.body")
    //console.log(req.body)

    let Salida_nuevo = new models.Salida({
      fecha_letras_sal: fecha,
      motivo_sal: req.body.motivo_sal || "",
      valor_sal: req.body.valor_sal || 0
    })

    Salida_nuevo.save((err) => {
      if (err) {
        //console.log(`error guardar Salida: ${err}`);
        return res.status(403).send({
          success: false,
          message: "Salida no agregada. Reintente"
        })
      }
      else {
        //console.log(`guardar Salida: OK`);
        return res.status(201).send({
          success: true,
          message: "Salida agregado",
          Salida_nuevo
        });
      }
    });

  }

  //obtener Salida por Id
  getOneSalida(req, res){

    if (!req.params.id) {
     return res.status(400).send({
       success: false,
       message: 'id es requerido',
       });
     }

    let id = req.params.id;
    //console.log(id)

    models.Salida.findOne({ _id: id }, (err, doc) => {
      if (err) {
        //console.log("error retornando Salida por id");
        return res.status(403).send({
          success: false,
          message: 'error retornando Salida por id'
        });
      }
      if (doc !== null) {
        let Salida = doc;
        return res.status(200).send({
          success: true,
          message: 'Salida encontrado exitosamente',
          Salida,
        });
      }
      else {
        //console.log("Salida no encontrado")
        return res.status(404).send({
          success: false,
          message: 'Salida no encontrado',
        });
      }
    });
  }

  //eliminar Salida por Id
  deleteOneSalida(req, res){

    if (!req.params.id) {
     return res.status(400).send({
       success: false,
       message: 'id es requerido',
       });
     }

    let id = req.params.id;
    models.Salida.deleteOne({ _id: id}, (err, doc) => {
      if (err) {
        return res.status(404).send({
          success: false,
          message: 'Salida no encontrado',
        });
      }
      //console.log("Salida eliminado");
      return res.status(200).send({
        success: true,
        message: 'Salida eliminado exitosamente',
      });
    })
  }

  //actualizar Salida por Id
  updateSalida(req, res){

    if (!req.params.id) {
     return res.status(400).send({
       success: false,
       message: 'id es requerido',
       });
     }

     let id = req.params.id;
     models.Salida.findOne({ _id: id }, (err, doc) => {
       if (err) {
         //console.log("error retornando Salida por id");
         return res.status(403).send({
           success: false,
           message: 'id no encontrado en Salidas'
         });
       }
       if (doc !== null) {
         let SalidaViejo = doc;

         if (req.body.motivo_sal != SalidaViejo.motivo_sal) {
           SalidaViejo.motivo_sal = req.body.motivo_sal
         }
         if (req.body.valor_sal != SalidaViejo.valor_sal) {
           SalidaViejo.valor_sal = req.body.valor_sal
         }

         SalidaViejo.fecha_letras_sal = fecha;

         models.Salida.updateOne(
           { _id: id},
           { $set: SalidaViejo},
           (err, doc) => {
             if (err) {
               return res.status(404).send({
                 success: false,
                 message: 'Salida no encontrado',
               });
             }
             return res.status(201).send({
               success: true,
               message: 'Salida actualizado satisfactoriamente',
               SalidaViejo
             });
           }
         )}
       else {
         //console.log("Salida no encontrado")
         return res.status(404).send({
           success: false,
           message: 'Salida detalle no encontrado',
         });
       }
     })
   }

}

const salidaController = new SalidaController();
export default salidaController;
