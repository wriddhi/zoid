"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Idea, Org, PublicUser } from "@/types/org";

import {
  Button,
  Input,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  User,
  Tooltip,
  Spinner,
  Dropdown,
  DropdownItem,
  DropdownTrigger,
  DropdownMenu,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Snippet,
  Chip,
  Textarea,
  Checkbox,
} from "@/components/ui";

import {
  PiArrowFatUp,
  PiArrowFatUpFill,
  PiArrowFatDown,
  PiArrowFatDownFill,
} from "react-icons/pi";
import { TbDotsVertical } from "react-icons/tb";
import { FiUserPlus } from "react-icons/fi";
import { VscTrash, VscSettingsGear } from "react-icons/vsc";
import { IoEyeOutline, IoWarningOutline } from "react-icons/io5";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { nanoid } from "nanoid";

import { cn, prettyTimeStamp, timeAgo } from "@/lib/utils";
import { VerificationKey, Verifications } from "@/data";
import Link from "next/link";
type Props = {
  userId: string;
  members: PublicUser[];
  org: Org;
};

type Column = {
  uid: keyof Idea | "actions" | VerificationKey;
  name: string;
};

const columns: Column[] = [
  { uid: "name", name: "NAME" },
  { uid: "author_id", name: "PROPOSED BY" },
  { uid: "created_at", name: "SUBMITTED ON" },
  { uid: "Domains", name: "DOMAINS" },
  { uid: "Socials", name: "SOCIALS" },
  { uid: "TradeMarks", name: "TRADEMARKS" },
  { uid: "votes", name: "VOTES" },
  { uid: "actions", name: "ACTIONS" },
];

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  organization: Org;
};

