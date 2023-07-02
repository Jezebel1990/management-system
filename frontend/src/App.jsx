
// eslint-disable-next-line no-unused-vars
import React from 'react'
import Login from './Login'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Dashboard from './Dashboard'
import Employee from './Employee'
import Profile from './Profile'
import Home from './Home'
import AddEmployee from './AddEmployee'
import EmployeeEdit from './EmployeeEdit'

function App() {
  return (
      <BrowserRouter>
      <Routes>
      
        <Route path='/' element={<Dashboard />}>
        <Route path='' element={< Home />}></Route>
        <Route path='/employee' element={<Employee />}></Route>
        <Route path='/profile' element={<Profile />}></Route>
        <Route path='/create' element={<AddEmployee />}></Route>
        <Route path='employeeEdit:id' element={<EmployeeEdit/>}></Route>
        </Route>
        <Route path='/login' element={<Login />}></Route>
      </Routes>
      </BrowserRouter>
   
  )
}

export default App
