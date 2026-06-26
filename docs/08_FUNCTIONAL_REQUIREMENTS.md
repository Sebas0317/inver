# 08_FUNCTIONAL_REQUIREMENTS.md

# Requerimientos Funcionales

**Proyecto:** Athena ERP *(Nombre temporal)*

**Versión:** 0.1

**Estado:** Especificación Funcional

---

# 1. Introducción

Este documento describe los requerimientos funcionales que deberá implementar Athena ERP.

Un requerimiento funcional representa una capacidad que el sistema debe ofrecer a sus usuarios.

Los requerimientos aquí definidos servirán como referencia para el desarrollo del Backend, Frontend, Base de Datos y pruebas funcionales.

Todo requerimiento deberá ser verificable.

---

# 2. Convenciones

Cada requerimiento tendrá la siguiente estructura.

Código

Nombre

Descripción

Prioridad

Actor

Módulo

Dependencias

Estado

---

# 3. Prioridades

Las prioridades utilizadas serán.

Alta

Media

Baja

Crítica

---

# 4. Módulos

Los requerimientos estarán organizados por módulos.

- Autenticación
- Usuarios
- Clientes
- Puntos
- Máquinas
- Capturas
- Fotografías
- Técnico
- Conciliaciones
- Liquidaciones
- Reportes
- Dashboard
- Administración
- Auditoría

---

# 5. Requerimientos de Autenticación

## FR-001

Nombre

Inicio de sesión

Descripción

El sistema deberá permitir el acceso mediante usuario y contraseña.

Prioridad

Crítica

Actor

Todos.

---

## FR-002

Cerrar sesión

El sistema permitirá cerrar la sesión manualmente.

---

## FR-003

Recuperación de contraseña.

---

## FR-004

Cambio de contraseña.

---

## FR-005

Control de sesiones activas.

---

# 6. Usuarios

## FR-100

Crear usuario.

---

## FR-101

Editar usuario.

---

## FR-102

Desactivar usuario.

---

## FR-103

Asignar roles.

---

## FR-104

Gestionar permisos.

---

## FR-105

Consultar usuarios.

---

# 7. Clientes

## FR-200

Registrar cliente.

---

## FR-201

Editar cliente.

---

## FR-202

Consultar cliente.

---

## FR-203

Consultar histórico.

---

## FR-204

Asignar porcentaje de participación.

---

## FR-205

Consultar indicadores del cliente.

---

# 8. Puntos

## FR-300

Registrar punto.

---

## FR-301

Editar punto.

---

## FR-302

Consultar punto.

---

## FR-303

Cerrar punto.

---

## FR-304

Consultar historial.

---

# 9. Máquinas

## FR-400

Registrar máquina.

---

## FR-401

Editar máquina.

---

## FR-402

Cambiar estado.

---

## FR-403

Trasladar máquina.

---

## FR-404

Registrar reinicio.

---

## FR-405

Consultar historial.

---

## FR-406

Consultar línea de tiempo.

---

# 10. Capturas

## FR-500

Registrar captura diaria.

---

## FR-501

Editar captura.

---

## FR-502

Registrar observaciones.

---

## FR-503

Registrar ajustes.

---

## FR-504

Registrar fotografía inicial.

---

## FR-505

Registrar fotografía final.

---

## FR-506

Validar captura.

---

## FR-507

Consultar histórico.

---

# 11. Técnico

## FR-600

Registrar mantenimiento.

---

## FR-601

Registrar máquina dañada.

---

## FR-602

Registrar cambio de CPU.

---

## FR-603

Registrar días de operación.

---

## FR-604

Consultar calendario.

---

# 12. Conciliaciones

## FR-700

Crear conciliación.

---

## FR-701

Registrar diferencias.

---

## FR-702

Agregar observaciones.

---

## FR-703

Aceptar conciliación.

---

## FR-704

Rechazar conciliación.

---

## FR-705

Cerrar conciliación.

---

# 13. Liquidaciones

## FR-800

Generar liquidación.

---

## FR-801

Recalcular liquidación.

---

## FR-802

Consultar liquidación.

---

## FR-803

Exportar liquidación.

---

## FR-804

Reabrir liquidación.

---

# 14. Reportes

## FR-900

Reporte diario.

---

## FR-901

Reporte mensual.

---

## FR-902

Reporte histórico.

---

## FR-903

Reporte por cliente.

---

## FR-904

Reporte por punto.

---

## FR-905

Reporte por máquina.

---

## FR-906

Exportar Excel.

---

## FR-907

Exportar PDF.

---

# 15. Dashboard

## FR-1000

Dashboard Operativo.

---

## FR-1001

Dashboard Gerencial.

---

## FR-1002

Dashboard Presidencial.

---

## FR-1003

Dashboard Financiero.

---

## FR-1004

Dashboard Técnico.

---

# 16. Auditoría

## FR-1100

Consultar auditoría.

---

## FR-1101

Filtrar auditoría.

---

## FR-1102

Consultar historial de cambios.

---

# 17. Administración

## FR-1200

Configurar impuestos.

---

## FR-1201

Configurar Fee.

---

## FR-1202

Configurar parámetros.

---

## FR-1203

Gestionar Backups.

---

## FR-1204

Restaurar respaldo.

---

## FR-1205

Gestionar catálogos.

---

# 18. Requisitos generales

Además de los módulos anteriores, el sistema deberá.

✓ Calcular automáticamente todos los valores.

✓ Mantener históricos.

✓ Evitar duplicidad.

✓ Auditar modificaciones.

✓ Permitir consultas históricas.

✓ Generar reportes.

✓ Mantener integridad referencial.

✓ Funcionar mediante roles.

✓ Mantener configuración parametrizable.

---

# 19. Trazabilidad

Cada requerimiento deberá relacionarse con.

Caso de uso.

↓

Regla de negocio.

↓

Modelo de Base de Datos.

↓

Endpoint.

↓

Componente React.

↓

Caso de prueba.

---

# 20. Ejemplo

FR-503

↓

UC-041

↓

BR-902

↓

capture_adjustments

↓

POST /capture-adjustments

↓

AdjustmentForm.tsx

↓

TEST-231

---

# 21. Conclusión

Los requerimientos funcionales representan el contrato entre el negocio y el software.

Toda funcionalidad implementada deberá corresponder a uno o más requerimientos funcionales documentados.

Los requerimientos aquí definidos servirán como base para el desarrollo incremental del sistema y deberán mantenerse sincronizados con los casos de uso, reglas de negocio y documentación técnica.