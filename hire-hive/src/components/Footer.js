import { Link } from "react-router-dom";
const Footer = () => {
    return (
        <div>
            <div className="divContainer">
                <div className="flexContainer">
                    <Link className="linkWhite" to="/find_work">Find Work</Link>
                    <Link className="linkWhite" to="/find_talent">Find Talent</Link>
                    <Link className="linkWhite" to="/sign_up">Join Now</Link>
                </div>
                <div className="flexContainer">
                    <Link className="linkWhite" to="/">HireHive Dashboard</Link>
                    <Link className="linkWhite" to="/about_us">About Us</Link>
                    <Link className="linkWhite" to="/contact_us">Contact Us</Link>

                </div>
                <div className="flexContainer">
                    <Link className="linkWhite" to="/terms_of_service">Terms of Service</Link>
                </div>
            </div>
            <div className="line mb-3 mt-5"></div>
           
        </div>
    )
}
export default Footer;