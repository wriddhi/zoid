"use client";

import { LuSearch } from "react-icons/lu";
import { IoMdAdd } from "react-icons/io";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import axios from "axios";
import {
  Input,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
  useDisclosure,
} from "@/components/ui";

import type { Org } from "@/types/org";
import { timeAgo } from "@/lib/utils";
import Link from "next/link";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CreationModal = ({ isOpen, onClose }: ModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const formRef = useRef<HTMLFormElement>(null);

  const queryClient = useQueryClient();

  const { mutate: createOrg, isPending: isCreatingOrg } = useMutation({
    mutationFn: async () => {
      if (name.trim() === "") return;
      const { data } = await axios.post<Org>(`/api/org`, {
        name: name.trim(),
        description: description.trim(),
      });
      return data;
    },
    onSuccess: (org) => {
      setName("");
      setDescription("");
      onClose();
      queryClient.setQueryData(["Orgs"], (old: Org[] | undefined) =>
        old ? [...old, org] : [org]
      );
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Organization</ModalHeader>
        <ModalBody>
          <p className="text-xs">
            Starting a new venture? Create an organization to partner up and
            brainstorm with your new team.
          </p>
          <form
            ref={formRef}
            onSubmit={(e) => {
              e.preventDefault();
              createOrg();
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
            onClick={() => formRef.current?.requestSubmit()}
            isLoading={isCreatingOrg}
            color="primary"
          >
            Create Organization
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

type ProjectListProps = {
  userId: string;
  orgs: Org[];
};

export const ProjectList = ({ orgs: organizations }: ProjectListProps) => {
  const { data: orgs } = useQuery({
    queryKey: ["Orgs"],
    queryFn: async () => organizations,
    initialData: organizations,
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <main className="flex-1 px-4 md:px-12 h-full w-full">
      <section className="flex md:flex-row py-4 gap-4 md:items-center w-full">
        <Button
          onClick={onOpen}
          color="primary"
          radius="sm"
          size="sm"
          className="w-fit"
        >
          <span className="hidden md:flex"> New Organization </span>
          <IoMdAdd className="flex size-4" />
        </Button>
        <Input
          startContent={<LuSearch />}
          size="sm"
          radius="sm"
          placeholder="Search for an organization"
          className="w-full md:max-w-72"
        />
      </section>
      <section className="w-full py-4 flex flex-col md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-12">
        {!orgs || !orgs.length ? (
          <div className="text-center font-semibold p-12 text-balance text-4xl col-span-4 row-span-12 w-full h-full flex-1 grid place-items-center rounded-xl outline-dashed">
            You have not joined <br /> or <br /> created any organizations.
          </div>
        ) : (
          orgs.map((org) => (
            <Link
              prefetch={true}
              href={`/dashboard/${org.id}`}
              key={org.id}
              className="flex flex-col gap-1 outline-1 outline-dashed rounded-xl p-6 focus:outline-2 hover:outline-2    "
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">{org.name}</h2>
              </div>
              <p className="text-xs text-gray-500">{timeAgo(org.created_at)}</p>
              <p className="mt-4">
                {org.description
                  ? org.description
                  : "This organization has no description."}
              </p>
            </Link>
          ))
        )}
        <CreationModal isOpen={isOpen} onClose={onClose} />
      </section>
    </main>
  );
};
