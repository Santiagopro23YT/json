# Arquitectura del aplicativo

El navegador ejecuta la interfaz y la lógica MVC mediante módulos JavaScript.
JSON Server sirve la interfaz desde `public/`, expone la API REST en el mismo
origen y persiste los registros en [`server/db.json`](../server/db.json).

## Estructura y responsabilidades

| Ruta | Responsabilidad |
|---|---|
| `public/index.html` y `public/app.js` | Estructura HTML, inicialización, registro de pantallas y coordinación de la navegación por fragmentos como `/#aprendices`. |
| `public/config/` | Configuración del aplicativo, registro de módulos y valores de catálogo compartidos. La URL de la API se obtiene de `window.location.origin`. |
| `public/models/` | Reglas por entidad y lógica compartida de consultas, escritura, validación de referencias y dependencias entre registros. |
| `public/controllers/` | Coordinación de vistas y modelos. El controlador CRUD compartido procesa eventos, valida formularios y coordina respuestas y errores. |
| `public/views/` | Formularios, listados, detalles, confirmaciones y mensajes. Incluye las vistas del Dashboard y de navegación. |
| `public/services/` | Cliente HTTP compartido para las peticiones a JSON Server y el tratamiento de errores. |
| `public/utils/` y `public/assets/` | Utilidades del DOM y recursos estáticos como estilos, logo e iconos. |
| `server/` | Manifiesto de npm, archivo de bloqueo y base JSON. El comando de arranque sirve `public/` como directorio estático. |

Cada módulo académico tiene un `modulo_model.js`, un
`modulo_controller.js` y un `modulo_view.js`, con el nombre de la entidad en
singular y sin tildes. El controlador específico conecta su modelo y su vista
con los componentes CRUD compartidos.

El flujo de escritura es **vista → controlador → modelo → cliente HTTP →
JSON Server**. La interfaz presenta el resultado y conserva los valores del
formulario si hay un error.

## Entidades y relaciones

| Entidad | Referencias y reglas principales |
|---|---|
| Programa | Código único. Una ficha referencia su programa por `programaId`. |
| Ficha | Número único. Cada ficha pertenece a un programa. |
| Aprendiz | Cada aprendiz pertenece a una ficha mediante `fichaId`. La combinación de tipo y número de documento es única entre aprendices. |
| Instructor | La combinación de tipo y número de documento es única entre instructores. |
| Curso | Pertenece a una ficha mediante `fichaId` y tiene un instructor asignado mediante `instructorId`. |
| Matrícula | Relaciona un aprendiz y un curso de la misma ficha mediante `aprendizId` y `cursoId`. La pareja es única. |
| Calificación | Referencia una matrícula mediante `matriculaId`. Se permite una calificación por matrícula, con resultado Aprobado o No aprobado y observación opcional. |

La aplicación bloquea eliminaciones cuando existen registros dependientes.
Una matrícula impide cambiar la ficha del aprendiz o del curso. Si la
matrícula tiene una calificación, también se bloquea su reasignación. La
matrícula asociada a una calificación se conserva durante la edición.

Estas reglas se ejecutan en el navegador. Una petición directa a la API de
JSON Server puede omitir esas validaciones. Usa datos ficticios en el entorno
de desarrollo.

Para iniciar el servidor, consulta la [guía de instalación](INSTALLATION.md).
