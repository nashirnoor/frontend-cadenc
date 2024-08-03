import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './users/components/Signup';
import Login from './users/components/Login';
import Profile from './users/components/Profile';
import VerifyEmail from './users/components/VerifyEmail';
import ForgotPassword from './users/components/ForgotPassword';
import Landing from './users/components/Landing';
import { Toaster } from 'sonner';
import ResetPassword from './users/components/ResetPassword';
import 'react-toastify/dist/ReactToastify.css';
import AdminLogin from './admin/components/AdminLogin';
import RecruiterRegister from './recruiter/RecruiterRegister';
import AdminHome from './admin/components/AdminHome';
import ProtectedRoute from '../src/admin/ProtectedRoute';
import RecruiterList from './admin/components/RecruiterList';
import RecruiterHome from './recruiter/RecruiterHome';
import About from './users/components/About';
import FindJobs from './users/components/FindJobs';
import JobDetail from './users/components/JobDetail';
import Companies from './users/components/Companies';
import CompanyProfile from './recruiter/CompanyProfile';
import UploadJob from './recruiter/UploadJob';
import About_recruiter from './recruiter/About_recruiter';
import ProtectedRouteRecruiter from './recruiter/components/ProtectedRouteRecruiter';
import AdminRecruiterApproval from './admin/components/AdminRecruiterApproval';
import CompanyForm from './recruiter/CompanyForm';
import SkillManagement from './admin/components/SkillManagement';
import UserProfile from './users/components/UserProfile';
import UserDetailForm from './users/components/UserForm/UserDetailForm';
import ExperienceForm from './users/components/UserForm/ExperienceForm';
import EducationForm from './users/components/UserForm/EducationForm';
import JobPosted from './recruiter/JobPosted';
import Applicants from './recruiter/Applicants';
import CompanyProfileUser from './users/components/CompanyProfileUser';
import ChatPage from './users/components/Chat/ChatPage';
// import PageChat from './users/components/Chat/PageChat';
import Dashboard from './admin/components/Dashboard';



function App() {
  
  return (
    <>
    <Router>
      <Routes>
      
        {/* <Route path='/' element={<Signup/>} /> */}
        {/* <Route path='/login' make the below login element={<Login/>} /> */}
        <Route path="/" element={
                    <ProtectedRouteRecruiter>
                        <Login />
                    </ProtectedRouteRecruiter>
                } />
                <Route path="/signup" element={
                    <ProtectedRouteRecruiter>
                        <Signup />
                    </ProtectedRouteRecruiter>
                } />

        <Route path='/profile' element={<Profile/>} />
        <Route path='/otp/verify' element={<VerifyEmail/>} />
        <Route path='/forgot-password' element={<ForgotPassword/>} />
        <Route path='/landing' element={<Landing/>} />
        <Route path='/about' element={<About/>} />
        <Route path='/find-jobs' element={<FindJobs/>} />

        

        <Route path='/password-reset-confirm/:uid/:token' element={<ResetPassword/>} />

        <Route path='/recruiter-register' element={<RecruiterRegister/>}/>

        <Route path="/admin-login" element={<AdminLogin />} />
        <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/admin-home" element={<AdminHome />} />
          <Route path='/recruiter-list' element={<RecruiterList/>}/>
          <Route path='/recruiter-approval' element={<AdminRecruiterApproval/>} />
          <Route path='/skill-management' element={<SkillManagement/>} />
        </Route>

        <Route path='/recruiter-home' element={<RecruiterHome/>} />
        <Route path='/company-form' element={<CompanyForm/>} />

        <Route path='/company-list' element={<Companies/>} />
        <Route path='/company-profile' element={<CompanyProfile/>} />
        <Route path='/upload-job' element={<UploadJob/>} />
        <Route path='/about-recruiter' element={<About_recruiter/>} />

        <Route path='/user-detail-form' element={<UserDetailForm />} />
        
        <Route path='/user-profile' element={<UserProfile/>} />

        <Route path="/job/:id" element={<JobDetail/>} />
        <Route path="/experience" element={<ExperienceForm/>} />
        <Route path="/education" element={<EducationForm/>} />

        <Route path='/job-posted' element={<JobPosted/>} />
        {/* <Route path='/applicants' element={<Applicants/>} /> */}
        <Route path='/applicants/:jobId' element={<Applicants />} />
        {/* <Route path='/user-chat/:id' element={<PageChat />} /> */}

        {/* <Route path="/chat/:id" element={<ChatPage />} /> */}

              {/* <Route path="/chat" element={<ChatPage />} /> */}
              <Route path="/company-profile-user/:id" element={<CompanyProfileUser />} />

              {/* <Route path="/chat/:id" element={<ChatPage />} /> */}
               {/* <Route path="/chat" element={<ChatPage/>} /> */}
               <Route path="/chat" element={<ChatPage />} />

               <Route path="/chat/:id" element={<ChatPage />} />
       
      </Routes>
      <Toaster position='top-right' richColors />
    </Router>


    </>

  )
}

export default App
