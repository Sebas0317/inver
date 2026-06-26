"""
Management command para crear usuarios de prueba.
"""
from django.core.management.base import BaseCommand
from apps.users.models import User


class Command(BaseCommand):
    help = 'Crea usuarios de prueba para desarrollo'

    def handle(self, *args, **options):
        # Datos de usuarios de prueba
        users_data = [
            {
                'email': 'presidente@athena.com',
                'full_name': 'Carlos Pérez',
                'password': 'Presidente123!',
                'role': 'PRESIDENTE',
            },
            {
                'email': 'gerente@athena.com',
                'full_name': 'María González',
                'password': 'Gerente123!',
                'role': 'GERENTE',
            },
            {
                'email': 'analista@athena.com',
                'full_name': 'Juan Rodríguez',
                'password': 'Analista123!',
                'role': 'ANALISTA',
            },
            {
                'email': 'tecnico@athena.com',
                'full_name': 'Pedro Martínez',
                'password': 'Tecnico123!',
                'role': 'TECNICO',
            },
            {
                'email': 'delegado@athena.com',
                'full_name': 'Ana López',
                'password': 'Delegado123!',
                'role': 'DELEGADO',
            },
            {
                'email': 'contador@athena.com',
                'full_name': 'Luisa Fernández',
                'password': 'Contador123!',
                'role': 'CONTADOR',
            },
            {
                'email': 'admin@athena.com',
                'full_name': 'Administrador del Sistema',
                'password': 'Admin123!',
                'role': 'ADMINISTRADOR',
            },
        ]

        created_count = 0
        updated_count = 0

        for user_data in users_data:
            email = user_data.pop('email')

            user, created = User.objects.update_or_create(
                email=email,
                defaults=user_data,
            )

            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'✓ Usuario creado: {user.email} ({user.role})')
                )
                created_count += 1
            else:
                self.stdout.write(
                    self.style.WARNING(f'→ Usuario actualizado: {user.email} ({user.role})')
                )
                updated_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f'\n✅ Usuarios de prueba listos: {created_count} creados, {updated_count} actualizados'
            )
        )

        self.stdout.write(
            self.style.SUCCESS(
                '\n📋 Credenciales:'
            )
        )
        self.stdout.write('┌─────────────────────┬───────────────┬─────────────────┐')
        self.stdout.write('│ Email               │ Rol           │ Contraseña      │')
        self.stdout.write('├─────────────────────┼───────────────┼─────────────────┤')
        for user_data in users_data:
            email = user_data['email'].ljust(19)
            role = user_data['role'].ljust(13)
            password = user_data['password'].ljust(15)
            self.stdout.write(f'│ {email} │ {role} │ {password} │')
        self.stdout.write('└─────────────────────┴───────────────┴─────────────────┘')