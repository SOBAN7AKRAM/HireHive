import { useEffect, useState } from "react";
import useCsrfToken from "../authentication/useCsrfToken";
import { useAuth } from '../AuthContext.js'
const ProposalModal = ({ show, handleClose, jobId }) => {
    const { user } = useAuth();
    const csrfToken = useCsrfToken();
    const [coverLetter, setCoverLetter] = useState('');
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

    function sentProposal() {
        fetch(`http://localhost:8000/sent_proposal/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            credentials: 'include',
            body: JSON.stringify(user?.id, jobId, coverLetter)

        })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(err => console.log(err))

    }

    function handleSubmit(e) {
        e.preventDefault();
        // sentProposal();
    }

    return (
        <div className={`modal fade ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }} tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div className="modal-content modalContentContainer">
                    <div className="modal-header d-flex justify-content-between">
                        <h5 className="modal-title">Cover Letter</h5>
                        <button type="button" className="close" onClick={handleClose} aria-label="Close">
                            <span id="sp" aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body d-flex flex-column">

                        <div>

                            <form>
                                <div>
                                    {/* <label htmlFor="coverletter" className="form-label">Hou</label> */}
                                    <textarea
                                        className="form-control"
                                        name="coverletter"
                                        value={coverLetter}
                                        onChange={(e) => { setCoverLetter(e.target.value) }}
                                        rows="6" // Adjust the number of visible rows as needed
                                        placeholder="Write here..."
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
                                        value="Submit"
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
export default ProposalModal;