import React, { useState, useEffect, useRef } from "react";

const ScreenTimeoutApp = () => {
  const [isActive, setIsActive] = useState(true);
  const [inactiveTime, setInactiveTime] = useState(0);
  const inactivityTimeout = useRef(null);
  const intervalRef = useRef(null);

  // Format time to HH:mm:ss
  const formatTime = (timeInSeconds) => {
    const hours = String(Math.floor(timeInSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((timeInSeconds % 3600) / 60)).padStart(
      2,
      "0"
    );
    const seconds = String(Math.floor(timeInSeconds % 60)).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  // Reset user activity and clear timeout
  const resetActivity = () => {
    if (!isActive) {
      setInactiveTime(0); // Reset inactive time when user becomes active
      setIsActive(true);
      clearInterval(intervalRef.current);
    }

    clearTimeout(inactivityTimeout.current);
    inactivityTimeout.current = setTimeout(() => {
      setIsActive(false);
    }, 10000); // 10 seconds of inactivity
  };

  useEffect(() => {
    // Events to monitor
    const events = ["mousemove", "keydown", "mousedown", "scroll", "focus"];
    events.forEach((event) => window.addEventListener(event, resetActivity));

    window.addEventListener("blur", () => {
      clearTimeout(inactivityTimeout.current);
      setIsActive(false);
    });

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, resetActivity)
      );
      clearTimeout(inactivityTimeout.current);
      clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isActive) {
      intervalRef.current = setInterval(() => {
        setInactiveTime((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive]);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>User Activity Monitor</h1>
      {isActive ? (
        <p style={{ color: "green" }}>User is Active</p>
      ) : (
        <p style={{ color: "red" }}>
          User is Inactive. Total Inactive Time: {formatTime(inactiveTime)}
        </p>
      )}
    </div>
  );
};

export default ScreenTimeoutApp;
