import { TIPOS_DOCUMENTO } from '../config/catalogos.js';

const seleccionDocumento = TIPOS_DOCUMENTO.map(tipo => ({ valor: tipo, etiqueta: tipo }));
export const identificacion = [
    { nombre: 'tipoDocumento', etiqueta: 'Tipo de documento', opciones: seleccionDocumento },
    { nombre: 'numeroDocumento', etiqueta: 'Número de documento', mayusculas: true, sinOrtografia: true },
    { nombre: 'nombres', etiqueta: 'Nombres' },
    { nombre: 'apellidos', etiqueta: 'Apellidos' },
];
export const nombrePersona = ({ nombres, apellidos }) => [nombres, apellidos].filter(Boolean).join(' ');
export const documento = ({ tipoDocumento, numeroDocumento }) => [tipoDocumento, numeroDocumento].filter(Boolean).join(' ');
