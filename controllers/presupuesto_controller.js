var models = require('../models');
models.connectToDataBase();

let actualMonth = new Date().getMonth();
let actualYear = new Date().getYear();
let actualDay = new Date().getDate();

class PresupuestoController {

  eliminarEntradasNoRelacionadas(req, res){
  var idServicios = [];
  models.Credito.find({}, (err, doc) => {
    if (doc !== null) {
      let creditos = doc;
      console.log(creditos);

      for (var i = 0; i < creditos.length; i++) { 
        idServicios.push(creditos[i].servicios_idServicio);
      }

      models.Entrada.deleteMany({ servicios_idServicio: idServicios}, (err, doc) => {
        if(err){
          console.log(err);
          return
        }
        console.log("entradas eliminads")
        console.log(doc);

        models.Credito.deleteMany({ servicios_idServicio: idServicios}, (err, doc) => { 
          if(err){
            console.log(err);
            return
          }
          console.log("creditos eliminados")
          console.log(doc);

          models.ServicioPlacaCliente.deleteMany({ servicio_idServicio: idServicios}, (err, doc) => { 
            if(err){
              console.log(err);
              return
            }
            console.log("ServicioPlacaCliente eliminados")
            console.log(doc);

            models.Servicio.deleteMany({ _id: idServicios}, (err, doc) => { 
              if(err){
                console.log(err);
                return
              }
              console.log("Servicios eliminados")
              console.log(doc);

              return res.status(200).send({
                success: true
              });
            })
          })
        })
      })
    }
  });

/*  models.Servicio.find({}, (err, doc) => {

    if (doc !== null) {
      let servicios = doc;

      models.Entrada.find({}, (err, ents) => {
        if (err) {
          console.log("error retornando presupuesto");
          return;
        }
        if (doc !== null) {
          let entradas = ents;
          for (var i = 0; i < entradas.length; i++) {
            let con = 0;
            for (var j = 0; j < servicios.length; j++) {
              if (entradas[i].servicios_idServicio == servicios[j]._id) {
                con = con + 1;
              }
            }
            if (con == 0) {
              models.Entrada.deleteOne({ _id: entradas._id}, (err, doc) => {
                console.log("eliminado")
                console.log(entradas)
              })
          }
        }
      }
    });
  }
}); */
  }

