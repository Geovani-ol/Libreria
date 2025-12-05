from sqlmodel import create_engine, Session, SQLModel
from typing import Generator
from models import Libro

sqlite_file_name = "libreria.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

engine = create_engine(sqlite_url, echo=True, connect_args={"check_same_thread": False})

# Crear las tablas si no existes
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

# Dependencia para obtener una sesión de base de datos
def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session