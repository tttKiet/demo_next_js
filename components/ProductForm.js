import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";

function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const router = useRouter();

  const saveProduct = async (ev) => {
    ev.preventDefault();
    const data = {
      title,
      description,
      price,
    };
    if (_id) {
      // Update
      const res = await axios.put("/api/products", { ...data, _id });
      if (res) {
        router.push("/products");
      }
    } else {
      // Create
      const res = await axios.post("/api/products", data);
      if (res) {
        router.push("/products");
      }
    }
  };
  return (
    <form onSubmit={saveProduct}>
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
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          placeholder="description"
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
        ></textarea>
      </div>
      <div>
        <label htmlFor="price"> Price (in USD)</label>
        <input
          id="price"
          type="number"
          placeholder="price"
          value={price}
          onChange={(ev) => setPrice(ev.target.value)}
        />
      </div>
      <button type="submit" className="btn-primary">
        {_id ? "Update" : "Create"}
      </button>
    </form>
  );
}

export default ProductForm;
