import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface TimeDisplayProps {}

const TimeDisplay: React.FC<TimeDisplayProps> = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDate(new Date());
        }, 60000); // Update every minute

        return () => clearInterval(timer);
    }, []);

    const getFormattedDate = (date: Date) => {
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        };
        return date.toLocaleDateString(undefined, options);
    };

    const getFormattedTime = (date: Date) => {
        return date.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const isPM = currentDate.getHours() >= 12;

    return (
        <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-2">
                <div className="text-xl">
                    {isPM ? '🌙': '☀️'}
                </div>
                <div className="text-gray-600 dark:text-gray-100">
                    <span>{getFormattedDate(currentDate)}</span> • <span>{getFormattedTime(currentDate)}</span>
                </div>
            </div>
        </div>
    );
};

export default TimeDisplay;
