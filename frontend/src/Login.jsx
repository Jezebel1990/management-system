// eslint-disable-next-line no-unused-vars
import  React, {useState} from 'react';
import './style.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

 function Login() {

  const [values, setValues] = useState({
    email: '',
    password: ''
  })

  const navigate = useNavigate()
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://localhost:8081/login', values)
    .then(res => {
      if(res.data.Status === 'Success') { 
        navigate('/');
      } else {
        setError(res.data.Error);
      }
    })
    .catch(err => console.log(err));
  }

  return (
    <div className='d-flex justify-content-center align-items-center vh-100 loginPage'>
        <div className='p-3 rounded w-25 border loginForm'>
<h2>Login</h2>
<form onSubmit={handleSubmit}>
    <div className='mb-3'>
        <label htmlFor='email'><strong>Email</strong></label>
        <input type='email' placeholder='Insira seu Email' name='email'
        onChange={e => setValues({...values, email: e.target.value})}
        className='form-control rounded-0' autoComplete='off'/>
    </div>
<div className='mb-3'>
<label htmlFor='password'><strong>Senha</strong></label>
<input type='password' placeholder='Insira sua Senha' name='password'
  onChange={e => setValues({...values, password: e.target.value})}
className='form-control rounded-0' />
</div>
<button type='submit' className='btn btn-danger w-100 rounded-0'>Logar</button>
<p>Você concorda com os termos e politicas</p>
</form>
        </div>
      
    </div>
  )
}
export default Login;