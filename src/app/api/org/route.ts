import { supabase } from "@/db";
import { Org } from "@/types/org";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

type PostRequest = {
  name: string;
  description: string;
};

export async function POST(request: Request) {
  const { name, description } = (await request.json()) as PostRequest;
  const { userId } = await auth();

  if (!userId) {
    return new Response("Sign in to create organizations", {
      status: 401,
      statusText: "Unauthorized",
    });
  }

  const { data, error } = await supabase
    .from("orgs")
    .insert([{ name, description, owner_id: userId }])
    .select()
    .returns<Org[]>()
    .single();

  if (error || !data) {
    return new Response("Failed to create organization", {
      status: 500,
      statusText: "Internal Server Error",
    });
  }

  const { error: memberShipError } = await supabase
    .from("memberships")
    .insert([{ org_id: data.id, member_id: userId }])
    .select()
    .single();

  if (memberShipError) {
    await supabase.from("orgs").delete().eq("id", data.id);

    return new Response("Failed to create organization", {
      status: 500,
      statusText: "Internal Server Error",
    });
  }

  return new Response(JSON.stringify(data), {
    status: 201,
    statusText: "Created",
  });
}

type PutRequest = PostRequest & {
  organization: string;
};

export async function PUT(request: Request) {
  const { name, description, organization } =
    (await request.json()) as PutRequest;

  const { userId } = await auth();

  if (!userId) {
    return new Response("Sign in to update organizations", {
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

  if (org?.owner_id !== userId) {
    return new Response(
      "You do not have the permission to update this organization",
      {
        status: 401,
        statusText: "Unauthorized",
      }
    );
  }

  if (!org || orgError) {
    return new Response("Organization not found", {
      status: 404,
      statusText: "Not Found",
    });
  }

  const { error } = await supabase
    .from("orgs")
    .update({ name, description })
    .eq("id", organization);

  if (error) {
    return new Response("Failed to update organization", {
      status: 500,
      statusText: "Internal Server Error",
    });
  }

  return new Response("Organization updated", {
    status: 200,
    statusText: "OK",
  });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Organization ID is required", {
      status: 400,
      statusText: "Bad Request",
    });
  }

  const { userId } = await auth();

  if (!userId) {
    return new Response("Sign in to delete organizations", {
      status: 401,
      statusText: "Unauthorized",
    });
  }

  const { data: org, error: orgError } = await supabase
    .from("orgs")
    .select("*")
    .eq("id", id)
    .returns<Org[]>()
    .single();

  if (org?.owner_id !== userId) {
    return new Response(
      "You do not have the permission to delete this organization",
      {
        status: 401,
        statusText: "Unauthorized",
      }
    );
  }

  if (!org || orgError) {
    return new Response("Organization not found", {
      status: 404,
      statusText: "Not Found",
    });
  }

  const { error: memberShipError } = await supabase
    .from("memberships")
    .delete()
    .eq("org_id", id);

  if (memberShipError) {
    return new Response("Failed to delete organization", {
      status: 500,
      statusText: "Internal Server Error",
    });
  }

  const { error: ideasError } = await supabase
    .from("ideas")
    .delete()
    .eq("org_id", id);

  if (ideasError) {
    return new Response("Failed to delete organization", {
      status: 500,
      statusText: "Internal Server Error",
    });
  }

  const { error } = await supabase.from("orgs").delete().eq("id", id);

  if (error) {
    return new Response("Failed to delete organization", {
      status: 500,
      statusText: "Internal Server Error",
    });
  }

  return new Response("Organization deleted", {
    status: 200,
    statusText: "OK",
  });
}
