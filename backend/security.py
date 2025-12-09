from passlib.context import CryptContext

# Esquema de hash - usando pbkdf2_sha256 para mejor compatibilidad
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

'''
Hashear contraseña
'''
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

'''
Verificar contraseña
'''
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)