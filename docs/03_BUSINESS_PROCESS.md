# 03_BUSINESS_PROCESS.md

# Proceso de Negocio

**Proyecto:** Athena ERP *(Nombre temporal)*

**Versión:** 0.1

**Estado:** Análisis funcional

---

# 1. Introducción

Este documento describe detalladamente el funcionamiento operativo del negocio antes de la implementación del sistema y define el flujo que deberá seguir la nueva plataforma.

El objetivo principal es convertir un proceso que actualmente depende de archivos Excel, mensajes de WhatsApp y del conocimiento del analista en un flujo digital completamente estructurado, trazable y auditable.

Más que describir pantallas o funcionalidades, este documento explica **cómo funciona realmente la empresa**.

Toda funcionalidad desarrollada posteriormente deberá respetar este proceso o mejorarlo sin alterar las reglas del negocio.

---

# 2. Objetivo del proceso

El proceso tiene como finalidad determinar diariamente y mensualmente el comportamiento económico de todas las máquinas administradas por la empresa.

A partir de los contadores registrados en cada máquina se calculan:

- Recaudo
- Premios
- Neto
- Participación del operador
- Impuestos
- Fee
- Rentabilidad

Toda la información generada durante este proceso servirá posteriormente para:

- Liquidaciones.
- Conciliaciones.
- Facturación.
- Reportes gerenciales.
- Indicadores históricos.

---

# 3. Descripción general del negocio

La empresa administra máquinas electrónicas de entretenimiento ubicadas en diferentes establecimientos comerciales.

Cada máquina pertenece a un cliente (operador) y se encuentra instalada en un punto específico.

Ejemplo:

Cliente
↓
Facilísimo

↓

Punto

↓

Las Amapolas

↓

Máquinas

↓

032-0249

032-0250

032-0251

Cada máquina genera diariamente información económica mediante sus contadores internos.

Estos contadores representan la base de todos los cálculos financieros realizados por la empresa.

---

# 4. Actores involucrados en el proceso

Durante el flujo operativo participan diferentes actores.

## Analista

Es el actor principal.

Realiza:

- Captura de contadores.
- Validaciones.
- Conciliaciones.
- Ajustes.
- Liquidaciones.
- Cierre del período.

Toda la operación diaria depende inicialmente de este usuario.

---

## Técnico

Su función es registrar las novedades relacionadas con las máquinas.

Ejemplos:

- Máquina dañada.
- Cambio de CPU.
- Bajón eléctrico.
- Cambio de ubicación.
- Días fuera de servicio.

Su información afecta directamente las liquidaciones.

---

## Delegado del cliente

Representa al operador.

Durante el cierre mensual revisa junto con el analista los valores obtenidos.

En caso de existir diferencias se realiza una conciliación.

---

## Gerente

No modifica información.

Consulta:

- Informes diarios.
- Rentabilidad.
- Indicadores.
- Liquidaciones.

Además aprueba oficialmente los cierres.

---

## Presidente

Su participación es completamente estratégica.

Consulta únicamente información consolidada.

No interviene en la operación.

---

## Contador

Utiliza la información aprobada para:

- Facturación.
- Procesos tributarios.
- Declaraciones.
- Soportes contables.

---

## Administrador

Configura:

- Usuarios.
- Parámetros.
- Impuestos.
- Permisos.
- Catálogos.

---

# 5. Flujo general del negocio

De manera simplificada, el proceso completo puede representarse de la siguiente manera.

```text
Captura de fotografías

↓

Registro manual de contadores

↓

Validación

↓

Generación de cálculos

↓

Revisión del gerente

↓

Conciliación con el delegado

↓

Cierre de período

↓

Liquidación

↓

Facturación

↓

Histórico
```

Aunque parece un flujo sencillo, cada etapa posee múltiples reglas de negocio que serán descritas en este documento.

---

# 6. Ciclo operativo

El negocio trabaja mediante dos ciclos diferentes.

## Ciclo diario

Se realiza todos los días.

Su objetivo consiste en conocer el comportamiento operativo de cada máquina.

Incluye:

- Captura de fotografías.
- Registro de contadores.
- Cálculo diario.
- Informe gerencial.

---

## Ciclo mensual

Se realiza únicamente al finalizar el mes.

Incluye:

- Validación con el delegado.
- Ajustes.
- Conciliación.
- Cierre.
- Liquidación.
- Facturación.
- Archivo histórico.

