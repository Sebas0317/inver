# 🏛️ Athena ERP

Sistema empresarial para la administración de máquinas electrónicas de entretenimiento.

## 📖 Descripción

Athena ERP reemplaza el ecosistema de archivos Excel utilizado actualmente, centralizando toda la operación en una única plataforma web que permite:

- Captura diaria de contadores
- Conciliaciones con clientes
- Liquidaciones automáticas
- Histórico completo
- Auditoría de cambios
- Dashboards gerenciales

## 🚀 Inicio Rápido

### Prerrequisitos

- Docker y Docker Compose instalados
- Git para clonar el repositorio

### Primeros Pasos

1. **Clonar el repositorio** (si aplica)
```bash
git clone <repository-url>
cd inver - Copy
```

2. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env y configurar DJANGO_SECRET_KEY y POSTGRES_PASSWORD
```

3. **Levantar la infraestructura**
```bash
docker compose up --build
```

4. **Acceder a la aplicación**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api
- Admin Django: http://localhost:8000/admin

## 🏗️ Arquitectura

```
┌─────────────────────────────────────┐
│     React + TypeScript (Frontend)   │
│         Vite + TailwindCSS          │
└─────────────────┬───────────────────┘
                  │ REST API
┌─────────────────▼───────────────────┐
│   Django + Django REST Framework    │
│         (Backend - Lógica)          │
└─────────────────┬───────────────────┘
                  │ Django ORM
┌─────────────────▼───────────────────┐
│           PostgreSQL                │
│           (Base de Datos)           │
└─────────────────────────────────────┘
```

## 📁 Estructura del Proyecto

```
athena-erp/
├── backend/           # Django + DRF
├── frontend/          # React + TypeScript + Vite
├── docker-compose.yml
├── .env.example
├── .gitignore
└── docs/             # Documentación del negocio
```

## 🛠️ Comandos Útiles

### Docker
```bash
# Levantar todo
docker compose up

# Levantar en segundo plano
docker compose up -d

# Detener todo
docker compose down

# Ver logs
docker compose logs -f

# Reconstruir
docker compose up --build

# Acceder al contenedor del backend
docker compose exec backend sh

# Acceder a la base de datos
docker compose exec db psql -U athena_user -d athena_erp
```

### Django (desde el contenedor backend)
```bash
# Migraciones
python manage.py makemigrations
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Ejecutar tests
python manage.py test

# Shell de Django
python manage.py shell
```

## 📚 Documentación

La documentación detallada del negocio se encuentra en la carpeta `docs/`:

- `00_PROJECT_CONTEXT.md` - Contexto del proyecto
- `01_VISION.md` - Visión y objetivos
- `04_ACTORS.md` - Actores y roles del sistema
- `06_BUSINESS_RULES.md` - Reglas de negocio
- `10_SYSTEM_MODULES.md` - Módulos del sistema
- `20_ROADMAP.md` - Roadmap de desarrollo

## 🔐 Seguridad

**Importante:** En producción, asegúrate de:

1. Cambiar `DJANGO_DEBUG` a `False`
2. Generar una `DJANGO_SECRET_KEY` única y segura
3. Cambiar la contraseña de PostgreSQL
4. Usar HTTPS

## 📝 Estado Actual

**Fase 1 - Infraestructura Base** ✅ COMPLETADA

Próximos pasos:
- [ ] Autenticación JWT (login/logout)
- [ ] Gestión de usuarios (CRUD)
- [ ] Catálogo de operadores
- [ ] Catálogo de puntos
- [ ] Catálogo de máquinas

## 🤝 Contribución

Antes de implementar cualquier funcionalidad, revisar la documentación del negocio en `docs/`. Toda funcionalidad debe resolver un problema real del negocio.

---

**Athena ERP** - Transformando la gestión operativa de máquinas electrónicas.