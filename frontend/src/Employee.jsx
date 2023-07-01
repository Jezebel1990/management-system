// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Link } from 'react-router-dom';

function Employee() {
  return (
    <div className='px-5 py-3'>
        <div className='d-flex justify-content-center'>
        <h3>Lista de Funcionários</h3>
    </div>
    <Link to="/create" className='btn btn-danger'>Adicionar Funcionários</Link>
    </div>
  )
}

export default Employee