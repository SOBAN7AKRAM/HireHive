import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from './components/LandingPage'
import ChooseAccount from "./components/authentication/ChooseAccount.js";
import { AuthProvider } from './components/AuthContext.js';
import Layout from './components/Layout.js';
import OTP from './components/authentication/OTP.js';
// import { SignUpProvider } from './components/context/SignUpContext.js';
import SignUpLayout from './components/authentication/SignUpLayout.js'


function App() {


  return (
    <AuthProvider>
      <div className="App">
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/sign_up" element={<SignUpLayout/>}>
                <Route index element={<ChooseAccount />}/>
                <Route path="otp" element={<OTP />} />
              </Route>
            </Routes>
          </Layout>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
