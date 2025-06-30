from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import user, product, article, comment

app = FastAPI()

# CORS для связи с frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user.router)
app.include_router(product.router)
app.include_router(article.router)
app.include_router(comment.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Test Webapp"}
