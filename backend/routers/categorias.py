from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
from db import get_session
from models import Categoria, CategoriaCreate, CategoriaRead, CategoriaUpdate


'''
ROUTER
'''
router = APIRouter(
    prefix="/categorias",
    tags=["Categorias"]
)

'''
CREATE
'''
@router.post("/", response_model=CategoriaRead, status_code=status.HTTP_201_CREATED)
def create_categoria(*, session: Session = Depends(get_session), categoria: CategoriaCreate):
    # Check if categoria with same name already exists
    existing = session.exec(select(Categoria).where(Categoria.nombre == categoria.nombre)).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Ya existe una categoría con el nombre '{categoria.nombre}'"
        )
    
    db_categoria = Categoria.model_validate(categoria)
    session.add(db_categoria)
    session.commit()
    session.refresh(db_categoria)
    return db_categoria


'''
LEER TODAS
'''
@router.get("/", response_model=List[CategoriaRead])
def read_categorias(*, session: Session = Depends(get_session)):
    categorias = session.exec(select(Categoria)).all()
    return categorias


'''
LEER POR ID
'''
@router.get("/{categoria_id}", response_model=CategoriaRead)
def read_categoria(*, session: Session = Depends(get_session), categoria_id: int):
    categoria = session.get(Categoria, categoria_id)
    if not categoria:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Categoría no encontrada")
    return categoria


'''
ACTUALIZAR POR ID
'''
@router.put("/{categoria_id}", response_model=CategoriaRead)
def update_categoria(*, session: Session = Depends(get_session), categoria_id: int, categoria: CategoriaUpdate):
    db_categoria = session.get(Categoria, categoria_id)
    if not db_categoria:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Categoría no encontrada")
    
    # Check if new name conflicts with existing categoria
    if categoria.nombre:
        existing = session.exec(
            select(Categoria).where(
                Categoria.nombre == categoria.nombre,
                Categoria.id != categoria_id
            )
        ).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Ya existe una categoría con el nombre '{categoria.nombre}'"
            )
    
    categoria_data = categoria.model_dump(exclude_unset=True)
    for key, value in categoria_data.items():
        setattr(db_categoria, key, value)

    session.add(db_categoria)
    session.commit()
    session.refresh(db_categoria)
    return db_categoria


'''
ELIMINAR POR ID
'''
@router.delete("/{categoria_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_categoria(*, session: Session = Depends(get_session), categoria_id: int):
    categoria = session.get(Categoria, categoria_id)
    
    if not categoria:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Categoría no encontrada")
    
    # Check if any books are using this category
    if categoria.libros:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"No se puede eliminar la categoría porque hay {len(categoria.libros)} libro(s) asociado(s)"
        )
    
    session.delete(categoria)
    session.commit()
    return {"ok": True}
