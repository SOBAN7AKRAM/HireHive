import moment from 'moment-timezone';
import { useState, useEffect } from 'react';
import logo from '../../assets/location.png'

const TimeByCountry = ({country}) => {
    const [currentTime, setCurrentTime] = useState('');

    const countryToTimezone = {
        'US': 'America/New_York',
        'PK': 'Asia/Karachi',
        'IN': 'Asia/Kolkata',
        'GB': 'Europe/London',
        'DE': 'Europe/Berlin',
        'RU': 'Europe/Moscow',
        "SA": 'Asia/Dubai',
        "QA": 'Asia/Qatar',
        "CN": 'Asia/Shanghai',
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
        <div className='d-flex align-items-center gap-1'>
            <img src={logo}/>
            <div>{country} - {currentTime} local time</div>
        </div>
    )
}
export default TimeByCountry;