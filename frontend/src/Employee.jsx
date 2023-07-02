/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
import axios from 'axios';
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Employee() {
  // eslint-disable-next-line no-unused-vars
  const [data, setData] = useState([])

  useEffect(()=> {
    axios.get('http://localhost:8081/getEmployee')
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
    axios.delete('http://localhost:8081/delete/'+id)
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
        <img src={`http://localhost:8081/images/`+employee.image} alt='' className='employee_image'/>
      }</td>
      <td>{employee.email}</td>
      <td>{employee.address}</td>
      <td>{employee.salary}</td>
     <td>
      <Link to={`/employeeEdit/`+employee.id} className='btn btn-primary btn-sm me-2'>editar</Link>
      <button onClick={event => handleDelete(employee.id)}  className='btn btn-sm btn-danger'>deletar</button>
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