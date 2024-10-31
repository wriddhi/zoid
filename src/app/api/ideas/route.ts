import { supabase } from "@/db";
import { Idea, Membership, Org } from "@/types/org";
import { auth } from "@clerk/nextjs/server";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const { data: ideas } = await supabase
    .from("ideas")
    .select("*")
    .eq("org_id", id)
    .returns<Idea[]>();

  return Response.json(ideas);
}

type PostRequest = {
  ideas: Idea[];
  organization: string;
};

export async function POST(request: Request) {
  const { ideas, organization } = (await request.json()) as PostRequest;

  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", {
      status: 401,
      statusText: "Unauthorized",
    });
  }

  const { data: membershipData, error: membershipError } = await supabase
    .from("memberships")
    .select("*")
    .eq("member_id", userId)
    .eq("org_id", organization)
    .returns<Membership[]>()
    .single();

  if (membershipError || !membershipData) {
    return new Response("Unauthorized", {
      status: 401,
      statusText: "Unauthorized",
    });
  }

  const { data } = await supabase.from("ideas").insert(ideas).select();
  return Response.json(data);
}

type PutRequest = {
  idea: Idea;
  organization: string;
};

export async function PUT(request: Request) {
  const { idea } = (await request.json()) as PutRequest;

  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", {
      status: 401,
      statusText: "Unauthorized",
    });
  }

  const { data: membershipData, error: membershipError } = await supabase
    .from("memberships")
    .select("*")
    .eq("member_id", userId)
    .eq("org_id", idea.org_id)
    .returns<Membership[]>()
    .single();

  if (membershipError || !membershipData) {
    return new Response("Unauthorized", {
      status: 401,
      statusText: "Unauthorized",
    });
  }

  const { data } = await supabase
    .from("ideas")
    .update({
      votes: idea.votes,
    })
    .eq("id", idea.id)
    .select();

  return Response.json(data);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const organization = searchParams.get("organization");

  if (!id || !organization) {
    return new Response("Bad Request", {
      status: 400,
      statusText: "Bad Request",
    });
  }

  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", {
      status: 401,
      statusText: "Unauthorized",
    });
  }

  const { data: orgData, error: orgError } = await supabase
    .from("orgs")
    .select("*")
    .eq("id", organization)
    .returns<Org[]>()
    .single();

  if (orgError || !orgData) {
    return new Response("Not Found", {
      status: 404,
      statusText: "Not Found",
    });
  }

  const { data: membershipData, error: membershipError } = await supabase
    .from("memberships")
    .select("*")
    .eq("member_id", userId)
    .eq("org_id", organization)
    .returns<Membership[]>()
    .single();

  if (membershipError || !membershipData) {
    return new Response("Unauthorized", {
      status: 401,
      statusText: "Unauthorized",
    });
  }

  const { data: ideaData, error: ideaError } = await supabase
    .from("ideas")
    .select("*")
    .eq("id", id)
    .returns<Idea[]>()
    .single();

  if (ideaError || !ideaData) {
    return new Response("Not Found", {
      status: 404,
      statusText: "Not Found",
    });
  }

  if (orgData.owner_id !== userId && ideaData.author_id !== userId) {
    return new Response("Unauthorized", {
      status: 401,
      statusText: "Unauthorized",
    });
  }

  const { data } = await supabase.from("ideas").delete().eq("id", id).select();
  return Response.json(data);
}
