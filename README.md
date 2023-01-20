# betocar

# betocar-server-v2.0.0


(algunos cambios han sido hechos que no han sido agregado al README)

Correr el proyecto

npm cache clean --force //limpiar cache

rm -rf node_modules/ //eliminar modulos node

npm install //reinstalar modulos node

npm start //iniciar server


#API end points

===========================cliente=============================

get http://localhost:5000/api/v1/cliente

post http://localhost:5000/api/v1/cliente
obligatorios=>	{nombres_cliente: "friedrich",
								apellidos_cliente: "nietzsche",
								cc_cliente: "12345678"}
otros campos=> cel_cliente: "3003144343", correo_cliente: "filosofia@nietzshe.com", direccion_cliente: "kra 15 15 15"

getOne http://localhost:5000/api/v1/cliente/id

update http://localhost:5000/api/v1/cliente/id
obligatorios=>	{nombres_cliente: "friedrich",
								apellidos_cliente: "nietzsche",
								cc_cliente: "12345678"}
otros campos=> cel_cliente: "3003144343", correo_cliente: "filosofia@nietzshe.com", direccion_cliente: "kra 15 15 15"

delete http://localhost:5000/api/v1/cliente/id


//cliente por cc
getOne por cc http://localhost:5000/api/v1/cliente/cc/12345
delete por cc http://localhost:5000/api/v1/cliente/cc/12345
update por cc http://localhost:5000/api/v1/cliente/cc/12345

===========================credito=============================

get http://localhost:5000/api/v1/credito

post http://localhost:5000/api/v1/credito
obligatorios=>	{servicios_idServicio: 1}
otros campos=> total_cr: 90000, saldo_cr: 30000, pago_cr: 20000

getOne http://localhost:5000/api/v1/credito/id

update http://localhost:5000/api/v1/credito/id
obligatorios=>	{servicios_idServicio: 1}
otros campos=> total_cr: 90000, saldo_cr: 30000, pago_cr: 20000

delete http://localhost:5000/api/v1/credito/id

pagarCuota
http://localhost:5000/api/v1/credito/pagarCuota
obligatorios=>	{servicios_idServicio: 1, pago_cr: 10000}

historial creditos por id servicios
http://localhost:5000/api/v1/credito/idservicio/:idservicio
obligatorios=> {servicios_idServicio: 1}


===========================entrada=============================

get http://localhost:5000/api/v1/entrada
vehiculo_idVehiculo
post http://localhost:5000/api/v1/entrada
obligatorios=>	{servicios_idServicio: 1}
otros campos=> datos_extra_ent: pago con descuento doble, valor_ent: 35000

getOne http://localhost:5000/api/v1/entrada/id

update http://localhost:5000/api/v1/entrada/id
obligatorios=>	{servicios_idServicio: 1}
otros campos=> datos_extra_ent: "pago con descuento", valor_ent: "70000"

delete http://localhost:5000/api/v1/entrada/id

===========================salida=============================

get http://localhost:5000/api/v1/salida

post http://localhost:5000/api/v1/salida
obligatorios=>	{valor_sal: 120000}
otros campos=> motivo_sal: "pago empleado"

getOne http://localhost:5000/api/v1/salida/id

update http://localhost:5000/api/v1/salida/id
obligatorios=>	{valor_sal: 120000}
otros campos=> motivo_sal: "pago empleados"

delete http://localhost:5000/api/v1/salida/id

===========================servicio=============================

todos los campos:

estado_pago_svcio: "contado"
fecha_inicial_svcio:  Date.now
nro_factura_svcio:  0

aceite_km_actual: 1234
aceite_km_actual: 1234
caja_km_actual: 4312
caja_km_actual: 4123
transmision_km_actual: 4123
transmision_km_actual: 0

descripcion_mano_obra_svcio:  ""
valor_mano_obra_svcio:  ""
estado_pago_svcio:  "contado"
otros_svcio:  "contado"
productos_array: array
valor_cancelado_svcio: 15000
total_precio_servicio: 50000
vehiculo_idVehiculo: "0"
cliente_idCliente: "1"
total_precio_condescuento: 30000

get http://localhost:5000/api/v1/servicio

post http://localhost:5000/api/v1/servicio
obligatorios=>	{estado_pago_svcio: "contado", nro_factura_svcio: 143, total_precio_servicio, valor_cancelado_svcio}

getOne http://localhost:5000/api/v1/servicio/id

update http://localhost:5000/api/v1/servicio/id
obligatorios=>	{estado_pago_svcio: "contado", vehiculo_idVehiculo: 1, nro_factura_svcio: 143}

delete http://localhost:5000/api/v1/servicio/id

servicio completo devuelve facturas con placa y clientes, estado pago, total_precio_condescuento, valor_cancelado_svcio
get http://localhost:5000/api/v1/servicioCompleto

servicios por id cliente
get http://localhost:5000/api/v1/servicioCompletoByIdCliente/:idCliente

servicios por cc clientes
http://localhost:5000/api/v1/servicio/cliente/:cc
ejemplo http://localhost:5000/api/v1/servicio/cliente/1098776121

