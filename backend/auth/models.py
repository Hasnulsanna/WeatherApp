from sqlalchemy import Column,String, Float, Integer, DateTime, func
from .database import Base

class User(Base):
    __tablename__ = "users"

    email = Column(String , primary_key = True,index=True)
    username = Column(String , unique= True, index=True)
    password = Column(String)

class WeatherData(Base):
    __tablename__ = "weather_data"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String, nullable=False)
    location = Column(String, nullable=False)
    date = Column(String, nullable=False)
    created_at = Column(DateTime, default=func.now())
    temp_max = Column(Float, nullable=False)
    temp_min = Column(Float, nullable=False)
    avg_temp = Column(Float, nullable=False)
    humidity = Column(Float, nullable=True)
    wind_speed = Column(Float, nullable=True)
