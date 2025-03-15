from fastapi import FastAPI
from auth import auth_routes
from auth.weather_data import router as weather_router
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()

origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

app.include_router(auth_routes.router)
app.include_router(weather_router)



@app.get("/")
def read_root():
    print("FastAPI Server is Running...")
    return {"message":"welcome to weather app"}

