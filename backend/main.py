from fastapi import FastAPI
from contextlib import asynccontextmanager
from db import create_db_and_tables
from routers import libros, carrito

'''
INICIAR DATABASE
'''
@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


'''
INSTANCIA FastAPI
'''
app = FastAPI(
    title="Libreria API",
    version="1.0.0",
    lifespan=lifespan
)

'''
INCLUIR ROUTERS
'''
app.include_router(libros.router)
app.include_router(carrito.router)

@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Bienvenido a la Libreria API por alex.py B)"}

'''
    titulo: str = Field(max_length=100)
    autor: str = Field(max_length=100)
    editorial: str = Field(max_length=100)
    precio: float = Field(gt=0)
    cantidad_disponible: int = Field(ge=0)
    descripcion: str = Field(max_length=400)
    imagen_url: str
{
    "titulo": "Sapiens",
    "autor": "Yuval Noah Harari",
    "editorial": "Humanity Books",
    "precio": 399.00,
    "cantidad_disponible": 35,
    "descripcion": "Libro que habla sobre el avance humano.",
    "imagen_url": "files/sapiens.png"
}
'''