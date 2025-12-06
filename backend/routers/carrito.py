from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List, Optional
from db import get_session
from models import Carrito, CarritoCreate, CarritoRead, CarritoUpdate, Libro

'''
ROUTER
'''
router = APIRouter(
    prefix="/carritos",
    tags=["Carritos"]
)


'''
CREATE
'''
@router.post("/", response_model=CarritoRead, status_code=status.HTTP_201_CREATED)
def create_carrito(*, session: Session = Depends(get_session), carrito_data: CarritoCreate):
    existing_carrito = session.exec(
        select(Carrito).where(Carrito.usuario_id == carrito_data.usuario_id)
    )
    
    if existing_carrito:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detaul="El usuario ya tiene un carrito"
        )
    
    db_carrito = Carrito.model_validate(carrito_data)
    session.add(db_carrito)
    session.commit()
    session.refresh(db_carrito)
    return db_carrito


'''
LEER TODOS
'''
@router.get("/", response_model=List[CarritoRead])
def read_carritos(*, session: Session = Depends(get_session), offset: int = 0, limit: int = 100):
    carritos = session.exec(
        select(Carrito).offset(offset).limit(limit).all()
    )
    return carritos


'''
LEER POR ID
'''
@router.get("/{carrito_id}", response_model=CarritoRead)
def read_carrito(*, session: Session = Depends(get_session), carrito_id: int):
    carrito = session.get(Carrito, carrito_id)
    if not carrito:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detil="Carrito no encontrado")
    return carrito

'''
ACTUALIZAR POR ID'''
@router.patch("/{carrito_id}", response_model=CarritoRead)
def update_carrito(*, session: Session = Depends(get_session), carrito_id: int, carrito_update: CarritoUpdate):
    db_carrito = session.get(Carrito, carrito_id)
    
    if not db_carrito:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Carrito no encontrado")
    
    if carrito_update.libros_id is not None:
        libros_nuevos = []
        if carrito_update.libros_ids:
            libros_nuevos = session.exec(
                select(Libro).where(Libro.id.in_(carrito_update.libros_ids))
            ).all()

            if len(libros_nuevos) != len(carrito_update.libros_ids):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Uno o más IDs de libros son inválidos"
                )
        db_carrito.libros = libros_nuevos
    
    session.add(db_carrito)
    session.commit()
    session.refresh(db_carrito)
    return db_carrito


'''
ELIMINAR POR ID
'''
@router.delete("/{carrito_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_carrito(*, session: Session = Depends(get_session), carrito_id: int):
    carrito = session.get(Carrito, carrito_id)
    
    if not carrito: 
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Carrito no encotnrado")
    
    session.delete(carrito)
    session.commit()
    return {"message": "Carrito eliminado"}
    
    