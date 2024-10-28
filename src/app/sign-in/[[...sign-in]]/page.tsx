import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="w-full h-full grid place-items-center">
      <SignIn />
    </main>
  );
}
