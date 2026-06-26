# 12_ENTITY_ANALYSIS.md

# Análisis de Entidades

**Proyecto:** Athena ERP *(Nombre temporal)*

**Versión:** 0.1

**Estado:** Análisis del Dominio

---

# 1. Introducción

Este documento identifica las entidades principales que conforman el dominio de negocio de Athena ERP.

Una entidad representa un objeto del mundo real sobre el cual el sistema almacena información y ejecuta procesos.

El objetivo de este documento es comprender el modelo del negocio antes de diseñar la base de datos.

Este análisis es independiente de PostgreSQL, Django ORM o cualquier otra tecnología.

---

# 2. Principios

Toda entidad deberá cumplir.

- Tener una identidad única.
- Tener un ciclo de vida.
- Mantener historial cuando sea necesario.
- Participar en uno o varios procesos del negocio.
- Ser independiente de la interfaz gráfica.

---

# 3. Mapa General del Dominio

```
Empresa

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
```

---

# 4. Entidades Principales

Athena ERP estará compuesto inicialmente por las siguientes entidades.

- Usuario
- Rol
- Permiso
- Operador
- Delegado
- Sala
- Máquina
- Tipo de Máquina
- Captura
- Fotografía
- Reinicio
- Día de Operación
- Conciliación
- Diferencia
- Liquidación
- Impuesto
- Fee
- Participación
- Período
- Configuración
- Auditoría
- Backup

---

# 5. Usuario

Representa una persona que utiliza el sistema.

Responsabilidades.

- Iniciar sesión.
- Ejecutar acciones.
- Consultar información.
- Generar reportes.

Atributos principales.

- Id
- Nombre
- Correo
- Contraseña
- Estado
- Fecha de creación

---

# 6. Rol

Define el conjunto de permisos que posee un usuario.

Ejemplos.

- Presidente
- Gerente
- Analista
- Técnico
- Delegado
- Contador
- Administrador

---

# 7. Operador

Representa la empresa propietaria o administradora de un conjunto de máquinas.

Ejemplos.

- Facilisimo
- Sured
- Seapto
- Serviwin

Atributos.

- Id
- Nombre
- NIT
- Estado
- Porcentaje de participación

---

# 8. Delegado

Representa la persona designada por el operador para participar en el proceso de conciliación.

Ejemplos.

- Carlos García (Facilisimo)
- María López (Sured)

Un delegado pertenece a un único operador.

Un operador puede tener múltiples delegados.

Atributos.

- Id
- Nombre completo
- Teléfono
- Correo electrónico

---

# 9. Sala

Representa un establecimiento físico donde operan las máquinas.

Ejemplos.

- Matrix Redes
- Las Amapolas
- Punto Centro

Una sala pertenece a un único operador.

Una sala puede contener múltiples máquinas.

---

# 10. Máquina

Representa una máquina física instalada en una sala.

Cada máquina tendrá.

- Número interno
- Serial
- Tipo
- Estado
- Fecha de instalación

Una máquina pertenece únicamente a una sala en un momento determinado.

Su historial de traslados deberá conservarse.

---

# 11. Tipo de Máquina

Clasifica las máquinas.

Ejemplos.

- PMV Roja
- Silver
- R Franco

Esta entidad permitirá modificar configuraciones específicas por tipo.

---

# 12. Captura

Representa la lectura diaria realizada por el analista.

Una captura contiene.

- Recaudo
- Premios
- Ajustes
- Observaciones
- Fecha
- Usuario

Cada captura pertenece a una máquina.

---

# 13. Fotografía

Representa una evidencia visual.

Inicialmente solo existirán dos fotografías permanentes por período.

- Inicio del mes.
- Fin del mes.

Las fotografías diarias podrán utilizarse temporalmente durante la captura, pero no harán parte del histórico permanente.

---

# 14. Reinicio

Representa un evento donde los contadores de una máquina cambian su continuidad.

Ejemplos.

- Cambio de CPU.
- Bajón eléctrico.
- Borrado manual.

