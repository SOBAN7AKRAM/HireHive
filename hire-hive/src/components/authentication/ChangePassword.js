import { useState } from "react";
import { Link } from "react-router-dom";
import Password from "./Password";
import useCsrfToken from "./useCsrfToken";

const ChangePassword = ({userId}) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false)
    const csrfToken = useCsrfToken();
    function handleSubmit(e){
        e.preventDefault();
        if (passwordError){
            return;
        }
        fetch(`http://localhost:8000/change_password/${userId}`, {
            method: "PUT", 
            headers: {
                'Content-Type' : 'application/json',
                'X-CSRFToken' : csrfToken
            }, 
            credentials: 'include',
            body: JSON.stringify(userId, currentPassword, newPassword)
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(err => console.log(err))
    }
    return (
        <form className="d-flex flex-column gap-3">
            <div className="position-relative">
                <Password setPasswordError={setPasswordError} password={currentPassword} setPassword={setCurrentPassword} label="Current Password"/>
            </div>
            <div className="position-relative">

                <Password setPasswordError={setPasswordError} password={newPassword} setPassword={setNewPassword} label="New Password"/>
            </div>
            <div className="d-flex justify-content-end align-items-center gap-3">
                <Link to={`/forget_password/`}>Forget Password?</Link>
                <input 
                    type="submit"
                    className="btn btn-primary"
                    value="Change Password"
                    onClick={handleSubmit}
                />
            </div>
        </form>
    )
}
export default ChangePassword;