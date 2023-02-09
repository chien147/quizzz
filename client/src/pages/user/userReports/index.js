import { message, Table } from 'antd';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getAllReportsByUser } from '../../../apicalls/reports';
import PageTitle from '../../../component/PageTitle';
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice';
function UserReports() {
    const [reportsData, setReportsData] = useState([]);
    const dispatch = useDispatch();
    const columns = [
        {
            title: "teen de thi",
            dataIndex: "examname",
            render: (text, record) =><>
                {record.exam.name}
            </>
        },
        {
            title: "ngay",
            dataIndex: "data",
            render: (text, record) =><>
                {record.createdAt}
            </>
        },
        {
            title: "tổng câu hỏi ",
            dataIndex: "toltalQuestions",
            render: (text, record) =><>
                {record.exam.questions.length}
            </>
        },
        {
            title: "số câu đúng",
            dataIndex: "correctAnswers",
            render: (text, record) =><>
                {record.result.correctAnswers.length}
            </>
        },
        {
            title: "số câu sai",
            dataIndex: "wrongAnswers",
            render: (text, record) =><>
                {record.result.wrongAnswers.length}
            </>
        },
        {
            title: "ket qua",
            dataIndex: "verdict",
            render: (text, record) =><>
                {record.result.verdict}
            </>

        }
    ]

    const getData = async () =>{
        try {
            dispatch(ShowLoading());
            const response = await getAllReportsByUser();
            if (response.data) {
                setReportsData(response.data)
            } else {
                message.error(response.message)
            }
            dispatch(HideLoading())
        } catch (error) {
            dispatch(HideLoading());
            message.error(error.message)
        }
    }

    useEffect(() => {
      getData()
    }, []);

    return (
        <div>
            <PageTitle title="de thi da lam" />
            <div className='bg-1'>

                <Table columns={columns} dataSource={reportsData} ></Table>
            </div>
        </div>
    );
}

export default UserReports;
