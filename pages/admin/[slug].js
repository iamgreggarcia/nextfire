import MetaTags from "../../components/Metatags";
import { firestore, auth, serverTimestamp } from "../../lib/firebase";
import AuthCheck from "../../components/AuthCheck";
import styles from "../../styles/Admin.module.css";

import { useDocumentData } from "react-firebase-hooks/firestore";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import toast, { useToasterStore } from "react-hot-toast";

export default function AdminPostsEdit({}) {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  );
}

function PostManager() {
  const [preview, setPreview] = useState(false);

  const router = useRouter();
  const { slug } = router.query;

  const postRef = firestore
    .collection("users")
    .doc(auth.currentUser.uid)
    .collection("posts")
    .doc(slug);
  // see also: useDocumentDataOnce()
  const [post] = useDocumentData(postRef);

  return (
    <main className={styles.container}>
      {post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.slug}</p>

            <PostForm
              postRef={postRef}
              defaultValues={post}
              preview={preview}
            />
          </section>
          <aside>
            <h3>Tools</h3>
            <button onClick={() => setPreview(!preview)}>
              {preview ? "Edit" : "Preview"}
            </button>
            <Link href={`/${post.username}/${post.slug}`}>
              <button className="btn-blue">Live view</button>
            </Link>
          </aside>
        </>
      )}
    </main>
  );
}

function PostForm({ defaultValues, postRef, preview }) {
  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues,
    mode: "onChange",
  });

  const updatePost = async ({ content, published }) => {
    await postRef.update({
      content,
      published,
      updatedAt: serverTimestamp(),
    });

    // need to reset the validation state of the form
    reset({ content, published });

    toast.success("Posts updated successfully!");
  };

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className="card">
          <ReactMarkdown>{watch("content")}</ReactMarkdown>
        </div>
      )}
      <div className={preview ? styles.hidden : styles.controls}>
        {/* <textarea name="content" ref={register}></textarea> */}
        <textarea {...register("content")} />
        <fieldset>
          {/* <input
            className={styles.checkbox}
            name="published"
            type="checkbox"
            ref={register}
          /> */}
          <input
            type="checkbox"
            className={styles.checkbox}
            {...register("published")}
          />
          <label>Published</label>
        </fieldset>
        <button type="submit" className="btn-green">
          Save Changes
        </button>
      </div>
    </form>
  );
}
