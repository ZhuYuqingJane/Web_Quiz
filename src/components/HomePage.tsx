import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

const HomePage: React.FC = () => {
    const [language, setLanguage] = useState<'en' | 'de'>('de');
    const navigate = useNavigate();

    const startQuiz = () => {
        navigate('/mode', {state: {language}}); // Pass selected language and number of player as state
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


    const buttonStyle = "mr-4 py-3 px-5 rounded-lg text-3xl bg-white text-cispa_dark_blue font-bold";
    const selectedButtonStyle = "mr-4 py-3 px-5 rounded-lg text-3xl bg-cispa_blue_80 text-cispa_dark_blue font-bold";

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-cispa_dark_blue">

            <h1 className="font-bold text-6xl text-white text-center mx-[15%] mb-4">{language === 'de' ?
                'Willkommen zum Quiz!' : 'Welcome to the quiz!'}
            </h1>
            <div className="mt-4">
                <button onClick={startQuiz}
                        className={"font-bold mr-4 py-3 px-5 rounded-lg text-3xl bg-cispa_green text-white"}>{language === 'de' ? 'Los geht\'s!' : 'Let\'s start!'}</button>
            </div>
            <div className="fixed left-10 bottom-10 p-2">
                <button onClick={() => setLanguage('en')}
                        className={language === 'en' ? selectedButtonStyle : buttonStyle}>EN
                </button>
                <button onClick={() => setLanguage('de')}
                        className={language === 'de' ? selectedButtonStyle : buttonStyle}>DE
                </button>
            </div>
        </div>
    );

};

export default HomePage;
