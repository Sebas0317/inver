# 06_BUSINESS_RULES.md

# Reglas de Negocio

**Proyecto:** Athena ERP *(Nombre temporal)*

**Versión:** 0.1

**Estado:** Documento funcional

---

# 1. Introducción

Este documento define todas las reglas que gobiernan el funcionamiento del negocio.

Una regla de negocio representa una condición, restricción o comportamiento que el sistema deberá cumplir obligatoriamente.

Estas reglas son independientes de la tecnología utilizada.

No pertenecen al frontend.

No pertenecen al backend.

No pertenecen a la base de datos.

Pertenecen al negocio.

Si alguna regla cambia, el sistema deberá adaptarse sin modificar la lógica principal de la aplicación.

---

# 2. Principios generales

Antes de definir reglas específicas, el sistema deberá respetar los siguientes principios.

## BR-001
La Base de Datos será la única fuente oficial de información.

Ningún archivo Excel será considerado fuente oficial.

---

## BR-002

Toda información deberá registrarse una sola vez.

Nunca deberán existir copias manuales entre módulos.

---

## BR-003

Todo cálculo deberá realizarse automáticamente.

El usuario únicamente registrará información.

Nunca realizará operaciones matemáticas manuales.

---

## BR-004

Toda modificación importante deberá quedar auditada.

---

## BR-005

Ningún dato histórico podrá eliminarse físicamente.

Las eliminaciones serán lógicas.

---

## BR-006

Todo proceso importante deberá poder reconstruirse históricamente.

---

## BR-007

Los parámetros financieros deberán configurarse desde el sistema.

Nunca estarán escritos directamente en el código.

---

# 3. Reglas sobre usuarios

## BR-100

Todo usuario deberá autenticarse.

---

## BR-101

Todo usuario tendrá un rol.

---

## BR-102

Un usuario podrá tener uno o varios roles.

---

## BR-103

Cada acción dependerá de los permisos del usuario.

---

## BR-104

Un usuario únicamente visualizará la información autorizada para su rol.

---

## BR-105

Todo inicio de sesión deberá quedar registrado.

---

## BR-106

Todo cierre de sesión deberá quedar registrado.

---

# 4. Reglas sobre clientes

## BR-200

Todo cliente deberá poseer un nombre único.

---

## BR-201

Todo cliente deberá encontrarse activo o inactivo.

Nunca será eliminado físicamente.

---

## BR-202

Todo cliente podrá tener múltiples puntos.

---

## BR-203

Todo cliente podrá tener múltiples máquinas.

---

## BR-204

Cada cliente tendrá un porcentaje de participación.

Este porcentaje será parametrizable.

---

## BR-205

Los porcentajes históricos deberán conservarse.

Cambiar el porcentaje de hoy no modificará liquidaciones anteriores.

---

# 5. Reglas sobre puntos

## BR-300

Todo punto pertenecerá a un único cliente.

---

## BR-301

Un punto podrá contener una o varias máquinas.

---

## BR-302

El nombre del punto deberá ser único dentro del cliente.

---

## BR-303

El historial del punto nunca deberá perderse.

---

## BR-304

Un punto podrá cambiar de estado.

Estados permitidos.

- Activo
- Suspendido
- Cerrado

---

# 6. Reglas sobre máquinas

## BR-400

Toda máquina tendrá un identificador único.

---

## BR-401

Toda máquina pertenecerá a un cliente.

---

## BR-402

Toda máquina pertenecerá a un punto.

---

## BR-403

Toda máquina tendrá un tipo.

Ejemplos.

- PMV Roja
- Silver
- R Franco

---

## BR-404

Una máquina podrá cambiar de punto.

El historial deberá conservarse.

---

## BR-405

Una máquina podrá cambiar de cliente.

El historial deberá conservarse.

---

## BR-406

Toda máquina tendrá un estado.

Estados posibles.

- Activa
- En mantenimiento
- Fuera de servicio
- Retirada

---

## BR-407

Una máquina nunca será eliminada.

---

## BR-408

Toda máquina conservará permanentemente su historial de movimientos.

---

# 7. Reglas sobre captura de información

## BR-500

Los contadores serán registrados manualmente.

---

## BR-501

No se utilizará OCR.

---

## BR-502

