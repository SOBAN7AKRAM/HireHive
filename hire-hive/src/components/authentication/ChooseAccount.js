import freelancer from '../../assets/freelancer.png';
import client from '../../assets/client.png'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import SignUp from './SignUp';

const ChooseAccount = () => {
    // state to hold which type of account user want to create
    const [selectedOption, setSelectedOption] = useState('');
    // to Show SignUp component when button is clicked
    const [showSignUp, setShowSignUp] = useState(false)


    // handle radio box
    function handleInputChange(event) {
        setSelectedOption(event.target.value);
    }

    // handle signUp btn clicked
    function handleClick(event) {
        if (selectedOption) {
            setShowSignUp(true)
        }
    }
    return (
        <>
            {   // if button is clicked show signUp component else render chooseAccount
                showSignUp ? (<SignUp selectedOption={selectedOption} />) :
                    (

                        <>
                            <h1 className="heading">Join as a client or freelancer</h1>
                            <div className="boxContainer">
                                <div className={`radioBox ${selectedOption === 'client' ? 'selected' : ''}`} onClick={() => setSelectedOption('client')}>
                                    <input
                                        type="radio"
                                        id="clientRadio"
                                        name="radioBtn"
                                        value="client"
                                        checked={selectedOption === 'client'}
                                        onChange={handleInputChange}
                                    />
                                    <img
                                        src={client}
                                        alt="client"
                                    />
                                    <label htmlFor="clientRadio">I'm a client hiring for a project</label>
                                </div>
                                <div className={`radioBox  ${selectedOption === 'freelancer' ? 'selected' : ''}`} onClick={() => setSelectedOption('freelancer')}>
                                    <input
                                        type="radio"
                                        id="freelancerRadio"
                                        name="radioBtn"
                                        value="freelancer"
                                        checked={selectedOption === 'freelancer'}
                                        onChange={handleInputChange}
                                    />
                                    <img
                                        src={freelancer}
                                        alt="freelancer"
                                    />
                                    <label htmlFor="freelancerRadio">I'm a freelancer looking for work</label>
                                </div>
                            </div>
                            <div className='boxContainer'>
                                <button
                                    onClick={handleClick}
                                    id='selectedBtn'
                                    className={`btn btn-primary ${!selectedOption ? 'disable' : ''}`}
                                >
                                    {
                                        selectedOption ? (
                                            selectedOption === 'freelancer' ? "Apply as a Freelancer" : "Join as a Client"
                                        ) : (
                                            "Create Account"
                                        )
                                    }
                                </button>
                            </div>
                            <div className='boxContainer'>
                                <strong>Already have an account?</strong>
                                <Link to="/log_in" className='link'>Log In</Link>
                            </div>
                        </>
                    )
            }

        </>
    )
}
export default ChooseAccount;
