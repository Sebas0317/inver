# Athena ERP - Guía de Inicio Rápido

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
docker compose up -d --build
```

### 3. Ejecutar migraciones

```bash
# Esperar a que la DB esté saludable (aprox. 5-10 segundos)
docker compose exec backend python manage.py migrate
```

### 4. Crear superusuario

```bash
docker compose exec backend python manage.py createsuperuser
```

Ingresa:
- **Email:** `admin@athena.com`
- **Nombre completo:** `Administrador`
- **Contraseña:** (la que elijas)

### 5. Acceder a la aplicación

- **Frontend**: http://localhost:5173
- **Login**: http://localhost:5173/login
- **Backend API**: http://localhost:8000/api
- **Admin Django**: http://localhost:8000/admin
- **Documentación API (Swagger)**: http://localhost:8000/api/docs/
- **Health Check**: http://localhost:8000/api/health/

---

## 📋 Estructura del Proyecto

```
inver - Copy/
├── backend/
│   ├── config/              # Configuración de Django
│   │   ├── settings.py      # Configuración principal
│   │   ├── urls.py          # URLs principales
│   │   ├── asgi.py
│   │   └── wsgi.py
│   ├── apps/                # Aplicaciones Django
│   │   ├── core/            # Excepciones personalizadas
│   │   ├── users/           # Autenticación y usuarios
│   │   ├── operators/       # Operadores/clientes
│   │   ├── locations/       # Puntos de operación
│   │   ├── machines/        # Máquinas y tipos
│   │   ├── captures/        # Capturas diarias
│   │   ├── reconciliation/  # Conciliaciones
│   │   ├── settlements/     # Liquidaciones
│   │   ├── technical/       # Gestión técnica
│   │   ├── audit/           # Auditoría
│   │   └── settings/        # Configuración del sistema
│   ├── manage.py            # Django CLI
│   ├── requirements.txt     # Dependencias Python
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── pages/           # Páginas (Login, Dashboard)
│   │   ├── context/         # AuthContext
│   │   ├── services/        # API clients
│   │   ├── types/           # Tipos TypeScript
│   │   ├── styles/          # Estilos CSS
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
└── docs/                    # Documentación completa
```

---

## 🛠️ Comandos Útiles

### Docker
```bash
# Ver logs en tiempo real
docker compose logs -f

# Ver logs de un servicio específico
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db

# Detener servicios
docker compose down

# Detener y eliminar volúmenes (reset completo)
docker compose down -v

# Reiniciar un servicio
docker compose restart backend

# Reconstruir desde cero
docker compose up -d --build --force-recreate
```

### Backend (desde el contenedor)
```bash
# Acceder al contenedor
docker compose exec backend sh

# Migraciones
python manage.py makemigrations
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Shell de Django
python manage.py shell

# Ejecutar tests
python manage.py test
```

### Base de Datos
```bash
# Acceder a PostgreSQL
docker compose exec db psql -U athena_user -d athena_erp

# Listar tablas (dentro de psql)
\dt

# Salir
\q
```

---

## 🔐 Autenticación

El sistema usa **JWT (JSON Web Tokens)** para autenticación:

1. **Login:** `POST /api/auth/login/`
   ```json
   {
     "email": "usuario@empresa.com",
     "password": "tu-contrasena"
   }
   ```

   Respuesta:
   ```json
   {
     "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
     "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
     "user": {
       "id": "uuid...",
       "email": "usuario@empresa.com",
       "full_name": "Nombre Usuario",
       "role": "PRESIDENTE"
     }
   }
   ```

2. **Refresh:** `POST /api/auth/refresh/`
   ```json
   {
     "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
   }
   ```

3. **Verify:** `POST /api/auth/verify/`
   ```json
   {
     "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
   }
   ```

4. **Usuario actual:** `GET /api/users/me/`
   - Requiere header: `Authorization: Bearer <access_token>`

---

## ⚠️ Posibles Issues

### Error: "address already in use"
```
Error: listen tcp4 0.0.0.0:8000: bind: address already in use
```
**Solución:** Cambia el puerto en `.env`:
```env
BACKEND_PORT=8001
```

### Error: "could not translate host name db to address"
**Causa:** El backend inicia antes de que la DB esté lista.

**Solución:** Espera a que la DB esté saludable:
```bash
docker compose logs db
# Espera a ver: "database system is ready to accept connections"
```

### Frontend no conecta al backend
**Solución:** Verifica `VITE_API_URL` en `frontend/.env`:
```env
VITE_API_URL=http://localhost:8000/api
```

### JWT no funciona / Error 401
**Solución:** 
1. Verifica que `DJANGO_SECRET_KEY` esté en `.env`
2. Limpia localStorage en el navegador
3. Vuelve a hacer login

---

## 📝 Estado Actual

**Fase 1.1 - Autenticación JWT Backend** ✅ COMPLETADA

Endpoints disponibles:
- ✅ `POST /api/auth/login/` - Login con JWT
- ✅ `POST /api/auth/refresh/` - Refresh de token
- ✅ `POST /api/auth/verify/` - Verificar token
- ✅ `GET /api/users/me/` - Obtener usuario actual
- ✅ `PATCH /api/users/me/update_profile/` - Actualizar perfil
- ✅ `GET /api/users/` - Listar usuarios (CRUD completo)

**Próximos pasos:**
1. ⏳ CRUD de usuarios (Frontend)
2. ⏳ Switch rápido de usuarios (dev feature)
3. ⏳ Catálogo de operadores
4. ⏳ Catálogo de puntos
5. ⏳ Catálogo de máquinas

---

**¿Necesitas ayuda?** Revisa la documentación completa en `docs/`.