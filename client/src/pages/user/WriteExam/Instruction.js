import React from 'react';

function Instruction({ examData, startTimer, setView }) {
  return (
    <div className='flex flex-col item-center paddingr-60'>
      <div className='text-2xl '>
        hưỡng dẫn
      </div>
      <ul className='flex flex-col gap-1'>
        <li>thời gian hoàn thành kì thi {examData.duration} giây </li>
        <li>sau {examData.duration} giây bài thi sẽ tự động nộp</li>
        <li>khi nộp bài sẽ không sửa được đáp án</li>
        <li>không làm mới lại trang web</li>
        <li>
          bạn sử dụng nút <span className='font-bold'>"sau"</span> và
          <span className='font-bold'>"trước"</span>
          để di chuyển giữa các câu hỏi
        </li>
        <li>
          tổng điểm của bài thi là : <span className='font-bold'>{examData.totalMarks}</span>
        </li>
      </ul>
      <button className='primary-outline1-btn'
        onClick={()=> {
          setView("questions")
          startTimer()
        }}

      >
        bắt đầu kì thi
      </button>
    </div>
  );
}

export default Instruction;
