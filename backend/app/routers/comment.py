from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Comment, User
from pydantic import BaseModel
from app.auth import get_current_user

router = APIRouter(prefix="/comments", tags=["comments"])

class CommentCreate(BaseModel):
    content: str

class CommentOut(BaseModel):
    id: int
    content: str
    author_id: int

@router.post("/", response_model=CommentOut)
def create_comment(comment: CommentCreate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    if len(comment.content) < 1:
        raise HTTPException(status_code=400, detail="Comment content cannot be empty")
    db_user = db.query(User).filter(User.username == current_user["username"]).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db_comment = Comment(**comment.dict(), author_id=db_user.id)
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment