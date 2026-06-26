# 14_ARCHITECTURE.md

# Arquitectura del Sistema

**Proyecto:** Athena ERP *(Nombre temporal)*

**Versión:** 0.1

**Estado:** Diseño de Arquitectura

---

# 1. Introducción

Athena ERP será desarrollado siguiendo una arquitectura moderna, modular y desacoplada.

El objetivo principal es construir una plataforma mantenible, escalable y preparada para evolucionar durante muchos años sin requerir una reescritura completa.

La arquitectura prioriza la separación de responsabilidades, la reutilización de componentes y la independencia entre las diferentes capas del sistema.

---

# 2. Objetivos

La arquitectura deberá garantizar.

- Escalabilidad.
- Modularidad.
- Seguridad.
- Mantenibilidad.
- Reutilización.
- Facilidad de pruebas.
- Bajo acoplamiento.
- Alto rendimiento.

---

# 3. Arquitectura General

```

                    React + TypeScript

                           │

                           ▼

             API REST (Django REST Framework)

                           │

        ┌──────────────────────────────────┐
        │                                  │
        │      Capa de Servicios           │
        │                                  │
        └──────────────────────────────────┘

                           │

                           ▼

                    Django ORM

                           │

                           ▼

                     PostgreSQL

```

---

# 4. Arquitectura por Capas

El sistema estará dividido en cinco capas.

## Presentación

Responsable de la interacción con el usuario.

Tecnologías.

- React
- TypeScript
- TailwindCSS
- React Router
- React Query

---

## API

Expone los servicios del sistema.

Tecnologías.

- Django
- Django REST Framework
- Python

Responsabilidades.

- Validaciones.
- Autenticación.
- Autorización.
- Endpoints REST.

---

## Lógica de Negocio

Contiene todas las reglas del negocio.

Ejemplos.

- Cálculo de neto.
- Liquidaciones.
- Conciliaciones.
- Validaciones.
- Reglas tributarias.
- Auditoría.

Ninguna lógica financiera deberá existir en el Frontend.

---

## Persistencia

Encargada de acceder a la Base de Datos.

Tecnologías.

- Django ORM

Responsabilidades.

- CRUD.
- Consultas.
- Relaciones.
- Transacciones.

---

## Base de Datos

Motor oficial.

PostgreSQL.

---

# 5. Arquitectura Modular

Cada módulo será independiente.

```

auth/

users/

operators/

delegates/

locations/

machines/

captures/

photos/

technical/

reconciliation/

settlements/

reports/

dashboard/

settings/

audit/

```

Cada módulo tendrá.

- Controller
- Service
- Repository
- DTO
- Entity
- Validation
- Tests

---

# 6. Flujo de una petición

```

Usuario

↓

React

↓

API REST

↓

Controller

↓

Service

↓

Repository

↓

Django ORM

↓

PostgreSQL

↓

Respuesta

↓

React

↓

Usuario

```

---

# 7. Frontend

El Frontend será una SPA.

Responsabilidades.

- Mostrar información.
- Validar formularios.
- Consumir APIs.
- Gestionar estado visual.

Nunca realizará cálculos financieros.

---

# 8. Backend

El Backend será el único responsable de.

- Calcular impuestos.
- Calcular Fee.
- Calcular participación.
- Generar liquidaciones.
- Generar reportes.
- Ejecutar auditoría.

---

# 9. Base de Datos

Toda la información será persistida en PostgreSQL.

Características.

- UUID.
- Integridad referencial.
- Índices.
- Auditoría.
- Históricos.

---

# 10. Comunicación

Frontend

↓

REST API

↓

JSON

No existirá comunicación directa con la Base de Datos.

---

# 11. Autenticación

La autenticación utilizará.

JWT.

Cada petición autenticada deberá incluir un Token válido.

Los permisos serán administrados mediante Roles.

---

# 12. Autorización

Cada endpoint validará.

- Usuario.
- Rol.
- Permisos.

Ejemplo.

Analista

↓

Puede registrar capturas.

Gerente

↓

Puede aprobar liquidaciones.

Presidente

↓

Solo consulta indicadores.

---

# 13. Arquitectura del Frontend

```

src/

modules/

shared/

components/

layouts/

hooks/

pages/

routes/

services/

types/

utils/

```

---

# 14. Arquitectura del Backend

```

backend/

apps/

common/

config/

database/

auth/

```

Cada módulo incluirá.

```

views.py

services.py

repositories.py

serializers.py

models.py

validators/

tests/

```

---

# 15. Gestión de Estado

El estado del Frontend utilizará.

React Query

para datos remotos.

Context API

para configuración global.

Estado local

para formularios.

---

# 16. Manejo de Errores

Toda excepción deberá.

- Registrarse.
- Devolver mensaje controlado.
- Mantener auditoría.
- No exponer información sensible.

---

# 17. Auditoría

Toda acción importante registrará.

- Usuario.
- Fecha.
- Hora.
- IP.
- Acción.
- Datos anteriores.
- Datos nuevos.

---

# 18. Docker

Todo el sistema deberá ejecutarse mediante Docker.

Servicios.

- Frontend.
- Backend.
- PostgreSQL.

El entorno completo deberá iniciarse mediante.

```

docker compose up

```

---

# 19. Variables de Entorno

Toda configuración deberá almacenarse mediante variables.

Ejemplos.

DATABASE_URL

JWT_SECRET

PORT

NODE_ENV

---

# 20. Escalabilidad

La arquitectura permitirá.

Agregar nuevos módulos.

Agregar nuevas tablas.

Agregar nuevos dashboards.

Agregar nuevos reportes.

Agregar integraciones.

Sin modificar la arquitectura principal.

---

# 21. Integraciones Futuras

La arquitectura permitirá integrar.

- WhatsApp Business.
- Power BI.
- API pública.
- Facturación electrónica.
- Aplicación móvil.
- Correos automáticos.
- Servicios externos.

---

# 22. Principios de Desarrollo

Todo el código deberá cumplir.

- SOLID.
- DRY.
- KISS.
- Clean Code.
- Clean Architecture.

---

# 23. Decisiones Tecnológicas

Frontend

- React
- TypeScript
- Vite
- TailwindCSS

Backend

- Django
- Django REST Framework
- Python

ORM

- Django ORM

Base de Datos

- PostgreSQL

Autenticación

- JWT

Infraestructura

- Docker

Control de versiones

- Git

---

# 24. Restricciones

No implementar lógica de negocio en React.

No acceder directamente a PostgreSQL desde el Frontend.

No utilizar consultas SQL sin necesidad.

No duplicar reglas del negocio.

No almacenar configuraciones críticas dentro del código.

---

# 25. Evolución

La arquitectura está diseñada para soportar múltiples versiones del sistema.

Cada nueva versión deberá respetar la estructura modular y mantener la compatibilidad con los módulos existentes siempre que sea posible.

---

# 26. Conclusión

La arquitectura de Athena ERP establece la base técnica sobre la cual se desarrollará toda la plataforma.

Su diseño modular, desacoplado y orientado a buenas prácticas permitirá construir un sistema robusto, mantenible y preparado para crecer conforme evolucionen las necesidades del negocio.
