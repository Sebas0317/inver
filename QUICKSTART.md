# Athena ERP - Guía de Inicio Rápido

## Estructura creada ✅

```
athena-erp/
├── backend/
│   ├── config/              # Configuración de Django
│   │   ├── __init__.py
│   │   ├── settings.py      # Configuración principal
│   │   ├── urls.py          # URLs principales
│   │   ├── asgi.py
│   │   └── wsgi.py
│   ├── apps/                # Aplicaciones Django
│   │   ├── core/           # Utilidades centrales
│   │   ├── users/          # Gestión de usuarios
│   │   ├── operators/      # Operadores/clientes
│   │   ├── locations/      # Puntos de operación
│   │   ├── machines/       # Máquinas
│   │   ├── captures/       # Capturas diarias
│   │   ├── reconciliation/ # Conciliaciones
│   │   ├── settlements/    # Liquidaciones
│   │   ├── technical/      # Gestión técnica
│   │   ├── audit/          # Auditoría
│   │   └── settings/       # Configuración del sistema
│   ├── media/              # Archivos subidos
│   ├── static/             # Archivos estáticos
│   ├── manage.py           # Django CLI
│   ├── requirements.txt    # Dependencias Python
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── pages/          # Páginas
│   │   ├── services/       # Servicios API
│   │   ├── hooks/          # Hooks personalizados
│   │   ├── types/          # Tipos TypeScript
│   │   ├── utils/          # Utilidades
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
└── .gitignore
```

## 🚀 Primeros Pasos

### 1. Configurar variables de entorno

```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar .env y configurar:
# - DJANGO_SECRET_KEY (generar con: python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())")
# - POSTGRES_PASSWORD (contraseña segura)
```

### 2. Levantar la infraestructura

```bash
# Desde la raíz del proyecto
docker compose up --build
```

### 3. Acceder a la aplicación

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api
- **Admin Django**: http://localhost:8000/admin
- **Documentación API (Swagger)**: http://localhost:8000/api/docs/
- **Health Check**: http://localhost:8000/api/health/

### 4. Crear superusuario

```bash
# Acceder al contenedor del backend
docker compose exec backend sh

# Crear superusuario
python manage.py createsuperuser

# Salir del contenedor
exit
```

## 📝 Próximos Pasos

1. **Autenticación JWT** - Endpoints de login/logout
2. **Usuarios** - CRUD de usuarios
3. **Operadores** - Gestión de operadores/clientes
4. **Puntos** - Gestión de ubicaciones
5. **Máquinas** - Gestión de máquinas

## 🛠️ Comandos Útiles

```bash
# Ver logs
docker compose logs -f

# Detener servicios
docker compose down

# Reiniciar backend
docker compose restart backend

# Acceder a la DB
docker compose exec db psql -U athena_user -d athena_erp

# Migraciones (dentro del contenedor backend)
python manage.py makemigrations
python manage.py migrate

# Ejecutar tests
python manage.py test
```

## ⚠️ Notas Importantes

- Los archivos `.env` NO deben subirse al repositorio
- La base de datos se persiste en un volumen Docker `postgres_data`
- En desarrollo, los cambios en el código se reflejan automáticamente
- El frontend tiene proxy configurado hacia el backend en `/api`