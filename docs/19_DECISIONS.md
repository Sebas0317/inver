# 19_DECISIONS.md

# Registro de Decisiones del Proyecto

**Proyecto:** Athena ERP *(Nombre temporal)*

**Versión:** 0.1

**Estado:** Activo

---

# 1. Introducción

Este documento registra todas las decisiones importantes tomadas durante el desarrollo de Athena ERP.

Cada decisión deberá documentar.

- Contexto.
- Problema.
- Alternativas evaluadas.
- Decisión tomada.
- Justificación.
- Consecuencias.

El objetivo es conservar el conocimiento del proyecto a largo plazo.

---

# 2. Formato de una Decisión

Cada decisión seguirá la siguiente estructura.

```
ID

Fecha

Estado

Contexto

Alternativas

Decisión

Justificación

Consecuencias
```

---

# DEC-001

## Nombre

Arquitectura Web

## Fecha

Junio 2026

## Estado

Aceptada

### Contexto

El sistema reemplazará múltiples archivos de Excel utilizados diariamente por diferentes actores del negocio.

Se requiere una plataforma centralizada y accesible desde cualquier equipo.

### Alternativas

- Aplicación de escritorio.
- Aplicación Web.
- Aplicación móvil.

### Decisión

Desarrollar Athena ERP como una aplicación Web.

### Justificación

Permite acceso remoto.

Facilita actualizaciones.

No requiere instalación.

Escala fácilmente.

### Consecuencias

Toda la arquitectura estará orientada a cliente-servidor.

---

# DEC-002

## Nombre

Frontend

## Fecha

Junio 2026

## Estado

Aceptada

### Alternativas

React

Vue

Angular

Svelte

### Decisión

React + TypeScript.

### Justificación

Gran ecosistema.

Excelente integración con TypeScript.

Amplia comunidad.

Facilidad para encontrar librerías.

---

# DEC-003

## Nombre

Backend

### Alternativas

Express

NestJS

Fastify

Laravel

Django

### Decisión

Django + Django REST Framework.

### Justificación

Framework maduro para aplicaciones empresariales.

Excelente integración con PostgreSQL.

Escalabilidad.

Ecosistema robusto para autenticación, permisos, administración y APIs REST.

---

# DEC-004

## Nombre

Base de Datos

### Alternativas

MySQL

PostgreSQL

SQL Server

MongoDB

### Decisión

PostgreSQL.

### Justificación

Excelente soporte para relaciones.

Robustez.

Escalabilidad.

Consultas complejas.

---

# DEC-005

## Nombre

ORM

### Alternativas

TypeORM

Prisma

Drizzle

Django ORM

### Decisión

Django ORM.

### Justificación

Integración nativa con Django.

Migraciones.

Productividad.

Compatibilidad directa con PostgreSQL.

---

# DEC-006

## Nombre

Arquitectura

### Alternativas

MVC tradicional.

Arquitectura por capas.

Arquitectura modular.

DDD completo.

### Decisión

Arquitectura modular inspirada en Domain Driven Design.

### Justificación

Representa mejor el negocio.

Facilita crecimiento.

Reduce acoplamiento.

---

# DEC-007

## Nombre

Captura Manual

### Contexto

Las fotografías enviadas por WhatsApp presentan baja calidad.

OCR produce errores frecuentes.

### Alternativas

OCR automático.

Captura manual.

Captura híbrida.

### Decisión

Captura manual.

### Justificación

La precisión es prioritaria sobre la automatización.

El analista puede interpretar fotografías que un OCR no puede procesar correctamente.

### Consecuencias

La interfaz de captura deberá optimizar la velocidad del analista.

---

# DEC-008

## Nombre

Histórico Permanente

### Contexto

Las liquidaciones antiguas nunca deberán modificarse.

### Decisión

Toda información histórica permanecerá almacenada.

No existirán eliminaciones físicas.

### Consecuencias

Uso de Soft Delete.

Auditoría permanente.

---

# DEC-009

## Nombre

Lógica del Negocio

### Decisión

Toda la lógica financiera residirá exclusivamente en el Backend.

### Justificación

Mayor seguridad.

Mayor consistencia.

Menor duplicación.

---

# DEC-010

## Nombre

Períodos

### Decisión

Todo el sistema girará alrededor de períodos mensuales.

Cada captura pertenecerá a un período.

Cada conciliación pertenecerá a un período.

Cada liquidación pertenecerá a un período.

---

# DEC-011

## Nombre

Auditoría

### Decisión

Toda modificación importante generará automáticamente un registro de auditoría.

No existirá posibilidad de desactivar la auditoría.

---

# DEC-012

## Nombre

Backups

### Decisión

El sistema realizará respaldos automáticos.

Se conservarán múltiples versiones.

Las restauraciones quedarán auditadas.

---

# DEC-013

## Nombre

Estados

### Decisión

Los procesos utilizarán estados claramente definidos.

Ejemplo.

CAPTURE

Pending

Validated

Reconciled

Closed

---

# DEC-014

## Nombre

Docker

### Decisión

Todo el entorno de desarrollo utilizará Docker.

Frontend.

Backend.

PostgreSQL.

---

# DEC-015

## Nombre

API

### Decisión

Se utilizará REST.

Las acciones del negocio se expondrán mediante endpoints específicos.

No únicamente CRUD.

---

# DEC-016

## Nombre

Dashboard

### Decisión

Los cálculos complejos se realizarán en el Backend.

El Frontend únicamente visualizará resultados.

---

# DEC-017

## Nombre

Configuraciones

### Decisión

Los impuestos.

Fees.

Porcentajes.

UVT.

Estados.

Serán completamente parametrizables.

Nunca estarán escritos directamente en el código.

---

# DEC-018

## Nombre

Arquitectura del Proyecto

### Decisión

El proyecto se organizará por módulos.

Cada módulo contendrá.

Views o ViewSets.

Services.

Repositories.

Serializers.

Models.

Validators.

Tests.

---

# DEC-019

## Nombre

Diseño Visual

### Decisión

La interfaz será minimalista.

Inspirada en.

GitHub.

Linear.

Stripe.

Notion.

---

# DEC-020

## Nombre

Desarrollo Asistido por IA

### Decisión

Codex podrá generar código.

Todo cambio deberá respetar.

La documentación.

Las reglas del negocio.

Los estándares del proyecto.

Ninguna regla del negocio podrá ser asumida sin estar documentada.

---

# 3. Cómo Registrar Nuevas Decisiones

Toda decisión importante deberá añadirse a este documento.

Cada registro deberá poseer un identificador único.

Ejemplo.

DEC-021

DEC-022

DEC-023

...

Nunca deberán eliminarse decisiones anteriores.

Si una decisión cambia, se creará una nueva decisión indicando que reemplaza a la anterior.

---

# 4. Estados de una Decisión

Las decisiones podrán tener los siguientes estados.

Propuesta.

Aceptada.

Rechazada.

Obsoleta.

Reemplazada.

---

# 5. Buenas Prácticas

Antes de tomar una decisión importante se deberá evaluar.

El impacto técnico.

El impacto funcional.

La mantenibilidad.

La escalabilidad.

La compatibilidad con decisiones anteriores.

---

# 6. Conclusión

El registro de decisiones constituye la memoria técnica de Athena ERP.

Este documento permitirá comprender por qué se eligieron determinadas tecnologías, arquitecturas y reglas, facilitando el mantenimiento y la evolución del sistema durante los próximos años.

Toda decisión relevante deberá documentarse antes de ser implementada.
