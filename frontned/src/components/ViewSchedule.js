import React, {useState} from "react";
import axios from "axios";
import Calendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import './AvailabilityForm.css';

const ViewSchedule = () => {
    
    const [email, setEmail] = useState('');
    const [calendar, setCalendar] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setShowConfirmation(false)
        setError(null);
        try {
            const response = await axios.get('/api/get-tutor', {params: {email}});
            if(response.data){
                setCalendar(response.data);
                setShowConfirmation(true);
                console.log(response.data);

            } else {
                setError('No schedule found for this email');
            }
        } catch (error) {
            console.error('Error processing availability:', error);
            setError('Failed to process availability. Please try again.' + error);
        } finally
        {
            setIsLoading(false);
        }
    }

    // calendar has slots which has the following format [{day, startTime, endTime}, ...]. We need to convert this to the format that FullCalendar expects
    const calendarEvents = calendar ? calendar.slots.map(slot => ({
        title: 'Available',
        daysOfWeek: [['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(slot.day)],
        startTime: slot.startTime,
        endTime: slot.endTime,
        color: 'green'
    })) : [];


    return (
        <div className="availability-form">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Processing...' : 'Show Schedule'}
                </button>
            </form>
            {error && <p className="error-message">{error}</p>}

            {showConfirmation && (
                <div className="confirmation-section">
                    <h3>Subjects</h3>
                    <ul className="subjects-list">
                        {calendar.subjects.map((subject, index) => (
                            <li key={index}>{subject}</li>
                        ))}
                    </ul>
            <div className="calendar-container">
            <Calendar
                plugins={[dayGridPlugin, timeGridPlugin]}
                initialView="timeGridWeek"
                events={calendarEvents}
                slotMinTime="00:00"
                slotMaxTime="24:00"
            />
            </div>
            </div>)}
        </div>

    )
}

export default ViewSchedule;