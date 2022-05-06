import firebase from "firebase/compat";
import { useDocumentData } from 'react-firebase-hooks/firestore';

import {
  getUserWithUsername,
  firestore,
  fromMillis,
  postToJSON,
} from "../lib/firebase";

export async function getStaticProps({ params }) {
  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);

  let post;
  let path;

  if (userDoc) {
    const postRef = userDoc.ref.collection("posts").doc(slug);
    post = postToJSON(await postRef.get());

    path = postRef.path;
  }
  return {
    props: { post, path },
    revalidate: 5000,
  };
}

export default function Post({}) {
  return (
    <main>
      <h1>Public Posts</h1>
    </main>
  );
}

export async function getStaticPaths() {
  // TODO: imporve functionality by using Admin SDK to select empty docs
  const snapshot = await firestore.collectionGroup("posts").get();

  const paths = snapshot.docs.map((doc) => {
    const { slug, username } = doc.date();
    return {
      params: { username, slug },
    };
  });

  return {
    //
    paths,
    fallback: "blocking",
  };
}


export default function Post(props) {
  const postRef = firestore.doc(props.path);
  const [realtimePost] = useDocumentData(postRef);

  const post = realtimePost || props.post;

  return (
    <main className={styles.container}>

      <section>
        <PostContent post={post} />
      </section>

      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} 🤍</strong>
        </p>

      </aside>
    </main>
  );
}