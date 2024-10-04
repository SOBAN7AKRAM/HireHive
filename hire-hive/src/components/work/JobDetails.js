import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import TimeByCountry from "../profile/TimeByCountry";
import budgetLogo from '../../assets/budget.png'
import ProposalModal from "./ProposalModal";

const JobDetails = () => {
    const location = useLocation();
    const { job: stateJob } = location.state || {};
    const { id } = useParams();
    const [job, setJob] = useState(stateJob || null);
    const [clientHistory, setClientHistory] = useState({});
    const [showProposalModal, setShowProposalModal] = useState(false);

    function handleApplyClick(e){
        e.preventDefault();
        setShowProposalModal(true);

    }

    useEffect(() => {
        if (!job) {
            // fetch(`http://localhost:8000/get_job/${id}`)
            // .then(response => response.json())
            // .then(data => {
            //     setJob(data.job)
            // })
            // .catch(err => console.log(err))
            setJob({
                'id': 1,
                'title': 'django develepor required',
                'description': "The error you're seeing is a linting warning, which suggests that you should also use the standard line-clamp property for better compatibility with future browsers (even though line-clamp is currently only supported in browsers that support -webkit-line-clamp). However, as of now, the line-clamp property is not widely supported, and most browsers still rely on -webkit-line-clamp.",
                'skillsRequired': ['python', 'javascript', 'react'],
                'duration': 18,
                'posted': 40,
                'amount': 800,
                'link': 'https://example.com/',
                'clientId': 20,
                'clientName': 'M Soban',
                'clientSpent': 700,
                'clientCountry': 'Pakistan',
                'clientJobsPosted': 40,
                'proposals': 18
            })
        }
        // fetch(`http://localhost:8000/get_client_history/${job.clientId}`)
        //     .then(response => response.json())
        //     .then(data => {
        //         setClientHistory(data);
        //     })
        //     .catch(err => console.log(err))
    }, [job, id])
    return (
        <div className="d-flex m-4 ms-5">
            <div className="detailDivContainer flex-grow-1">
                <div className="borderBottom p-3">
                    <h3>{job?.title}</h3>
                    <p className="para">Posted {job?.posted} minutes ago</p>
                </div>
                <div className="borderBottom p-4 pe-5">
                    <p className="mdPara para">{job?.description}</p>
                    <a href={job?.link}>{job?.link}</a>
                </div>
                <div className="borderBottom p-3 d-flex gap-3">
                    <img src={budgetLogo} className="icon" />
                    <div>
                        <p className="mdPara m-0">${job?.amount}</p>
                        <p className="mdPara para m-0">Budget</p>
                    </div>
                </div>
                <div className="borderBottom p-3">
                <h3 className="smHeading">Skills and Expertise</h3>
                    <div class="container m-0 p-0">
                        <div class="col-md-12">
                            <div class="d-flex flex-wrap">
                                {job?.skillsRequired.map((skill, index) => (
                                    <span key={index} className="badge bg-secondary m-1">{skill}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w40 p-3 me-3">
                <div className="d-flex flex-column gap-3">
                    <button className="btn btn-primary" onClick={handleApplyClick}>Apply now</button>
                    <h5 className="smHeading">About the client</h5>
                    <div className="mdPara para"><TimeByCountry country={job?.clientCountry} /></div>
                    <div className="mdPara para">{job?.clientJobsPosted} jobs posted</div>
                    <div className="mdPara para">${job?.clientSpent} total spent</div>
                </div>
            </div>
            {showProposalModal && 
                <ProposalModal show={showProposalModal} handleClose={() => setShowProposalModal(false)} jobId={job?.id}/>
            }

        </div>
    )

}
export default JobDetails;