Este proceso tiene mayor importancia ya que determina los valores oficiales del período.

---

# 7. Inicio del proceso diario

Cada día comienza cuando los responsables de los diferentes puntos toman fotografías de los contadores de las máquinas.

Estas fotografías muestran normalmente dos valores principales.

- Contador de ingresos (Recaudo)
- Contador de premios

Dependiendo del tipo de máquina pueden existir otros contadores adicionales.

Las fotografías son enviadas mediante grupos de WhatsApp organizados por cliente.

Ejemplo.

Grupo WhatsApp

↓

Cliente Facilísimo

↓

Punto Las Amapolas

↓

Fotografías de todas las máquinas

El sistema futuro no reemplazará este mecanismo de envío.

Simplemente administrará la información obtenida.

---

# 8. Recepción de la información

El analista revisa manualmente todas las fotografías recibidas.

Actualmente este proceso depende completamente de la experiencia del usuario.

El analista identifica rápidamente:

- Número de máquina.
- Punto.
- Cliente.
- Valor de recaudo.
- Valor de premios.
- Posibles inconsistencias.

No todas las fotografías presentan la misma calidad.

Por esta razón el proceso continúa siendo manual.

---

# 9. Captura manual de contadores

Una vez identificados los valores, el analista registra la información correspondiente.

Para cada máquina normalmente se registran:

- Fecha.
- Cliente.
- Punto.
- Máquina.
- Contador de recaudo.
- Contador de premios.
- Observaciones (si existen).

La captura constituye el único proceso manual obligatorio del sistema.

Todos los demás cálculos deberán ejecutarse automáticamente.

---

# 10. Filosofía de la captura

Es importante comprender que el analista **no está digitando dinero**.

Está registrando contadores acumulativos.

Ejemplo.

Mes anterior

Ingreso:

12.350.000

Mes actual

Ingreso:

12.870.000

El sistema calculará automáticamente que el recaudo del período corresponde a:

520.000

Por lo tanto, el usuario únicamente registra el contador observado.

Nunca realiza cálculos manuales.

---

# 11. Validación inicial

Después de registrar la información comienza una validación automática.

El sistema deberá verificar aspectos como:

- La máquina existe.
- Pertenece al cliente correcto.
- Pertenece al punto correcto.
- Los contadores tienen sentido.
- No existen duplicados.
- No hay fechas inconsistentes.
- No existe una captura previa para el mismo período.

Si alguna regla falla, el sistema deberá informar el problema antes de permitir continuar.

---

# 12. Resultado esperado de la primera etapa

Al finalizar esta etapa el sistema deberá contar con una captura diaria completamente organizada y validada.

Todavía no existirán liquidaciones ni conciliaciones.

Únicamente se habrá construido una base confiable sobre la cual podrán ejecutarse todos los procesos posteriores.

La siguiente sección del documento describirá cómo el sistema transforma estos contadores en información financiera, cómo detecta inconsistencias y cómo comienza el proceso de conciliación antes de llegar a la liquidación mensual.

# 13. Transformación de los contadores

Una vez que todos los contadores diarios han sido registrados y validados, comienza la etapa de transformación de la información.

En esta fase el sistema deja de trabajar únicamente con números acumulados y comienza a generar información financiera útil para la empresa.

La filosofía del sistema consiste en que el usuario únicamente captura información.

Todos los cálculos serán responsabilidad exclusiva del sistema.

---

# 14. Cálculo del recaudo

El recaudo representa el dinero ingresado durante el período analizado.

No corresponde al valor total mostrado por el contador.

Corresponde únicamente a la diferencia entre el contador anterior y el contador actual.

Ejemplo.

Contador anterior

Ingreso:
12.350.000

Contador actual

Ingreso:
12.870.000

Resultado

Recaudo:
520.000

El sistema nunca deberá interpretar el contador actual como el recaudo del período.

Siempre deberá calcular la diferencia.

---

# 15. Cálculo de premios

El procedimiento es exactamente igual al recaudo.

El contador de premios también es acumulativo.

Ejemplo.

Mes anterior

Premios:
8.400.000

Mes actual

Premios:
8.650.000

Premios del período

250.000

---

# 16. Cálculo del neto

El neto representa el dinero realmente producido por la máquina.

Su cálculo será:

Neto = Recaudo - Premios + Ajustes

Cuando no existan ajustes:

