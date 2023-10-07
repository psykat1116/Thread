import React from "react";
import Image from "next/image";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import UserCard from "@/Components/cards/UserCard";
import ProfileHeader from "@/Components/shared/ProfileHeader";
import { profileTabs } from "@/Constant/menu";
import ThreadsTab from "@/Components/shared/ThreadsTab";
import { fetchCommunities } from "@/lib/actions/community.action";
import CommunityCard from "@/Components/cards/CommunityCard";

const page = async () => {
  const user = await currentUser();
  if (!user) {
    return null;
  }
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) {
    redirect("/onboarding");
  }
  const result = await fetchCommunities({
    searchString: "",
    pageNumber: 1,
    pageSize: 25,
  });
  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>
      <div className="mt-14 flex flex-col gap-9">
        {result.communities.length === 0 ? (
          <p className="no-result">No Users</p>
        ) : (
          <>
            {result.communities.map((com) => {
              return (
                <CommunityCard
                  key={com.id}
                  id={com.id}
                  name={com.name}
                  username={com.username}
                  imgUrl={com.image}
                  bio={com.bio}
                  members={com.members}
                />
              );
            })}
          </>
        )}
      </div>
    </section>
  );
};

export default page;
