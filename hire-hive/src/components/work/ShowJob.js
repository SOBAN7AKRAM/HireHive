import locationLogo from '../../assets/location.png'
import { useNavigate } from "react-router-dom";

const ShowJob = ({ job }) => {
    const navigate = useNavigate();
    // useEffect(() => {
    //     // fetch(`http://localhost:8000/get_client/?${job?.clientId}`)
    //     // .then(response => response.json())
    //     // .then(data => setClient(data))
    //     // .catch(err => console.log(err))
    //     const c = { 'name': 'Soban', 'spent': '700', 'country': 'Pakistan' }
    //     setClient(c)
    // }, [job])

    function handleClick() {
        navigate(`/job/${job?.id}/details`, {
            state: {
                job: job,
            }
        });
    }

    return (
        <div className="showDivContainer d-flex flex-column gap-2 p-3" onClick={handleClick}>
            <div>
                <p className="para m-0">Posted {job?.posted} minutes ago</p>
                <h4 className="Hover m-0 p-0" onClick={handleClick}>{job?.title}</h4>
            </div>
            <div className="d-flex flex-row gap-4">
                <p className="para">{job?.clientName}</p>
                <p className="para">${job?.clientSpent}+ spent</p>
                <div className="d-flex gap-1">
                    <img src={locationLogo} className="icon" />
                    <p className="para">{job?.clientCountry}</p>
                </div>
            </div>
            <div className="para">
                Budget: ${job?.amount}
            </div>
            <div>
                <p className="truncate">{job?.description}</p>
            </div>
            <div class="container m-0 p-0">
                <div class="col-md-12">
                    <div class="d-flex flex-wrap">
                        {job?.skillsRequired.map((skill, index) => (
                            <span key={index} className="badge bg-secondary m-1">{skill}</span>
                        ))}
                    </div>
                </div>
            </div>
            <div>
                <p>Proposals: <span className="para">{job?.proposals}</span></p>
            </div>

        </div>
    )
}
export default ShowJob;