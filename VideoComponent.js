import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory

const VideoComponent = () => {
  const [videoEnded, setVideoEnded] = useState(false);
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  useEffect(() => {
    const video = document.getElementById('splash-video');
    const handleVideoEnd = () => {
      setVideoEnded(true);
      navigate('/signin');
    };
    
    if (video) {
      video.addEventListener('ended', handleVideoEnd);
    }

    return () => {
      if (video) {
        video.removeEventListener('ended', handleVideoEnd);
      }
    };
  }, [navigate]);

  return (
    <div className="video-container">
      <video id="splash-video" width="100%" height="auto" controls autoPlay muted>
        <source src={process.env.PUBLIC_URL + '/video/SplashScreen.mp4'} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoComponent;
