import Link from "next/link";

export default function Custom404() {
  return (
    <main>
      <h1>404</h1>
      <h2>That page does not seem to exist...</h2>
      <div className="box-center">
        <img src={"/homer.gif"} className="card-img" />
      </div>
      <Link href="/">
        <button className="btn-blue">Go home</button>
      </Link>
    </main>
  );
}
