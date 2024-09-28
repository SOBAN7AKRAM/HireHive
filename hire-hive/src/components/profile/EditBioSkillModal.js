import { useEffect, useState } from "react";
import useCsrfToken from "../authentication/useCsrfToken";

const EditBioSkillModal = ({ show, handleClose, userId, userTitle }) => {
    const csrfToken = useCsrfToken();
    const [title, setTitle] = useState(userTitle)
    function handleTitleChange(e) {
        setTitle(e.target.value);
    }
    function updateTitle() {
        fetch(`http://localhost:8000/update_title/${userId}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            credentials: 'include',
            body: JSON.stringify(title)

        })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(err => console.log(err))

    }

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

    function handleSubmit(e) {
        e.preventDefault();
        updateTitle();
    }

    return (
        <div className={`modal fade ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }} tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div className="modal-content modalContentContainer">
                    <div className="modal-header d-flex justify-content-between">
                        <h5 className="modal-title">Edit Your Title</h5>
                        <button type="button" className="close" onClick={handleClose} aria-label="Close">
                            <span id="sp" aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body d-flex flex-column">
                        <div>
                            <p className="para">Enter a single sentence description of your professional skills/experience (e.g. Expert Web Designer with Ajax experience)</p>
                        </div>
                        <div>

                            <form>
                                <div>
                                    <label htmlFor="title" className="form-label">Your Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="title"
                                        value={title}
                                        onChange={handleTitleChange}
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
};

export default EditBioSkillModal;
