import express from 'express';
import credito_controller from '../controllers/credito_controller';


const credito_router = express.Router();

credito_router.get('/api/v1/credito', credito_controller.getAllcreditos);
credito_router.post('/api/v1/credito', credito_controller.addcredito);
credito_router.get('/api/v1/credito/:id', credito_controller.getOnecredito);
credito_router.delete('/api/v1/credito/:id', credito_controller.deleteOnecredito);
credito_router.put('/api/v1/credito/:id', credito_controller.updatecredito);

credito_router.post('/api/v1/credito/pagarCuota', credito_controller.pagarCuota);
credito_router.get('/api/v1/credito/placa/:placa', credito_controller.getOnecreditoPlaca);

credito_router.get('/api/v1/credito/idservicio/:idservicio', credito_controller.getOnecreditoByServicio);

export default credito_router;
