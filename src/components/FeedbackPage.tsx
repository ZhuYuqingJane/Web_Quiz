import React, {useEffect} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const FeedbackPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { quizScore, correctAnswer, selectedAnswer, language , playerID, player} = location.state as {
        quizScore: number;
        correctAnswer: string;
        selectedAnswer: string;
        language: 'en' | 'de';
        playerID: number;
        player: number;
    };
    const wasCorrect = quizScore > 0;

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
    }, [language, quizScore, playerID]); // Ensure dependencies are updated if they are used in navigateBack

    const navigateBack = () => {
        navigate('/quiz', { state: { language, quizScore, player, playerID } });
    };


    return (
        <div className="text-center mt-32">
            <h1 className="font-bold text-cyan-600 text-5xl mb-6">
                {language === 'de' ? 'Quiz Ergebnisse' : 'Quiz Results'}
            </h1>
            <p className="text-4xl">
                {language === 'de' ? `Spieler${playerID} hast ${quizScore} Punkte.` : `Player${playerID} scored ${quizScore} points.`}
            </p>
            {!wasCorrect && (
                <p className="text-3xl ml-32 mt-4 mr-32">
                    {language === 'de' ? (
                        <>
                            Falsche Antwort: Du hast '<strong>{selectedAnswer}</strong>' ausgewählt.<br />
                            Die richtige Antwort war '<strong>{correctAnswer}</strong>'.
                        </>
                    ) : (
                        <>
                            Incorrect: You selected '<strong>{selectedAnswer}</strong>'.<br />
                            The correct answer was '<strong>{correctAnswer}</strong>'.
                        </>
                    )}
                </p>
            )}
            <button onClick={() => navigate('/quiz', { state: { language, quizScore } })} className="inline-block px-8 py-2 border-2 border-gray-300 rounded-lg mt-8 text-2xl">
                {language === 'de' ? 'Zurück zum Auswahl' : 'Back to Selection'}
            </button>
        </div>
    );
};


export default FeedbackPage;
