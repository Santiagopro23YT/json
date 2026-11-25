import { programaModelo } from '../models/programa_model.js';
import { programaVista } from '../views/programa_view.js';
import { crearModuloCrud } from './crud_controller.js';

export const programaController = crearModuloCrud('programas', programaModelo, programaVista);
