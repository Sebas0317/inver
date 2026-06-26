# 01_VISION.md

# Visión del Proyecto

**Proyecto:** Athena ERP *(Nombre temporal)*

**Versión:** 0.1

**Estado:** Documento de visión

---

# 1. Introducción

Este documento define la visión estratégica del proyecto y establece el propósito que guiará todas las decisiones funcionales y técnicas durante su desarrollo.

A diferencia de otros documentos de este repositorio, este archivo no describe tecnologías, bases de datos o detalles de implementación. Su objetivo es responder una pregunta fundamental:

> **¿Qué queremos construir y por qué?**

Toda nueva funcionalidad deberá contribuir a cumplir esta visión.

---

# 2. Visión

Desarrollar una plataforma web empresarial que centralice, automatice y controle todo el proceso operativo relacionado con la administración, captura de información, conciliación, liquidación y análisis histórico de máquinas electrónicas distribuidas en múltiples clientes y puntos de operación.

El sistema deberá reemplazar completamente el ecosistema de archivos Excel utilizado actualmente, convirtiéndose en la única fuente oficial de información para toda la organización.

Más que digitalizar un proceso manual, el objetivo es transformar la manera en que la empresa administra su operación.

---

# 3. Misión

Proporcionar una herramienta confiable, escalable y fácil de utilizar que permita reducir tiempos operativos, minimizar errores humanos y ofrecer información precisa para la toma de decisiones.

La plataforma deberá facilitar el trabajo diario del analista, proporcionar indicadores al gerente y presidente, permitir procesos transparentes de conciliación con los clientes y ofrecer al contador información confiable para la generación de documentos tributarios y financieros.

---

# 4. Propósito del sistema

El propósito principal del proyecto consiste en eliminar la dependencia de procesos manuales y de conocimiento no documentado.

Actualmente gran parte del negocio depende de la experiencia del analista encargado de interpretar fotografías, validar información y realizar conciliaciones.

La plataforma deberá convertir ese conocimiento en reglas de negocio documentadas y automatizadas.

De esta forma cualquier usuario autorizado podrá comprender el proceso sin depender exclusivamente de una persona específica.

---

# 5. Problema que buscamos resolver

Actualmente la empresa presenta múltiples dificultades operativas:

* Información distribuida en varios archivos Excel.
* Procesos manuales repetitivos.
* Dependencia del conocimiento del analista.
* Falta de trazabilidad.
* Dificultad para consultar históricos.
* Tiempo elevado para generar informes.
* Riesgo de errores humanos.
* Información duplicada.
* Dificultad para obtener indicadores gerenciales.
* Procesos poco escalables.

El sistema busca resolver estos problemas mediante una plataforma integrada donde toda la información permanezca organizada y disponible en tiempo real.

---

# 6. Objetivo principal

Construir una plataforma empresarial que permita administrar completamente el ciclo operativo de las máquinas, desde la captura de los contadores hasta la generación de liquidaciones, históricos y reportes gerenciales.

El sistema deberá facilitar tanto la operación diaria como el análisis estratégico del negocio.

---

# 7. Objetivos específicos

Durante el desarrollo del proyecto se buscará cumplir los siguientes objetivos:

## Centralizar la información

Toda la operación deberá almacenarse en una única base de datos.

No existirán múltiples archivos independientes que contengan información duplicada.

---

## Automatizar cálculos

Todos los cálculos repetitivos deberán realizarse automáticamente.

Esto incluye:

* Recaudos.
* Premios.
* Neto.
* Participaciones.
* Impuestos.
* Fee.
* Días de operación.
* Ajustes.

---

## Mantener un histórico completo

Toda la información registrada permanecerá disponible para consultas futuras.

Será posible consultar el comportamiento histórico de:

* Clientes.
* Puntos.
* Máquinas.
* Operadores.
* Liquidaciones.
* Ajustes.
* Conciliaciones.

---

## Mejorar la trazabilidad

Cada modificación realizada en el sistema deberá quedar registrada.

Será posible conocer:

* Quién realizó el cambio.
* Cuándo lo realizó.
* Qué información modificó.
* Por qué fue modificada.

---

## Facilitar la toma de decisiones

La plataforma proporcionará indicadores claros para cada tipo de usuario.

Especialmente para:

* Gerencia.
* Presidencia.
* Analistas.

---

## Reducir tiempos operativos

El sistema deberá disminuir significativamente el tiempo requerido para:

* Registrar información.
* Validar datos.
* Generar liquidaciones.
* Consultar históricos.
* Elaborar informes.

---

# 8. Alcance

El sistema abarcará las siguientes áreas del negocio.

## Operación diaria

Captura de contadores.

Registro de movimientos.

Validación de información.

---

## Administración

Clientes.

Operadores.

Puntos.

Máquinas.

Usuarios.

Roles.

---

## Liquidaciones

Cálculo automático.

Ajustes.

Conciliaciones.

Cierre de períodos.

---

## Gestión financiera

Participaciones.

Impuestos.

Fee.

Configuraciones tributarias.

---

## Reportes

Indicadores.

Históricos.

Exportaciones.

