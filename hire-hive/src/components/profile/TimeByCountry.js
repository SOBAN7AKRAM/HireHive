import moment from 'moment-timezone';
import { useState, useEffect } from 'react';

const TimeByCountry = ({country}) => {
    const [currentTime, setCurrentTime] = useState('');

    const countryToTimezone = {
        'United State': 'America/New_York',
        'Pakistan': 'Asia/Karachi',
        'India': 'Asia/Kolkata',
        'United Kingdom': 'Europe/London',
        'Germany': 'Europe/Berlin',
        'Russia': 'Europe/Moscow',
        "Saudi Arabia": 'Asia/Dubai',
        "Qatar": 'Asia/Qatar',
        "China": 'Asia/Shanghai',
    };

    useEffect(() => {
        const updateTime = () => {
            const timezone = countryToTimezone[country];
            if (timezone){
                const time = moment.tz(timezone).format('h:mm A')
                setCurrentTime(time)
            }
            else{
                setCurrentTime('Time Zone not found');
            }
        }
        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, [country])

    return (
        <div>{currentTime}</div>
    )
}
export default TimeByCountry;