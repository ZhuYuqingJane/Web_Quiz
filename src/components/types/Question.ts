export interface Question {
    id: number;
    question: string;
    answers: string[];
    correctAnswer: number;
    score: number;
    topic: string;
}