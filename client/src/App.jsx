import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./page/Home";

import Register from "./page/Register";
import Login from "./page/Login";

import Header from "./components/Header";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import DashBoard from "./page/DashBoard";
import AdminPrivateRoute from "./components/AdminPrivateRoute";

import UpadatePost from "./page/UpadatePost";
import CreateCourse from "./page/CreateCourse";

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
          <Route path='/update-post/:postId' element={<UpadatePost />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
