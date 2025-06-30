from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Product, User
from pydantic import BaseModel
from app.auth import get_current_user
from typing import Optional

router = APIRouter(prefix="/products", tags=["products"])

class ProductCreate(BaseModel):
    name: str
    description: str
    price: float

class ProductOut(BaseModel):
    id: int
    name: str
    description: str
    price: float
    owner_id: int

@router.post("/", response_model=ProductOut)
def create_product(product: ProductCreate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == current_user["username"]).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db_product = Product(**product.dict(), owner_id=db_user.id)
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@router.get("/{product_id}", response_model=ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.get("/", response_model=list[ProductOut])
def get_products(db: Session = Depends(get_db)):
    print("Fetching all products")  # Отладочный вывод
    return db.query(Product).all()