

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi import Query
from . import models, schemas, database
from datetime import datetime
import json
from fastapi.responses import JSONResponse

router = APIRouter(prefix="/weather", tags=["Weather Data"])

# Dependency to get the database session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# CREATE - Save weather data
@router.post("/save-weather", response_model=dict)
async def save_weather(data: schemas.WeatherDataCreate, db: Session = Depends(get_db)):
    print(data)
    try:
        weather_entry = models.WeatherData(
            username=data.username,
            location=data.location,
            date=data.datetime.strftime("%Y-%m-%d %H:%M:%S"),
            temp_max=data.temp_max,
            temp_min=data.temp_min,
            avg_temp=data.avg_temp,
            humidity=data.humidity,
            wind_speed=data.wind_speed,
        )
        db.add(weather_entry)
        db.commit()
        return {"message": "Weather data saved successfully."}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to save weather data: {str(e)}")

# READ - Get saved weather data
@router.get("/weather-data", response_model=list[schemas.WeatherDataEntry])
def get_weather_data(username: str = Query(...), db: Session = Depends(get_db)):
    weather_data = (
        db.query(models.WeatherData)
        .filter(models.WeatherData.username == username)
        .order_by(models.WeatherData.created_at.desc())
        .limit(10)
        .all()
    )

    if not weather_data:
        raise HTTPException(status_code=404, detail="No weather data found for this user")

    formatted_data = [
        schemas.WeatherDataEntry(
            id=entry.id,
            datetime=entry.date,
            location=entry.location,
            temp_max=entry.temp_max,
            temp_min=entry.temp_min,
            avg_temp=entry.avg_temp,
            humidity=entry.humidity,
            wind_speed=entry.wind_speed,
        )
        for entry in weather_data
    ]
    print("formatted:",formatted_data)
    return formatted_data

# DELETE - Delete weather entry by ID
@router.delete("/delete-weather/{entry_id}", response_model=dict)
async def delete_weather(entry_id: int, db: Session = Depends(get_db)):
    weather_entry = db.query(models.WeatherData).filter(models.WeatherData.id == entry_id).first()

    if not weather_entry:
        raise HTTPException(status_code=404, detail="Weather entry not found")

    db.delete(weather_entry)
    db.commit()
    return {"message": f"Weather entry with ID {entry_id} deleted successfully."}

# DOWNLOAD - Export weather data as JSON
@router.get("/download-weather-data", response_class=JSONResponse)
async def download_weather_data(username: str = Query(...), db: Session = Depends(get_db)):
    weather_data = (
        db.query(models.WeatherData)
        .filter(models.WeatherData.username == username)
        .order_by(models.WeatherData.created_at.desc())
        .all()
    )

    if not weather_data:
        raise HTTPException(status_code=404, detail="No weather data found for this user")

    json_data = [
        {
            "id": entry.id,
            "datetime": entry.date,
            "location": entry.location,
            "temp_max": entry.temp_max,
            "temp_min": entry.temp_min,
            "avg_temp": entry.avg_temp,
            "humidity": entry.humidity,
            "wind_speed": entry.wind_speed,
        }
        for entry in weather_data
    ]

    return JSONResponse(content=json_data)

