import { identificacion, nombrePersona, documento } from './identificacion_view.js';

export const aprendizVista = {
    nombre: 'Aprendices', singular: 'aprendiz', articulo: 'el', icono: 'users-round', descripcion: 'Registros de aprendices y fichas',
    campos: [...identificacion, { nombre: 'fichaId', etiqueta: 'Ficha de formación' }],
    etiqueta: nombrePersona,
    columnas: [
        ['Aprendiz', nombrePersona], ['Documento', documento],
        ['Ficha de formación', (registro, catalogos, describir) => describir('fichas', registro.fichaId, catalogos)],
    ],
    catalogoVacio: 'No hay fichas de formación disponibles para seleccionar. Registra una en Fichas.',
    recargarCatalogo: 'Recargar fichas',
    opcion(registro, etiqueta, catalogos, describir) {
        return catalogos.fichas
            ? etiqueta + ' · ' + documento(registro) + ' · ' + describir('fichas', registro.fichaId, catalogos)
            : etiqueta;
    },
};
