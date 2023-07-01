// eslint-disable-next-line no-unused-vars
import React from 'react'

function Home() {
  return (
    <div>
    <div className='p-3 d-flex justify-content-around mt-3'>
      <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
        <div className='text-center pb-1'>
        <h4>Administrador</h4>
        <hr />
        </div>
        <div className=''>
        <h5>Total: {}</h5>
      </div>
      </div>
      <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
        <div className='text-center pb-1'>
      <h4>Funcionário</h4>
      </div>
        <hr />
        <div className=''>
        <h5>Total: {}</h5>
      </div>
      </div>
      <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
      <div className='text-center pb-1'>
      <h4>Salário</h4>
      </div>
        <hr />
        <div className=''>
        <h5>Total: {}</h5>
      </div>
    </div>
</div>


<div className='mt-4 px-5 pt-3'> 
    <h3>Lista de Administradores</h3>
    <table className='table'>
        <thead>
            <th>
                <th>Email</th>
                <th>Função</th>
            </th>
        </thead>
        <tbody>

        </tbody>
    </table>
</div>
</div>

  )
}

export default Home