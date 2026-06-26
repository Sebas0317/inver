# 11_SYSTEM_WORKFLOWS.md

# Flujos del Sistema

**Proyecto:** Athena ERP *(Nombre temporal)*

**Versión:** 0.1

**Estado:** Diseño Funcional

---

# 1. Introducción

Athena ERP se basa en una serie de flujos de trabajo (Workflows) que representan el funcionamiento real de la operación diaria.

Cada workflow describe una secuencia ordenada de actividades realizadas por uno o varios actores del sistema.

Estos flujos servirán como referencia para:

- Desarrollo del Backend.
- Desarrollo del Frontend.
- Diseño de APIs.
- Casos de prueba.
- Automatización de procesos.
- Auditoría.

---

# 2. Principios

Todo workflow deberá cumplir los siguientes principios.

- Ser completamente trazable.
- No perder información.
- Mantener historial.
- Permitir auditoría.
- Respetar los roles del sistema.
- Evitar pasos manuales innecesarios.

---

# 3. Workflow General del Negocio

La operación completa del negocio sigue el siguiente flujo.

```
Inicio del día

↓

Recepción de fotografías

↓

Captura manual de contadores

↓

Validación

↓

Actualización de indicadores

↓

Fin del día

↓

...

↓

Fin del mes

↓

Conciliación

↓

Liquidación

↓

Aprobación

↓

Cierre

↓

Histórico
```

---

# 4. Workflow de Captura Diaria

Actor principal

Analista

Objetivo

Registrar los contadores enviados por WhatsApp.

Flujo

```
Recibir fotografías

↓

Seleccionar cliente

↓

Seleccionar punto

↓

Seleccionar máquina

↓

Registrar contador de recaudo

↓

Registrar contador de premios

↓

Guardar

↓

Actualizar Dashboard

↓

Continuar con la siguiente máquina
```

Resultado

La captura queda registrada.

---

# 5. Workflow de Validación

Actor principal

Analista

Objetivo

Detectar inconsistencias antes de la conciliación.

Flujo

```
Consultar capturas

↓

Comparar con histórico

↓

Detectar diferencias

↓

Registrar observaciones

↓

Corregir si aplica

↓

Validar
```

---

# 6. Workflow de Reinicio de Máquina

Actor principal

Analista

Actor secundario

Técnico

Flujo

```
Detectar reinicio

↓

Registrar causa

↓

Adjuntar evidencia

↓

Registrar nuevo contador inicial

↓

Continuar histórico

↓

Actualizar auditoría
```

---

# 7. Workflow de Bajón Eléctrico

```
Se detecta reinicio inesperado

↓

Consultar última fotografía válida

↓

Consultar histórico

↓

Registrar ajuste

↓

Continuar operación
```

---

# 8. Workflow de Días de Operación

Actor principal

Técnico

```
Ingresar calendario

↓

Seleccionar máquina

↓

Marcar días

↓

Guardar

↓

Actualizar liquidación futura
```

---

# 9. Workflow de Conciliación

Actor principal

Analista

Actor secundario

Delegado

```
Fin del mes

↓

Generar resumen

↓

Revisar máquina por máquina

↓

Registrar diferencias

↓

Ajustar información

↓

Aceptar conciliación

↓

Generar liquidación
```

---

# 10. Workflow de Liquidación

```
Conciliación aprobada

↓

Calcular recaudo

↓

Calcular premios

↓

Calcular neto

↓

Aplicar impuestos

↓

Aplicar Fee

↓

Calcular participación

↓

Generar liquidación
```

---

# 11. Workflow de Aprobación

Actor

Gerente

```
Revisar liquidación

↓

Aceptar

↓

Cerrar período
```

Si existen observaciones.

```
Rechazar

↓

Regresar al Analista

↓

Corregir

↓

Generar nuevamente
```

---

# 12. Workflow de Cierre

```
Liquidación aprobada

↓

Cerrar período

↓

Bloquear modificaciones

↓

Generar auditoría

↓

Guardar histórico
```

---

# 13. Workflow de Reapertura

Actor

Administrador

```
Solicitar reapertura

↓

Registrar motivo

↓

Autorizar

↓

Modificar información

↓

Regenerar liquidación

↓

Cerrar nuevamente
```

---

# 14. Workflow de Dashboard

```
Nueva captura

↓

Actualizar indicadores

↓

Actualizar gráficos

↓

Actualizar ranking

↓

Actualizar KPIs
```

---

# 15. Workflow de Reportes

```
Seleccionar período

↓

Seleccionar cliente

↓

Generar reporte

↓

Exportar PDF

o

Exportar Excel
```

---

# 16. Workflow de Auditoría

```
Usuario realiza acción

↓

Registrar evento

↓

Guardar usuario

↓

Guardar fecha

↓

Guardar valores anteriores

↓

Guardar valores nuevos

↓

Guardar IP

↓

Guardar módulo
```

---

# 17. Workflow de Backups

```
Programación automática

↓

Crear respaldo

↓

Verificar integridad

↓

Guardar copia

↓

Registrar auditoría
```

---

# 18. Workflow Completo del Mes

```
Inicio del mes

↓

Capturas diarias

↓

Validaciones

↓

Correcciones

↓

Registro de mantenimientos

↓

Registro de días de operación

↓

Fin del mes

↓

Conciliación

↓

Liquidación

↓

Aprobación Gerencial

↓

Cierre

↓

Histórico
```

---

# 19. Estados de una Captura

```
Pendiente

↓

Registrada

↓

Validada

↓

Observada

↓

Corregida

↓

Conciliada

↓

Cerrada
```

---

# 20. Estados de una Liquidación

```
Pendiente

↓

Calculada

↓

Revisada

↓

Aprobada

↓

Cerrada

↓

Histórica
```

---

# 21. Estados de un Período

```
Abierto

↓

En Captura

↓

En Conciliación

↓

Pendiente de Aprobación

↓

Cerrado

↓

(Reapertura opcional)
```

---

# 22. Reglas Generales

Todo workflow deberá cumplir.

✓ Mantener historial.

✓ Mantener auditoría.

✓ Respetar permisos.

✓ Evitar pérdida de información.

✓ Ser completamente trazable.

✓ Permitir reconstruir el proceso.

---

# 23. Conclusión

Los workflows representan la operación real del negocio dentro de Athena ERP.

Toda funcionalidad del sistema deberá integrarse en alguno de los flujos aquí definidos.

Si una nueva característica modifica el comportamiento del negocio, este documento deberá actualizarse antes de iniciar el desarrollo.

Los workflows constituyen la guía oficial para comprender cómo interactúan los usuarios, los módulos y la información durante todo el ciclo operativo del sistema.