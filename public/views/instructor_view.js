import { identificacion, nombrePersona, documento } from './identificacion_view.js';

export const instructorVista = {
    nombre: 'Instructores', singular: 'instructor', articulo: 'el', icono: 'presentation', descripcion: 'Equipo de formación',
    campos: identificacion,
    etiqueta: nombrePersona,
    columnas: [['Instructor', nombrePersona], ['Documento', documento]],
    opcion(registro, etiqueta) {
        return etiqueta + ' · ' + documento(registro);
    },
};
