import { useAuth } from "../AuthContext";
import { Link } from "react-router-dom";
import GoogleLogo from "./GoogleLogo.js";
import OR from '../OR.js'
const SignIn = () => {
    const isAuthenticated = useAuth();
    if (isAuthenticated) {
        // navigate to the page after sign Up or login
    }

    function handleContinueClick() {
        // navigate to the next page
    }

    return (
        <div className="signUpDiv">
            <div className="signInContainer">
                <h1 className="heading mt-4">Log in to HireHive</h1>
                <form id="signInForm">
                    <input type="Email" className="form-control mt-3 mb-3" placeholder="Email" />
                    <input type="password" className="form-control mt-3 mb-3" placeholder="Password" />
                    <input type="submit" className="btn btn-primary continueBtn mt-3" onClick={handleContinueClick} value="Continue" />
                    <div className="mt-4 mb-4 w-100">
                        <OR />
                    </div>
                    <GoogleLogo />
                    <div className="notHaveAccount mt-5">
                        <div></div>
                        <span className="d-block">Don't have an HireHive account?</span>
                        <div></div>
                    </div>
                    <Link className="btn mt-4 btnOutlineSuccess" to={'/sign_up'}>Sign Up</Link>

                </form>
            </div>
        </div>
    )
}
export default SignIn;
