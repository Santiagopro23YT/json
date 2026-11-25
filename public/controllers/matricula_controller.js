import { matriculaModelo } from '../models/matricula_model.js';
import { matriculaVista } from '../views/matricula_view.js';
import { crearModuloCrud } from './crud_controller.js';

export const matriculaController = crearModuloCrud('matriculas', matriculaModelo, matriculaVista);
