import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import ModeChoosePage from "./components/ModeChoosePage";
import SpeedPage from "./components/SpeedPage";
import QuizPage from './components/QuizPage';
import QuizPageMode2 from "./components/QuizPageMode2";
import QuizShowPage from './components/QuizShowPage';
import FeedbackPage from "./components/FeedbackPage";
import EndPage from "./components/EndPage";

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/mode" element={<ModeChoosePage />} />
                <Route path="/speed" element={<SpeedPage />} />
                <Route path="/quiz" element={<QuizPage />} />
                <Route path="/select" element={<QuizPageMode2 />} />
                <Route path="/quiz-show" element={<QuizShowPage />} />
                <Route path="/feedback" element={<FeedbackPage />} />
                <Route path="/end" element={<EndPage />} />
            </Routes>
        </Router>
    );
};

export default App;
