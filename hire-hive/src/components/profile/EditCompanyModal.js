import { useEffect, useState } from "react";
import useCsrfToken from "../authentication/useCsrfToken";
const EditCompanyModal = ({ show, handleClose, userId, company }) => {
    const [companyName, setCompanyName] = useState(company);
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
    function updateCompanyName() {
        fetch(`http://localhost:8000/update_company_name/${userId}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            credentials: 'include',
            body: JSON.stringify(companyName)

        })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(err => console.log(err))

    }

    function handleSubmit(e) {
        e.preventDefault();
        updateCompanyName();
    }

    return (
        <div className={`modal fade ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }} tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div className="modal-content modalContentContainer">
                    <div className="modal-header d-flex justify-content-between">
                        <h5 className="modal-title">Company Name</h5>
                        <button type="button" className="close" onClick={handleClose} aria-label="Close">
                            <span id="sp" aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body d-flex flex-column">
                        <div>
                            <form>
                                <div>
                                    <label htmlFor="company" className="form-label">Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="company"
                                        value={companyName}
                                        onChange={(e) => {setCompanyName(e.target.value)}}
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
export default EditCompanyModal;