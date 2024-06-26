import React, {useState, useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import enQuestions from '../json/QuestionsEN.json';
import deQuestions from '../json/QuestionsDE.json';
import {Topic} from "./types/Topic";

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
    const {state} = useLocation();
    const language = state?.language || 'en';
    const player = state?.player || 1;
    const playerID = state?.playerID || 1;
    const quizScore = state?.quizScore || 0;
    const mode = 1;
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
                navigate('/end', {state: {finalScore1: newScore1, language}});
            }
        } else if (player === 2) {
            if (triesLeft1 === 0 && triesLeft2 === 0) {
                if (newScore1 !== finalScore1) {
                    localStorage.setItem('finalScore1', newScore1.toString());
                } else if (newScore2 !== finalScore1) {
                    localStorage.setItem('finalScore2', newScore2.toString());
                }
                navigate('/end', {state: {finalScore1: newScore1, finalScore2: newScore2, language, player}});
            }
        }
    }, [language, player, playerID, quizScore, triesLeft1, triesLeft2, navigate]);


    useEffect(() => {
        const interval = setInterval(() => {
            const unattemptedKeys = getUnattemptedKeys();
            if (unattemptedKeys.length > 0) {
                const randomKey = unattemptedKeys[Math.floor(Math.random() * unattemptedKeys.length)];
                setCursorPosition(randomKey);
            } else {
                setCursorPosition(null);
            }
        }, 80); // Every 0.08 seconds
        return () => clearInterval(interval);
    });

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
    });

    function handleNavigateToQuiz(topic: string, score: number, playerID: number) {
        const attemptKey = `${topic}-${score}`;
        if (playerID === 1 && triesLeft1 > 0 && !attemptedQuizzes.includes(attemptKey)) {
            navigate('/quiz-show', {state: {topic, score, language, playerID, player, mode}});
            setTriesLeft1(triesLeft1 - 1);
            localStorage.setItem('triesLeft1', (triesLeft1 - 1).toString());
            const updatedAttempts = [...attemptedQuizzes, attemptKey];
            setAttemptedQuizzes(updatedAttempts);
            localStorage.setItem('attemptedQuizzes', JSON.stringify(updatedAttempts));
        } else if (playerID === 2 && triesLeft2 > 0 && !attemptedQuizzes.includes(attemptKey)) {
            navigate('/quiz-show', {state: {topic, score, language, playerID, player, mode}});
            setTriesLeft2(triesLeft2 - 1);
            localStorage.setItem('triesLeft2', (triesLeft2 - 1).toString());
            const updatedAttempts = [...attemptedQuizzes, attemptKey];
            setAttemptedQuizzes(updatedAttempts);
            localStorage.setItem('attemptedQuizzes', JSON.stringify(updatedAttempts));
        }
    }

    function getUnattemptedKeys() {
        return uniqueTopics.flatMap(topic =>
            ['100', '200', '300', '400'].map(score => `${topic}-${score}`)
                .filter(key => !attemptedQuizzes.includes(key))
        );
    }

    const resetScore = () => {
        state.quizScore = 0;
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


    function getTopicImagePath(topicName: string, language: string): string | undefined {
        const topics: Topic[] = [
            {
                name: {en: 'Environment', de: 'Umwelt'},
                imagePath: 'image/Fun-Fact-Quiz__01.svg'
            },
            {
                name: {en: 'Coding', de: 'Coding'},
                imagePath: 'image/Fun-Fact-Quiz__02.svg'
            },
            {
                name: {en: 'Security', de: 'Sicherheit'},
                imagePath: 'image/Fun-Fact-Quiz__03.svg'
            },
            {
                name: {en: 'Technology', de: 'Technik'},
                imagePath: 'image/Fun-Fact-Quiz__04.svg'
            },
            {
                name: {en: 'Fun Fact', de: 'Fun Fact'},
                imagePath: 'image/Fun-Fact-Quiz__05.svg'
            }
        ];

        const topic = topics.find(item => item.name[language] === topicName);
        return topic ? topic.imagePath : undefined;
    }

    return (
        <div className="min-h-screen px-24 pt-10 bg-cispa_dark_blue flex flex-col">
            {player === 1 && (
                <div className="flex justify-between mb-10 pb-4 text-2xl bg-cispa_dark_blue pt-4 px-6">
                    <div className="bg-cispa_yellow rounded-lg py-3 px-16 font-bold text-cispa_dark_blue">
                        <h3>{language === 'de' ? `SPIELER 1` : `PLAYER 1`}</h3>
                        <div>{language === 'de' ? `Punkte: ${finalScore1}` : `Score: ${finalScore1}`}</div>
                        <div>{language === 'de' ? `Verbleibende Versuche: ${triesLeft1}` : `Tries Left: ${triesLeft1}`}</div>
                    </div>
                    <div className='font-bold text-4xl text-center text-cispa_blue_80 md:w-3/4 mt-10'>{language === 'en' ? `Press the buzzer to pause the selection.`
                        : `Drücke den Buzzer, um die Auswahl anzuhalten.`}
                    </div>
                </div>
            )}
            {player === 2 && (
                <div className="flex justify-between mb-10 pb-4 text-2xl bg-cispa_dark_blue pt-4 px-6">
                    <div className="bg-cispa_yellow rounded-lg py-3 px-16 font-bold text-cispa_dark_blue">
                        <h3>{language === 'de' ? `SPIELER 1` : `PLAYER 1`}</h3>
                        <div>{language === 'de' ? `Punkte: ${finalScore1}` : `Score: ${finalScore1}`}</div>
                        <div>{language === 'de' ? `Verbleibende Versuche: ${triesLeft1}` : `Tries Left: ${triesLeft1}`}</div>
                    </div>
                    <>
                        <div>
                            <div className='font-bold text-4xl text-center text-cispa_blue_80 mt-10'>{language === 'en' ? `Press the buzzer to pause the selection.`
                                : `Drücke den Buzzer, um die Auswahl anzuhalten.`}
                            </div>
                        </div>
                        <div className="bg-cispa_orange rounded-lg py-3 px-16 font-bold text-cispa_dark_blue">
                            <h3>{language === 'de' ? `SPIELER 2` : `PLAYER 2`}</h3>
                            <div>{language === 'de' ? `Punkte: ${finalScore2}` : `Score: ${finalScore2}`}</div>
                            <div>{language === 'de' ? `Verbleibende Versuche: ${triesLeft2}` : `Tries Left: ${triesLeft2}`}</div>
                        </div>
                    </>
                </div>
            )}

            <div className="flex flex-wrap justify-around mb-10 rounded-lg bg-white py-10">
                {uniqueTopics.map(topic => {
                    const topicImagePath = getTopicImagePath(topic, language);
                    return (
                        <div key={topic} className="w-full md:w-1/5 p-4 rounded-md">
                            <div className='flex justify-center items-center'><img src={topicImagePath} width="120"
                                                                                   alt=''/></div>
                            <div className="font-bold text-3xl mb-2 text-center pb-4  text-cispa_dark_blue">
                                {topic}
                            </div>
                            <div className="flex flex-col items-center space-y-4 font-bold">
                                {['100', '200', '300', '400'].map(score => {
                                    const key = `${topic}-${score}`;
                                    const isCursor = cursorPosition === key;
                                    const attempted = attemptedQuizzes.includes(key);
                                    return (
                                        <button
                                            key={key}
                                            className={`py-2 ${buttonStyle_q} ${attempted ? 'bg-cispa_blue_20 text-white' : (isCursor ? 'bg-cispa_green  text-cispa_dark_blue' : 'bg-cispa_blue_80')}`}
                                            onClick={() => handleNavigateToQuiz(topic, parseInt(score), playerID)}
                                        >
                                            {score}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-between">
                <button onClick={() => navigate('/mode', {state: {language}})} className={buttonStyle}>
                    {language === 'de' ? 'Zurück zum Menü' : 'Back to Menu'}
                </button>
                <button onClick={resetScore}
                        className={buttonStyle}>{language === 'de' ? 'Zurücksetzen' : 'Reset'}</button>
            </div>
        </div>
    );
};

const buttonStyle = "mr-4 py-3 px-5 rounded-lg text-3xl bg-white text-cispa_dark_blue font-bold";
const buttonStyle_q = "mr-4 py-3 px-20 rounded-lg text-3xl  text-cispa_dark_blue";
export default QuizPage;
