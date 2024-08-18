export interface Question {
    category: string;
    type: string;
    difficulty: string;
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
}

export interface QuizResponse {
    response_code: number;
    results: Question[];
}