# 17_UI_UX_GUIDELINES.md

# Guía de UI / UX

**Proyecto:** Athena ERP *(Nombre temporal)*

**Versión:** 0.1

**Estado:** Diseño de Experiencia de Usuario

---

# 1. Introducción

Athena ERP será una aplicación web utilizada diariamente durante largas jornadas por diferentes perfiles de usuario.

Su diseño deberá priorizar la productividad, la velocidad de uso y la claridad visual antes que los elementos decorativos.

Cada decisión de interfaz deberá facilitar el trabajo operativo y reducir la cantidad de clics necesarios para completar una tarea.

---

# 2. Principios de Diseño

La interfaz deberá seguir los siguientes principios.

- Simplicidad.
- Consistencia.
- Rapidez.
- Legibilidad.
- Accesibilidad.
- Jerarquía visual.
- Bajo ruido visual.

El objetivo es que el usuario encuentre la información importante en pocos segundos.

---

# 3. Filosofía Visual

Athena ERP utilizará un estilo moderno inspirado en aplicaciones profesionales.

Referencias.

- Linear
- Vercel
- GitHub
- Notion
- Stripe Dashboard

No se busca una apariencia llamativa.

Se busca una interfaz limpia y eficiente.

---

# 4. Diseño General

La aplicación utilizará.

Sidebar izquierda

↓

Contenido principal

↓

Paneles

↓

Tablas

↓

Modales

↓

Notificaciones

Todo deberá mantener una estructura uniforme.

---

# 5. Layout Principal

```
+------------------------------------------------------+

 Sidebar | Navbar Superior |

|----------------------------------------------|

| |

| Contenido |

| |

| |

| |

+------------------------------------------------------+
```

---

# 6. Sidebar

El menú lateral contendrá únicamente los módulos principales.

Ejemplo.

Dashboard

Operadores

Salas

Máquinas

Capturas

Conciliaciones

Liquidaciones

Reportes

Configuración

No deberá contener información innecesaria.

---

# 7. Navbar

La barra superior incluirá.

- Nombre del período.
- Usuario.
- Buscador.
- Notificaciones.
- Configuración.

---

# 8. Dashboard

El Dashboard será completamente visual.

Debe responder rápidamente preguntas como.

¿Cuánto se recaudó hoy?

¿Cuál operador produjo más?

¿Qué máquinas presentan problemas?

¿Qué salas disminuyeron su rentabilidad?

¿Cuántas máquinas están apagadas?

---

# 9. Tablas

Las tablas serán el componente más importante del sistema.

Deberán soportar.

- Ordenamiento.
- Búsquedas.
- Filtros.
- Paginación.
- Columnas ocultables.
- Exportación.

---

# 10. Formularios

Los formularios deberán.

- Ser cortos.
- Tener validaciones inmediatas.
- Mostrar errores claros.
- Evitar campos innecesarios.

---

# 11. Colores

La paleta utilizará colores neutros.

Blancos.

Grises.

Negros.

Un único color principal para acciones.

Los colores deberán utilizarse únicamente para comunicar estados.

Nunca como decoración.

---

# 12. Tipografía

Se utilizará una única familia tipográfica.

Las jerarquías dependerán del tamaño y peso de la fuente.

No del color.

---

# 13. Iconografía

Todos los iconos deberán pertenecer a una misma librería.

Se utilizarán únicamente cuando aporten significado.

Nunca como elemento decorativo.

---

# 14. Espaciado

Toda la aplicación utilizará un sistema consistente de espaciado.

Se evitarán componentes demasiado juntos.

Se priorizará la respiración visual.

---

# 15. Estados

Todo componente deberá contemplar.

Loading.

Vacío.

Error.

Éxito.

Sin permisos.

---

# 16. Feedback

Toda acción importante deberá informar su resultado.

Ejemplos.

Captura registrada.

Liquidación aprobada.

Período cerrado.

Usuario creado.

---

# 17. Confirmaciones

Las acciones críticas deberán solicitar confirmación.

Ejemplos.

Cerrar período.

Eliminar usuario.

Reabrir liquidación.

Cambiar porcentajes.

---

# 18. Navegación

El usuario nunca deberá perder el contexto.

Siempre deberá saber.

Dónde está.

Qué está haciendo.

Qué información está viendo.

---

# 19. Responsive

La prioridad será Desktop.

Posteriormente.

Tablet.

Finalmente.

Móvil.

No todas las funcionalidades deberán existir en teléfonos.

---

# 20. Accesibilidad

La interfaz deberá cumplir.

Contraste suficiente.

Navegación por teclado.

Etiquetas descriptivas.

Mensajes claros.

---

# 21. Rendimiento

Toda pantalla deberá cargar rápidamente.

Las tablas grandes utilizarán paginación.

Las consultas pesadas deberán ejecutarse en el Backend.

---

# 22. Consistencia

Todos los módulos deberán compartir.

Botones.

Tablas.

Inputs.

Modales.

Notificaciones.

Filtros.

Layouts.

---

# 23. Componentes

Los componentes serán reutilizables.

Ejemplos.

Button

Card

Table

Modal

Input

Select

Badge

Alert

Toast

DatePicker

---

# 24. Experiencia del Analista

El módulo de Capturas será la pantalla más optimizada del sistema.

El analista podrá registrar cientos de capturas diariamente con el mínimo número de clics.

La velocidad será prioritaria sobre cualquier elemento visual.

---

# 25. Experiencia del Gerente

El Gerente visualizará principalmente.

Indicadores.

Gráficos.

Rentabilidad.

Alertas.

Comparativos.

No necesitará navegar por procesos operativos.

---

# 26. Experiencia del Presidente

El Presidente tendrá un Dashboard Ejecutivo.

Verá únicamente indicadores estratégicos.

No accederá al detalle operativo.

---

# 27. Experiencia del Técnico

El Técnico tendrá una interfaz extremadamente simple.

Seleccionará.

Máquina.

Fecha.

Estado.

Observación.

Guardar.

---

# 28. Experiencia del Contador

El Contador visualizará.

Liquidaciones.

Impuestos.

Fees.

Exportaciones.

Facturación.

No modificará información operativa.

---

# 29. Experiencia del Delegado

El Delegado visualizará.

Máquinas.

Conciliaciones.

Observaciones.

Liquidaciones.

Podrá aprobar o rechazar conciliaciones según los permisos asignados.

---

# 30. Animaciones

Las animaciones deberán ser discretas.

No ralentizarán el trabajo.

No distraerán al usuario.

---

# 31. Modo Oscuro

Athena ERP deberá soportar.

Modo Claro.

Modo Oscuro.

El usuario podrá elegir su preferencia.

---

# 32. Futuras Mejoras

La interfaz permitirá incorporar.

Dashboards personalizados.

Widgets.

Temas.

Atajos de teclado.

Paneles configurables.

---

# 33. Restricciones

No utilizar colores excesivos.

No utilizar tablas difíciles de leer.

No utilizar ventanas innecesarias.

No ocultar información importante.

No obligar al usuario a navegar entre múltiples pantallas para completar una tarea.

---

# 34. Conclusión

La interfaz de Athena ERP deberá transmitir profesionalismo, rapidez y confianza.

Cada componente deberá existir porque aporta valor al usuario.

La prioridad será siempre mejorar la productividad de quienes utilizan el sistema diariamente.