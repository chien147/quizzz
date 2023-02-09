import React,{useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import PageTitle from '../../../component/PageTitle';
import {message, Table} from 'antd'
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice';
import { deleteExamById, getAllExams } from '../../../apicalls/exams';

function Exams() {

    const navigate = useNavigate(); 
    const [exams, setExams] = useState([]);
    const dispatch = useDispatch();

    const deleteExam = async (examId) => {
        try {
          dispatch(ShowLoading());
          const response = await deleteExamById({examId,})
          dispatch(HideLoading());
          if (response.success) {
            message.success(response.message);
            getExamsData();
          } else {
            message.success(response.message)
          }
        } catch (error) {
          dispatch(HideLoading())
          message.success(error.message)
        }
      }

    const columns = [
        {
            title: "Exam Name",
            dataIndex: "name"
        },
        {
            title: "Duration",
            dataIndex: "duration"
        },
        {
            title: "Category",
            dataIndex: "category"
        },
        {
            title: "Total Marks",
            dataIndex: "totalMarks"
        },
        {
            title: "Passing Marks",
            dataIndex: "passingMarks"
        },
        {
            title: "Action",
            dataIndex: "action",
            render : (text, record )=>(
                <div className='flex gap-2'>
                    <i className="ri-edit-fill abc" 
                        onClick={()=>navigate(`/admin/exams/edit/${record._id}`)}
                    ></i>
                    <i className="ri-delete-bin-line abc"
                        onClick={()=> deleteExam(record._id)}
                    ></i>
                </div>
            )
        }
    ]

    const getExamsData = async () =>{
        try {
            dispatch(ShowLoading());
            const response = await getAllExams();
            dispatch(HideLoading());
            if(response.success){
                setExams(response.data);
            }
            else{
                message.error(response.message)
            }
        } catch (error) {
            dispatch(HideLoading());
            message.error(error.message)
        }
    }

    useEffect(() => {
      getExamsData();
    }, []);

  return (
    <div>
        <PageTitle title="exams" className="extitle"/>
        <div className='mt-2'> 

            <button className='primary-outline-btn flex items-center'
                onClick={()=>navigate("/admin/exams/add")}
            >
                <i className='ri-add-line'></i>
                Add Exam
            </button>
            <Table columns={columns} dataSource={exams}/>
        </div>
    </div>
  );
}

export default Exams;
