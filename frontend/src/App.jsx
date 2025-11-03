import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
// import Login from "./pages/ProfLogin";
// import SignUp from "./pages/Signup";
import ServiceProfiles from "./pages/ServiceProfiles";
import BookService from './pages/Booking';
import UserLogin from "./pages/UserLogin";
import UserRegister from "./pages/UserRegister";
import ProviderDashboard from "./pages/ProviderDashBoard";



const App = () => {
  return (
    <BrowserRouter>
      <Routes>
         <Route path="/" element={<UserLogin />} />
        <Route path="/home" element={<Home />} />
        {/* <Route path="/login" element={<Choice/>} />
        <Route path="/signup" element={<SignUp />} />  */}
        <Route path="/services/:serviceType" element={<ServiceProfiles/>} />
        <Route path="/services/:serviceType/booking" element={<BookService/>} />
        <Route path="/register" element={<UserRegister/>} />
        <Route path="/provider-dashboard" element={<ProviderDashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
