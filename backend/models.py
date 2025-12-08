from sqlmodel import SQLModel, Field, Relationship
from pydantic import EmailStr
from datetime import datetime
from typing import Optional, List


'''
Many-to-Many
'''
class CarritoLibroLink(SQLModel, table=True):
    carrito_id: Optional[int] = Field(foreign_key="carrito.id", primary_key=True)
    libro_id: Optional[int] = Field(foreign_key="libro.id", primary_key=True)

class VentaLibroLink(SQLModel, table=True):
    venta_id: Optional[int] = Field(foreign_key="venta.id", primary_key=True)
    libro_id: Optional[int] = Field(foreign_key="libro.id", primary_key=True)


'''
Usuario
'''
class UsuarioRegister(SQLModel):
    correo: EmailStr = Field(max_length=50)
    password: str = Field(max_length=20)
    nombre: str = Field(max_length=100)
    direccion: str = Field(max_length=200)
    telefono: str = Field(max_length=15)
    rfc: str = Field(max_length=20)

# Lectura 
class UsuarioRead(SQLModel):
    id: int
    correo: EmailStr
    nombre: str
    fecha_registro: datetime
    es_admin: bool

# Login
class UsuarioLogin(SQLModel):
    correo: EmailStr
    password: str

# Modelo completo
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
class LibroBase(SQLModel):
    titulo: str = Field(max_length=100)
    autor: str = Field(max_length=100)
    editorial: str = Field(max_length=100)
    precio: float = Field(gt=0)
    cantidad_disponible: int = Field(ge=0)
    descripcion: str = Field(max_length=400)
    imagen_url: str
    
class Libro(LibroBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    
    carritos: List["Carrito"] = Relationship(
        back_populates="libros",
        link_model=CarritoLibroLink
    )
    
    ventas: List["Venta"] = Relationship(
        back_populates="libros",
        link_model=VentaLibroLink
    )

class LibroCreate(LibroBase):
    pass 

class LibroRead(LibroBase):
    id: int

class LibroUpdate(SQLModel):
    titulo: Optional[str] = Field(default=None, max_length=100)
    autor: Optional[str] = Field(default=None, max_length=100)
    editorial: Optional[str] = Field(default=None, max_length=100)
    precio: Optional[float] = Field(default=None, gt=0)
    cantidad_disponible: Optional[int] = Field(default=None, ge=0)
    descripcion: Optional[str] = Field(default=None, max_length=400)
    imagen_url: Optional[str] = Field(default=None)

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

class LibroInCarrito(SQLModel):
    id: int
    titulo: str
    precio: float

class CarritoRead(SQLModel):
    id: int
    usuario_id: int
    libros: List[LibroInCarrito] = []

class CarritoCreate(SQLModel):
    usuario_id: int

class CarritoUpdate(SQLModel):
    libros_ids: Optional[List[int]] = Field(default=None)


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
        back_populates="ventas",
        link_model=VentaLibroLink
    )