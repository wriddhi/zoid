export const Verifications = {
  WIPO: (name: string) =>
    `https://branddb.wipo.int/en/similarname/results?sort=score%20desc&rows=30&asStructure=%7B%22_id%22:%2277c0%22,%22boolean%22:%22AND%22,%22bricks%22:%5B%7B%22_id%22:%2277c1%22,%22key%22:%22brandName%22,%22value%22:%22${name}%22,%22strategy%22:%22Simple%22%7D%5D%7D&fg=_void_&_=1729804398156`,
  GoDaddy: (name: string) =>
    `https://www.godaddy.com/domainsearch/find?checkAvail=1&tmskey=&domainToCheck=${name}`,
  Namecheap: (name: string) =>
    `https://www.namecheap.com/domains/registration/results/?domain=${name}`,
  SpaceShip: (name: string) =>
    `https://www.spaceship.com/domain-search/?query=${name}&beast=false&tab=domains`,
  ICANN: (name: string) => `https://lookup.icann.org/lookup?name=${name}`,
  Cloudflare: (name: string) =>
    `https://domains.cloudflare.com/?domain=${name}`,
};
