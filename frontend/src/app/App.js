import MainPage from '../pages/MainPage/MainPage';
import '../shared/styles/App.scss';
import { Navigate, Route, Routes } from 'react-router-dom';
import Header from '../widgets/Header/Header';

function App() {
  return (
    <div className="App">
      <Header/>
      <Routes>
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/" element={<MainPage/>} />
      </Routes>
    </div>
  );
}

export default App;
