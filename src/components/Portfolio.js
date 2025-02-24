import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import '../styles/Portfolio.css';

function Portfolio() {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundColor: 'black', minHeight: '100vh', color: 'white' }}>
      <div className="header-container">
        <div className="header-nav">
          <button className="header-button">Portfolio</button>
          <button 
            className="header-button"
            onClick={() => navigate('/store')}
          >
            Store
          </button>
        </div>
        <img 
          src="/am.png" 
          alt="AM Logo" 
          className="header-logo"
          onClick={() => navigate('/')}
        />
      </div>
      <div className="resume-container">
        <div className="contact-section">
          <h1>Will Newkirk</h1>
          <p className="location">Boston, MA</p>
          <div className="social-links">
            <a href="https://www.linkedin.com/in/will-newkirk-ba4b532a1/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <span className="divider">•</span>
            <a href="https://www.instagram.com/aml3th/" target="_blank" rel="noopener noreferrer">Instagram</a>
          </div>
        </div>

        <div className="resume-section">
          <h2>Experience</h2>
          
          <div className="experience-item">
            <div className="exp-header">
              <h3>Cogo Labs</h3>
              <span>Cambridge, MA</span>
            </div>
            <div className="exp-subheader">
              <p>AI Intern</p>
              <span>June 2024 – September 2024</span>
            </div>
            <ul>
              <li>Developed, researched, and implemented machine learning techniques through the means of AI & Python</li>
              <li>Worked with a team of ~5 to bring product concepts to market</li>
              <li>Used Wireframing to create a fluid user experience & created an interactive front-end interface using HTML/CSS (promptmaster.gg)</li>
            </ul>
          </div>

          <div className="experience-item">
            <div className="exp-header">
              <h3>Edina Public Schools</h3>
              <span>Edina, MN</span>
            </div>
            <div className="exp-subheader">
              <p>Lead Recreation Lead</p>
              <span>August 2022 - August 2023</span>
            </div>
            <ul>
              <li>Managed a team of two people to plan and run daily activities for 30+ kids aged 5-12</li>
              <li>Facilitated parent communications & health & safety training</li>
              <li>Worked with childcare professionals to develop and execute year-long programming across multiple age groups</li>
            </ul>
          </div>

          <div className="experience-item">
            <div className="exp-header">
              <h3>Instagram, Tiktok</h3>
              <span>Minneapolis, MN</span>
            </div>
            <div className="exp-subheader">
              <p>Content Creator & Page Admin</p>
              <span>September 2021 - May 2023</span>
            </div>
            <ul>
              <li>Curated photo/video content to maximize followers/engagement and build a strong brand with a following of 800K+</li>
              <li>Negotiated/Executed sponsorship deals. Expert in Adobe Products</li>
              <li>Conducted research on profitable niches to maximize growth</li>
            </ul>
          </div>
        </div>

        <div className="resume-section">
          <h2>Education</h2>
          
          <div className="education-item">
            <div className="edu-header">
              <h3>Northeastern University, D'Amore-McKim School of Business</h3>
              <span>Boston, MA</span>
            </div>
            <div className="edu-subheader">
              <p>Candidate for BS in Business Administration and Design</p>
              <span>May 2027</span>
            </div>
            <p>Concentrations: Entrepreneurship, Brand Management</p>
            <p>GPA: 3.3</p>
            <p>Awards and Activities: Northeastern Fashion</p>
            <p className="courses">Relevant Courses: Financial Accounting and Reporting; Business Model Design; Interactive Design Principles; Business Statistics; Innovation!; Marketing Research</p>
          </div>

          <div className="education-item">
            <div className="edu-header">
              <h3>Universidade NOVA de Lisboa</h3>
              <span>Lisbon, PT</span>
            </div>
            <div className="edu-subheader">
              <p>Semester Study Abroad</p>
              <span>August 2023 - December 2023</span>
            </div>
            <p className="courses">Courses: Calculus for Business; Microeconomics; Sustainable Entrepreneurship; International Business</p>
          </div>

          <div className="education-item">
            <div className="edu-header">
              <h3>Edina High School</h3>
              <span>Edina, MN</span>
            </div>
            <div className="edu-subheader">
              <p>High School Diploma</p>
              <span>June 2023</span>
            </div>
            <p>Awards & Activities: Edina Honors Student; Varsity Speech & Debate; Minnesota Bilingual Gold Seal</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Portfolio; 