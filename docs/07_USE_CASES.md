# 07_USE_CASES.md

# Casos de Uso

**Proyecto:** Athena ERP *(Nombre temporal)*

**Versión:** 0.1

**Estado:** Especificación funcional

---

# 1. Introducción

Este documento describe los casos de uso funcionales del sistema Athena ERP.

Cada caso de uso representa una interacción entre un actor y el sistema con el objetivo de completar una tarea específica.

Los casos de uso servirán como base para:

- Desarrollo del Backend.
- Desarrollo del Frontend.
- Diseño de APIs.
- Pruebas funcionales.
- Casos de prueba.
- Documentación.

---

# 2. Convenciones

Cada caso de uso tendrá la siguiente estructura.

- Código
- Nombre
- Actores
- Objetivo
- Precondiciones
- Flujo principal
- Flujos alternativos
- Postcondiciones
- Reglas de negocio relacionadas

---

# 3. Índice de Casos de Uso

## Gestión de usuarios

UC-001 Iniciar sesión

UC-002 Cerrar sesión

UC-003 Recuperar contraseña

UC-004 Crear usuario

UC-005 Editar usuario

UC-006 Desactivar usuario

---

## Clientes

UC-010 Crear cliente

UC-011 Editar cliente

UC-012 Consultar cliente

UC-013 Cambiar porcentaje de participación

---

## Puntos

UC-020 Crear punto

UC-021 Editar punto

UC-022 Cerrar punto

UC-023 Consultar punto

---

## Máquinas

UC-030 Registrar máquina

UC-031 Editar máquina

UC-032 Trasladar máquina

UC-033 Retirar máquina

UC-034 Cambiar estado

UC-035 Consultar historial

---

## Capturas

UC-040 Registrar captura diaria

UC-041 Editar captura

UC-042 Registrar observación

UC-043 Adjuntar fotografía

UC-044 Validar captura

---

## Técnico

UC-050 Registrar día de operación

UC-051 Registrar mantenimiento

UC-052 Registrar daño

UC-053 Registrar reinicio

---

## Conciliaciones

UC-060 Crear conciliación

UC-061 Registrar diferencia

UC-062 Aprobar conciliación

UC-063 Rechazar conciliación

---

## Liquidaciones

UC-070 Generar liquidación

UC-071 Aprobar liquidación

UC-072 Reabrir liquidación

---

## Reportes

UC-080 Dashboard Gerencial

UC-081 Dashboard Ejecutivo

UC-082 Dashboard Operativo

UC-083 Exportar Excel

UC-084 Exportar PDF

UC-085 Consultar histórico

---

## Administración

UC-090 Configurar impuestos

UC-091 Configurar Fee

UC-092 Configurar parámetros

UC-093 Restaurar Backup

UC-094 Consultar Auditoría

---

# 4. Plantilla oficial

Todos los casos de uso deberán documentarse utilizando la siguiente estructura.

Código

Nombre

Objetivo

Actor principal

Actores secundarios

Precondiciones

Flujo principal

Flujos alternativos

Excepciones

Postcondiciones

Reglas de negocio asociadas

---

# 5. Ejemplo

A continuación se presenta el primer caso de uso completamente documentado.

---

# UC-001

## Nombre

Iniciar sesión

---

## Objetivo

Permitir que un usuario autenticado acceda al sistema utilizando sus credenciales.

---

## Actor principal

Usuario

---

## Actores secundarios

Ninguno.

---

## Precondiciones

El usuario debe existir.

Debe encontrarse activo.

Debe poseer permisos.

---

## Flujo principal

1. El usuario abre la pantalla de inicio.

2. Ingresa usuario.

3. Ingresa contraseña.

4. Presiona Ingresar.

5. El sistema valida las credenciales.

6. El sistema carga los permisos.

7. El sistema redirecciona al Dashboard correspondiente.

---

## Flujos alternativos

Usuario incorrecto.

Contraseña incorrecta.

Usuario bloqueado.

Sesión expirada.

---

## Postcondiciones

Existe una sesión activa.

Se registra el acceso en auditoría.

---

## Reglas relacionadas

BR-100

BR-101

BR-105

BR-2000

BR-2001

---

# 6. Convenciones de numeración

Los casos de uso seguirán la siguiente numeración.

UC-001 al UC-009

Autenticación.

UC-010 al UC-019

Clientes.

UC-020 al UC-029

Puntos.

UC-030 al UC-039

Máquinas.

UC-040 al UC-049

Capturas.

UC-050 al UC-059

Técnico.

UC-060 al UC-069

Conciliaciones.

UC-070 al UC-079

Liquidaciones.

UC-080 al UC-089

Reportes.

UC-090 al UC-099

Administración.

---

# 7. Relaciones

Cada caso de uso deberá poder relacionarse con.

- Actor.
- Pantalla.
- API.
- Endpoint.
- Regla de negocio.
- Modelo de Base de Datos.
- Casos de prueba.

---

# 8. Futuras versiones

Cuando aparezcan nuevas funcionalidades, únicamente será necesario agregar nuevos casos de uso siguiendo esta numeración.

Nunca deberán modificarse los códigos existentes.

---

# 9. Conclusión

Los casos de uso representan la especificación funcional oficial del sistema.

Toda funcionalidad implementada deberá corresponder a uno o varios casos de uso documentados.

No deberá desarrollarse ninguna característica que no tenga un caso de uso previamente definido y aprobado.