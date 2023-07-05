import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './style.css';

function Employee() {
 
  const [data, setData] = useState([])

  useEffect(()=> {
    axios.get('http://localhost:8080/getEmployee')
    .then(res => {
      if(res.data.Status === "Success") {
        setData(res.data.Result);
      } else {
        alert("Error")
      }
    })
    .catch(err => console.log(err));
  }, [])

  const handleDelete = (id) => {
    axios.delete('http://localhost:8080/delete/'+id)
    .then(res => {
      if(res.data.Status === "Success") {
        window.location.reload(true);
      } else {
        alert("Error")
      }
    } )
    .catch(err => console.log(err));
  }

  return (
    <div className='px-5 py-3'>
        <div className='d-flex justify-content-center mt-2'>
        <h3>Lista de Funcionários</h3>
    </div>
    <Link to="/create" className='btn btn-danger'>Adicionar Funcionários</Link>
    <div className='mt-3'>
<table className='table'>
<thead>
  <tr>
    <th>Nome</th>
    <th>Imagem</th>
    <th>Email</th>
    <th>Endereço</th>
    <th>Salário</th>
    <th>Ação</th>
  </tr>
</thead>
<tbody>
  {data.map((employee, index) => {
   return <tr key={index}>
      <td>{employee.name}</td>
      <td>{
        <img src={`http://localhost:8080/images/`+employee.image} alt='' className='employee_image'/>
      }</td>
      <td>{employee.email}</td>
      <td>{employee.address}</td>
      <td>{employee.salary}</td>
     <td>
      <Link to={`/employeeEdit/`+employee.id} className='btn btn-primary btn-sm me-2'>Editar</Link>
      <button onClick={e => handleDelete(employee.id)} className='btn btn-sm btn-danger'>Deletar</button>
      </td>
    </tr>
  })}
</tbody>
</table>
    </div>
    </div>
  )
}

export default Employee;