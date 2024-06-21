import { Outlet, Link } from 'react-router-dom';
import logo from '../assets/logo.png'
import style from '../styles/styles.css'
const Footer = () => {
    return (
        <header>
            <nav className='navbar navbar-expand-sm bg-white fixed-top'>
                <div className='container-fluid'>
                    <img className="logo navbar-brand" src={logo} alt="logo" img />
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="mynavbar">
                        <ul class="navbar-nav me-auto">
                            <li class="nav-item">
                                <a class="nav-link" href='#'>Link</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href='#'>Link</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#:void(0)">Link</a>
                            </li>
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">Dropdown</a>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item" href="#">Link</a></li>
                                    <li><a class="dropdown-item" href="#">Another link</a></li>
                                    <li><a class="dropdown-item" href="#">A third link</a></li>
                                </ul>
                            </li>
                        </ul>
                        <form class="d-flex">
                            <input class="form-control me-2" type="text" placeholder="Search" />
                            <button class="btn btn-primary" type="button">Search</button>
                        </form>
                    </div>
                </div>
            </nav>
            <Outlet/>
        </header>
    )
}
export default Footer;



