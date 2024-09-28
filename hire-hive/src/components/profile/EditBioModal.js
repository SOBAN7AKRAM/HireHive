import { useEffect, useState } from "react";
import useCsrfToken from "../authentication/useCsrfToken";
const EditBioModal = ({ show, handleClose, userId, userBio }) => {
    const [bio, setBio] = useState(userBio);
    const csrfToken = useCsrfToken();

    useEffect(() => {
        if (show) {
            document.body.classList.add('model-open-bg')
        }
        else {
            document.body.classList.remove('model-open-bg')
        }
        return () => {
            document.body.classList.remove('model-open-bg');
        }
    }, [show]);
    function updateBio() {
        fetch(`http://localhost:8000/update_bio/${userId}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            credentials: 'include',
            body: JSON.stringify(bio)

        })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(err => console.log(err))

    }

    function handleSubmit(e) {
        e.preventDefault();
        updateBio();
    }

    return (
        <div className={`modal fade ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }} tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div className="modal-content modalContentContainer">
                    <div className="modal-header d-flex justify-content-between">
                        <h5 className="modal-title">Profile Overview</h5>
                        <button type="button" className="close" onClick={handleClose} aria-label="Close">
                            <span id="sp" aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body d-flex flex-column">
                        <div>
                            <ul>
                                <li className="para">Describe your strengths and skills</li>
                                <li className="para">Highlight projects, accomplishments and education</li>
                                <li className="para">Keep it short and make sure it's error-free</li>
                            </ul>
                        </div>

                        <div>

                            <form>
                                <div>
                                    <label htmlFor="bio" className="form-label">Hourly Rate</label>
                                    <textarea
                                        className="form-control"
                                        name="bio"
                                        value={bio}
                                        onChange={(e) => {setBio(e.target.value)}}
                                        rows="6" // Adjust the number of visible rows as needed
                                        placeholder="Enter your bio here..."
                                    />
                                </div>
                                <div className="d-flex justify-content-end gap-4 mt-5">
                                    <input
                                        type="button"
                                        onClick={handleClose}
                                        className="btnGreen"
                                        value="Cancel"
                                    />

                                    <input
                                        type="submit"
                                        onClick={handleSubmit}
                                        className="btn btn-primary align-self-end"
                                        value="Save"
                                    />

                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default EditBioModal;