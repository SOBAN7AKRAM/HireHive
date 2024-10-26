import { useAuth } from "../AuthContext";
import { Link, Navigate, useNavigate } from "react-router-dom";
import GoogleLogo from "./GoogleLogo.js";
import OR from '../OR.js'
import useCsrfToken from "./useCsrfToken.js";
const SignIn = () => {
    const {isAuthenticated, setIsAuthenticated, user, setUser} = useAuth();
    const csrfToken = useCsrfToken();
    const navigate = useNavigate();
    if (isAuthenticated) {
        // navigate to the page after sign Up or login
        navigate('/')
    }


    
    function postSignInData(data) {
        fetch("http://localhost:8000/sign_in", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken
            },
            credentials: "include",
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            if (data.success){
                setUser(data)
                setIsAuthenticated(true)
                localStorage.setItem('jwt_token', data.token);
                navigate("/")
            } 
            else{
                alert(data.error)
            }
        })
        .catch(err => console.log(err))
    }


    function handleContinueClick(event) {
        event.preventDefault();
        const form = document.getElementById('signInForm');
        const data = new FormData(form);

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const formValues = {
            email: data.get('email'),
            password: data.get('pswd'),
        };
        // navigate to the next page
        postSignInData(formValues)

    }


    return (
        <div className="signUpDiv">
            <div className="signInContainer">
                <h1 className="heading mt-4">Log in to HireHive</h1>
                <form id="signInForm">
                    <input type="Email" name="email" className="form-control mt-3 mb-3" placeholder="Email" required/>
                    <input type="password" name="pswd" className="form-control mt-3 mb-3" placeholder="Password"  required/>
                    <input type="submit" className="btn btn-primary continueBtn mt-3" onClick={handleContinueClick} value="Continue" />
                    <div className="mt-4 mb-4 w-100">
                        <OR />
                    </div>
                    <GoogleLogo role={""}/>
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