La captura únicamente registrará información observada.

No realizará cálculos.

---

## BR-503

Toda captura deberá asociarse a:

- Cliente
- Punto
- Máquina
- Fecha
- Usuario

---

## BR-504

Una captura podrá contener observaciones.

---

## BR-505

No podrán existir dos capturas iguales para la misma máquina y la misma fecha.

---

## BR-506

Toda captura tendrá un estado.

- Pendiente
- Validada
- Observada
- Conciliada
- Cerrada

---

# 8. Reglas sobre contadores

## BR-600

Los contadores serán acumulativos.

---

## BR-601

El recaudo nunca será igual al contador.

Será la diferencia entre dos contadores.

---

## BR-602

Los premios también serán acumulativos.

---

## BR-603

El neto será calculado automáticamente.

Neto = Recaudo - Premios + Ajustes

---

## BR-604

Los cálculos nunca serán realizados por el usuario.

---

## BR-605

El sistema conservará el contador anterior utilizado para cada cálculo.

---

## BR-606

Todo cálculo deberá ser reproducible históricamente.

---

# 9. Reglas sobre fotografías

## BR-700

Las fotografías constituyen evidencia.

---

## BR-701

Las fotografías diarias no serán almacenadas permanentemente.

---

## BR-702

Únicamente se conservarán como evidencia:

- Fotografía inicial.
- Fotografía final.

---

## BR-703

Una fotografía podrá asociarse a:

- Captura
- Ajuste
- Reinicio
- Conciliación

---

## BR-704

Una fotografía nunca reemplazará un dato registrado.

Únicamente actuará como soporte documental.

---

# 10. Conclusión de la primera parte

Las reglas definidas en este documento representan el comportamiento obligatorio del sistema.

Ninguna funcionalidad podrá implementarse ignorando estas reglas.

En las siguientes secciones se documentarán las reglas relacionadas con:

- Reinicios.
- Bajones eléctricos.
- Días de operación.
- Liquidaciones.
- Conciliaciones.
- Impuestos.
- Fee.
- Auditoría.
- Dashboards.
- Estados.
- Reaperturas.
- Cierre mensual.

# 11. Reglas sobre reinicios de máquinas

Los reinicios de contadores representan uno de los casos más importantes del negocio.

El sistema deberá tratarlos de forma especial para evitar pérdidas de información.

---

## BR-800

El sistema permitirá registrar reinicios de contadores.

---

## BR-801

Todo reinicio deberá tener una causa.

Causas permitidas inicialmente:

- Cambio de CPU.
- Bajón eléctrico.
- Borrado manual.
- Mantenimiento.
- Error de hardware.
- Otro.

---

## BR-802

Todo reinicio deberá quedar asociado a una máquina.

---

## BR-803

Todo reinicio deberá almacenar:

- Fecha.
- Hora.
- Usuario.
- Motivo.
- Observaciones.

---

## BR-804

El sistema nunca eliminará el historial anterior al reinicio.

---

## BR-805

El contador posterior al reinicio iniciará un nuevo ciclo de acumulación.

---

## BR-806

Cuando exista evidencia fotográfica previa al reinicio deberá asociarse al evento.

---

## BR-807

Los cálculos históricos deberán conservar la continuidad económica.

---

# 12. Reglas sobre ajustes

Los ajustes representan modificaciones aprobadas sobre información previamente registrada.

---

## BR-900

Todo ajuste deberá estar justificado.

---

## BR-901

Todo ajuste deberá registrar un motivo.

---

## BR-902

Todo ajuste almacenará:

- Valor original.
- Valor corregido.
- Fecha.
- Usuario.
- Observaciones.

---

## BR-903

El valor original nunca será eliminado.

---

## BR-904

Los ajustes únicamente podrán realizarse antes del cierre o mediante una reapertura autorizada.

---

## BR-905

Todo ajuste quedará registrado en la auditoría.

---

## BR-906

Los ajustes podrán afectar:

- Recaudo.
- Premios.
- Neto.
- Participación.
- Impuestos.

---

# 13. Reglas sobre conciliaciones

La conciliación constituye el proceso oficial de validación entre la empresa y el cliente.

---

## BR-1000

Toda conciliación pertenecerá a un único período.

---

## BR-1001

