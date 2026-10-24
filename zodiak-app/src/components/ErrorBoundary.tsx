import { Component, type ReactNode } from "react";

/** Shows a calm recovery screen instead of a blank page if any screen crashes. */
export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error(error);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
        <span className="material-symbols-outlined text-primary text-5xl">auto_awesome</span>
        <p className="font-body-lg text-body-lg text-on-surface">Something went wrong. • कुछ गड़बड़ हो गई। • ಏನೋ ತಪ್ಪಾಗಿದೆ.</p>
        <button onClick={() => window.location.assign("/")} className="px-6 py-2.5 rounded-full bg-primary text-on-primary font-label-lg text-label-lg">
          Home • होम • ಮುಖಪುಟ
        </button>
      </main>
    );
  }
}
