import React from 'react';
import {Form, message} from 'antd'
import {Link} from 'react-router-dom'
import { loginUser } from '../../../apicalls/users';
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice';


function Login() {
    const dispatch = useDispatch();
    const onFinish= async(values)=>{
        try {
            dispatch(ShowLoading());
            const response = await loginUser(values)
            dispatch(HideLoading());
            if(response.success){
                message.success(response.message)
                localStorage.setItem('token', response.data)
                window.location.href = "/";
            }
            else{
                message.error(response.message)
            }
        } catch (error) {
            dispatch(HideLoading());
            message.error(error.message);
        }
    }

    return (
        <div className='flex justify-center item-center h-screen w-screen'>
            <div className='card w-25 p-3'>
                <h1 className='text-xl item-center flex justify-center'>
                    đăng nhập
                </h1>
                <Form layout="vertical" onFinish={onFinish}
                    className='mt-2'
                >
                    <Form.Item
                        name="email"
                        label="email"
                    >
                        <input type="text" placeholder='Email'/>
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="mật khẩu"
                    >
                        <input type="password" placeholder='mật khẩu'/>
                    </Form.Item>
                    <div className='flex flex-col gap-2'>
                        <button type='submit' className='primary-contained-btn mt-2 w-screen '>
                            đăng nhập
                        </button>
                        <Link to="/register" className='primary-contained-btn w-screen '>đăng ký </Link>

                    </div>

                </Form>
            </div>
        </div>
    );
}

export default Login;