El sistema deberá conservar el histórico antes y después del reinicio.

---

# 15. Día de Operación

Representa el estado operativo diario de una máquina.

Valores posibles.

- Operativa.
- Dañada.
- Mantenimiento.
- Suspendida.
- Trasladada.

Esta entidad afectará el cálculo del Fee y algunos impuestos.

---

# 16. Conciliación

Representa el proceso de validación realizado entre la empresa y el delegado del operador.

Contiene.

- Diferencias.
- Observaciones.
- Estado.
- Fecha.
- Responsable.

---

# 17. Diferencia

Representa una inconsistencia detectada durante la conciliación.

Puede estar relacionada con.

- Capturas.
- Reinicios.
- Ajustes.
- Fotografías.

---

# 18. Liquidación

Representa el resultado financiero oficial de un período.

Incluye.

- Recaudo.
- Premios.
- Neto.
- Impuestos.
- Fee.
- Participación.
- Total a pagar.

Una liquidación nunca será editada directamente.

Siempre será regenerada.

---

# 19. Impuesto

Entidad parametrizable.

Permitirá administrar.

- Coljuegos.
- IVA.
- Administración.
- Otros impuestos futuros.

Cada versión conservará su vigencia histórica.

---

# 20. Fee

Representa el costo mensual asociado a una máquina.

Su cálculo dependerá de.

- Días de operación.
- Configuración vigente.
- Tipo de máquina.

---

# 21. Participación

Representa el porcentaje económico correspondiente al operador.

Será completamente parametrizable.

Los cambios históricos deberán conservarse.

---

# 22. Período

Representa el intervalo de trabajo del sistema.

Generalmente un mes.

Contiene.

- Fecha inicio.
- Fecha fin.
- Estado.
- Fecha de cierre.

---

# 23. Configuración

Agrupa todos los parámetros modificables del sistema.

Ejemplos.

- UVT.
- IVA.
- Porcentajes.
- Fee.
- Estados.
- Tipos de máquina.

---

# 24. Auditoría

Registra toda acción importante realizada por los usuarios.

Nunca podrá modificarse.

Nunca podrá eliminarse.

---

# 25. Backup

Representa un respaldo del sistema.

Incluye.

- Base de datos.
- Evidencias.
- Archivos adjuntos.

---

# 26. Relaciones Principales

```
Usuario
    │
    ├──────────────┐
    ▼              ▼
Captura      Auditoría


Operador
    │
    ├──────────────┐
    ▼              ▼
Delegado       Sala
                    │
                    ▼
Máquina
    │
    ├──────────────┐
    ▼              ▼
Captura      Día Operación
    │
    ▼
Conciliación
    │
    ▼
Liquidación


Período
    │
    ├──────────────┐
    ▼              ▼
Capturas     Liquidaciones
```

---

# 27. Entidades Parametrizables

Las siguientes entidades podrán modificarse desde el sistema.

- Impuestos.
- Fee.
- Participaciones.
- Tipos de máquina.
- Estados.
- Configuraciones generales.

---

# 28. Entidades Históricas

Nunca podrán eliminarse.

- Capturas.
- Liquidaciones.
- Auditoría.
- Reinicios.
- Conciliaciones.
- Días de operación.
- Períodos cerrados.

---

# 29. Futuras Entidades

La arquitectura permitirá incorporar nuevas entidades sin afectar el modelo existente.

Ejemplos.

- Facturas.
- Pagos.
- Contratos.
- Notificaciones.
- Integraciones externas.
- Inventario de repuestos.
- Tickets de soporte.

---

# 30. Conclusión

Las entidades definidas en este documento representan el modelo conceptual del negocio.

A partir de este análisis se diseñará el modelo relacional de la base de datos, los modelos de Django, los servicios del Backend y los componentes del Frontend.

Toda nueva funcionalidad deberá asociarse a una o varias entidades existentes o justificar la creación de una nueva entidad dentro del dominio.
