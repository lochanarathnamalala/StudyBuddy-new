import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importing useNavigate from React Router
import './Section.css'; // CSS for styling
import Navbar from './Navbar';

const bookCategories = [
  {
    title: "For Novel Lovers",
    subtitle: "Explore epic stories",
    btnText: "Read Now",
    color: "card red",
    img: "novel.png",
  },
  {
    title: "For Storybook Fans",
    subtitle: "Fun for all ages",
    btnText: "Start Reading",
    color: "card blue",
    img: "story.png",
  },
  {
    title: "For Creative Writing",
    subtitle: "Write your own books",
    btnText: "Create One",
    color: "card black",
    img: "writing.png",
  }
];

export default function Section() {
  const navigate = useNavigate(); // Set up navigate function

  const handleCreateClick = () => {
    // Navigate to the /write page when "Create One" is clicked
    navigate('/write');
  };

  return (
    <>
      <Navbar />
      
        {/* Blobs */}
        <div className="blob pink"></div>
        <div className="blob blue"></div>
        <div className="blob yellow"></div>

        {/* Title */}
        <h2 className="section-title">📚 Book Categories</h2>

        {/* Card container */}
        <div className="card-container">
          {bookCategories.map((item, idx) => (
            <div
              className={`${item.color} card`}
              key={idx}
              style={{ animationDelay: `${idx * 0.2}s` }}
            >
              <img src={item.img} alt={item.title} className="card-img" />
              <h3>{item.title}</h3>
              <p>{item.subtitle}</p>
              {/* Button for navigation */}
              {item.btnText === "Create One" ? (
                <button className="card-btn" onClick={handleCreateClick}>
                  {item.btnText}
                </button>
              ) : (
                <button className="card-btn">{item.btnText}</button>
              )}
            </div>
          ))}
        </div>
     
    </>
  );
}
