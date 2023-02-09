import React, { useEffect, useState } from 'react';
import PageTitle from '../../../component/PageTitle';
import { Col, Form, Row, Select, message, Tabs, Table } from 'antd'
import { addExam, deleteQuestionById, editExamById, getExamById } from '../../../apicalls/exams';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice';
import AddEditQuestion from './AddEditQuestion';

function AddEditExam() {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const [examData, setExamData] = useState(null);
  const [showAddEditQuestionModal, setShowAddEditQuestionModal] = useState(false);
  const [selectedQuestion, setselectedQuestion] = useState(null);
  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      let response;
      if (params.id) {
        response = await editExamById({ ...values, examId: params.id });
      } else {
        response = await addExam(values);
      }
      if (response.success) {
        message.success(response.message);
        navigate("/admin/exams");
      }
      else {
        message.error(response.message)
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  }

  const getExamData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getExamById({
        examId: params.id,
      });
      dispatch(HideLoading());
      if (response.success) {
        setExamData(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (params.id) {
      getExamData();
    }
  }, []);

  const deleteQuestion = async (questionId) => {
    try {
      dispatch(ShowLoading());
      const response = await deleteQuestionById({
        questionId,
        examId: params.id
      })
      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        getExamData();
      }
      else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message)
    }
  }

  const questionsColumns = [
    {
      title: "câu hỏi",
      dataIndex: "name",
    },
    {
      title: "lựa chọn",
      dataIndex: "options",
      render: (text, record) => {
        return Object.keys(record.options).map((key) => {
          return <div >{key} : {record.options[key]}</div>
        })
      }
    },
    {
      title: "câu đúng",
      dataIndex: "correctOption",
      render: (text, record) => {
        //return record.options.find((option)=> option._id === text)?.name
        return ` ${record.correctOption}: ${record.options[record.correctOption]}`;
      }
    },
    {
      title: "hoạt động",
      dataIndex: "action",
      render: (text, record) => (
        <div className='flex gap-2'>
          <i className="ri-edit-fill abc"
            onClick={() => {
              setselectedQuestion(record);
              setShowAddEditQuestionModal(true);
            }}
          ></i>
          <i className="ri-delete-bin-line abc"
            onClick={() => {
              deleteQuestion(record._id)
            }}
          ></i>
        </div>
      )
    }
  ]

  return (
    <div>
      <PageTitle title=
        {params.id ? "sửa kì thi" : "thêm kì thi"}
      />

      {(examData || !params.id) && <Form layout='vertical' onFinish={onFinish} initialValues={examData}>
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              label: 'tên kì thi',
              key: '1',
              children:
                <div>
                  <Row gutter={[10, 10]}>
                    <Col span={8}>
                      <Form.Item label="tên kì thi" name='name'>
                        <input type="text" />
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item label="thời gian thi" name='duration'>
                        <input type="number" min={1} />
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item label="Category" name="category">
                        <select name="" id="">
                          <option value="">Select Category</option>
                          <option value="Javascript">Javascript</option>
                          <option value="React">React</option>
                          <option value="Node">Node</option>
                          <option value="MongoDB">MongoDB</option>
                        </select>
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item label="tổng điểm số" name='totalMarks'>
                        <input type="number" min={1} />
                      </Form.Item>
                    </Col>

                    <Col span={8}>
                      <Form.Item label="điểm qua " name='passingMarks'>
                        <input type="number" min={1} />
                      </Form.Item>
                    </Col>

                  </Row>
                  <div className='flex justify-end gap-2'>
                    <button className='primary-outlined-btn' type="submit"
                      onClick={() => navigate("/admin/exams")}
                    >close</button>
                    <button className='primary-contained-btn' type="submit">Save</button>
                  </div>
                </div>
              ,
            },
            {
              label: 'câu hỏi',
              key: '2',
              children:
                <div>
                  {params.id && (
                    <div>
                      <div className='flex justify-between'>
                        <h1>câu hỏi</h1>
                        <button className='primary-outline1-btn'
                          type='button'
                          onClick={() => setShowAddEditQuestionModal(true)}
                        >thêm câu hỏi</button>
                      </div>
                      <Table
                        columns={questionsColumns}
                        dataSource={examData?.questions || []}
                      />
                    </div>
                  )}
                </div>
              ,
            },
          ]}
        />
      </Form>}

      {showAddEditQuestionModal && (
        <AddEditQuestion
          setShowAddEditQuestionModal={setShowAddEditQuestionModal}
          showAddEditQuestionModal={showAddEditQuestionModal}
          examId={params.id}
          refreshData={getExamData}
          selectedQuestion={selectedQuestion}
          setselectedQuestion={setselectedQuestion}
        />
      )}


    </div>
  );
}

export default AddEditExam;
