import { mismoId, impedirSiHayRelacion } from './academico_model.js';

export const aprendizModelo = {
    singular: 'aprendiz',
    referencias: { fichaId: 'fichas' },
    unico: ['tipoDocumento', 'numeroDocumento'],
    duplicado: 'Ya existe un aprendiz con este tipo y número de documento.',
    dependencias: [['matriculas', 'aprendizId', 'No se puede eliminar el aprendiz porque tiene una matrícula asociada.']],
    async validar({ datos, anterior, api }) {
        if (anterior && !mismoId(datos.fichaId, anterior.fichaId)) {
            await impedirSiHayRelacion(api, 'matriculas', 'aprendizId', anterior.id,
                'No se puede cambiar la ficha del aprendiz porque tiene una matrícula asociada.');
        }
    },
};
