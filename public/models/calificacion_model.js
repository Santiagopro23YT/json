import { mismoId } from './academico_model.js';

export const calificacionModelo = {
    singular: 'calificación',
    referencias: { matriculaId: 'matriculas' },
    unico: ['matriculaId'],
    duplicado: 'Esta matrícula ya tiene una calificación.',
    validar({ datos, anterior }) {
        if (anterior && !mismoId(anterior.matriculaId, datos.matriculaId)) {
            throw new Error('La matrícula de una calificación no se puede cambiar.');
        }
    },
};
