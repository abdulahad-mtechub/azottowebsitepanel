import React from "react";

const CustomProgressBar = ({
  steps = [],
  activeStep = 0,
  onChange = () => {},
  activeColor = "#1677ff",
  inactiveColor = "#d9d9d9",
}) => {
  const filledPercent = (activeStep / (steps.length - 1)) * 100;

  return (
    <div className="custom-progress-container">
      {/* Background Line */}
      <div className="custom-progress-track">
        <div
          className="custom-progress-fill"
          style={{ width: `${filledPercent}%`, backgroundColor: activeColor }}
        />
      </div>

      {/* Dots */}
      <div className="custom-progress-dots">
        {steps.map((label, index) => {
          const left = (index / (steps.length - 1)) * 100;
          const isActive = index <= activeStep;

          return (
            <div
              key={index}
              className="dot-wrapper"
              style={{ left: `${left}%` }}
              onClick={() => onChange(index)}
            >
              <div
                className="dot"
                style={{
                  backgroundColor: isActive ? activeColor : inactiveColor,
                }}
              />
              <span className="label">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export {CustomProgressBar};
