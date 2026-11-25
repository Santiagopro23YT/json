import { mismoId, impedirSiHayRelacion } from './academico_model.js';

export const matriculaModelo = {
    singular: 'matrícula',
    referencias: { aprendizId: 'aprendices', cursoId: 'cursos' },
    unico: ['aprendizId', 'cursoId'],
    duplicado: 'El aprendiz ya está matriculado en este curso.',
    dependencias: [['calificaciones', 'matriculaId', 'La matrícula tiene una calificación asociada.']],
    async validar({ datos, anterior, referencias, api }) {
        const { aprendizId: aprendiz, cursoId: curso } = referencias;
        if (!mismoId(aprendiz.fichaId, curso.fichaId)) {
            throw new Error('El aprendiz y el curso deben pertenecer a la misma ficha.');
        }
        if (anterior && (!mismoId(datos.aprendizId, anterior.aprendizId) || !mismoId(datos.cursoId, anterior.cursoId))) {
            await impedirSiHayRelacion(api, 'calificaciones', 'matriculaId', anterior.id,
                'No se puede reasignar la matrícula porque ya tiene una calificación.');
        }
    },
};
