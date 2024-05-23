import FullScanForm from './components/FullScanForm';
import Report from './components/Report';
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className='flex flex-col justify-center'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<FullScanForm />} />
          <Route path='/report' element={<Report />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
