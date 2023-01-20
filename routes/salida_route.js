import express from 'express';
import salida_controller from '../controllers/salida_controller';


const salida_router = express.Router();

salida_router.get('/api/v1/salida', salida_controller.getAllSalidas);
salida_router.post('/api/v1/salida', salida_controller.addSalida);
salida_router.get('/api/v1/salida/:id', salida_controller.getOneSalida);
salida_router.delete('/api/v1/salida/:id', salida_controller.deleteOneSalida);
salida_router.put('/api/v1/salida/:id', salida_controller.updateSalida);

export default salida_router;
