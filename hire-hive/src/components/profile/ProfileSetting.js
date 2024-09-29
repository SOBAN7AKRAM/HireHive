import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useEffect, useState } from "react";
import SelectCountry from "../authentication/SelectCountry";
import Password from '../authentication/Password.js'
import useCsrfToken from "../authentication/useCsrfToken";
import ChangePassword from "../authentication/ChangePassword.js";

const ProfileSetting = () => {
    const id = useParams();
    const csrfToken = useCsrfToken();
    const navigate = useNavigate();
    const { user, setUser } = useAuth();
    const [passwordError, setPasswordError] = useState(false);
    useEffect(() => {
        // if (user) {
        //     if (user.id !== id) {
        //         navigate(`/freelancer/profile/${id}`);
        //     }
        // }
        // else{
        //     navigate(`/freelancer/profile/${id}`);
        // }
    }, [id])

    function handleSubmit(e){
        e.preventDefault();
        const form = document.getElementById('settingForm');
        const data = new FormData(form);

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const formValues = {
            firstName: data.get('firstName'),
            lastName: data.get('lastName'),
            country: data.get('country'),
        };
        setUser(prevUser => ({
            ...prevUser, 
            ...formValues
        }))
        fetch(`http://localhost:8000/update_general/${id}`, {
            method: "PUT", 
            headers: {
                'Content-Type' : 'application/json',
                'X-CSRFToken' : csrfToken
            }, 
            credentials: 'include',
            body: JSON.stringify(user.id, formValues)
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(err => console.log(err))
    }

    return (
        <div className="signUpDiv">
            <div className="signInContainer h-75">
                <h1 className="heading mt-4">Account Setting</h1>
                <form className="d-flex flex-column gap-3 ps-3 pe-3" id="settingForm">
                    <div className="row mt-5">
                        <div className="col">
                            <label htmlFor="firstName" className="form-label">First Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={user?.firstName}
                                required
                            />
                        </div>
                        <div className="col">
                            <label htmlFor="lastName" className="form-label">Last Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={user?.lastName}
                                required
                            />
                        </div>
                        <div className="mt-3">
                            <SelectCountry/>
                            <span className="smPara">Current Country: <span className="para">{user?.country}</span></span>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end">
                        <input 
                            type="submit"
                            value="Save"
                            className="btn btn-primary btn-lg"
                            onClick={handleSubmit}
                        />
                    </div>
                </form>
                <div className="w-100 p-3">
                    <ChangePassword userId={user?.id}/>
                </div>
            </div>
        </div>
    )
}
export default ProfileSetting;