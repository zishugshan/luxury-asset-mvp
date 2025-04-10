import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/router";
import { connectToDatabase } from "../lib/mongodb";

export default function Dashboard({ initialAssets }) {
  const [assets, setAssets] = useState(initialAssets);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/");
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = () => signOut(auth);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Asset Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
      <ul>
        {assets.map((asset) => (
          <li key={asset.assetId}>
            {asset.assetId} - Fuel: {asset.fuel}% - Status: {asset.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function getServerSideProps() {
  const db = await connectToDatabase();
  const assets = await db.collection("assets").find({}).toArray();
  return {
    props: { initialAssets: JSON.parse(JSON.stringify(assets)) },
  };
}
