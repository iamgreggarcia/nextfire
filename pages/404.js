import Image from "next/image";
import Link from "next/link";
import homerGif from "../public/homer.gif";

export default function Custom404() {
  return (
    <main>
      <h1>404</h1>
      <h2>That page does not seem to exist...</h2>
      <div className="card-img">
        <Image src={homerGif} alt="Homer Simpson frantically searching" />
      </div>
      <Link href="/">
        <button className="btn-blue">Go home</button>
      </Link>
    </main>
  );
}
