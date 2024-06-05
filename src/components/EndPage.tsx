import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import ConfettiExplosion from "react-confetti-explosion";

const EndPage: React.FC = () => {
    const {state} = useLocation();
    const finalScore1 = state?.finalScore1;
    const finalScore2 = state?.finalScore2;
    const language = state?.language;
    const player = state?.player;
    const navigate = useNavigate();


    const [showAnimation, setShowAnimation] = useState(true);

    useEffect(() => {
        const animationTimeout = setTimeout(() => {
            setShowAnimation(false); // Hide animation after 3 seconds
        }, 3000);

        return () => clearTimeout(animationTimeout);
    }, []);

    const navigateBackToMenu = () => {
        navigate('/mode', {state: {language}});
    };

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'a' || event.key === 'b') {
                navigate('/mode', {state: {language}});
            }
        };

        // Add the event listener to the window
        window.addEventListener('keypress', handleKeyPress);

        // Remove the event listener when the component unmounts
        return () => {
            window.removeEventListener('keypress', handleKeyPress);
        };
    }, [language, navigate]);

    return (
        <div className='bg-cispa_dark_blue min-h-screen flex flex-col'>
            {showAnimation && (
                <div className="text-center animate-fadeIn transition-opacity duration-2000">
                    <ConfettiExplosion style={{top: "50%", left: "50%"}}/>
                    <h3 className="font-bold text-5xl text-cispa_blue_80 mt-72 mb-8">
                        {language === 'en' ? `The quiz is over! Good job!` : `Das Quiz ist vorbei! Gut gemacht!`}
                    </h3>
                </div>
            )}
            <div
                className={`fade-in ${showAnimation ? 'opacity-0' : 'opacity-100'} transition-opacity duration-1000 bg-cispa_dark_blue min-h-screen flex flex-col`}>
                <div className="text-center">
                    {player !== 2 && (
                        <div className="flex justify-center mt-48 mb-12">
                            <img src="image/Fun-Fact-Quiz__08.svg" width="150" alt=''/>
                        </div>
                    )}
                    {player === 2 && (
                        <div className="flex justify-center mt-48">
                            <img src="image/Fun-Fact-Quiz__09.svg" width="150" alt=''/>
                        </div>
                    )}
                    <h1 className="font-bold text-cyan-600 text-5xl">
                        {language === 'de' ? `Das Quiz ist geschafft!` : `The quiz is done!`}
                    </h1>
                    <p className="text-4xl text-center mt-8">
                        <span className='text-cispa_yellow'>
                                {language === 'en' ? 'Player 1' : 'Spieler 1'}
                        </span>
                        {' '}
                        <span className="text-white">
                                {language === 'de' ? `hat insgesamt ${finalScore1} Punkte.` : `scored totally ${finalScore1} points. ${player}`}
                        </span>
                    </p>
                    {player === 2 && (
                        <div>
                            <p className="text-4xl text-center mt-2">
                                <span className='text-cispa_orange'>
                                {language === 'en' ? 'Player 2' : 'Spieler 2'}
                                </span>
                                {' '}
                                <span className="text-white">
                                {language === 'de' ? `hat insgesamt ${finalScore2} Punkte.` : `scored totally ${finalScore2} points.`}
                                </span>
                            </p>
                            <p className="text-4xl text-center mt-10 text-white">
                                {finalScore1 > finalScore2 ? (language === 'de' ? 'Spieler 1 gewinnt!' : 'Player 1 wins!') :
                                    (finalScore1 < finalScore2 ? (language === 'de' ? 'Spieler 2 gewinnt!' : 'Player 2 wins!') :
                                        (language === 'de' ? 'Unentschieden!' : 'It\'s a draw!'))}
                            </p>
                        </div>
                    )}
                    <p className="text-4xl text-center mt-8 text-white">
                        {language === 'de' ? `Herzlichen Glückwunsch!` : `Congratulations!`}
                    </p>
                    <button onClick={navigateBackToMenu}
                            className="inline-block px-8 py-2 rounded-lg mt-8 text-2xl bg-white font-bold text-cispa_dark_blue">
                        {language === 'de' ? `Zurück zum Menü` : `Back to Menu`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EndPage;
