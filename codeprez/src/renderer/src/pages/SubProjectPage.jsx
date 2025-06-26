import { useState, useEffect } from 'react';
import './SubProjectPage.css';

export default function SubProjectPage() {
  const [currentSlide, setCurrentSlide] = useState("");
  const [nextSlide, setNextSlide] = useState("");
  const [styleCss, setStyleCss] = useState("");
  const [timer, setTimer] = useState("");

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

  window.api.getProps((currentSlide, nextSlide, styleCss, timer) => {
   setCurrentSlide(currentSlide);
   setNextSlide(nextSlide); 
   setStyleCss(styleCss);
   setTimer(timer);
  })

  return (
    <main >
      {styleCss && (
        <style>
          {styleCss}
        </style>
      )}
      <div className="subproject-page">
        <div className="left-section">
            <div className="current-slide">
              <div contentEditable='true' dangerouslySetInnerHTML={{ __html: currentSlide }}></div>
            </div>
        </div>
        <div className="right-section">
            <div className="next-slide">
              <div contentEditable='true' dangerouslySetInnerHTML={{ __html: nextSlide }}></div>
            </div>
            <div className="timer">
                <h2>Timer</h2>
                <h3>Time limit : {timer} minutes</h3>
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
        </div>
      </div>
    </main>
  )
}
