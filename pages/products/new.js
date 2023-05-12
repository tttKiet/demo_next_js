import Layout from "@/components/Layout";
import axios from "axios";
import { useState } from "react";

export default function NewProduct() {
  const [title, setTitle] = useState("");
  const [decscription, setDecscription] = useState("");
  const [price, setPrice] = useState("");

  const createProduct = async (ev) => {
    ev.preventDefault();
    const data = {
      title,
      decscription,
      price,
    };
    console.log("data: ", data);
    const res = await axios.post("/api/products", data);
    console.log("res: ", res);
  };
  return (
    <Layout>
      <form onSubmit={createProduct}>
        <h1>New Product</h1>
        <div>
          <label htmlFor="productName">Product name</label>
          <input
            id="productName"
            type="text"
            placeholder="product name"
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
          />
        </div>
        <div>
          <label htmlFor="decscription">Product name</label>
          <textarea
            id="decscription"
            placeholder="decscription"
            value={decscription}
            onChange={(ev) => setDecscription(ev.target.value)}
          ></textarea>
        </div>
        <div>
          <label htmlFor="price">Product name</label>
          <input
            id="price"
            type="number"
            placeholder="price"
            value={price}
            onChange={(ev) => setPrice(ev.target.value)}
          />
        </div>
        <button type="submit" className="btn-primary">
          Create
        </button>
      </form>
    </Layout>
  );
}
