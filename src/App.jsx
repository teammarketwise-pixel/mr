import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Home from '@/pages/Home';
import Report from '@/pages/Report';
import Planner from '@/pages/Planner';
import Regio from '@/pages/Regio';
import Kaart from '@/pages/Kaart';
import SnelZoeken from '@/pages/SnelZoeken';
import MijnClaims from '@/pages/MijnClaims';
import Beheerder from '@/pages/Beheerder';
import Toegang from '@/pages/Toegang';
import Profiel from '@/pages/Profiel';
import Marc from '@/pages/Marc';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/rapport" element={<Report />} />
      <Route path="/planner" element={<Planner />} />
      <Route path="/regio" element={<Regio />} />
      <Route path="/kaart" element={<Kaart />} />
      <Route path="/snel-zoeken" element={<SnelZoeken />} />
      <Route path="/mijn-claims" element={<MijnClaims />} />
      <Route path="/beheerder" element={<Beheerder />} />
      <Route path="/toegang" element={<Toegang />} />
      <Route path="/profiel" element={<Profiel />} />
      <Route path="/marc" element={<Marc />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
