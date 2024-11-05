"use client";

import Image from "next/image";

import {
  SignedIn,
  SignedOut,
  UserButton,
  RedirectToSignIn,
  RedirectToSignUp,
} from "@clerk/nextjs";
import { Button } from "@/components/ui";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";

// const HamBurgerButton = () => {
//   const [open, setOpen] = useState(false);
//   return (
//     <Button
//       isIconOnly
//       radius="sm"
//       size="sm"
//       variant="light"
//       data-active={open}
//       onClick={() => setOpen(!open)}
//       className={cn(
//         "flex lg:hidden flex-col items-center justify-evenly group data-[active='true']:justify-center transition-all"
//       )}
//     >
//       <span
//         className={cn(
//           "w-2/3 h-0.5 bg-black transition-all",
//           "group-data-[active='true']:rotate-45",
//           "group-data-[active='true']:translate-y-1/2"
//         )}
//       />
//       <span
//         className={cn(
//           "w-2/3 h-0.5 bg-black  transition-all",
//           "group-data-[active='true']:-rotate-45",
//           "group-data-[active='true']:-translate-y-1/2"
//         )}
//       />
//     </Button>
//   );
// };

export const Header = () => {
  const pathname = usePathname();
  const [redirect, setRedirect] = useState<"sign-in" | "sign-up">();

  return (
    <header className="w-full grid grid-cols-[1fr_8fr_1fr] py-3 px-6 md:px-12 justify-between items-center">
      <Link href="/">
        <Image
          priority
          src="/zoid.svg"
          width={100}
          height={100}
          alt="Zoid Inc."
          quality={1}
        />
      </Link>
      <Navbar />
      <div className="flex gap-2 items-center">
        <SignedOut>
          <Button
            onClick={() => setRedirect("sign-up")}
            color="primary"
            size="sm"
            radius="sm"
          >
            {redirect == "sign-up" && <RedirectToSignUp />}
            Sign Up
          </Button>
          <Button
            onClick={() => setRedirect("sign-in")}
            variant="flat"
            size="sm"
            radius="sm"
          >
            {redirect == "sign-in" && <RedirectToSignIn />}
            Sign In
          </Button>
        </SignedOut>
        <SignedIn>
          {!pathname.startsWith("/dashboard") && (
            <Button
              as="a"
              color="primary"
              href="/dashboard"
              size="sm"
              radius="sm"
            >
              Dashboard
            </Button>
          )}
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
};
