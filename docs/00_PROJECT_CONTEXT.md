# 00_PROJECT_CONTEXT.md

# Proyecto

**Nombre provisional:** Athena ERP (Nombre temporal)

**Versión del documento:** 0.1

**Estado:** En análisis

**Última actualización:** Junio 2026

---

# 1. Introducción

Este documento constituye la fuente principal de información del proyecto y debe ser considerado la referencia oficial para comprender el funcionamiento del sistema.

Todo desarrollador, diseñador, colaborador o asistente de inteligencia artificial que participe en este proyecto deberá leer este documento antes de realizar cualquier modificación o implementar nuevas funcionalidades.

Este archivo describe el contexto del negocio, la filosofía del proyecto, los objetivos, las decisiones técnicas iniciales y el alcance general del sistema.

Su propósito es garantizar que el conocimiento del negocio no dependa únicamente de la memoria del desarrollador principal, sino que permanezca documentado y versionado dentro del repositorio.

---

# 2. Historia del proyecto

Este proyecto nace a partir de una necesidad real identificada durante varios años de trabajo dentro de una empresa dedicada a la administración y liquidación de máquinas electrónicas de entretenimiento instaladas en diferentes establecimientos comerciales.

Durante ese período, el proceso operativo dependía completamente de archivos Microsoft Excel y del conocimiento del analista encargado de transformar la información.

La empresa operaba utilizando múltiples libros de Excel con funciones diferentes.

Entre ellos:

* Inicio
* Proceso
* Informe
* Final

Cada uno cumplía un propósito específico dentro del flujo operativo.

La información era recibida diariamente mediante fotografías enviadas por WhatsApp desde los diferentes puntos donde estaban instaladas las máquinas.

El analista debía observar cada fotografía manualmente e ingresar los contadores correspondientes en Excel.

Una vez registrados todos los datos, comenzaba una cadena de transformaciones, validaciones, conciliaciones y cálculos que finalmente generaban las liquidaciones económicas de cada cliente.

Con el paso del tiempo fue evidente que el principal problema no era Excel.

El verdadero problema era que todo el conocimiento del negocio vivía en la cabeza del analista.

Si esa persona faltaba, el proceso completo se volvía extremadamente difícil de mantener.

Este proyecto busca eliminar esa dependencia.

---

# 3. Problema que resuelve

Actualmente el proceso presenta múltiples inconvenientes.

Entre ellos:

* Información distribuida en varios archivos de Excel.
* Procesos manuales repetitivos.
* Dependencia absoluta del analista.
* Históricos difíciles de consultar.
* Alto riesgo de errores humanos.
* Dificultad para generar indicadores.
* Falta de trazabilidad.
* Ausencia de auditoría.
* Dificultad para conocer la rentabilidad del negocio en tiempo real.
* Riesgo de pérdida de fotografías provenientes de WhatsApp.
* Imposibilidad de consultar fácilmente el comportamiento histórico de una máquina o un punto específico.

El sistema busca resolver todos estos problemas mediante una plataforma centralizada.

---

# 4. Objetivo general

Diseñar y desarrollar una plataforma web capaz de administrar completamente el proceso operativo, financiero y administrativo relacionado con la captura de contadores, conciliaciones, liquidaciones y generación de información histórica de las máquinas instaladas en múltiples clientes.

El sistema deberá convertirse en la única fuente oficial de información de la empresa.

---

# 5. Objetivos específicos

El proyecto pretende:

* Centralizar toda la información.
* Eliminar la dependencia de múltiples archivos Excel.
* Mantener un histórico completo.
* Facilitar las conciliaciones.
* Reducir tiempos operativos.
* Automatizar cálculos repetitivos.
* Permitir consultas históricas.
* Proporcionar indicadores gerenciales.
* Implementar auditoría completa.
* Mejorar la trazabilidad de toda la operación.
* Facilitar la generación de reportes.
* Preparar la plataforma para futuras integraciones con herramientas analíticas.

---

# 6. Filosofía del proyecto

Este proyecto NO busca convertir un archivo Excel en una aplicación web.

Busca rediseñar completamente el proceso de negocio.

Cada funcionalidad deberá existir porque resuelve una necesidad real del negocio.

No se implementarán pantallas únicamente porque existían en Excel.

El sistema será diseñado desde cero respetando únicamente las reglas del negocio.

---

# 7. Filosofía de desarrollo

El desarrollo seguirá un enfoque incremental.

Antes de escribir código se documentará completamente el dominio del negocio.

Cada nueva funcionalidad deberá estar respaldada por documentación previa.

No se permitirá implementar funcionalidades improvisadas.

Toda decisión deberá quedar registrada.

---

# 8. Estado actual del proyecto

Actualmente el proyecto se encuentra en fase de análisis funcional.

No existe código implementado.

La prioridad inicial consiste en comprender completamente el negocio.

Durante esta etapa se documentarán:

* Procesos
* Actores
* Reglas del negocio
* Casos de uso
* Entidades
* Arquitectura
* Roadmap

Solo después comenzará el desarrollo.

---

# 9. Alcance del sistema

El sistema permitirá administrar:

