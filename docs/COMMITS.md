# Convenciones de commits

El proyecto usa Conventional Commits con un tipo en inglés y una descripción
en español, en minúsculas y con un verbo en infinitivo.

```text
tipo(alcance): descripción breve
tipo: descripción breve
```

El alcance es opcional. Úsalo cuando identifique con claridad el módulo o el
área afectada. Procura que el encabezado tenga hasta 72 caracteres y evita
cerrarlo con un punto.

| Tipo | Uso |
|---|---|
| `feat` | Incorporar una funcionalidad. |
| `fix` | Corregir un error. |
| `docs` | Crear o actualizar documentación. |
| `refactor` | Reorganizar el código preservando su comportamiento. |
| `test` | Añadir o modificar pruebas. |
| `build` | Cambiar dependencias o herramientas de construcción. |
| `chore` | Realizar tareas de mantenimiento general. |

## Descripción

Haz un commit por cambio lógico. Si el título es insuficiente, deja una línea
en blanco y añade un cuerpo breve con los dos a cinco puntos que expliquen qué
cambió y qué módulos se vieron afectados. Menciona verificaciones solo cuando
se hayan realizado. Para un cambio incompatible, usa `!` después del tipo o
alcance, o el pie `BREAKING CHANGE:` con la explicación correspondiente.

Ejemplo de un commit del proyecto:

```text
refactor(mvc): reorganizar los módulos académicos

- separar modelos, controladores y vistas de los siete módulos
- conservar el crud compartido y centralizar las peticiones a json server
- separar el panel de inicio y la navegación de app.js y mover dom.js a utils
```

## Autoría y publicación

- Usa exclusivamente la cuenta de GitHub del propietario, **@Santiagopro23YT**,
  y la identidad Git verificada de Samuel Santiago Ramirez Fierro. Conserva esa
  configuración y las atribuciones legítimas del historial.
- Mantén la autoría a nombre del propietario. Queda prohibido añadir asistentes,
  bots o terceros como coautores o contribuidores, incluidas las líneas
  `Co-authored-by` automáticas.
- Antes de publicar, verifica la identidad efectiva del commit, la cuenta
  autenticada, el remoto y la rama de destino. Si la cuenta o la identidad
  quedan sin verificar, pausa la publicación e informa al propietario.
- Revisa los cambios preparados con `git diff --staged`. Excluye credenciales,
  datos personales, archivos temporales y `node_modules/`.
- Publica únicamente en la rama autorizada, evita `--force` y confirma que el
  remoto apunta al commit publicado. Consulta el
  [flujo de ramas y Pull Requests](../CONTRIBUTING.md).
