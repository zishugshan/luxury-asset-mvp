import { connectToDatabase } from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { assetId } = req.body;

  if (!assetId) {
    return res.status(400).json({ error: "Asset ID required" });
  }

  try {
    const db = await connectToDatabase();
    await db.collection("assets").deleteOne({ assetId });
    return res.status(200).json({ message: "Asset deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to delete asset" });
  }
}

