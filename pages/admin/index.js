import AuthCheck from "../../components/AuthCheck";

export default function AdminPostsPage({}) {
  return (
    <main>
      <AuthCheck>
        <h1>Admin Posts</h1>
      </AuthCheck>
    </main>
  );
}
