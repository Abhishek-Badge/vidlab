import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
//import './App.css';
import VidLabLanding, { LandingPage, VideoHome } from './components/landing-page';
import { UserLogin } from './components/user-login';
import { AdminLogin } from './components/admin-login';
import { AdminDashboard } from './components/admin-dashboard';
import { Useregister } from './components/user-register';
//import { AdminDeleteVideo } from './components/admin-delete video';
import { AdminEditVideo } from './components/admin-edit-video';
import { UserDashboard } from './components/user-dashboard';
import { AddCategoryModal } from './components/add-categoryModal';
import { EditCategoryModal } from './components/edit-category-Modal';
import { DeleteCategoryModal } from './components/delete-category-Modal';
import WatchLaterPage from './components/watch-later';
import LikedVideos from './components/liked-video';
import LikedVideosPage from './components/liked-video';
import SearchBar from './components/search-bar';




function App() {


  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.body.classList.remove("light-theme", "dark-theme");
    document.body.classList.add(theme === "dark" ? "dark-theme" : "light-theme");
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === "light" ? "dark" : "light"));



  return (
    <div className="app">

      <BrowserRouter>
        <Routes>

          <Route path='/' element={<VidLabLanding theme={theme} toggleTheme={toggleTheme} />}></Route>
          <Route path='user-login' element={<UserLogin />} />
          <Route path='admin-login' element={<AdminLogin />} />
          <Route path='admin-dash' element={<AdminDashboard />} />
          <Route path='register-user' element={<Useregister />} />
          { /* <Route path='delete-video/:id' element={<AdminDeleteVideo />} /> */}
          <Route path='edit-video/:id' element={<AdminEditVideo />} />
          <Route path='user-dash' element={<UserDashboard />} />
          <Route path='search-bar' element={<SearchBar />} />
          <Route path='add-category' element={<AddCategoryModal />} />
          <Route path='edit-category' element={<EditCategoryModal />} />
          <Route path='delete-category' element={<DeleteCategoryModal />} />
          <Route path='liked-video' element={<LikedVideosPage />} />
          <Route path='/watch-later' element={<WatchLaterPage />} />


        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;