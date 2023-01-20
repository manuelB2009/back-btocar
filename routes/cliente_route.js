import express from 'express';
import cliente_controller from '../controllers/cliente_controller';


const cliente_router = express.Router();

cliente_router.get('/api/v1/cliente', cliente_controller.getAllClientes);
cliente_router.post('/api/v1/cliente', cliente_controller.addCliente);
cliente_router.get('/api/v1/cliente/:id', cliente_controller.getOneCliente);
cliente_router.delete('/api/v1/cliente/:id', cliente_controller.deleteOneCliente);
cliente_router.put('/api/v1/cliente/:id', cliente_controller.updateCliente);

//por cc
cliente_router.get('/api/v1/cliente/cc/:cc', cliente_controller.getOneClienteCc);
cliente_router.delete('/api/v1/cliente/cc/:cc', cliente_controller.deleteOneClienteCc);
cliente_router.put('/api/v1/cliente/cc/:cc', cliente_controller.updateClienteCc);


export default cliente_router;
