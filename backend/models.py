from sqlmodel import SQLModel, Field, Relationship
from pydantic import EmailStr
from datetime import datetime


'''
Many-to-Many
'''
class CarritoLibroLink(SQLModel, table=True):
    carrito_id: int = Field(foreign_key="carrito.id", primary_key=True)
    libro_id: int = Field(foreign_key="libro.id", primary_key=True)

class VentaLibroLink(SQLModel, table=True):
    venta_id: int = Field(foreign_key="venta.id", primary_key=True)
    Libro_id: int = Field(foreign_key="libro.id", primary_key=True)


'''
Usuario
'''
class Usuario(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    correo: EmailStr = Field(max_length=50)
    password: str = Field(max_length=20)
    nombre: str = Field(max_length=100)
    direccion: str = Field(max_length=200)
    telefono: str = Field(max_length=15)
    rfc: str = Field(max_length=20)
    fecha_registro: datetime = Field(default_factory=datetime.utcnow)
    es_admin: bool = Field(default=False)
    
    carrito: "Carrito" = Relationship(back_populates="usuario")
    ventas: list["Venta"] = Relationship(back_populates="usuario")


'''
Libro
'''
class Libro(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    titulo: str = Field(max_length=100)
    autor: str = Field(max_length=100)
    editorial: str = Field(max_length=100)
    precio: float = Field(gt=0)
    cantidad_disponible: int = Field(ge=0)
    descripcion: str = Field(max_length=400)
    imagen_url: str = Field()

'''
Carrito
'''
class Carrito(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    usuario_id: int = Field(foreign_key="usuario.id")
    
    usuario: Usuario = Relationship(back_populates="carrito")
    
    libros: list[Libro] = Relationship(
        back_populates="carritos",
        link_model=CarritoLibroLink
    )


'''
Venta
'''
class Venta(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    usuario_id: int = Field(foreign_key="usuario.id")
    
    total: float = Field(gt=0)
    fecha: datetime = Field(default_factory=datetime.utcnow)
    forma_pago: str = Field(max_length=100)
    
    usuario: Usuario = Relationship(back_populates="ventas")
    
    libros: list[Libro] = Relationship(
        back_populates="Ventas",
        link_model=VentaLibroLink
    )
    