Consultas.

---

## Auditoría

Registro completo de cambios.

Seguimiento de usuarios.

Historial de modificaciones.

---

# 9. Qué NO pretende hacer este proyecto

Es importante definir también aquello que no hace parte del alcance.

El sistema no pretende:

* Reemplazar la comunicación por WhatsApp.
* Interpretar automáticamente fotografías mediante OCR.
* Administrar el funcionamiento interno de las máquinas.
* Controlar inventarios físicos.
* Sustituir sistemas contables especializados.
* Automatizar decisiones financieras que dependan del criterio humano.

El objetivo consiste en optimizar el proceso operativo existente, no modificar completamente el modelo de negocio.

---

# 10. Usuarios del sistema

La plataforma ha sido diseñada considerando diferentes perfiles de usuario.

Cada uno visualizará únicamente la información necesaria para cumplir sus funciones.

Los actores principales serán:

* Administrador.
* Presidente.
* Gerente.
* Analista.
* Delegado.
* Técnico.
* Contador.

Cada uno contará con permisos específicos definidos por el modelo de seguridad del sistema.

---

# 11. Beneficios esperados

La implementación del sistema deberá generar beneficios tanto operativos como estratégicos.

## Beneficios operativos

* Menor tiempo de captura.
* Menor cantidad de errores.
* Eliminación de duplicidad de información.
* Procesos estandarizados.
* Consultas más rápidas.
* Centralización de datos.

---

## Beneficios administrativos

* Mejor control de la operación.
* Información disponible en tiempo real.
* Mejor seguimiento de clientes.
* Mejor control de liquidaciones.

---

## Beneficios financieros

* Mayor confiabilidad en los cálculos.
* Reducción de diferencias.
* Mejor control tributario.
* Información más precisa para facturación.

---

## Beneficios estratégicos

* Indicadores gerenciales.
* Rentabilidad por cliente.
* Rentabilidad por punto.
* Rentabilidad por máquina.
* Tendencias históricas.
* Identificación de oportunidades de mejora.

---

# 12. Principios que guiarán el desarrollo

Durante todo el proyecto se respetarán los siguientes principios.

## El negocio primero

La tecnología siempre estará al servicio del negocio.

Nunca se desarrollarán funcionalidades únicamente porque sean interesantes desde el punto de vista técnico.

---

## Simplicidad

La solución más sencilla será siempre la primera opción.

La complejidad únicamente se justificará cuando aporte valor real.

---

## Escalabilidad

El sistema deberá poder crecer sin requerir rediseños completos.

Nuevos módulos deberán integrarse fácilmente.

---

## Modularidad

Cada módulo tendrá responsabilidades claramente definidas.

Se evitarán dependencias innecesarias.

---

## Parametrización

Las reglas susceptibles de cambiar con el tiempo deberán configurarse mediante parámetros y no mediante modificaciones al código.

Ejemplos:

* Impuestos.
* Porcentajes.
* Fee.
* UVT.
* Participaciones.

---

## Auditoría

Toda acción importante deberá quedar registrada.

La trazabilidad será una característica fundamental del sistema.

---

# 13. Visión tecnológica

La tecnología será un medio para resolver problemas del negocio.

Inicialmente el sistema será desarrollado utilizando una arquitectura cliente-servidor moderna basada en:

Frontend web.

Backend REST.

Base de datos relacional.

La arquitectura deberá permitir futuras integraciones con herramientas de análisis, aplicaciones móviles o servicios externos.

---

# 14. Visión a largo plazo

A largo plazo la plataforma deberá convertirse en un sistema integral de gestión operativa capaz de administrar completamente el negocio.

El sistema deberá evolucionar para incorporar nuevas funcionalidades sin comprometer la estabilidad de los procesos existentes.

Entre las posibles evoluciones futuras se contemplan:

* Dashboards avanzados.
* Integración con herramientas de Business Intelligence.
* Automatización de reportes.
* Notificaciones.
* Aplicación móvil.
* Integraciones mediante API.
* Análisis predictivo.
* Alertas inteligentes.

Estas funcionalidades no forman parte del alcance inicial, pero la arquitectura deberá facilitar su incorporación.

---

# 15. Criterios de éxito

Se considerará que el proyecto cumple su visión cuando sea capaz de:

* Reemplazar completamente el uso operativo de los archivos Excel.
* Reducir significativamente el tiempo requerido para realizar las liquidaciones.
* Centralizar toda la información histórica.
* Facilitar las conciliaciones con los clientes.
* Proporcionar indicadores claros para la gerencia.
* Garantizar la trazabilidad de toda la operación.
* Permitir el crecimiento futuro del sistema sin rediseños importantes.

---

# 16. Declaración de visión

Este proyecto no busca construir únicamente una aplicación web.

Busca transformar un proceso empresarial complejo en una plataforma moderna, documentada, escalable y confiable.

El éxito del proyecto no se medirá por la cantidad de pantallas desarrolladas, sino por la capacidad del sistema para resolver problemas reales del negocio, preservar el conocimiento operativo de la organización y facilitar la toma de decisiones mediante información consistente, histórica y auditable.
