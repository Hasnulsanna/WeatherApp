from fastapi import APIRouter, Depends,HTTPException
from .database import engine,Base,SessionLocal
from sqlalchemy.orm import Session
from .models import User
from .schemas import UserCreate, UserLogin
import hashlib

router = APIRouter()

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

#signup
@router.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    print("Route Hit: /signup") 
    print("Received Signup Data:", user.dict())
    if db.query(User).filter((User.email == user.email) | (User.username == user.username)).first():
        raise HTTPException(status_code=400, detail="Email or Username already existed")

    hashed_password = hashlib.sha256(user.password.encode()).hexdigest()
    new_user = User(email=user.email, username=user.username, password=hashed_password)
    db.add(new_user)
    db.commit()
    
    return {"message": "User registered Successfully"}


#login

@router.post("/login")
def login(user: UserLogin, db: Session=Depends(get_db)):
    stored_user = db.query(User).filter(User.email == user.email).first()
    if not stored_user:
        raise HTTPException(status_code=404, detail="User not found, Please Register")
    
    hashed_password = hashlib.sha256(user.password.encode()).hexdigest()
    if hashed_password != stored_user.password:
        raise HTTPException(status_code=400, detail="Incorrect Password")
    return {"message":"Login Successful","username":{stored_user.username}}
