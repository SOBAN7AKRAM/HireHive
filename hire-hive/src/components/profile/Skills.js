import { useEffect, useState } from "react";
import Edit from "./Edit";
import EditSkillsModal from "./EditSkillsModal";

const Skills = ({ userId, isSelf }) => {
    const [skills, setSkills] = useState([]);
    const [showEditSkillsModal, setShowEditSkillsModal] = useState(false);
    function handleEditClick(e) {
        e.preventDefault();
        setShowEditSkillsModal(true);
    }

    useEffect(() => {
        // getSkills();
        const skill = ["python", "javaScript", "react", "django"]
        setSkills(skill);
    }, [userId])

    function getSkills() {
        fetch(`http://localhost:8000/get_skills/${userId}`)
        .then(response => response.json())
        .then(data => setSkills(data))
        .catch(err => console.log(err))
    }
    return (
        <div className="introContainer">
            <div className="d-flex flex-wrap justify-content-between">
                <h5>Skills</h5>
                {isSelf && <Edit onClick={handleEditClick} />}
                {showEditSkillsModal && 
                <EditSkillsModal
                show={showEditSkillsModal}
                handleClose={() => setShowEditSkillsModal(false)}
                userId={userId}
                skills={skills}
                setSkills={setSkills}
                />
                }
            </div>
            <div class="container my-4">
                <div class="row">
                    <div class="col-md-12">
                        <div class="d-flex flex-wrap">
                            {skills.map((skill, index) => (
                                <span key={index} className="badge bg-secondary m-1">{skill}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
export default Skills;