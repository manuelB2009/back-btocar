var models = require('../models');
models.connectToDataBase();

var currentDate = new Date();
var date = currentDate.getDate();
var month = currentDate.getMonth(); //Be careful! January is 0 not 1
var strMonts = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
var monthName = strMonts[month]
var year = currentDate.getFullYear();

let fecha = date + monthName + year;

class ProductoDetalleController {

  //obtener todos los productos detalles
  getAllProductosDetalles(req, res){

    models.ProductoDetalle.find({}, (err, doc) => {
      if (err) {
        console.log("error retornando productos");
        return;
      }
      if (doc !== null) {

        //console.log("listado de productos detalle");
        //console.log(doc);

        let productos = doc;
        //console.log("productos");
        //console.log(productos.length);
        //for (var i = 0; i > productos.length; i++) {
        //  for (var j = 0; j < productos.length; j++) {
        //    console.log(productos[i].cantidad);
        //   if (productos[i].cantidad == productos[j].cantidad) {
       // //      console.log(productos[j].codigo);
        //    }
        //  }
        //}

        return res.status(200).send({
          success: true,
          message: 'Productos recibidos satisfactoriamente',
          productos,
        });
      }
      else {
        console.log("productos no encontrados")
        return res.status(404).send({
          success: false,
          message: 'Fallo retorno productos'
        });
      }
    });

  }

  //Guardar producto detalle
  addProductoDll(req, res){

    if (!req.body.referencia) {
      return res.status(400).send({
        success: false,
        message: "referencia requerido"
      });
    }

    if (!req.body.tipo_producto) {
      return res.status(400).send({
        success: false,
        message: "tipo_producto requerido"
      });
    }

    //console.log("req.body")
    //console.log(req.body)
    let numero_total_productos_pdll = 0;
    models.ProductoDetalle.find({ referencia: req.body.referencia }, (err, docs) => {
      if (!err) {
        numero_total_productos_pdll = docs.length;
        let producto = null;
        if (numero_total_productos_pdll == 0) {
            producto = new models.ProductoDetalle({
            cantidad_actual: parseInt(req.body.cantidad_actual) || 0,
            precio_compra: parseInt(req.body.precio_compra) || 0,
            precio_venta: parseInt(req.body.precio_venta) || 0,
            referencia: req.body.referencia || "",
            notas: req.body.notas || "",
            tipo_vh_compatible: req.body.tipo_vh_compatible || "",
            equivalencia: req.body.equivalencia || "",
            codigo: req.body.codigo || "",
            tipo_producto: req.body.tipo_producto || "aceite",
          });
        } else {
            producto = new models.ProductoDetalle({
            cantidad_actual: parseInt(req.body.cantidad_actual) || 0,
            precio_compra: parseInt(req.body.precio_compra) || 0,
            precio_venta: parseInt(req.body.precio_venta) || 0,
            referencia: req.body.referencia || "",
            notas: req.body.notas || "",
            tipo_vh_compatible: req.body.tipo_vh_compatible || "",
            equivalencia: req.body.equivalencia || "",
            codigo: req.body.codigo || "",
            tipo_producto: req.body.tipo_producto || "aceite",
          });
        }

          producto.fecha_letras_producto = fecha;

          producto.save((err) => {
            if (err) {
              //console.log(`error guardar detalle producto: ${err}`);
              return res.status(403).send({
                success: false,
                message: "producto no agregado. Reintente"
              })
            }
            else {
              //console.log(`guardar detalle producto: OK`);
              return res.status(201).send({
                success: true,
                message: "producto agregado",
                producto
              })
            }
          })
      }
    });
  }


  //obtener producto detalle por Id
  getOneProductoDll(req, res){

    if (!req.params.id) {
     return res.status(400).send({
       success: false,
       message: 'id es requerido',
       });
     }

    let id = req.params.id;
    //console.log(id)

    models.ProductoDetalle.findOne({ _id: id }, (err, doc) => {
      if (err) {
        //console.log("error retornando producto por id");
        return res.status(403).send({
          success: false,
          message: 'error retornando producto por id'
        });
      }
      if (doc !== null) {
        let producto = doc;
        return res.status(200).send({
          success: true,
          message: 'Producto encontrado exitosamente',
          producto,
        });
      }
      else {
        //console.log("producto no encontrado")
        return res.status(404).send({
          success: false,
          message: 'Producto no encontrado',
        });
      }
    });
  }


