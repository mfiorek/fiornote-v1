import { type NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>fiornote</title>
        <meta name="description" content="Notes app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-800">
        <h1 className="text-7xl font-extralight text-white">fiornote</h1>
      </main>
    </>
  );
};

export default Home;
