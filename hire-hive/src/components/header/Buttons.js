import {Link} from 'react-router-dom'
const Buttons = () => {
    return (
        <div className="buttons">
            <Link className='btn simpleBtn' id='logInBtn' to="/log_in">Log In</Link>
            <Link className="btn btn-primary" id="signUpBtn" to="/sign_up">Sign Up</Link>
        </div>
    )
}
export default Buttons;
