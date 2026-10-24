import { Outlet } from "react-router-dom";
import { AppHeader } from "../components/AppHeader";
import { PageTransition } from "../components/motion/PageTransition";
import { Starfield } from "../components/motion/Starfield";
import { InstallPrompt } from "../components/pwa/InstallPrompt";

export function SeekerLayout() {
  return (
    <>
      <Starfield />
      <AppHeader />
      <PageTransition className="w-full max-w-screen-sm mx-auto flex-1 flex flex-col">
        <Outlet />
      </PageTransition>
      <InstallPrompt />
    </>
  );
}