const InvitationModal = ({ isOpen, onClose, organization }: ModalProps) => {
  const [email, setEmail] = useState("");
  const [inviteUrl, setInviteUrl] = useState("");

  const { mutate: createInvitation, isPending: isCreatingInvitation } =
    useMutation({
      mutationFn: async () => {
        if (email.trim() === "") return;
        const { data } = await axios.post<string>(`/api/org/invite`, {
          email,
          organization: organization.id,
        });
        return data;
      },
      onSuccess: (result) => {
        setEmail("");
        setInviteUrl(result ?? "");
      },
    });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Invite Members</ModalHeader>
        <ModalBody>
          <p className="text-xs">
            Invite members to your organization by entering their email
            addresses and sharing the unique link.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createInvitation();
            }}
          >
            <Input
              required
              isRequired
              type="email"
              label="Email address"
              placeholder="jondoe@email.com"
              labelPlacement="outside"
              className="w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </form>
          {inviteUrl && (
            <>
              <Snippet
                symbol=""
                color="primary"
                variant="solid"
                className="w-full"
              >
                <span className="flex w-60 md:w-72 lg:w-80 !overflow-x-scroll scrollbar-hide">
                  {inviteUrl}
                </span>
              </Snippet>
              <Chip color="warning" variant="flat" className="text-warning">
                The invite link expires in 7 days.
              </Chip>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={() => createInvitation()}
            isLoading={isCreatingInvitation}
            color="primary"
          >
            Generate Invite Link
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const EditionModal = ({ isOpen, onClose, organization }: ModalProps) => {
  const [name, setName] = useState(organization.name);
  const [description, setDescription] = useState(
    organization.description ?? ""
  );

  const queryClient = useQueryClient();

  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationFn: async () => {
      if (name.trim() === "") return;
      return axios.put<string>(`/api/org`, {
        name: name.trim(),
        description: description.trim(),
        organization: organization.id,
      });
    },
    onSuccess: () => {
      queryClient.setQueryData(["Org"], (oldOrg: Org) => ({
        ...oldOrg,
        name: name.trim(),
        description: description.trim(),
      }));
      onClose();
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Edit Organization</ModalHeader>
        <ModalBody>
          <p className="text-xs">
            Update the organization name and description to better reflect your
            venture.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              update();
            }}
          >
            <Input
              required
              isRequired
              type="text"
              label="Organization Name"
              placeholder="Zoid Inc."
              labelPlacement="outside"
              className="w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Textarea
              label="Description"
              placeholder="A brief description of your organization"
              labelPlacement="outside"
              className="w-full mt-4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </form>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={() => update()}
            isLoading={isUpdating}
            color="primary"
          >
            Update Organization
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const DeletionModal = ({ isOpen, onClose, organization }: ModalProps) => {
  const [name, setName] = useState("");
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: deleteOrg, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      return axios.delete<string>(`/api/org?id=${organization.id}`);
    },
    onSuccess: () => {
      router.push("/dashboard");
      queryClient.setQueryData(["Orgs"], (oldOrgs: Org[]) => {
        return oldOrgs.filter((oldOrg) => oldOrg.id !== organization.id);
      });
      onClose();
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Delete Organization</ModalHeader>
        <ModalBody>
          <p className="text-xs">
            Are you sure you want to delete this organization? This action is
            irreversible. All members and ideas will be lost.
          </p>
          <Chip color="danger" variant="flat" className="text-danger">
            Type in the organization name to confirm.
          </Chip>
          <Input
            required
            isRequired
            type="text"
            label="Organization Name"
            placeholder="Zoid Inc."
            labelPlacement="outside"
            className="w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          {name === organization.name && (
            <Button
              onClick={() => deleteOrg()}
              isLoading={isDeleting}
              color="danger"
              size="sm"
            >
              Delete Organization
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const MembersModal = ({
  isOpen,
  onClose,
  members,
  organization,
  isOwner,
  ideas,
}: ModalProps & {
  members: Props["members"];
  isOwner: boolean;
  ideas: Idea[];
}) => {
  const queryClient = useQueryClient();
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const { mutate: removeUsers, isPending: isRemovingUsers } = useMutation({
    mutationFn: async () => {
      return axios.delete(`/api/org/invite`, {
        data: { members: selectedMembers, organization: organization.id },
      });
    },
    onMutate: () => {
      queryClient.setQueryData(
        ["Ideas"],
        ideas.filter((idea) => !selectedMembers.includes(idea.author_id))
      );
      queryClient.setQueryData(
        ["Members"],
        members.filter((member) => !selectedMembers.includes(member.id))
      );
    },
    onSettled: () => {
      setSelectedMembers([]);
      onClose();
    },
  });
  return (
    <Modal size="lg" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Members</ModalHeader>
        <ModalBody>
          <p className="text-xs">
            View all the members of this organization and their respective
            roles.
          </p>
          <ul className="grid grid-cols-1 gap-4 my-4">
            {members.map((member) => (
              <li key={member.id} className="flex items-center gap-4">
                {isOwner && (
                  <Checkbox
                    isDisabled={organization.owner_id === member.id}
                    disabled={organization.owner_id === member.id}
                    value={member.id}
                    checked={selectedMembers.includes(member.id)}
                    onChange={() =>
                      setSelectedMembers((previouslySelectedMembers) =>
                        previouslySelectedMembers.includes(member.id)
                          ? previouslySelectedMembers.filter(
                              (id) => id !== member.id
                            )
                          : [...previouslySelectedMembers, member.id]
                      )
                    }
                  />
                )}
                <User
                  avatarProps={{ radius: "lg", src: member.imageUrl }}
                  description={member.email}
                  name={member.firstName + " " + (member.lastName ?? "")}
                >
                  {member.email}
                </User>
                <Chip
                  size="sm"
                  radius="lg"
                  color={
                    organization.owner_id === member.id ? "danger" : "success"
                  }
                  variant="flat"
                  className="ml-auto"
                >
                  {organization.owner_id === member.id ? "Owner" : "Member"}
                </Chip>
              </li>
            ))}
          </ul>
        </ModalBody>
        {isOwner && selectedMembers.length > 0 && (
          <ModalFooter>
            <Button
              endContent={<VscTrash />}
              onClick={() => removeUsers()}
              color="danger"
              size="sm"
              isLoading={isRemovingUsers}
            >
              {isRemovingUsers ? "Removing" : "Remove"} {selectedMembers.length}{" "}
              Members
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};

export const Ideas = ({ userId, members: membersDetails, org }: Props) => {
  const [currentIdeas, setCurrentIdeas] = useState("");
  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();
  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();
  const {
    isOpen: isOpenInvite,
    onOpen: onOpenInvite,
    onClose: onCloseInvite,
  } = useDisclosure();
  const {
    isOpen: isOpenMembers,
    onOpen: onOpenMembers,
    onClose: onCloseMembers,
  } = useDisclosure();
  const queryClient = useQueryClient();

  const queryKey = ["Ideas"];
  const { data: ideas, isFetching } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data } = await axios.get<Idea[]>(`/api/ideas?id=${org.id}`);
      return data ?? [];
    },
    initialData: [],
    enabled: !!org.id,
  });

  const { data: members } = useQuery({
    queryKey: ["Members"],
    queryFn: async () => {
      return membersDetails;
    },
    initialData: [],
    enabled: !!membersDetails,
  });

  const isOwner = org.owner_id === userId;

  const { mutate: submitIdeas, isPending: isSubmitting } = useMutation({
    mutationFn: async (optimisticIdeas: Idea[]) => {
      const { data: updatedIdeas } = await axios.post<Idea[]>(`/api/ideas`, {
        ideas: optimisticIdeas,
        organization: org.id,
      });
      return updatedIdeas;
    },
    onMutate: async (optimisticIdeas) => {
      setCurrentIdeas("");
      queryClient.setQueryData(queryKey, (oldIdeas: Idea[]) => [
        ...oldIdeas,
        ...optimisticIdeas,
      ]);
    },
    onSuccess: (result, optimisticIdeas) => {
      queryClient.setQueryData(queryKey, (oldIdeas: Idea[]) => {
        const originalIdeas = oldIdeas.filter((idea) =>
          optimisticIdeas.every(
            (optimisticIdea) => idea.id !== optimisticIdea.id
          )
        );
        return [...originalIdeas, ...result];
      });
    },
  });

  const { mutate: vote } = useMutation({
    mutationFn: async (idea: Idea) => {
      const { data: updatedIdeas } = await axios.put<Idea[]>(`/api/ideas/`, {
        idea,
        organization: org.id,
      });
      return updatedIdeas;
    },
    onMutate: (idea: Idea) => {
      queryClient.setQueryData(queryKey, (oldIdeas: Idea[]) =>
        oldIdeas.map((oldIdea) => (oldIdea.id === idea.id ? idea : oldIdea))
      );
    },
  });

  const { mutate: deleteIdea } = useMutation({
    mutationFn: async (id: string) => {
      const { data: updatedIdeas } = await axios.delete<Idea[]>(
        `/api/ideas?id=${id}&organization=${org.id}`
      );
      return updatedIdeas;
    },
    onMutate: (id: string) => {
      queryClient.setQueryData(queryKey, (oldIdeas: Idea[]) =>
        oldIdeas.filter((idea) => idea.id !== id)
      );
    },
  });

  const renderCell = useCallback(
    (idea: Idea, columnKey: Column["uid"]) => {
      const user = members.find((member) => member.id === idea.author_id)!;
      switch (columnKey) {
        case "author_id":
          return (
            <User
              avatarProps={{ radius: "lg", src: user?.imageUrl }}
              description={user?.email}
              name={user?.firstName + " " + (user?.lastName ?? "")}
            >
              {user?.email}
            </User>
          );
        case "name":
          return <p className="text-bold text-sm capitalize">{idea.name}</p>;
        case "created_at":
          return (
            <Tooltip content={timeAgo(idea.created_at)}>
              <code className="text-bold text-sm capitalize font-mono">
                {prettyTimeStamp(idea.created_at)}
              </code>
            </Tooltip>
          );
        case "Domains":
        case "Socials":
        case "TradeMarks":
          return (
            <div className="flex items-center gap-3">
              {Object.values(Verifications[columnKey]).map((verification) => (
                <Tooltip key={verification.name} content={verification.name}>
                  <a
                    href={verification.verify(idea.name)}
                    target="_blank"
                    className="text-base"
                  >
                    {verification.icon}
                  </a>
                </Tooltip>
              ))}
            </div>
          );
        case "votes":
          return (
            <div className="flex items-center gap-2">
              {idea.votes.up.includes(userId) ? (
                <PiArrowFatUpFill
                  role="button"
                  onClick={() => {
                    const optimisticNeutralIdea: Idea = {
                      ...idea,
                      votes: {
                        up: idea.votes.up.filter((id) => id !== userId),
                        down: idea.votes.down.filter((id) => id !== userId),
                      },
                    };
                    vote(optimisticNeutralIdea);
                  }}
                  className="cursor-pointer fill-success-500"
                />
              ) : (
                <PiArrowFatUp
                  role="button"
                  onClick={() => {
                    const optimisticUpvotedIdea: Idea = {
                      ...idea,
                      votes: {
                        up: [...idea.votes.up, userId],
                        down: idea.votes.down.filter((id) => id !== userId),
                      },
                    };
                    vote(optimisticUpvotedIdea);
                  }}
                  className="cursor-pointer fill-success-500"
                />
              )}
              <span
                className={cn({
                  "text-success-500": idea.votes.up.includes(userId),
                  "text-danger-500": idea.votes.down.includes(userId),
                })}
              >
                {idea.votes.up.length * 1 - idea.votes.down.length * 1}
              </span>
              {idea.votes.down.includes(userId) ? (
                <PiArrowFatDownFill
                  role="button"
                  onClick={() => {
                    const optimisticNeutralIdea: Idea = {
                      ...idea,
                      votes: {
                        up: idea.votes.up.filter((id) => id !== userId),
                        down: idea.votes.down.filter((id) => id !== userId),
                      },
                    };
                    vote(optimisticNeutralIdea);
                  }}
                  className="cursor-pointer fill-danger-500"
                />
              ) : (
                <PiArrowFatDown
                  role="button"
                  onClick={() => {
                    const optimisticDownvotedIdea: Idea = {
                      ...idea,
                      votes: {
                        up: idea.votes.up.filter((id) => id !== userId),
                        down: [...idea.votes.down, userId],
                      },
                    };
                    vote(optimisticDownvotedIdea);
                  }}
                  className="cursor-pointer fill-danger-500"
                />
              )}
            </div>
          );
        case "actions":
          return idea.author_id === userId || org.owner_id === userId ? (
            <Tooltip color="danger" content="Delete idea">
              <Button
                isIconOnly
                color="danger"
                variant="light"
                onClick={() => deleteIdea(idea.id)}
              >
                <VscTrash />
              </Button>
            </Tooltip>
          ) : (
            <Tooltip content="View only">
              <Button isIconOnly variant="light">
                <IoEyeOutline className="size-4" />
              </Button>
            </Tooltip>
          );
      }
    },
    [deleteIdea, members, org.owner_id, userId, vote]
  );

  return (
    <main className="flex-1 px-4 md:px-12 h-full w-full flex flex-col gap-6 mb-20">
      <section className="w-full flex justify-start items-center gap-4">
        <Link prefetch={true} href="/dashboard">
          &lt;-
        </Link>
        <div>
          <h1 className="font-semibold text-2xl md:text-4xl">{org.name}</h1>
          <p className="text-xs md:text-sm text-gray-500">
            {org.description ?? "No description."}
          </p>
        </div>
        <div className="ml-auto relative flex justify-end items-center gap-2">
          {isOwner && (
            <Button
              onClick={onOpenInvite}
              size="sm"
              color="primary"
              variant="bordered"
              endContent={<FiUserPlus />}
            >
              Invite Members
            </Button>
          )}
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly size="sm" color="primary">
                <TbDotsVertical />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem
                onClick={onOpenMembers}
                endContent={<IoEyeOutline />}
              >
                View
              </DropdownItem>
              {isOwner ? (
                <DropdownItem
                  endContent={<FiUserPlus />}
                  color="primary"
                  onClick={() => onOpenInvite()}
                >
                  Invite
                </DropdownItem>
              ) : (
                <DropdownItem aria-hidden hidden className="hidden" />
              )}
              {isOwner ? (
                <DropdownItem
                  onClick={() => onOpenEdit()}
                  endContent={<VscSettingsGear />}
                  color="warning"
                >
                  Edit
                </DropdownItem>
              ) : (
                <DropdownItem aria-hidden hidden className="hidden" />
              )}
              {isOwner ? (
                <DropdownItem
                  onClick={() => onOpenDelete()}
                  endContent={<IoWarningOutline />}
                  color="danger"
                >
                  Delete
                </DropdownItem>
              ) : (
                <DropdownItem aria-hidden hidden className="hidden" />
              )}
            </DropdownMenu>
          </Dropdown>
        </div>
      </section>
      <form
        onSubmit={(e) => {
          if (currentIdeas.trim() === "") return;
          e.preventDefault();
          const optimisticIdeas: Idea[] = currentIdeas
            .split(",")
            .map((name) => ({
              id: nanoid(),
              name: name.trim(),
              org_id: org.id,
              author_id: userId,
              created_at: new Date().toISOString(),
              votes: { up: [], down: [] },
            }));
          submitIdeas(optimisticIdeas);
        }}
        className="grid grid-cols-[9fr_1fr] place-items-end gap-5 w-full"
      >
        <Input
          required
          isRequired
          label="Enter your ideas as a comma separated values"
          placeholder="Foo, Bar, Baz, ..."
          labelPlacement="outside"
          className="w-full"
          value={currentIdeas}
          onChange={(e) => setCurrentIdeas(e.target.value)}
        />
        <Button
          type="submit"
          radius="sm"
          isLoading={isSubmitting}
          color="primary"
          className="w-full"
        >
          Submit
        </Button>
      </form>
      <Table aria-label="Ideas proposed by members">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} align="start">
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          loadingState={isFetching && ideas.length === 0 ? "loading" : "idle"}
          loadingContent={<Spinner />}
          emptyContent={"No ideas to display."}
          items={ideas}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>
                  {renderCell(item, columnKey as keyof Idea)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <InvitationModal
        organization={org}
        isOpen={isOpenInvite}
        onClose={onCloseInvite}
      />
      <EditionModal
        organization={org}
        isOpen={isOpenEdit}
        onClose={onCloseEdit}
      />
      <DeletionModal
        organization={org}
        isOpen={isOpenDelete}
        onClose={onCloseDelete}
      />
      <MembersModal
        organization={org}
        members={members}
        ideas={ideas}
        isOpen={isOpenMembers}
        onClose={onCloseMembers}
        isOwner={isOwner}
      />
    </main>
  );
};
