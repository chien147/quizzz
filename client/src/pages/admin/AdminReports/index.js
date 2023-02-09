import { message, Table } from 'antd';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getAllReports, getAllReportsByUser } from '../../../apicalls/reports';
import PageTitle from '../../../component/PageTitle';
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice';
import moment from "moment";

function AdminReports() {
    const [reportsData, setReportsData] = useState([]);
    const dispatch = useDispatch();
    const [filters, setFilters] = useState({
        examName:"",
        userName:""
    });
    const columns = [
        {
            title: "teen de thi",
            dataIndex: "examname",
            render: (text, record) =><>
                {record.exam.name}
            </>
        },
        {
            title: "tên thí sinh",
            dataIndex: "userName",
            render: (text, record) =><>
                {record.user.name}
            </>
        },
        {
            title: "ngay",
            dataIndex: "data",
            render: (text, record) => (
                <>{moment(record.createdAt).format("DD-MM-YYYY hh:mm:ss")}</>
            ),
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
            const response = await getAllReports(filters);
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
            <div className='bg-1 flex gap-2 w-75'>
                <input type="text" placeholder='đề thi'
                    value={filters.examName}
                    onChange={(e)=>setFilters({...filters, examName: e.target.value})}
                />
                <input type="text" placeholder='học sinh'
                    value={filters.userName}
                    onChange={(e)=>setFilters({...filters, userName: e.target.value})}
                />
                <button className='primary-outline2-btn'
                    onClick={()=>getData()}
                >tìm kiếm</button>
            </div>
            <Table columns={columns} dataSource={reportsData} ></Table>
        </div>
    );
}

export default AdminReports;