Una conciliación deberá asociarse a un cliente.

---

## BR-1002

Toda conciliación tendrá un responsable.

---

## BR-1003

Una conciliación podrá contener múltiples máquinas.

---

## BR-1004

Cada máquina tendrá su propio estado dentro de la conciliación.

---

## BR-1005

No podrá cerrarse una conciliación mientras existan diferencias pendientes.

---

## BR-1006

Las diferencias deberán registrarse individualmente.

---

## BR-1007

Toda diferencia tendrá un motivo.

---

## BR-1008

Toda diferencia podrá contener observaciones.

---

## BR-1009

Toda conciliación podrá almacenar documentos de soporte.

---

## BR-1010

Una conciliación podrá quedar en estado:

- Pendiente.
- En revisión.
- Conciliada.
- Aprobada.
- Cerrada.

---

# 14. Reglas sobre días de operación

---

## BR-1100

Toda máquina tendrá un calendario de operación.

---

## BR-1101

Cada día deberá registrar un estado.

---

Estados posibles.

- Operativa.
- Dañada.
- Suspendida.
- Trasladada.
- En mantenimiento.
- Sin información.

---

## BR-1102

Los días de operación afectarán el cálculo del Fee.

---

## BR-1103

Los días de operación podrán afectar determinados impuestos.

---

## BR-1104

El técnico será el responsable principal de registrar estas novedades.

---

## BR-1105

El analista podrá consultar esta información pero no modificarla.

---

## BR-1106

Toda modificación deberá quedar auditada.

---

# 15. Reglas sobre liquidaciones

---

## BR-1200

Toda liquidación pertenecerá a un único cliente.

---

## BR-1201

Toda liquidación corresponderá a un único período.

---

## BR-1202

Una liquidación únicamente podrá generarse cuando la conciliación haya finalizado.

---

## BR-1203

Toda liquidación utilizará los parámetros vigentes durante ese período.

---

## BR-1204

La modificación futura de un impuesto no alterará liquidaciones históricas.

---

## BR-1205

Una liquidación calculará automáticamente.

- Recaudo.
- Premios.
- Neto.
- Participación.
- Coljuegos.
- Administración.
- IVA.
- Fee.
- Valor final.

---

## BR-1206

El usuario nunca ingresará manualmente estos cálculos.

---

## BR-1207

Toda liquidación podrá regenerarse antes del cierre.

---

## BR-1208

Después del cierre únicamente podrá recalcularse mediante reapertura autorizada.

---

# 16. Reglas sobre impuestos

---

## BR-1300

Los impuestos serán completamente parametrizables.

---

## BR-1301

Cada período almacenará sus propios parámetros tributarios.

---

## BR-1302

Los impuestos históricos nunca cambiarán automáticamente.

---

## BR-1303

El valor de la UVT será parametrizable.

---

## BR-1304

El porcentaje de IVA será parametrizable.

---

## BR-1305

El porcentaje de Coljuegos será parametrizable.

---

## BR-1306

Los porcentajes podrán tener fecha de vigencia.

---

## BR-1307

El sistema deberá conservar todas las versiones de configuración tributaria.

---

# 17. Reglas sobre Fee

---

## BR-1400

El Fee será completamente parametrizable.

---

## BR-1401

El Fee podrá depender del tipo de máquina.

---

## BR-1402

El Fee podrá depender del cliente.

---

## BR-1403

El Fee podrá depender de los días de operación.

---

## BR-1404

El Fee histórico permanecerá inalterable.

---

## BR-1405

Todo cambio en el Fee generará una nueva versión de configuración.

---

# 18. Reglas sobre participación

---

## BR-1500

Cada cliente tendrá un porcentaje de participación.

---

## BR-1501

Los porcentajes podrán modificarse únicamente por usuarios autorizados.

---

## BR-1502

Los porcentajes históricos permanecerán inalterables.

---

## BR-1503

La participación se calculará automáticamente durante la liquidación.

---

## BR-1504

Los porcentajes podrán tener fecha de inicio y fecha de finalización.

---

# 19. Reglas sobre estados

Todo proceso importante tendrá un ciclo de vida.

---

## BR-1600

Los estados deberán respetar una transición válida.

---

Ejemplo.

Pendiente

↓

Validado

↓

