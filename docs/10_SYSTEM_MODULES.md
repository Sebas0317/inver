# 10_SYSTEM_MODULES.md

# Módulos del Sistema

**Proyecto:** Athena ERP *(Nombre temporal)*

**Versión:** 0.1

**Estado:** Arquitectura Funcional

---

# 1. Introducción

Athena ERP se desarrollará mediante una arquitectura modular.

Cada módulo será responsable de un conjunto específico de procesos del negocio.

Los módulos deberán estar desacoplados entre sí, comunicándose únicamente mediante servicios bien definidos.

Esto permitirá que el sistema pueda crecer durante muchos años sin necesidad de rediseñar toda la aplicación.

---

# 2. Principios de diseño

Todos los módulos deberán cumplir los siguientes principios.

- Alta cohesión.
- Bajo acoplamiento.
- Responsabilidad única.
- Reutilización.
- Escalabilidad.
- Independencia.
- Fácil mantenimiento.

Cada módulo deberá poder evolucionar sin afectar el funcionamiento del resto del sistema.

---

# 3. Arquitectura General

```
                    React + TypeScript

                           │

                           ▼

             API REST (Django REST Framework)

                           │

 ┌────────────────────────────────────────────────────┐
 │                                                    │
 │                 Módulos del Sistema                │
 │                                                    │
 ├────────────────────────────────────────────────────┤
 │                                                    │
 │ Autenticación                                      │
 │ Usuarios                                           │
 │ Clientes                                           │
 │ Puntos                                             │
 │ Máquinas                                           │
 │ Capturas                                            │
 │ Fotografías                                        │
 │ Técnico                                            │
 │ Conciliaciones                                     │
 │ Liquidaciones                                      │
 │ Reportes                                           │
 │ Dashboard                                          │
 │ Auditoría                                          │
 │ Configuración                                      │
 │ Administración                                     │
 │                                                    │
 └────────────────────────────────────────────────────┘

                           │

                           ▼

                   PostgreSQL + Django ORM
```

---

# 4. Flujo principal del negocio

La operación principal del sistema seguirá el siguiente flujo.

Captura diaria

↓

Validación

↓

Conciliación

↓

Liquidación

↓

Aprobación

↓

Cierre del período

↓

Histórico

---

# 5. Módulos principales

Athena ERP estará compuesto inicialmente por los siguientes módulos.

1. Autenticación
2. Usuarios
3. Clientes
4. Puntos
5. Máquinas
6. Capturas
7. Fotografías
8. Técnico
9. Conciliaciones
10. Liquidaciones
11. Reportes
12. Dashboard
13. Auditoría
14. Configuración
15. Administración

---

# 6. Dependencias entre módulos

No todos los módulos pueden funcionar de manera independiente.

Existen dependencias funcionales.

```
Clientes
    │
    ▼
Puntos
    │
    ▼
Máquinas
    │
    ▼
Capturas
    │
    ▼
Conciliaciones
    │
    ▼
Liquidaciones
    │
    ▼
Reportes
```

Los módulos superiores nunca dependerán de los inferiores.

---

# 7. Ciclo de vida de la información

La información seguirá siempre el mismo recorrido.

Cliente

↓

Punto

↓

Máquina

↓

Captura

↓

Validación

↓

Conciliación

↓

Liquidación

↓

Histórico

Nunca deberá romperse esta cadena de trazabilidad.

---

# 8. Estados del sistema

Cada módulo podrá manejar sus propios estados internos.

Ejemplos.

Captura

- Pendiente
- Validada
- Observada
- Conciliada

Máquina

- Activa
- Mantenimiento
- Suspendida
- Retirada

Conciliación

- Pendiente
- En revisión
- Aprobada
- Cerrada

Período

- Abierto
- Cerrado
- Reabierto

---

# 9. Comunicación entre módulos

Los módulos nunca accederán directamente a las tablas de otros módulos.

La comunicación deberá realizarse mediante servicios.

Ejemplo.

Liquidaciones

↓

Consulta CapturasService

↓

Obtiene recaudos

↓

Realiza cálculos

↓

Genera liquidación

Esto evita dependencias innecesarias.

---

# 10. Organización del Backend

El Backend seguirá una organización modular.

```

src/

auth/

users/

clients/

locations/

machines/

captures/

photos/

technicians/

reconciliation/

settlements/

reports/

dashboard/

audit/

settings/

common/

database/

```

Cada módulo tendrá.

- Controller
- Service
- DTO
- Entity
- Repository
- Tests

---

# 11. Organización del Frontend

El Frontend seguirá una organización equivalente.

```

src/

modules/

auth/

users/

clients/

locations/

machines/

captures/

photos/

technicians/

reconciliation/

settlements/

reports/

dashboard/

settings/

shared/

components/

hooks/

layouts/

pages/

services/

```

Cada módulo contendrá únicamente sus propios componentes.

---

# 12. Base de Datos

Aunque la base de datos será única, conceptualmente estará dividida por módulos.

Clientes

↓

Puntos

↓

Máquinas

↓

Capturas

↓

Liquidaciones

↓

Reportes

Cada módulo será propietario de sus entidades.

---

# 13. Integraciones futuras

La arquitectura deberá permitir integrar nuevos módulos sin modificar la estructura existente.

Ejemplos.

- Facturación electrónica.
- WhatsApp Business.
- Notificaciones.
- Firma digital.
- BI.
- Aplicación móvil.
- API pública.
- Integración con DIAN.
- Portal para clientes.

---

# 14. Beneficios de la arquitectura modular

Esta organización permitirá.

- Escalar el sistema fácilmente.
- Reducir dependencias.
- Mejorar el mantenimiento.
- Facilitar pruebas.
- Reutilizar componentes.
- Simplificar el desarrollo en equipo.
- Incorporar nuevas funcionalidades sin afectar las existentes.

---

# 15. Evolución del sistema

La versión 0.1 únicamente implementará el flujo operativo principal.

Versiones posteriores podrán agregar nuevos módulos manteniendo la misma arquitectura.

La modularidad permitirá evolucionar Athena ERP de una herramienta de gestión interna a una plataforma empresarial completa.

---

# 16. Conclusión

La arquitectura modular constituye uno de los pilares fundamentales de Athena ERP.

Cada módulo tendrá una responsabilidad claramente definida y se comunicará con los demás mediante interfaces bien establecidas.

Esta organización permitirá construir un sistema robusto, mantenible y preparado para crecer durante muchos años sin comprometer la estabilidad del negocio.
