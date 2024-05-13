import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import enQuestions from '../json/QuestionsEN.json';
import deQuestions from '../json/QuestionsDE.json';

const QuizPage: React.FC = () => {
    const [uniqueTopics, setUniqueTopics] = useState<string[]>([]);
    const [triesLeft1, settriesLeft1] = useState(() => Number(localStorage.getItem('triesLeft1') || 3));
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
    const [finalScore1, setfinalScore1] = useState(() => Number(localStorage.getItem('finalScore1') || 0));
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
                setfinalScore1(newScore1);
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
                navigate('/end', { state: { finalScore1: newScore1, finalScore2: newScore2, language, player} });
            }
        }
    }, [language, quizScore, triesLeft1, navigate]);


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
                handleNavigateToQuiz(topic, parseInt(score),1);
            } else if (event.key === 'b' && player === 2 && cursorPosition !== null){
                const [topic, score] = cursorPosition.split('-');
                handleNavigateToQuiz(topic, parseInt(score),2);
            }
        };
        window.addEventListener('keypress', keyPressListener);
        return () => window.removeEventListener('keypress', keyPressListener);
    }, [cursorPosition]);

    function handleNavigateToQuiz(topic: string, score: number, playerID: number) {
        const attemptKey = `${topic}-${score}`;
        if (playerID ===1) {
            if (triesLeft1 > 0 && !attemptedQuizzes.includes(attemptKey)) {
                navigate('/quiz-show', { state: { topic, score, language, playerID, player } });
                settriesLeft1(triesLeft1 - 1);
                localStorage.setItem('triesLeft1', (triesLeft1 - 1).toString());
                const updatedAttempts = [...attemptedQuizzes, attemptKey];
                setAttemptedQuizzes(updatedAttempts);
                localStorage.setItem('attemptedQuizzes', JSON.stringify(updatedAttempts));
            }
        } else if (playerID ===2 ) {
            if (triesLeft2 > 0 && !attemptedQuizzes.includes(attemptKey)) {
                navigate('/quiz-show', { state: { topic, score, language, playerID, player } });
                settriesLeft1(triesLeft2 - 1);
                localStorage.setItem('triesLeft2', (triesLeft2 - 1).toString());
                const updatedAttempts = [...attemptedQuizzes, attemptKey];
                setAttemptedQuizzes(updatedAttempts);
                localStorage.setItem('attemptedQuizzes', JSON.stringify(updatedAttempts));
            }
        }
    }

    function getUnattemptedKeys() {
        return uniqueTopics.flatMap(topic =>
            ['100', '200'].map(score => `${topic}-${score}`)
                .filter(key => !attemptedQuizzes.includes(key))
        );
    }

    const resetScore = () => {
        setfinalScore1(0);
        settriesLeft1(3);
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
        <div style={{padding: '0 200px', marginTop: '50px'}}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                textAlign: 'left',
                marginBottom: '20px',
                border: '1px solid #ccc',
                backgroundColor: 'lightblue',
                padding: '10px',
                fontSize: '30px'
            }}>
                <div> {/* Player 1 */}
                    <h3>{language === 'de' ? `Spieler 1 Daten:` : `Player 1 Data:`}</h3>
                    <div>{language === 'de' ? `Punktzahl: ${finalScore1}` : `Score: ${finalScore1}`}</div>
                    <div>{language === 'de' ? `Verbleibende Versuche: ${triesLeft1}` : `Tries left: ${triesLeft1}`}</div>
                </div>
                {player === 2 && (
                    <div> {/* Player 2 */}
                        <h3>{language === 'de' ? `Spieler 2 Daten:` : `Player 2 Data:`}</h3>
                        <div>{language === 'de' ? `Punktzahl: ${finalScore2}` : `Score: ${finalScore2}`}</div>
                        <div>{language === 'de' ? `Verbleibende Versuche: ${triesLeft2}` : `Tries left: ${triesLeft2}`}</div>
                    </div>
                )}
            </div>

            <div style={{
                display: 'flex',
                flexWrap: 'wrap', // Allows the items to wrap onto multiple lines
                justifyContent: 'space-around', // Maintains space distribution
                alignItems: 'flex-start', // Aligns items to the start of the flex container
                marginBottom: '20px',
                border: '1px solid #ccc'
            }}>
                {uniqueTopics.map(topic => (
                    <div key={topic} style={{
                        width: '30%', // Adjust width to less than half to fit two items per row
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        margin: '10px 0',
                        padding: '10px' // Optional: adds some spacing inside each topic container
                    }}>
                        <div style={{
                            fontWeight: 'bold',
                            fontSize: '32px',
                            marginBottom: '10px',
                            whiteSpace: 'nowrap'
                        }}>
                            {topic}
                        </div>
                        {['100', '200'].map(score => {
                            const key = `${topic}-${score}`;
                            const isCursor = cursorPosition === key;
                            const attempted = attemptedQuizzes.includes(key);
                            return (
                                <button
                                    key={key}
                                    style={{
                                        ...buttonStyle,
                                        backgroundColor: attempted ? '#009FCC' : (isCursor ? '#add8e6' : 'white'),
                                        marginBottom: '5px' // Adds spacing between buttons
                                    }}
                                >
                                    {score}
                                </button>
                            );
                        })}
                    </div>
                ))}
            </div>


            <div style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'space-between',
                padding: '0 20px'
            }}>
                <button onClick={() => navigate('/')} style={buttonStyle}>
                    {language === 'de' ? 'Zurück zum Menü' : 'Back to Menu'}
                </button>
                <button onClick={resetScore} style={buttonStyle}>{language === 'de' ? 'Zurücksetzen' : 'Reset'}</button>
            </div>
        </div>
    );
};

const buttonStyle: React.CSSProperties = {
    margin: '4px',
    padding: '10px 15px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '40px'
};

export default QuizPage;
