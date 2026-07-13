import { Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './components/layouts/Navbar'
import Home from './pages/Home'
import Discover from './pages/Discover'
import ContactUs from './pages/ContactUs'
import AboutUs from './pages/AboutUs'
import SignUp from './pages/authentication/SignUp'
import Login from './pages/authentication/Login'

function App() {
  return (
    <>
      <Navbar />
    <Routes>
      <Route path='/' element = {<Home />} />
      <Route path='/discover' element = {<Discover />} />
      <Route path='/contact-us' element = {<ContactUs />} />
      <Route path='/about-us' element = {<AboutUs />} />
      <Route path='/sign-up' element = {<SignUp />} />
      <Route path='/login' element = {<Login />} />
    </Routes>
    </>
  )
}

export default App
