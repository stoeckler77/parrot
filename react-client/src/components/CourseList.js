import React, { useState, useEffect } from 'react';
import api from '../utils/apiClient';
import './CourseList.css';

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [connectionError, setConnectionError] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    class: '',
    parentName: '',
    comments: ''
  });
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError('');
      setConnectionError(false);
      
      console.log('Fetching courses from API...');
      const response = await api.get('/api/courses');
      console.log('Fetched courses:', response.data);
      
      setCourses(response.data);
    } catch (err) {
      console.error('Error fetching courses:', err);
      
      if (err.message && err.message.includes('Network Error')) {
        setConnectionError(true);
        setError('Could not connect to the server. Please check if the server is running.');
      } else {
        setError('Failed to load courses. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setShowRegistrationForm(true);
    setRegistrationSuccess(false);
    // Reset form data
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      class: '',
      parentName: '',
      comments: ''
    });
  };

  const handleCloseForm = () => {
    setShowRegistrationForm(false);
    setSelectedCourse(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Send registration data to the backend
      const response = await api.post('/api/registrations', {
        course: selectedCourse._id,
        ...formData
      });
      
      console.log('Registration submitted:', response.data);
      
      // Show success message
      setRegistrationSuccess(true);
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        class: '',
        parentName: '',
        comments: ''
      });
    } catch (err) {
      console.error('Error submitting registration:', err);
      alert('Failed to submit registration. Please try again.');
    }
  };

  // Get appropriate emoji for course title
  const getCourseEmoji = (title) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('fußball') || titleLower.includes('football')) return '⚽';
    if (titleLower.includes('basketball')) return '🏀';
    if (titleLower.includes('volleyball')) return '🏐';
    if (titleLower.includes('tennis')) return '🎾';
    if (titleLower.includes('badminton')) return '🏸';
    if (titleLower.includes('tischtennis') || titleLower.includes('ping pong')) return '🏓';
    if (titleLower.includes('baseball')) return '⚾';
    if (titleLower.includes('hockey')) return '🏑';
    if (titleLower.includes('rugby')) return '🏉';
    if (titleLower.includes('golf')) return '⛳';
    if (titleLower.includes('boxen') || titleLower.includes('boxing')) return '🥊';
    if (titleLower.includes('kampfsport') || titleLower.includes('martial')) return '🥋';
    if (titleLower.includes('laufen') || titleLower.includes('running')) return '🏃';
    if (titleLower.includes('schwimmen') || titleLower.includes('swimming')) return '🏊';
    if (titleLower.includes('radfahren') || titleLower.includes('cycling')) return '🚴';
    if (titleLower.includes('ski') || titleLower.includes('snowboard')) return '⛷️';
    if (titleLower.includes('tanzen') || titleLower.includes('dance')) return '💃';
    if (titleLower.includes('yoga')) return '🧘';
    if (titleLower.includes('gymnastik') || titleLower.includes('gymnastics')) return '🤸';
    if (titleLower.includes('gewichtheben') || titleLower.includes('weightlifting')) return '🏋️';
    return '🏆'; // Default trophy emoji
  };

  // Format date to display in a user-friendly way
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('de-CH', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading">Loading courses...</div>;
  }

  if (connectionError) {
    return (
      <div className="error-container">
        <h2>Connection Error</h2>
        <p>Could not connect to the server at http://localhost:8765</p>
        <p>Please make sure the server is running and try again.</p>
        <button onClick={fetchCourses} className="retry-button">Retry</button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={fetchCourses} className="retry-button">Retry</button>
      </div>
    );
  }

  return (
    <div className="course-list-container">
      <h2>Verfügbare Kurse</h2>
      
      {courses.length === 0 ? (
        <p className="no-courses">Keine Kurse verfügbar.</p>
      ) : (
        <div className="course-grid">
          {courses.map(course => (
            <div 
              key={course._id} 
              className={`course-card ${!course.isActive ? 'inactive' : ''}`}
            >
              <div className="course-header">
                <span className="course-emoji">{getCourseEmoji(course.title)}</span>
                <h3 className="course-title">{course.title}</h3>
              </div>
              
              <div className="course-details">
                <p><span className="detail-emoji">📝</span> <strong>Beschreibung:</strong> {course.description}</p>
                <p><span className="detail-emoji">👨‍🏫</span> <strong>Lehrer:</strong> {course.teacher}</p>
                <p><span className="detail-emoji">📍</span> <strong>Ort:</strong> {course.location}</p>
                <p><span className="detail-emoji">🗓️</span> <strong>Start:</strong> {formatDate(course.startDate)}</p>
                <p><span className="detail-emoji">🏁</span> <strong>Ende:</strong> {formatDate(course.endDate)}</p>
                <p><span className="detail-emoji">📅</span> <strong>Wochentag:</strong> {course.dayOfWeek}</p>
                <p><span className="detail-emoji">⏰</span> <strong>Zeit:</strong> {course.timeStart} - {course.timeEnd}</p>
                <p><span className="detail-emoji">👨‍👩‍👧‍👦</span> <strong>Klassen:</strong> {course.targetClasses}</p>
                <p><span className="detail-emoji">👥</span> <strong>Max. Teilnehmer:</strong> {course.maxParticipants}</p>
              </div>
              
              {course.isActive ? (
                <button 
                  className="register-button"
                  onClick={() => handleCourseSelect(course)}
                >
                  Anmelden 📝
                </button>
              ) : (
                <div className="inactive-notice">
                  <span className="inactive-emoji">⚠️</span> Dieser Kurs ist derzeit nicht aktiv
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {showRegistrationForm && selectedCourse && (
        <div className="modal-overlay">
          <div className="registration-modal">
            <div className="registration-form-container">
              <button className="close-button" onClick={handleCloseForm}>×</button>
              
              <h2>{getCourseEmoji(selectedCourse.title)} Anmeldung für {selectedCourse.title}</h2>
              
              {registrationSuccess ? (
                <div className="success-message">
                  <h3>✅ Anmeldung erfolgreich!</h3>
                  <p>Vielen Dank für Ihre Anmeldung zum Kurs {selectedCourse.title}.</p>
                  <p>Eine Bestätigung wurde an Ihre E-Mail-Adresse gesendet.</p>
                  <button className="close-success-button" onClick={handleCloseForm}>
                    Schließen
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="registration-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName">👤 Vorname*</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="lastName">👤 Nachname*</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="email">📧 E-Mail*</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="phone">📱 Telefon*</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="class">🏫 Klasse*</label>
                      <input
                        type="text"
                        id="class"
                        name="class"
                        value={formData.class}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="parentName">👨‍👩‍👧‍👦 Name der Eltern</label>
                      <input
                        type="text"
                        id="parentName"
                        name="parentName"
                        value={formData.parentName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="comments">💬 Bemerkungen</label>
                    <textarea
                      id="comments"
                      name="comments"
                      value={formData.comments}
                      onChange={handleInputChange}
                      rows="4"
                    ></textarea>
                  </div>
                  
                  <div className="form-notice">
                    <p>📢 Mit der Anmeldung bestätige ich, dass ich die Informationen gelesen habe und die Teilnahme bis zum Ende des Semesters verpflichtend ist.</p>
                  </div>
                  
                  <button type="submit" className="submit-button">
                    Anmeldung absenden ✅
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseList; 