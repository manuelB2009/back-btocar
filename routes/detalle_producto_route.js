import express from 'express';
import producto_dll_controller from '../controllers/producto_detalle_controller';

const dll_producto_router = express.Router();

//get todos los getalle productos
dll_producto_router.get('/api/v1/producto', producto_dll_controller.getAllProductosDetalles);
//guardar detalle producto
dll_producto_router.post('/api/v1/producto', producto_dll_controller.addProductoDll);
//get un detalle producto
dll_producto_router.get('/api/v1/producto/:id', producto_dll_controller.getOneProductoDll);
//eliminar un detalle producto
dll_producto_router.delete('/api/v1/producto/:id', producto_dll_controller.deleteOneProductoDetalle);
//actualizar detalle producto
dll_producto_router.put('/api/v1/producto/:id', producto_dll_controller.updateProductoDetalle);

//traer producto por c'odigo
dll_producto_router.get('/api/v1/producto/codigo/:codigo', producto_dll_controller.getOneProductoDllCodigo);
export default dll_producto_router;
