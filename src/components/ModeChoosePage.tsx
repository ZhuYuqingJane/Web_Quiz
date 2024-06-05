import React, {useState, useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';

const ModeChoosePage: React.FC = () => {
    const navigate = useNavigate();
    const {state} = useLocation();
    const language = state?.language;
    const [player, setPlayer] = useState<1 | 2>(2);
    const [mode, setMode] = useState<1 | 2>(1);
    const buttonStyle = "mr-4 py-3 px-5 rounded-lg text-3xl bg-white text-cispa_dark_blue font-bold";

    const startQuiz = () => {
        // Reset score and tries before starting the quiz
        localStorage.setItem('finalScore1', '0');
        localStorage.setItem('triesLeft1', '3');
        const triesLeft1: number = 3;
        localStorage.setItem('finalScore2', '0');
        localStorage.setItem('triesLeft2', '3');
        const triesLeft2: number = 3;
        localStorage.setItem('attemptedQuizzes', JSON.stringify([]));
        // Navigate based on mode
        if (mode === 1) {
            navigate('/quiz', {state: {language, player}});
        } else if (mode === 2) {
            navigate('/speed', {state: {language, player, triesLeft1, triesLeft2}});
        }
    };

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'a' || 'b') {
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

    return (
        <div className="flex flex-col h-screen bg-cispa_dark_blue">
            <h1 className="font-bold text-5xl text-center mt-32 mb-28 text-cispa_blue_80">{language === 'de' ? 'Menü' : 'Menu'}</h1>
            <h1 className="font-bold text-4xl text-white text-center mx-10 mb-5">{language === 'de' ? 'Wer spielt mit?' : 'Who is playing?'}</h1>
            <div className="flex justify-center items-center mb-10">
                <button onClick={() => setPlayer(1)}
                        className={player === 1 ? "font-bold mr-4 py-3 px-5 rounded-lg text-3xl bg-cispa_yellow text-cispa_dark_blue" : buttonStyle}>{language === 'de' ? '1 SPIELER' : '1 PLAYER'}</button>
                <button onClick={() => setPlayer(2)}
                        className={player === 2 ? "font-bold mr-4 py-3 px-5 rounded-lg text-3xl bg-cispa_orange text-cispa_dark_blue" : buttonStyle}>{language === 'de' ? '2 SPIELER' : '2 PLAYERS'}</button>
            </div>
            <h1 className="font-bold text-4xl text-white text-center mx-10 mb-5">{language === 'de' ? 'Wer wählt die Fragen aus?' : 'Who selects the questions?'}</h1>
            <div className="flex justify-center items-center mb-10">
                <button onClick={() => setMode(1)}
                        className={mode === 1 ? "mr-4 font-bold py-3 px-5 rounded-lg text-3xl bg-cispa_yellow text-cispa_dark_blue" : buttonStyle}>{language === 'de' ? 'Der Zufall' : 'Random'}</button>
                <button onClick={() => setMode(2)}
                        className={mode === 2 ? "mr-4 font-bold py-3 px-5 rounded-lg text-3xl bg-cispa_orange text-cispa_dark_blue" : buttonStyle}>{language === 'de' ? 'Der Spieler' : 'Player'}</button>
            </div>
            <div className='flex justify-center items-center'>
                <button
                    onClick={startQuiz}
                    className="font-bold mr-4 py-3 px-5 rounded-lg text-3xl bg-cispa_green text-white"
                >
                    {language === 'de' ? 'Los geht\'s!' : 'Let\'s start!'}
                </button>
            </div>
            <div className="flex justify-between fixed left-10 bottom-10">
                <button onClick={() => navigate('/')} className={buttonStyle}>
                    {language === 'de' ? 'Zurück zum Homepage' : 'Back to Homepage'}
                </button>
            </div>
        </div>
    )
};

export default ModeChoosePage;
