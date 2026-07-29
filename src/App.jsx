import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import EmployeeDetail from "./pages/EmployeeDetail";
import Departments from "./pages/Departments";
import Attrition from "./pages/Attrition";
import AuditLog from "./pages/AuditLog";
import Concerns from "./pages/Concerns";
import RespondToConcern from "./pages/RespondToConcern";
import ExitInterview from "./pages/ExitInterview";
import ExitInterviewForm from "./pages/ExitInterviewForm";
import Profile from "./pages/Profile";
import EmployeeDocuments from './pages/EmployeeDocuments';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/respond/:token/" element={<RespondToConcern />} />
          <Route
            path="/exit-interview/:emp_id/:token"
            element={<ExitInterviewForm />}
          />

          {/* Protected */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employees"
            element={
              <ProtectedRoute>
                <Employees />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employees/:id"
            element={
              <ProtectedRoute>
                <EmployeeDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/departments"
            element={
              <ProtectedRoute>
                <Departments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/attrition"
            element={
              <ProtectedRoute>
                <Attrition />
              </ProtectedRoute>
            }
          />
          <Route
            path="/concerns"
            element={
              <ProtectedRoute>
                <Concerns />
              </ProtectedRoute>
            }
          />
          <Route
            path="/audit-log"
            element={
              <ProtectedRoute>
                <AuditLog />
              </ProtectedRoute>
            }
          />

          <Route
            path="/exit-interviews"
            element={
              <ProtectedRoute>
                <ExitInterview />
              </ProtectedRoute>
            }
          />

          <Route 
          path="/profile" 
          element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

        <Route 
        path="/documents" 
        element={
        <ProtectedRoute>
          <EmployeeDocuments />
        </ProtectedRoute>
} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
