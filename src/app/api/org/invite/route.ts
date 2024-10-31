import { supabase } from "@/db";
import { baseUrl } from "@/lib/utils";
import { Membership, Org } from "@/types/org";
import { auth, clerkClient } from "@clerk/nextjs/server";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return new Response("Your request is missing a valid token", {
      status: 400,
      statusText: "Bad Request",
    });
  }

  try {
    const { email, organization } = jwt.verify(
      token!,
      process.env.JWT_SECRET!
    ) as { email: string; organization: string };

    const { data: org, error: orgError } = await supabase
      .from("orgs")
      .select("*")
      .eq("id", organization)
      .returns<Org[]>()
      .single();

    if (orgError || !org) {
      return new Response("The organization no longer exists.", {
        status: 404,
        statusText: "Not Found",
      });
    }

    const { userId } = await auth();

    if (!userId) {
      return new Response("You need to sign in first", {
        status: 401,
        statusText: "Unauthorized",
      });
    }

    const clerk = await clerkClient();
    const { emailAddresses } = await clerk.users.getUser(userId);
    const userEmail = emailAddresses[0].emailAddress;

    if (email !== userEmail) {
      return new Response("You need to be signed in with the correct email", {
        status: 401,
        statusText: "Unauthorized",
      });
    }

    const { data: existingMembership, error: existingMembershipError } =
      await supabase
        .from("memberships")
        .select("*")
        .eq("org_id", organization)
        .eq("member_id", userId)
        .returns<Membership[]>();

    if (existingMembershipError) {
      return new Response("An error occurred while checking your membership", {
        status: 500,
        statusText: "Internal Server Error",
      });
    }

    if (existingMembership?.length) {
      return new Response("You are already a member of this organization", {
        status: 400,
        statusText: "Bad Request",
      });
    }

    const { error: membershipError } = await supabase
      .from("memberships")
      .insert([
        {
          org_id: organization,
          member_id: userId,
        },
      ]);

    if (membershipError) {
      return new Response(
        "An error occurred while adding you to the organization",
        {
          status: 500,
          statusText: "Internal Server Error",
        }
      );
    }

    return Response.redirect(
      `${baseUrl(request)}/dashboard/${organization}`,
      302
    );
  } catch {
    return new Response("The token you sent is invalid", {
      status: 400,
      statusText: "Bad Request",
    });
  }
}

type PostRequest = {
  organization: string;
  email: string;
};

export async function POST(request: Request) {
  const { organization, email } = (await request.json()) as PostRequest;

  if (!organization || !email) {
    return new Response("Your request is missing a valid body", {
      status: 400,
      statusText: "Bad Request",
    });
  }

  const { userId } = await auth();

  if (!userId) {
    return new Response("You need to sign in first", {
      status: 401,
      statusText: "Unauthorized",
    });
  }

  const { data: org, error: orgError } = await supabase
    .from("orgs")
    .select("*")
    .eq("id", organization)
    .returns<Org[]>()
    .single();

  if (orgError || !org) {
    return new Response("The organization you sent does not exist", {
      status: 404,
      statusText: "Not Found",
    });
  }

  if (org.owner_id !== userId) {
    return new Response(
      "You need to be the owner of the organization to invite users",
      {
        status: 401,
        statusText: "Unauthorized",
      }
    );
  }

  const token = jwt.sign({ email, organization }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  const inviteLink = `${baseUrl(request)}/api/org/invite?token=${token}`;

  return new Response(inviteLink, {
    headers: {
      "content-type": "application/json",
    },
  });
}

type DeleteRequest = {
  members: string[];
  organization: string;
};

export async function DELETE(request: Request) {
  const body = await request.json();
  const { organization, members } = body as DeleteRequest;

  if (!organization || !members?.length) {
    return new Response("Your request is missing a valid query", {
      status: 400,
      statusText: "Bad Request",
    });
  }

  const { userId } = await auth();

  if (!userId) {
    return new Response("You need to sign in first", {
      status: 401,
      statusText: "Unauthorized",
    });
  }

  const { data: org, error: orgError } = await supabase
    .from("orgs")
    .select("*")
    .eq("id", organization)
    .returns<Org[]>()
    .single();

  if (orgError || !org) {
    return new Response("The organization you sent does not exist", {
      status: 404,
      statusText: "Not Found",
    });
  }

  if (org.owner_id !== userId) {
    return new Response(
      "You need to be the owner of the organization to remove users",
      {
        status: 401,
        statusText: "Unauthorized",
      }
    );
  }

  const { error: ideasError } = await supabase
    .from("ideas")
    .delete()
    .eq("org_id", organization)
    .in("author_id", members);

  const { error: membershipError } = await supabase
    .from("memberships")
    .delete()
    .eq("org_id", organization)
    .in("member_id", members);

  if (membershipError || ideasError) {
    return new Response("Failed to delete members", {
      status: 500,
      statusText: "Internal Server Error",
    });
  }

  return new Response("Successfully removed members", {
    status: 200,
    statusText: "OK",
  });
}
