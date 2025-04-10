import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/router";
import { connectToDatabase } from "../lib/mongodb";

export default function Dashboard({ initialAssets }) {
  const [assets, setAssets] = useState(initialAssets);
  const router = useRouter();
  const [expandedItems, setExpandedItems] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/");
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = () => signOut(auth);

  const handleDelete = async (e, assetId) => {
    e.stopPropagation(); // prevent expanding item
    const confirmed = confirm(`Are you sure you want to delete ${assetId}?`);
    if (!confirmed) return;

    const res = await fetch("/api/delete-asset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assetId }),
    });

    const result = await res.json();
    if (res.ok) {
      setAssets((prev) => prev.filter((a) => a.assetId !== assetId));
    } else {
      alert("Error deleting asset: " + result.error);
    }
  };

  const toggleExpand = (assetId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [assetId]: !prev[assetId],
    }));
  };

  const categorizeAssets = () => {
    const categories = {
      Properties: [],
      Vehicle: [],
      "Luxury-asset": [],
      Others: [],
    };

    assets.forEach((asset) => {
      if (asset.type === "property") categories.Properties.push(asset);
      else if (asset.type === "vehicle") categories.Vehicle.push(asset);
      else if (asset.type === "luxury") categories["Luxury-asset"].push(asset);
      else categories.Others.push(asset);
    });

    return categories;
  };

  const categorized = categorizeAssets();

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Asset Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        {Object.entries(categorized).map(([category, items]) => (
          <div key={category}>
            <h2>{category}</h2>
            {items.map((item) => (
              <div key={item.assetId} style={{ marginBottom: "10px", cursor: "pointer" }}>
                <div
                  onClick={() => toggleExpand(item.assetId)}
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span>{item.assetId}</span>
                  <div>
                    <button onClick={(e) => handleDelete(e, item.assetId)} style={{ marginRight: "10px" }}>
                      x 
                    </button>
                    
                  </div>
                </div>
                {expandedItems[item.assetId] && (
                  <ul style={{ marginLeft: "10px", marginTop: "5px" }}>
                    <li>Fuel: {item.fuel ?? "N/A"}%</li>
                    <li>Location: {item.location ?? "N/A"}</li>
                    <li>Revenue: {item.revenue ?? "N/A"}</li>
                    <li>Availability: {item.availability ?? "N/A"}</li>
                    <li>Maintenance: {item.maintenance ?? "N/A"}</li>
                  </ul>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const db = await connectToDatabase();
  const assets = await db.collection("assets").find({}).toArray();

  return {
    props: {
      initialAssets: JSON.parse(JSON.stringify(assets)),
    },
  };
}

