import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from './components/landingPage/LandingPage.js'
import ChooseAccount from "./components/authentication/ChooseAccount.js";
import { AuthProvider } from './components/AuthContext.js';
import Layout from './components/Layout.js';
import OTP from './components/authentication/OTP.js';
import SignUpLayout from './components/authentication/SignUpLayout.js'
import SignIn from './components/authentication/SignIn.js'
import HowToHire from './components/landingPage/HowToHire.js'
import ContactUs from './components/ContactUs.js';
import FreelancerProfile from './components/profile/FreelancerProfile.js';
import ClientProfile from './components/profile/ClientProfile.js';
import ProfileSetting from './components/profile/ProfileSetting.js';


function App() {


  return (
    <AuthProvider>
      <div className="App">
        <BrowserRouter>
          <Layout>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/sign_up" element={<SignUpLayout />}>
                  <Route index element={<ChooseAccount />} />
                  <Route path="otp" element={<OTP />} />
                </Route>
                <Route path='/log_in' element={<SignIn />} />
                <Route path='/how_to_hire' element={<HowToHire />} />
                <Route path='/contact_us' element={<ContactUs/>}/>
                <Route path="/freelancer/profile/:id" element={<FreelancerProfile/>}/>
                <Route path='/client/profile/:id' element={<ClientProfile/>}/>
                <Route path='/freelancer/profile/:id/setting' element={<ProfileSetting/>}/>
              </Routes>
          </Layout>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
