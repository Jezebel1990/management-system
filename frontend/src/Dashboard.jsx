// eslint-disable-next-line no-unused-vars
import React, { useEffect } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './style.css';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';


function Dashboard() {
    const navigate = useNavigate()
    axios.defaults.withCredentials = true;
        useEffect(()=>{
            axios.get('http://localhost:8080/dashboard')
            .then(res => {
                if(res.data.Status === "Success") { /* empty */ 
                    if(res.data.role === "admin") {
                        navigate('/');
                    } else {
                        const id = res.data.id;
                        navigate('/employeedetail/'+id)
                }
            } else {
                    navigate('/start')
                }
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])

  const handleLogout = () => {
     axios.get('http://localhost:8080/logout')
     // eslint-disable-next-line no-unused-vars
     .then(res => {
        navigate('/start')
     }).catch(err => console.log(err));
  }

  return (
    <div className="container-fluid">
    <div className="row flex-nowrap">
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg custom-bg">
            <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
                <a href="/" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                    <span className="fs-5 fw-bolder d-none d-sm-inline">Administrador</span>
                </a>
                <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                    <li>
                        <Link to="/" data-bs-toggle="collapse" className="nav-link text-white align-middle px-0">
                            <i className="fs-4 bi-speedometer2"></i> <span className="ms-1 d-none d-sm-inline">Painel</span>
                        </Link>
                    </li>

                    <li>
                        <Link to="/employee" className="nav-link px-0 align-middle text-white">
                            <i className="fs-4 bi-people"></i> <span className="ms-1 d-none d-sm-inline">Gestão de funcionários</span> </Link>
                            </li>
                    <li>
                        <Link to="profile" className="nav-link px-0 align-middle text-white">
                            <i className="fs-4 bi-person"></i> <span className="ms-1 d-none d-sm-inline">Perfil</span></Link>
                    </li>
                    <li onClick={handleLogout}>
                        <a href="#" className="nav-link px-0 align-middle text-white">
                            <i className="fs-4 bi-power"></i> <span className="ms-1 d-none d-sm-inline">Sair</span></a>
                    </li>
                </ul>
            </div>
        </div>
        <div className="col p-0 m-0">
           <div className='p-2 d-flex justify-content-center shadow'>
            <h4>Sistema de gestão de funcionários</h4>
           </div>
           <Outlet />
        </div>
    </div>
</div>
  )
}

export default Dashboard;