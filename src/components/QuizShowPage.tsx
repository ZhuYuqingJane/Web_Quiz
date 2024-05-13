import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Question } from '../json/types'; // Ensure the path is correct
import enQuestions from '../json/QuestionsEN.json';
import deQuestions from '../json/QuestionsDE.json';

const QuizShowPage: React.FC = () => {
    const location = useLocation();
    const { state } = useLocation();
    const navigate = useNavigate();
    const { topic, score, language } = location.state as { topic: string; score: number; language: 'en' | 'de' };

    const [question, setQuestion] = useState<Question | null>(null);
    const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);
    const playerID = state?.playerID || 1;
    const player = state?.player || 1;

    useEffect(() => {
        const allQuestions = language === 'en' ? enQuestions.questions : deQuestions.questions;
        const filteredQuestions = allQuestions.filter(q => q.topic === topic && q.score === score);
        const randomQuestion = filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)]; // Select a random question
        setQuestion(randomQuestion);
        if (randomQuestion) {
            setShuffledAnswers(shuffleArray(randomQuestion.answers)); // Shuffle answers
        }
    }, [topic, score, language]);

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            const key = event.key;
            if (key >= '1' && key <= '4') {
                const index = parseInt(key, 10) - 1;
                if (index < shuffledAnswers.length) {
                    handleAnswerSelect(shuffledAnswers[index]);
                }
            }
        };
        window.addEventListener('keypress', handleKeyPress);
        return () => {
            window.removeEventListener('keypress', handleKeyPress);
        };
    }, [shuffledAnswers]); // Depend on shuffledAnswers so this effect rebinds with new answers

    const shuffleArray = (array: string[]) => {
        let shuffled = array.slice();
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const handleAnswerSelect = (answer: string) => {
        const correctAnswer = question?.answers[0];
        const isCorrect = correctAnswer === answer;
        navigate('/feedback', {
            state: {
                quizScore: isCorrect ? score : 0, // Provide score if correct, 0 otherwise
                correctAnswer: correctAnswer,
                selectedAnswer: answer,
                totalQuestions: 1,
                language,
                playerID,
                player
            }
        });
    };

    const buttonColors = ['blue', 'red', '#DAA520', 'black'];

    return (
        <div>
            {question && (
                <div>
                    <h3 style={{fontWeight: 'bold', textAlign: 'center', color: '#009FCC', marginTop: '150px', fontSize: '60px'}}>
                        {language === 'en' ? `Player ${playerID} is doing the question` : `Spieler ${playerID} stellt die Frage`}</h3>
                    <p style={{textAlign: 'center', color: 'black', marginTop: '20px', fontSize: '40px', marginLeft: '200px', marginRight: '200px'}}>{question.question}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: '20px' , fontSize: '20px'}}>
                        {shuffledAnswers.map((answer, index) => (
                            <button key={index}
                                    style={{
                                        ...buttonStyle,
                                        backgroundColor: buttonColors[index % buttonColors.length],
                                        color: 'white' // Assuming white text color for better contrast
                                    }}
                                    onClick={() => handleAnswerSelect(answer)}>
                                {answer}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// Define inline styles
const buttonStyle: React.CSSProperties = {
    marginRight: '4px',
    padding: '8px 10px',
    border: '2px solid #ccc',
    borderRadius: '8px',
    cursor: 'pointer',
    flexWrap: 'wrap',
    display: 'flex',
    width: '400px',
    height: 'auto',
    fontSize: '30px',
    alignItems: 'center', // Align items vertically in the center
    justifyContent: 'center', // Align items horizontally in the center
    whiteSpace: 'normal'
};

export default QuizShowPage;
