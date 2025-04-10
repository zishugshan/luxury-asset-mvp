import { connectToDatabase } from "../../lib/mongodb";

export default async function handler(req, res) {
  console.log("Incoming request to /api/particle-webhook");

  if (req.method !== "POST") {
    console.warn("Invalid method:", req.method);
    return res.status(405).json({ message: "Method not allowed" });
  }

  console.log("Raw body:", req.body);

  const { event, data } = req.body;

  if (event !== "asset_update") {
    console.warn("Invalid event type:", event);
    return res.status(400).json({ message: "Invalid event" });
  }

  let assetData;

  if (data.startsWith("`") && data.endsWith("`")) {
    data = data.slice(1, -1); // remove backticks
  }

  try {
    assetData = JSON.parse(data);
    console.log("Parsed asset data:", assetData);
  } catch (err) {
    console.error("Failed to parse 'data' field as JSON:", data);
    return res.status(400).json({ message: "Invalid data format" });
  }

  try {
    const db = await connectToDatabase();
    const result = await db.collection("assets").updateOne(
      { assetId: assetData.asset },
      {
        $set: {
          fuel: assetData.fuel,
          status: assetData.status,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    console.log("MongoDB update result:", result);

    res.status(200).json({ message: "Asset updated" });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

