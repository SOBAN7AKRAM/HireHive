import { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import Skills from "../profile/Skills";
import useCsrfToken from "../authentication/useCsrfToken";

const JobPosting = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [localSkills, setLocalSkills] = useState([]);
    const [addSkill, setAddSkill] = useState('');
    const csrfToken = useCsrfToken();

    // useEffect(() => {
    //     if (user?.role !== 'client'){
    //         navigate('/');
    //     }
    // }, [user])


    function handleAddSkill(e) {
        e.preventDefault();
        if (addSkill.trim() !== '' && localSkills.length < 15) {
            setLocalSkills([...localSkills, addSkill]);
            setAddSkill('')
        }
    }

    const handleDelete = (skillToDelete) => {
        setLocalSkills(localSkills.filter(skill => skill !== skillToDelete));
    };

    function handleSubmit(e){
        e.preventDefault();

        const form = document.getElementById('jobPostingForm');
        const data = new FormData(form);

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        if (localSkills.length < 1){
            alert("Atleast one skill is required");
            return;
        }

        const formValues = {
            client_id: user?.id,
            job_title: data.get('title'),
            job_description: data.get('description'),
            job_link: data.get('link'),
            job_budget: data.get('price'),
            job_duration : data.get('duration'),
            job_skills: localSkills
        };

        fetch(`http://localhost:8000/job_posting`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            credentials: 'include',
            body: JSON.stringify(formValues)

        })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(err => console.log(err))
    }

    return (
        <div className="m-5">
            <h1 className="heading">Job Posting</h1>
            <form className="d-flex flex-column gap-3 mt-3" id="jobPostingForm">
                <div>
                    <label htmlFor="title" className="form-label">Job title</label>
                    <input
                        type="text"
                        className="form-control"
                        name="title"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description" className="form-label">Job description</label>
                    <textarea
                        className="form-control"
                        name="description"
                        rows="10"
                    />
                </div>
                <div>
                    <label htmlFor="link" className="form-label">Link</label>
                    <input
                        type="url"
                        className="form-control"
                        name="link"
                    />
                </div>
                <div>
                    <label htmlFor="addSkills" className="form-label">Skill required for job</label>
                    <input
                        type="text"
                        className="form-control"
                        name="addSkills"
                        value={addSkill}
                        onChange={(e) => setAddSkill(e.target.value)}
                    />
                    <input
                        type="submit"
                        onClick={handleAddSkill}
                        className="btn btn-primary mt-2"
                        value="Add"
                    />
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
                </div>
                <div>
                <label htmlFor="duration" className="form-label">Job duration <span className="para">(hours)</span></label>
                    <input
                        type="number"
                        className="form-control"
                        name="duration"
                        placeholder="e.g 12 hours"
                        min="0"
                        required
                    />
                </div>
                <div>
                <label htmlFor="price" className="form-label">Job budget</label>
                    <input
                        type="number"
                        className="form-control"
                        name="budget"
                        placeholder="0.0$"
                        min="0"
                        step="0.1"
                        required
                    />
                </div>
                <div className="d-flex justify-content-center mt-5">
                        <input
                         type="submit"
                         onClick={handleSubmit}
                         className="btn btn-primary w-25"
                        />
                </div>
            </form>
        </div>
    )
}
export default JobPosting;