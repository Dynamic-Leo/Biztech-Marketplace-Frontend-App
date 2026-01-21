import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { MainLayout } from './layout/MainLayout';
import { ScrollToTop } from './components/ScrollToTop';
import { HomePage } from './pages/HomePage';
import { RegisterPage } from './pages/RegisterPage';
import { SignInPage } from './pages/SignInPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { SearchPage } from './pages/SearchPage';
import { ListingDetailPage } from './pages/ListingDetailPage';
import { ValuationPage } from './pages/ValuationPage';
import { CreateListingPage } from './pages/CreateListingPage';
import { ProfilePage } from './pages/ProfilePage';

// Dashboard pages
import { AdminDashboard } from './pages/AdminDashboard';
import { AgentDashboard } from './pages/AgentDashboard';
import { SellerDashboard } from './pages/SellerDashboard';
import { BuyerDashboard } from './pages/BuyerDashboard';

// Informational pages
import { HowItWorksPage } from './pages/HowItWorksPage';
import { PricingPage } from './pages/PricingPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { VerifyEmail } from './pages/VerifyEmail';
import { ResetPassword } from './pages/ResetPassword';
import { Toaster } from './components/ui/sonner'; 

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Toaster />
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {/* Public Routes */}
            <Route index element={<HomePage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="signin" element={<SignInPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="listing/:id" element={<ListingDetailPage />} />
            <Route path="valuation" element={<ValuationPage />} />
            
            {/* Informational Pages */}
            <Route path="how-it-works" element={<HowItWorksPage />} />
            <Route path="pricing" element={<PricingPage />} />
            <Route path="terms" element={<TermsPage />} />
            <Route path="privacy" element={<PrivacyPage />} />
            
            {/* Dashboard Routes */}
            <Route path="dashboard/admin" element={<AdminDashboard />} />
            <Route path="dashboard/agent" element={<AgentDashboard />} />
            <Route path="dashboard/seller" element={<SellerDashboard />} />
            <Route path="dashboard/buyer" element={<BuyerDashboard />} />
            
            {/* Profile Route */}
            <Route path="profile" element={<ProfilePage />} />
            
            {/* Seller-specific Routes */}
            <Route path="create-listing" element={<CreateListingPage />} />
            
            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}