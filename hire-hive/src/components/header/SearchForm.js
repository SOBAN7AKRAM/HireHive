import { useState } from 'react';
import dropdown from '../../assets/dropdown.png'
import searchIcon from '../../assets/search.png'


const SearchForm = () => {
    const [bgColor, setbgColor] = useState('');
    const [selectedOption, setSelectedOption] = useState('Talent');
    const [showOptions, setShowOptions] = useState(false);

    const handleFocus = () => {
        setbgColor('white')
    };
    const handleBlur = () => {
        setbgColor('')

    }
    const handleButtonClick = (event) => {
        event.preventDefault();
        setShowOptions(!showOptions);
    };
    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setShowOptions(false);
    };


    return (
        <form className="d-flex" id='searchForm'>
            <img className='searchIcon' src={searchIcon} alt='search' />
            <input
                className="me-2"
                id='searchInput'
                type="text"
                placeholder="Search"
                style={{ backgroundColor: bgColor }}
                onFocus={handleFocus}
                onBlur={handleBlur}
            />
            <span className='line'></span>
            <div className="search-container">
                <button className="search-btn" onClick={handleButtonClick}>
                    {selectedOption}
                </button>
                <img src={dropdown} className='dropdown' alt='^' />
                {showOptions && (
                    <div className="options-container">
                        <button className="option-btn" onClick={() => handleOptionClick('Talent')}>
                            Talent
                        </button>
                        <button className="option-btn" onClick={() => handleOptionClick('Work')}>
                            Work
                        </button>
                    </div>
                )}
            </div>
        </form>
    )
}
export default SearchForm;
