// eslint-disable-next-line no-unused-vars
import React from 'react'
import Login from './Login'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Dashboard from './Dashboard'

function App() {
  return (
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Dashboard />}></Route>
        <Route path='/login' element={<Login />}></Route>
      </Routes>
         <Login />
      </BrowserRouter>
   
    
  
  )
}

export default App
