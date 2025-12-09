from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from db import get_session
from models import Usuario, UsuarioRegister, UsuarioLogin, UsuarioRead
from security import hash_password, verify_password

router = APIRouter(
    prefix="/auth",
    tags=["Autenticación"]
)

'''
REGISTER
'''
@router.post("/register", response_model=UsuarioRead, status_code=status.HTTP_201_CREATED)
def register_usuario(*, session: Session = Depends(get_session), user_data: UsuarioRegister):
    
    # Verificar si el correo ya está registrado
    existing_user = session.exec(
        select(Usuario).where(Usuario.correo == user_data.correo)
        ).first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Correo ya registrado"
        )
    
    # Hashear la contraseña
    hashed_password = hash_password(user_data.password)

    # Crear usuario
    user_dict = user_data.model_dump()
    user_dict["password"] = hashed_password
    
    db_usuario = Usuario.model_validate(user_dict)

    # Guardar en la base de datos
    session.add(db_usuario)
    session.commit()
    session.refresh(db_usuario)

    return db_usuario


'''
LOGIN
'''
@router.post("/login")
def login_usuario(*, session: Session = Depends(get_session), login_data: UsuarioLogin):

    usuario = session.exec(
        select(Usuario).where(Usuario.correo == login_data.correo)

    ).first()
    
    if not usuario:
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contraseña incorrectos"
    )
    
    if not verify_password(login_data.password, usuario.password):
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail="Correo o contraseña incorrectos"
        )

    return {
        "message": f"Login exitodoso para el usuario {usuario.nombre}",
        "user_id": usuario.id,
        "is_admin": usuario.es_admin
    }