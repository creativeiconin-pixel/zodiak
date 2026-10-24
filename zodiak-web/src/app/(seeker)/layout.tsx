import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";

export default function SeekerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppHeader />
      <div className="w-full max-w-screen-sm mx-auto flex-1 flex flex-col">{children}</div>
      <BottomNav />
    </>
  );
}
