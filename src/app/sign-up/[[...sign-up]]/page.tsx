import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="w-full h-full grid place-items-center">
      <SignUp />
    </main>
  );
}