  getPresupuestoProductos(req, res){

    models.ProductoDetalle.find({}, (err, doc) => {
      if (err) {
        console.log("error retornando presupuesto");
        return;
      }
      if (doc !== null) {
        let productos = doc;
        var valorProductos = 0;
         for (var i = 0; i < productos.length; i++) {
          let totalPorProducto = productos[i].precio_compra * productos[i].cantidad_actual;
          valorProductos = valorProductos + totalPorProducto;
        }
        valorProductos = parseInt(valorProductos);
        return res.status(200).send({
          success: true,
          message: 'Valor de productos en inventario',
          valorProductos,
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


  //obtener entradas dia
  getPresupuestoInDia(req, res){

    models.Entrada.find({}, (err, doc) => {
      if (err) {
        console.log("error retornando presupuesto");
        return;
      }
      if (doc !== null) {
        let entradas = doc;
        //console.log("listado de clientes");
        //console.log(doc);
        var entradasDiarias = 0;
        for (var i = 0; i < entradas.length; i++) {
          if (entradas[i].fecha_ent.getDate() == actualDay
            && entradas[i].fecha_ent.getMonth() == actualMonth
            && entradas[i].fecha_ent.getYear() == actualYear)
            {
              entradasDiarias = entradasDiarias + entradas[i].valor_ent;
            }
        }

        return res.status(200).send({
          success: true,
          message: 'Entradas dia recibidos satisfactoriamente',
          entradasDiarias,
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

  getPresupuestoInMes(req, res){

    models.Entrada.find({}, (err, doc) => {
      if (err) {
        console.log("error retornando presupuesto");
        return;
      }
      if (doc !== null) {
        let entradas = doc;
        //console.log("listado de clientes");
        //console.log(doc);
        var entradasMes = 0;
        for (var i = 0; i < entradas.length; i++) {
          if (entradas[i].fecha_ent.getMonth() == actualMonth
            && entradas[i].fecha_ent.getYear() == actualYear)
            {
              entradasMes = entradasMes + entradas[i].valor_ent;
            }
        }

        return res.status(200).send({
          success: true,
          message: 'Entradas mes recibidos satisfactoriamente',
          entradasMes,
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


  //obtener entradas anio
  getPresupuestoInAnio(req, res){
    models.Entrada.find({}, (err, doc) => {
      if (err) {
        console.log("error retornando presupuesto");
        return;
      }
      if (doc !== null) {
        let entradas = doc;
        //console.log("listado de clientes");
        //console.log(doc);
        var entradasAnio = 0;
        for (var i = 0; i < entradas.length; i++) {
          if (entradas[i].fecha_ent.getYear() == actualYear)
            {
              entradasAnio = entradasAnio + entradas[i].valor_ent;
            }
        }

        return res.status(200).send({
          success: true,
          message: 'Entradas anio recibidos satisfactoriamente',
          entradasAnio,
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

  //obtener salidas dia
  getPresupuestoOutDia(req, res){

    models.Salida.find({}, (err, doc) => {
      if (err) {
        console.log("error retornando presupuesto");
        return;
      }
      if (doc !== null) {
        let salidas = doc;
        //console.log("listado de clientes");
        //console.log(doc);
        var salidasDiarias = 0;
        for (var i = 0; i < salidas.length; i++) {
          if (salidas[i].fecha_sal.getDate() == actualDay
            && salidas[i].fecha_sal.getMonth() == actualMonth
            && salidas[i].fecha_sal.getYear() == actualYear)
            {
              salidasDiarias = salidasDiarias + salidas[i].valor_sal;
            }
        }

        return res.status(200).send({
          success: true,
          message: 'Salidas dia recibidos satisfactoriamente',
          salidasDiarias,
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

  //obtener salidas mes
  getPresupuestoOutMes(req, res){

    models.Salida.find({}, (err, doc) => {
      if (err) {
        console.log("error retornando presupuesto");
        return;
      }
      if (doc !== null) {
        let salidas = doc;
        //console.log("listado de clientes");
        //console.log(doc);
        var salidasMes = 0;
        for (var i = 0; i < salidas.length; i++) {
          if (salidas[i].fecha_sal.getMonth() == actualMonth
            && salidas[i].fecha_sal.getYear() == actualYear)
            {
              salidasMes = salidasMes + salidas[i].valor_sal;
            }
        }

        return res.status(200).send({
          success: true,
          message: 'salidas mes recibidos satisfactoriamente',
          salidasMes,
        });
      }
      else {
        console.log("salidas no encontrados")
        return res.status(404).send({
          success: false,
          message: 'Fallo retorno salidas'
        });
      }
    });

  }


  //obtener salidas anio
  getPresupuestoOutAnio(req, res){
    models.Salida.find({}, (err, doc) => {
      if (err) {
        console.log("error retornando presupuesto");
        return;
      }
      if (doc !== null) {
        let salidas = doc;
        //console.log("listado de clientes");
        //console.log(doc);
        var salidasAnio = 0;
        for (var i = 0; i < salidas.length; i++) {
          if (salidas[i].fecha_sal.getYear() == actualYear)
            {
              salidasAnio = salidasAnio + salidas[i].valor_sal;
            }
        }

        return res.status(200).send({
          success: true,
          message: 'salidas anio recibidos satisfactoriamente',
          salidasAnio,
        });
      }
      else {
        console.log("salidas no encontrados")
        return res.status(404).send({
          success: false,
          message: 'Fallo retorno salidas'
        });
      }
    });
  }

  //obtene total cr'edito diario
  getPresupuestoInCreditoDia(req, res){

    models.Credito.find({}, (err, doc) => {
      if (err) {
        console.log("error retornando presupuesto");
        return;
      }
      if (doc !== null) {
        let creditos = doc;
        //console.log(doc);
        var creditosDiarias = 0;

        for (var i = 0; i < creditos.length; i++) {

          if (creditos[i].fecha_ultimo_pago_cr.getDate() == actualDay
            && creditos[i].fecha_ultimo_pago_cr.getMonth() == actualMonth
            && creditos[i].fecha_ultimo_pago_cr.getYear() == actualYear)
            {
              creditosDiarias = creditosDiarias + creditos[i].pago_cr;
            }
        }

        return res.status(200).send({
          success: true,
          message: 'Creditos dia recibidos satisfactoriamente',
          creditosDiarias,
        });
      }
      else {
        console.log("Creditos no encontrados")
        return res.status(404).send({
          success: false,
          message: 'Fallo retorno Creditos'
        });
      }
    });

  }

  //obtene total cr'edito mensual
  getPresupuestoInCreditoMes(req, res){

    models.Credito.find({}, (err, doc) => {
      if (err) {
        console.log("error retornando presupuesto");
        return;
      }
      if (doc !== null) {
        let creditos = doc;
        //console.log(doc);
        var creditosMes = 0;

        for (var i = 0; i < creditos.length; i++) {

          if (creditos[i].fecha_ultimo_pago_cr.getMonth() == actualMonth
            && creditos[i].fecha_ultimo_pago_cr.getYear() == actualYear)
            {
              creditosMes = creditosMes + creditos[i].pago_cr;
            }
        }

        return res.status(200).send({
          success: true,
          message: 'Creditos mensuales recibidos satisfactoriamente',
          creditosMes,
        });
      }
      else {
        console.log("Creditos no encontrados")
        return res.status(404).send({
          success: false,
          message: 'Fallo retorno Creditos'
        });
      }
    });
  }

  //obtener presupuesto entradas por fecha
  getPresupuestoEntradasFecha(req, res){

    if (!req.params.fecha) {
     return res.status(400).send({
       success: false,
       message: 'fecha es requerido',
       });
     }

    let fecha = req.params.fecha;

    models.Entrada.find({}, (err, doc) => {
      if (err) {
        return res.status(403).send({
          success: false,
          message: 'error retornando Entrada'
        });
      }
      if (doc !== null) {
        let Entradas = doc;
        let entradasDia = 0;
        let entradasMes = 0;
        let entradasAnio = 0;

        let diaPedido = parseInt(fecha[0] + fecha[1])
        let mesPedido = parseInt(fecha[2] + fecha[3]) - 1
        let anioPedido = 0;
        if (parseInt(fecha[4] + fecha[5] + fecha[6] + fecha[7]) == 2019) {
           anioPedido = 119;
        }
        if (parseInt(fecha[4] + fecha[5] + fecha[6] + fecha[7]) == 2020) {
           anioPedido = 120;
        }
        if (parseInt(fecha[4] + fecha[5] + fecha[6] + fecha[7]) == 2021) {
           anioPedido = 121;
        }
        if (parseInt(fecha[4] + fecha[5] + fecha[6] + fecha[7]) == 2022) {
           anioPedido = 122;
        }


        for (var i = 0; i < Entradas.length; i++) {
          if (Entradas[i].fecha_ent.getDate() == diaPedido &&
              Entradas[i].fecha_ent.getMonth() == mesPedido &&
              Entradas[i].fecha_ent.getYear() == anioPedido) {
              entradasDia = entradasDia + Entradas[i].valor_ent;
          }
          if (Entradas[i].fecha_ent.getMonth() == mesPedido &&
              Entradas[i].fecha_ent.getYear() == anioPedido) {
              entradasMes = entradasMes + Entradas[i].valor_ent;
          }
          if (Entradas[i].fecha_ent.getYear() == anioPedido) {
              entradasAnio = entradasAnio + Entradas[i].valor_ent;
          }
        }
        return res.status(200).send({
          success: true,
          message: 'Entradas encontrado exitosamente',
          entradasDia,
          entradasMes,
          entradasAnio
        });
      }
      else {
        //console.log("Entrada no encontrado")
        return res.status(404).send({
          success: false,
          message: 'Entradas no encontrado',
        });
      }
    });
  }

  //obtener presupuesto salidas por fecha
  getPresupuestoSalidasFecha(req, res){

    if (!req.params.fecha) {
     return res.status(400).send({
       success: false,
       message: 'fecha es requerido',
       });
     }

    let fecha = req.params.fecha;

    models.Salida.find({}, (err, doc) => {
      if (err) {
        return res.status(403).send({
          success: false,
          message: 'error retornando Salida'
        });
      }
      if (doc !== null) {
        let Salidas = doc;
        let salidasDia = 0;
        let salidasMes = 0;
        let salidasAnio = 0;

        let diaPedido = parseInt(fecha[0] + fecha[1])
        let mesPedido = parseInt(fecha[2] + fecha[3]) - 1
        let anioPedido = 0;
        if (parseInt(fecha[4] + fecha[5] + fecha[6] + fecha[7]) == 2019) {
           anioPedido = 119;
        }
        if (parseInt(fecha[4] + fecha[5] + fecha[6] + fecha[7]) == 2020) {
           anioPedido = 120;
        }
        if (parseInt(fecha[4] + fecha[5] + fecha[6] + fecha[7]) == 2021) {
           anioPedido = 121;
        }
        if (parseInt(fecha[4] + fecha[5] + fecha[6] + fecha[7]) == 2022) {
           anioPedido = 122;
        }


        for (var i = 0; i < Salidas.length; i++) {
          if (Salidas[i].fecha_sal.getDate() == diaPedido &&
              Salidas[i].fecha_sal.getMonth() == mesPedido &&
              Salidas[i].fecha_sal.getYear() == anioPedido) {
              salidasDia = salidasDia + Salidas[i].valor_sal;
          }
          if (Salidas[i].fecha_sal.getMonth() == mesPedido &&
              Salidas[i].fecha_sal.getYear() == anioPedido) {
              salidasMes = salidasMes + Salidas[i].valor_sal;
          }
          if (Salidas[i].fecha_sal.getYear() == anioPedido) {
              salidasAnio = salidasAnio + Salidas[i].valor_sal;
          }
        }
        return res.status(200).send({
          success: true,
          message: 'salidas encontrado exitosamente',
          salidasDia,
          salidasMes,
          salidasAnio
        });
      }
      else {
        //console.log("Entrada no encontrado")
        return res.status(404).send({
          success: false,
          message: 'salidas no encontrado',
        });
      }
    });
  }

  //obtener ganancias año
  getGananciasAño(req, res){
    models.Servicio.find({}, (err, doc) => {
      if (err) {
        console.log("error retornando servicios");
        return;
      }
      if (doc !== null) {
        let servicio = doc;
        //console.log("listado de servicio");
        //console.log(servicio);
        var gananciasAnio = 0;
        var nombreProductosArray = [];

        for (var i = 0; i < servicio.length; i++) {

          if (//servicio[i].fecha_inicial_svcio.getDate() == actualDay &&
             //servicio[i].fecha_inicial_svcio.getMonth() == actualMonth &&
             servicio[i].fecha_inicial_svcio.getYear() == actualYear)
            {

              for (var j = 0; j < servicio[i].productos_array.length; j++) {
                //console.log(servicio[i].productos_array[j].precio_venta);
                if (servicio[i].productos_array[j].aceite) {
                  let con = 0;
                    for (var k = 0; k < nombreProductosArray.length; k++) {
                      if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                        con = con + 1;
                      }
                    }
                    if (con == 0) {
                      nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                    }
                }
                if (servicio[i].productos_array[j].aceite1) {
                  let con = 0;
                    for (var k = 0; k < nombreProductosArray.length; k++) {
                      if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                        con = con + 1;
                      }
                    }
                    if (con == 0) {
                      nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                    }
                }
                if (servicio[i].productos_array[j].aceite2) {
                  let con = 0;
                    for (var k = 0; k < nombreProductosArray.length; k++) {
                      if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                        con = con + 1;
                      }
                    }
                    if (con == 0) {
                      nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                    }
                }
                if (servicio[i].productos_array[j].aceite3) {
                  let con = 0;
                    for (var k = 0; k < nombreProductosArray.length; k++) {
                      if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                        con = con + 1;
                      }
                    }
                    if (con == 0) {
                      nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                    }
                }
                if (servicio[i].productos_array[j].aceite4) {
                  let con = 0;
                    for (var k = 0; k < nombreProductosArray.length; k++) {
                      if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                        con = con + 1;
                      }
                    }
                    if (con == 0) {
                      nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                    }
                }
                if (servicio[i].productos_array[j].filtro_aire1) {
                  let con = 0;
                    for (var k = 0; k < nombreProductosArray.length; k++) {
                      if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                        con = con + 1;
                      }
                    }
                    if (con == 0) {
                      nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                    }
                }
                if (servicio[i].productos_array[j].filtro_aire2) {
                  let con = 0;
                    for (var k = 0; k < nombreProductosArray.length; k++) {
                      if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                        con = con + 1;
                      }
                    }
                    if (con == 0) {
                      nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                    }
                }
                if (servicio[i].productos_array[j].filtro_aceite1) {
                  let con = 0;
                    for (var k = 0; k < nombreProductosArray.length; k++) {
                      if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                        con = con + 1;
                      }
                    }
                    if (con == 0) {
                      nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                    }
                }
                if (servicio[i].productos_array[j].filtro_aceite2) {
                  let con = 0;
                    for (var k = 0; k < nombreProductosArray.length; k++) {
                      if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                        con = con + 1;
                      }
                    }
                    if (con == 0) {
                      nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                    }
                }
                if (servicio[i].productos_array[j].filtro_combustible1) {
                  let con = 0;
                    for (var k = 0; k < nombreProductosArray.length; k++) {
                      if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                        con = con + 1;
                      }
                    }
                    if (con == 0) {
                      nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                    }
                }
                if (servicio[i].productos_array[j].filtro_combustible2) {
                  let con = 0;
                    for (var k = 0; k < nombreProductosArray.length; k++) {
                      if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                        con = con + 1;
                      }
                    }
                    if (con == 0) {
                      nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                    }
                }
                if (servicio[i].productos_array[j].filtro_combustible3) {
                  let con = 0;
                    for (var k = 0; k < nombreProductosArray.length; k++) {
                      if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                        con = con + 1;
                      }
                    }
                    if (con == 0) {
                      nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                    }
                }
                if (servicio[i].productos_array[j].filtro_cabina) {
                  let con = 0;
                    for (var k = 0; k < nombreProductosArray.length; k++) {
                      if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                        con = con + 1;
                      }
                    }
                    if (con == 0) {
                      nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                    }
                }
                if (servicio[i].productos_array[j].caja1) {
                  let con = 0;
                    for (var k = 0; k < nombreProductosArray.length; k++) {
                      if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                        con = con + 1;
                      }
                    }
                    if (con == 0) {
                      nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                    }
                }
                if (servicio[i].productos_array[j].caja2) {
                  let con = 0;
                    for (var k = 0; k < nombreProductosArray.length; k++) {
                      if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                        con = con + 1;
                      }
                    }
                    if (con == 0) {
                      nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                    }
                }
                if (servicio[i].productos_array[j].transmision1) {
                  let con = 0;
                    for (var k = 0; k < nombreProductosArray.length; k++) {
                      if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                        con = con + 1;
                      }
                    }
                    if (con == 0) {
                      nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                    }
                }
                if (servicio[i].productos_array[j].transmision2) {
                  let con = 0;
                    for (var k = 0; k < nombreProductosArray.length; k++) {
                      if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                        con = con + 1;
                      }
                    }
                    if (con == 0) {
                      nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                    }
                }
                if (servicio[i].productos_array[j].aditivo1) {
                  let con = 0;
                    for (var k = 0; k < nombreProductosArray.length; k++) {
                      if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                        con = con + 1;
                      }
                    }
                    if (con == 0) {
                      nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                    }
                }
                if (servicio[i].productos_array[j].aditivo2) {
                  let con = 0;
                    for (var k = 0; k < nombreProductosArray.length; k++) {
                      if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                        con = con + 1;
                      }
                    }
                    if (con == 0) {
                      nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                    }
                }
                if (servicio[i].productos_array[j].aditivo3) {
                  let con = 0;
                    for (var k = 0; k < nombreProductosArray.length; k++) {
                      if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                        con = con + 1;
                      }
                    }
                    if (con == 0) {
                      nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                    }
                }
                if (servicio[i].productos_array[j].aditivo4) {
                  let con = 0;
                    for (var k = 0; k < nombreProductosArray.length; k++) {
                      if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                        con = con + 1;
                      }
                    }
                    if (con == 0) {
                      nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                    }
                }
                if (servicio[i].productos_array[j].vitrina1) {
                  let con = 0;
                    for (var k = 0; k < nombreProductosArray.length; k++) {
                      if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                        con = con + 1;
                      }
                    }
                    if (con == 0) {
                      nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                    }
                }
                if (servicio[i].productos_array[j].vitrina2) {
                  let con = 0;
                    for (var k = 0; k < nombreProductosArray.length; k++) {
                      if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                        con = con + 1;
                      }
                    }
                    if (con == 0) {
                      nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                    }
                }
                if (servicio[i].productos_array[j].vitrina3) {
                  let con = 0;
                    for (var k = 0; k < nombreProductosArray.length; k++) {
                      if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                        con = con + 1;
                      }
                    }
                    if (con == 0) {
                      nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                    }
                }
                if (servicio[i].productos_array[j].vitrina4) {
                  let con = 0;
                    for (var k = 0; k < nombreProductosArray.length; k++) {
                      if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                        con = con + 1;
                      }
                    }
                    if (con == 0) {
                      nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                    }
                }
              }
            }
        }
        //console.log(nombreProductosArray);
        models.ProductoDetalle.find({"codigo": nombreProductosArray }, (err, doc) => {
          if (err) {
            console.log("error trayendo productos linea765 presupuestoController");
          }
          let productosSinRepetir = doc;
          let precioCompraProductos = 0;
          let precioVentaProductos = 0;
          //console.log(productosSinRepetir);
          for (var i = 0; i < servicio.length; i++) {

            if (//servicio[i].fecha_inicial_svcio.getDate() == actualDay &&
               //servicio[i].fecha_inicial_svcio.getMonth() == actualMonth &&
               servicio[i].fecha_inicial_svcio.getYear() == actualYear)
            {
              precioVentaProductos = precioVentaProductos + servicio[i].total_precio_condescuento;

              for (var j = 0; j < servicio[i].productos_array.length; j++) {
                if (servicio[i].productos_array[j].aceite) {
                  for (var k = 0; k < productosSinRepetir.length; k++) {
                    if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                      let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                      precioCompraProductos = precioCompraProductos + operacionAux;
                    }
                  }
                }
                if (servicio[i].productos_array[j].aceite1) {
                  for (var k = 0; k < productosSinRepetir.length; k++) {
                    if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                      let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                      precioCompraProductos = precioCompraProductos + operacionAux;
                    }
                  }
                }
                if (servicio[i].productos_array[j].aceite2) {
                  for (var k = 0; k < productosSinRepetir.length; k++) {
                    if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                      let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                      precioCompraProductos = precioCompraProductos + operacionAux;
                    }
                  }
                }
                if (servicio[i].productos_array[j].aceite3) {
                  for (var k = 0; k < productosSinRepetir.length; k++) {
                    if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                      let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                      precioCompraProductos = precioCompraProductos + operacionAux;
                    }
                  }
                }
                if (servicio[i].productos_array[j].aceite4) {
                  for (var k = 0; k < productosSinRepetir.length; k++) {
                    if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                      let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                      precioCompraProductos = precioCompraProductos + operacionAux;
                    }
                  }
                }
                if (servicio[i].productos_array[j].filtro_aire1) {
                  for (var k = 0; k < productosSinRepetir.length; k++) {
                    if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                      let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                      precioCompraProductos = precioCompraProductos + operacionAux;
                    }
                  }
                }
                if (servicio[i].productos_array[j].filtro_aire2) {
                  for (var k = 0; k < productosSinRepetir.length; k++) {
                    if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                      let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                      precioCompraProductos = precioCompraProductos + operacionAux;
                    }
                  }
                }

                if (servicio[i].productos_array[j].filtro_aceite1) {
                  for (var k = 0; k < productosSinRepetir.length; k++) {
                    if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                      let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                      precioCompraProductos = precioCompraProductos + operacionAux;
                    }
                  }
                }
                if (servicio[i].productos_array[j].filtro_aceite2) {
                  for (var k = 0; k < productosSinRepetir.length; k++) {
                    if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                      let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                      precioCompraProductos = precioCompraProductos + operacionAux;
                    }
                  }
                }
                if (servicio[i].productos_array[j].filtro_combustible1) {
                  for (var k = 0; k < productosSinRepetir.length; k++) {
                    if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                      let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                      precioCompraProductos = precioCompraProductos + operacionAux;
                    }
                  }
                }
                if (servicio[i].productos_array[j].filtro_combustible2) {
                  for (var k = 0; k < productosSinRepetir.length; k++) {
                    if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                      let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                      precioCompraProductos = precioCompraProductos + operacionAux;
                    }
                  }
                }
                if (servicio[i].productos_array[j].filtro_combustible3) {
                  for (var k = 0; k < productosSinRepetir.length; k++) {
                    if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                      let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                      precioCompraProductos = precioCompraProductos + operacionAux;
                    }
                  }
                }

                if (servicio[i].productos_array[j].filtro_cabina) {
                  for (var k = 0; k < productosSinRepetir.length; k++) {
                    if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                      let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                      precioCompraProductos = precioCompraProductos + operacionAux;
                    }
                  }
                }
                if (servicio[i].productos_array[j].caja1) {
                  for (var k = 0; k < productosSinRepetir.length; k++) {
                    if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                      let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                      precioCompraProductos = precioCompraProductos + operacionAux;
                    }
                  }
                }
                if (servicio[i].productos_array[j].caja2) {
                  for (var k = 0; k < productosSinRepetir.length; k++) {
                    if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                      let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                      precioCompraProductos = precioCompraProductos + operacionAux;
                    }
                  }
                }
                if (servicio[i].productos_array[j].transmision1) {
                  for (var k = 0; k < productosSinRepetir.length; k++) {
                    if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                      let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                      precioCompraProductos = precioCompraProductos + operacionAux;
                    }
                  }
                }
                if (servicio[i].productos_array[j].transmision2) {
                  for (var k = 0; k < productosSinRepetir.length; k++) {
                    if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                      let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                      precioCompraProductos = precioCompraProductos + operacionAux;
                    }
                  }
                }
                if (servicio[i].productos_array[j].aditivo1) {
                  for (var k = 0; k < productosSinRepetir.length; k++) {
                    if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                      let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                      precioCompraProductos = precioCompraProductos + operacionAux;
                    }
                  }
                }
                if (servicio[i].productos_array[j].aditivo2) {
                  for (var k = 0; k < productosSinRepetir.length; k++) {
                    if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                      let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                      precioCompraProductos = precioCompraProductos + operacionAux;
                    }
                  }
                }
                if (servicio[i].productos_array[j].aditivo3) {
                  for (var k = 0; k < productosSinRepetir.length; k++) {
                    if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                      let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                      precioCompraProductos = precioCompraProductos + operacionAux;
                    }
                  }
                }
                if (servicio[i].productos_array[j].aditivo4) {
                  for (var k = 0; k < productosSinRepetir.length; k++) {
                    if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                      let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                      precioCompraProductos = precioCompraProductos + operacionAux;
                    }
                  }
                }
                if (servicio[i].productos_array[j].vitrina1) {
                  for (var k = 0; k < productosSinRepetir.length; k++) {
                    if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                      let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                      precioCompraProductos = precioCompraProductos + operacionAux;
                    }
                  }
                }
                if (servicio[i].productos_array[j].vitrina2) {
                  for (var k = 0; k < productosSinRepetir.length; k++) {
                    if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                      let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                      precioCompraProductos = precioCompraProductos + operacionAux;
                    }
                  }
                }
                if (servicio[i].productos_array[j].vitrina3) {
                  for (var k = 0; k < productosSinRepetir.length; k++) {
                    if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                      let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                      precioCompraProductos = precioCompraProductos + operacionAux;
                    }
                  }
                }
                if (servicio[i].productos_array[j].vitrina4) {
                  for (var k = 0; k < productosSinRepetir.length; k++) {
                    if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                      let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                      precioCompraProductos = precioCompraProductos + operacionAux;
                    }
                  }
                }
              }
            }
          }

          //console.log(precioCompraProductos);
          //console.log(precioVentaProductos);
          let gananciasTotal = precioVentaProductos - precioCompraProductos;
          gananciasTotal = parseInt(gananciasTotal);
          return res.status(200).send({
            success: true,
            message: 'Ganancias año recibidos satisfactoriamente',
            gananciasTotal,
          });

        });
        }
        else {
          console.log("Ganancias no encontrados")
          return res.status(404).send({
            success: false,
            message: 'Fallo retorno Ganancias'
          });
        }
      });
    }

    //obtener ganancias mes
    getGananciasMes(req, res){
      models.Servicio.find({}, (err, doc) => {
        if (err) {
          console.log("error retornando servicios");
          return;
        }
        if (doc !== null) {
          let servicio = doc;
          //console.log("listado de servicio");
          //console.log(servicio);
          var gananciasAnio = 0;
          var nombreProductosArray = [];

          for (var i = 0; i < servicio.length; i++) {

            if (//servicio[i].fecha_inicial_svcio.getDate() == actualDay &&
               servicio[i].fecha_inicial_svcio.getMonth() == actualMonth &&
               servicio[i].fecha_inicial_svcio.getYear() == actualYear)
              {

                for (var j = 0; j < servicio[i].productos_array.length; j++) {
                  //console.log(servicio[i].productos_array[j].precio_venta);
                  if (servicio[i].productos_array[j].aceite) {
                    let con = 0;
                      for (var k = 0; k < nombreProductosArray.length; k++) {
                        if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                          con = con + 1;
                        }
                      }
                      if (con == 0) {
                        nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                      }
                  }
                  if (servicio[i].productos_array[j].aceite1) {
                    let con = 0;
                      for (var k = 0; k < nombreProductosArray.length; k++) {
                        if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                          con = con + 1;
                        }
                      }
                      if (con == 0) {
                        nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                      }
                  }
                  if (servicio[i].productos_array[j].aceite2) {
                    let con = 0;
                      for (var k = 0; k < nombreProductosArray.length; k++) {
                        if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                          con = con + 1;
                        }
                      }
                      if (con == 0) {
                        nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                      }
                  }
                  if (servicio[i].productos_array[j].aceite3) {
                    let con = 0;
                      for (var k = 0; k < nombreProductosArray.length; k++) {
                        if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                          con = con + 1;
                        }
                      }
                      if (con == 0) {
                        nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                      }
                  }
                  if (servicio[i].productos_array[j].aceite4) {
                    let con = 0;
                      for (var k = 0; k < nombreProductosArray.length; k++) {
                        if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                          con = con + 1;
                        }
                      }
                      if (con == 0) {
                        nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                      }
                  }
                  if (servicio[i].productos_array[j].filtro_aire1) {
                    let con = 0;
                      for (var k = 0; k < nombreProductosArray.length; k++) {
                        if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                          con = con + 1;
                        }
                      }
                      if (con == 0) {
                        nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                      }
                  }
                  if (servicio[i].productos_array[j].filtro_aire2) {
                    let con = 0;
                      for (var k = 0; k < nombreProductosArray.length; k++) {
                        if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                          con = con + 1;
                        }
                      }
                      if (con == 0) {
                        nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                      }
                  }
                  if (servicio[i].productos_array[j].filtro_aceite1) {
                    let con = 0;
                      for (var k = 0; k < nombreProductosArray.length; k++) {
                        if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                          con = con + 1;
                        }
                      }
                      if (con == 0) {
                        nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                      }
                  }
                  if (servicio[i].productos_array[j].filtro_aceite2) {
                    let con = 0;
                      for (var k = 0; k < nombreProductosArray.length; k++) {
                        if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                          con = con + 1;
                        }
                      }
                      if (con == 0) {
                        nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                      }
                  }
                  if (servicio[i].productos_array[j].filtro_combustible1) {
                    let con = 0;
                      for (var k = 0; k < nombreProductosArray.length; k++) {
                        if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                          con = con + 1;
                        }
                      }
                      if (con == 0) {
                        nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                      }
                  }
                  if (servicio[i].productos_array[j].filtro_combustible2) {
                    let con = 0;
                      for (var k = 0; k < nombreProductosArray.length; k++) {
                        if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                          con = con + 1;
                        }
                      }
                      if (con == 0) {
                        nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                      }
                  }
                  if (servicio[i].productos_array[j].filtro_combustible3) {
                    let con = 0;
                      for (var k = 0; k < nombreProductosArray.length; k++) {
                        if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                          con = con + 1;
                        }
                      }
                      if (con == 0) {
                        nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                      }
                  }
                  if (servicio[i].productos_array[j].filtro_cabina) {
                    let con = 0;
                      for (var k = 0; k < nombreProductosArray.length; k++) {
                        if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                          con = con + 1;
                        }
                      }
                      if (con == 0) {
                        nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                      }
                  }
                  if (servicio[i].productos_array[j].caja1) {
                    let con = 0;
                      for (var k = 0; k < nombreProductosArray.length; k++) {
                        if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                          con = con + 1;
                        }
                      }
                      if (con == 0) {
                        nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                      }
                  }
                  if (servicio[i].productos_array[j].caja2) {
                    let con = 0;
                      for (var k = 0; k < nombreProductosArray.length; k++) {
                        if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                          con = con + 1;
                        }
                      }
                      if (con == 0) {
                        nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                      }
                  }
                  if (servicio[i].productos_array[j].transmision1) {
                    let con = 0;
                      for (var k = 0; k < nombreProductosArray.length; k++) {
                        if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                          con = con + 1;
                        }
                      }
                      if (con == 0) {
                        nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                      }
                  }
                  if (servicio[i].productos_array[j].transmision2) {
                    let con = 0;
                      for (var k = 0; k < nombreProductosArray.length; k++) {
                        if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                          con = con + 1;
                        }
                      }
                      if (con == 0) {
                        nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                      }
                  }
                  if (servicio[i].productos_array[j].aditivo1) {
                    let con = 0;
                      for (var k = 0; k < nombreProductosArray.length; k++) {
                        if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                          con = con + 1;
                        }
                      }
                      if (con == 0) {
                        nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                      }
                  }
                  if (servicio[i].productos_array[j].aditivo2) {
                    let con = 0;
                      for (var k = 0; k < nombreProductosArray.length; k++) {
                        if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                          con = con + 1;
                        }
                      }
                      if (con == 0) {
                        nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                      }
                  }
                  if (servicio[i].productos_array[j].aditivo3) {
                    let con = 0;
                      for (var k = 0; k < nombreProductosArray.length; k++) {
                        if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                          con = con + 1;
                        }
                      }
                      if (con == 0) {
                        nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                      }
                  }
                  if (servicio[i].productos_array[j].aditivo4) {
                    let con = 0;
                      for (var k = 0; k < nombreProductosArray.length; k++) {
                        if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                          con = con + 1;
                        }
                      }
                      if (con == 0) {
                        nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                      }
                  }
                  if (servicio[i].productos_array[j].vitrina1) {
                    let con = 0;
                      for (var k = 0; k < nombreProductosArray.length; k++) {
                        if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                          con = con + 1;
                        }
                      }
                      if (con == 0) {
                        nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                      }
                  }
                  if (servicio[i].productos_array[j].vitrina2) {
                    let con = 0;
                      for (var k = 0; k < nombreProductosArray.length; k++) {
                        if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                          con = con + 1;
                        }
                      }
                      if (con == 0) {
                        nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                      }
                  }
                  if (servicio[i].productos_array[j].vitrina3) {
                    let con = 0;
                      for (var k = 0; k < nombreProductosArray.length; k++) {
                        if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                          con = con + 1;
                        }
                      }
                      if (con == 0) {
                        nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                      }
                  }
                  if (servicio[i].productos_array[j].vitrina4) {
                    let con = 0;
                      for (var k = 0; k < nombreProductosArray.length; k++) {
                        if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                          con = con + 1;
                        }
                      }
                      if (con == 0) {
                        nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                      }
                  }
                }
              }
          }
          //console.log(nombreProductosArray);
          models.ProductoDetalle.find({"codigo": nombreProductosArray }, (err, doc) => {
            if (err) {
              console.log("error trayendo productos linea765 presupuestoController");
            }
            let productosSinRepetir = doc;
            let precioCompraProductos = 0;
            let precioVentaProductos = 0;
            //console.log(productosSinRepetir);
            for (var i = 0; i < servicio.length; i++) {

              if (//servicio[i].fecha_inicial_svcio.getDate() == actualDay &&
                 servicio[i].fecha_inicial_svcio.getMonth() == actualMonth &&
                 servicio[i].fecha_inicial_svcio.getYear() == actualYear)
              {
                precioVentaProductos = precioVentaProductos + servicio[i].total_precio_condescuento;

                for (var j = 0; j < servicio[i].productos_array.length; j++) {
                  if (servicio[i].productos_array[j].aceite) {
                    for (var k = 0; k < productosSinRepetir.length; k++) {
                      if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                        let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                        precioCompraProductos = precioCompraProductos + operacionAux;
                      }
                    }
                  }
                  if (servicio[i].productos_array[j].aceite1) {
                    for (var k = 0; k < productosSinRepetir.length; k++) {
                      if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                        let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                        precioCompraProductos = precioCompraProductos + operacionAux;
                      }
                    }
                  }
                  if (servicio[i].productos_array[j].aceite2) {
                    for (var k = 0; k < productosSinRepetir.length; k++) {
                      if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                        let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                        precioCompraProductos = precioCompraProductos + operacionAux;
                      }
                    }
                  }
                  if (servicio[i].productos_array[j].aceite3) {
                    for (var k = 0; k < productosSinRepetir.length; k++) {
                      if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                        let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                        precioCompraProductos = precioCompraProductos + operacionAux;
                      }
                    }
                  }
                  if (servicio[i].productos_array[j].aceite4) {
                    for (var k = 0; k < productosSinRepetir.length; k++) {
                      if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                        let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                        precioCompraProductos = precioCompraProductos + operacionAux;
                      }
                    }
                  }
                  if (servicio[i].productos_array[j].filtro_aire1) {
                    for (var k = 0; k < productosSinRepetir.length; k++) {
                      if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                        let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                        precioCompraProductos = precioCompraProductos + operacionAux;
                      }
                    }
                  }
                  if (servicio[i].productos_array[j].filtro_aire2) {
                    for (var k = 0; k < productosSinRepetir.length; k++) {
                      if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                        let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                        precioCompraProductos = precioCompraProductos + operacionAux;
                      }
                    }
                  }

                  if (servicio[i].productos_array[j].filtro_aceite1) {
                    for (var k = 0; k < productosSinRepetir.length; k++) {
                      if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                        let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                        precioCompraProductos = precioCompraProductos + operacionAux;
                      }
                    }
                  }
                  if (servicio[i].productos_array[j].filtro_aceite2) {
                    for (var k = 0; k < productosSinRepetir.length; k++) {
                      if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                        let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                        precioCompraProductos = precioCompraProductos + operacionAux;
                      }
                    }
                  }
                  if (servicio[i].productos_array[j].filtro_combustible1) {
                    for (var k = 0; k < productosSinRepetir.length; k++) {
                      if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                        let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                        precioCompraProductos = precioCompraProductos + operacionAux;
                      }
                    }
                  }
                  if (servicio[i].productos_array[j].filtro_combustible2) {
                    for (var k = 0; k < productosSinRepetir.length; k++) {
                      if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                        let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                        precioCompraProductos = precioCompraProductos + operacionAux;
                      }
                    }
                  }
                  if (servicio[i].productos_array[j].filtro_combustible3) {
                    for (var k = 0; k < productosSinRepetir.length; k++) {
                      if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                        let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                        precioCompraProductos = precioCompraProductos + operacionAux;
                      }
                    }
                  }
                  if (servicio[i].productos_array[j].filtro_cabina) {
                    for (var k = 0; k < productosSinRepetir.length; k++) {
                      if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                        let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                        precioCompraProductos = precioCompraProductos + operacionAux;
                      }
                    }
                  }
                  if (servicio[i].productos_array[j].caja1) {
                    for (var k = 0; k < productosSinRepetir.length; k++) {
                      if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                        let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                        precioCompraProductos = precioCompraProductos + operacionAux;
                      }
                    }
                  }
                  if (servicio[i].productos_array[j].caja2) {
                    for (var k = 0; k < productosSinRepetir.length; k++) {
                      if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                        let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                        precioCompraProductos = precioCompraProductos + operacionAux;
                      }
                    }
                  }
                  if (servicio[i].productos_array[j].transmision1) {
                    for (var k = 0; k < productosSinRepetir.length; k++) {
                      if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                        let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                        precioCompraProductos = precioCompraProductos + operacionAux;
                      }
                    }
                  }
                  if (servicio[i].productos_array[j].transmision2) {
                    for (var k = 0; k < productosSinRepetir.length; k++) {
                      if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                        let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                        precioCompraProductos = precioCompraProductos + operacionAux;
                      }
                    }
                  }
                  if (servicio[i].productos_array[j].aditivo1) {
                    for (var k = 0; k < productosSinRepetir.length; k++) {
                      if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                        let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                        precioCompraProductos = precioCompraProductos + operacionAux;
                      }
                    }
                  }
                  if (servicio[i].productos_array[j].aditivo2) {
                    for (var k = 0; k < productosSinRepetir.length; k++) {
                      if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                        let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                        precioCompraProductos = precioCompraProductos + operacionAux;
                      }
                    }
                  }
                  if (servicio[i].productos_array[j].aditivo3) {
                    for (var k = 0; k < productosSinRepetir.length; k++) {
                      if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                        let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                        precioCompraProductos = precioCompraProductos + operacionAux;
                      }
                    }
                  }
                  if (servicio[i].productos_array[j].aditivo4) {
                    for (var k = 0; k < productosSinRepetir.length; k++) {
                      if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                        let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                        precioCompraProductos = precioCompraProductos + operacionAux;
                      }
                    }
                  }
                  if (servicio[i].productos_array[j].vitrina1) {
                    for (var k = 0; k < productosSinRepetir.length; k++) {
                      if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                        let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                        precioCompraProductos = precioCompraProductos + operacionAux;
                      }
                    }
                  }
                  if (servicio[i].productos_array[j].vitrina2) {
                    for (var k = 0; k < productosSinRepetir.length; k++) {
                      if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                        let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                        precioCompraProductos = precioCompraProductos + operacionAux;
                      }
                    }
                  }
                  if (servicio[i].productos_array[j].vitrina3) {
                    for (var k = 0; k < productosSinRepetir.length; k++) {
                      if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                        let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                        precioCompraProductos = precioCompraProductos + operacionAux;
                      }
                    }
                  }
                  if (servicio[i].productos_array[j].vitrina4) {
                    for (var k = 0; k < productosSinRepetir.length; k++) {
                      if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                        let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                        precioCompraProductos = precioCompraProductos + operacionAux;
                      }
                    }
                  }
                }
              }
            }

            //console.log(precioCompraProductos);
            //console.log(precioVentaProductos);
            let gananciasTotal = precioVentaProductos - precioCompraProductos;
            gananciasTotal = parseInt(gananciasTotal);
            return res.status(200).send({
              success: true,
              message: 'Ganancias año recibidos satisfactoriamente',
              gananciasTotal,
            });

          });
          }
          else {
            console.log("Ganancias no encontrados")
            return res.status(404).send({
              success: false,
              message: 'Fallo retorno Ganancias'
            });
          }
        });
      }

      //obtener ganancias dia
      getGananciasDia(req, res){
        models.Servicio.find({}, (err, doc) => {
          if (err) {
            console.log("error retornando servicios");
            return;
          }
          if (doc !== null) {
            let servicio = doc;
            //console.log("listado de servicio");
            //console.log(servicio);
            var gananciasAnio = 0;
            var nombreProductosArray = [];
            console.log("servicio[i]");
            for (var i = 0; i < servicio.length; i++) {

              if (servicio[i].fecha_inicial_svcio.getDate() == actualDay &&
                 servicio[i].fecha_inicial_svcio.getMonth() == actualMonth &&
                 servicio[i].fecha_inicial_svcio.getYear() == actualYear)
                {

                  //console.log(servicio[i].fecha_inicial_svcio);
                  //console.log(servicio[i].productos_array.length);
                  for (var j = 0; j < servicio[i].productos_array.length; j++) {
                    //console.log(servicio[i].productos_array[j].precio_venta);
                    if (servicio[i].productos_array[j].aceite) {
                      let con = 0;
                        for (var k = 0; k < nombreProductosArray.length; k++) {
                          if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                            con = con + 1;
                          }
                        }
                        if (con == 0) {
                          nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                        }
                    }
                    if (servicio[i].productos_array[j].aceite1) {
                      let con = 0;
                        for (var k = 0; k < nombreProductosArray.length; k++) {
                          if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                            con = con + 1;
                          }
                        }
                        if (con == 0) {
                          nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                        }
                    }
                    if (servicio[i].productos_array[j].aceite2) {
                      let con = 0;
                        for (var k = 0; k < nombreProductosArray.length; k++) {
                          if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                            con = con + 1;
                          }
                        }
                        if (con == 0) {
                          nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                        }
                    }
                    if (servicio[i].productos_array[j].aceite3) {
                      let con = 0;
                        for (var k = 0; k < nombreProductosArray.length; k++) {
                          if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                            con = con + 1;
                          }
                        }
                        if (con == 0) {
                          nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                        }
                    }
                    if (servicio[i].productos_array[j].aceite4) {
                      let con = 0;
                        for (var k = 0; k < nombreProductosArray.length; k++) {
                          if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                            con = con + 1;
                          }
                        }
                        if (con == 0) {
                          nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                        }
                    }
                    if (servicio[i].productos_array[j].filtro_aire1) {
                      let con = 0;
                        for (var k = 0; k < nombreProductosArray.length; k++) {
                          if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                            con = con + 1;
                          }
                        }
                        if (con == 0) {
                          nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                        }
                    }
                    if (servicio[i].productos_array[j].filtro_aire2) {
                      let con = 0;
                        for (var k = 0; k < nombreProductosArray.length; k++) {
                          if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                            con = con + 1;
                          }
                        }
                        if (con == 0) {
                          nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                        }
                    }
                    if (servicio[i].productos_array[j].filtro_aceite1) {
                      let con = 0;
                        for (var k = 0; k < nombreProductosArray.length; k++) {
                          if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                            con = con + 1;
                          }
                        }
                        if (con == 0) {
                          nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                        }
                    }
                    if (servicio[i].productos_array[j].filtro_aceite2) {
                      let con = 0;
                        for (var k = 0; k < nombreProductosArray.length; k++) {
                          if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                            con = con + 1;
                          }
                        }
                        if (con == 0) {
                          nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                        }
                    }
                    if (servicio[i].productos_array[j].filtro_combustible1) {
                      let con = 0;
                        for (var k = 0; k < nombreProductosArray.length; k++) {
                          if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                            con = con + 1;
                          }
                        }
                        if (con == 0) {
                          nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                        }
                    }
                    if (servicio[i].productos_array[j].filtro_combustible2) {
                      let con = 0;
                        for (var k = 0; k < nombreProductosArray.length; k++) {
                          if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                            con = con + 1;
                          }
                        }
                        if (con == 0) {
                          nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                        }
                    }
                    if (servicio[i].productos_array[j].filtro_combustible3) {
                      let con = 0;
                        for (var k = 0; k < nombreProductosArray.length; k++) {
                          if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                            con = con + 1;
                          }
                        }
                        if (con == 0) {
                          nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                        }
                    }
                    if (servicio[i].productos_array[j].filtro_cabina) {
                      let con = 0;
                        for (var k = 0; k < nombreProductosArray.length; k++) {
                          if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                            con = con + 1;
                          }
                        }
                        if (con == 0) {
                          nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                        }
                    }
                    if (servicio[i].productos_array[j].caja1) {
                      let con = 0;
                        for (var k = 0; k < nombreProductosArray.length; k++) {
                          if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                            con = con + 1;
                          }
                        }
                        if (con == 0) {
                          nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                        }
                    }
                    if (servicio[i].productos_array[j].caja2) {
                      let con = 0;
                        for (var k = 0; k < nombreProductosArray.length; k++) {
                          if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                            con = con + 1;
                          }
                        }
                        if (con == 0) {
                          nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                        }
                    }
                    if (servicio[i].productos_array[j].transmision1) {
                      let con = 0;
                        for (var k = 0; k < nombreProductosArray.length; k++) {
                          if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                            con = con + 1;
                          }
                        }
                        if (con == 0) {
                          nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                        }
                    }
                    if (servicio[i].productos_array[j].transmision2) {
                      let con = 0;
                        for (var k = 0; k < nombreProductosArray.length; k++) {
                          if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                            con = con + 1;
                          }
                        }
                        if (con == 0) {
                          nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                        }
                    }
                    if (servicio[i].productos_array[j].aditivo1) {
                      let con = 0;
                        for (var k = 0; k < nombreProductosArray.length; k++) {
                          if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                            con = con + 1;
                          }
                        }
                        if (con == 0) {
                          nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                        }
                    }
                    if (servicio[i].productos_array[j].aditivo2) {
                      let con = 0;
                        for (var k = 0; k < nombreProductosArray.length; k++) {
                          if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                            con = con + 1;
                          }
                        }
                        if (con == 0) {
                          nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                        }
                    }
                    if (servicio[i].productos_array[j].aditivo3) {
                      let con = 0;
                        for (var k = 0; k < nombreProductosArray.length; k++) {
                          if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                            con = con + 1;
                          }
                        }
                        if (con == 0) {
                          nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                        }
                    }
                    if (servicio[i].productos_array[j].aditivo4) {
                      let con = 0;
                        for (var k = 0; k < nombreProductosArray.length; k++) {
                          if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                            con = con + 1;
                          }
                        }
                        if (con == 0) {
                          nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                        }
                    }
                    if (servicio[i].productos_array[j].vitrina1) {
                      let con = 0;
                        for (var k = 0; k < nombreProductosArray.length; k++) {
                          if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                            con = con + 1;
                          }
                        }
                        if (con == 0) {
                          nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                        }
                    }
                    if (servicio[i].productos_array[j].vitrina2) {
                      let con = 0;
                        for (var k = 0; k < nombreProductosArray.length; k++) {
                          if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                            con = con + 1;
                          }
                        }
                        if (con == 0) {
                          nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                        }
                    }
                    if (servicio[i].productos_array[j].vitrina3) {
                      let con = 0;
                        for (var k = 0; k < nombreProductosArray.length; k++) {
                          if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                            con = con + 1;
                          }
                        }
                        if (con == 0) {
                          nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                        }
                    }
                    if (servicio[i].productos_array[j].vitrina4) {
                      let con = 0;
                        for (var k = 0; k < nombreProductosArray.length; k++) {
                          if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                            con = con + 1;
                          }
                        }
                        if (con == 0) {
                          nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                        }
                    }
                  }
                }
            }
            //console.log("nombreProductosArray");
            //console.log(nombreProductosArray);
            models.ProductoDetalle.find({"codigo": nombreProductosArray }, (err, doc) => {
              if (err) {
                console.log("error trayendo productos linea765 presupuestoController");
              }
              let productosSinRepetir = doc;
              let precioCompraProductos = 0;
              let precioVentaProductos = 0;
              //console.log(productosSinRepetir);
              for (var i = 0; i < servicio.length; i++) {

                if (servicio[i].fecha_inicial_svcio.getDate() == actualDay &&
                   servicio[i].fecha_inicial_svcio.getMonth() == actualMonth &&
                   servicio[i].fecha_inicial_svcio.getYear() == actualYear)
                {
                  precioVentaProductos = precioVentaProductos + servicio[i].total_precio_condescuento;

                  for (var j = 0; j < servicio[i].productos_array.length; j++) {
                    if (servicio[i].productos_array[j].aceite) {
                      for (var k = 0; k < productosSinRepetir.length; k++) {
                        if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                          let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                          precioCompraProductos = precioCompraProductos + operacionAux;
                        }
                      }
                    }
                    if (servicio[i].productos_array[j].aceite1) {
                      for (var k = 0; k < productosSinRepetir.length; k++) {
                        if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                          let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                          precioCompraProductos = precioCompraProductos + operacionAux;
                        }
                      }
                    }
                    if (servicio[i].productos_array[j].aceite2) {
                      for (var k = 0; k < productosSinRepetir.length; k++) {
                        if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                          let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                          precioCompraProductos = precioCompraProductos + operacionAux;
                        }
                      }
                    }
                    if (servicio[i].productos_array[j].aceite3) {
                      for (var k = 0; k < productosSinRepetir.length; k++) {
                        if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                          let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                          precioCompraProductos = precioCompraProductos + operacionAux;
                        }
                      }
                    }
                    if (servicio[i].productos_array[j].aceite4) {
                      for (var k = 0; k < productosSinRepetir.length; k++) {
                        if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                          let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                          precioCompraProductos = precioCompraProductos + operacionAux;
                        }
                      }
                    }
                    if (servicio[i].productos_array[j].filtro_aire1) {
                      for (var k = 0; k < productosSinRepetir.length; k++) {
                        if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                          let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                          precioCompraProductos = precioCompraProductos + operacionAux;
                        }
                      }
                    }
                    if (servicio[i].productos_array[j].filtro_aire2) {
                      for (var k = 0; k < productosSinRepetir.length; k++) {
                        if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                          let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                          precioCompraProductos = precioCompraProductos + operacionAux;
                        }
                      }
                    }

                    if (servicio[i].productos_array[j].filtro_aceite1) {
                      for (var k = 0; k < productosSinRepetir.length; k++) {
                        if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                          let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                          precioCompraProductos = precioCompraProductos + operacionAux;
                        }
                      }
                    }
                    if (servicio[i].productos_array[j].filtro_aceite2) {
                      for (var k = 0; k < productosSinRepetir.length; k++) {
                        if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                          let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                          precioCompraProductos = precioCompraProductos + operacionAux;
                        }
                      }
                    }
                    if (servicio[i].productos_array[j].filtro_combustible1) {
                      for (var k = 0; k < productosSinRepetir.length; k++) {
                        if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                          let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                          precioCompraProductos = precioCompraProductos + operacionAux;
                        }
                      }
                    }
                    if (servicio[i].productos_array[j].filtro_combustible2) {
                      for (var k = 0; k < productosSinRepetir.length; k++) {
                        if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                          let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                          precioCompraProductos = precioCompraProductos + operacionAux;
                        }
                      }
                    }
                    if (servicio[i].productos_array[j].filtro_combustible3) {
                      for (var k = 0; k < productosSinRepetir.length; k++) {
                        if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                          let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                          precioCompraProductos = precioCompraProductos + operacionAux;
                        }
                      }
                    }
                    if (servicio[i].productos_array[j].filtro_cabina) {
                      for (var k = 0; k < productosSinRepetir.length; k++) {
                        if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                          let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                          precioCompraProductos = precioCompraProductos + operacionAux;
                        }
                      }
                    }
                    if (servicio[i].productos_array[j].caja1) {
                      for (var k = 0; k < productosSinRepetir.length; k++) {
                        if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                          let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                          precioCompraProductos = precioCompraProductos + operacionAux;
                        }
                      }
                    }
                    if (servicio[i].productos_array[j].caja2) {
                      for (var k = 0; k < productosSinRepetir.length; k++) {
                        if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                          let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                          precioCompraProductos = precioCompraProductos + operacionAux;
                        }
                      }
                    }
                    if (servicio[i].productos_array[j].transmision1) {
                      for (var k = 0; k < productosSinRepetir.length; k++) {
                        if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                          let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                          precioCompraProductos = precioCompraProductos + operacionAux;
                        }
                      }
                    }
                    if (servicio[i].productos_array[j].transmision2) {
                      for (var k = 0; k < productosSinRepetir.length; k++) {
                        if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                          let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                          precioCompraProductos = precioCompraProductos + operacionAux;
                        }
                      }
                    }
                    if (servicio[i].productos_array[j].aditivo1) {
                      for (var k = 0; k < productosSinRepetir.length; k++) {
                        if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                          let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                          precioCompraProductos = precioCompraProductos + operacionAux;
                        }
                      }
                    }
                    if (servicio[i].productos_array[j].aditivo2) {
                      for (var k = 0; k < productosSinRepetir.length; k++) {
                        if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                          let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                          precioCompraProductos = precioCompraProductos + operacionAux;
                        }
                      }
                    }
                    if (servicio[i].productos_array[j].aditivo3) {
                      for (var k = 0; k < productosSinRepetir.length; k++) {
                        if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                          let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                          precioCompraProductos = precioCompraProductos + operacionAux;
                        }
                      }
                    }
                    if (servicio[i].productos_array[j].aditivo4) {
                      for (var k = 0; k < productosSinRepetir.length; k++) {
                        if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                          let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                          precioCompraProductos = precioCompraProductos + operacionAux;
                        }
                      }
                    }
                    if (servicio[i].productos_array[j].vitrina1) {
                      for (var k = 0; k < productosSinRepetir.length; k++) {
                        if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                          let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                          precioCompraProductos = precioCompraProductos + operacionAux;
                        }
                      }
                    }
                    if (servicio[i].productos_array[j].vitrina2) {
                      for (var k = 0; k < productosSinRepetir.length; k++) {
                        if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                          let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                          precioCompraProductos = precioCompraProductos + operacionAux;
                        }
                      }
                    }
                    if (servicio[i].productos_array[j].vitrina3) {
                      for (var k = 0; k < productosSinRepetir.length; k++) {
                        if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                          let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                          precioCompraProductos = precioCompraProductos + operacionAux;
                        }
                      }
                    }
                    if (servicio[i].productos_array[j].vitrina4) {
                      for (var k = 0; k < productosSinRepetir.length; k++) {
                        if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                          let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                          precioCompraProductos = precioCompraProductos + operacionAux;
                        }
                      }
                    }
                  }
                }
              }

              //console.log(precioCompraProductos);
              //console.log(precioVentaProductos);
              let gananciasTotal = precioVentaProductos - precioCompraProductos;
              gananciasTotal = parseInt(gananciasTotal);
              return res.status(200).send({
                success: true,
                message: 'Ganancias año recibidos satisfactoriamente',
                gananciasTotal,
              });

            });
            }
            else {
              console.log("Ganancias no encontrados")
              return res.status(404).send({
                success: false,
                message: 'Fallo retorno Ganancias'
              });
            }
          });
        }


        //obtener presupuesto salidas por fecha
        getGananciasFecha(req, res){

          if (!req.params.fecha) {
           return res.status(400).send({
             success: false,
             message: 'fecha es requerido',
             });
           }

          let fecha = req.params.fecha;

          let gananciasDia = 0;
          let gananciasMes = 0;
          let gananciasAnio = 0;

          let diaPedido = parseInt(fecha[0] + fecha[1])
          let mesPedido = parseInt(fecha[2] + fecha[3]) - 1
          let anioPedido = 0;
          if (parseInt(fecha[4] + fecha[5] + fecha[6] + fecha[7]) == 2019) {
             anioPedido = 119;
          }
          if (parseInt(fecha[4] + fecha[5] + fecha[6] + fecha[7]) == 2020) {
             anioPedido = 120;
          }
          if (parseInt(fecha[4] + fecha[5] + fecha[6] + fecha[7]) == 2021) {
             anioPedido = 121;
          }
          if (parseInt(fecha[4] + fecha[5] + fecha[6] + fecha[7]) == 2022) {
             anioPedido = 122;
          }


          models.Servicio.find({}, (err, doc) => {
            if (err) {
              console.log("error retornando servicios");
              return;
            }
            if (doc !== null) {
              let servicio = doc;
              //console.log("listado de servicio");
              //console.log(servicio);
              var gananciasAnio = 0;
              var nombreProductosArray = [];

              for (var i = 0; i < servicio.length; i++) {

                if (servicio[i].fecha_inicial_svcio.getDate() == diaPedido &&
                   servicio[i].fecha_inicial_svcio.getMonth() == mesPedido &&
                   servicio[i].fecha_inicial_svcio.getYear() == anioPedido)
                  {
                    //console.log("servicios dia mes año");
                    //console.log(i);
                    for (var j = 0; j < servicio[i].productos_array.length; j++) {
                      //console.log(servicio[i].productos_array[j].precio_venta);
                      if (servicio[i].productos_array[j].aceite) {
                        let con = 0;
                          for (var k = 0; k < nombreProductosArray.length; k++) {
                            if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                              con = con + 1;
                            }
                          }
                          if (con == 0) {
                            nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                          }
                      }
                      if (servicio[i].productos_array[j].aceite1) {
                        let con = 0;
                          for (var k = 0; k < nombreProductosArray.length; k++) {
                            if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                              con = con + 1;
                            }
                          }
                          if (con == 0) {
                            nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                          }
                      }
                      if (servicio[i].productos_array[j].aceite2) {
                        let con = 0;
                          for (var k = 0; k < nombreProductosArray.length; k++) {
                            if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                              con = con + 1;
                            }
                          }
                          if (con == 0) {
                            nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                          }
                      }
                      if (servicio[i].productos_array[j].aceite3) {
                        let con = 0;
                          for (var k = 0; k < nombreProductosArray.length; k++) {
                            if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                              con = con + 1;
                            }
                          }
                          if (con == 0) {
                            nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                          }
                      }
                      if (servicio[i].productos_array[j].aceite4) {
                        let con = 0;
                          for (var k = 0; k < nombreProductosArray.length; k++) {
                            if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                              con = con + 1;
                            }
                          }
                          if (con == 0) {
                            nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                          }
                      }
                      if (servicio[i].productos_array[j].filtro_aire1) {
                        let con = 0;
                          for (var k = 0; k < nombreProductosArray.length; k++) {
                            if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                              con = con + 1;
                            }
                          }
                          if (con == 0) {
                            nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                          }
                      }
                      if (servicio[i].productos_array[j].filtro_aire2) {
                        let con = 0;
                          for (var k = 0; k < nombreProductosArray.length; k++) {
                            if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                              con = con + 1;
                            }
                          }
                          if (con == 0) {
                            nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                          }
                      }
                      if (servicio[i].productos_array[j].filtro_aceite1) {
                        let con = 0;
                          for (var k = 0; k < nombreProductosArray.length; k++) {
                            if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                              con = con + 1;
                            }
                          }
                          if (con == 0) {
                            nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                          }
                      }
                      if (servicio[i].productos_array[j].filtro_aceite2) {
                        let con = 0;
                          for (var k = 0; k < nombreProductosArray.length; k++) {
                            if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                              con = con + 1;
                            }
                          }
                          if (con == 0) {
                            nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                          }
                      }
                      if (servicio[i].productos_array[j].filtro_combustible1) {
                        let con = 0;
                          for (var k = 0; k < nombreProductosArray.length; k++) {
                            if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                              con = con + 1;
                            }
                          }
                          if (con == 0) {
                            nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                          }
                      }
                      if (servicio[i].productos_array[j].filtro_combustible2) {
                        let con = 0;
                          for (var k = 0; k < nombreProductosArray.length; k++) {
                            if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                              con = con + 1;
                            }
                          }
                          if (con == 0) {
                            nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                          }
                      }
                      if (servicio[i].productos_array[j].filtro_combustible3) {
                        let con = 0;
                          for (var k = 0; k < nombreProductosArray.length; k++) {
                            if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                              con = con + 1;
                            }
                          }
                          if (con == 0) {
                            nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                          }
                      }
                      if (servicio[i].productos_array[j].filtro_cabina) {
                        let con = 0;
                          for (var k = 0; k < nombreProductosArray.length; k++) {
                            if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                              con = con + 1;
                            }
                          }
                          if (con == 0) {
                            nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                          }
                      }
                      if (servicio[i].productos_array[j].caja1) {
                        let con = 0;
                          for (var k = 0; k < nombreProductosArray.length; k++) {
                            if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                              con = con + 1;
                            }
                          }
                          if (con == 0) {
                            nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                          }
                      }
                      if (servicio[i].productos_array[j].caja2) {
                        let con = 0;
                          for (var k = 0; k < nombreProductosArray.length; k++) {
                            if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                              con = con + 1;
                            }
                          }
                          if (con == 0) {
                            nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                          }
                      }
                      if (servicio[i].productos_array[j].transmision1) {
                        let con = 0;
                          for (var k = 0; k < nombreProductosArray.length; k++) {
                            if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                              con = con + 1;
                            }
                          }
                          if (con == 0) {
                            nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                          }
                      }
                      if (servicio[i].productos_array[j].transmision2) {
                        let con = 0;
                          for (var k = 0; k < nombreProductosArray.length; k++) {
                            if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                              con = con + 1;
                            }
                          }
                          if (con == 0) {
                            nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                          }
                      }
                      if (servicio[i].productos_array[j].aditivo1) {
                        let con = 0;
                          for (var k = 0; k < nombreProductosArray.length; k++) {
                            if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                              con = con + 1;
                            }
                          }
                          if (con == 0) {
                            nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                          }
                      }
                      if (servicio[i].productos_array[j].aditivo2) {
                        let con = 0;
                          for (var k = 0; k < nombreProductosArray.length; k++) {
                            if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                              con = con + 1;
                            }
                          }
                          if (con == 0) {
                            nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                          }
                      }
                      if (servicio[i].productos_array[j].aditivo3) {
                        let con = 0;
                          for (var k = 0; k < nombreProductosArray.length; k++) {
                            if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                              con = con + 1;
                            }
                          }
                          if (con == 0) {
                            nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                          }
                      }
                      if (servicio[i].productos_array[j].aditivo4) {
                        let con = 0;
                          for (var k = 0; k < nombreProductosArray.length; k++) {
                            if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                              con = con + 1;
                            }
                          }
                          if (con == 0) {
                            nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                          }
                      }
                      if (servicio[i].productos_array[j].vitrina1) {
                        let con = 0;
                          for (var k = 0; k < nombreProductosArray.length; k++) {
                            if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                              con = con + 1;
                            }
                          }
                          if (con == 0) {
                            nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                          }
                      }
                      if (servicio[i].productos_array[j].vitrina2) {
                        let con = 0;
                          for (var k = 0; k < nombreProductosArray.length; k++) {
                            if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                              con = con + 1;
                            }
                          }
                          if (con == 0) {
                            nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                          }
                      }
                      if (servicio[i].productos_array[j].vitrina3) {
                        let con = 0;
                          for (var k = 0; k < nombreProductosArray.length; k++) {
                            if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                              con = con + 1;
                            }
                          }
                          if (con == 0) {
                            nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                          }
                      }
                      if (servicio[i].productos_array[j].vitrina4) {
                        let con = 0;
                          for (var k = 0; k < nombreProductosArray.length; k++) {
                            if (servicio[i].productos_array[j].codigo == nombreProductosArray[k]) {
                              con = con + 1;
                            }
                          }
                          if (con == 0) {
                            nombreProductosArray.push(servicio[i].productos_array[j].codigo);
                          }
                      }
                    }
                  }
              }
              //console.log(nombreProductosArray);
              models.ProductoDetalle.find({"codigo": nombreProductosArray }, (err, doc) => {
                if (err) {
                  console.log("error trayendo productos linea765 presupuestoController");
                }
                let productosSinRepetir = doc;
                let precioCompraProductos = 0;
                let precioVentaProductos = 0;
                //console.log(productosSinRepetir);
                for (var i = 0; i < servicio.length; i++) {

                  if (servicio[i].fecha_inicial_svcio.getDate() == diaPedido &&
                     servicio[i].fecha_inicial_svcio.getMonth() == mesPedido &&
                     servicio[i].fecha_inicial_svcio.getYear() == anioPedido)
                  {
                    precioVentaProductos = precioVentaProductos + servicio[i].total_precio_condescuento;

                    for (var j = 0; j < servicio[i].productos_array.length; j++) {
                      if (servicio[i].productos_array[j].aceite) {
                        for (var k = 0; k < productosSinRepetir.length; k++) {
                          if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                            let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                            precioCompraProductos = precioCompraProductos + operacionAux;
                          }
                        }
                      }
                      if (servicio[i].productos_array[j].aceite1) {
                        for (var k = 0; k < productosSinRepetir.length; k++) {
                          if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                            let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                            precioCompraProductos = precioCompraProductos + operacionAux;
                          }
                        }
                      }
                      if (servicio[i].productos_array[j].aceite2) {
                        for (var k = 0; k < productosSinRepetir.length; k++) {
                          if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                            let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                            precioCompraProductos = precioCompraProductos + operacionAux;
                          }
                        }
                      }
                      if (servicio[i].productos_array[j].aceite3) {
                        for (var k = 0; k < productosSinRepetir.length; k++) {
                          if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                            let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                            precioCompraProductos = precioCompraProductos + operacionAux;
                          }
                        }
                      }
                      if (servicio[i].productos_array[j].aceite4) {
                        for (var k = 0; k < productosSinRepetir.length; k++) {
                          if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                            let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                            precioCompraProductos = precioCompraProductos + operacionAux;
                          }
                        }
                      }
                      if (servicio[i].productos_array[j].filtro_aire1) {
                        for (var k = 0; k < productosSinRepetir.length; k++) {
                          if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                            let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                            precioCompraProductos = precioCompraProductos + operacionAux;
                          }
                        }
                      }
                      if (servicio[i].productos_array[j].filtro_aire2) {
                        for (var k = 0; k < productosSinRepetir.length; k++) {
                          if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                            let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                            precioCompraProductos = precioCompraProductos + operacionAux;
                          }
                        }
                      }

                      if (servicio[i].productos_array[j].filtro_aceite1) {
                        for (var k = 0; k < productosSinRepetir.length; k++) {
                          if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                            let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                            precioCompraProductos = precioCompraProductos + operacionAux;
                          }
                        }
                      }
                      if (servicio[i].productos_array[j].filtro_aceite2) {
                        for (var k = 0; k < productosSinRepetir.length; k++) {
                          if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                            let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                            precioCompraProductos = precioCompraProductos + operacionAux;
                          }
                        }
                      }
                      if (servicio[i].productos_array[j].filtro_combustible1) {
                        for (var k = 0; k < productosSinRepetir.length; k++) {
                          if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                            let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                            precioCompraProductos = precioCompraProductos + operacionAux;
                          }
                        }
                      }
                      if (servicio[i].productos_array[j].filtro_combustible2) {
                        for (var k = 0; k < productosSinRepetir.length; k++) {
                          if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                            let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                            precioCompraProductos = precioCompraProductos + operacionAux;
                          }
                        }
                      }
                      if (servicio[i].productos_array[j].filtro_combustible3) {
                        for (var k = 0; k < productosSinRepetir.length; k++) {
                          if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                            let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                            precioCompraProductos = precioCompraProductos + operacionAux;
                          }
                        }
                      }
                      if (servicio[i].productos_array[j].filtro_cabina) {
                        for (var k = 0; k < productosSinRepetir.length; k++) {
                          if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                            let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                            precioCompraProductos = precioCompraProductos + operacionAux;
                          }
                        }
                      }
                      if (servicio[i].productos_array[j].caja1) {
                        for (var k = 0; k < productosSinRepetir.length; k++) {
                          if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                            let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                            precioCompraProductos = precioCompraProductos + operacionAux;
                          }
                        }
                      }
                      if (servicio[i].productos_array[j].caja2) {
                        for (var k = 0; k < productosSinRepetir.length; k++) {
                          if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                            let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                            precioCompraProductos = precioCompraProductos + operacionAux;
                          }
                        }
                      }
                      if (servicio[i].productos_array[j].transmision1) {
                        for (var k = 0; k < productosSinRepetir.length; k++) {
                          if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                            let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                            precioCompraProductos = precioCompraProductos + operacionAux;
                          }
                        }
                      }
                      if (servicio[i].productos_array[j].transmision2) {
                        for (var k = 0; k < productosSinRepetir.length; k++) {
                          if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                            let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                            precioCompraProductos = precioCompraProductos + operacionAux;
                          }
                        }
                      }
                      if (servicio[i].productos_array[j].aditivo1) {
                        for (var k = 0; k < productosSinRepetir.length; k++) {
                          if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                            let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                            precioCompraProductos = precioCompraProductos + operacionAux;
                          }
                        }
                      }
                      if (servicio[i].productos_array[j].aditivo2) {
                        for (var k = 0; k < productosSinRepetir.length; k++) {
                          if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                            let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                            precioCompraProductos = precioCompraProductos + operacionAux;
                          }
                        }
                      }
                      if (servicio[i].productos_array[j].aditivo3) {
                        for (var k = 0; k < productosSinRepetir.length; k++) {
                          if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                            let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                            precioCompraProductos = precioCompraProductos + operacionAux;
                          }
                        }
                      }
                      if (servicio[i].productos_array[j].aditivo4) {
                        for (var k = 0; k < productosSinRepetir.length; k++) {
                          if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                            let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                            precioCompraProductos = precioCompraProductos + operacionAux;
                          }
                        }
                      }
                      if (servicio[i].productos_array[j].vitrina1) {
                        for (var k = 0; k < productosSinRepetir.length; k++) {
                          if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                            let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                            precioCompraProductos = precioCompraProductos + operacionAux;
                          }
                        }
                      }
                      if (servicio[i].productos_array[j].vitrina2) {
                        for (var k = 0; k < productosSinRepetir.length; k++) {
                          if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                            let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                            precioCompraProductos = precioCompraProductos + operacionAux;
                          }
                        }
                      }
                      if (servicio[i].productos_array[j].vitrina3) {
                        for (var k = 0; k < productosSinRepetir.length; k++) {
                          if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                            let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                            precioCompraProductos = precioCompraProductos + operacionAux;
                          }
                        }
                      }
                      if (servicio[i].productos_array[j].vitrina4) {
                        for (var k = 0; k < productosSinRepetir.length; k++) {
                          if (servicio[i].productos_array[j].codigo == productosSinRepetir[k].codigo) {
                            let operacionAux = productosSinRepetir[k].precio_compra * servicio[i].productos_array[j].cantidad_actual;
                            precioCompraProductos = precioCompraProductos + operacionAux;
                          }
                        }
                      }
                    }
                  }
                }

                //console.log(precioCompraProductos);
                //console.log(precioVentaProductos);
                let gananciasTotal = precioVentaProductos - precioCompraProductos;
                gananciasTotal = parseInt(gananciasTotal);
                return res.status(200).send({
                  success: true,
                  message: 'Ganancias fecha específica recibidos satisfactoriamente',
                  gananciasTotal,
                });

              });
              }
              else {
                console.log("Ganancias no encontrados")
                return res.status(404).send({
                  success: false,
                  message: 'Fallo retorno Ganancias'
                });
              }
            });

        /*  models.Salida.find({}, (err, doc) => {
            if (err) {
              return res.status(403).send({
                success: false,
                message: 'error retornando Salida'
              });
            }
            if (doc !== null) {
              let Salidas = doc;
              let salidasDia = 0;
              let salidasMes = 0;
              let salidasAnio = 0;

              let diaPedido = parseInt(fecha[0] + fecha[1])
              let mesPedido = parseInt(fecha[2] + fecha[3]) - 1
              let anioPedido = 0;
              if (parseInt(fecha[4] + fecha[5] + fecha[6] + fecha[7]) == 2019) {
                 anioPedido = 119;
              }
              if (parseInt(fecha[4] + fecha[5] + fecha[6] + fecha[7]) == 2020) {
                 anioPedido = 120;
              }
              if (parseInt(fecha[4] + fecha[5] + fecha[6] + fecha[7]) == 2021) {
                 anioPedido = 121;
              }
              if (parseInt(fecha[4] + fecha[5] + fecha[6] + fecha[7]) == 2022) {
                 anioPedido = 122;
              }


              for (var i = 0; i < Salidas.length; i++) {
                if (Salidas[i].fecha_sal.getDate() == diaPedido &&
                    Salidas[i].fecha_sal.getMonth() == mesPedido &&
                    Salidas[i].fecha_sal.getYear() == anioPedido) {
                    salidasDia = salidasDia + Salidas[i].valor_sal;
                }
                if (Salidas[i].fecha_sal.getMonth() == mesPedido &&
                    Salidas[i].fecha_sal.getYear() == anioPedido) {
                    salidasMes = salidasMes + Salidas[i].valor_sal;
                }
                if (Salidas[i].fecha_sal.getYear() == anioPedido) {
                    salidasAnio = salidasAnio + Salidas[i].valor_sal;
                }
              }
              return res.status(200).send({
                success: true,
                message: 'salidas encontrado exitosamente',
                salidasDia,
                salidasMes,
                salidasAnio
              });
            }
            else {
              //console.log("Entrada no encontrado")
              return res.status(404).send({
                success: false,
                message: 'salidas no encontrado',
              });
            }
          }); */
        }

}

const presupuestoController = new PresupuestoController();
export default presupuestoController;
