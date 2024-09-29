import { useState } from "react";
import useCsrfToken from "./useCsrfToken";

const ForgetPassword = () => {
    const [email, setEmail] = useState('');
    const csrfToken = useCsrfToken();
    const isEmail = (email) =>
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

    function handleSubmit(e) {
        e.preventDefault();
        if (!isEmail(email)) {
            return;
        }
        fetch(`http://localhost:8000/send_otp/`, {
            method: "POST", 
            headers: {
                'Content-Type' : 'application/json',
                'X-CSRFToken' : csrfToken
            },
            credentials: 'include', 
            body: JSON.stringify(email)
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(err => console.log(err))
    }
    return (
        <div className="signUpDiv">
            <form className="Container p-3" id="emailForm">
                <h1 className="heading mt-4">Password Reset</h1>
                <div className="mt-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => (setEmail(e.target.value))}
                        placeholder="someone@example.com"
                        required
                    />
                </div>
                <div className="mt-3 d-flex justify-content-end">
                    <input
                        type="submit"
                        value="Continue"
                        className="btn btn-lg btn-primary"
                        onClick={handleSubmit}
                    />
                </div>
            </form>
        </div>
    )
}
export default ForgetPassword;