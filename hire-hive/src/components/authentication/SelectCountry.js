import { useState, useEffect } from "react";
const SelectCountry = () => {
    const [countries, setCountries] = useState([])
    useEffect(() => {
        fetch('http://localhost:8000/get_country')
            .then(response => response.json())
            .then(data => setCountries(data.countries))
            .catch(err => console.log(err))
    }, [])

    return (
        <>
            <label for="country" className="form-label">Country</label>
            <select name="country" className="form-select form-control">
                {countries.map((country, index) => (
                    <option key={index}>{country}</option>
                ))}
            </select>
        </>
    )
}
export default SelectCountry;
