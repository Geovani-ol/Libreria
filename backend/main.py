from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from db import create_db_and_tables
from routers import libros, carrito, autenticacion, categorias

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
CONFIGURAR CORS
'''
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4321"],  # Puerto del dev server de Astro
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

'''
INCLUIR ROUTERS
'''
app.include_router(libros.router)
app.include_router(carrito.router)
app.include_router(autenticacion.router)
app.include_router(categorias.router)

@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Bienvenido a la Libreria API por alex.py B)"}