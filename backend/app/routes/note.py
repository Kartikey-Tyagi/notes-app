from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.user import User
from ..models.note import Note
from ..schemas.note import NoteCreate, Note as NoteSchema
from ..routes.auth import oauth2_scheme
from jose import jwt
from os import getenv

router = APIRouter(prefix="/notes", tags=["notes"])

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, getenv("JWT_SECRET"), algorithms=["HS256"])
        email: str = payload.get("sub")
        role: str = payload.get("role")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = db.query(User).filter(User.email == email).first()
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return {"user": user, "role": role}
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post("/", response_model=NoteSchema)
def create_note(note: NoteCreate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    db_note = Note(**note.dict(), user_id=current_user["user"].id)
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note

@router.get("/", response_model=list[NoteSchema])
def read_notes(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user["role"] == "admin":
        return db.query(Note).all()
    return db.query(Note).filter(Note.user_id == current_user["user"].id).all()

@router.put("/{note_id}", response_model=NoteSchema)
def update_note(note_id: int, note: NoteCreate, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    db_note = db.query(Note).filter(Note.id == note_id).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Note not found")
    if current_user["role"] != "admin" and db_note.user_id != current_user["user"].id:
        raise HTTPException(status_code=403, detail="Not authorized")
    for key, value in note.dict().items():
        setattr(db_note, key, value)
    db.commit()
    db.refresh(db_note)
    return db_note

@router.delete("/{note_id}")
def delete_note(note_id: int, current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    db_note = db.query(Note).filter(Note.id == note_id).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Note not found")
    if current_user["role"] != "admin" and db_note.user_id != current_user["user"].id:
        raise HTTPException(status_code=403, detail="Not authorized")
    db.delete(db_note)
    db.commit()
    return {"message": "Note deleted"}