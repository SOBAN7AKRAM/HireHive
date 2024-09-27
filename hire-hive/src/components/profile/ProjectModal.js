
const ProjectModal = ({ show, handleClose, project }) => {
    return (
        <div className={`modal fade ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }} tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{project.title}</h5>
                        <button type="button" className="close" onClick={handleClose} aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <img src={project.thumbnail} alt={project.title} className="img-fluid mb-3" />
                        <p>{project.description}</p>
                        <div>
                            {project.pics.map((pic, index) => (
                                <img key={index} src={pic} alt={`Project image ${index + 1}`} className="img-thumbnail me-2" style={{ width: '100px' }} />
                            ))}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleClose}>
                            Close
                        </button>
                        <button type="button" className="btn btn-primary">Apply Now</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectModal;
