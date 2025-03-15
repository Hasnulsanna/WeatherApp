import axios from "axios"

const API = axios.create({
    baseURL : 'http://localhost:8000',
    headers:{
        "Content-Type": "application/json"
    }
});

export const RegisterUser = async(userData) =>{
    try{
    console.log(userData)
    const response = await API.post("/signup",userData);
    console.log(response.data)
    return response.data
    }
    catch(error){
        const errorMessage = error.response?.data?.detail || "Registration Failed";
        throw new Error(errorMessage);
    }
};

export const LoginUser = async(userData) =>{
    try{
    const response = await API.post("/login",userData);
    const { username } = response.data;
    if (username){
        localStorage.setItem('username', username);
    }
    return response.data
    }
    catch(error){
        const errorMessage = error.response?.data?.detail || "Login Failed";
        throw new Error(errorMessage);
    }
};

export const getUserInfo = () => {
    return localStorage.getItem('username')
}
