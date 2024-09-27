import { useEffect, useState } from 'react';
import add from '../../assets/addLarge.png'
import Edit from './Edit';
import ProjectModal from './ProjectModal';

const Portfolio = ({ userId, isSelf }) => {
    const [projects, setProjects] = useState([])
    const [showModal, setShowModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    function handleAddClick(e) {
        e.preventDefault();
    }
    function handleProjectClick(e, project) {
        e.preventDefault();
        setSelectedProject(project);
        setShowModal(true);
    }
    function handleEditProjectClick(e, projectId) {
        e.stopPropagation();
        e.preventDefault();
    }
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProject(null);
    };
    useEffect(() => {
        // getProject();
        const projectData = [
            {
                id: 1,
                title: "Project One",
                description: "Description for project one",
                pics: [
                    "https://via.placeholder.com/150",
                    "https://via.placeholder.com/150/0000FF/808080",
                    "https://via.placeholder.com/150/FF0000/FFFFFF"
                ],
                link: "https://example.com/project-one",
                thumbnail: "https://via.placeholder.com/150/FF0000/FFFFFF"
            },
            {
                id: 2,
                title: "Project Two",
                description: "Description for project two",
                pics: [
                    "https://via.placeholder.com/150",
                    "https://via.placeholder.com/150/FFFF00/000000"
                ],
                link: "https://example.com/project-two",
                thumbnail: "https://via.placeholder.com/150/FFFF00/000000"
            }
        ];
        setProjects(projectData)
    }, [userId])

    function getProject() {
        fetch(`http://localhost:8000/get_projects/${userId}`)
            .then(response => response.json())
            .then(data => setProjects(data))
            .then(err => console.log(err))
    }
    return (
        <div className="introContainer">
            <div className='d-flex flex-wrap justify-content-between'>
                <h5>Portfolio</h5>
                <img className='iconLg' src={add} onClick={handleAddClick} />
            </div>
            <div className='projectsContainer d-flex justify-content-start gap-3 p-3'>
                {projects.map((project) => (
                    <div key={project.id} className='projectCard p-3 border rounded' onClick={(e) => handleProjectClick(e, project)}>
                        <img src={project.thumbnail} />
                        <h6 className='mt-3 titleHeading'>{project.title}</h6>
                        {isSelf && <Edit onClick={(e) => handleEditProjectClick(e, project.id)} />}
                    </div>
                ))}
                {selectedProject && (
                    <ProjectModal
                        show={showModal}
                        handleClose={handleCloseModal}
                        project={selectedProject}
                    />
                )}
            </div>
        </div>
    )
}
export default Portfolio;