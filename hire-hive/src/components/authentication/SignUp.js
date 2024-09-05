import OR from "../OR";
import googleLogo from '../../assets/google.png'
import SignUpForm from "./SignUpForm";
import { Link } from "react-router-dom";
const SignUp = (props) => {
    return (
        <div className="signUpDiv">
            <div className="signUpContainer">
                <h1 className="heading">{props.selectedOption === 'client' ? "Sign up to hire talent" : "Sign up to find work you love"}</h1>
                <div id="continueWithGoogle" className="btn btn-primary">
                    <img className="googleLogo" src={googleLogo} alt="logo" />
                    Continue with Google
                </div>
                <OR />
                <SignUpForm user={props.selectedOption} />
                <div className='boxContainer'>
                    <label>Already have an account?</label>
                    <Link to="/log_in" className='link'>Log In</Link>
                </div>
            </div>
        </div>
    )
}
export default SignUp;
