import React, { useState, useRef } from 'react';
import './Write.css';

export default function Write() {
  const [text, setText] = useState('');
  const [storyName, setStoryName] = useState('');
  const [category, setCategory] = useState('Fantasy');
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });

  const [fontSize, setFontSize] = useState('16px');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [fontWeight, setFontWeight] = useState('normal');
  const [fontStyle, setFontStyle] = useState('normal');

  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const uploadedImagesRef = useRef([]);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const { offsetX, offsetY } = e.nativeEvent;
    setLastPosition({ x: offsetX, y: offsetY });
  };

  const stopDrawing = () => setIsDrawing(false);

  const draw = (e) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current.getContext('2d');
    const { offsetX, offsetY } = e.nativeEvent;
    ctx.beginPath();
    ctx.moveTo(lastPosition.x, lastPosition.y);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
    setLastPosition({ x: offsetX, y: offsetY });
  };

  const clearCanvas = () => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const handleAudioStream = (stream) => {
    const recorder = new MediaRecorder(stream);
    const audioChunks = [];
    recorder.ondataavailable = (e) => audioChunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(audioChunks, { type: 'audio/wav' });
      setAudioUrl(URL.createObjectURL(blob));
    };
    recorder.start();
    setMediaRecorder(recorder);
  };

  const startRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      navigator.mediaDevices.getUserMedia({ audio: true }).then(handleAudioStream);
    }
  };

  const stopRecording = () => {
    if (isRecording && mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        uploadedImagesRef.current.push(reader.result);
        renderImages();
      };
      reader.readAsDataURL(file);
    }
  };

  const renderImages = () => {
    const container = document.getElementById('uploaded-images');
    container.innerHTML = '';
    uploadedImagesRef.current.forEach((src) => {
      const img = document.createElement('img');
      img.src = src;
      img.style.maxWidth = '100%';
      img.style.marginTop = '10px';
      container.appendChild(img);
    });
  };

  const saveStory = () => {
    const newStory = {
      name: storyName || 'Untitled',
      text,
      category,
      fontSize,
      fontFamily,
      fontWeight,
      fontStyle,
      audioUrl,
      images: uploadedImagesRef.current,
    };
    const existing = JSON.parse(localStorage.getItem('stories') || '[]');
    existing.push(newStory);
    localStorage.setItem('stories', JSON.stringify(existing));
    alert('✅ Story saved!');
    setText('');
    setStoryName('');
  };

  return (
    <div className="write-page">
      <h2 className="title">✍️ Write Your Story</h2>

      <input
        type="text"
        placeholder="Story Title"
        value={storyName}
        onChange={(e) => setStoryName(e.target.value)}
        className="story-name-input"
      />

      <select value={category} onChange={(e) => setCategory(e.target.value)} className="dropdown">
        <option>Fantasy</option>
        <option>Adventure</option>
        <option>Comedy</option>
        <option>Horror</option>
        <option>Sci-Fi</option>
      </select>

      {/* Font Controls */}
      <div className="font-controls">
        <label>Size:
          <select value={fontSize} onChange={(e) => setFontSize(e.target.value)}>
            <option>14px</option>
            <option>16px</option>
            <option>18px</option>
            <option>20px</option>
            <option>24px</option>
          </select>
        </label>
        <label>Font:
          <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
            <option>Arial</option>
            <option>Georgia</option>
            <option>Courier New</option>
          </select>
        </label>
        <label>Weight:
          <select value={fontWeight} onChange={(e) => setFontWeight(e.target.value)}>
            <option>normal</option>
            <option>bold</option>
          </select>
        </label>
        <label>Style:
          <select value={fontStyle} onChange={(e) => setFontStyle(e.target.value)}>
            <option>normal</option>
            <option>italic</option>
          </select>
        </label>
      </div>

      <textarea
        className="story-editor"
        style={{ fontSize, fontFamily, fontWeight, fontStyle }}
        placeholder="Start writing..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
        />
        <button onClick={clearCanvas}>🧹 Clear Drawing</button>
      </div>

      <div className="tool-grid">
        <button onClick={startRecording}>🎤 Record</button>
        <button onClick={stopRecording}>🛑 Stop</button>
        <input type="file" onChange={handleImageUpload} />
        <button onClick={saveStory}>💾 Save Story</button>
      </div>

      {audioUrl && (
        <div>
          <h4>🎧 Playback</h4>
          <audio controls src={audioUrl} />
        </div>
      )}

      <div id="uploaded-images" />
    </div>
  );
}
