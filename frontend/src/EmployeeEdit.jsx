/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import axios from 'axios';
// eslint-disable-next-line no-unused-vars
import React , {useEffect, useState}from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function EmployeeEdit() {

    const [data, setData] = useState({
        name: '',
        email: '',
        address: '',
        salary: '',
      })
  
  const navigate = useNavigate()
  const {id} = useParams();
  
useEffect(()=> {
    // eslint-disable-next-line react-hooks/rules-of-hooks
 
    axios.get('http://localhost:8081/get/'+id)
    .then(res => {
      setData({...data, name: res.data.Result[0].name,
              email: res.data.Result[0].email,
              address: res.data.Result[0].address,
              salary: res.data.Result[0].salary
    })
    })
    .catch(err =>console.log(err));

// eslint-disable-next-line react-hooks/exhaustive-deps
}, [])

  const handleSubmit = (event) => {
    event.preventDefault();
     axios.put('http://localhost:8081/update/'+id, data)
     .then(res => {
          if(res.data.Status === "Success") {
                  navigate('/employee')

      }
     })
    .catch(err => console.log(err));
  
  }
    return (
      <div className='d-flex flex-column align-items-center pt-4'>
        <h2>Alterar Funcionários</h2>
     <form className="row g-3 w-50" onSubmit={handleSubmit}>
  <div className='col-12'>
    <label htmlFor="inputName" className="form-label">Nome:</label>
    <input type='text' className='form-control' id='inputName' placeholder='Fulano Beltrano' autoComplete='off'
    onChange={e => setData({...data, name: e.target.value})} value={data.name}/>
    </div>   
  
    <div className='col-12'>
          <label htmlFor='inputEmail4' className='form-label'>Email:</label>
          <input type="email" className='form-control'id='inputEmail4' placeholder='fulano@beltrano.com' autoComplete='off'
          onChange={e => setData({...data, email: e.target.value})} value={data.email}/>
        </div>
  
  <div className='col-12'> 
     <label htmlFor='inputSalary' className='form-label'>Salário</label>
     <input type='text' className='form-control' id='inputSalary' placeholder='5000' autoComplete='off' onChange={e => setData({...data, salary: e.target.value})} value={data.salary}/>
  </div>
  
  <div className='col-12'>
     <label htmlFor='inputAddress' className='form-label'>Endereço</label>
     <input type='text' className='form-control' id='inputAddress' placeholder='Avenida Alameda das Travessas,111' autoComplete='off'
     onChange={e => setData({...data, address: e.target.value})} value={data.address} />
  </div>
  
  <div className='col-12'>
  <button type='submit' className='btn btn-primary'>Alterar</button>
  </div>
    </form> 
    </div>
    );
  }



export default EmployeeEdit;