import { instructorModelo } from '../models/instructor_model.js';
import { instructorVista } from '../views/instructor_view.js';
import { crearModuloCrud } from './crud_controller.js';

export const instructorController = crearModuloCrud('instructores', instructorModelo, instructorVista);
