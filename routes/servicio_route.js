import express from 'express';
import servicio_controller from '../controllers/servicio_controller';


const servicio_router = express.Router();

servicio_router.get('/api/v1/servicio', servicio_controller.getAllServicios);
servicio_router.post('/api/v1/servicio', servicio_controller.addServicio);
servicio_router.get('/api/v1/servicio/:id', servicio_controller.getOneServicio);
servicio_router.delete('/api/v1/servicio/:id', servicio_controller.deleteOneServicio);
//servicio_router.put('/api/v1/servicio/:id', servicio_controller.updateServicio);

servicio_router.get('/api/v1/servicioCompleto', servicio_controller.getAllServiciosClienteVehiculo);
servicio_router.get('/api/v1/servicioCompletoByIdCliente/:idCliente', servicio_controller.getOneServicioCompletoByIdCliente);

//servicios por cc cliente
servicio_router.get('/api/v1/servicio/cliente/:cc', servicio_controller.getServiciosByCliente);


export default servicio_router;
