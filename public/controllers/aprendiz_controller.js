import { aprendizModelo } from '../models/aprendiz_model.js';
import { aprendizVista } from '../views/aprendiz_view.js';
import { crearModuloCrud } from './crud_controller.js';

export const aprendizController = crearModuloCrud('aprendices', aprendizModelo, aprendizVista);
