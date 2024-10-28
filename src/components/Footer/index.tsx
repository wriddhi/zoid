import { cn } from "@/lib/utils";

export const Footer = () => {
  return (
    <footer
      className={cn(
        "w-full p-4 bg-black text-white",
        "text-xs md:text-sm lg:text-base",
        "flex flex-col md:flex-row md:gap-4 md:justify-center items-center"
      )}
    >
      <p>&copy; {new Date().getFullYear()} Zoid Inc. All rights reserved.</p>
      <p>
        Maintained by{" "}
        <a
          href="https://github.com/wriddhi"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold border-b-1 border-dashed border-white"
        >
          wriddhi.
        </a>
      </p>
    </footer>
  );
};
