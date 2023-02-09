import { Col, message, Row } from 'antd';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getAllExams } from '../../../apicalls/exams';
import PageTitle from '../../../component/PageTitle';
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice';
import {useNavigate} from 'react-router-dom';

function Home() {

  const [exams, setExams] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getExams = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllExams();
      if (response.success) {
        setExams(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getExams()
  }, []);


  return (
    <div>
      <PageTitle title="Home" />
      <Row gutter={[16, 16]}>
        {exams.map((exam, index) => (
          <Col span={6} key={index}>
            <div className='card flex flex-col gap-1 p-2'>
              <h1 className="text-2xl">{exam?.name}</h1>
              <h1 className="text-md">Category : {exam.category}</h1>
              <h1 className="text-md">Total Marks : {exam.totalMarks}</h1>
              <h1 className="text-md">Passing Marks : {exam.passingMarks}</h1>
              <h1 className="text-md">Duration : {exam.duration}</h1>
              <button className='primary-outline1-btn'
                onClick={()=> navigate(`/user/write-exam/${exam._id}`)}
              >
                bắt đầu kì thi 
              </button>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default Home;







