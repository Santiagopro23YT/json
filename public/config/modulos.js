import { programaController } from '../controllers/programa_controller.js';
import { fichaController } from '../controllers/ficha_controller.js';
import { aprendizController } from '../controllers/aprendiz_controller.js';
import { instructorController } from '../controllers/instructor_controller.js';
import { cursoController } from '../controllers/curso_controller.js';
import { matriculaController } from '../controllers/matricula_controller.js';
import { calificacionController } from '../controllers/calificacion_controller.js';

export const modulos = [
    programaController,
    fichaController,
    aprendizController,
    instructorController,
    cursoController,
    matriculaController,
    calificacionController,
];
