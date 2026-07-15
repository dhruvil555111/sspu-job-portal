import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import JobsListing from './pages/jobs/JobsListing';
import StudentDashboard from './pages/student/StudentDashboard';
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/ui/ProtectedRoute';
import About from './pages/About';
import Companies from './pages/Companies';
import PlacementDrives from './pages/PlacementDrives';
import TrainingPrograms from './pages/TrainingPrograms';
import Statistics from './pages/Statistics';
import Contact from './pages/Contact';
import Calendar from './pages/Calendar';
import AITools from './pages/AITools';
import StudentProfile from './pages/student/StudentProfile';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-white dark:bg-dark-950 text-dark-900 dark:text-white transition-colors duration-300">
            <Navbar />

            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/jobs" element={<JobsListing />} />
              <Route path="/about" element={<About />} />
              <Route path="/companies" element={<Companies />} />
              <Route path="/placement-drives" element={
                <ProtectedRoute roles={['student', 'alumni', 'recruiter', 'tpo', 'superadmin', 'coordinator']}><PlacementDrives /></ProtectedRoute>
              } />
              <Route path="/training-programs" element={
                <ProtectedRoute roles={['student', 'alumni', 'recruiter', 'tpo', 'superadmin', 'coordinator']}><TrainingPrograms /></ProtectedRoute>
              } />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/calendar" element={
                <ProtectedRoute roles={['student', 'alumni', 'recruiter', 'tpo', 'superadmin', 'coordinator']}><Calendar /></ProtectedRoute>
              } />
              <Route path="/ai-tools" element={
                <ProtectedRoute roles={['student', 'alumni']}><AITools /></ProtectedRoute>
              } />

              {/* Student Routes */}
              <Route path="/student/dashboard" element={
                <ProtectedRoute roles={['student', 'alumni']}><StudentDashboard /></ProtectedRoute>
              } />
              <Route path="/student/profile" element={
                <ProtectedRoute roles={['student', 'alumni']}><StudentProfile /></ProtectedRoute>
              } />

              {/* Recruiter Routes */}
              <Route path="/recruiter/dashboard" element={
                <ProtectedRoute roles={['recruiter']}><RecruiterDashboard /></ProtectedRoute>
              } />

              {/* Admin / TPO Routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute roles={['tpo', 'superadmin', 'coordinator']}><AdminDashboard /></ProtectedRoute>
              } />

              {/* Placeholder routes for navigation */}
              <Route path="/departments" element={<PlaceholderPage title="Departments" desc="Browse all university departments" />} />
              <Route path="/forgot-password" element={<PlaceholderPage title="Forgot Password" desc="Reset your password via OTP" />} />

              {/* 404 */}
              <Route path="*" element={
                <div className="min-h-screen flex items-center justify-center pt-20">
                  <div className="text-center">
                    <h1 className="text-8xl font-display font-bold text-gradient mb-4">404</h1>
                    <p className="text-xl text-dark-500 mb-6">Page not found</p>
                    <a href="/" className="btn-primary">Go Home</a>
                  </div>
                </div>
              } />
            </Routes>

            <Footer />

            {/* Toast notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--color-dark-800, #1e293b)',
                  color: '#fff',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  fontSize: '14px',
                },
                success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
                error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

// Simple placeholder for routes not yet fully built
function PlaceholderPage({ title, desc }) {
  return (
    <div className="min-h-screen flex items-center justify-center pt-20 bg-dark-50 dark:bg-dark-950">
      <div className="text-center">
        <h1 className="text-3xl font-display font-bold text-dark-900 dark:text-white mb-2">{title}</h1>
        <p className="text-dark-500">{desc}</p>
        <p className="text-sm text-primary-500 mt-4">Coming soon — connect backend to enable</p>
      </div>
    </div>
  );
}

export default App;
