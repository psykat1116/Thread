import React from "react";
import Image from "next/image";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser, fetchUsers, getActivity } from "@/lib/actions/user.actions";
import UserCard from "@/Components/cards/UserCard";
import ProfileHeader from "@/Components/shared/ProfileHeader";
import { profileTabs } from "@/Constant/menu";
import ThreadsTab from "@/Components/shared/ThreadsTab";

const page = async () => {
  const user = await currentUser();
  if (!user) {
    return null;
  }
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) {
    redirect("/onboarding");
  }
  const activity = await getActivity(userInfo._id);
  return (
    <section>
      <h1 className="head-text mb-10">Activity</h1>
      <section className="mt-10 flex flex-col gap-5">
        {activity.length > 0 ? (
          <>
            {activity.map((item) => {
              return (
                <Link key={item._id} href={`/thread/${item.parentId}`}>
                  <article className="activity-card">
                    <Image
                      src={item.author.image}
                      alt="Profile Pic"
                      width={20}
                      height={20}
                      className="rounded-full object-cover"
                    />
                    <p className="!text-small-regular text-light-1">
                      <span className="mr-1 text-primary-500">
                        {item.author.name}
                      </span>{" "}
                      Replied To Your Thread
                    </p>
                  </article>
                </Link>
              );
            })}
          </>
        ) : (
          <p className="!text-base-regular text-light-3">No Activities</p>
        )}
      </section>
    </section>
  );
};

export default page;
