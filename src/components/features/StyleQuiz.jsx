import React, { useState } from 'react';

export default function StyleQuiz() {
  const [step, setStep] = useState(0);
  const [result, setResult] = useState(null);

  const questions = [
    { question: "What's your preferred fit?", options: ["Oversized & Baggy", "Classic Regular", "Slim & Tailored"] },
    { question: "What colors do you wear most?", options: ["Neutrals (Black, White, Grey)", "Earth Tones", "Bright & Bold"] },
    { question: "Where are you wearing this?", options: ["Casual Outings", "Office / Smart Casual", "Streetwear & Lounging"] }
  ];

  const handleAnswer = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setResult("Streetwear Minimalist"); // Mock result
    }
  };

  return (
    <section className="style-quiz container" style={{ marginTop: '60px', marginBottom: '60px', padding: '40px', background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)', borderRadius: '16px', textAlign: 'center' }}>
      {!result ? (
        <div className="quiz-content" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Find Your Style</h2>
          <p style={{ color: 'var(--color-text-light)', marginBottom: '32px' }}>Take our 1-minute quiz and get personalized recommendations.</p>
          
          <div className="quiz-card" style={{ background: 'white', padding: '32px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '24px' }}>{questions[step].question}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {questions[step].options.map((opt, i) => (
                <button key={i} className="btn btn-outline" onClick={handleAnswer} style={{ justifyContent: 'flex-start', padding: '16px' }}>
                  {opt}
                </button>
              ))}
            </div>
            <div style={{ marginTop: '24px', fontSize: '0.8rem', color: 'var(--color-text-light)' }}>
              Step {step + 1} of {questions.length}
            </div>
          </div>
        </div>
      ) : (
        <div className="quiz-result slide-up-fade" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <h2>Your Style is: <strong>{result}</strong></h2>
          <p style={{ margin: '16px 0', color: 'var(--color-text-light)' }}>We've curated a special collection just for your vibe.</p>
          <button className="btn btn-primary btn-lg" onClick={() => { setStep(0); setResult(null); }}>Retake Quiz</button>
        </div>
      )}
    </section>
  );
}
