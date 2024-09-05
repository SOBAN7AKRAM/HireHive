import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from './components/LandingPage'
import ChooseAccount from "./components/authentication/ChooseAccount.js";
import { AuthProvider } from './components/AuthContext.js';
import Layout from './components/Layout.js';


function App() {


  return (
    <AuthProvider>
      <div className="App">
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path='/sign_up' element={<ChooseAccount />} Route />
            </Routes>
          </Layout>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
