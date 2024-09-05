import { useLocation } from "react-router-dom";
import Header from "./header/Header";
import Logo from './header/Logo';

const Layout = ({ children }) => {
    const location = useLocation();

    const shouldNotRenderHeader = location.pathname === '/sign_up' || location.pathname === '/log_in';
    return (
        <div className="app-container">
            {!shouldNotRenderHeader && <Header />}
            {shouldNotRenderHeader && <div className="logoDiv"><Logo /></div>}
            <div className="content-wrap">{children}</div>
        </div>
    )
}
export default Layout;