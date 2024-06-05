import React, {useState, useEffect} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';

const SpeedPage: React.FC = () => {
    const navigate = useNavigate();
    const {state} = useLocation();
    const language = state?.language;
    const player = state?.player;
    const triesLeft1 = state?.triesLeft1;
    const triesLeft2 = state?.triesLeft2;

    const [playerID, setPlayerID] = useState<1 | 2>(1);
    const [message, setMessage] = useState('');
    const [winner, setWinner] = useState<number | null>(null);
    const [isReady, setIsReady] = useState(false);
    const [showAnimation, setShowAnimation] = useState(true); // State to control animation visibility
    const quizScore = state?.quizScore || 0;
    const whoEarnPoints = state?.whoEarnPoints || 0;

    useEffect(() => {
        const messages = language === 'de'
            ? [" "," ","Bereit?", "3", "2", "1", "Jetzt buzzern!"]
            : [" "," ","Ready to click?", "3", "2", "1", "Buzz now!"];
        let index = 0;

        if (player === 1) {
            setWinner(1);
            setPlayerID(1);
        }

        if (triesLeft1 === 0 && triesLeft2 === 0) {
            navigate('/select', {
                state: {
                    language,
                    player,
                    playerID,
                    quizScore,
                    whoEarnPoints,
                    triesLeft1,
                    triesLeft2
                }
            });
        }

        const interval = setInterval(() => {
            setMessage(messages[index]);
            index++;
            if (index === messages.length) {
                setIsReady(true); // Now it's ready to detect key press
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [language, navigate, player, playerID, quizScore, triesLeft1, triesLeft2, whoEarnPoints]);

    useEffect(() => {
        const animationTimeout = setTimeout(() => {
            setShowAnimation(false); // Hide animation after 3 seconds
        }, 3000);

        return () => clearTimeout(animationTimeout);
    }, []);

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (!isReady) return;

            if (winner === null) {
                if (event.key === 'a' && triesLeft1 > 0) {
                    setWinner(1);
                    setPlayerID(1);
                } else if (event.key === 'b' && triesLeft2 > 0) {
                    setWinner(2);
                    setPlayerID(2);
                }
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isReady, winner, navigate, language, player, triesLeft1, triesLeft2]);

    useEffect(() => {
        if (winner !== null) {
            let timeout = 1500;
            if (player === 1) {
                timeout = 0;
            }

            const timer = setTimeout(() => {
                navigate('/select', {
                    state: {
                        language,
                        player,
                        playerID,
                        quizScore,
                        whoEarnPoints,
                        triesLeft1,
                        triesLeft2
                    }
                });
            }, timeout);

            return () => clearTimeout(timer);
        }
    }, [winner, navigate, language, player, playerID, quizScore, whoEarnPoints, triesLeft1, triesLeft2]);

    return (
        <div className="flex justify-center items-center h-screen flex-col bg-cispa_dark_blue text-white font-bold">
            {showAnimation && (
                <div className="text-center animate-fadeIn transition-opacity duration-3000 text-5xl">
                    {language === 'en' ? 'Whoever presses their red buzzer first chooses the question! Ready?' : 'Wer seinen roten Buzzer als erstes drückt, wählt die Frage aus!'}
                </div>
            )}
            {!showAnimation && (
                <div className="text-5xl">
                    {winner === null ? (
                        <div>{message}</div>
                    ) : (
                        <div>
                            <h3 className="font-bold text-5xl text-center mb-8">
                            <span className={playerID === 1 ? 'text-cispa_yellow' : 'text-cispa_orange'}>
                                {language === 'en' ? 'Player' : 'Spieler'} {playerID}
                            </span>
                                {' '}
                                <span className="text-cispa_blue_80">
                                {language === 'en' ? 'was faster!' : `war schneller!`}
                            </span>
                            </h3>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SpeedPage;
