// eslint-disable-next-line no-unused-vars
import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './style.css';


function Dashboard() {
  return (
    <div className="container-fluid">
    <div className="row flex-nowrap">
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg custom-bg">
            <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
                <a href="/" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                    <span className="fs-5 fw-bolder d-none d-sm-inline">Administrador</span>
                </a>
                <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                    <li className="nav-item">
                        <a href="#" className="nav-link text-white align-middle px-0">
                            <i className="fs-4 bi-speedometer"></i> <span className="ms-1 d-none d-sm-inline">Projetos</span>
                        </a>
                    </li>

                    <li>
                        <a href="#submenu1" data-bs-toggle="collapse" className="nav-link px-0 align-middle text-white">
                            <i className="fs-4 bi-people"></i> <span className="ms-1 d-none d-sm-inline">Gestão de funcionários</span> </a>
                            </li>
                    <li>
                        <a href="#" className="nav-link px-0 align-middle text-white">
                            <i className="fs-4 bi-person"></i> <span className="ms-1 d-none d-sm-inline">Perfil</span></a>
                    </li>
                    <li>
                        <a href="#" className="nav-link px-0 align-middle text-white">
                            <i className="fs-4 bi-power"></i> <span className="ms-1 d-none d-sm-inline">Sair</span> </a>
                    </li>
                </ul>
            </div>
        </div>
        <div className="col py-3">
           <div>
            
           </div>
        </div>
    </div>
</div>
  )
}

export default Dashboard