import React from 'react'
import './style.css'


 function Login() {
  return (
    <div className='d-flex justify-content-center align-items-center vh-100 loginPage'>
        <div className='p-3 rounded w-25 border loginForm'>
<h2>Login</h2>
<form>
    <div className='mb-3'>
        <label htmlFor='email'><strong>Email</strong></label>
        <input type='email' placeholder='Insira seu Email' name='email'
        className='form-control rounded-0' autoComplete='off'/>
    </div>
<div className='mb-3'>
<label htmlFor='password'><strong>Senha</strong></label>
<input type='password' placeholder='Insira sua Senha' name='password'
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