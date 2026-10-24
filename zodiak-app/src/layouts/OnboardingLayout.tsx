import { Outlet } from "react-router-dom";
import { PageTransition } from "../components/motion/PageTransition";
import { Starfield } from "../components/motion/Starfield";

export function OnboardingLayout() {
  return (
    <>
      <Starfield />
      <PageTransition className="pt-safe pb-28 min-h-screen flex flex-col w-full max-w-screen-sm mx-auto">
        <Outlet />
      </PageTransition>
    </>
  );
}
