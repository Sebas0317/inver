# 13_DATABASE_DESIGN.md

# Diseño de Base de Datos

**Proyecto:** Athena ERP *(Nombre temporal)*

**Versión:** 0.1

**Estado:** Diseño Lógico

---

# 1. Introducción

Este documento describe el diseño lógico de la base de datos de Athena ERP.

El objetivo es representar correctamente las reglas del negocio mediante un modelo relacional que garantice integridad, escalabilidad y trazabilidad.

El modelo aquí definido servirá como base para la implementación en PostgreSQL utilizando Django ORM.

---

# 2. Objetivos

La base de datos deberá permitir:

- Almacenar información histórica.
- Mantener integridad referencial.
- Evitar duplicidad de datos.
- Permitir auditoría completa.
- Facilitar consultas complejas.
- Soportar crecimiento durante varios años.
- Mantener el rendimiento con millones de registros.

---

# 3. Motor de Base de Datos

Motor seleccionado:

PostgreSQL

ORM:

Django ORM

---

# 4. Principios de Diseño

El modelo deberá cumplir los siguientes principios.

- Normalización hasta 3FN como mínimo.
- Uso de claves primarias UUID.
- Relaciones mediante claves foráneas.
- No eliminar registros históricos.
- Soft Delete cuando sea necesario.
- Uso de índices en columnas de búsqueda frecuente.
- Auditoría completa de cambios.

---

# 5. Organización General

La base de datos estará organizada por dominios.

```
Usuarios

↓

Operadores

↓

Salas

↓

Máquinas

↓

Capturas

↓

Conciliaciones

↓

Liquidaciones

↓

Reportes

↓

Configuración

↓

Auditoría
```

---

# 6. Tablas Principales

## Seguridad

- users
- roles
- permissions
- role_permissions
- user_roles

---

## Operación

- operators
- delegates
- locations
- machines
- machine_types

---

## Capturas

- captures
- capture_adjustments
- photos
- machine_resets

---

## Operación Técnica

- operation_days
- maintenance_events

---

## Conciliaciones

- reconciliations
- reconciliation_items
- reconciliation_differences

---

## Liquidaciones

- settlements
- settlement_items

---

## Configuración

- taxes
- fees
- participation_rules
- system_parameters

---

## Auditoría

- audit_logs

---

## Sistema

- periods
- backups

---

# 7. Relaciones Principales

```
users
    │
    ▼
captures

operators
    │
    ▼
delegates

operators
    │
    ▼
locations

locations
    │
    ▼
machines

machine_types
    │
    ▼
machines

machines
    │
    ├──────────────┐
    ▼              ▼
captures     operation_days

captures
    │
    ▼
capture_adjustments

machines
    │
    ▼
machine_resets

periods
    │
    ├──────────────┐
    ▼              ▼
captures     settlements

settlements
    │
    ▼
settlement_items

users
    │
    ▼
audit_logs
```

---

# 8. Claves Primarias

Todas las tablas utilizarán UUID.

Ejemplo.

id UUID PRIMARY KEY

---

# 9. Auditoría

Todas las tablas críticas incluirán.

- created_at
- updated_at
- created_by
- updated_by

Cuando aplique.

- deleted_at
- deleted_by

Las tablas históricas no deberán eliminar información.

---

# 10. Índices

Se crearán índices para campos consultados frecuentemente.

Ejemplos.

machines.serial

machines.number

captures.capture_date

captures.machine_id

locations.operator_id

settlements.period_id

audit_logs.created_at

---

# 11. Restricciones

El modelo deberá garantizar.

Una máquina pertenece a una sola sala activa.

Una sala pertenece a un solo operador.

Una captura pertenece a una sola máquina.

Una conciliación pertenece a un período.

Una liquidación pertenece a un período.

No podrán existir dos capturas para la misma máquina y la misma fecha.

---

# 12. Históricos

Las siguientes tablas conservarán información indefinidamente.

- captures
- settlements
- reconciliations
- machine_resets
- operation_days
- audit_logs

Nunca se eliminarán físicamente.

---

# 13. Soft Delete

Las siguientes tablas permitirán desactivación lógica.

- users
- operators
- delegates
- locations
- machines
- machine_types

---

# 14. Versionamiento

Las configuraciones deberán conservar historial.

Ejemplo.

IVA

2025

↓

19%

2026

↓

20%

Las liquidaciones antiguas deberán seguir utilizando el porcentaje vigente en su fecha.

---

# 15. Integridad Referencial

Todas las relaciones utilizarán claves foráneas.

No se permitirá eliminar registros que tengan dependencias activas.

Las eliminaciones deberán controlarse mediante restricciones.

---

# 16. Rendimiento

La base de datos deberá soportar.

- Más de 100 operadores.
- Miles de salas.
- Decenas de miles de máquinas.
- Millones de capturas históricas.

Sin degradación significativa del rendimiento.

---

# 17. Respaldo

La arquitectura deberá permitir.

- Backups automáticos.
- Restauración completa.
- Restauración por período.
- Restauración de evidencias.

---

# 18. Futuras Extensiones

El diseño permitirá incorporar nuevas tablas.

Ejemplos.

- invoices
- payments
- contracts
- notifications
- integrations
- support_tickets
- mobile_sessions

Sin modificar la estructura existente.

---

# 19. Convenciones

Todas las tablas utilizarán.

snake_case

Ejemplos.

created_at

machine_id

operator_id

capture_date

Todas las claves foráneas finalizarán con `_id`.

Todas las tablas utilizarán nombres en plural.

---

# 20. Conclusión

El modelo lógico definido en este documento constituye la base estructural de Athena ERP.

A partir de este diseño se implementará el esquema físico en PostgreSQL mediante Django ORM, garantizando consistencia, trazabilidad y escalabilidad para soportar la operación completa del negocio.
