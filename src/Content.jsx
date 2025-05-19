import React, { useState, useRef } from 'react';
import './CreateStory.css';

export default function CreateStory({ onSaveStory }) {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [font, setFont] = useState('Arial');
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [imageData, setImageData] = useState([]);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  // Drawing logic
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
    const canvas = canvasRef.current;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  };

  // Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageData((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    }
  };

  // Audio Recording
  const handleAudioStream = (stream) => {
    const recorder = new MediaRecorder(stream);
    const chunks = [];
    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/wav' });
      setAudioUrl(URL.createObjectURL(blob));
    };
    recorder.start();
    setMediaRecorder(recorder);
  };

  const startRecording = () => {
    setIsRecording(true);
    navigator.mediaDevices.getUserMedia({ audio: true }).then(handleAudioStream);
  };

  const stopRecording = () => {
    setIsRecording(false);
    mediaRecorder.stop();
  };

  // Save story
  const saveStory = () => {
    const canvasData = canvasRef.current.toDataURL();
    const story = {
      title,
      text,
      font,
      imageData,
      audioUrl,
      canvasData,
      createdAt: new Date().toISOString()
    };
    onSaveStory(story);
    alert('✅ Story saved!');
  };

  return (
    <div className="create-story">
      <h2>Create a New Story</h2>
      <input
        type="text"
        placeholder="Story Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="title-input"
      />

      <select value={font} onChange={(e) => setFont(e.target.value)} className="font-select">
        <option value="Arial">Arial</option>
        <option value="Georgia">Georgia</option>
        <option value="Courier New">Courier New</option>
        <option value="Comic Sans MS">Comic Sans</option>
      </select>

      <textarea
        style={{ fontFamily: font }}
        placeholder="Write your story here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="story-area"
      />

      {/* Drawing */}
      <h4>✏️ Draw</h4>
      <canvas
        ref={canvasRef}
        width={500}
        height={300}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        className="drawing-canvas"
      />
      <button onClick={clearCanvas}>Clear Drawing</button>

      {/* Image Upload */}
      <h4>🖼️ Upload Images</h4>
      <input type="file" onChange={handleImageUpload} />
      <div className="image-preview">
        {imageData.map((src, i) => (
          <img key={i} src={src} alt={`Uploaded ${i}`} />
        ))}
      </div>

      {/* Audio Record */}
      <h4>🎙️ Voice Recording</h4>
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
      {audioUrl && <audio controls src={audioUrl}></audio>}

      <button className="save-btn" onClick={saveStory}>Save Story</button>
    </div>
  );
}
