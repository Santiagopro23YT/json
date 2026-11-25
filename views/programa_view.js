export const programaVista = {
    nombre: 'Programas', singular: 'programa', articulo: 'el', icono: 'graduation-cap', descripcion: 'Programas de formación',
    campos: [
        { nombre: 'codigo', etiqueta: 'Código', mayusculas: true, sinOrtografia: true },
        { nombre: 'nombre', etiqueta: 'Nombre' },
    ],
    etiqueta: registro => registro.nombre,
    columnas: [['Programa', registro => registro.nombre], ['Código', registro => registro.codigo]],
    opcion(registro, etiqueta) {
        return registro.codigo ? registro.codigo + ' — ' + etiqueta : etiqueta;
    },
};
