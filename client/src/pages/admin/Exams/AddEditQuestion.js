import { Modal, Form, Input, Col, Row, message } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';
import { addQuestionToExam, editQuestionById,  } from '../../../apicalls/exams';
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice';

const { TextArea } = Input;

function AddEditQuestion({
  showAddEditQuestionModal,
  setShowAddEditQuestionModal,
  refreshData,
  examId,
  selectedQuestion,
  setselectedQuestion
}) {
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    console.log(values);
    try {
      dispatch(ShowLoading());
      const requiredPayload = {
        name: values.name,
        correctOption: values.correctOption,
        options: {
          A: values.A,
          B: values.B,
          C: values.C,
          D: values.D,
        },
        exam: examId,
      };
      //let response = await addQuestionToExam(requiredPayload);
      let response;
      if (selectedQuestion) {
        response = await editQuestionById({
          ...requiredPayload,
          questionId: selectedQuestion._id
        })
      } else {
        response = await addQuestionToExam(requiredPayload)
      }
      if (response.success) {
        message.success(response.message);
        refreshData();
        setShowAddEditQuestionModal(false);
      }
      else {
        message.error(response.message)
      }
      setselectedQuestion(null)
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.success(error.message)
    }
  }
  return (
    <Modal title={selectedQuestion ? "sửa câu hỏi" : "thêm câu hỏi"}
      className='text-align-center'
      open={showAddEditQuestionModal}
      footer={false}
      //onOk={() => setShowAddEditQuestionModal(false)}
      onCancel={() => {
        setShowAddEditQuestionModal(false),
        setselectedQuestion(null)
      }}
    >
      <Form onFinish={onFinish} layout="vertical" className='w-screen'
        initialValues={{
          name: selectedQuestion?.name,
          A: selectedQuestion?.options?.A,
          B: selectedQuestion?.options?.B,
          C: selectedQuestion?.options?.C,
          D: selectedQuestion?.options?.D,
          correctOption: selectedQuestion?.correctOption,
        }}
      >
        <Form.Item name='name' label="câu hỏi">
          <TextArea type="text" />
        </Form.Item>
        <Form.Item name='correctOption' label="câu đúng" >
          <select>
            <option value="">Select Category</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
          {/* <TextArea type="text" /> */}
        </Form.Item>
        <Row gutter={12}>
          <Col span={12} push={5} className="position-inherit ">
            <Form.Item name='A' label="A">
              <TextArea type="text" />
            </Form.Item>
          </Col>
          <Col span={12} push={5} className="position-inherit">
            <Form.Item name='B' label="B" >
              <TextArea type="text" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={12} push={5} className="position-inherit">
            <Form.Item name='C' label="C">
              <TextArea type="text" className='' />
            </Form.Item>
          </Col>
          <Col span={12} push={5} className="position-inherit">
            <Form.Item name='D' label="D" >
              <TextArea type="text" />
            </Form.Item>
          </Col>
        </Row>
        <div className='flex justify-end'>
          <button className='primary-outline1-btn'
            type='button'
            onClick={() => setShowAddEditQuestionModal(false)}
          >
            thoát
          </button>
          <button className='primary-contained1-btn'>
            lưu
          </button>
        </div>

      </Form>


    </Modal>
  );
}

export default AddEditQuestion;
