# from pydantic import BaseModel
# from typing import List

# class UserCreate(BaseModel):
#     email : str
#     username : str
#     password : str

# class UserLogin(BaseModel):
#     email:str
#     password:str

# # Schema for individual weather entries
# class WeatherEntry(BaseModel):
#     datetime: str
#     main: dict
#     wind: dict

# # Schema for saving weather data
# class WeatherDataCreate(BaseModel):
#     username: str
#     location: str
#     weather_data: List[WeatherEntry]

from pydantic import BaseModel
from datetime import datetime

class UserCreate(BaseModel):
    email: str
    username: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

# Schema for individual weather entries
class WeatherDataEntry(BaseModel):  # Renamed for clarity
    id: int  # Added ID for better CRUD functionality
    datetime: datetime
    location: str
    temp_max: float
    temp_min: float
    avg_temp: float
    humidity: float | None = None
    wind_speed: float | None = None

# Schema for saving weather data
class WeatherDataCreate(BaseModel):
    username: str
    location: str
    datetime: datetime
    temp_max: float
    temp_min: float
    avg_temp: float
    humidity: float | None = None
    wind_speed: float | None = None
