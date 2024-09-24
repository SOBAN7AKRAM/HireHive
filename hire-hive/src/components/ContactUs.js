import { useState } from "react";
import SelectCountry from "./authentication/SelectCountry";
import Logo from "./header/Logo";
import useCsrfToken from "./authentication/useCsrfToken";

const ContactUs = () => {
    const [reason, setReason] = useState('')
    const [formData, setFormData] = useState({})
    const [showSuccess, setShowSuccess] = useState(false)

    const csrfToken = useCsrfToken();

    function handleChange(e) {
        setReason(e.target.value)
    }
    function handleClick(e) {
        e.preventDefault();
        const form = document.getElementById('contactUsForm');
        const data = new FormData(form);
        if (!form.checkValidity()){
            form.reportValidity();
            return;
        }
        const formValues = {
            'firstName' : data.get('firstName'),
            'lastName' : data.get('lastName'),
            'email' : data.get('emailf'),
            'country' : data.get('country'),
            'reason' : data.get('reason')
        }
        setFormData(formValues);
        sendFormData();

    }
    function sendFormData(){
        fetch("http://localhost:8000/contact_us", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken
            },
            credentials: "include",
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success){
                setShowSuccess(true);
            } 
            else{
                alert(data.error)
            }
        })
        .catch(err => console.log(err))
    }

    return (
        <div className="contactUsContainer">
            <div className="signUpDiv">
                <div className="centerDiv mt-5">
                    <Logo/>
                </div>
                <div className="mt-3">
                    <div className="alert alert-info alertContact">Contact Customer Support</div>
                </div>
                <form id="contactUsForm">
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
                        <label htmlFor="emailf" className="form-label">Email</label>
                        <input type="email" className="form-control" id="emailf" name="email" required />
                    </div>
                    <div className="mb-3">
                        <SelectCountry />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="reason" className="form-label">Reason for contact</label>
                        <textarea
                            className="form-control"
                            id="reason"
                            name="reason"
                            value={reason}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-5 mt-4 centerDiv">
                        <input type="submit" onClick={handleClick} className="btn btn-primary w-100" id="contactUsBtn" value="Submit" />
                    </div>
                </form>
                {showSuccess && <div className="alert alert-success">Thank you for contacting us. We look forward to addressing your problem.</div>}
                
            </div>
        </div>
    )
}
export default ContactUs;