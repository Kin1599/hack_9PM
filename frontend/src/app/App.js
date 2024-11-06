import MainPage from '../pages/MainPage/MainPage';
import '../shared/styles/App.scss';
import { Navigate, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/" element={<MainPage/>} />
      </Routes>
    </div>
  );
}

export default App;
