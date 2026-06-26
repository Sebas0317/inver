# 02_BUSINESS_PROBLEM.md

# Análisis del Problema de Negocio

**Proyecto:** Athena ERP *(Nombre temporal)*

**Versión:** 0.1

**Estado:** Documento de análisis del problema

---

# 1. Introducción

Antes de diseñar una solución tecnológica es indispensable comprender el problema que se desea resolver.

Este documento describe el funcionamiento del proceso actual, identifica sus limitaciones, analiza las causas de los principales inconvenientes y establece las oportunidades de mejora que servirán como base para el desarrollo del sistema.

El propósito no es criticar el proceso existente, sino entender por qué fue construido de esa manera y cuáles son los desafíos que enfrenta actualmente.

---

# 2. Contexto del negocio

La empresa administra máquinas electrónicas de entretenimiento instaladas en múltiples establecimientos comerciales pertenecientes a diferentes operadores o clientes.

Cada cliente posee una cantidad variable de puntos de operación y, dentro de cada punto, pueden existir una o varias máquinas.

El negocio depende del registro correcto de los contadores de cada máquina para calcular:

* Recaudos.
* Premios pagados.
* Neto generado.
* Participaciones.
* Impuestos.
* Fees.
* Rentabilidad.

Toda la operación financiera depende directamente de la exactitud de estos registros.

---

# 3. Funcionamiento actual

El proceso operativo actual se desarrolla utilizando cuatro archivos principales de Microsoft Excel:

* **Inicio.xlsx**
* **Proceso.xlsx**
* **Informe.xlsx**
* **Final.xlsx**

Cada uno cumple una función específica dentro del flujo de trabajo.

La información se mueve entre estos archivos mediante copias manuales realizadas por el analista.

Aunque el proceso funciona, depende en gran medida de la experiencia y conocimiento de la persona encargada.

---

# 4. Flujo actual de la información

El proceso diario puede resumirse de la siguiente manera:

1. Los responsables de cada punto toman fotografías de los contadores de las máquinas.
2. Las fotografías son enviadas mediante grupos de WhatsApp.
3. El analista observa cada imagen.
4. El analista transcribe manualmente los contadores al archivo **Inicio.xlsx**.
5. Una vez registrados todos los datos, la información pasa al archivo **Proceso.xlsx**, donde se realizan validaciones y cálculos.
6. Se genera el archivo **Informe.xlsx**, utilizado por la gerencia para revisar la operación diaria.
7. Después de la aprobación del gerente, la información se consolida en **Final.xlsx**, que actúa como histórico y base para las liquidaciones y la facturación.

Cada etapa depende de la correcta ejecución de la anterior.

---

# 5. El verdadero problema

A primera vista podría pensarse que el problema consiste en utilizar Excel.

Sin embargo, el análisis demuestra que Excel no es el principal inconveniente.

El verdadero problema es que:

* El conocimiento del proceso no está documentado.
* La operación depende de una sola persona.
* Las reglas de negocio están implícitas.
* Los cálculos están distribuidos en múltiples archivos.
* La información histórica no se encuentra centralizada.

El riesgo no es la herramienta.

El riesgo es la dependencia del conocimiento humano.

---

# 6. Dependencia del analista

El analista representa el eje central de toda la operación.

Sus responsabilidades incluyen:

* Interpretar fotografías.
* Registrar contadores.
* Identificar inconsistencias.
* Detectar reinicios de máquinas.
* Realizar conciliaciones.
* Aplicar ajustes.
* Generar informes.
* Preparar liquidaciones.
* Mantener los históricos.

Gran parte de estas actividades no se encuentran documentadas.

Muchas decisiones dependen únicamente de la experiencia adquirida durante años de trabajo.

Esto genera un alto riesgo operativo.

---

# 7. Problemas identificados

## 7.1 Información distribuida

La información se encuentra repartida entre varios archivos independientes.

Cada archivo contiene una parte del proceso.

Esto obliga al analista a cambiar constantemente entre documentos y dificulta la consulta de información histórica.

---

## 7.2 Duplicidad de información

Los mismos datos son copiados varias veces entre diferentes archivos.

Esta práctica incrementa el riesgo de errores y hace más difícil garantizar la consistencia de la información.

---

## 7.3 Procesos manuales

Gran parte del trabajo consiste en copiar, pegar y reorganizar información.

Aunque estas actividades son repetitivas, consumen una cantidad considerable de tiempo.

---

## 7.4 Dependencia del conocimiento

Muchas decisiones se toman con base en la experiencia del analista.

Por ejemplo:

* Cómo interpretar una fotografía poco clara.
* Cómo registrar un reinicio de contadores.
* Cómo aplicar determinados ajustes.
* Cómo resolver diferencias durante una conciliación.

Estas reglas no se encuentran documentadas.

---

## 7.5 Dificultad para consultar históricos

Consultar el comportamiento histórico de una máquina requiere abrir diferentes archivos y recorrer múltiples hojas de cálculo.

No existe una consulta centralizada.

---

## 7.6 Baja trazabilidad

Cuando un dato cambia resulta difícil responder preguntas como:

* ¿Quién realizó el cambio?
* ¿Cuándo se realizó?
* ¿Cuál era el valor anterior?
* ¿Por qué se modificó?