* Clientes.
* Operadores.
* Puntos de operación.
* Máquinas.
* Contadores.
* Recaudos.
* Premios.
* Netos.
* Ajustes.
* Conciliaciones.
* Liquidaciones.
* Evidencias fotográficas.
* Días de operación.
* Usuarios.
* Roles.
* Configuración tributaria.
* Configuración financiera.
* Históricos.
* Auditoría.

---

# 10. Qué NO hará el sistema

El sistema NO realizará reconocimiento OCR sobre las fotografías.

La decisión es completamente intencional.

Las fotografías suelen presentar:

* Baja resolución.
* Reflejos.
* Fotografías inclinadas.
* Contadores parcialmente visibles.
* Imágenes borrosas.

En la práctica, únicamente una persona con experiencia logra interpretar correctamente algunos valores.

Por esta razón la captura continuará siendo manual.

Sin embargo, el sistema optimizará completamente el resto del proceso.

---

# 11. Fuente de información

La información diaria proviene principalmente de fotografías enviadas mediante WhatsApp.

Cada fotografía corresponde normalmente a los contadores de una máquina.

El analista observa la imagen y registra manualmente los datos.

Posteriormente el sistema realizará automáticamente todos los cálculos derivados.

---

# 12. Actores principales

El sistema contempla inicialmente los siguientes perfiles.

## Presidente

Consulta indicadores estratégicos.

No modifica información.

---

## Gerente

Consulta la operación.

Aprueba cierres.

Consulta rentabilidad.

Analiza resultados.

---

## Analista

Es el principal usuario operativo.

Registra contadores.

Realiza conciliaciones.

Gestiona ajustes.

Genera liquidaciones.

Valida información.

---

## Delegado

Representa al cliente.

Participa en conciliaciones.

Aprueba diferencias.

Valida liquidaciones.

---

## Técnico

Registra indisponibilidades de máquinas.

Su información afecta los días cobrables.

---

## Contador

Obtiene información tributaria.

Genera facturación.

Consulta históricos.

---

## Administrador

Administra usuarios.

Configura parámetros.

Gestiona catálogos.

Controla permisos.

---

# 13. Principios del sistema

Toda la información deberá ser:

* Única.
* Consistente.
* Auditable.
* Histórica.
* Trazable.
* Parametrizable.

El sistema nunca deberá depender de conocimiento implícito.

Todo deberá quedar documentado.

---

# 14. Tecnologías seleccionadas

## Frontend

* React
* TypeScript
* Vite
* TailwindCSS
* shadcn/ui

---

## Backend

* Django
* Django REST Framework

---

## Base de datos

* PostgreSQL

---

## Control de versiones

* Git
* GitHub

---

## Despliegue

Inicialmente el sistema funcionará en un entorno local.

Docker, despliegue en producción e infraestructura cloud serán considerados en fases posteriores.

---

# 15. Principios técnicos

El sistema deberá cumplir los siguientes principios:

* Arquitectura modular.
* Código limpio.
* Principios SOLID.
* Separación por capas.
* Diseño orientado al dominio (DDD ligero).
* Componentes reutilizables.
* Escalabilidad.
* Mantenibilidad.
* Seguridad basada en roles.
* Auditoría completa.

---

# 16. Auditoría

Todas las acciones importantes deberán quedar registradas.

El sistema almacenará información como:

* Usuario.
* Fecha.
* Hora.
* Acción realizada.
* Valor anterior.
* Valor nuevo.
* Motivo del cambio.

Ningún cambio importante deberá perderse.

---

# 17. Seguridad

El acceso estará basado en autenticación y autorización mediante roles.

Cada usuario visualizará únicamente la información correspondiente a sus responsabilidades.

Las liquidaciones cerradas deberán quedar protegidas contra modificaciones no autorizadas.

---

# 18. Objetivo a largo plazo

El objetivo final es construir una plataforma empresarial moderna que reemplace completamente el ecosistema de archivos Excel utilizado actualmente.

El sistema deberá convertirse en la fuente oficial de información de la organización, permitiendo administrar la operación diaria, las conciliaciones, las liquidaciones, la facturación, los indicadores gerenciales y el histórico completo de la empresa.

---

# 19. Visión del proyecto

Más que desarrollar un software, este proyecto busca demostrar la capacidad de analizar un problema empresarial real, comprender sus reglas de negocio y transformarlas en una solución tecnológica escalable.

El desarrollo servirá además como proyecto principal de portafolio, evidenciando competencias en:

* Ingeniería de software.
* Análisis funcional.
* Diseño de bases de datos.
* Arquitectura de aplicaciones.
* Desarrollo Full Stack.
* Modelado de procesos.
* Gestión documental.
* Trazabilidad de información.
* Automatización de procesos empresariales.

---

# 20. Regla principal del proyecto

Antes de implementar cualquier funcionalidad deberá responderse una única pregunta:

> **¿Esta funcionalidad resuelve un problema real del negocio?**

Si la respuesta es **no**, dicha funcionalidad no deberá implementarse.

El negocio será siempre la prioridad por encima de la tecnología.

---

# 21. Declaración final

Este documento constituye la base conceptual del proyecto.

Toda modificación importante del sistema deberá reflejarse primero en la documentación antes de realizar cambios en el código fuente.

La documentación será considerada la fuente oficial de verdad del proyecto y deberá evolucionar junto con el software durante todo su ciclo de vida.
