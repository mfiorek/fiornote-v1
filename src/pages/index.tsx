import { type NextPage } from "next";
import Layout from "../components/Layout";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const { data: folderData } = trpc.folder.getAll.useQuery();
  const { data: noteData } = trpc.note.getAll.useQuery();

  return (
    <Layout>
      <h1 className="text-7xl font-extralight text-white">fiornote</h1>
      <pre>{JSON.stringify(folderData, undefined, 2)}</pre>
      <pre>{JSON.stringify(noteData, undefined, 2)}</pre>
    </Layout>
  );
};

export default Home;
