import { supabase } from "@/db";
import { Membership, Org, PublicUser } from "@/types/org";
import { Ideas } from "./_components/Ideas";
import { auth, clerkClient } from "@clerk/nextjs/server";

export default async function OrganizationPage({
  params,
}: {
  params: { org_id: string };
}) {
  const { userId } = await auth();

  if (!userId) {
    return (
      <div className="text-center font-semibold p-12 text-balance text-4xl w-full h-full flex-1 grid place-items-center">
        You are not logged in
      </div>
    );
  }

  const { data: org } = await supabase
    .from("orgs")
    .select("*")
    .eq("id", params.org_id)
    .returns<Org[]>()
    .single();

  if (!org) {
    return (
      <div className="text-center font-semibold p-12 text-balance text-4xl w-full h-full flex-1 grid place-items-center">
        Organization Not Found
      </div>
    );
  }

  const { data: members } = await supabase
    .from("memberships")
    .select("member_id")
    .eq("org_id", org.id)
    .returns<Membership[]>();

  if (!members) {
    return <div>Organization has no members</div>;
  }

  const clerk = await clerkClient();
  const users = await Promise.all(
    members.map(async (member) => {
      const clerkUser = await clerk.users.getUser(member.member_id);
      const publicUser: PublicUser = {
        id: clerkUser.id,
        imageUrl: clerkUser.imageUrl,
        email: clerkUser.emailAddresses[0].emailAddress,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
      };
      return publicUser;
    })
  );

  return <Ideas userId={userId} members={users} org={org} />;
}