Neto = Recaudo - Premios

Ejemplo.

Recaudo

800.000

Premios

500.000

Neto

300.000

Este valor será la base para prácticamente todos los cálculos posteriores.

---

# 17. Contadores históricos

Una característica fundamental del negocio consiste en que los contadores nunca se reinician automáticamente al finalizar un mes.

Los contadores son históricos.

Ejemplo.

Enero

Ingreso

5.000.000

Febrero

6.200.000

Marzo

7.950.000

Abril

9.300.000

Cada nuevo período utiliza el último contador registrado como punto de partida.

Por esta razón el sistema deberá conservar el historial completo de cada máquina.

Nunca deberá reemplazar el contador anterior.

---

# 18. Detección de inconsistencias

Durante el procesamiento el sistema deberá identificar automáticamente posibles anomalías.

Entre ellas.

- Contador menor al registrado anteriormente.
- Diferencias excesivamente grandes.
- Contadores duplicados.
- Capturas repetidas.
- Máquina inexistente.
- Máquina asociada a otro cliente.
- Punto incorrecto.
- Fecha inválida.

Estas inconsistencias no necesariamente representan errores.

Simplemente deberán notificarse para revisión del analista.

---

# 19. Reinicio de contadores

Uno de los casos especiales más frecuentes consiste en el reinicio de una máquina.

Esto puede ocurrir por diferentes razones.

- Cambio de CPU.
- Reparación.
- Daño eléctrico.
- Mantenimiento.
- Borrado manual.
- Reinicio interno.

Cuando esto sucede, los contadores vuelven a cero.

El sistema deberá reconocer que esto no representa una pérdida de dinero.

Simplemente cambia el punto desde donde comenzará a contarse nuevamente.

---

# 20. Manejo de reinicios

Cuando una máquina sea reiniciada deberán registrarse dos eventos.

Primer evento.

Último contador antes del reinicio.

Segundo evento.

Nuevo contador después del reinicio.

Ejemplo.

Antes del reinicio

Ingreso

250.000

Después del reinicio

0

Posteriormente.

Nuevo contador

65.000

Al finalizar el mes el sistema calculará.

250.000

+

65.000

=

315.000

De esta forma nunca se perderá información.

---

# 21. Reinicio por bajón eléctrico

Existe un caso especial.

Algunas máquinas pueden perder los contadores debido a un bajón de energía.

Cuando esto ocurre normalmente existe una fotografía anterior donde aparece el último valor válido.

También puede existir un registro dentro del sistema interno de la máquina.

En estos casos el analista deberá registrar manualmente el valor correcto para mantener la continuidad del histórico.

El sistema deberá permitir esta corrección.

---

# 22. Reinicio programado

Cuando el reinicio es realizado intencionalmente por mantenimiento, el técnico o responsable normalmente envía una fotografía antes del borrado.

Esa fotografía constituye la evidencia oficial.

El sistema deberá permitir almacenar esa evidencia como soporte del ajuste realizado.

---

# 23. Ajustes manuales

Existen situaciones donde el valor calculado automáticamente debe modificarse.

Ejemplos.

- Diferencias detectadas durante conciliación.
- Errores del punto.
- Errores del operador.
- Contadores incorrectos.
- Información enviada posteriormente.

En estos casos el sistema permitirá registrar un ajuste.

Todo ajuste deberá almacenar.

- Valor original.
- Valor corregido.
- Usuario.
- Fecha.
- Motivo.
- Observaciones.

Los ajustes nunca deberán sobrescribir el histórico original.

---

# 24. Máquinas sin fotografía

Puede ocurrir que un punto no envíe fotografías.

Las razones pueden ser múltiples.

- El establecimiento no abrió.
- La persona olvidó enviarlas.
- Problemas de internet.
- Problemas del teléfono.

En estos casos el sistema deberá registrar la ausencia de información.

No deberá inventar contadores.

El analista decidirá posteriormente cómo resolver el caso.

---

# 25. Máquinas fuera de servicio

Una máquina puede permanecer apagada durante varios días.

Las causas pueden ser.

- Daño.
- Espera de repuestos.
- Cambio de CPU.
- Traslado.
- Mantenimiento.

Esta información será registrada por el técnico.

Posteriormente afectará el cálculo del fee y algunos impuestos.

---

# 26. Días de operación

Cada máquina posee un calendario de operación.

Para cada día el sistema deberá conocer si la máquina estuvo.

