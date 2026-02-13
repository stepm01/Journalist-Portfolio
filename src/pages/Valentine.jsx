import React, { useState, useRef } from 'react';
import './Valentine.css';

function Valentine() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showFinal, setShowFinal] = useState(false);
  const [noButtonStyle, setNoButtonStyle] = useState({});
  const [showHint, setShowHint] = useState(false);
  const noButtonRef = useRef(null);

  const questions = [
    {
      id: 'first_day',
      question: "Decide a date that will define our first day 💕 Make a screenshot of all of your answers",
      type: 'date',
      hint: "Karaq u meghr"
    },
    {
      id: 'future',
      question: "How do you see our future together? 🌟",
      type: 'textarea',
      hint: "Chem aselu, pti mtatses"
    },
    {
      id: 'nicknames',
      question: "What names have I given you? List all of them!",
      type: 'textarea',
      hint: "Sagh kendanabanakan aygin pti hishes"
    },
    {
      id: 'favorite_memory',
      question: "What's your favorite memory of us? 💝",
      type: 'textarea',
      hint: "Chka qez hint stegh"
    },
    {
      id: 'song',
      question: "What song reminds you of us? 🎵",
      type: 'text',
      hint: "Tatuli yergeri chntres"
    }
  ];

  const handleAnswer = (value) => {
    setAnswers({ ...answers, [questions[currentStep].id]: value });
  };

  const nextQuestion = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
      setShowHint(false); // Hide hint when moving to next question
    } else {
      setShowFinal(true);
    }
  };

  const prevQuestion = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setShowHint(false); // Hide hint when going back
    }
  };

  const moveNoButton = () => {
    const maxX = window.innerWidth - 150;
    const maxY = window.innerHeight - 60;
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);
    
    setNoButtonStyle({
      position: 'fixed',
      left: `${randomX}px`,
      top: `${randomY}px`,
      transition: 'all 0.2s ease'
    });
  };

  const handleYes = () => {
    setCurrentStep(-1); // Special state for final message
  };

  // Floating hearts
  const hearts = Array.from({ length: 20 }, (_, i) => (
    <div 
      key={i} 
      className="floating-heart"
      style={{
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${3 + Math.random() * 4}s`,
        fontSize: `${15 + Math.random() * 25}px`,
        opacity: 0.6 + Math.random() * 0.4
      }}
    >
      {['❤️', '💕', '💖', '💗', '💓', '💘', '💝'][Math.floor(Math.random() * 7)]}
    </div>
  ));

  // Final success message
  if (currentStep === -1) {
    return (
      <div className="valentine-page">
        <div className="hearts-container">{hearts}</div>
        <div className="valentine-card final-card">
          <div className="success-hearts">💖💕💖</div>
          <h1>Apres kyanqs!</h1>
          <div className="gift-message">
            <p className="gift-text">Your gifts will be at home when you get back</p>
            <div className="gift-emoji">🎁💝🎁</div>
          </div>
        </div>
      </div>
    );
  }

  // Final question - Will you be my girlfriend?
  if (showFinal) {
    return (
      <div className="valentine-page">
        <div className="hearts-container">{hearts}</div>
        <div className="valentine-card proposal-card">
          <div className="proposal-hearts">💕💖💕</div>
          <h1>One Last Question...</h1>
          <p className="proposal-text">Will you be my Valentine?</p>
          <p className="proposal-subtext">Just try to answer no axchik jan 😏</p>
          
          <div className="proposal-buttons">
            <button className="yes-button" onClick={handleYes}>
              Yes! 💖
            </button>
            <button 
              ref={noButtonRef}
              className="no-button"
              style={noButtonStyle}
              onMouseEnter={moveNoButton}
              onTouchStart={moveNoButton}
              onClick={moveNoButton}
            >
              No
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Questions
  const currentQuestion = questions[currentStep];

  return (
    <div className="valentine-page">
      <div className="hearts-container">{hearts}</div>
      
      <div className="valentine-card">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
          />
        </div>
        <span className="progress-text">
          {currentStep + 1} of {questions.length}
        </span>

        <div className="question-container">
          <h2 className="question-text">{currentQuestion.question}</h2>

          {currentQuestion.type === 'date' && (
            <input
              type="date"
              className="valentine-input"
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswer(e.target.value)}
            />
          )}

          {currentQuestion.type === 'text' && (
            <input
              type="text"
              className="valentine-input"
              placeholder="Type your answer here..."
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswer(e.target.value)}
            />
          )}

          {currentQuestion.type === 'textarea' && (
            <textarea
              className="valentine-textarea"
              placeholder="Type your answer here..."
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              rows={4}
            />
          )}
        </div>

        <div className="navigation-buttons">
          <button 
            className="nav-button prev-button"
            onClick={prevQuestion}
            disabled={currentStep === 0}
          >
            ← Back
          </button>
          <button 
            className="nav-button next-button"
            onClick={nextQuestion}
          >
            {currentStep === questions.length - 1 ? 'Continue 💕' : 'Next →'}
          </button>
        </div>

        {/* Hidden Hint Section */}
        <div className="hint-section">
          <button 
            className="hint-toggle-btn"
            onClick={() => setShowHint(!showHint)}
          >
            {showHint ? 'Hide hint 🙈' : 'Need a hint? 💡'}
          </button>
          
          {showHint && currentQuestion.hint && (
            <p className="hint-text">{currentQuestion.hint}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Valentine;
