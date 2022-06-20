import MetaTags from "../../components/Metatags";
import { firestore, auth, serverTimestamp } from "../../lib/firebase";
import AuthCheck from "../../components/AuthCheck";
import styles from "../../styles/Admin.module.css";
import ImageUploader from "../../components/ImageUploader";

import { useDocumentData } from "react-firebase-hooks/firestore";
import { useForm, ErrorMessage } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import toast, { useToasterStore } from "react-hot-toast";

const MAX_LENGTH = 2000;
const MIN_LENGTH = 10;
const CONTENT_REQUIRED = true;

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
            {/* <p>ID: {post.slug}</p> */}

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
  const { register, handleSubmit, reset, watch, formState } = useForm({
    defaultValues,
    mode: "onChange",
  });

  const { isValid, isDirty } = formState;

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
        <ImageUploader />
        <textarea
          {...register("content", {
            required: {
              value: CONTENT_REQUIRED,
              message: "content is required",
            },
            minLength: { value: MIN_LENGTH, message: "content is too short" },
            maxLength: { value: MAX_LENGTH, message: "content is too long" },
          })}
        ></textarea>
        {formState.errors.content && (
          <p className="text-danger">{formState.errors.content.message}</p>
        )}
        <fieldset>
          <input
            type="checkbox"
            className={styles.checkbox}
            {...register("published")}
          />
          <label>Publish</label>
        </fieldset>
        <button
          type="submit"
          className="btn-green"
          disabled={!isDirty || !isValid}
        >
          Save
        </button>
      </div>
    </form>
  );
}
