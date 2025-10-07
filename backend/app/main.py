import logging
logging.basicConfig(level=logging.DEBUG)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import auth, note
from .database import Base, engine

app = FastAPI()
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://notes-app-frontend-two-tau.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(note.router)