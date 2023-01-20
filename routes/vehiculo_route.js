import express from 'express';
import vehiculo_controller from '../controllers/vehiculo_controller';


const vehiculo_router = express.Router();

vehiculo_router.get('/api/v1/vehiculo', vehiculo_controller.getAllVehiculos);
vehiculo_router.post('/api/v1/vehiculo', vehiculo_controller.addVehiculo);
vehiculo_router.get('/api/v1/vehiculo/:id', vehiculo_controller.getOneVehiculo);
vehiculo_router.delete('/api/v1/vehiculo/:id', vehiculo_controller.deleteOneVehiculo);
vehiculo_router.put('/api/v1/vehiculo/:id', vehiculo_controller.updateVehiculo);

//por cc
vehiculo_router.get('/api/v1/vehiculo/cccliente/:ccCliente', vehiculo_controller.getVehiculoCcCliente);
vehiculo_router.get('/api/v1/vehiculo/placa/:placa', vehiculo_controller.getVehiculoClientePlaca);

export default vehiculo_router;