Conciliado

↓

Aprobado

↓

Cerrado

---

## BR-1601

No será posible saltar estados sin autorización.

---

## BR-1602

Toda transición quedará registrada.

---

## BR-1603

Toda transición registrará:

- Usuario.
- Fecha.
- Estado anterior.
- Estado nuevo.
- Observaciones.

---

# 20. Conclusión de la segunda parte

Las reglas definidas hasta este punto gobiernan el núcleo financiero y operativo del negocio.

Son las responsables de garantizar que los cálculos, conciliaciones, liquidaciones y configuraciones tributarias se ejecuten de forma consistente y reproducible.

# 21. Reglas sobre cierre de períodos

El cierre de un período representa la aprobación oficial de toda la información correspondiente a un mes.

A partir de este momento los datos adquieren carácter histórico.

---

## BR-1700

Todo período deberá encontrarse asociado a un mes y un año.

---

## BR-1701

Solo podrán cerrarse períodos cuya conciliación haya sido finalizada.

---

## BR-1702

Todo período deberá tener un estado.

Estados permitidos.

- Abierto.
- En conciliación.
- Pendiente de aprobación.
- Cerrado.
- Reabierto.

---

## BR-1703

Una vez cerrado un período no podrán modificarse:

- Capturas.
- Recaudos.
- Premios.
- Neto.
- Impuestos.
- Participaciones.
- Fees.

---

## BR-1704

El sistema conservará la fecha exacta del cierre.

---

## BR-1705

El sistema almacenará el usuario responsable del cierre.

---

## BR-1706

Todo cierre generará un registro de auditoría.

---

# 22. Reglas sobre reapertura

Aunque el cierre protege la integridad histórica, pueden existir situaciones excepcionales donde sea necesario modificar un período ya cerrado.

---

## BR-1800

Solo usuarios autorizados podrán reabrir un período.

---

## BR-1801

Toda reapertura deberá tener un motivo obligatorio.

---

## BR-1802

Toda reapertura deberá registrar.

- Usuario.
- Fecha.
- Hora.
- Motivo.
- Observaciones.

---

## BR-1803

Una reapertura nunca eliminará el historial del cierre anterior.

---

## BR-1804

Al volver a cerrar el período se generará una nueva versión de la liquidación.

---

## BR-1805

El sistema deberá conservar todas las versiones históricas.

---

# 23. Reglas sobre auditoría

La auditoría constituye uno de los componentes más importantes del sistema.

Todo evento relevante deberá quedar registrado.

---

## BR-1900

Toda acción importante generará un evento de auditoría.

---

## BR-1901

Cada evento almacenará.

- Usuario.
- Fecha.
- Hora.
- Acción.
- Módulo.
- Registro afectado.

---

## BR-1902

Cuando exista modificación también deberá registrarse.

- Valor anterior.
- Valor nuevo.

---

## BR-1903

La auditoría nunca podrá modificarse.

---

## BR-1904

La auditoría nunca podrá eliminarse.

---

## BR-1905

La auditoría únicamente podrá consultarse por usuarios autorizados.

---

# 24. Reglas sobre seguridad

---

## BR-2000

Toda comunicación entre cliente y servidor deberá realizarse mediante HTTPS cuando el sistema sea desplegado.

---

## BR-2001

Las contraseñas nunca serán almacenadas en texto plano.

---

## BR-2002

Las contraseñas deberán almacenarse utilizando algoritmos de hash seguros.

---

## BR-2003

Toda sesión tendrá un tiempo máximo de inactividad.

---

## BR-2004

El sistema cerrará automáticamente sesiones expiradas.

---

## BR-2005

Todo intento fallido de autenticación quedará registrado.

---

## BR-2006

Después de múltiples intentos fallidos el usuario podrá ser bloqueado temporalmente.

---

# 25. Reglas sobre Dashboard

Los dashboards representan únicamente una visualización de información.

Nunca serán la fuente oficial de los datos.

---

## BR-2100

Toda información mostrada deberá provenir de la Base de Datos.

---

## BR-2101

Los indicadores deberán actualizarse automáticamente.

---

## BR-2102

Cada rol visualizará únicamente los indicadores correspondientes.

---

## BR-2103

Los indicadores deberán respetar los permisos del usuario.

