import express from 'express';
import bodyParser from 'body-parser';
import dll_producto_router from './routes/detalle_producto_route.js';
import cliente_router from './routes/cliente_route.js';
import vehiculo_router from './routes/vehiculo_route.js';
import servicio_router from './routes/servicio_route.js';
import credito_router from './routes/credito_route.js';
import entrada_router from './routes/entrada_route.js';
import salida_router from './routes/salida_route.js';
import presupuesto_router from './routes/presupuesto_route.js';

var cors = require('cors');
const app = express();

//cors permiso
app.use(cors());

//Parse informacion entrando
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(dll_producto_router);
app.use(cliente_router);
app.use(vehiculo_router);
app.use(servicio_router);
app.use(credito_router);
app.use(entrada_router);
app.use(salida_router);
app.use(presupuesto_router);


// Data Base
// http://mongoosejs.com/docs/connections.html
var dbModels = require('./models');
dbModels.initDBConnection(app);


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`server escuchando en puerto ${PORT}`);
})