- Operativa.
- Dañada.
- En mantenimiento.
- Desinstalada.
- Sin información.

Este dato será utilizado durante las liquidaciones.

---

# 27. Registro del técnico

El técnico tendrá una participación sencilla dentro del sistema.

Su responsabilidad será únicamente registrar novedades relacionadas con la disponibilidad de las máquinas.

No tendrá acceso a cálculos financieros.

No modificará contadores.

No participará en conciliaciones.

Su información únicamente afectará los días cobrables.

---

# 28. Estado de una captura

Cada captura diaria podrá encontrarse en alguno de los siguientes estados.

Pendiente

La información fue registrada pero aún no validada.

Validada

La captura supera todas las verificaciones automáticas.

Observada

Existe alguna inconsistencia pendiente.

Conciliada

Fue utilizada durante la conciliación mensual.

Cerrada

Hace parte de un período oficialmente liquidado.

Estos estados permitirán conocer exactamente en qué etapa se encuentra cada registro.

---

# 29. Objetivo de esta etapa

Al finalizar esta segunda etapa el sistema ya deberá haber transformado simples contadores en información financiera organizada.

El resultado será una base consistente sobre la cual podrán realizarse conciliaciones, cierres mensuales y liquidaciones sin necesidad de recalcular manualmente la información.

En la siguiente sección se describirá el proceso de conciliación con el delegado, el cierre oficial del período, la generación de liquidaciones y el almacenamiento definitivo de la información histórica.

# 30. Conciliación mensual

La conciliación mensual constituye el proceso más importante de toda la operación.

Hasta este momento toda la información registrada corresponde a cálculos preliminares.

Los valores únicamente adquieren carácter oficial cuando son revisados y aprobados conjuntamente entre el analista y el delegado del cliente.

La conciliación garantiza que ambas partes trabajen con exactamente la misma información antes de proceder con la liquidación económica.

Una vez finalizada esta etapa, los valores se consideran definitivos para el período correspondiente.

---

# 31. Objetivo de la conciliación

La conciliación tiene como propósito confirmar que los contadores registrados por la empresa coincidan con los registros del cliente.

Durante este proceso pueden detectarse diferencias ocasionadas por:

- Fotografías enviadas fuera de tiempo.
- Errores de digitación.
- Reinicios no reportados.
- Contadores incorrectos.
- Cambios de CPU.
- Ajustes realizados por el cliente.
- Fotografías faltantes.
- Máquinas intervenidas.

La conciliación evita generar liquidaciones incorrectas.

---

# 32. Participantes

En la conciliación intervienen únicamente dos actores principales.

## Analista

Representa a la empresa.

Es responsable de presentar toda la información registrada durante el período.

---

## Delegado

Representa al cliente.

Es responsable de validar que la información coincida con los registros internos del operador.

---

# 33. Preparación de la conciliación

Antes de iniciar la reunión de conciliación el sistema deberá preparar automáticamente toda la información necesaria.

Entre ella.

Para cada máquina.

- Último contador del mes anterior.
- Último contador del mes actual.
- Recaudo.
- Premios.
- Neto.
- Ajustes registrados.
- Días de operación.
- Evidencias fotográficas del inicio del mes.
- Evidencias fotográficas del final del mes.

Toda esta información deberá encontrarse organizada para facilitar la revisión.

---

# 34. Evidencias fotográficas

Aunque diariamente las fotografías llegan por WhatsApp, el sistema únicamente conservará como evidencia permanente:

- Fotografía inicial del período.
- Fotografía final del período.

Estas imágenes permitirán resolver futuras diferencias sin necesidad de almacenar miles de fotografías innecesarias.

La decisión busca reducir el espacio de almacenamiento sin perder la trazabilidad del proceso.

---

# 35. Desarrollo de la conciliación

Durante la conciliación ambas partes revisan máquina por máquina.

Para cada una se comparan:

- Contadores.
- Recaudos.
- Premios.
- Neto.
- Observaciones.

Si toda la información coincide, la máquina queda conciliada.

Si existe alguna diferencia comienza el proceso de análisis.

---

# 36. Análisis de diferencias

Cuando aparecen diferencias el sistema deberá permitir registrar el motivo.

Ejemplos.

- Error de digitación.
- Fotografía enviada después.
- Reinicio no informado.
- Contador incorrecto.
- Error del operador.
- Error del punto.
- Error de comunicación.

