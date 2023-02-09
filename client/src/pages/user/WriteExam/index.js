import { message } from 'antd';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getExamById } from '../../../apicalls/exams';
import { addReport } from '../../../apicalls/reports';
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice';
import Instruction from './Instruction';
import {v4} from "uuid";
function WriteExam() {
    const [examData, setexamData] = useState(null);
    const navigate = useNavigate();
    const params = useParams();
    const dispatch = useDispatch();
    const [view, setView] = useState('instructions');
    const [questions = [], setQuestions] = useState([]);
    const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [result = {}, setResult] = useState({});
    const [secondsLeft = 0, setSecondsLeft] = useState(0);
    const [timeUp, setTimeUp] = useState(false);
    const [intervalId, setIntervalId] = useState(null);
    const {user} = useSelector(state=>state.users);
    const getExamData = async () => {
        try {
            dispatch(ShowLoading());
            const response = await getExamById({
                examId: params.id
            })
            dispatch(HideLoading())
            if (response.success) {
                setexamData(response.data);
                setQuestions(response.data.questions)
                setSecondsLeft(response.data.duration)
            } else {
                message.error(response.message)
            }
        } catch (error) {
            dispatch(HideLoading());
            message.error(error.message)
        }
    }

    
    //console.log(questions[selectedQuestionIndex].name);
    //console.log(questions[selectedQuestionIndex].options);

    const calculateResult = async () => {
        try {
          let correctAnswers = [];
          let wrongAnswers = [];
    
          questions.forEach((question, index) => {
            if (question.correctOption === selectedOptions[index]) {
              correctAnswers.push(question);
            } else {
              wrongAnswers.push(question);
            }
          });
    
          let verdict = "Pass";
          if (correctAnswers.length < examData.passingMarks) {
            verdict = "Fail";
          }
    
          const tempResult = {
            correctAnswers,
            wrongAnswers,
            verdict,
          };
          setResult(tempResult);
          dispatch(ShowLoading());
          const response = await addReport({
            exam: params.id,
            result: tempResult,
            user: user._id,
          });
          dispatch(HideLoading());
          if (response.success) {
            setView("result");
          } else {
            message.error(response.message);
          }
        } catch (error) {
          dispatch(HideLoading());
          message.error(error.message);
        }
      };

    const startTimer = () => {
        let totalSeconds = examData.duration;
        const intervalId = setInterval(() => {
          if (totalSeconds > 0) {
            totalSeconds = totalSeconds - 1;
            setSecondsLeft(totalSeconds);
          } else {
            setTimeUp(true);
          }
        }, 1000);
        setIntervalId(intervalId);
      };

    useEffect(() => {
        if (timeUp && view === "questions") {
            clearInterval(intervalId)
            calculateResult()
        }
    }, [timeUp]);

    useEffect(() => {
        if (params.id) {
            getExamData();
        }
    }, []); 
    console.log(secondsLeft);
    return (
        examData && (<div className='mt-2'>
            {/* <div></div> */}
            <h1 className='text-align-center paddingr-60'>
                đề thi : {examData.name}
            </h1>

            {view === 'instructions' &&
                <Instruction
                    examData={examData}
                    view={view}
                    setView={setView}
                    startTimer={startTimer}
                />
            }
            {view === "questions" &&
                (<div className='flex flex-col gap-2 w-50 margin-auto'>
                    <div className='flex justify-between'>
                        <h1 className='flex flex-col gap-2'>
                            {selectedQuestionIndex + 1} : {questions[selectedQuestionIndex].name}
                        </h1>
                        <div className='timer'>
                            <span className='text-2xl'>{secondsLeft}</span>
                        </div>

                    </div>

                    <div className='flex flex-col gap-2'>
                        {Object.keys(questions[selectedQuestionIndex].options).map((option, index) => {
                            return <div
                                className={`flex gap-2 flex-col ${selectedOptions[selectedQuestionIndex] === option
                                    ? "selected-option"
                                    : "option"
                                    }`}
                                key={index}
                                onClick={() => {
                                    setSelectedOptions({
                                        ...selectedOptions,
                                        [selectedQuestionIndex]: option,
                                    })
                                }}
                            >
                                <h2 >{option} : {questions[selectedQuestionIndex].options[option]}</h2>
                            </div>
                        })}
                    </div>

                    <div className='flex justify-between'>
                        {selectedQuestionIndex > 0 &&
                            <button
                                className='primary-outline1-btn'
                                onClick={() => {
                                    setSelectedQuestionIndex(selectedQuestionIndex - 1);
                                }}
                            >
                                quay lại
                            </button>
                        }
                        {selectedQuestionIndex < questions.length - 1 &&
                            <button
                                className='primary-outline1-btn'
                                onClick={() => {
                                    setSelectedQuestionIndex(selectedQuestionIndex + 1);
                                }}
                            >
                                tiếp theo
                            </button>
                        }
                    </div>
                    {selectedQuestionIndex >= 0 && (
                        <button
                            className='primary-outline1-btn'
                            onClick={() => {
                                clearInterval(intervalId)
                                setTimeUp(true);
                                //setView("result");
                            }}
                        >
                            nộp bài
                        </button>
                    )}

                </div>)
            }
            {view === "result" && (
                <div className='flex justify-center mt-1 '>
                    <div className='flex flex-col gap-1 result'>
                        <h1 className='text'>kết quả </h1>
                        <div>
                            <h1>Tổng số điểm : {examData.totalMarks}</h1>
                            <h1>số điểm để qua bài thi : {examData.passingMarks}</h1>
                            <h1>số câu đúng : {result.correctAnswers.length}</h1>
                            <h1>điểm số đạt được : {result.correctAnswers.length}</h1>
                            <h1>vượt qua kì thi : {result.verdict}</h1>
                        </div>
                    </div>
                    <div className='animation'>
                        {result.verdict === "qua" &&
                            <lottie-player src="https://assets2.lottiefiles.com/packages/lf20_s2lryxtd.json" background="transparent" speed="1" loop autoplay></lottie-player>
                        }
                        {result.verdict === "rớt" &&
                            <lottie-player src="https://assets9.lottiefiles.com/packages/lf20_f09c9g7f.json" background="transparent" speed="1" loop autoplay></lottie-player>
                        }
                    </div>
                </div>
            )}

        </div>)
    );
}

export default WriteExam;
