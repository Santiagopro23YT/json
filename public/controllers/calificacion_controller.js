import { calificacionModelo } from '../models/calificacion_model.js';
import { calificacionVista } from '../views/calificacion_view.js';
import { crearModuloCrud } from './crud_controller.js';

export const calificacionController = crearModuloCrud('calificaciones', calificacionModelo, calificacionVista);
