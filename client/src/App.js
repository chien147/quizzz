import { Button } from 'antd';
import './stylesheets/theme.css'
import './stylesheets/text-elements.css'
import './stylesheets/align-elements.css'
import './stylesheets/custom-compoment.css'
import './stylesheets/form-elements.css'
import './stylesheets/layout.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/compoment/Login';
import Register from './pages/compoment/Register';
import ProtectedRouter from './component/ProtectedRoute';
import Home from './pages/compoment/home';
import Exams from './pages/admin/Exams';
import AddEditExam from './pages/admin/Exams/AddEditExam';
import Loader from './component/Loader';
import { useSelector } from 'react-redux';
import WriteExam from './pages/user/WriteExam';
import UserReports from './pages/user/userReports';
import AdminReports from './pages/admin/AdminReports';
function App() {
  const { loading } = useSelector((state) => state.loader);
  return (

    <>
      {loading && <Loader />}
      <BrowserRouter>
        <Routes>

          {/* common Router */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* user  */}
          <Route path='/' element={<ProtectedRouter>
            <Home/>
          </ProtectedRouter>} />

          <Route path='/user/Write-exam/:id' element={<ProtectedRouter>
            <WriteExam/>
          </ProtectedRouter>} />
          <Route path='/user/reports' element={<ProtectedRouter>
            <UserReports/>
          </ProtectedRouter>} />

          {/* admin  */}
          <Route path='/admin/exams' element={<ProtectedRouter>
            <Exams/>
          </ProtectedRouter>} />

          <Route path='/admin/exams/add' element={<ProtectedRouter>
            <AddEditExam/>
          </ProtectedRouter>} />

          <Route path='/admin/exams/edit/:id' element={<ProtectedRouter>
            <AddEditExam/>
          </ProtectedRouter>} />

          <Route path='/admin/reports' element={<ProtectedRouter>
            <AdminReports/>
          </ProtectedRouter>} />
        </Routes>


      </BrowserRouter>
    </>
  );
}

export default App;
