from sqlmodel import create_engine, Session, SQLModel, select
from typing import Generator
from models import Libro, Usuario

from security import hash_password

sqlite_file_name = "libreria.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

engine = create_engine(sqlite_url, echo=True, connect_args={"check_same_thread": False})

ADMIN_EMAIL = ""
ADMIN_PASSWORD = ""
ADMIN_NOMBRE = ""

# Crear las tablas si no existes
def create_db_and_tables():

    SQLModel.metadata.create_all(engine)

'''
    with Session(engine) as session:

        # 1. Verificar si el usuario admin ya existe
        admin_user = session.exec(
            select(Usuario).where(Usuario.correo == ADMIN_EMAIL)
        ).first()

        if not admin_user:
            print("Creando usuario administrador inicial...")
            
            # 2. Hashear la contraseña
            hashed_password = hash_password(ADMIN_PASSWORD)
            
            # 3. Crear el objeto Usuario Admin
            new_admin = Usuario(
                correo=ADMIN_EMAIL,
                password=hashed_password,
                nombre=ADMIN_NOMBRE,
                direccion="Calle Falsa 123",
                telefono="1234567890",
                rfc="ADMINRFC1234",
                es_admin=True # 👈 ¡Importante! Establecerlo como admin
            )
            
            # 4. Guardar en la DB
            session.add(new_admin)
            session.commit()
            print(f"Usuario administrador '{ADMIN_EMAIL}' creado exitosamente.")
        else:
            print(f"El usuario administrador '{ADMIN_EMAIL}' ya existe.")
'''

# Dependencia para obtener una sesión de base de datos
def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session