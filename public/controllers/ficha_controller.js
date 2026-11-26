import { fichaModelo } from '../models/ficha_model.js';
import { fichaVista } from '../views/ficha_view.js';
import { crearModuloCrud } from './crud_controller.js';

export const fichaController = crearModuloCrud('fichas', fichaModelo, fichaVista);
