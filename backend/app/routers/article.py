from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Article, User
from pydantic import BaseModel
from app.auth import get_current_user
from typing import Optional

router = APIRouter(prefix="/articles", tags=["articles"])

class ArticleCreate(BaseModel):
    title: str
    content: str
    is_public: bool

class ArticleOut(BaseModel):
    id: int
    title: str
    content: str
    is_public: bool
    author_id: int

@router.post("/", response_model=ArticleOut)
def create_article(article: ArticleCreate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == current_user["username"]).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db_article = Article(**article.dict(), author_id=db_user.id)
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    return db_article

@router.get("/", response_model=list[ArticleOut])
def get_articles(current_user: Optional[dict] = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user:
        db_user = db.query(User).filter(User.username == current_user["username"]).first()
        if db_user:
            return db.query(Article).all()  # Авторизованные видят все статьи
    return db.query(Article).filter(Article.is_public == True).all()  # Неавторизованные видят только публичные