La ausencia de auditoría dificulta el seguimiento de la información.

---

## 7.7 Escasa visibilidad gerencial

El gerente recibe informes diarios, pero responder preguntas estratégicas requiere realizar análisis adicionales.

Ejemplos:

* ¿Cuál fue el cliente más rentable del trimestre?
* ¿Qué punto ha disminuido su producción?
* ¿Qué máquinas presentan más fallas?
* ¿Qué operador genera mayor rentabilidad?

Actualmente estas respuestas requieren trabajo manual.

---

## 7.8 Riesgo de pérdida de información

Las fotografías llegan por WhatsApp.

Con el tiempo pueden eliminarse por:

* Cambio de teléfono.
* Pérdida del dispositivo.
* Eliminación del historial.
* Problemas de almacenamiento.

Aunque las fotografías son un insumo importante, actualmente no forman parte del sistema de información.

---

# 8. Casos especiales del negocio

El proceso presenta múltiples situaciones que no siguen el flujo normal.

Entre ellas:

* Reinicio de contadores por mantenimiento.
* Bajones de energía.
* Cambio de CPU.
* Borrado manual de contadores.
* Fotografías faltantes.
* Máquinas fuera de servicio.
* Cambios de operador.
* Ajustes posteriores a una conciliación.

Estas situaciones requieren tratamiento especial y actualmente dependen del criterio del analista.

---

# 9. Problemas durante el cierre de mes

El cierre mensual representa uno de los momentos más críticos de la operación.

Durante esta etapa:

* Se comparan los datos con el delegado del cliente.
* Se identifican diferencias.
* Se revisan fotografías.
* Se consultan históricos.
* Se realizan ajustes.
* Se aprueban liquidaciones.

Cualquier error puede afectar la facturación del período.

Actualmente gran parte de este proceso es manual.

---

# 10. Problemas de escalabilidad

El proceso fue diseñado para una operación de menor tamaño.

A medida que aumenta el número de clientes, puntos y máquinas:

* Crece el tiempo de captura.
* Aumenta el número de validaciones.
* Se incrementa el riesgo de errores.
* Se dificulta la administración de los históricos.

El modelo actual presenta limitaciones para soportar un crecimiento significativo.

---

# 11. Consecuencias para la organización

Los problemas identificados generan impactos directos en la empresa.

Entre ellos:

* Mayor tiempo operativo.
* Mayor riesgo financiero.
* Dependencia de personal específico.
* Dificultad para capacitar nuevos analistas.
* Información menos accesible.
* Procesos difíciles de auditar.
* Baja capacidad de análisis.

---

# 12. Oportunidad de mejora

El análisis realizado evidencia una oportunidad clara para rediseñar completamente el proceso.

La solución no consiste simplemente en reemplazar Excel por una aplicación web.

Es necesario construir un sistema que:

* Centralice la información.
* Automatice los cálculos.
* Documente las reglas de negocio.
* Preserve el conocimiento operativo.
* Facilite las conciliaciones.
* Mantenga un histórico completo.
* Proporcione indicadores en tiempo real.
* Garantice la trazabilidad de toda la operación.

---

# 13. Restricciones del negocio

Durante el diseño del sistema deberán respetarse ciertas condiciones propias de la operación.

## Captura manual de contadores

No se implementará reconocimiento OCR.

Las fotografías presentan condiciones variables y la interpretación humana continúa siendo el método más confiable.

---

## Validación con el cliente

Las liquidaciones deberán poder ajustarse durante la conciliación cuando el delegado del cliente presente información diferente.

El sistema deberá conservar tanto el valor original como el valor conciliado.

---

## Registro histórico

Nunca deberá perderse información histórica.

Incluso cuando exista un ajuste o corrección.

---

## Parametrización

Los impuestos, porcentajes y configuraciones financieras deberán poder modificarse sin necesidad de alterar el código fuente.

---

# 14. Estado futuro deseado

La organización necesita una plataforma donde:

* Toda la información esté centralizada.
* Las reglas del negocio estén documentadas.
* Los cálculos sean automáticos.
* Los usuarios trabajen sobre una única fuente de información.
* Las conciliaciones sean trazables.
* Las liquidaciones puedan cerrarse y bloquearse.
* Los históricos permanezcan disponibles.
* La gerencia disponga de indicadores actualizados.
* El contador pueda generar información confiable para facturación.

---

# 15. Conclusión

El análisis demuestra que el principal desafío de la organización no radica en la herramienta utilizada, sino en la forma en que el conocimiento del negocio se encuentra distribuido y ejecutado.

El proceso actual ha demostrado ser funcional gracias a la experiencia del analista, pero presenta limitaciones importantes en términos de escalabilidad, trazabilidad, auditoría y continuidad operativa.

El objetivo del proyecto no será únicamente desarrollar una aplicación web, sino convertir ese conocimiento operativo en un sistema estructurado, documentado y capaz de evolucionar junto con el negocio.

La solución propuesta deberá conservar las reglas que hacen funcionar la operación, eliminar las tareas repetitivas y proporcionar una plataforma moderna que facilite el crecimiento de la empresa sin depender exclusivamente del conocimiento de una única persona.
