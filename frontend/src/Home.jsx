import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Profile from './Profile';

function Home() {
  const [adminCount, setAdminCount] = useState()
  const [employeeCount, setEmployeeCount] = useState();
  const [salary, setSalary] = useState();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

 
  useEffect(() => {
   axios.get('http://localhost:8080/adminCount')
   .then(res => {
    setAdminCount(res.data[0].admin)
   }).catch(err => console.log(err));

axios.get('http://localhost:8080/employeeCount')
.then(res => {
   setEmployeeCount(res.data[0].employee)
}).catch(err => console.log(err));

axios.get('http://localhost:8080/salary')
.then(res => {
  setSalary(res.data[0].sumOfSalary)
}).catch(err => console.log(err));


axios.get('http://localhost:8080/profile', {
      params: {
        email: 'admin@gmail.com',
      },
    })
      .then((response) => {
        setEmail(response.data.email);
        setRole(response.data.role);
      })
      .catch((error) => {
        console.error('Error in profile', error);
      });

}, []);

  return (
    <div>
      <div className='p-3 d-flex justify-content-around mt-3'>
        <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
          <div className='text-center pb-1'>
            <h4>Administrador</h4>
          </div>
          <hr />
          <div>
            <h5>Total: {adminCount}</h5>
          </div>
        </div>
        <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
          <div className='text-center pb-1'>
            <h4>Funcionário</h4>
          </div>
          <hr />
          <div>
            <h5>Total: {employeeCount}</h5>
          </div>
        </div>
        <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
          <div className='text-center pb-1'>
            <h4>Salário</h4>
          </div>
          <hr />
          <div>
            <h5>Total: {salary}</h5>
          </div>
        </div>
      </div>

      <div className='mt-4 px-5 pt-3'>
        <h3>Lista de Administradores</h3>
        <table className='table'>
          <thead>
            <tr>
              <th>Email</th>
              <th>Função</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{email}</td>
              <td>{role}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Home;