  //eliminar producto detalle por Id
  deleteOneProductoDetalle(req, res){

    if (!req.params.id) {
     return res.status(400).send({
       success: false,
       message: 'id es requerido',
       });
     }

    let id = req.params.id;
    models.ProductoDetalle.deleteOne({ _id: id}, (err, doc) => {
      if (err) {
        return res.status(404).send({
          success: false,
          message: 'Producto no encontrado',
        });
      }
      //console.log("producto detalle eliminado");
      return res.status(200).send({
        success: true,
        message: 'Producto eliminado exitosamente',
      });
    })
  }

  //actualizar producto detalle por Id
  updateProductoDetalle(req, res){

    if (!req.params.id) {
     return res.status(400).send({
       success: false,
       message: 'id es requerido',
       });
     }

     let id = req.params.id;
     models.ProductoDetalle.findOne({ _id: id }, (err, doc) => {
       if (err) {
         //console.log("error retornando producto por id");
         return res.status(403).send({
           success: false,
           message: 'id no encontrado en productos'
         });
       }
       if (doc !== null) {
         let productoOld = doc;

         if (req.body.cantidad_actual != productoOld.cantidad_actual) {
           productoOld.cantidad_actual = req.body.cantidad_actual;
         }
         if (req.body.precio_compra != productoOld.precio_compra) {
           productoOld.precio_compra = req.body.precio_compra;
         }
         if (req.body.precio_venta != productoOld.precio_venta) {
           productoOld.precio_venta = req.body.precio_venta;
         }
         if (req.body.referencia != productoOld.referencia) {
           productoOld.referencia = req.body.referencia;
         }
         if (req.body.notas != productoOld.notas) {
           productoOld.notas = req.body.notas;
         }
         if (req.body.tipo_vh_compatible != productoOld.tipo_vh_compatible) {
           productoOld.tipo_vh_compatible = req.body.tipo_vh_compatible
         }
         if (req.body.equivalencia != productoOld.equivalencia) {
           productoOld.equivalencia = req.body.equivalencia
         }
         if (req.body.codigo != productoOld.codigo) {
           productoOld.codigo = req.body.codigo
         }
         if (req.body.tipo_producto != productoOld.tipo_producto) {
           productoOld.tipo_producto = req.body.tipo_producto
         }
         let productoNew = null;
         productoNew = productoOld;
         productoNew.fecha_inicial_producto = Date.now;
         productoNew.fecha_letras_producto = fecha;

         models.ProductoDetalle.updateOne(
           { _id: id},
           { $set: productoNew},
           (err, doc) => {
             if (err) {
               return res.status(404).send({
                 success: false,
                 message: 'Producto no encontrado',
               });
             }
             return res.status(201).send({
               success: true,
               message: 'Producto actualizado satisfactoriamente',
             });
           }
         )}
       else {
         //console.log("producto no encontrado")
         return res.status(404).send({
           success: false,
           message: 'Producto no encontrado',
           productoNew
         });
       }
     })
   }

 //obtener producto detalle por Id
 getOneProductoDllCodigo(req, res){

   if (!req.params.codigo) {
    return res.status(400).send({
      success: false,
      message: 'codigo producto es requerido',
      });
    }

   let codigoP = req.params.codigo;

   models.ProductoDetalle.findOne({ codigo: codigoP }, (err, doc2) => {
     if (err) {
       //console.log("error retornando producto por codigo");
       return res.status(403).send({
         success: false,
         message: 'error retornando producto por codigo'
       });
     }
     if (doc2 !== null) {
       let producto = doc2;
       return res.status(200).send({
         success: true,
         message: 'Producto encontrado exitosamente',
         producto,
       });
     }
     else {
       //console.log("producto no encontrado")
       return res.status(404).send({
         success: false,
         message: 'Producto no encontrado',
       });
     }
   });
 }

}

const productoDllController = new ProductoDetalleController();
export default productoDllController;
