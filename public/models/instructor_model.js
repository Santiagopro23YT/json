export const instructorModelo = {
    singular: 'instructor',
    unico: ['tipoDocumento', 'numeroDocumento'],
    duplicado: 'Ya existe un instructor con este tipo y número de documento.',
    dependencias: [['cursos', 'instructorId', 'El instructor está asignado a un curso.']],
};
