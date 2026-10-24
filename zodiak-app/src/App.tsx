import { Route, Routes } from "react-router-dom";
import { BottomNav } from "./components/BottomNav";
import { WelcomeCredits } from "./components/credits/WelcomeCredits";
import { RequireSignIn } from "./components/RequireSignIn";
import { ScrollToTop } from "./components/ScrollToTop";
import { OnboardingLayout } from "./layouts/OnboardingLayout";
import { SeekerLayout } from "./layouts/SeekerLayout";
import { useDesktopLanding } from "./lib/useDesktopLanding";
import AskPage from "./pages/AskPage";
import BirthDetailsPage from "./pages/BirthDetailsPage";
import CheckoutPage from "./pages/CheckoutPage";
import CreditsPage from "./pages/CreditsPage";
import HomePage from "./pages/HomePage";
import HoroscopePage from "./pages/HoroscopePage";
import LandingPage from "./pages/LandingPage";
import KundliPage from "./pages/KundliPage";
import LoginPage from "./pages/LoginPage";
import MilanPage from "./pages/MilanPage";
import NotFoundPage from "./pages/NotFoundPage";
import OrderStatusPage from "./pages/OrderStatusPage";
import PalmistryPage from "./pages/PalmistryPage";
import ProductPage from "./pages/ProductPage";
import ProfilePage from "./pages/ProfilePage";
import RemediesPage from "./pages/RemediesPage";

export function App() {
  // Computers in a normal browser tab get the landing page at "/"; phones and the installed app go straight in
  const desktopLanding = useDesktopLanding();
  return (
    <>
      <ScrollToTop />
      <Routes>
        {desktopLanding && <Route index element={<LandingPage />} />}
        <Route element={<SeekerLayout />}>
          {!desktopLanding && <Route index element={<HomePage />} />}
          <Route path="home" element={<HomePage />} />
          <Route path="kundli" element={<RequireSignIn feature="kundli"><KundliPage /></RequireSignIn>} />
          <Route path="horoscope" element={<RequireSignIn feature="horoscope"><HoroscopePage /></RequireSignIn>} />
          <Route path="milan" element={<RequireSignIn feature="milan"><MilanPage /></RequireSignIn>} />
          <Route path="palmistry" element={<RequireSignIn feature="palm"><PalmistryPage /></RequireSignIn>} />
          <Route path="remedies" element={<RemediesPage />} />
          <Route path="remedies/:slug" element={<ProductPage />} />
          <Route path="orders/:reference" element={<OrderStatusPage />} />
          <Route path="profile" element={<RequireSignIn feature="profile"><ProfilePage /></RequireSignIn>} />
          <Route path="credits" element={<RequireSignIn feature="credits"><CreditsPage /></RequireSignIn>} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route element={<OnboardingLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="birth-details" element={<RequireSignIn feature="birth"><BirthDetailsPage /></RequireSignIn>} />
        </Route>
        <Route path="checkout/:slug" element={<CheckoutPage />} />
        <Route path="ask" element={<AskPage />} />
      </Routes>
      {/* Shown on every screen, including login, checkout and the Pandit Jii chat */}
      <BottomNav />
      <WelcomeCredits />
    </>
  );
}
