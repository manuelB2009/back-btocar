import express from 'express';
import entrada_controller from '../controllers/entrada_controller';


const entrada_router = express.Router();

entrada_router.get('/api/v1/entrada', entrada_controller.getAllEntradas);
entrada_router.post('/api/v1/entrada', entrada_controller.addEntrada);
entrada_router.get('/api/v1/entrada/:id', entrada_controller.getOneEntrada);
entrada_router.delete('/api/v1/entrada/:id', entrada_controller.deleteOneEntrada);
entrada_router.put('/api/v1/entrada/:id', entrada_controller.updateEntrada);

export default entrada_router;
