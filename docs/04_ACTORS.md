# 04_ACTORS.md

# Actores del Sistema

**Proyecto:** Athena ERP *(Nombre temporal)*

**Versión:** 0.1

**Estado:** Definición funcional de actores

---

# 1. Introducción

Este documento define los actores que interactúan con el sistema, sus responsabilidades, permisos y el alcance de sus funciones.

Uno de los principales objetivos de Athena ERP consiste en separar claramente las responsabilidades de cada usuario, evitando que una sola persona tenga acceso total a toda la operación.

Cada actor visualizará únicamente la información necesaria para desempeñar su trabajo.

Esto permitirá mejorar la seguridad, la trazabilidad y el control del negocio.

---

# 2. Actores del negocio

El sistema estará conformado inicialmente por los siguientes perfiles.

- Administrador
- Presidente
- Gerente
- Analista
- Delegado
- Técnico
- Contador

En futuras versiones podrán incorporarse nuevos perfiles según las necesidades de la empresa.

---

# 3. Administrador

## Descripción

Es el usuario con mayor nivel de permisos dentro del sistema.

No participa en la operación diaria.

Su responsabilidad consiste en administrar la plataforma.

---

## Objetivos

- Configurar el sistema.
- Administrar usuarios.
- Crear roles.
- Parametrizar impuestos.
- Configurar porcentajes.
- Gestionar catálogos.
- Mantener la seguridad.

---

## Funciones

Puede:

- Crear usuarios.
- Editar usuarios.
- Desactivar usuarios.
- Crear clientes.
- Crear operadores.
- Crear puntos.
- Crear máquinas.
- Cambiar configuraciones.
- Modificar parámetros tributarios.
- Reabrir períodos cerrados.
- Consultar auditorías.
- Restaurar respaldos.

---

## Restricciones

No debería intervenir directamente en conciliaciones ni liquidaciones, salvo situaciones excepcionales.

---

# 4. Presidente

## Descripción

Representa el nivel estratégico de la organización.

No participa en actividades operativas.

No modifica información.

Su función principal consiste en supervisar el desempeño general del negocio.

---

## Objetivos

- Analizar resultados.
- Evaluar rentabilidad.
- Tomar decisiones estratégicas.

---

## Información disponible

- Dashboard ejecutivo.
- Rentabilidad global.
- Indicadores históricos.
- Comparativos mensuales.
- Comparativos anuales.
- Crecimiento por cliente.
- Producción general.
- Estado de la operación.

---

## Permisos

Puede:

- Consultar reportes.
- Exportar información.
- Consultar históricos.

No puede:

- Editar datos.
- Crear registros.
- Aprobar conciliaciones.
- Modificar liquidaciones.

---

# 5. Gerente

## Descripción

Es el responsable de supervisar toda la operación diaria.

Recibe los informes elaborados por el analista y verifica el correcto funcionamiento del negocio.

Tiene autoridad para aprobar cierres mensuales y autorizar reaperturas cuando sea necesario.

---

## Objetivos

- Supervisar la operación.
- Validar resultados.
- Aprobar liquidaciones.
- Monitorear indicadores.

---

## Funciones

Puede:

- Consultar todos los clientes.
- Consultar todos los puntos.
- Consultar todas las máquinas.
- Revisar conciliaciones.
- Aprobar cierres.
- Autorizar ajustes.
- Autorizar reaperturas.
- Visualizar dashboards.

---

## No puede

- Registrar contadores.
- Modificar capturas.
- Cambiar configuraciones del sistema.

---

# 6. Analista

## Descripción

Es el usuario principal del sistema.

Toda la operación diaria gira alrededor de este perfil.

Representa el equivalente al antiguo proceso realizado mediante Excel.

---

## Objetivos

- Registrar contadores.
- Validar información.
- Detectar inconsistencias.
- Generar conciliaciones.
- Preparar liquidaciones.
- Elaborar informes.

---

## Funciones

Puede:

- Registrar capturas.
- Crear ajustes.
- Consultar fotografías.
- Registrar observaciones.
- Iniciar conciliaciones.
- Generar reportes.
- Consultar históricos.
- Cerrar capturas.
- Solicitar reapertura.

---

## No puede

- Cambiar porcentajes tributarios.
- Modificar usuarios.
- Crear roles.
- Eliminar históricos.

---

## Herramientas principales

El analista trabajará principalmente con:

- Dashboard operativo.
- Captura diaria.
- Gestión de máquinas.
- Gestión de conciliaciones.
- Liquidaciones.
- Reportes.

---

# 7. Delegado

## Descripción

