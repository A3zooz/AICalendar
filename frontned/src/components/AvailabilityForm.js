import React, { useState } from 'react';
import axios from 'axios';
import Calendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import Swal from 'sweetalert2'
import './AvailabilityForm.css';

axios.defaults.baseURL = 'http://localhost:5000';

const AvailabilityForm = () => {
  const [availability, setAvailability] = useState('');
  const [email, setEmail] = useState('');
  const [calendar, setCalendar] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentSubject, setCurrentSubject] = useState('');
  const [subjects, setSubjects] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/parse-availability', {email,subjects, availability });
      setCalendar(response.data);
      setShowConfirmation(true);
    } catch (error) {
      console.error('Error processing availability:', error);
      setError('Failed to process availability. Please try again.' + error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await axios.post('/api/new-tutor', {email: email, subjects: subjects, availability: calendar.availability });
      Swal.fire('Success', 'Calendar saved successfully', 'success').then(() => {
        resetForm()
      });
    } catch (error) {
      console.error('Error saving calendar:', error);
      setError('Failed to save calendar. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSubject = (e) =>{
    e.preventDefault();
    if (currentSubject.trim() && !subjects.includes(currentSubject.trim())) {
      setSubjects([...subjects, currentSubject.trim()]);
      setCurrentSubject('');
    }

  }

  const handleRemoveSubject = (subject) => {
    setSubjects(subjects.filter((s) => s !== subject));
  };

  const resetForm = () => {
    setAvailability('');
    setEmail('');
    setCalendar(null);
    setShowConfirmation(false);
    setError(null);
    setCurrentSubject('');
    setSubjects([]);
  };



  const calendarEvents = calendar ? Object.entries(calendar.availability).flatMap(([day, slots]) =>
    slots.map(([start, end]) => ({
      title: 'Available',
      daysOfWeek: [['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(day)],
      startTime: start,
      endTime: end,
      color: 'green'
    }))
  ) : [];

  return (
    <div className="availability-form">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="subject">Subjects</label>
          <div className='subject-input' >
            <input id = "subject" 
            type='text'
            placeholder='Enter a subject'
            value={currentSubject}
            onChange={(e) => setCurrentSubject(e.target.value)}
            />
            <button type='button' className='subject-button' onClick= {handleAddSubject} >
              Add Subject
            </button>
            </div>
            <ul className="subjects-list">
            {subjects.map((subject, index) => (
              <li key={index}>
                {subject}
                <button className = 'remove-button' onClick={() => handleRemoveSubject(subject)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>

        <div className="form-group">
          <label htmlFor="availability">Availability</label>
          <textarea
            id="availability"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            placeholder="Describe your availability here..."
            rows={4}
          />
        </div>
        
        <button type="submit" disabled={isLoading || showConfirmation}>
          {isLoading ? 'Processing...' : 'Submit'}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}

      {showConfirmation && (
        <div className="confirmation-section">
          <h2>Please confirm your availability:</h2>
          <div className="calendar-container">
            <Calendar
              plugins={[dayGridPlugin, timeGridPlugin]}
              initialView="timeGridWeek"
              events={calendarEvents}
              slotMinTime="00:00"
              slotMaxTime="24:00"
            />
          </div>
          <div className="button-group">
            <button onClick={handleConfirm} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Confirm'}
            </button>
            <button onClick={() => setShowConfirmation(false)} disabled={isLoading}>
              Edit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailabilityForm;