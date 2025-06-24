import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react';

export default function SubProjectPage() {
  const location = useLocation();
  const { currentSlide, nextSlide, styleCss } = location.state || {};

  const [time, setTime] = useState(0);

  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => setTime(time + 1), 10);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, time]);

  const hours = Math.floor(time / 360000);

  const minutes = Math.floor((time % 360000) / 6000);

  const seconds = Math.floor((time % 6000) / 100);

  const startAndStop = () => {
    console.log(currentSlide, nextSlide, styleCss);
    setIsRunning(!isRunning);
  };

  const reset = () => {
    setTime(0);
  };

  return (
    <main>
      <h1>SubProject</h1>
      {styleCss && (
        <style>
          {styleCss}
        </style>
      )}
      <div className="current-slide">
         <div contentEditable='true' dangerouslySetInnerHTML={{ __html: currentSlide }}></div>
      </div>
      <div className="next-slide">
         <div contentEditable='true' dangerouslySetInnerHTML={{ __html: nextSlide }}></div>
      </div>
      <div className="timer">
          <div className="timer-container">
            <p className="timer-time">
              {hours}:{minutes.toString().padStart(2, "0")}:
              {seconds.toString().padStart(2, "0")}
            </p>
            <div className="timer-buttons">
              <button className="timer-button" onClick={startAndStop}>
                {isRunning ? "Stop" : "Start"}
              </button>
              <button className="timer-button" onClick={reset}>
                Reset
              </button>
            </div>
          </div>
      </div>
    </main>
  )
}
