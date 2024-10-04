import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PaginationButtons from './PaginationButtons';
import dropDown from '../../assets/dropdown.png'
import ShowTalent from './ShowTalent';
import me from '../../assets/me.png'

const TalentList = () => {
    const [talents, setTalents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(10);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const page = parseInt(searchParams.get('page')) || 1;
        const query = searchParams.get('query') || '';
        setCurrentPage(page);

        let url = `http://localhost:8000/get_talents/?page=${page}`;
        if (query) {
            url += `&query=${query}`;
        }
        fetch(url)
            .then(response => response.json())
            .then(data => {
                setTalents(data.talents);
                setTotalPages(data.total_pages);
            })
            .catch(err => console.log(err));

        const Talent = {
            'id' : 1,
            'picture' : me,
            'name' : 'M Soban',
            'country' : 'Pakistan',
            'hourlyRate' : '70',
            'earning' : '800',
            'bioSkill' : 'Full Stack Developer',
            'skills' : ['python', 'javaScript', 'react'],
            'bio' : "I am a Full-stack developer specializing in building websites and web applications. I am always on the lookout for exciting projects to work on and smart people to collaborate withI have sound knowledge of the following technologies:✓ Frontend: JavaScript, React JS✓ Design: CSS, SASS, Bootstrap✓ Backend: Python, django, C++, C#✓ Database: MySQL, PostgreSQL✓ Github, GitLab and other project management toolThanks for reading my profile. Looking forward to hearing back from you."
        }
        setTalents([Talent, Talent, Talent])

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
                {talents.map((talent, index) => (
                    <ShowTalent key={index} talent={talent}/>

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
export default TalentList;