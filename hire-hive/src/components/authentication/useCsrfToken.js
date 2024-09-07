import { useState, useEffect } from 'react';

const useCsrfToken = () => {
    const [csrfToken, setCsrfToken] = useState('');

    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                const response = await fetch('http://localhost:8000/get_csrf_token', {
                    credentials: 'include',
                });
                const data = await response.json();
                setCsrfToken(data.csrfToken);
            } catch (err) {
                console.log(err);
            }
        };

        fetchCsrfToken();
    }, []);

    return csrfToken;
};

export default useCsrfToken;
