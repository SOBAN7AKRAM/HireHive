import { useEffect, useState } from "react";
import Edit from "./Edit";
import EditSkillsModal from "./EditSkillsModal";

const Skills = ({ currentSkills, isSelf, id }) => {
    const [skills, setSkills] = useState(currentSkills);
    const [showEditSkillsModal, setShowEditSkillsModal] = useState(false);
    function handleEditClick(e) {
        e.preventDefault();
        setShowEditSkillsModal(true);
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
                userId={id}
                skills={skills}
                setSkills={setSkills}
                />
                }
            </div>
            <div class="container my-4">
                <div class="row">
                    <div class="col-md-12">
                        <div class="d-flex flex-wrap">
                            {skills?.map((skill, index) => (
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