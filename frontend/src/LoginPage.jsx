import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginUser } from './services/api';

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState(" ");
    const [password, setPassword] = useState("");


    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
          const response = await LoginUser({email,password});
          if (response.error) {
            alert(response.message); // Display specific error message
        } else {
            alert("Login Successful");
            navigate('/weather');
        }
        }
        catch(error){
          alert(`${error.message}`);
        }
    };

  return (
    <div className='login-container'>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
        <input 
            type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    autoComplete="new-password"  
                    onChange={(e) => setPassword(e.target.value)} 
                />

            <button type='submit'className='btn'>Login</button>
        </form> 
        <p className='register-link'>
          Not registered? <a href="/signup">Register here</a>
        </p>
    </div>
  )
}

export default LoginPage