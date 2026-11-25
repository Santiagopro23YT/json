# Guía de colaboración

Para preparar el entorno local, consulta la [guía de instalación](docs/INSTALLATION.md).

## Ramas

| Rama | Propósito |
|---|---|
| `dev` | Integración del trabajo de desarrollo. |
| `qa` | Verificación de los cambios integrados antes de promoverlos a la rama estable. |
| `main` | Estado estable aprobado del aplicativo. |

1. Crea la rama de trabajo a partir de `dev` y abre un Pull Request hacia `dev`.
2. Promueve los cambios de `dev` a `qa` mediante un Pull Request. Comprueba en
   `qa` el alcance del cambio y los flujos relacionados.
3. Promueve de `qa` a `main` mediante un Pull Request una vez aprobada la
   verificación. Si encuentras un problema, corrígelo en `dev` y repite la promoción.

El propietario puede autorizar publicaciones directas en `dev`. Consulta las
[reglas de autoría y publicación](docs/COMMITS.md).

## Issues

- Usa un título específico e indica el módulo afectado.
- Para un error, describe los pasos para reproducirlo, el resultado esperado y
  el resultado observado. Incluye el entorno si afecta la reproducción.
- Para una mejora, explica la necesidad, el alcance y el resultado esperado.
- Usa datos ficticios en ejemplos y capturas.

## Pull Requests

- Resume el propósito y los puntos clave del cambio. Referencia el Issue si existe.
- Indica qué verificaciones ejecutaste y cuáles quedaron pendientes.
- Comprueba que los archivos incluidos correspondan al alcance y que la rama
  de destino sea la correcta.
- Atiende las observaciones de revisión antes de integrar el cambio.
