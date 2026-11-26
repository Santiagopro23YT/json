import { cursoModelo } from '../models/curso_model.js';
import { cursoVista } from '../views/curso_view.js';
import { crearModuloCrud } from './crud_controller.js';

export const cursoController = crearModuloCrud('cursos', cursoModelo, cursoVista);
