import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/product";

export default async function handler(req, res) {
  const { method } = req;

  try {
    await mongooseConnect();
    console.log("Connected to db!!!!!!!!!!!!!!");
  } catch (error) {
    console.log("------------------------------------");
    console.log(error);
    console.log("------------------------------------");
  }
  if (method === "POST") {
    const { title, decscription, price } = req.body;
    const productDoc = await Product.create({
      title,
      decscription,
      price,
    });
    res.json(productDoc);
  }
}
