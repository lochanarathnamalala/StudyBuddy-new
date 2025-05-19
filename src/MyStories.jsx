// src/MyStories.jsx
import React, { useState, useEffect } from 'react';
import './MyStories.css';
import Navbar from './Navbar';

export default function MyStories() {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    const savedStories = JSON.parse(localStorage.getItem('stories') || '[]');
    setStories(savedStories);
  }, []);

  const handleViewStory = (index) => {
    const story = stories[index];
    alert(`Viewing story: ${story.name}`);
    // Here you can add logic to show the full story details or a "PDF-like" view.
  };

  return (
    <>
    <Navbar/>
      <h2>My Stories</h2>
      <div className="stories-library">
        {stories.length === 0 ? (
          <p>No stories saved yet!</p>
        ) : (
          stories.map((story, index) => (
            <div key={index} className="story-item">
              <h3>{story.name}</h3>
              <p><strong>Category:</strong> {story.category}</p>
              <p><strong>Font Size:</strong> {story.fontSize} | <strong>Font:</strong> {story.fontFamily}</p>
              <button onClick={() => handleViewStory(index)}>View Story</button>
            </div>
          ))
        )}
      </div>
      </>
  );
}
