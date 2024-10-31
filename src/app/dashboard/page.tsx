import { auth } from "@clerk/nextjs/server";
import { ProjectList } from "./_components/ProjectList";
import { supabase } from "@/db";
import { Membership, Org } from "@/types/org";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    return;
  }

  const { data: memberships, error: membershipsError } = await supabase
    .from("memberships")
    .select("org_id")
    .eq("member_id", userId)
    .returns<Pick<Membership, "org_id">[]>();

  if (membershipsError || !memberships) {
    return <ProjectList userId={userId} orgs={[]} />;
  }

  const orgList = memberships.map((membership) => membership.org_id);

  const { data: orgs, error: orgsError } = await supabase
    .from("orgs")
    .select("*")
    .in("id", orgList)
    .returns<Org[]>();

  if (orgsError || !orgs) {
    return <ProjectList userId={userId} orgs={[]} />;
  }

  return <ProjectList userId={userId} orgs={orgs} />;
}
