import { Routes, Route } from 'react-router-dom';
import Landing from './components/Landing.jsx';
import Discover from './components/Discover.jsx';
import Signup from './components/Signup.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/discover" element={<Discover />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<Landing />} />
    </Routes>
  );
}
