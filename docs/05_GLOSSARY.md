# 05_GLOSSARY.md

# Glosario del Negocio

**Proyecto:** Athena ERP *(Nombre temporal)*

**Versión:** 0.1

**Estado:** Glosario funcional

---

# 1. Introducción

Este documento reúne la terminología utilizada dentro del negocio y del sistema.

Su propósito es garantizar que desarrolladores, analistas, gerencia y futuros colaboradores utilicen un mismo lenguaje durante todo el proyecto.

Cuando un término aparezca en la documentación funcional, técnica o en la base de datos, deberá interpretarse de acuerdo con las definiciones establecidas en este documento.

---

# A

## Administrador

Usuario encargado de configurar el sistema.

Tiene acceso a parámetros, usuarios, roles, permisos y configuraciones generales.

No participa en la operación diaria.

---

## Ajuste

Modificación realizada sobre un cálculo previamente generado.

Los ajustes pueden originarse por:

- Conciliaciones.
- Errores de digitación.
- Reinicios.
- Fotografías incorrectas.
- Diferencias encontradas con el cliente.

Todo ajuste debe quedar auditado.

---

## Auditoría

Registro histórico de todas las acciones realizadas dentro del sistema.

Permite conocer:

- Quién realizó una acción.
- Cuándo.
- Qué modificó.
- Por qué lo hizo.

---

# B

## Backup

Copia de seguridad de la base de datos y archivos del sistema.

Su objetivo es garantizar la recuperación de la información en caso de fallas.

---

## Base de Datos

Repositorio único donde se almacenará toda la información del sistema.

Reemplaza completamente el uso de múltiples archivos Excel.

---

# C

## Captura

Proceso mediante el cual el analista registra los contadores observados en las fotografías enviadas por WhatsApp.

La captura no realiza cálculos.

Únicamente registra información.

---

## Cliente

Empresa u operador propietario de un conjunto de máquinas administradas por la compañía.

Ejemplos:

- Facilísimo
- Sured
- Serviwin
- La Perla
- Betred

Cada cliente posee uno o varios puntos de operación.

---

## Conciliación

Proceso de comparación entre la información registrada por el analista y los registros del delegado del cliente.

Su objetivo es validar que ambas partes trabajen con los mismos valores antes del cierre del período.

---

## Contador

Usuario encargado de generar la documentación tributaria y financiera utilizando la información aprobada.

---

## Contador acumulativo

Valor mostrado por la máquina que aumenta continuamente con el tiempo.

Nunca representa el recaudo del período.

Debe compararse contra el contador anterior para obtener la producción real.

---

## Contador de ingresos

Contador acumulativo que registra todo el dinero ingresado a la máquina.

---

## Contador de premios

Contador acumulativo que registra todo el dinero entregado en premios.

---

## CPU

Componente interno de la máquina encargado de almacenar información operativa.

Su reemplazo puede ocasionar reinicios de contadores.

---

# D

## Dashboard

Panel gráfico que resume la información del sistema mediante indicadores.

Cada actor visualizará un dashboard diferente según sus funciones.

---

## Delegado

Representante del cliente encargado de validar la información durante las conciliaciones.

---

## Días de operación

Cantidad de días durante los cuales una máquina estuvo realmente disponible para operar.

Este dato afecta el cálculo de impuestos y fees.

---

# E

## Estado

Condición actual de un registro dentro del sistema.

Ejemplos:

- Pendiente.
- Validado.
- Conciliado.
- Cerrado.

---

## Evidencia

Fotografía utilizada como soporte de un contador o de un ajuste.

El sistema conservará principalmente la fotografía inicial y final de cada período.

---

# F

## Facturación

Proceso contable realizado después del cierre mensual utilizando la información aprobada.

---

## Fee

Cobro fijo asociado a la operación de una máquina.

Su valor puede depender de:

- Días de operación.
- Configuración vigente.
- Tipo de máquina.

Será completamente parametrizable.

---

## Fotografía inicial

Primera evidencia del período utilizada como referencia.

---

## Fotografía final

Última evidencia del período utilizada durante la conciliación.

---

# G

## Gerente

Usuario encargado de supervisar la operación diaria y aprobar los cierres mensuales.

---

## Grupo de WhatsApp

Medio utilizado actualmente para recibir las fotografías de los contadores.

El sistema no reemplazará este mecanismo durante la primera versión.

---

# H

## Histórico

Conjunto de registros almacenados permanentemente.

Permite consultar cualquier período anterior sin depender de archivos externos.

---

# I

## Impuesto Coljuegos

Impuesto aplicado sobre la operación de las máquinas electrónicas.

Su porcentaje será parametrizable.

---

## Informe

Documento generado automáticamente por el sistema que resume la información de un período determinado.

Puede estar dirigido al gerente, presidente, cliente o contador.

---

## IVA

Impuesto aplicado según la normatividad vigente.

Será parametrizado para permitir cambios futuros.

---

# L

