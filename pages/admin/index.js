import AuthCheck from "../../components/AuthCheck";
import { firestore, auth } from "../../lib/firebase";
import PostFeed from "../../components/PostFeed";

import { UserContext } from "../../lib/context";
import { useContext, useState } from "react";
import { useRouter } from "next/router";

import { useCollection } from "react-firebase-hooks/firestore";
import { kebabCase } from "lodash";
import toast from "react-hot-toast";
import { serverTimestamp } from "firebase/firestore";
import styles from "../../styles/Admin.module.css";
import Link from "next/link";

export default function AdminPostsPage({}) {
  return (
    <main>
      <AuthCheck>
        <LogOut />
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  );
}

function LogOut() {
  return (
    <Link href="/enter">
      <button> Log Out</button>
    </Link>
  );
}

function PostList() {
  const ref = firestore
    .collection("users")
    .doc(auth.currentUser.uid)
    .collection("posts");

  const query = ref.orderBy("createdAt");
  const [querySnapshot] = useCollection(query);

  const posts = querySnapshot?.docs.map((doc) => doc.data());
  return (
    <>
      <h1>Manage your posts</h1>
      <PostFeed posts={posts} admin />
    </>
  );
}

function CreateNewPost() {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState("");
  // const [loading, setLoading] = useState(false);

  // Verify slug is URL safe
  const slug = encodeURI(kebabCase(title));

  // Validate title length
  const isValid = title.length > 3 && title.length < 100;

  const createPost = async (e) => {
    e.preventDefault();
    const uid = auth.currentUser.uid;
    const ref = firestore
      .collection("users")
      .doc(uid)
      .collection("posts")
      .doc(slug);

    // Give all fields a default value here
    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: "# hello, world.",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    };

    await ref.set(data);
    toast.success("Post created!");

    // Imperative navigation after document is set
    router.push(`/admin/${slug}`);
  };

  return (
    <div className="create-username">
      <form onSubmit={createPost}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My awesome article title"
          className={styles.input}
        />
        <p>
          <strong>Slug:</strong> {slug}
        </p>
        <button type="submit" disabled={!isValid} className="btn-green">
          Create New Post
        </button>
      </form>
    </div>
  );
}
