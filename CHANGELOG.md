# Historial de cambios

Los cambios se agrupan por su fecha en Git. Los identificadores corresponden a
commits del repositorio.

## Sin publicar

- Distribución de la documentación en guías de instalación, arquitectura,
  colaboración y commits, además de este historial.

## 2026-11-25

- **`fd56009` · Arranque unificado.** Se trasladó el frontend a `public/`, se
  incorporó `npm start` y se configuró la interfaz para consumir la API desde
  el mismo origen.
- **`090cf19` · Reorganización MVC.** Se separaron los modelos, controladores
  y vistas de los siete módulos. Se mantuvo el CRUD compartido y se extrajeron
  de `app.js` el Dashboard y la navegación.
- **`f175149` · Implementación inicial del aplicativo.** Se incorporaron el
  Dashboard adaptable, la navegación sin recargas y las operaciones de registro,
  consulta, edición y eliminación de los siete módulos. Se añadió persistencia
  con JSON Server y validación de referencias y duplicados.

Consulta la [arquitectura actual](docs/ARCHITECTURE.md).
