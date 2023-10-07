"use server";
import { connectToDB } from "../mongoose";
import Thread from "../models/thread.model";
import Community from "../models/community.model";
import User from "../models/user.model";
import { revalidatePath } from "next/cache";

export interface ThreadParamsType {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createThread({
  text,
  author,
  communityId,
  path,
}: ThreadParamsType) {
  await connectToDB();
  try {
    const createdthread = await Thread.create({
      text,
      author,
      community: communityId,
    });
    await User.findByIdAndUpdate(author, {
      $push: { threads: createdthread._id },
    });
    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error creating thread: ${error.message}`);
  }
}

export async function fetchThread(pageNumber = 1, pageSize = 20) {
  await connectToDB();
  try {
    const skipAmount = pageSize * (pageNumber - 1);
    const postQuery = Thread.find({ parentId: { $in: [null, undefined] } })
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({ path: "author", model: User })
      .populate({
        path: "children",
        populate: {
          path: "author",
          model: User,
          select: "_id name parentId image",
        },
      });

    const totalPostCount = await Thread.countDocuments({
      parentId: { $in: [null, undefined] },
    });
    const posts = await postQuery.exec();
    const isNext = totalPostCount > skipAmount + posts.length;
    return { posts, isNext };
  } catch (error: any) {
    throw new Error(`Error fetching thread: ${error.message}`);
  }
}

export async function fetchThreadById(id: string) {
  await connectToDB();
  try {
    // TODO: populate community
    const thread = await Thread.findById(id)
      .populate({ path: "author", model: User, select: "_id id name image" })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "_id id name parentId image",
            },
          },
        ],
      })
      .exec();
    return thread;
  } catch (error: any) {
    throw new Error(`Error fetching thread by id: ${error.message}`);
  }
}

export async function addCommentToThread(
  threadId: string,
  commentText: string,
  userId: string,
  path: string
) {
  await connectToDB();
  try {
    const originalThread = await Thread.findById(threadId);
    if (!originalThread) throw new Error("Thread not found");
    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId,
    });
    const savedCommentThread = await commentThread.save();
    await originalThread.children.push(savedCommentThread._id);
    await originalThread.save();
    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error adding comment to thread: ${error.message}`);
  }
}
