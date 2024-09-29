import { useEffect } from "react";
const ProjectModal = ({ show, handleClose, project }) => {
    useEffect(() => {
        if (show){
            document.body.classList.add('model-open-bg')
        }
        else{
            document.body.classList.remove('model-open-bg')
        }
        return () => {
            document.body.classList.remove('model-open-bg');
        }
    }, [show]);
    return (
        <div className={`modal fade ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }} tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-xl" role="document">
                <div className="modal-content modalContentContainer">
                    <div className="modal-header d-flex justify-content-between">
                        <h5 className="modal-title">{project.title}</h5>
                        <button type="button" className="close" onClick={handleClose} aria-label="Close">
                            <span id="sp" aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body d-flex">
                        <div className="flex-item w-50 p-3">
                            <div>
                                <p className="paraHeading">Project Description.</p>
                                <p className="para pe-5">{project.description}</p>
                            </div>
                            <div>
                                <p className="titleHeading smHeading mt-5">Project Demo.</p>
                                <a href={project.link}>{project.link}</a>
                            </div>
                        </div>
                        <div className="flex-item w-50">
                            <div className="d-flex flex-column gap-3">
                                {project.pictures.map((pic, index) => (
                                    <div className="modalPicContainer">
                                        <img key={index} src={pic} alt={`Project image ${index + 1}`}
                                            className="modalPics" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectModal;
