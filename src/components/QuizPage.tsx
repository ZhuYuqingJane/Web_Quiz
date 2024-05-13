import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import enQuestions from '../json/QuestionsEN.json';
import deQuestions from '../json/QuestionsDE.json';

const QuizPage: React.FC = () => {
    const [uniqueTopics, setUniqueTopics] = useState<string[]>([]);
    const [triesLeft1, setTriesLeft1] = useState(() => Number(localStorage.getItem('triesLeft1') || 3));
    const [triesLeft2, setTriesLeft2] = useState(() => Number(localStorage.getItem('triesLeft2') || 3));
    const [attemptedQuizzes, setAttemptedQuizzes] = useState<string[]>(() => {
        const storedAttempts = localStorage.getItem('attemptedQuizzes');
        return storedAttempts ? JSON.parse(storedAttempts) as string[] : [];
    });
    const [cursorPosition, setCursorPosition] = useState<string | null>(null);
    const navigate = useNavigate();
    const { state } = useLocation();
    const language = state?.language || 'en';
    const player = state?.player || 1;
    const playerID = state?.playerID || 1;
    const quizScore = state?.quizScore || 0;
    const [finalScore1, setFinalScore1] = useState(() => Number(localStorage.getItem('finalScore1') || 0));
    const [finalScore2, setFinalScore2] = useState(() => Number(localStorage.getItem('finalScore2') || 0));

    useEffect(() => {
        const questions = language === 'en' ? enQuestions.questions : deQuestions.questions;
        const topics = Array.from(new Set(questions.map(q => q.topic)));
        setUniqueTopics(topics);

        let newScore1 = finalScore1;
        let newScore2 = finalScore2;
        if (quizScore) {
            if (playerID === 1) {
                newScore1 += quizScore;
                setFinalScore1(newScore1);
                localStorage.setItem('finalScore1', newScore1.toString());
            } else if (playerID === 2) {
                newScore2 += quizScore;
                setFinalScore2(newScore2);
                localStorage.setItem('finalScore2', newScore2.toString());
            }
        }

        // Adjust the tries and navigate if necessary
        if (player === 1) {
            if (triesLeft1 === 0) {
                // Ensuring this runs after the finalScore1 is updated
                if (newScore1 !== finalScore1) {
                    localStorage.setItem('finalScore1', newScore1.toString());
                }
                navigate('/end', { state: { finalScore1: newScore1, language } });
            }
        } else if (player === 2) {
            if (triesLeft1 === 0 && triesLeft2 === 0) {
                if (newScore1 !== finalScore1) {
                    localStorage.setItem('finalScore1', newScore1.toString());
                } else if (newScore2 !== finalScore1) {
                    localStorage.setItem('finalScore2', newScore2.toString());
                }
                navigate('/end', { state: { finalScore1: newScore1, finalScore2: newScore2, language, player } });
            }
        }
    }, [language, quizScore, triesLeft1, triesLeft2, navigate]);


    useEffect(() => {
        const interval = setInterval(() => {
            const unattemptedKeys = getUnattemptedKeys();
            if (unattemptedKeys.length > 0) {
                const randomKey = unattemptedKeys[Math.floor(Math.random() * unattemptedKeys.length)];
                setCursorPosition(randomKey);
            } else {
                setCursorPosition(null);
            }
        }, 1300); // Every 1.3 seconds
        return () => clearInterval(interval);
    }, [attemptedQuizzes, uniqueTopics]);

    useEffect(() => {
        const keyPressListener = (event: KeyboardEvent) => {
            if (event.key === 'a' && cursorPosition !== null) { // Ensure cursorPosition is not null
                const [topic, score] = cursorPosition.split('-');
                handleNavigateToQuiz(topic, parseInt(score), 1);
            } else if (event.key === 'b' && player === 2 && cursorPosition !== null) {
                const [topic, score] = cursorPosition.split('-');
                handleNavigateToQuiz(topic, parseInt(score), 2);
            }
        };
        window.addEventListener('keypress', keyPressListener);
        return () => window.removeEventListener('keypress', keyPressListener);
    }, [cursorPosition, player]);

    function handleNavigateToQuiz(topic: string, score: number, playerID: number) {
        const attemptKey = `${topic}-${score}`;
        if (playerID === 1 && triesLeft1 > 0 && !attemptedQuizzes.includes(attemptKey)) {
            navigate('/quiz-show', { state: { topic, score, language, playerID, player } });
            setTriesLeft1(triesLeft1 - 1);
            localStorage.setItem('triesLeft1', (triesLeft1 - 1).toString());
            const updatedAttempts = [...attemptedQuizzes, attemptKey];
            setAttemptedQuizzes(updatedAttempts);
            localStorage.setItem('attemptedQuizzes', JSON.stringify(updatedAttempts));
        } else if (playerID === 2 && triesLeft2 > 0 && !attemptedQuizzes.includes(attemptKey)) {
            navigate('/quiz-show', { state: { topic, score, language, playerID, player } });
            setTriesLeft2(triesLeft2 - 1);
            localStorage.setItem('triesLeft2', (triesLeft2 - 1).toString());
            const updatedAttempts = [...attemptedQuizzes, attemptKey];
            setAttemptedQuizzes(updatedAttempts);
            localStorage.setItem('attemptedQuizzes', JSON.stringify(updatedAttempts));
        }
    }

    function getUnattemptedKeys() {
        return uniqueTopics.flatMap(topic =>
            ['100', '200'].map(score => `${topic}-${score}`)
                .filter(key => !attemptedQuizzes.includes(key))
        );
    }

    const resetScore = () => {
        setFinalScore1(0);
        setTriesLeft1(3);
        setFinalScore2(0);
        setTriesLeft2(3);
        setAttemptedQuizzes([]);
        localStorage.setItem('finalScore1', '0');
        localStorage.setItem('triesLeft1', '3');
        localStorage.setItem('finalScore2', '0');
        localStorage.setItem('triesLeft2', '3');
        localStorage.setItem('attemptedQuizzes', JSON.stringify([]));
    };

    return (
        <div className="px-20 pt-10">
            <div className="flex justify-between mb-10 border-2 border-gray-300 pb-4 text-2xl bg-sky-100 pt-4 px-6">
                <div>
                    <h3>{language === 'de' ? `Spieler 1 Daten:` : `Player 1 Data:`}</h3>
                    <div>{language === 'de' ? `Punktzahl: ${finalScore1}` : `Score: ${finalScore1}`}</div>
                    <div>{language === 'de' ? `Verbleibende Versuche: ${triesLeft1}` : `Tries left: ${triesLeft1}`}</div>
                </div>
                {player === 2 && (
                    <div>
                        <h3>{language === 'de' ? `Spieler 2 Daten:` : `Player 2 Data:`}</h3>
                        <div>{language === 'de' ? `Punktzahl: ${finalScore2}` : `Score: ${finalScore2}`}</div>
                        <div>{language === 'de' ? `Verbleibende Versuche: ${triesLeft2}` : `Tries left: ${triesLeft2}`}</div>
                    </div>
                )}
            </div>

            <div className="flex flex-wrap justify-around mb-10 border-2 border-gray-300">
                {uniqueTopics.map(topic => (
                    <div key={topic} className="w-full md:w-1/3 p-4 rounded-md">
                        <div className="font-bold text-3xl mb-2 text-center">{topic}</div>
                        <div className="flex flex-col items-center space-y-4a">
                            {['100', '200'].map(score => {
                                const key = `${topic}-${score}`;
                                const isCursor = cursorPosition === key;
                                const attempted = attemptedQuizzes.includes(key);
                                return (
                                    <button
                                        key={key}
                                        className={`w-1/4 py-2 mb-4 ${buttonStyle} ${attempted ? 'bg-cyan-700' : (isCursor ? 'bg-blue-200' : 'bg-white')}`}
                                        onClick={() => handleNavigateToQuiz(topic, parseInt(score), playerID)}
                                    >
                                        {score}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>


            <div className="flex justify-between">
                <button onClick={() => navigate('/')} className={buttonStyle}>
                    {language === 'de' ? 'Zurück zum Menü' : 'Back to Menu'}
                </button>
                <button onClick={resetScore}
                        className={buttonStyle}>{language === 'de' ? 'Zurücksetzen' : 'Reset'}</button>
            </div>
        </div>
    );
};

const buttonStyle = "mr-4 py-3 px-5 border-2 border-gray-300 rounded-lg text-3xl";
export default QuizPage;
