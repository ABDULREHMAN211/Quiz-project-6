import React, {useState} from 'react';
import { QuestionCard } from './Components/QuestionCard';
import {fetchQuestions, Difficulty, QuestionState} from './API';
import { GlobalStyle, Wrapper } from './App.styles';

const Total_questions = 10;
type answerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
}

function App() {
  const [loading, setloading] = useState(false);
  const [questions, setquestions] = useState<QuestionState[]>([]);
  const [number, setnumber] = useState(0);
  const [userAnswers,setUserAnswers] = useState<answerObject[]>([]);
  const [score, setscore] = useState(0);
  const [GameOver, setGameOver] = useState(true);

  console.log(questions);
  

  const startQuiz = async() => {
    setloading(true);
    setloading(false);
    const newQuestions = await fetchQuestions(Total_questions, Difficulty.EASY)
    setquestions(newQuestions);
    setscore(0);
    setUserAnswers([]);
    setnumber(0);
    setloading(false);
  };
  const nextQuestion = async() => {
    const nextQuestion = number + 1;
    if (nextQuestion === Total_questions) {
      setGameOver(true);
    }
    else {
      setnumber(nextQuestion);
    }
  };
  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!GameOver) {
      const answer = e.currentTarget.value;

      const correct = questions[number].correct_answer === answer;

      if (correct) setscore(prev => prev + 1)

      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer
      }

      setUserAnswers(prev => [...prev, answerObject])
    }
  };
  return (
    <>
      <GlobalStyle />
      <Wrapper>
      <h1>Quiz.</h1>
      {GameOver || userAnswers.length === Total_questions ? (
        <button className='start' onClick={startQuiz}>
        Begin Quiz.
      </button>
      ) : null}

      {!GameOver ? (
        <p className='Score'>
        Score: {score}
      </p>): null}
      {loading ? (
        <p>
        Loading
      </p>): null
      }

      {!loading && !GameOver ? (
        <QuestionCard 
      questionNum = {number+1}
      totalQuestions = {Total_questions}
      question = {questions[number].question}
      answers = {questions[number].answers}
      userAnswer = {userAnswers ? userAnswers[number] : undefined}
      callback = {checkAnswer}

      /> ): null }
      {!GameOver && !loading && userAnswers.length === number + 1 && number !== Total_questions - 1 ? (
        <button className='next' onClick={nextQuestion}>
        Next
      </button>
      ): null}
    </Wrapper>
    </>
  );
}

export default App;
