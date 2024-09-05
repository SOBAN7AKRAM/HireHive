import { Link } from "react-router-dom"
const NavLinks = () => {
    return (
        <ul className="navbar-nav me-auto">
            <li className="nav-item">
                <Link className='nav-link' to="find_work">Find Work</Link>
            </li>
            <li className="nav-item">
                <Link className='nav-link' to="find_talent">Find Talent</Link>
            </li>
            <li className="nav-item">
                <Link className='nav-link' to="about_us">About Us</Link>
            </li>
        </ul>
    )
}
export default  NavLinks;
