import { cn } from "@/lib/utils";
import { BsLock, BsCheckCircle } from "react-icons/bs";
import { Button, Chip } from "@/components/ui";

type Tier = {
  name: string;
  audience: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: string[];
  isAvailable: boolean;
  rank: number;
};

const tiers: Tier[] = [
  {
    name: "Free",
    audience: "Personal",
    price: {
      monthly: 0,
      yearly: 0,
    },
    features: [
      "Unlimited brainstorming",
      "Unlimited team size",
      "Unlimited domains",
    ],
    isAvailable: true,
    rank: 2,
  },
  {
    name: "Pro",
    audience: "Teams",
    price: {
      monthly: 5,
      yearly: 50,
    },
    features: [
      "Unlimited brainstorming",
      "Unlimited team size",
      "Unlimited domains",
      "Trademark checks",
    ],
    isAvailable: true,
    rank: 1,
  },
  {
    name: "Enterprise",
    audience: "Large Teams",
    price: {
      monthly: 10,
      yearly: 100,
    },
    features: [
      "Unlimited brainstorming",
      "Unlimited team size",
      "Unlimited domains",
      "Trademark checks",
      "Custom branding",
    ],
    isAvailable: false,
    rank: 3,
  },
];

const TierCard = ({ tier }: { tier: Tier }) => {
  return (
    <li
      className={cn(
        "flex flex-col gap-4 p-8 w-full lg:w-1/3 transition-all",
        "bg-slate-100 hover:bg-white text-black rounded-2xl outline-1 outline-dashed shadow-[6px_6px_0_0_black]"
      )}
    >
      <div className="flex gap-4 items-center">
        <h2 className={cn("text-4xl uppercase tracking-tight leading-none")}>
          {tier.name}
        </h2>
        {!tier.isAvailable && <BsLock className="size-8" />}
        {tier.isAvailable && tier.rank === 1 && (
          <Chip color="primary" className="ml-auto animate-pulse">
            Most Popular
          </Chip>
        )}
      </div>
      <p className="text-lg text-slate-700 font-light">{tier.audience}</p>
      <div className="flex flex-col gap-4">
        <p className="text-6xl text-success-600">${tier.price.monthly}/mo</p>
        {/* <p className="text-2xl">${tier.price.yearly}/yr</p> */}
      </div>
      <ul className="flex flex-col gap-1">
        {tier.features.map((feature) => (
          <li
            key={feature}
            className={cn("text-lg text-slate-500 flex gap-2 items-center")}
          >
            <BsCheckCircle className="text-black" /> {feature}
          </li>
        ))}
      </ul>
      <Button
        as="a"
        radius="sm"
        href="/sign-up"
        color="primary"
        disabled={!tier.isAvailable}
        isDisabled={!tier.isAvailable}
        className={cn("primary text-lg mt-auto")}
      >
        {tier.isAvailable ? "Get started" : "Coming soon"}
      </Button>
    </li>
  );
};

export const Pricing = () => {
  return (
    <section
      id="pricing"
      className="flex flex-col items-start p-12 gap-8 w-full bg-slate-50"
    >
      <h1
        className={cn(
          "text-6xl sm:text-8xl tracking-tight leading-none text-center",
          "text-white",
          "font-semibold",
          "[text-shadow:-1px_2px_0_black]",
          "[-webkit-text-stroke:1px_black]"
        )}
      >
        Pricing.
      </h1>
      <p>
        <b className="font-mono font-extrabold">Zoid</b> offers a free tier for
        personal use, while teams can opt for a subscription based model for
        collaboration.
      </p>
      <ul className="flex flex-col lg:flex-row gap-16 w-full">
        {tiers.map((tier) => (
          <TierCard key={tier.name} tier={tier} />
        ))}
      </ul>
    </section>
  );
};
