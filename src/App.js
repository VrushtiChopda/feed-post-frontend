import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Registration from './pages/Registration';
import Login from './pages/Login';
import UserProfile from './components/User/UserProfile';
import Protected from './pages/Protected';
import UserPost from './components/Post/UserPost';
import Post from './components/Post/Post';
import Dashboard from './components/sidebar/Dashboard';
import PostDetail from './components/Post/PostDetail';

function App() {
  return (
    <>

      <Router>
        <Routes >
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Registration />} />
          <Route path='/dashboard' element={<Protected Component={Dashboard} />} >
            <Route path='userpost' element={<UserPost />} />
            <Route path='posts' element={<Post />} />
            <Route path='profile' element={<UserProfile />} />
          </Route>
          <Route path='/postdetail' element={<PostDetail />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
