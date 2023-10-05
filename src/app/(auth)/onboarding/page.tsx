import React from "react";
import AccountProfile from "@/Components/forms/AccountProfile";
import { currentUser } from "@clerk/nextjs";

export interface userDataProps {
    id: string,
    objectId: string,
    username: string,
    name: string,
    bio: string,
    image: string
}

const page = async () => {
  const user = await currentUser();
  const userInfo = {};
  const userData:userDataProps = {
    id: user?.id as string,
    objectId: userInfo?._id,
    username: userInfo?.username || user?.username,
    name: userInfo?.name || user?.firstName || "",
    bio: userInfo?.bio || "",
    image: userInfo?.image || user?.imageUrl,
  }
  return (
    <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
      <h1 className="head-text">Onboarding</h1>
      <p className="mt-3 text-base-regular text-light-2">
        Complete Your Profile Now to use Threads
      </p>
      <section className="mt-9 bg-dark-2 p-10">
        <AccountProfile user={userData} btnTitle="continue"/>
      </section>
    </main>
  );
};

export default page;
