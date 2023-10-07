"use server";
import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";
import { FilterQuery, SortOrder } from "mongoose";

export interface ParamsType {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function updateUser({
  userId,
  username,
  name,
  bio,
  image,
  path,
}: ParamsType): Promise<void> {
  try {
    await connectToDB();
    await User.findOneAndUpdate(
      { id: userId },
      { username: username.toLowerCase(), name, bio, image, onboarded: true },
      { upsert: true }
    );
    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.meassage}`);
  }
}

export async function fetchUser(userId: string) {
  try {
    await connectToDB();
    return await User.findOne({ id: userId });
    // .populate({
    //   path: 'communities',
    //   model: Community
    // });
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.meassage}`);
  }
}

export async function fetchUserPosts(userId: string) {
  await connectToDB();
  try {
    // TODO: populate Community
    const threads = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: {
        path: "children",
        model: Thread,
        populate: {
          path: "author",
          model: User,
          select: "id name image",
        },
      },
    });
    return threads;
  } catch (error: any) {
    throw new Error(`Failed to fetch user posts: ${error.meassage}`);
  }
}

export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  await connectToDB();
  try {
    const skipAmount = (pageNumber - 1) * pageSize;
    const regex = new RegExp(searchString, "i");
    const query: FilterQuery<typeof User> = {
      id: { $ne: userId },
    };
    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }
    const sortOptions = { createdAt: sortBy };
    const users = await User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize)
      .exec();
    const usersCount = await User.countDocuments(query);
    const isNext = usersCount > skipAmount + users.length;
    return { users, isNext };
  } catch (error: any) {
    throw new Error(`Failed to fetch users: ${error.meassage}`);
  }
}

export async function getActivity(userId: string) {
  await connectToDB();
  try {
    const userThreads = await Thread.find({ author: userId });
    const childThreadIds = userThreads.reduce((acc, thread) => {
      return acc.concat(thread.children);
    },[]);
    const replies = await Thread.find(
      { _id: { $in: childThreadIds } },
      { author: { $in: childThreadIds } }
    ).populate({
      path: "author",
      model: User,
      select: "_id name image",
    });

    return replies;
  } catch (error: any) {
    throw new Error(`Failed to fetch activity: ${error.meassage}`);
  }
}
