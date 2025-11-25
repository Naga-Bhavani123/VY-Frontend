import { useState } from 'react'
import ProtectedRoute from './ProtectedRoute.jsx'

import RegisterPage from './components/Register/index.jsx'
import Login from "./components/Login/index.jsx"
import Home from "./components/Home/index.jsx"
import {BrowserRouter, Routes, Route} from "react-router-dom"
import HrPolicies from './components/HrPolices/index.jsx'
import Attendance from './components/Attendance/index.jsx'
import AddingEmployee from './components/AddEmployee/index.jsx'
import AllEmployees from "./components/AllEmployees/index.jsx"
import Compensation from './components/Compensation/index.jsx'
import Referal from './components/Referal/index.jsx'
import NotFound from './components/NotFound/index.jsx'
import ProfilePage from './components/Profile/index.jsx'
import './App.css'

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path = "/register" element = {<RegisterPage/>}/>
      <Route path = "/login" element = {<Login/>} />
      <Route path = "/" element = {<ProtectedRoute><Home/></ProtectedRoute>} />
      <Route path = "/attendance" element = {<ProtectedRoute><Attendance/></ProtectedRoute>}/>
      <Route path = "/admin/create-employee" element = {<ProtectedRoute><AddingEmployee/></ProtectedRoute>} />
      <Route path = "/admin/employees" element = {<ProtectedRoute><AllEmployees/></ProtectedRoute>} />
       <Route
    path="/policies"
    element={
      <ProtectedRoute>
        <HrPolicies />
      </ProtectedRoute>
    }
  />
  <Route path = "/profile" element = {<ProtectedRoute><ProfilePage/></ProtectedRoute>}/>
      <Route path = "/compensation" element = {<ProtectedRoute><Compensation/></ProtectedRoute>}/>
          <Route path = "/recruitment" element = {<ProtectedRoute><Referal/></ProtectedRoute>}/>
<Route path="*" element={<ProtectedRoute><NotFound /></ProtectedRoute>} />

    </Routes>
    </BrowserRouter>
  )
  
}

export default App