===========================producto=============================

get http://localhost:5000/api/v1/producto/

post http://localhost:5000/api/v1/producto
obligatorios=>	{referencia: "rpg 4545",
								tipo_producto: "aceite"}
otros campos=> cantidad_actual: 8,
				precio_compra: 140000, precio_venta: 120000,
				notas: "vencido",
				tipo_vh_compatible: "mazda 3", equivalencia: "r4545",
				codigo: "11001"

getOne http://localhost:5000/api/v1/producto/id

update http://localhost:5000/api/v1/producto/id
obligatorios=>	{referencia: "rpg 4545",
								tipo_producto: "aceite"}
otros campos=> cantidad_actual: 8,
				precio_compra: 140000, precio_venta: 120000,
				notas: "vencido",
				tipo_vh_compatible: "mazda 3", equivalencia: "r4545",
				codigo: "11001"

delete http://localhost:5000/api/v1/producto/id

===========================veh'iculo=============================

placa_vh: {type: String}
marca_vh: {type: String}
modelo_vh: {type: String}
otros_vh: {type: String}
tipoVehiculos: {type: String}
cliente_idCliente: {type: String}
aceite: {type: String}
filtro_aceite: {type: String}
filtro_aire: {type: String}
filtro_combustible: {type: String}
filtro_cabina: {type: String}
caja: {type: String}
transmision: {type: String}
aditivo: {type: String}
vitrina: {type: String}
aceite_km_actual: {type: String}
aceite_km_proximo: {type: String}
caja_km_actual: {type: String}
caja_km_proximo: {type: String}
transmision_km_actual: {type: String}
transmision_km_proximo: {type: String}

get http://localhost:5000/api/v1/vehiculo

post http://localhost:5000/api/v1/vehiculo
obligatorios=>	{placa_vh: "abc321"}

getOne http://localhost:5000/api/v1/vehiculo/id

update http://localhost:5000/api/v1/vehiculo/id
obligatorios	{placa_vh: "abc321"}

delete http://localhost:5000/api/v1/vehiculo/id

/////////////////////////////////////////////////////////////////////////////////////


//nuevos cambios 02-05-2019
Vehiculo y cliente por cc de cliente http://localhost:5000/api/v1/vehiculo/cccliente/123423
Vehiculo y cliente por placa http://localhost:5000/api/v1/vehiculo/placa/asdf

//nuevos cambios 07-05-2019
Array credito por placa http://localhost:5000/api/v1/credito/placa/asdf

update credito http://localhost:5000/api/v1/credito/id
id => id credito
obligatorios=>	{pago_cr: 10000}
Si el pago que hace el cliente es mayor al saldo, el servicio devuelve el valor en negativo
que se debe devolver.


//2nd update
productos por codigo  http://localhost:5000/api/v1/producto/codigo/11014

modificaci'on de servicio. Desde el front end ser'a env'iado el total_precio_servicio (total factura) y el valor cancelado por el usuario
post http://localhost:5000/api/v1/servicio
obligatorios=>	{estado_pago_svcio: "contado", nro_factura_svcio: 143, total_precio_servicio, valor_cancelado_svcio}

//cambios 9-5-10
servicio devuelve facturas con placa y clientes
get http://localhost:5000/api/v1/servicioCompleto

----------------------------------------------------------------------------------------

//'ultima 'etapa de desarrollo
//Cierre de caja - presupuesto

entradas
get http://localhost:5000/api/v1/presupuestoInDia
get http://localhost:5000/api/v1/presupuestoInMes
get http://localhost:5000/api/v1/presupuestoInAnio

salidas
get http://localhost:5000/api/v1/presupuestoOutDia
get http://localhost:5000/api/v1/presupuestoOutMes
get http://localhost:5000/api/v1/presupuestoOutAnio

creditos
get http://localhost:5000/api/v1/presupuestoInCreditoDia
get http://localhost:5000/api/v1/presupuestoInCreditoMes

entradas y salidas con fecha especifica
//ej de fecha
// para 2 de abril de 2019 usar = 02042019
http://localhost:5000/api/v1/presupuestoEntradasFecha/:fecha
http://localhost:5000/api/v1/presupuestoSalidasFecha/:fecha
ejemplo
http://localhost:5000/api/v1/presupuestoSalidasFecha/01062019


Ganancias


gananciasAño
http://localhost:5000/api/v1/gananciasInAnio

gananciasMes
http://localhost:5000/api/v1/gananciasInMes

gananciasDia
http://localhost:5000/api/v1/gananciasInDia

ganancias y ganancias con fecha especifica
//ej de fecha
// para 2 de abril de 2019 usar = 02042019
http://localhost:5000/api/v1/gananciasInFecha/:fecha
ejemplo
http://localhost:5000/api/v1/gananciasInFecha/14072019


obtener cuatno dinero se tiene en productos
/api/v1/getPresupuestoProductos

//eliminar entradas no rel
http://localhost:5000/api/v1/eliminarEntradasNoRel