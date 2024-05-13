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


    const buttonStyle: React.CSSProperties = {
        marginRight: '4px',
        padding: '12px 20px',
        border: '2px solid #ccc',
        borderRadius: '8px',
        fontSize: '40px'
    };

    const language_buttonStyle: React.CSSProperties = {
        marginRight: '4px',
        padding: '8px 15px',
        border: '2px solid #ccc',
        borderRadius: '8px',
        fontSize: '20px'
    };


    const selectedButtonStyle: React.CSSProperties = {
        ...buttonStyle,
        backgroundColor: 'lightblue',
    };

    const selected_language_ButtonStyle: React.CSSProperties = {
        ...language_buttonStyle,
        backgroundColor: 'lightblue',
    };

    const containerStyle: React.CSSProperties = {
        position: 'fixed',
        left: '50px',
        bottom: '50px',
        padding: '10px'
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: '20px',
            alignItems: 'center',
            height: '100vh'  // This makes the div take the full height of the viewport
        }}>
            <img src="Logo/CISPA_CysecLab_Logo_4c.svg" width="600" alt=''/>
            <h1 style={{
                fontSize: '60px', // Increase the font size
                color: '#009FCC',
                fontWeight: 'bold'
            }}>{language === 'de' ? 'Willkommen zum Quiz!' : 'Welcome to the quiz!'}</h1>
            <div style={{marginTop: '10px'}}>
                <button onClick={() => setPlayer(1)}
                        style={player === 1 ? selectedButtonStyle : buttonStyle}>{language === 'de' ? '1 Spieler' : '1 Player'}
                </button>
                <button onClick={() => setPlayer(2)}
                        style={player === 2 ? selectedButtonStyle : buttonStyle}>{language === 'de' ? '2 Spieler' : '2 Players'}
                </button>
            </div>
            <div style={{marginTop: '10px'}}>
                <button onClick={startQuiz}
                        style={buttonStyle}>{language === 'de' ? 'Quiz Beginnen' : 'Start Quiz'}</button>
            </div>
            <div style={containerStyle}>
                <button onClick={() => setLanguage('en')}
                        style={language === 'en' ? selected_language_ButtonStyle : language_buttonStyle}>EN
                </button>
                <button onClick={() => setLanguage('de')}
                        style={language === 'de' ? selected_language_ButtonStyle : language_buttonStyle}>DE
                </button>
            </div>
        </div>
    );

};

export default HomePage;
