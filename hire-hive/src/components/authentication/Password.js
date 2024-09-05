import { useState } from 'react'
import hide from '../../assets/hide.png'
import show from '../../assets/show.png'
const Password = (props) => {
    const [icon, setIcon] = useState('hide')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    function handleChange(event){
        const newPassword = event.target.value;
        setPassword(newPassword);
        if (newPassword.length < 8){
            setError('*Password must be atleast 8 characters long')
            props.setPasswordError(true)
        }
        else
        {
            setError('');
            props.setPasswordError(false)
        }
    }


    function handleClick(event) {
        if (icon === 'show') {
            setIcon('hide')
            document.getElementById('pwd').type = 'password'
        }
        else {
            setIcon('show')
            document.getElementById('pwd').type = 'text'
        }
    }
    return (
        <>
            <div>
            <label for="pwd" class="form-label">Password</label>
            <input
                type="password"
                class="form-control"
                id="pwd"
                placeholder="Password (8 or more characters)"
                name="pswd"
                value={password}
                onChange={handleChange}
                required />
            {(icon === 'hide' ? <img
                src={hide}
                alt='hide'
                className='pwdIcon'
                onClick={handleClick}
            />
                : <img
                    src={show}
                    alt='show'
                    className='pwdIcon'
                    onClick={handleClick}
                />
            )
            }
            </div>
            {
                error && <div className="error">{error}</div>
            }

        </>
    )
}
export default Password;