import type { User } from "@clerk/nextjs/server";

export type Org = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  owner_id: string;
};

export type Membership = {
  org_id: string;
  member_id: string;
};

export type Votes = {
  up: string[];
  down: string[];
};

export type Idea = {
  org_id: string;
  id: string;
  name: string;
  author_id: string;
  created_at: string;
  votes: Votes;
};

export type PublicUser = Pick<
  User,
  "id" | "imageUrl" | "firstName" | "lastName"
> & { email: string };
