# 09_NON_FUNCTIONAL_REQUIREMENTS.md

# Requerimientos No Funcionales

**Proyecto:** Athena ERP *(Nombre temporal)*

**Versión:** 0.1

**Estado:** Especificación Técnica

---

# 1. Introducción

Este documento define los requerimientos no funcionales del sistema Athena ERP.

A diferencia de los requerimientos funcionales, estos no describen funcionalidades del negocio.

Definen las características de calidad que deberá cumplir el sistema durante todo su ciclo de vida.

Los requerimientos no funcionales condicionan la arquitectura, la infraestructura y las decisiones técnicas del proyecto.

---

# 2. Objetivos

Athena ERP deberá ser un sistema:

- Seguro.
- Escalable.
- Modular.
- Mantenible.
- Auditable.
- Parametrizable.
- Rápido.
- Confiable.

---

# 3. Convenciones

Cada requerimiento tendrá:

Código

Descripción

Categoría

Prioridad

Estado

---

# 4. Rendimiento (Performance)

## NFR-001

El sistema deberá cargar cualquier pantalla principal en menos de **2 segundos** en condiciones normales.

---

## NFR-002

Las búsquedas deberán responder en menos de **1 segundo** cuando existan índices adecuados.

---

## NFR-003

Los dashboards deberán cargar en menos de **5 segundos**.

---

## NFR-004

La generación de reportes PDF o Excel no deberá bloquear la interfaz.

---

## NFR-005

Las operaciones pesadas deberán ejecutarse de forma asíncrona cuando sea posible.

---

# 5. Escalabilidad

## NFR-100

El sistema deberá permitir agregar nuevos módulos sin modificar los existentes.

---

## NFR-101

La arquitectura deberá ser modular.

---

## NFR-102

Los componentes deberán ser reutilizables.

---

## NFR-103

El crecimiento de clientes, puntos y máquinas no deberá requerir cambios estructurales.

---

## NFR-104

El sistema deberá soportar millones de registros históricos.

---

# 6. Seguridad

## NFR-200

Toda autenticación deberá realizarse mediante JWT.

---

## NFR-201

Las contraseñas deberán almacenarse mediante algoritmos hash seguros (Argon2 o bcrypt).

---

## NFR-202

Toda comunicación deberá utilizar HTTPS en producción.

---

## NFR-203

El sistema deberá implementar control por roles y permisos.

---

## NFR-204

Todas las sesiones deberán expirar automáticamente tras un periodo de inactividad.

---

## NFR-205

Las acciones críticas deberán registrarse en auditoría.

---

# 7. Disponibilidad

## NFR-300

El sistema deberá poder utilizarse durante toda la jornada laboral.

---

## NFR-301

Los respaldos deberán permitir restaurar la información ante fallos.

---

## NFR-302

Los errores inesperados no deberán provocar pérdida de información.

---

# 8. Usabilidad

## NFR-400

La interfaz deberá ser intuitiva.

---

## NFR-401

El flujo de captura diaria deberá minimizar la cantidad de clics.

---

## NFR-402

Las pantallas deberán mantener un diseño consistente.

---

## NFR-403

Los formularios deberán validar la información antes de enviarla.

---

## NFR-404

Los mensajes de error deberán ser claros y comprensibles.

---

# 9. Accesibilidad

## NFR-500

La interfaz deberá ser usable con teclado.

---

## NFR-501

Los colores deberán mantener contraste suficiente.

---

## NFR-502

Los iconos deberán ir acompañados de texto cuando sea necesario.

---

# 10. Compatibilidad

## NFR-600

El sistema deberá funcionar correctamente en:

- Google Chrome
- Microsoft Edge
- Mozilla Firefox

---

## NFR-601

Inicialmente no será obligatorio optimizar para dispositivos móviles.

La prioridad será computadores de escritorio.

---

## NFR-602

El sistema deberá adaptarse correctamente a resoluciones Full HD y superiores.

---

# 11. Base de Datos

## NFR-700

Toda la información deberá almacenarse en PostgreSQL.

---

## NFR-701

Se utilizarán claves primarias UUID.

---

## NFR-702

Las relaciones deberán mantener integridad referencial.

---

## NFR-703

No se permitirá eliminar información histórica mediante DELETE físico.

---

## NFR-704

Las migraciones deberán ser versionadas.

---

# 12. Auditoría

## NFR-800

Toda modificación importante deberá quedar registrada.

---

## NFR-801

La auditoría será inmutable.

---

## NFR-802

Los registros de auditoría nunca serán eliminados.

---

# 13. Mantenibilidad

## NFR-900

El código deberá seguir una arquitectura por módulos.

---

## NFR-901

Cada módulo deberá ser independiente.

---

## NFR-902

Se utilizará TypeScript en el Frontend y Python en el Backend.

---

## NFR-903

El código deberá cumplir estándares de linting y formateo.

---

## NFR-904

Toda funcionalidad deberá estar documentada.

---

# 14. Calidad

## NFR-1000

Todo cambio deberá poder probarse de manera independiente.

---

## NFR-1001

El sistema deberá minimizar la duplicación de código.

---

## NFR-1002

Las reglas del negocio deberán centralizarse en el Backend.

---

## NFR-1003

El Frontend nunca contendrá lógica crítica del negocio.

---

# 15. Infraestructura

## NFR-1100

Todo el proyecto deberá ejecutarse mediante Docker.

---

## NFR-1101

El entorno de desarrollo deberá poder iniciarse con un solo comando.

```bash
docker compose up
```

---

## NFR-1102

Los entornos de desarrollo y producción deberán ser reproducibles.

---

## NFR-1103

La configuración deberá gestionarse mediante variables de entorno.

---

# 16. Respaldo

## NFR-1200

La Base de Datos deberá permitir respaldos automáticos.

---

## NFR-1201

El proceso de restauración deberá estar documentado.

---

## NFR-1202

Las evidencias fotográficas deberán incluirse en los respaldos.

---

# 17. Internacionalización

## NFR-1300

Inicialmente el idioma oficial será español.

---

## NFR-1301

La arquitectura permitirá agregar otros idiomas en versiones futuras.

---

# 18. Arquitectura

El sistema seguirá una arquitectura desacoplada.

Frontend

↓

API REST

↓

Backend

↓

PostgreSQL

---

Cada componente deberá poder evolucionar de manera independiente.

---

# 19. Tecnologías aprobadas

Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

Backend

- Django
- Django REST Framework
- Python

Base de Datos

- PostgreSQL

ORM

- Django ORM

Autenticación

- JWT

Contenedores

- Docker

Control de versiones

- Git

---

# 20. Restricciones

No utilizar Excel como fuente oficial.

No implementar OCR.

No almacenar lógica financiera en el Frontend.

No permitir modificaciones directas sobre datos históricos.

No depender de software propietario.

---

# 21. Criterios de aceptación

Todos los requerimientos no funcionales deberán verificarse antes del despliegue de una nueva versión.

Los criterios incluirán.

- Rendimiento.
- Seguridad.
- Auditoría.
- Integridad.
- Compatibilidad.
- Calidad del código.

---

# 22. Conclusión

Los requerimientos no funcionales definen la calidad técnica esperada para Athena ERP.

Aunque no representan funcionalidades visibles para el usuario, son fundamentales para garantizar que el sistema sea robusto, seguro, mantenible y preparado para crecer con el negocio.

Toda decisión de arquitectura deberá alinearse con los requerimientos establecidos en este documento.