## Liquidación

Proceso mediante el cual el sistema calcula el valor económico definitivo correspondiente a un cliente durante un período.

Incluye:

- Neto.
- Participaciones.
- Impuestos.
- Fees.
- Valor final.

---

# M

## Máquina

Unidad física instalada en un punto de operación.

Cada máquina posee:

- Identificador.
- Tipo.
- Cliente.
- Punto.
- Estado.
- Historial.

Representa la entidad principal del negocio.

---

## Mantenimiento

Actividad realizada por el técnico para reparar o intervenir una máquina.

Puede afectar los días de operación.

---

## Movimiento

Registro relacionado con la instalación, traslado o retiro de una máquina.

---

# N

## Neto

Resultado obtenido después de restar los premios al recaudo y aplicar los ajustes correspondientes.

Fórmula general.

Neto = Recaudo - Premios + Ajustes

---

# O

## Observación

Comentario registrado por un usuario para explicar una situación particular.

Ejemplos.

- Contador ilegible.
- Reinicio.
- Fotografía tardía.
- Ajuste aprobado.

---

## Operador

Empresa propietaria o administradora de un conjunto de máquinas.

En el negocio normalmente se utiliza como sinónimo de Cliente.

---

# P

## Participación

Porcentaje del monto liquidado que corresponde al operador.

Cada cliente puede tener un porcentaje diferente.

Será parametrizable.

---

## Período

Intervalo de tiempo sobre el cual se realizan los cálculos.

Normalmente corresponde a un mes calendario.

---

## Presidente

Usuario encargado únicamente del análisis estratégico del negocio.

No modifica información.

---

## Premio

Dinero entregado por la máquina a los jugadores durante un período.

---

## Punto

Establecimiento comercial donde se encuentran instaladas una o varias máquinas.

Ejemplos.

- Tiendas.
- Casinos.
- Locales comerciales.

Cada punto pertenece a un cliente.

---

# R

## Reapertura

Proceso mediante el cual un período previamente cerrado vuelve a habilitarse para realizar una corrección.

Toda reapertura deberá quedar auditada.

---

## Recaudo

Dinero ingresado durante un período.

Se calcula mediante la diferencia entre dos contadores acumulativos.

---

## Reinicio

Proceso mediante el cual una máquina pierde sus contadores acumulados.

Puede deberse a:

- Cambio de CPU.
- Daño.
- Mantenimiento.
- Bajón eléctrico.
- Borrado manual.

---

## Rentabilidad

Indicador económico que mide el beneficio generado por una máquina, punto o cliente.

---

# S

## Sistema

Athena ERP.

Plataforma encargada de centralizar toda la operación del negocio.

---

## Serial

Identificador único de una máquina.

Permite reconocerla independientemente del punto donde se encuentre instalada.

---

# T

## Técnico

Usuario encargado de registrar novedades relacionadas con el funcionamiento físico de las máquinas.

---

## Tipo de máquina

Clasificación tecnológica utilizada por la empresa.

Ejemplos.

- PMV Roja.
- Silver.
- R Franco.

Cada tipo puede tener configuraciones particulares.

---

# U

## UVT

Unidad de Valor Tributario utilizada como referencia para determinados cálculos fiscales.

Será parametrizable para cada período.

---

# V

## Validación

Proceso automático mediante el cual el sistema verifica la consistencia de la información capturada.

---

## Versión

Estado evolutivo del sistema o de un documento.

Ejemplo.

Versión 0.1

---

# W

## WhatsApp

Canal de comunicación utilizado actualmente para recibir las fotografías de los contadores.

Aunque no hace parte del sistema, constituye el origen principal de la información operativa.

---

# 2. Convenciones generales

Durante todo el proyecto se aplicarán las siguientes convenciones.

- Los nombres de entidades se escribirán en singular.
- Los nombres técnicos estarán en inglés cuando correspondan a clases, tablas o código fuente.
- Los términos propios del negocio permanecerán en español.
- Las abreviaturas deberán documentarse antes de ser utilizadas.

---

# 3. Abreviaturas utilizadas

| Abreviatura | Significado |
|-------------|------------|
| CPU | Unidad Central de Procesamiento de la máquina |
| ERP | Enterprise Resource Planning |
| IVA | Impuesto sobre el Valor Agregado |
| UVT | Unidad de Valor Tributario |
| OCR | Reconocimiento Óptico de Caracteres |
| API | Interfaz de Programación de Aplicaciones |
| DB | Base de Datos |
| UI | Interfaz de Usuario |
| UX | Experiencia de Usuario |

---

# 4. Conclusión

El presente glosario constituye la referencia oficial de la terminología utilizada dentro del proyecto Athena ERP.

Cualquier nuevo concepto incorporado durante el desarrollo deberá añadirse a este documento para mantener un lenguaje uniforme entre el negocio, la documentación y el software.

Este archivo deberá mantenerse actualizado durante todo el ciclo de vida del proyecto.