import { mismoId, impedirSiHayRelacion } from './academico_model.js';

export const cursoModelo = {
    singular: 'curso',
    referencias: { fichaId: 'fichas', instructorId: 'instructores' },
    dependencias: [['matriculas', 'cursoId', 'El curso tiene matrículas asociadas.']],
    async validar({ datos, anterior, api }) {
        if (anterior && !mismoId(datos.fichaId, anterior.fichaId)) {
            await impedirSiHayRelacion(api, 'matriculas', 'cursoId', anterior.id,
                'No se puede cambiar la ficha del curso porque tiene matrículas asociadas.');
        }
    },
};
