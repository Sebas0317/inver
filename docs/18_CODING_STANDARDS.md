# 18_CODING_STANDARDS.md

# Estándares de Desarrollo

**Proyecto:** Athena ERP *(Nombre temporal)*

**Versión:** 0.1

**Estado:** Guía Oficial de Desarrollo

---

# 1. Introducción

Este documento establece las normas de desarrollo que deberán seguir todos los desarrolladores y herramientas de inteligencia artificial involucradas en el proyecto Athena ERP.

El objetivo es garantizar un código limpio, consistente, mantenible y preparado para evolucionar durante muchos años.

Todas las contribuciones deberán respetar estas normas.

---

# 2. Objetivos

Los estándares buscan.

- Mantener consistencia.
- Reducir errores.
- Facilitar mantenimiento.
- Mejorar legibilidad.
- Facilitar revisiones.
- Facilitar pruebas.
- Permitir escalabilidad.

---

# 3. Lenguaje

El proyecto será desarrollado utilizando.

Frontend:

- TypeScript

Backend:

- Python
- Django
- Django REST Framework

No se utilizará JavaScript en el código fuente principal.

---

# 4. Idioma del Código

Todo el código deberá escribirse en inglés.

Ejemplos.

```ts
machineService

captureRepository

calculateSettlement()

generateReport()
```

Los comentarios podrán escribirse en español cuando describan reglas específicas del negocio.

---

# 5. Convenciones de Nombres

Variables

camelCase

```ts
machineId

captureDate

operatorName
```

Funciones

camelCase

```ts
createCapture()

calculateNetIncome()

closePeriod()
```

Clases

PascalCase

```ts
CaptureService

MachineRepository

DashboardController
```

Interfaces

PascalCase

```ts
Machine

Settlement

Capture
```

Enums

PascalCase

```ts
MachineStatus

PeriodStatus

CaptureState
```

Constantes

UPPER_SNAKE_CASE

```ts
MAX_UPLOAD_SIZE

DEFAULT_PAGE_SIZE

JWT_EXPIRATION
```

---

# 6. Organización

Cada módulo será independiente.

Ejemplo.

```
machines/

views/

services/

repositories/

serializers/

models/

validators/

tests/

mappers/

events/

```

No mezclar responsabilidades.

---

# 7. Tamaño de Archivos

Archivos.

Preferiblemente menores a 300 líneas.

Si un archivo supera las 500 líneas deberá evaluarse su división.

---

# 8. Tamaño de Funciones

Las funciones deberán ser pequeñas.

Ideal.

10 a 30 líneas.

Máximo recomendado.

50 líneas.

---

# 9. Responsabilidad Única

Cada función deberá realizar una sola tarea.

Incorrecto.

```ts
createCaptureAndGenerateSettlement()
```

Correcto.

```ts
createCapture()

generateSettlement()
```

---

# 10. Comentarios

Se evitarán comentarios innecesarios.

Incorrecto.

```ts
// Incrementa uno
count++;
```

Correcto.

```ts
// Regla de negocio:
// Una máquina reiniciada conserva el histórico
```

---

# 11. Código Limpio

Se evitarán.

Variables ambiguas.

Funciones gigantes.

Duplicación.

Números mágicos.

Código muerto.

---

# 12. Principios SOLID

Todo desarrollo deberá respetar.

- Single Responsibility.
- Open/Closed.
- Liskov Substitution.
- Interface Segregation.
- Dependency Inversion.

---

# 13. DRY

Nunca duplicar lógica.

Si una regla se utiliza en varios lugares deberá abstraerse.

---

# 14. KISS

Las soluciones deberán ser simples.

No desarrollar arquitecturas complejas sin necesidad.

---

# 15. YAGNI

No implementar funcionalidades que todavía no sean necesarias.

El sistema crecerá mediante iteraciones.

---

# 16. Manejo de Errores

Nunca utilizar.

```ts
catch (e) {}
```

Todo error deberá.

Registrarse.

Propagarse.

Documentarse cuando corresponda.

---

# 17. Logging

Utilizar un sistema centralizado.

Registrar únicamente eventos relevantes.

No imprimir información sensible.

---

