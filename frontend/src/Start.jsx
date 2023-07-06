import React from 'react'
import { useNavigate } from 'react-router-dom';

function Start() {
    const navigate = useNavigate()
  return (
    <div className='d-flex justify-content-center align-items-center vh-100 loginStart' >
        <div className='p-3 rounded w-25 border loginFormStart text-center'>
<h2>Logar como:</h2>
<div className='d-flex justify-content-between mt-5'>
           <button className='btn btn-primary btn-lg' onClick={e => navigate('/employeelogin')}>Funcionário</button>
           <button className='btn btn-danger btn-lg' onClick={e => navigate('/login')}>Administrador</button>
        </div>
        </div>
    </div>
  )
}

export default Start;