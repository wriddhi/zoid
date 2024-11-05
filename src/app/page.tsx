import { Hero } from "./_components/Hero";
import { Pricing } from "./_components/Pricing";
import { FAQ } from "./_components/FAQ";

export default function Home() {
  return (
    <main className="py-24 min-w-screen h-full flex flex-col gap-24 items-center">
      <Hero />
      <Pricing />
      <FAQ />
    </main>
  );
}
