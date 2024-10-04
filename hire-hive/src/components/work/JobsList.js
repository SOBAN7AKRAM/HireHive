import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PaginationButtons from '../talent/PaginationButtons.js';
import dropDown from '../../assets/dropdown.png'
import ShowJob from './ShowJob.js';

const JobsList = () => {
    const [jobs, setJobs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(10);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const page = parseInt(searchParams.get('page')) || 1;
        const query = searchParams.get('query') || '';
        setCurrentPage(page);

        let url = `http://localhost:8000/jobs/?page=${page}`;
        if (query) {
            url += `&query=${query}`;
        }
        fetch(url)
            .then(response => response.json())
            .then(data => {
                setJobs(data.jobs);
                setTotalPages(data.total_pages);
            })
            .catch(err => console.log(err));

        const job = {
            'id' : 1,
            'title' : 'django develepor required',
            'description' : "The error you're seeing is a linting warning, which suggests that you should also use the standard line-clamp property for better compatibility with future browsers (even though line-clamp is currently only supported in browsers that support -webkit-line-clamp). However, as of now, the line-clamp property is not widely supported, and most browsers still rely on -webkit-line-clamp.", 
            'skillsRequired' : ['python', 'javascript', 'react'],
            'duration' : 18,
            'posted' : 40,
            'amount' : 800, 
            'link' : 'https://example.com/',
            'clientId' : 20,
            'clientName' : 'M Soban',
            'clientSpent' : 700, 
            'clientCountry' : 'Pakistan',
            'clientJobsPosted' : 40,
            'proposals' : 18
            
        }
        setJobs([job, job, job])

    }, [location])

    const setPageLocation = (page) => {
        const searchParams = new URLSearchParams(location.search);
        searchParams.set('page', page);
        navigate(`${location.pathname}?${searchParams.toString()}`);
    }
    const goToNextPage = () => {
        if (currentPage < totalPages) {
            const nextPage = currentPage + 1;
            setPageLocation(nextPage);
        }
    }

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setPageLocation(currentPage - 1)
        }
    }
    const goToPage = (num) => {
        setCurrentPage(num);
        setPageLocation(num);
    }





    return (
        <div>
            <div className='d-flex flex-column m-5'>
                {jobs.map((job, index) => (
                    <ShowJob key={index} job={job}/>

                ))}
            </div>
            <div className='d-flex flex-row justify-content-center gap-3' style={{ boxSizing: 'border-box' }}>
                <button
                    onClick={goToPreviousPage}
                    className="npBtn d-flex align-items-center" 
                    disabled={currentPage === 1}>
                    <img src={dropDown} className='icon me-3 arrowLeft' />
                    Previous
                </button>
                <PaginationButtons currentPage={currentPage} totalPages={totalPages} goToPage={goToPage} />
                <button
                    onClick={goToNextPage}
                    className="npBtn d-flex align-items-center"
                    disabled={currentPage === totalPages}>
                    Next
                    <img src={dropDown} className='icon ms-3 arrowRight' />
                </button>
            </div>
        </div>
    )
}
export default JobsList;