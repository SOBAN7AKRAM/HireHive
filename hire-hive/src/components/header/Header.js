import Logo from './Logo.js';
import NavLinks from './NavLinks';
import SearchForm from './SearchForm.js';
import Buttons from './Buttons.js';
import { useAuth } from '../AuthContext.js';
import ProfileLogo from './ProfileLogo.js';
import LogOut from '../authentication/LogOut.js';

const Header = () => {
    // get the authentication state from the auth context
    const { isAuthenticated } = useAuth(); 
    

    return (
        <header id='header'>
            <nav className='navbar navbar-expand-sm bg-white fixed-top'>
                <div className='container-fluid'>
                    <Logo/>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-between" id="mynavbar">
                        <NavLinks/>
                        <SearchForm/>
                    </div>
                    {!isAuthenticated && <Buttons/>}
                    {isAuthenticated && <LogOut/>}
                    {isAuthenticated && <ProfileLogo/>}
                </div>
            </nav>
        </header>
    )
}
export default Header;
