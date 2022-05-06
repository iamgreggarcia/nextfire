import firebase from "firebase/compat";
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
