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
} from "@/components/ui";

import {
  PiArrowFatUp,
  PiArrowFatUpFill,
  PiArrowFatDown,
  PiArrowFatDownFill,
} from "react-icons/pi";
import { SiGodaddy, SiNamecheap, SiSpaceship } from "react-icons/si";
import { TbWorldSearch, TbDotsVertical } from "react-icons/tb";
import { FiUserPlus } from "react-icons/fi";
import { VscTrash, VscSettingsGear } from "react-icons/vsc";
import { IoEyeOutline, IoWarningOutline } from "react-icons/io5";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { nanoid } from "nanoid";

import { cn, prettyTimeStamp, timeAgo } from "@/lib/utils";
import { Verifications } from "@/data";
import Link from "next/link";
type Props = {
  userId: string;
  members: PublicUser[];
  org: Org;
};

type Column = {
  uid: keyof Idea | "actions" | "domains" | "trademarks";
  name: string;
};

const columns: Column[] = [
  { uid: "name", name: "NAME" },
  { uid: "author_id", name: "PROPOSED BY" },
  { uid: "created_at", name: "SUBMITTED ON" },
  { uid: "domains", name: "DOMAINS" },
  { uid: "trademarks", name: "TRADEMARKS" },
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

export const Ideas = ({ userId, members, org }: Props) => {
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
  const queryClient = useQueryClient();

  const queryKey = ["ideas", { id: org.id }];

  const { data: ideas, isFetching } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data } = await axios.get<Idea[]>(`/api/ideas?id=${org.id}`);
      return data ?? [];
    },
    initialData: [],
    enabled: !!org.id,
  });

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
              avatarProps={{ radius: "lg", src: user.imageUrl }}
              description={user.email}
              name={user.firstName + " " + (user.lastName ?? "")}
            >
              {user.email}
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
        case "domains":
          return (
            <div className="flex items-center gap-4">
              <Tooltip content="GoDaddy">
                <a
                  aria-label="GoDaddy"
                  className="text-xs"
                  target="_blank"
                  href={Verifications.GoDaddy(idea.name)}
                >
                  <SiGodaddy />
                </a>
              </Tooltip>
              <Tooltip content="Namecheap">
                <a
                  aria-label="Namecheap"
                  className="text-xs"
                  target="_blank"
                  href={Verifications.Namecheap(idea.name)}
                >
                  <SiNamecheap />
                </a>
              </Tooltip>
              <Tooltip content="SpaceShip">
                <a
                  aria-label="SpaceShip"
                  className="text-xs"
                  target="_blank"
                  href={Verifications.SpaceShip(idea.name)}
                >
                  <SiSpaceship />
                </a>
              </Tooltip>
            </div>
          );
        case "trademarks":
          return (
            <Tooltip content="World Intellectual Property Organization">
              <a
                aria-label="World Intellectual Property Organization"
                className="text-xs bg-red-500"
                target="_blank"
                href={Verifications.WIPO(idea.name)}
              >
                <TbWorldSearch className="size-4 mx-auto" />
              </a>
            </Tooltip>
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
        <Link href="/dashboard">&lt;-</Link>
        <div>
          <h1 className="font-semibold text-2xl md:text-4xl">{org.name}</h1>
          <p className="text-xs md:text-sm text-gray-500">
            {org.description ?? "No description."}
          </p>
        </div>
        {org.owner_id === userId && (
          <div className="ml-auto relative flex justify-end items-center gap-2">
            <Button
              onClick={onOpenInvite}
              size="sm"
              color="primary"
              variant="bordered"
              endContent={<FiUserPlus />}
            >
              Invite Members
            </Button>
            <Dropdown>
              <DropdownTrigger>
                <Button
                  onClick={onOpenInvite}
                  isIconOnly
                  size="sm"
                  color="primary"
                >
                  <TbDotsVertical className="" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem
                  endContent={<FiUserPlus />}
                  color="primary"
                  onClick={() => onOpenInvite()}
                >
                  Invite
                </DropdownItem>
                <DropdownItem
                  onClick={() => onOpenEdit()}
                  endContent={<VscSettingsGear />}
                  color="warning"
                >
                  Edit
                </DropdownItem>
                <DropdownItem
                  onClick={() => onOpenDelete()}
                  endContent={<IoWarningOutline />}
                  color="danger"
                >
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        )}
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
          children={(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>
                  {renderCell(item, columnKey as keyof Idea)}
                </TableCell>
              )}
            </TableRow>
          )}
        />
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
    </main>
  );
};
