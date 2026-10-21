


// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import Login from './pages/auth/Login';
// import Register from './pages/auth/Register';

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/*Login Route */}
//         <Route path="/" element={<Login />} />
//         <Route path="*" element={<Navigate to="/" replace />} />

//         {/*Register Route */}
//         <Route path="/" element={<Register/>} />
//         <Route path="*" element={<Navigate to="/" replace />} />

//       </Routes>
//     </BrowserRouter>
//   );
// }



import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import HrDashboard from "./pages/hr/HrDashboard";
import Candidates from "./pages/hr/Candidates";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* HR routes */}
        <Route
          path="/hr/dashboard"
          element={<HrDashboard />}
        />

        <Route
          path="/hr/candidates"
          element={<Candidates />}
        />

        {/* Unknown routes */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
