# 🌦️ Weather App

This Weather App is designed to provide users with detailed weather information based on location and date range inputs. The app integrates with the Meteostat API for weather data and includes CRUD functionality for saved weather entries.

## 🚀 Features
- **User Authentication:** Secure login and signup system with FastAPI integration.
- **Dynamic Weather Data Entry:** Users can enter location details using various formats such as City/Town, Postal Code, GPS Coordinates, etc.
- **Date Range Support:** Displays weather data for specific date ranges.
- **Weather Data Display:** Includes temperature, humidity, wind speed, and a 5-day forecast with appealing visuals.
- **Data Persistence:** Uses SQLite for CRUD operations.
- **Dashboard Layout:** Top navigation with options for Home, About, Saved Data, and Logout.

---

## 🛠️ Installation Instructions

### Prerequisites
- **Python 3.10+**
- **Node.js (for React frontend)**
- **SQLite (for data storage)**

---

### 📂 Backend (FastAPI)
1. **Clone the repository:**
   ```bash
   git clone https://github.com/Hasnulsanna/WeatherApp.git
   cd backend

2. **Install dependencies:**
    pip install -r requirements.txt

3. **Run the FastAPI server:**
    uvicorn main:app --reload

### 📂 Frontend(React)
1. **Navigate to the frontend folder:**
    cd weather-app-frontend

2. **Install dependencies:**
    npm install

3. **Start the React development server:**
    npm start


## 📋 Usage
1. **Sign Up/Log In:**  Start by registering or logging into the app.
2. **Weather Data Entry:** Enter your desired location and date range to fetch weather data.
3. **View Forecast:** Display a detailed weather summary with options to save the data.
4. **CRUD Operations:** View,delete and download saved weather entries in the dedicated "Saved Data" section.


## 🌍 API Integration

The app utilizes the Meteostat API and OpenWeather to fetch weather data with detailed validation for different location types.

## 🔮 Future Improvements
🔔 Add notifications for extreme weather conditions.
🎨 Enhance UI with improved visual elements and animations.
🧑‍💻 Implement user profile settings for customized preferences.

**📝 License**
    This project is licensed under the MIT License.