Representa al cliente durante el proceso de conciliación.

No administra el sistema.

Su objetivo consiste en validar que la información registrada coincida con sus propios controles.

---

## Objetivos

- Revisar liquidaciones.
- Confirmar contadores.
- Aprobar conciliaciones.

---

## Funciones

Puede:

- Consultar únicamente su cliente.
- Revisar máquinas.
- Consultar fotografías.
- Aprobar conciliaciones.
- Registrar observaciones.

---

## Restricciones

No puede:

- Modificar contadores.
- Cambiar cálculos.
- Crear ajustes.
- Consultar otros clientes.

---

# 8. Técnico

## Descripción

Su participación es mínima pero muy importante.

Es responsable únicamente del estado operativo de las máquinas.

No interviene en información financiera.

---

## Objetivos

Registrar novedades técnicas.

---

## Funciones

Puede registrar:

- Máquina dañada.
- Cambio de CPU.
- Bajón eléctrico.
- Traslado.
- Retiro.
- Instalación.
- Mantenimiento.

También podrá registrar los días de operación de cada máquina.

---

## Restricciones

No puede:

- Ver liquidaciones.
- Registrar contadores.
- Ver impuestos.
- Ver rentabilidad.
- Consultar conciliaciones.

---

# 9. Contador

## Descripción

Utiliza la información una vez el período ha sido oficialmente cerrado.

No participa durante la operación diaria.

---

## Objetivos

Generar la documentación tributaria y financiera.

---

## Funciones

Puede consultar:

- Liquidaciones.
- Facturación.
- Históricos.
- Impuestos.
- Participaciones.
- Fees.
- Exportaciones.

---

## Restricciones

No puede modificar ninguna información.

---

# 10. Relación entre actores

```text
                PRESIDENTE
                     │
                     │
                 GERENTE
                     │
      ┌──────────────┼──────────────┐
      │              │              │
 ANALISTA        CONTADOR      ADMINISTRADOR
      │
      │
 ┌────┴────┐
 │         │
TÉCNICO  DELEGADO
```

Cada actor posee responsabilidades claramente diferenciadas.

---

# 11. Matriz de permisos

| Acción | Admin | Presidente | Gerente | Analista | Delegado | Técnico | Contador |
|---------|:----:|:----------:|:--------:|:---------:|:---------:|:--------:|:---------:|
| Ver Dashboard | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Registrar contadores | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Registrar novedades técnicas | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Consultar fotografías | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Crear ajustes | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Conciliar | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Aprobar cierre | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Reabrir período | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Parametrizar impuestos | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Exportar reportes | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Consultar históricos | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |

---

# 12. Flujo de interacción

El siguiente diagrama resume cómo interactúan los diferentes actores durante un ciclo mensual.

```text
                    TÉCNICO
                        │
                        ▼
             Registra días de operación
                        │
                        ▼
ANALISTA ─────────► Captura contadores
                        │
                        ▼
               Validación automática
                        │
                        ▼
              Generación de cálculos
                        │
                        ▼
             Conciliación con delegado
                        │
                (Aprobación conjunta)
                        │
                        ▼
                  GERENTE APRUEBA
                        │
                        ▼
             Sistema cierra el período
                        │
         ┌──────────────┴──────────────┐
         ▼                             ▼
   CONTADOR                    PRESIDENTE
 Facturación               Dashboard Ejecutivo
```

---

# 13. Principio de mínima responsabilidad

Uno de los principios fundamentales del sistema será el **Principio de Mínimo Privilegio**.

Cada usuario únicamente podrá realizar las acciones necesarias para cumplir sus funciones.

Esto reduce:

- Riesgo de errores.
- Riesgo de fraude.
- Riesgo de modificaciones accidentales.
- Dependencia de un único usuario.

---

# 14. Auditoría por usuario

Todas las acciones importantes quedarán registradas.

Cada registro almacenará:

- Usuario.
- Fecha.
- Hora.
- Dirección IP (opcional en futuras versiones).
- Acción realizada.
- Módulo.
- Valor anterior.
- Valor nuevo.
- Observaciones.

Esto permitirá reconstruir completamente cualquier modificación realizada en el sistema.

---

# 15. Conclusión

La correcta definición de los actores constituye uno de los pilares del sistema.

Cada perfil representa una responsabilidad específica dentro del negocio y refleja la estructura organizacional actual de la empresa.

Separar claramente las funciones permitirá construir una plataforma más segura, escalable y fácil de mantener, donde cada usuario tenga acceso únicamente a la información que realmente necesita para desempeñar su trabajo.