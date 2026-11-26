export const fichaModelo = {
    singular: 'ficha',
    mensajeReferencia: 'La ficha seleccionada ya no está disponible.',
    referencias: { programaId: 'programas' },
    unico: ['numero'],
    duplicado: 'Ya existe una ficha con este número.',
    dependencias: [
        ['aprendices', 'fichaId', 'La ficha tiene aprendices asociados.'],
        ['cursos', 'fichaId', 'La ficha tiene cursos asociados.'],
    ],
};
