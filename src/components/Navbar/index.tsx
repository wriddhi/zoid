import { cn } from "@/lib/utils";
import Link from "next/link";

type NavItem = {
  href: string;
  title: string;
};

const navItems: NavItem[] = [
  {
    href: "/#pricing",
    title: "Pricing",
  },
  {
    href: "/#faq",
    title: "FAQ",
  },
  {
    href: "/#contact",
    title: "Contact",
  },
];

export const Navbar = () => {
  return (
    <nav
      className={cn(
        "w-fit flex justify-center items-center py-1 px-6 gap-12 md:px-12",
        "mx-auto outline outline-1 rounded-full shadow-[2px_3px_0_0_black] bg-white"
      )}
    >
      {navItems.map((item) => (
        <Link
          prefetch={true}
          key={item.title}
          className="font-semibold font-mono"
          href={item.href}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
};
