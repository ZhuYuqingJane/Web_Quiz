import React, {useState, useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {Question} from './types/Question'; // Ensure the path is correct
import enQuestions from '../json/QuestionsEN.json';
import deQuestions from '../json/QuestionsDE.json';

const QuizShowPage: React.FC = () => {
    const location = useLocation();
    const {state} = useLocation();
    const navigate = useNavigate();
    const {topic, score, language} = location.state as { topic: string; score: number; language: 'en' | 'de' };
    const [question, setQuestion] = useState<Question | null>(null);
    const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);
    const [showAnimation, setShowAnimation] = useState(true); // State to control animation visibility
    const playerID = state?.playerID;
    const player = state?.player;
    const mode = state?.mode;
    const triesLeft1 = state?.triesLeft1;
    const triesLeft2 = state?.triesLeft2;

    useEffect(() => {
        const allQuestions = language === 'en' ? enQuestions.questions : deQuestions.questions;
        const filteredQuestions = allQuestions.filter(q => q.topic === topic && q.score === score);
        const randomQuestion = filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)]; // Select a random question
        setQuestion(randomQuestion);
        if (randomQuestion) {
            setShuffledAnswers(shuffleArray(randomQuestion.answers)); // Shuffle answers
        }
    }, [topic, score, language]);

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
                player,
                mode,
                triesLeft1,
                triesLeft2,
            }
        });
    };

    useEffect(() => {
        const animationTimeout = setTimeout(() => {
            setShowAnimation(false); // Hide animation after 1 seconds
        }, 1000);

        return () => clearTimeout(animationTimeout);
    }, []);

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
    }); // Depend on shuffledAnswers so this effect rebinds with new answers

    return (
        <div className='bg-cispa_dark_blue min-h-screen flex flex-col'>
            {showAnimation && (
                <div className="text-center animate-fadeIn transition-opacity duration-100">
                    <h3 className="font-bold text-5xl text-center mt-72 mb-8">
                        <span className={playerID === 1 ? 'text-cispa_yellow' : 'text-cispa_orange'}>
                                {language === 'en' ? 'Player' : 'Spieler'} {playerID}
                            </span>
                        {' '}
                        <span className="text-cispa_blue_80">
                                - {topic} - {score}
                            </span>
                    </h3>
                </div>
            )}
            {question && (
                <div
                    className={`fade-in ${showAnimation ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}>
                    <h3 className="font-bold text-5xl text-center mt-64 mb-8">
                            <span className="text-cispa_blue_80">

                            </span>
                        {' '}
                        <span className={playerID === 1 ? 'text-cispa_yellow' : 'text-cispa_orange'}>
                                {language === 'en' ? 'Player' : 'Spieler'} {playerID}
                            </span>
                        {' '}
                        <span className="text-cispa_blue_80">
                                {language === 'en' ? `is doing the question:` : 'ist an der Reihe:'}
                            </span>
                    </h3>

                    <p className="text-center text-white text-4xl mx-[15%]">{question.question}</p>
                    <div className="flex flex-wrap py-5 justify-center mt-8">
                        <div className="px-10 py-5 space-x-4 rounded-md bg-white flex flex-wrap">
                            {shuffledAnswers.map((answer, index) => (
                                <button
                                    key={index}
                                    className={`text-white text-2xl px-2 py-4 rounded w-72 text-center whitespace-normal ${index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-red-500' : index === 2 ? 'bg-yellow-500' : 'bg-black'}`}
                                    style={{flex: '1'}}
                                    onClick={() => handleAnswerSelect(answer)}
                                >
                                    {answer}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuizShowPage;
