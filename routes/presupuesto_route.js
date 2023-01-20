import express from 'express';
import presupuesto_controller from '../controllers/presupuesto_controller';


const presupuesto_router = express.Router();

presupuesto_router.get('/api/v1/presupuestoInDia', presupuesto_controller.getPresupuestoInDia);
//presupuesto_router.get('/api/v1/presupuesto7Dias', presupuesto_controller.getPresupuestoInSemana);
presupuesto_router.get('/api/v1/presupuestoInMes', presupuesto_controller.getPresupuestoInMes);
presupuesto_router.get('/api/v1/presupuestoInAnio', presupuesto_controller.getPresupuestoInAnio);

//presupuesto_router.get('/api/v1/presupuestoGananciaDia', presupuesto_controller.getPresupuestoGananciaDia);

presupuesto_router.get('/api/v1/presupuestoOutDia', presupuesto_controller.getPresupuestoOutDia);
presupuesto_router.get('/api/v1/presupuestoOutMes', presupuesto_controller.getPresupuestoOutMes);
presupuesto_router.get('/api/v1/presupuestoOutAnio', presupuesto_controller.getPresupuestoOutAnio);

//total cr'editos dia y mes
presupuesto_router.get('/api/v1/presupuestoInCreditoDia', presupuesto_controller.getPresupuestoInCreditoDia);
presupuesto_router.get('/api/v1/presupuestoInCreditoMes', presupuesto_controller.getPresupuestoInCreditoMes);

//presupuesto con fecha especifica
presupuesto_router.get('/api/v1/presupuestoEntradasFecha/:fecha', presupuesto_controller.getPresupuestoEntradasFecha);
presupuesto_router.get('/api/v1/presupuestoSalidasFecha/:fecha', presupuesto_controller.getPresupuestoSalidasFecha);

//ganancias
presupuesto_router.get('/api/v1/gananciasInAnio', presupuesto_controller.getGananciasAño);
presupuesto_router.get('/api/v1/gananciasInMes', presupuesto_controller.getGananciasMes);
presupuesto_router.get('/api/v1/gananciasInDia', presupuesto_controller.getGananciasDia);
presupuesto_router.get('/api/v1/gananciasInFecha/:fecha', presupuesto_controller.getGananciasFecha);

presupuesto_router.get('/api/v1/eliminarEntradasNoRel', presupuesto_controller.eliminarEntradasNoRelacionadas);
presupuesto_router.get('/api/v1/producto/inventario/totalDineroProductos', presupuesto_controller.getPresupuestoProductos);



export default presupuesto_router;
