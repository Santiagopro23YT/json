export const programaModelo = {
    singular: 'programa',
    unico: ['codigo'],
    duplicado: 'Ya existe un programa con este código.',
    dependencias: [['fichas', 'programaId', 'El programa tiene fichas asociadas.']],
};
