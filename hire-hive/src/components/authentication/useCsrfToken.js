import { useState, useEffect } from 'react'
const useCsrfToken = () => {
    const [csrfToken, setCsrfToken] = useState('')
    useEffect(() => {
        const fetchCsrfToken = async () => {
            fetch('http://localhost:8000/get_csrf_token', {
                credentials: 'include', // insure cookies are sent
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    setCsrfToken(data.csrfToken)})
                .catch(err => console.log(err))
        }

        fetchCsrfToken();
    }, [])
    return csrfToken;
}
export default useCsrfToken;