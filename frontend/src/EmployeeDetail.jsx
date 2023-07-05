import axios from 'axios';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import 'bootstrap-icons/font/bootstrap-icons.css';
import './style.css';

function EmployeeDetail() {
    const {id} = useParams();
    const navigate = useNavigate()
    const [employee, setEmployee] = useState([])
    useEffect(()=> {
        axios.get('http://localhost:8080/get/'+id)
        .then(res => setEmployee(res.data.Result[0]))
        .catch(err => console.log(err));
    })
 const handleLogout = () => {
                axios.get('http://localhost:8080/logout')
    .then(res => {
            navigate('/start')
    }).catch(err => console.log(err));
}

  return (
    <div>
    <div className='d-flex justify-content-center flex-column align-items-center mt-3'>
        <img src={`http://localhost:8080/images/`+employee.image} alt="" className='empImg'/>
        <div className='d-flex align-items-center flex-column mt-5'>
            <h3>Nome: {employee.name}</h3>
            <h3>Email: {employee.email}</h3>
            <h3>Salário: {employee.salary}</h3>
        </div>
        <div>
            <button className='btn btn-primary me-2'>Editar</button>
            <button className='btn btn-danger' onClick={handleLogout}>Sair</button>
        </div>
    </div>
</div>
  )
}

export default EmployeeDetail;