import { useEffect, useState } from "react";
import useCsrfToken from "../authentication/useCsrfToken";
const AddProjectModal = ({ show, handleClose, project }) => {
    const csrfToken = useCsrfToken();
    const [isAdd, setIsAdd] = useState(true);
    const [pictures, setPictures] = useState([]);
    const [thumbnail, setThumbnail] = useState(null);


    useEffect(() => {
        if (show) {
            document.body.classList.add('model-open-bg')
        }
        else {
            document.body.classList.remove('model-open-bg')
        }
        if (project !== null) {
            setIsAdd(false)
        }
        return () => {
            document.body.classList.remove('model-open-bg');
        }
    }, [show, project]);

    useEffect(() => {
        setThumbnail(isAdd ? null : project?.thumbnail || null);
        setPictures(isAdd ? [] : project?.pictures || null);
    }, [isAdd, project]);

    function handleSubmit(e) {
        e.preventDefault();
        handleClose();
    }

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnail(reader.result)
            }
            // const formData = new FormData()
            // formData.append('thumbnail', formData)
            // fetch('http://localhost:8000/update_profile_pic', {
            //     method: 'POST', 
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'X-CSRFToken': csrfToken
            //     }, 
            //     body: formData

            // })
            // .then(response => response.json())
            // .then(data => {
            //    console.log(data);
            //    
            // })
            // .catch(err => console.log(err))
            reader.readAsDataURL(file);
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (pictures.length < 3) {
                    setPictures([...pictures, reader.result])
                }
                else {
                    alert("Pictures limit Reached");
                }
            }
            // const formData = new FormData()
            // formData.append('pictures', formData)
            // fetch('http://localhost:8000/update_profile_pic', {
            //     method: 'POST', 
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'X-CSRFToken': csrfToken
            //     }, 
            //     body: formData

            // })
            // .then(response => response.json())
            // .then(data => {
            //    console.log(data);
            //    
            // })
            // .catch(err => console.log(err))
            reader.readAsDataURL(file);
        }
    }

    function handleImageDelete (indexToDelete) {
        setPictures(pictures.filter((pic, index) => index !== indexToDelete));
    }

    return (
        <div className={`modal fade ${show ? 'show' : ''}`} style={{ display: show ? 'block' : 'none' }} tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-fullscreen" role="document">
                <div className="modal-content modalContentContainer">
                    <div className="modal-header d-flex justify-content-between">
                        <div>
                            <h3 className="modal-title pt-3 ps-3">{isAdd ? "Add a new portfolio project" : "Edit portfolio project"}</h3>
                            <span className="ps-3 smPara">All fields are required unless otherwise indicated.</span>
                        </div>
                        <button type="button" className="close p-3" onClick={handleClose} aria-label="Close">
                            <span id="sp" aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body m-3">
                        <form className="d-flex flex-column gap-3">
                            <div>

                                <label htmlFor="title" className="form-label">Project title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={isAdd ? '' : project.title}
                                    name="title"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="description" className="form-label">Project description</label>
                                <textarea
                                    className="form-control"
                                    rows='10'
                                    value={isAdd ? '' : project.description}
                                    name="description"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="link" className="form-label titleHeading">Link <span className="para">(optional)</span></label>
                                <input
                                    type="text"
                                    value={isAdd ? '' : project.link}
                                    className="form-control"
                                    name="link"
                                />
                            </div>
                            <div>
                                <label htmlFor="thumbnail" className="form-label">Thumbnail</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="form-control"
                                    onChange={handleThumbnailChange}
                                    name="thumbnail"
                                />
                            </div>
                            <div className="h-20">
                                {thumbnail &&
                                    <img
                                        src={thumbnail}
                                        className="projectPics modalPics"
                                        alt="thumbnail"
                                    />
                                }
                            </div>
                            <div>
                                <label htmlFor="pics" className="form-label">Add Project Picture</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="form-control"
                                    onChange={handleImageChange}
                                    name="pics"
                                />
                            </div>
                            <div className="d-flex flex-column gap-3">
                                {pictures?.map((pic, index) => (
                                    <div key={index} className="d-flex flex-column">
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={() => handleImageDelete(index)}
                                        >Remove</button>
                                        <img src={pic} alt="pic" className="projectPics" />
                                    </div>
                                ))}
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
            </div >
        </div >
    );
}
export default AddProjectModal;