Cada diferencia deberá quedar documentada.

---

# 37. Caso real de diferencia

Un ejemplo típico consiste en el siguiente escenario.

El analista registra correctamente un neto de:

$2.000.000

Sin embargo, durante la conciliación el delegado demuestra que una fotografía utilizada corresponde a una hora anterior al cierre del día.

Después de revisar la evidencia ambas partes acuerdan que el valor correcto debe ser:

$1.000.000

En este caso el sistema deberá:

- Conservar el cálculo original.
- Registrar el nuevo valor aprobado.
- Almacenar el motivo del cambio.
- Registrar quién autorizó el ajuste.
- Registrar la fecha.
- Registrar observaciones.

Nunca deberá eliminarse el cálculo inicial.

---

# 38. Diferencias trasladadas al siguiente período

Existen situaciones donde la diferencia económica no representa una pérdida definitiva.

Simplemente cambia el período donde será reconocida.

Ejemplo.

Durante el cierre de mayo se descuenta un millón de pesos debido a una diferencia identificada durante la conciliación.

Sin embargo, ese millón aparecerá naturalmente durante junio cuando los nuevos contadores sean registrados.

Por esta razón el sistema nunca deberá interpretar estos ajustes como pérdidas permanentes.

Simplemente modifican el período contable donde se reconoce el ingreso.

---

# 39. Ajustes aprobados

Una vez ambas partes llegan a un acuerdo el sistema generará un ajuste oficial.

Todo ajuste aprobado deberá contener.

- Valor anterior.
- Valor conciliado.
- Motivo.
- Usuario que realizó el cambio.
- Delegado que aprobó.
- Fecha.
- Hora.
- Observaciones.

El historial nunca podrá eliminarse.

---

# 40. Estado de conciliación

Cada máquina podrá encontrarse en uno de los siguientes estados.

Pendiente.

Aún no ha sido revisada.

---

En revisión.

Está siendo analizada durante la reunión.

---

Conciliada.

Ambas partes aceptan los valores.

---

Con diferencias.

Existen diferencias pendientes de resolver.

---

Ajustada.

Se modificaron valores como resultado de la conciliación.

---

Aprobada.

La máquina hace parte del cierre oficial.

---

# 41. Cierre del período

Cuando todas las máquinas de un cliente han sido conciliadas comienza el cierre mensual.

El cierre representa la aprobación oficial del período.

Después del cierre.

- No podrán modificarse contadores.
- No podrán modificarse recaudos.
- No podrán modificarse premios.
- No podrán modificarse netos.
- No podrán modificarse impuestos.

Cualquier cambio posterior deberá realizarse mediante un ajuste extraordinario completamente documentado.

---

# 42. Bloqueo del período

Una vez cerrado el período el sistema deberá bloquear automáticamente toda la información relacionada.

El objetivo es proteger la integridad del histórico.

Los usuarios únicamente podrán consultar la información.

No podrán modificarla.

---

# 43. Generación de la liquidación

Con el período oficialmente cerrado el sistema calculará automáticamente.

- Participación del operador.
- Impuesto Coljuegos.
- Administración.
- IVA.
- Fee.
- Total impuestos.
- Valor a liquidar.
- Neto de la empresa.

Todos estos cálculos utilizarán las parametrizaciones vigentes para ese período.

Esto permitirá mantener históricos incluso cuando los porcentajes cambien en el futuro.

---

# 44. Parametrización de impuestos

Los impuestos nunca deberán encontrarse escritos directamente dentro del código.

Cada período almacenará los parámetros utilizados.

Ejemplo.

- Valor UVT.
- IVA.
- Coljuegos.
- Fee mensual.
- Participación del operador.
- Administración.

De esta forma será posible reconstruir exactamente cualquier liquidación histórica.

---

# 45. Generación del informe

Después de finalizar la liquidación el sistema generará automáticamente los informes correspondientes.

Entre ellos.

- Informe del gerente.
- Liquidación por cliente.
- Resumen general.
- Información para el contador.
- Reportes históricos.

Todos los informes deberán generarse utilizando la misma fuente de información.

No existirán cálculos independientes para cada reporte.

---

# 46. Entrega al contador

El contador utilizará la información aprobada para elaborar.

- Facturas.
- Soportes tributarios.
- Documentación contable.
- Declaraciones.

Por esta razón únicamente tendrá acceso a períodos oficialmente cerrados.

