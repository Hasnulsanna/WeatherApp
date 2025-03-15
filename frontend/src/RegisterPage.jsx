import React ,{useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { RegisterUser } from './services/api';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [username, setuserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    
    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
          const response = await RegisterUser({username,email,password});
          if (response.message) {
            alert(response.message);
            navigate('/login');
        }
        }catch(error){
          alert(`${error.message}`);
        }
    };

  return (
    <div className='register-container'>
        <h2>Signup</h2>
        <form onSubmit={handleSubmit}>
        <label>Username:</label>
            <input
            type="text"
            value={username}
            onChange = {(e) => setuserName(e.target.value)}
            required
            />
            <label>Email:</label>
            <input
            type="email"
            value={email}
            onChange = {(e) => setEmail(e.target.value)}
            required
            />
            <label>Password:</label>
            <input
            type="password"
            value={password}
            autoComplete="new-password"  
            onChange = {(e) => setPassword(e.target.value)}
            required
            />
            <button type='submit'className='btn'>Signup</button>
        </form> 
        <p className='register-link'>
          Registered? <a href="/login">Login here</a>
        </p>
    </div>
  )
}

export default RegisterPage