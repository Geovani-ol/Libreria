from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
from db import get_session
from models import Libro, LibroCreate, LibroRead, LibroUpdate


'''
ROUTER
'''
router = APIRouter(
    prefix="/libros",
    tags=["Libros"]
)

'''
CREATE
'''
@router.post("/", response_model=LibroRead, status_code=status.HTTP_201_CREATED)
def create_libro(*, session: Session = Depends(get_session), libro: LibroCreate):
    db_libro = Libro.model_validate(libro)
    session.add(db_libro)
    session.commit()
    session.refresh(db_libro)
    return db_libro


'''
LEER TODOS
'''
@router.get("/", response_model=List[LibroRead])
def read_libros(*, session: Session = Depends(get_session), offset: int = 0, limit: int = 100):
    libros = session.exec(select(Libro).offset(offset).limit(limit)).all()
    return libros


'''
LEER POR ID
'''
@router.get("/{libro_id}", response_model=LibroRead)
def read_libro(*, session: Session = Depends(get_session), libro_id: int):
    libro = session.get(Libro, libro_id)
    if not libro:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Libro no encontrado")
    return libro


'''
ACTUALIZAR POR ID
'''
@router.patch("/{libro_id}", response_model=LibroRead)
def update_libro(*, session: Session = Depends(get_session), libro_id: int, libro: LibroUpdate):
    db_libro = session.get(Libro, libro_id)
    if not db_libro:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Libro no encontrado")
    
    libro_data = libro.model_dump(exclude_unset=True) # Solo campos que se enviaron en el request
    db_libro.model_validate(db_libro.model_dump() | libro_data) # Actualiza el modelo de la DB

    session.add(db_libro)
    session.commit()
    session.refresh(db_libro)
    return db_libro


'''
ACTUALIZAR COMPLETO POR ID (PUT)
'''
@router.put("/{libro_id}", response_model=LibroRead)
def update_libro_completo(*, 
                          session: Session = Depends(get_session), 
                          libro_id: int, 
                          libro_nuevo: LibroCreate):
    
    db_libro = session.get(Libro, libro_id)
    
    if not db_libro:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Libro no encontrado")
    
    nuevos_datos = libro_nuevo.model_dump()
    
    for key, value in nuevos_datos.items():
        setattr(db_libro, key, value)
 
    session.add(db_libro)
    session.commit()
    session.refresh(db_libro)
    
    return db_libro

'''
ELIMINAR PRO ID
'''
@router.delete("/{libro_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_libro(*, session: Session = Depends(get_session), libro_id: int):
    libro = session.get(Libro, libro_id)
    
    if not libro:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Libro no encontrado")
    
    session.delete(libro)
    session.commit()
    return {"ok": True}