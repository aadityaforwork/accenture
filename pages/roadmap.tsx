// pages/roadmap.tsx

import { useState } from 'react';
import axios from 'axios';

type RoadmapStep = {
  step: string;
  topic: string;
  related_content: string;
};

const RoadmapPage: React.FC = () => {
  const [problem, setProblem] = useState('');
  const [interests, setInterests] = useState('');
  const [roadmapSteps, setRoadmapSteps] = useState<RoadmapStep[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const handleSubmit = async () => {
    try {
      const response = await axios.post('/api/roadmap', { problem, interests });
      const cleanedData = response.data;
      setRoadmapSteps(cleanedData);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error generating roadmap:', error);
    }
  };

  const toggleStepCompletion = (index: number) => {
    setCompletedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div className="container">
      {!isSubmitted ? (
        <div className="quiz">
          <h1>Generate Your Roadmap</h1>
          <label>
            Problem:
            <input
              type="text"
              value={problem}
              onChange={e => setProblem(e.target.value)}
            />
          </label>
          <label>
            Interests:
            <input
              type="text"
              value={interests}
              onChange={e => setInterests(e.target.value)}
            />
          </label>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      ) : (
        <div className="roadmap">
          <h1>Your Roadmap</h1>
          <ul>
            {roadmapSteps.map((step, index) => (
              <li
                key={index}
                className={`step ${completedSteps.has(index) ? 'completed' : ''}`}
                onClick={() => toggleStepCompletion(index)}
              >
                <div className="step-header">
                  <span>{step.step}</span>: {step.topic}
                </div>
                <div className="step-content">{step.related_content}</div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <style jsx>{`
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .quiz, .roadmap {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .quiz label {
          margin-bottom: 10px;
        }
        .quiz input {
          margin-left: 10px;
        }
        .roadmap ul {
          list-style-type: none;
          padding: 0;
        }
        .roadmap li {
          border: 1px solid #ccc;
          margin-bottom: 10px;
          padding: 10px;
          cursor: pointer;
        }
        .roadmap .step-content {
          display: none;
          margin-top: 10px;
        }
        .roadmap li.completed {
          background-color: #d4f4dd;
        }
        .roadmap li:hover .step-content {
          display: block;
        }
      `}</style>
    </div>
  );
};

export default RoadmapPage;
