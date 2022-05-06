import Head from "next/head";

export default function MetaTags({ title, description, image }) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="" content="summary" />
      <meta property="og:title" content={title} />
    </Head>
  );
}
