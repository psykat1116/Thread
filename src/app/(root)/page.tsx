import { fetchThread } from "@/lib/actions/thread.action";
import { currentUser } from "@clerk/nextjs";
import ThreadCard from "@/Components/cards/ThreadCard";

const Home = async () => {
  const user = await currentUser();
  const result = await fetchThread(1, 30);
  // console.log(result);
  return (
    <>
      <h1 className="head-text text-left">Home</h1>
      <section className="mt-9 flex flex-col gap-10">
        {result.posts.length == 0 ? (
          <p className="no-result text-white">No Threads Found</p>
        ) : (
          <>
            {result.posts.map((post) => {
              return (
                <ThreadCard
                  key={post._id}
                  id={post._id}
                  currentUserId={user?.id || ""}
                  parentId={post.parentId}
                  content={post.text}
                  author={post.author}
                  community={post.community}
                  createdAt={post.createdAt}
                  comments={post.children}
                />
              );
            })}
          </>
        )}
      </section>
    </>
  );
};

export default Home;
