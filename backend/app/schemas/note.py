from pydantic import BaseModel

class NoteBase(BaseModel):
    title: str
    description: str

class NoteCreate(NoteBase):
    pass

class Note(NoteBase):
    id: int
    user_id: int
    class Config:
        from_attributes = True