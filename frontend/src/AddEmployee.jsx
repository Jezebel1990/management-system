/* eslint-disable no-unused-vars */
 import axios from 'axios';
 // eslint-disable-next-line no-unused-vars
 import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';

function AddEmployee () {
    const [data, setData] = useState({
      name: '',
      email: '',
      password: '',
      address: '',
      salary: '',
      image: ''
    })

const navigate = useNavigate()

const handleSubmit = (event) => {
  event.preventDefault();
  const formdata = new FormData();
  formdata.append("name", data.name);
  formdata.append("email", data.email);
  formdata.append("password", data.password);
  formdata.append("address", data.address);
  formdata.append("salary", data.salary);
  formdata.append("image", data.image);
  axios.post('http://localhost:8080/create',formdata)
  .then(res => {
    navigate('/employee')
  })
  .catch(err => console.log(err));

}
  return (
    <div className='d-flex flex-column align-items-center pt-4'>
      <h2>Adicionar Funcionários</h2>
   <form className="row g-3 w-50" onSubmit={handleSubmit}>
<div className='col-12'>
  <label htmlFor="inputName" className="form-label">Nome:</label>
  <input type='text' className='form-control' id='inputName' placeholder='Fulano Beltrano' autoComplete='off'
  onChange={e => setData({...data, name: e.target.value})}/>
  </div>   

  <div className='col-12'>
        <label htmlFor='inputEmail4' className='form-label'>Email:</label>
        <input type="email" className='form-control'id='inputEmail4' placeholder='fulano@beltrano.com' autoComplete='off'
        onChange={e => setData({...data, email: e.target.value})}/>
      </div>

 <div className='col-12'>
      <label htmlFor='inputPassword4' className='form-label'>Senha:</label>
      <input type='password' className='form-control' id='inputPassword4' placeholder='******'
      onChange={e => setData({...data, password: e.target.value})} />
 </div>

<div className='col-12'> 
   <label htmlFor='inputSalary' className='form-label'>Salário</label>
   <input type='text' className='form-control' id='inputSalary' placeholder='5000' autoComplete='off' onChange={e => setData({...data, salary: e.target.value})}/>
</div>

<div className='col-12'>
   <label htmlFor='inputAddress' className='form-label'>Endereço</label>
   <input type='text' className='form-control' id='inputAddress' placeholder='Avenida Alameda das Travessas,111' autoComplete='off'
   onChange={e => setData({...data, address: e.target.value})} />
</div>

<div className='col-12 mb-3'>
   <label className='form-label' htmlFor='inputGroupFile01'>Selecionar Imagem</label>
   <input type='file' className='form-control' id='inputGroupFile01'
   onChange={e => setData({...data, image: e.target.files[0]})}/>
</div>

<div className='col-12'>
<button type='submit' className='btn btn-primary'>Criar</button>
</div>
  </form> 
  </div>
  );
}

export default AddEmployee;