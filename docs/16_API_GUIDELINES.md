# 16_API_GUIDELINES.md

# Guía de Diseño de APIs

**Proyecto:** Athena ERP *(Nombre temporal)*

**Versión:** 0.1

**Estado:** Estándar de Desarrollo

---

# 1. Introducción

Athena ERP expondrá una API REST que será consumida por el Frontend desarrollado en React.

Esta guía define las convenciones que deberán seguir todos los endpoints del sistema para garantizar consistencia, mantenibilidad y facilidad de integración.

Toda nueva API deberá cumplir las reglas establecidas en este documento.

---

# 2. Objetivos

La API deberá ser.

- Consistente.
- Predecible.
- Versionable.
- Segura.
- Fácil de consumir.
- Fácil de documentar.
- Escalable.

---

# 3. Arquitectura

Cliente

↓

React

↓

REST API

↓

Django REST Framework

↓

Django ORM

↓

PostgreSQL

---

# 4. URL Base

```

/api/v1

```

Ejemplos.

```

GET /api/v1/operators

GET /api/v1/machines

POST /api/v1/capturas

```

Las futuras versiones utilizarán.

```

/api/v2

/api/v3

```

---

# 5. Convenciones REST

GET

Consultar recursos.

POST

Crear recursos.

PUT

Actualizar completamente.

PATCH

Actualizar parcialmente.

DELETE

Desactivar (Soft Delete).

Nunca eliminar físicamente información histórica.

---

# 6. Nombres

Las rutas utilizarán.

- minúsculas
- plural
- kebab-case cuando aplique

Ejemplos.

```

/machines

/machine-types

/operation-days

/system-settings

```

---

# 7. Endpoints Iniciales

## Autenticación

```

POST /auth/login

POST /auth/logout

POST /auth/refresh

POST /auth/change-password

```

---

## Usuarios

```

GET /users

GET /users/{id}

POST /users

PATCH /users/{id}

DELETE /users/{id}

```

---

## Operadores

```

GET /operators

GET /operators/{id}

POST /operators

PATCH /operators/{id}

DELETE /operators/{id}

```

---

## Salas

```

GET /locations

POST /locations

PATCH /locations/{id}

DELETE /locations/{id}

```

---

## Máquinas

```

GET /machines

GET /machines/{id}

POST /machines

PATCH /machines/{id}

DELETE /machines/{id}

```

---

## Capturas

```

GET /captures

GET /captures/{id}

POST /captures

PATCH /captures/{id}

```

---

## Fotografías

```

POST /photos

GET /photos/{id}

DELETE /photos/{id}

```

---

## Días de Operación

```

GET /operation-days

POST /operation-days

PATCH /operation-days/{id}

```

---

## Conciliaciones

```

GET /reconciliations

POST /reconciliations

PATCH /reconciliations/{id}

```

---

## Liquidaciones

```

GET /settlements

POST /settlements/generate

POST /settlements/{id}/approve

POST /settlements/{id}/reopen

```

---

## Dashboard

```

GET /dashboard

GET /dashboard/manager

GET /dashboard/president

```

---

## Reportes

```

GET /reports

GET /reports/export/excel

GET /reports/export/pdf

```

---

# 8. Formato de Respuesta

Respuesta exitosa.

```json
{
  "success": true,
  "message": "Operación realizada correctamente.",
  "data": {}
}
```

---

Respuesta con error.

```json
{
  "success": false,
  "message": "No fue posible completar la operación.",
  "errors": []
}
```

---

# 9. Paginación

Las consultas masivas deberán soportar.

```

?page=1

&pageSize=25

```

Ejemplo.

```

GET /machines?page=1&pageSize=25

```

---

# 10. Ordenamiento

```

?sort=name

?sort=createdAt

?order=asc

?order=desc

```

---

# 11. Filtros

Ejemplos.

```

?operatorId=15

?status=ACTIVE

?period=2026-05

```

Los filtros podrán combinarse.

---

# 12. Códigos HTTP

200 OK

201 Created

204 No Content

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

409 Conflict

422 Unprocessable Entity

500 Internal Server Error

---

# 13. Validaciones

Toda petición será validada mediante Serializers.

Las validaciones incluirán.

- Campos obligatorios.
- Tipos.
- Longitudes.
- Rangos.
- Reglas del negocio.

---

# 14. Autenticación

Todos los endpoints privados requerirán.

```

Authorization: Bearer TOKEN

```

---

# 15. Versionamiento

Toda API utilizará versionamiento.

Ejemplo.

```

/api/v1

```

Nunca se eliminará una versión sin migración.

---

# 16. Manejo de Errores

Los errores deberán ser consistentes.

Ejemplo.

```json
{
    "success": false,
    "message": "La máquina ya posee una captura para esta fecha.",
    "errorCode": "CAPTURE_ALREADY_EXISTS"
}
```

---

# 17. Auditoría

Toda modificación importante deberá registrarse automáticamente.

- Usuario.
- Fecha.
- IP.
- Acción.
- Valores anteriores.
- Valores nuevos.

---

# 18. Seguridad

Todos los endpoints deberán.

- Validar JWT.
- Validar permisos.
- Validar roles.
- Validar estado del usuario.

---

# 19. Documentación

Toda API deberá documentarse mediante Swagger.

Cada endpoint incluirá.

- Descripción.
- Parámetros.
- Respuestas.
- Ejemplos.
- Errores posibles.

---

# 20. Convenciones de Código

Las Views o ViewSets únicamente recibirán peticiones.

Los Services contendrán la lógica del negocio.

Los Repositories accederán a Django ORM.

Los Serializers validarán la información.

Nunca se colocará lógica financiera en las Views o ViewSets.

---

# 21. Endpoints Especiales

Algunas operaciones del negocio requerirán acciones específicas.

Ejemplos.

```

POST /settlements/{id}/approve

POST /settlements/{id}/close

POST /settlements/{id}/recalculate

POST /periods/{id}/close

POST /periods/{id}/reopen

POST /captures/{id}/validate

POST /captures/{id}/adjust

POST /machines/{id}/reset

```

Estas acciones representan procesos del negocio y no simples operaciones CRUD.

---

# 22. API para Dashboards

Los dashboards consumirán endpoints especializados.

Ejemplos.

```

GET /dashboard/kpis

GET /dashboard/operators

GET /dashboard/top-locations

GET /dashboard/top-machines

GET /dashboard/daily-income

GET /dashboard/month-summary

```

Estos endpoints entregarán información ya agregada para evitar cálculos en el Frontend.

---

# 23. Restricciones

No exponer consultas SQL.

No devolver información sensible.

No implementar lógica del negocio en el Frontend.

No romper compatibilidad entre versiones.

---

# 24. Evolución

La API permitirá incorporar nuevos módulos sin modificar la estructura existente.

Los nuevos endpoints deberán respetar las convenciones establecidas en este documento.

---

# 25. Conclusión

La API REST constituye el puente entre el Frontend y el Backend de Athena ERP.

Todas las interfaces deberán seguir estas guías para garantizar una plataforma consistente, segura y preparada para crecer conforme evolucionen las necesidades del negocio.
