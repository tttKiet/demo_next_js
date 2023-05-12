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
  if (method === "GET") {
    if (req.query?.id) {
      const product = await Product.findOne({ _id: req.query.id });
      res.json(product);
    } else {
      const products = await Product.find();
      res.json(products);
    }
  }

  if (method === "POST") {
    const { title, description, price } = req.body;
    const productDoc = await Product.create({
      title,
      description,
      price,
    });
    res.json(productDoc);
  }

  if (method === "PUT") {
    const { _id, title, description, price } = req.body;
    const productDoc = await Product.updateOne(
      { _id },
      { title, description, price }
    );
    res.json(productDoc);
  }

  if (method === "DELETE") {
    if (req.query?.id) {
      const productDoc = await Product.deleteOne({ _id: req.query.id });
      res.json(productDoc);
    }
  }
}
