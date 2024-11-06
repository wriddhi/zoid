"use client";

import { cn, highlight } from "@/lib/utils";
import { Accordion, AccordionItem } from "@/components/ui";

type FAQItem = {
  question: string;
  answer: string;
};

const faqItems: FAQItem[] = [
  {
    question: "What is Zoid?",
    answer:
      "Zoid is a collaborative brainstorming environment for entrepreneurs and teams to come up with brand names for their next big idea. We check against available domains and trademarks to ensure your brand is unique.",
  },
  {
    question: "How do I get started?",
    answer:
      "Simply sign up for an account and start brainstorming with your team. You can invite team members to join your brainstorming session and collaborate on brand names together.",
  },
  {
    question: "What is the pricing?",
    answer:
      "Zoid offers a free tier for personal use, as well as paid tiers for teams and large teams. The paid tiers include additional features such as trademark checks and unlimited domains.",
  },
];

export const FAQ = () => {
  return (
    <section
      id="faq"
      className="flex flex-col items-end p-12 gap-8 w-full bg-slate-50"
    >
      <h1
        className={cn(
          "text-6xl sm:text-8xl tracking-tight leading-none text-center",
          highlight
        )}
      >
        FAQ.
      </h1>
      <Accordion className="w-11/12 md:w-2/3 lg:w-1/2 mx-auto">
        {faqItems.map((item, index) => (
          <AccordionItem
            key={index}
            aria-label={item.question}
            title={item.question}
            className="font-bold"
          >
            <span className="font-normal">{item.answer}</span>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};
