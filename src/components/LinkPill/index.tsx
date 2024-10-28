import { Links } from "@/data";

type Props = {
  name: string;
};

const LinkPill = ({ name, link }: Props & { link: keyof typeof Links }) => {
  return (
    <a
      href={Links[link](name)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block px-2 py-1 text-xs font-medium text-white bg-primary rounded-md"
    >
      {link}
    </a>
  );
};

export const LinkPills = ({ name }: Props) => {
  return (
    <section>
      <h1>Links</h1>
      {Object.keys(Links).map((link) => (
        <LinkPill key={link} name={name} link={link as keyof typeof Links} />
      ))}
    </section>
  );
};
