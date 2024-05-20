import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./page/Home";

import Register from "./page/Register";
import Login from "./page/Login";

import Header from "./components/Header";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import DashBoard from "./page/DashBoard";
import AdminPrivateRoute from "./components/AdminPrivateRoute";

import UpdateCourse from "./page/UpdateCourse";
import CreateCourse from "./page/CreateCourse";
import CreateSchedule from "./page/CreateSchedule";
import About from "./page/About";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
      
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashBoard />} />
        </Route>
        <Route element={<AdminPrivateRoute />}>
          <Route path='/create-course' element={<CreateCourse />} />
          <Route path='/create-schedule' element={<CreateSchedule />} />
          <Route path='/update-course/:courseId' element={<UpdateCourse />} />
          <Route path='/about' element={<About />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
