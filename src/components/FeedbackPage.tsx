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
        <div>
            <h1 style={{fontWeight: 'bold', textAlign: 'center', color: '#009FCC', marginTop: '150px', fontSize: '60px'}}>
                {language === 'de' ? 'Quiz Ergebnisse' : 'Quiz Results'}</h1>
            <p style={{fontSize: '40px', marginLeft: '300px'}}>
                {language === 'de' ? `Spieler${playerID} hast ${quizScore} Punkte.` : `Player${playerID} scored ${quizScore} points.`}</p>
            {!wasCorrect && (
                <p style={{fontSize: '40px', marginLeft: '300px', marginTop:'20px', marginRight:'300px'}}>
                    {language === 'de' ?
                        <>
                            Falsche Antwort: Du hast '<strong>{selectedAnswer}</strong>' ausgewählt.<br />
                            Die richtige Antwort war '<strong>{correctAnswer}</strong>'.
                        </> :
                        <>
                            Incorrect: You selected '<strong>{selectedAnswer}</strong>'.<br />
                            The correct answer was '<strong>{correctAnswer}</strong>'.
                        </>
                    }
                </p>
            )}
            <button onClick={() => navigate('/quiz', { state: { language, quizScore } })} style={buttonStyle}>
                {language === 'de' ? 'Zurück zum Auswahl' : 'Back to Selection'}
            </button>
        </div>
    );
};
// Define inline styles
const buttonStyle: React.CSSProperties = {
    marginRight: '4px',
    padding: '8px',
    border: '2px solid #ccc',
    borderRadius: '8px',
    marginLeft: '300px',
    marginTop:'30px',
    fontSize:'40px'

};

export default FeedbackPage;