Nunca trabajará con información preliminar.

---

# 47. Consolidación histórica

Finalizado el proceso el sistema archivará automáticamente toda la información del período.

No se copiarán datos entre diferentes archivos como ocurre actualmente.

Toda la información permanecerá en una única base de datos.

Será posible consultar cualquier período utilizando filtros simples.

---

# 48. Objetivo del cierre

Al finalizar esta etapa el sistema habrá convertido un conjunto de capturas diarias en una liquidación oficial, conciliada, auditada y protegida contra modificaciones no autorizadas.

A partir de este momento la información será considerada parte del histórico permanente de la empresa.

La siguiente sección del documento describirá los procesos posteriores al cierre, la explotación de la información mediante dashboards, las consultas históricas y los indicadores estratégicos que utilizarán la gerencia y la presidencia.

# 49. Consulta histórica

Una de las principales debilidades del proceso actual es la dificultad para consultar información histórica.

En el modelo actual es necesario abrir múltiples archivos de Excel correspondientes a diferentes meses para reconstruir el comportamiento de una máquina, un punto o un cliente.

El nuevo sistema eliminará completamente esta limitación.

Toda la información permanecerá almacenada en una única base de datos, permitiendo consultar cualquier período desde una sola interfaz.

---

# 50. Historial por máquina

Cada máquina tendrá su propia línea de tiempo.

Será posible visualizar:

- Fecha de instalación.
- Cliente actual.
- Clientes anteriores.
- Punto actual.
- Puntos anteriores.
- Contadores históricos.
- Recaudos.
- Premios.
- Neto.
- Ajustes.
- Reinicios.
- Cambios de CPU.
- Días fuera de servicio.
- Fotografías iniciales y finales.
- Liquidaciones asociadas.

La máquina será considerada una entidad histórica.

Nada de su información deberá perderse.

---

# 51. Historial por punto

Cada punto de operación contará con un historial consolidado.

Será posible consultar:

- Máquinas instaladas.
- Máquinas retiradas.
- Producción mensual.
- Producción anual.
- Rentabilidad.
- Días de operación.
- Tendencias.
- Comparativos entre meses.

Esto permitirá responder preguntas como:

- ¿Cuál fue el mejor mes del punto?
- ¿Cuál fue el peor?
- ¿Cuándo comenzaron las disminuciones de recaudo?
- ¿Qué máquinas generan mejores resultados?

---

# 52. Historial por cliente

Cada cliente tendrá una vista consolidada.

Incluyendo:

- Número de puntos.
- Número de máquinas.
- Recaudo acumulado.
- Premios acumulados.
- Neto acumulado.
- Participaciones.
- Impuestos.
- Fees.
- Rentabilidad histórica.

Será posible comparar diferentes períodos.

---

# 53. Dashboard gerencial

El gerente no necesita visualizar todos los movimientos individuales.

Su objetivo consiste en analizar el comportamiento del negocio.

Por esta razón el sistema ofrecerá un Dashboard Gerencial.

Este panel incluirá indicadores como:

- Recaudo del día.
- Neto del día.
- Comparación con el día anterior.
- Comparación mensual.
- Comparación anual.
- Cliente con mayor rentabilidad.
- Punto con mayor producción.
- Máquina con mayor recaudo.
- Máquinas sin reporte.
- Máquinas fuera de servicio.
- Liquidaciones pendientes.
- Conciliaciones pendientes.

Toda esta información deberá actualizarse automáticamente.

---

# 54. Dashboard presidencial

El presidente tendrá un tablero completamente diferente.

No visualizará información operativa.

Visualizará únicamente indicadores estratégicos.

Entre ellos.

- Rentabilidad global.
- Producción mensual.
- Crecimiento frente al año anterior.
- Participación por cliente.
- Participación por operador.
- Total de máquinas activas.
- Total de máquinas fuera de servicio.
- Tendencias.
- Comparativos históricos.

Su objetivo será apoyar la toma de decisiones.

---

# 55. Dashboard del analista

El analista tendrá el tablero más completo del sistema.

Desde allí podrá visualizar.

## Capturas pendientes

Máquinas que aún no poseen registro diario.

---

## Fotografías faltantes

Máquinas cuyos responsables no enviaron evidencia.

---

## Conciliaciones pendientes

Clientes que aún no han realizado conciliación.

---

## Liquidaciones pendientes