---

## BR-2104

Los dashboards nunca almacenarán información propia.

---

# 26. Reglas sobre reportes

---

## BR-2200

Todo reporte deberá generarse utilizando información oficial.

---

## BR-2201

Los reportes respetarán los permisos del usuario.

---

## BR-2202

Toda exportación deberá indicar.

- Fecha de generación.
- Usuario.
- Período consultado.

---

## BR-2203

Los reportes podrán generarse en.

- PDF.
- Excel.
- CSV.

---

## BR-2204

Los reportes históricos deberán poder regenerarse en cualquier momento.

---

# 27. Reglas sobre respaldos

---

## BR-2300

El sistema deberá permitir respaldos automáticos.

---

## BR-2301

Los respaldos deberán incluir.

- Base de Datos.
- Evidencias fotográficas.
- Archivos adjuntos.

---

## BR-2302

Los respaldos no interrumpirán la operación del sistema.

---

## BR-2303

El sistema permitirá restaurar un respaldo autorizado.

---

## BR-2304

Toda restauración quedará auditada.

---

# 28. Reglas sobre notificaciones

---

## BR-2400

El sistema podrá generar notificaciones automáticas.

---

## BR-2401

Las notificaciones dependerán del rol.

---

## BR-2402

Ejemplos de notificaciones.

- Capturas pendientes.
- Conciliaciones pendientes.
- Liquidaciones pendientes.
- Máquinas sin fotografías.
- Máquinas fuera de servicio.
- Períodos próximos a cerrar.

---

## BR-2403

Las notificaciones nunca modificarán información.

---

# 29. Reglas sobre evidencias

---

## BR-2500

Toda evidencia deberá asociarse a un registro del sistema.

---

## BR-2501

Las evidencias podrán corresponder a.

- Fotografía inicial.
- Fotografía final.
- Ajustes.
- Reinicios.
- Conciliaciones.

---

## BR-2502

Las evidencias no podrán eliminarse mientras el período permanezca vigente.

---

## BR-2503

Cuando una evidencia sea reemplazada deberá conservarse el historial.

---

# 30. Reglas sobre integridad de la información

---

## BR-2600

Toda captura deberá pertenecer a una máquina existente.

---

## BR-2601

Toda máquina deberá pertenecer a un punto existente.

---

## BR-2602

Todo punto deberá pertenecer a un cliente existente.

---

## BR-2603

No podrán existir registros huérfanos.

---

## BR-2604

Toda relación deberá mantener integridad referencial.

---

## BR-2605

Las eliminaciones físicas estarán prohibidas para la información transaccional.

---

# 31. Reglas sobre versiones

---

## BR-2700

Toda configuración importante será versionada.

---

## BR-2701

Serán versionables.

- Impuestos.
- Fee.
- Participaciones.
- Parámetros tributarios.

---

## BR-2702

Las liquidaciones conservarán la versión utilizada para su cálculo.

---

## BR-2703

Una modificación futura nunca alterará los resultados históricos.

---

# 32. Reglas sobre el principio del sistema

Más allá de todas las reglas particulares, Athena ERP deberá respetar permanentemente los siguientes principios.

---

## BR-2800

La información se registra una sola vez.

---

## BR-2801

Toda operación debe ser trazable.

---

## BR-2802

Todo cálculo debe ser reproducible.

---

## BR-2803

Toda decisión importante debe quedar documentada.

---

## BR-2804

El histórico nunca se pierde.

---

## BR-2805

El sistema debe reflejar la realidad operativa del negocio.

---

## BR-2806

Las reglas de negocio siempre prevalecerán sobre la implementación técnica.

---

# 33. Conclusión

Las reglas definidas en este documento constituyen la base funcional de Athena ERP.

Cada módulo, cada pantalla, cada API y cada proceso automatizado deberá implementarse respetando estas reglas.

El objetivo de este documento no es únicamente servir como referencia para los desarrolladores, sino preservar el conocimiento del negocio y garantizar que la plataforma evolucione sin alterar la lógica operativa construida durante años de experiencia.

Toda nueva funcionalidad deberá analizarse primero desde la perspectiva de las reglas de negocio antes de ser desarrollada, asegurando que el sistema continúe siendo consistente, auditable, escalable y confiable.