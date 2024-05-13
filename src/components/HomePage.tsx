import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
    const [language, setLanguage] = useState<'en' | 'de'>('de');
    const [player, setPlayer] = useState<1|2>(2);
    const navigate = useNavigate();

    const startQuiz = () => {
        // Reset score and tries before starting the quiz
        localStorage.setItem('finalScore1', '0');
        localStorage.setItem('triesLeft1', '3');
        localStorage.setItem('finalScore2', '0');
        localStorage.setItem('triesLeft2', '3');
        localStorage.setItem('attemptedQuizzes', JSON.stringify([]));
        navigate('/quiz', { state: { language, player } }); // Pass selected language and number of player as state
    };

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'a') {
                startQuiz();
            } else if (event.key === 'b') {
                startQuiz();
            }
        };

        // Add event listener for 'keypress' event
        window.addEventListener('keypress', handleKeyPress);

        // Cleanup the event listener when the component unmounts
        return () => {
            window.removeEventListener('keypress', handleKeyPress);
        };
    }); // Include language in the dependency array to ensure up-to-date state


    const buttonStyle = "mr-4 py-3 px-5 border-2 border-gray-300 rounded-lg text-3xl";
    const selectedButtonStyle = "mr-4 py-3 px-5 border-2 border-gray-300 rounded-lg text-3xl bg-blue-200";
    const containerStyle = "fixed left-10 bottom-10 p-2";

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <img src="Logo/CISPA_CysecLab_Logo_4c.svg" width="600" alt='' />
            <h1 className="text-6xl font-bold text-cyan-600">{language === 'de' ? 'Willkommen zum Quiz!' : 'Welcome to the quiz!'}</h1>
            <div className="mt-4">
                <button onClick={() => setPlayer(1)} className={player === 1 ? selectedButtonStyle : buttonStyle}>{language === 'de' ? '1 Spieler' : '1 Player'}</button>
                <button onClick={() => setPlayer(2)} className={player === 2 ? selectedButtonStyle : buttonStyle}>{language === 'de' ? '2 Spieler' : '2 Players'}</button>
            </div>
            <div className="mt-4">
                <button onClick={startQuiz} className={buttonStyle}>{language === 'de' ? 'Quiz Beginnen' : 'Start Quiz'}</button>
            </div>
            <div className={containerStyle}>
                <button onClick={() => setLanguage('en')} className={language === 'en' ? selectedButtonStyle : buttonStyle}>EN</button>
                <button onClick={() => setLanguage('de')} className={language === 'de' ? selectedButtonStyle : buttonStyle}>DE</button>
            </div>
        </div>
    );

};

export default HomePage;
