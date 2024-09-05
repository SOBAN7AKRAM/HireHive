import { useState } from "react";
import Password from "./Password";
import SelectCountry from "./SelectCountry";
import OTP from "./OTP";
const SignUpForm = (props) => {
    
    const [passwordError, setPasswordError] = useState(false)
    const [showOtp, setShowOtp] = useState(false)
    const [formValues, setFormValues] = useState()

    function handleClick (event) {
        event.preventDefault();
        if (passwordError){
                return;
            }
            const form = document.getElementById('signUpForm');
            const data = new FormData(form);
            if (!form.checkValidity()){
                form.reportValidity();
                return;
            }
        const formValues = {
            role : props.user,
            firstName : data.get('firstName'),
            lastName : data.get('lastName'),
            email : data.get('email'),
            password : data.get('pswd'),
            country : data.get('country')
        }
        console.log("form values", formValues)
        setFormValues(formValues);
        setShowOtp(true);
       
        
    }
    
    const verifyOtp = () => {
        // fetch("http://localhost:8000/verify_otp", {
        //     method: "POST", 
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'X-CSRFToken': csrfToken,
        //     }, 
        //     credentials: 'include', 
        //     body: JSON.stringify({})
        // })
    }
    function handleOtpClick() {



        // fetch("http://localhost:8000/sign_up", {
        //     method: "POST", 
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'X-CSRFToken': csrfToken, 
        //     }, 
        //     credentials: "include",
        //     body: JSON.stringify(formValues)
        // })
        // .then(response => response.json())
        // .then(data => console.log("success", data))
        // .catch(err => console.log("Error", err))
    }

    return (
        <form id="signUpForm">
            <div className="row">
                <div className="col">
                    <label for="email" className="form-label">First Name</label>
                    <input type="text" className="form-control" name="firstName" required/>
                </div>
                <div className="col">
                    <label for="email" className="form-label">Last Name</label>
                    <input type="text" className="form-control" name="lastName" />
                </div>
            </div>
            <div className="mb-3 mt-3">
                <label for="email" className="form-label">Email</label>
                <input type="email" className="form-control" id="email" name="email" required/>
            </div>
            <div className="mb-3">
                <Password setPasswordError={setPasswordError}/>
            </div>
            <div className="mb-3">
                <SelectCountry/>
            </div>
            <div className="mb-3">
                {showOtp && <OTP email={formValues.email}/>}
            </div>
            <div className="mb-3 centerDiv">
                {!showOtp && <input type="submit" onClick={handleClick} className="btn btn-primary" id="createAccountBtn" value="Create my account"/>}
            </div>
        </form>
    )
}
export default SignUpForm;
