"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { dark } from "@clerk/themes";
import { useRouter } from "next/navigation";
import { OrganizationSwitcher, SignOutButton, SignedIn } from "@clerk/nextjs";

const Topbar = () => {
  const router = useRouter();
  return (
    <nav className="topbar shadow-lg">
      <Link href="/" className="flex items-center gap-4">
        <Image src="/logo.png" alt="logo" width={35} height={35} />
        <p className="text-heading3-bold text-light-1 max-xs:hidden">Threads</p>
      </Link>
      <div className="flex items-center gap-1">
        <div className="block md:hidden">
          <SignedIn>
            <SignOutButton signOutCallback={() => router.push("/sign-in")}>
              <div className="flex cursor-pointer">
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
        <OrganizationSwitcher
          appearance={{
            baseTheme: dark,
            elements: { organizationSwitcherTrigger: "py-2 px-4" },
          }}
        />
      </div>
    </nav>
  );
};

export default Topbar;
