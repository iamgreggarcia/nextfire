import { useContext } from "react";
import { UserContext } from "../../lib/context";

export default function UserProfilePage({}) {
  const [user, username] = useContext(UserContext);
  return (
    <main>
      <h1>User Profile</h1>
    </main>
  );
}
// recall: static routes have priority, so this doesn't conflict with e.g.,
// localhost:3000/admin
