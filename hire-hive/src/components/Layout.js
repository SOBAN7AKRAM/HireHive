import { useLocation } from "react-router-dom";
import Header from "./header/Header";
import Logo from './header/Logo';
import Footer from "./Footer";
import SimpleFooter from "./SimpleFooter";

const Layout = ({ children }) => {
    const location = useLocation();

    const shouldNotRenderHeader = location.pathname === '/sign_up/' || location.pathname === '/sign_up' || location.pathname === '/log_in' || location.pathname === '/log_in/' || location.pathname === '/sign_up/otp/' || location.pathname === '/sign_up/otp';
    return (
        <div className="app-container">
            {!shouldNotRenderHeader && <Header />}
            {shouldNotRenderHeader && <div className="logoDiv"><Logo /></div>}
            <div className="content-wrap">{children}</div>
            <div className="footer">
                {!shouldNotRenderHeader && <Footer/>}
                <SimpleFooter/>
            </div>
        </div>
    )
}
export default Layout;