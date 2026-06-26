# FASE 1 - Infraestructura Base

**Proyecto:** Athena ERP  
**Estado:** Implementada  
**Tipo de tarea:** Preparación técnica inicial  
**Alcance:** Crear la base del proyecto sin implementar lógica de negocio

---

## 1. Comprensión del problema

Athena ERP actualmente cuenta únicamente con documentación funcional y técnica.

No existe todavía una aplicación creada, por lo tanto la primera fase ejecutable debe establecer la infraestructura base del proyecto respetando la arquitectura documentada.

Esta fase no debe implementar reglas del negocio, cálculos financieros, conciliaciones, liquidaciones ni módulos operativos.

El objetivo es dejar una base técnica limpia, modular y preparada para construir las siguientes fases del sistema.

---

## 2. Documentación utilizada

Para definir esta fase se revisaron los siguientes documentos:

- `instructions.md`
- `docs/20_ROADMAP.md`
- `docs/14_ARCHITECTURE.md`
- `docs/15_SECURITY.md`
- `docs/18_CODING_STANDARDS.md`
- `docs/09_NON_FUNCTIONAL_REQUIREMENTS.md`

---

## 3. Objetivo de la fase

Crear la infraestructura inicial del proyecto Athena ERP utilizando:

- React
- TypeScript
- Vite
- Django
- Django REST Framework
- Python
- PostgreSQL
- Django ORM
- Docker
- JWT
- REST

La fase debe entregar un proyecto base que pueda ejecutarse, compilarse y servir como punto de partida para autenticación, usuarios, roles y permisos.

---

## 4. Alcance funcional

Esta fase incluye únicamente infraestructura técnica.

Incluye:

- Crear estructura inicial del repositorio.
- Crear frontend base con React, TypeScript y Vite.
- Crear backend base con Django y Django REST Framework.
- Configurar PostgreSQL para entorno local mediante Docker.
- Configurar variables de entorno de ejemplo.
- Preparar configuración inicial para JWT.
- Preparar estructura modular del backend.
- Preparar estructura base del frontend.
- Agregar documentación mínima de ejecución local.

No incluye:

- Login funcional completo.
- Gestión de usuarios.
- Gestión de roles.
- Gestión de permisos.
- Modelos de negocio.
- Capturas.
- Máquinas.
- Clientes.
- Liquidaciones.
- Conciliaciones.
- Dashboard.
- Reportes.
- Cálculos financieros.

---

## 5. Módulos que serán modificados o creados

Como no existe código fuente todavía, se crearán los siguientes módulos base:

### Frontend

Ruta propuesta:

```text
frontend/
```

Responsabilidad inicial:

- Inicializar React.
- Configurar TypeScript.
- Configurar Vite.
- Preparar estructura de carpetas.
- Mostrar una pantalla inicial mínima del sistema.

### Backend

Ruta propuesta:

```text
backend/
```

Responsabilidad inicial:

- Inicializar Django.
- Instalar Django REST Framework.
- Preparar configuración por ambientes.
- Preparar estructura modular.
- Configurar conexión a PostgreSQL.
- Preparar base para autenticación JWT.

### Infraestructura

Archivos propuestos:

```text
docker-compose.yml
.env.example
.gitignore
README.md
```

Responsabilidad inicial:

- Ejecutar PostgreSQL local.
- Definir variables de entorno esperadas.
- Documentar comandos básicos de ejecución.

---

## 6. Entidades participantes

En esta fase no se implementarán entidades de negocio.

No se crearán todavía modelos como:

- Client
- Operator
- Location
- Machine
- Capture
- Settlement
- Reconciliation
- Adjustment
- AuditLog

La única entidad técnica que podría prepararse posteriormente dentro de Fase 1 será el usuario del sistema, pero no se implementará en este primer bloque salvo aprobación explícita.

---

## 7. Endpoints que serán creados

En este primer bloque no se crearán endpoints funcionales de negocio.

Opcionalmente, solo se podrá crear un endpoint técnico de salud si se aprueba durante la implementación:

```text
GET /api/health/
```

Propósito:

- Verificar que el backend responde.
- Verificar que la API base está disponible.

Este endpoint no representa lógica de negocio.

---

## 8. Tablas afectadas

En este primer bloque no se crearán tablas de negocio.

La base de datos PostgreSQL quedará disponible para futuras migraciones.

Si Django genera tablas internas iniciales, estas pertenecerán únicamente a infraestructura del framework y no al dominio de Athena ERP.

---

## 9. Archivos propuestos

Archivos y carpetas a crear:

```text
frontend/
backend/
docker-compose.yml
.env.example
.gitignore
README.md
```

Posibles archivos internos del backend:

```text
backend/manage.py
backend/config/
backend/apps/
backend/common/
backend/requirements.txt
```

Posibles archivos internos del frontend:

```text
frontend/package.json
frontend/tsconfig.json
frontend/vite.config.ts
frontend/src/
```

---

## 10. Riesgos

### Dependencias externas

La creación del frontend y backend puede requerir instalación de paquetes mediante internet.

Riesgo:

- El entorno puede bloquear descargas.
- La instalación puede requerir aprobación explícita.

Mitigación:

- Solicitar aprobación antes de ejecutar comandos que instalen dependencias.

### Alcance excesivo

La Fase 1 completa incluye login básico, usuarios, roles y permisos.

Riesgo:

- Implementar todo de una vez generaría una tarea demasiado grande.

Mitigación:

- Dividir Fase 1 en bloques pequeños.
- Este documento define únicamente el primer bloque: infraestructura base.

### Inconsistencias futuras

Si la documentación cambia, la implementación deberá ajustarse.

Mitigación:

- Revisar documentación relacionada antes de cada tarea.

---

## 11. Validaciones requeridas

Antes de considerar terminada esta fase, deberán ejecutarse las siguientes validaciones cuando la infraestructura exista:

### Frontend

- Instalar dependencias.
- Ejecutar build.
- Confirmar ausencia de errores TypeScript.
- Confirmar ausencia de errores ESLint si el linter queda configurado.

### Backend

- Instalar dependencias Python.
- Ejecutar checks de Django.
- Confirmar que el backend inicia correctamente.
- Confirmar conexión con PostgreSQL.
- Confirmar ausencia de errores Python.

### Docker

- Validar `docker-compose.yml`.
- Levantar PostgreSQL.
- Confirmar variables de entorno requeridas.

---

## 12. Criterios de aceptación

La fase se considerará completada cuando:

- Exista una estructura clara de frontend y backend.
- El frontend compile correctamente.
- El backend ejecute checks correctamente.
- PostgreSQL pueda levantarse con Docker.
- No existan secretos reales en el repositorio.
- Exista `.env.example` documentando variables requeridas.
- Exista `README.md` con instrucciones básicas.
- No se haya implementado lógica de negocio no aprobada.

---

## 13. Resultado esperado

Al finalizar esta fase, Athena ERP tendrá una base técnica profesional para iniciar el desarrollo incremental.

El siguiente paso recomendado después de esta fase será dividir el resto de Fase 1 en tareas separadas:

1. Autenticación JWT.
2. Usuarios.
3. Roles.
4. Permisos.
5. Configuración inicial.

Cada una de esas tareas deberá tener su propio plan antes de implementarse.
