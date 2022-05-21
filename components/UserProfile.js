import { auth } from "../lib/firebase";
export default function Page({ user }) {
  return (
    <div className="box-center">
      <img src={user.photoURL || "/hacker.png"} className="card-img-center" />
      <p>
        <i>@{user.username}</i>
        <div className="keep-center">
          <SignOutButton />
        </div>
      </p>
      <h1>{user.displayName || "Anonymous User"}</h1>
    </div>
  );
}

// Sign out button
function SignOutButton() {
  return <button onClick={() => auth.signOut()}>Sign Out</button>;
}
