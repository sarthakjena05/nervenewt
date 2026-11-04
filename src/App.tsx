import { Nav } from "./landing/Nav";
import { Hero } from "./landing/Hero";
import { HowItWorks } from "./landing/HowItWorks";
import { Signals } from "./landing/Signals";
import { Applications } from "./landing/Applications";
import { EarlyAccess } from "./landing/EarlyAccess";
import { Footer } from "./landing/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-paper font-sans text-ink antialiased">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-ink focus:px-3 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <HowItWorks />
        <Signals />
        <Applications />
        <EarlyAccess />
      </main>
      <Footer />
    </div>
  );
}
