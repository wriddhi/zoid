import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <main className="p-4 min-w-screen h-full grid place-items-center">
      <section
        id="hero"
        className="flex flex-col items-center p-4 gap-8 w-full md:w-2/3 lg:w-1/2"
      >
        <h1 className="text-6xl sm:text-8xl tracking-tight leading-none font-medium text-center text-balance">
          Craft a {""}
          <span className="text-white font-semibold [text-shadow:-1px_2px_0_black] [-webkit-text-stroke:1px_black]">
            brand {""}
          </span>
          as unique <br /> as {""}
          <span className="text-white font-semibold [text-shadow:-1px_2px_0_black] [-webkit-text-stroke:1px_black]">
            you.
          </span>
        </h1>
        <p className="w-full text-center md:text-balance tracking-wider">
          <b className="font-mono font-extrabold">Zoid</b> helps you{" "}
          <i className="border-b-1 border-dashed border-black">brainstorm</i>{" "}
          brand names in{" "}
          <i className="border-b-1 border-dashed border-black">collaboration</i>{" "}
          with teams for your newest upcoming entreprenurial ventures, while we
          check against available{" "}
          <i className="border-b-1 border-dashed border-black">domains</i> and
          pre-existing{" "}
          <i className="border-b-1 border-dashed border-black">trademarks</i>{" "}
          from a global database.
        </p>
        <Button color="primary" className="primary text-lg">
          Start brainstorming <span className="animate-left-right">-&gt;</span>
        </Button>
      </section>
    </main>
  );
}
