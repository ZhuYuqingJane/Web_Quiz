import React, {useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';

const FeedbackPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {state} = useLocation();
    let {
        quizScore,
        correctAnswer,
        selectedAnswer,
        language,
        playerID,
        player,
        triesLeft1,
        triesLeft2
    } = location.state as {
        quizScore: number;
        correctAnswer: string;
        selectedAnswer: string;
        language: 'en' | 'de';
        playerID: number;
        player: number;
        triesLeft1: number,
        triesLeft2: number,
    };
    const wasCorrect = quizScore > 0;
    const whoEarnPoints = playerID;
    const mode = state?.mode;

    const navigateBack = () => {
        if (mode === 1) {
            navigate('/quiz', {state: {language, quizScore, player, playerID, whoEarnPoints, triesLeft1, triesLeft2}});
        } else if (mode === 2) {
            if (whoEarnPoints === 1) {
                triesLeft1 -= 1;
            } else if (whoEarnPoints === 2) {
                triesLeft2 -= 1;
            }
            navigate('/speed', {state: {language, quizScore, player, playerID, whoEarnPoints, triesLeft1, triesLeft2}});
        }
    };

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'a' || event.key === 'b') {
                navigateBack();
            }
        };

        window.addEventListener('keypress', handleKeyPress);
        return () => {
            window.removeEventListener('keypress', handleKeyPress);
        };
    });

    return (
        <div className="text-center bg-cispa_dark_blue min-h-screen flex flex-col">
            {!wasCorrect && (
                <div className="flex justify-center mt-48">
                    <img src="image/Fun-Fact-Quiz__07.svg" width="150" alt=''/>
                </div>
            )}
            {wasCorrect && (
                <div className="flex justify-center mt-48">
                    <img src="image/Fun-Fact-Quiz__06.svg" width="150" alt=''/>
                </div>
            )}
            {!wasCorrect && (
                <p className="font-bold text-4xl ml-32 mr-32 leading-loose text-cispa_red">
                    {language === 'de' ? (
                        <>Leider falsch!</>
                    ) : (
                        <>Unfortunately wrong!</>
                    )}
                </p>
            )}
            {wasCorrect && (
                <p className="font-bold text-4xl ml-32 mb-4 mr-32 text-cispa_green">
                    {language === 'de' ? (
                        <>Richtig! Gut gemacht!</>
                    ) : (
                        <>Correct! Good job!</>
                    )}
                </p>
            )}
            <p className="text-4xl">
                        <span className={playerID === 1 ? 'text-cispa_yellow' : 'text-cispa_orange'}>
                                {language === 'en' ? 'Player' : 'Spieler'} {playerID}
                        </span>
                {' '}
                <span className="text-white">
                                {language === 'de' ? `hat ${quizScore} Punkte.` : `scored ${quizScore} points.`}
                        </span>
            </p>
            {!wasCorrect && (
                <div className="flex justify-between mb-10 pb-4 text-3xl bg-cispa_dark_blue pt-4 px-96">
                    <div className="text-cispa_red w-2/5">
                        <h3>{language === 'de' ? `Deine Antwort` : `Your answer`}</h3>
                        <div className='text-white'>
                            <h3>{selectedAnswer}</h3>
                        </div>
                    </div>
                    <div className="text-cispa_green w-2/5">
                        <h3>{language === 'de' ? `Richtige Antwort` : `Correct answer`}</h3>
                        <div className='text-white'>
                            <h3>{correctAnswer}</h3>
                        </div>
                    </div>
                </div>
            )}
            {wasCorrect && (
                <p className="text-3xl ml-32 mt-4 mr-32 text-white">
                    {language === 'de' ? (
                        <>
                            Du hast '<strong>{selectedAnswer}</strong>' ausgewählt.
                        </>
                    ) : (
                        <>
                            You selected '<strong>{selectedAnswer}</strong>'.
                        </>
                    )}
                </p>
            )}
            <div>
                <button onClick={navigateBack}
                        className="font-bold text-cispa_dark_blue py-2 rounded-lg mt-8 text-2xl bg-white px-12">
                    {language === 'de' ? 'Zurück zur Auswahl' : 'Back to Selection'}
                </button>
            </div>
        </div>
    );
};

export default FeedbackPage;
