export const fichaVista = {
    nombre: 'Fichas', singular: 'ficha', articulo: 'la', icono: 'clipboard-list', descripcion: 'Fichas de formación',
    campos: [
        { nombre: 'numero', etiqueta: 'Número de ficha', numerico: true },
        { nombre: 'programaId', etiqueta: 'Programa de formación' },
    ],
    etiqueta: (registro, catalogos, describir) => `${registro.numero} — ${describir('programas', registro.programaId, catalogos)}`,
    columnas: [['Ficha', registro => registro.numero], ['Programa', (registro, catalogos, describir) => describir('programas', registro.programaId, catalogos)]],
    seleccionable(registro, catalogos) {
        return catalogos.programas.has(String(registro.programaId));
    },
};