# 18. Validaciones

Toda validación deberá realizarse en el Backend.

El Frontend únicamente mejorará la experiencia del usuario.

---

# 19. Serializers

Toda información recibida por la API utilizará Serializers.

No exponer modelos directamente.

---

# 20. Servicios

Los Services contendrán toda la lógica del negocio.

Las Views o ViewSets únicamente recibirán solicitudes y devolverán respuestas.

---

# 21. Repositories

Toda interacción con Django ORM deberá realizarse mediante Repositories.

No realizar consultas desde los Services.

---

# 22. Mappers

Los Mappers convertirán.

DTO

↓

Entidad

↓

Respuesta

No mezclar formatos.

---

# 23. Validadores

Las reglas reutilizables deberán implementarse mediante Validators.

Ejemplo.

```ts
CaptureValidator

MachineValidator

SettlementValidator
```

---

# 24. Pruebas

Todo módulo importante deberá incluir pruebas.

Tipos.

- Unitarias.
- Integración.
- End-to-End.

---

# 25. Formato

Utilizar.

Prettier

ESLint

No modificar manualmente el formato del código.

---

# 26. Imports

Orden recomendado.

1. Librerías externas.

2. Librerías internas.

3. Componentes locales.

4. Tipos.

5. Estilos.

---

# 27. Dependencias

Agregar únicamente dependencias necesarias.

Evitar librerías abandonadas.

Mantener versiones actualizadas.

---

# 28. Git

Cada cambio deberá realizarse mediante ramas.

Ejemplo.

```
feature/capture-module

feature/dashboard

fix/liquidation-calculation

refactor/machine-service
```

---

# 29. Commits

Formato recomendado.

```
feat:

fix:

refactor:

docs:

test:

style:

chore:
```

Ejemplos.

```
feat: add machine registration

fix: settlement calculation

docs: update business rules
```

---

# 30. Código Reutilizable

Todo componente reutilizable deberá ubicarse en módulos compartidos.

No duplicar componentes.

---

# 31. Configuración

Nunca escribir valores fijos dentro del código.

Ejemplo incorrecto.

```ts
const iva = 0.19;
```

Correcto.

```ts
const iva = configurationService.getCurrentIVA();
```

---

# 32. Fechas

Toda fecha deberá almacenarse en UTC.

La presentación dependerá de la configuración del usuario.

---

# 33. Manejo de Estados

Evitar múltiples variables booleanas.

Preferir Enums.

Incorrecto.

```ts
isClosed

isApproved

isPending
```

Correcto.

```ts
status = SettlementStatus.APPROVED
```

---

# 34. Seguridad

Nunca almacenar.

Contraseñas.

Tokens.

Secretos.

Claves privadas.

Dentro del código fuente.

---

# 35. Refactorización

Siempre que una implementación pueda simplificarse sin modificar el comportamiento, deberá refactorizarse.

---

# 36. Calidad

Antes de integrar cambios deberán cumplirse.

Sin errores de TypeScript en Frontend.

Sin errores Python en Backend.

Sin advertencias críticas.

ESLint aprobado para Frontend.

Linting y formateo Python aprobados para Backend.

Pruebas exitosas.

Compilación exitosa.

---

# 37. Inteligencia Artificial

Las herramientas de IA podrán generar código.

Todo código generado deberá.

Revisarse.

Comprenderse.

Probarse.

Documentarse cuando corresponda.

Nunca deberá aceptarse código sin revisión.

---

# 38. Restricciones

No utilizar "any" salvo casos excepcionales plenamente justificados.

No duplicar lógica.

No crear funciones excesivamente largas.

No mezclar reglas del negocio con la interfaz.

No acceder directamente a la base de datos desde el Frontend.

---

# 39. Evolución

Los estándares podrán ampliarse conforme crezca el proyecto.

Toda modificación deberá mantenerse compatible con los principios definidos en este documento.

---

# 40. Conclusión

Los estándares definidos en este documento buscan garantizar que Athena ERP mantenga un código limpio, consistente y profesional durante todo su ciclo de vida.

La calidad del software será una responsabilidad compartida entre desarrolladores, revisores y herramientas de inteligencia artificial.