Períodos que aún no han sido cerrados.

---

## Observaciones

Capturas con inconsistencias.

---

## Máquinas reiniciadas

Equipos que requieren revisión especial.

---

## Máquinas fuera de servicio

Información registrada por el técnico.

---

## Alertas

El sistema notificará automáticamente eventos importantes.

---

# 56. Indicadores históricos

El sistema permitirá analizar tendencias mediante diferentes indicadores.

Ejemplos.

Rentabilidad por cliente.

Rentabilidad por punto.

Rentabilidad por máquina.

Variación mensual.

Variación anual.

Máquinas con mayor crecimiento.

Máquinas con menor producción.

Puntos con mayor estabilidad.

Promedio diario.

Promedio mensual.

Comparativos entre períodos.

Todos estos indicadores se calcularán automáticamente utilizando la información almacenada.

---

# 57. Exportación de información

Aunque el sistema reemplazará los archivos Excel como herramienta de trabajo, continuará permitiendo exportar información.

Los usuarios autorizados podrán generar archivos en formatos como:

- Excel.
- PDF.
- CSV.

Estas exportaciones tendrán únicamente fines de consulta o entrega de información.

Nunca serán la fuente oficial de los datos.

La fuente oficial siempre será la base de datos del sistema.

---

# 58. Respaldo de la información

Una de las principales ventajas del nuevo sistema será la protección de la información.

Actualmente existe riesgo de pérdida debido a:

- Daño del computador.
- Pérdida de archivos.
- Eliminación accidental.
- Daño del teléfono.
- Eliminación de conversaciones de WhatsApp.

El nuevo sistema deberá realizar respaldos periódicos de la base de datos.

Además permitirá conservar las evidencias fotográficas importantes del período.

---

# 59. Auditoría permanente

Todas las acciones importantes quedarán registradas automáticamente.

Entre ellas.

- Inicio de sesión.
- Registro de contadores.
- Ajustes.
- Conciliaciones.
- Reaperturas.
- Cierres.
- Eliminaciones lógicas.
- Cambios de configuración.
- Creación de usuarios.

Cada registro almacenará.

- Usuario.
- Fecha.
- Hora.
- Acción.
- Valor anterior.
- Valor nuevo.
- Motivo.

Esto permitirá reconstruir completamente cualquier evento ocurrido en el sistema.

---

# 60. Beneficios esperados

Con la implementación del sistema se espera obtener mejoras significativas.

## Operativas

- Menor tiempo de captura.
- Eliminación de copias entre archivos.
- Automatización de cálculos.
- Menor riesgo de errores.

---

## Administrativas

- Información centralizada.
- Consulta inmediata.
- Mejor control del negocio.
- Mayor trazabilidad.

---

## Financieras

- Liquidaciones más confiables.
- Menor riesgo tributario.
- Históricos completos.
- Mejor control de impuestos.

---

## Estratégicas

- Dashboards en tiempo real.
- Indicadores históricos.
- Análisis de tendencias.
- Identificación de oportunidades de mejora.

---

# 61. Flujo completo del negocio

El proceso completo podrá resumirse mediante el siguiente flujo.

```text
Fotografías enviadas por WhatsApp

↓

Captura manual por el analista

↓

Validación automática

↓

Cálculo de recaudo

↓

Cálculo de premios

↓

Cálculo del neto

↓

Detección de inconsistencias

↓

Registro de ajustes

↓

Conciliación con el delegado

↓

Aprobación

↓

Cierre del período

↓

Liquidación

↓

Generación de reportes

↓

Facturación

↓

Histórico

↓

Dashboards

↓

Análisis gerencial
```

---

# 62. Conclusión

El proceso documentado en este archivo representa el conocimiento operativo acumulado durante años de experiencia dentro del negocio.

La nueva plataforma no pretende modificar las reglas fundamentales de la operación, sino estructurarlas, automatizarlas y hacerlas sostenibles en el tiempo.

El mayor valor del sistema no será únicamente reducir el uso de Excel.

Su verdadero aporte consistirá en convertir un proceso altamente dependiente del conocimiento del analista en un sistema empresarial documentado, auditable, escalable y capaz de crecer junto con la organización.

A partir de este documento, todos los módulos del sistema deberán diseñarse respetando el flujo de negocio aquí definido. Cualquier modificación futura al proceso operativo deberá reflejarse primero en esta documentación antes de ser implementada en el software.