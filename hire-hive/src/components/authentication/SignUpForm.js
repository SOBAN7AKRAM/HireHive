import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Password from "./Password";
import SelectCountry from "./SelectCountry";
import { SignUpContext } from "../context/SignUpContext";

const SignUpForm = (props) => {
    // to set the signUp form data in SignUpContext
    const {setSignUpData} = useContext(SignUpContext);
    
    const [passwordError, setPasswordError] = useState(false);
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    function handleClick(event) {
        event.preventDefault();
        if (passwordError) return;

        const form = document.getElementById('signUpForm');
        const data = new FormData(form);

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const formValues = {
            role: props.user,
            first_name: data.get('firstName'),
            last_name: data.get('lastName'),
            email: data.get('email'),
            password: data.get('pswd'),
            location: data.get('country'),
        };
        setSignUpData(formValues);
        navigate('/sign_up/otp')
    }
   

    return (
        <form id="signUpForm">
            <div className="row">
                <div className="col">
                    <label htmlFor="email" className="form-label">First Name</label>
                    <input type="text" className="form-control" name="firstName" required />
                </div>
                <div className="col">
                    <label htmlFor="email" className="form-label">Last Name</label>
                    <input type="text" className="form-control" name="lastName" />
                </div>
            </div>
            <div className="mb-3 mt-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" className="form-control" id="email" name="email" required />
            </div>
            <div className="mb-3">
                <Password setPasswordError={setPasswordError} password={password} setPassword={setPassword} label="Password" />
            </div>
            <div className="mb-3">
                <SelectCountry />
            </div>
            <div className="mb-3 centerDiv">
                <input type="submit" onClick={handleClick} className="btn btn-primary" id="createAccountBtn" value="Create my account" />
            </div>
        </form>
    );
};

export default SignUpForm;