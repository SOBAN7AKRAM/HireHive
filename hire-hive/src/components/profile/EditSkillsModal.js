import { useEffect, useState } from "react";
import useCsrfToken from "../authentication/useCsrfToken";
const EditSkillsModal = ({ show, handleClose, userId, skills, setSkills }) => {
    const csrfToken = useCsrfToken();
    const [localSkills, setLocalSkills] = useState(skills);
    const [addSkill, setAddSkill] = useState('');

    function handleAddSkill(e){
        e.preventDefault();
        if (addSkill.trim() !== '' && localSkills.length < 15){
            setLocalSkills([...localSkills, addSkill]);
            setAddSkill('')
        }
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
    function updateSkills() {
        fetch(`http://localhost:8000/update_skills/${userId}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            credentials: 'include',
            body: JSON.stringify(localSkills)

        })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(err => console.log(err))

    }

    function handleSubmit(e) {
        e.preventDefault();
        setSkills(localSkills);
        updateSkills();
        handleClose();
    }

    const handleDelete = (skillToDelete) => {
        setLocalSkills(localSkills.filter(skill => skill !== skillToDelete));
    };


    return (
        <div className={`modal fade ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }} tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div className="modal-content modalContentContainer">
                    <div className="modal-header d-flex justify-content-between">
                        <h5 className="modal-title">Edit Skills</h5>
                        <button type="button" className="close" onClick={handleClose} aria-label="Close">
                            <span id="sp" aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body d-flex flex-column">
                        <div>
                            <form>
                                <div>
                                    <label className="form-label para ms-1">Skills</label>
                                    <div>

                                        {localSkills.map((skill, index) => (
                                            <span key={index} className="badge bg-secondary m-1">
                                                {skill}
                                                <button
                                                    type="button"
                                                    className="btn-close ms-2"
                                                    aria-label="Delete"
                                                    onClick={() => handleDelete(skill)}
                                                ></button>
                                            </span>
                                        ))}
                                    </div>
                                    <span className="para mt-2 ms-2 d-block smPara">Maximum 15 skills.</span>
                                </div>
                                <div className="mt-4">
                                    <label htmlFor="addSkills" className="form-label para">Add new skill</label>
                                    <input 
                                        type="text"
                                        className="form-control"
                                        value={addSkill}
                                        onChange={(e) => setAddSkill(e.target.value)}
                                    />
                                    <input 
                                     type="submit"
                                     onClick={handleAddSkill}
                                     className="btn btn-primary mt-2"
                                     value="Add"
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
export default EditSkillsModal;