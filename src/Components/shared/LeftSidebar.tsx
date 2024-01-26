"use client";
import React from "react";
import { sidebarLinks, sidebarLinkType } from "@/Constant/menu";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { SignOutButton, SignedIn, useAuth } from "@clerk/nextjs";

const LeftSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { userId } = useAuth();
  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex w-full flex-1 flex-col gap-6 px-4">
        {sidebarLinks.map((link: sidebarLinkType) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;

          if (link.route === "/profile") {
            link.route = `${link.route}/${userId}`;
          }

          return (
            <Link
              href={link.route}
              key={link.label}
              className={`leftsidebar_link ${
                isActive ? "bg-primary-500" : "bg-zinc-900"
              } items-center`}
            >
              <p className="text-light-1 max-lg:hidden">{link.label}</p>
              <Image
                src={link.imgURL}
                alt={link.label}
                width={24}
                height={24}
              />
            </Link>
          );
        })}
      </div>
      <div className="mt-10 bg-zinc-900 mx-4 rounded-md">
        <SignedIn>
          <SignOutButton
            signOutCallback={() => {
              return router.push("/sign-in");
            }}
          >
            <div className="flex cursor-pointer gap-4 p-4 justify-between items-center">
              <p className="max-lg:hidden text-rose-600">Logout</p>
              <Image
                src="/assets/logout.svg"
                alt="logout"
                width={24}
                height={24}
              />
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </section>
  );
};

export default LeftSidebar;
