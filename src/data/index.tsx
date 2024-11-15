import {
  SiGodaddy,
  SiNamecheap,
  SiSpaceship,
  SiCloudflare,
} from "react-icons/si";
import { TbWorldSearch } from "react-icons/tb";
import {
  FaFacebook,
  FaXTwitter,
  FaInstagram,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa6";

import type { IconType } from "react-icons";

export const Verifications = {
  Domains: {
    GoDaddy: {
      icon: <SiGodaddy />,
      name: "GoDaddy",
      verify: (name: string) =>
        `https://www.godaddy.com/domainsearch/find?checkAvail=1&tmskey=&domainToCheck=${name}`,
    },
    Namecheap: {
      icon: <SiNamecheap />,
      name: "Namecheap",
      verify: (name: string) =>
        `https://www.namecheap.com/domains/registration/results/?domain=${name}`,
    },
    SpaceShip: {
      icon: <SiSpaceship />,
      name: "SpaceShip",
      verify: (name: string) =>
        `https://www.spaceship.com/domain-search/?query=${name}&beast=false&tab=domains`,
    },
    Cloudflare: {
      icon: <SiCloudflare />,
      name: "Cloudflare",
      verify: (name: string) =>
        `https://domains.cloudflare.com/?domain=${name}`,
    },
  },
  TradeMarks: {
    WIPO: {
      icon: <TbWorldSearch />,
      name: "World Intellectual Property Organization",
      verify: (name: string) =>
        `https://branddb.wipo.int/en/similarname/results?sort=score%20desc&rows=30&asStructure=%7B%22_id%22:%2277c0%22,%22boolean%22:%22AND%22,%22bricks%22:%5B%7B%22_id%22:%2277c1%22,%22key%22:%22brandName%22,%22value%22:%22${name}%22,%22strategy%22:%22Simple%22%7D%5D%7D&fg=_void_&_=1729804398156`,
    },
  },
  Socials: {
    Twitter: {
      icon: <FaXTwitter />,
      name: "Twitter",
      verify: (name: string) =>
        `https://x.com/search?q=${name}&src=typed_query&f=user`,
    },
    LinkedIn: {
      icon: <FaLinkedin />,
      name: "LinkedIn",
      verify: (name: string) =>
        `https://www.linkedin.com/search/results/companies/?keywords=${name}`,
    },
    Instagram: {
      icon: <FaInstagram />,
      name: "Instagram",
      verify: (name: string) => `https://www.instagram.com/${name}`,
    },
    Facebook: {
      icon: <FaFacebook />,
      name: "Facebook",
      verify: (name: string) =>
        `https://www.facebook.com/search/pages?q=${name}`,
    },
    GitHub: {
      icon: <FaGithub />,
      name: "GitHub",
      verify: (name: string) =>
        `https://github.com/search?q=${name}&type=users`,
    },
  },
};

export type VerificationKey = keyof typeof Verifications;
export type VerificationValue = {
  name: string;
  verify: (name: string) => string;
  icon: IconType;
};
export const Keys = Object.keys(Verifications) as VerificationKey[];
