import React, {useEffect} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const EndPage: React.FC = () => {
    const location = useLocation();
    const state = location.state as {
        language: string;
        finalScore1: number;
        finalScore2: number;
        player: number};  // Type assertion
    const finalScore1 = state.finalScore1;  // Safely access finalScore1
    const finalScore2 = state.finalScore2;
    const language = state.language;
    const navigate = useNavigate();
    const player = state.player;

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'a' || event.key === 'b') {
                navigateBackToMenu();
            }
        };

        // Add the event listener to the window
        window.addEventListener('keypress', handleKeyPress);

        // Remove the event listener when the component unmounts
        return () => {
            window.removeEventListener('keypress', handleKeyPress);
        };
    }, []);  // Empty dependency array as navigate and language won't change dynamically

    const navigateBackToMenu = () => {
        navigate('/');
    };

    const GameStatus = () => {
        let winnerMessage = '';
        if (player === 2) {
            if (finalScore1 > finalScore2) {
                winnerMessage = language === 'de' ? 'Spieler 1 gewinnt!' : 'Player 1 wins!';
            } else if (finalScore1 < finalScore2) {
                winnerMessage = language === 'de' ? 'Spieler 2 gewinnt!' : 'Player 2 wins!';
            } else {
                winnerMessage = language === 'de' ? 'Unentschieden!' : 'It\'s a draw!';
            }
        }
        return <p className="text-4xl text-center mt-10">{winnerMessage}</p>;
    };

    return (
        <div className="text-center mt-32">
            <h1 className="font-bold text-cyan-600 text-5xl mt-150">
                {language === 'de' ? `Quiz fertig!` : `Quiz completed!`}
            </h1>
            <p className="text-4xl text-center mt-20">
                {language === 'de' ? `Spieler 1 hat insgesamt ${finalScore1} Punkte.` : `Player 1 totally scored ${finalScore1} points.`}
            </p>
            {player === 2 && (
                <div>
                    <p className="text-4xl text-center">
                        {language === 'de' ? `Spieler 2 hat insgesamt ${finalScore2} Punkte.` : `Player 2 totally scored ${finalScore2} points.`}
                    </p>
                </div>
            )}
            <GameStatus />
            <button onClick={() => navigate('/')} className="inline-block px-8 py-2 border-2 border-gray-300 rounded-lg mt-8 text-2xl">
                {language === 'de' ? `Zurück zum Menü` : `Back to Menu`}
            </button>
        </div>
    );

};

export default EndPage;
