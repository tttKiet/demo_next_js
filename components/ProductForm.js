/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import { CldImage } from "next-cloudinary";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category: existingCategory,
  properties: existingProperties,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [images, setImages] = useState(existingImages || []);
  const [category, setCategory] = useState(existingCategory || "");
  const [isUploading, setIsUploading] = useState(false);
  const [productProperties, setProductProperties] = useState(
    existingProperties || {}
  );
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  const uploadImages = async (ev) => {
    setIsUploading(true);
    const files = ev.target.files;
    if (files?.length > 0) {
      const data = new FormData();
      for (let file of files) {
        data.append("file", file);
      }
      const res = await axios.post("/api/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImages((oldImage) => {
        return [...oldImage, ...res.data.links];
      });
      setIsUploading(false);
    }
  };

  const updateImagesOrder = (images) => {
    setImages(images);
  };

  const saveProduct = async (ev) => {
    ev.preventDefault();
    const data = {
      title,
      description,
      price,
      images,
      category,
      properties: productProperties,
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

  function setProductProp(propName, value) {
    setProductProperties((prev) => {
      const newProductProps = { ...prev };
      newProductProps[propName] = value;
      return newProductProps;
    });
  }

  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({ _id }) => _id === category);
    propertiesToFill.push(...catInfo.properties);
    while (catInfo?.parent?._id) {
      const parentCat = categories.find(
        ({ _id }) => _id === catInfo?.parent?._id
      );
      propertiesToFill.push(...parentCat.properties);
      catInfo = parentCat;
    }
  }

  useEffect(() => {
    axios.get("/api/categories").then((result) => setCategories(result.data));
  }, []);

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
        <label htmlFor="productName">Category</label>

        {console.log("product prop: ", productProperties)}
        <select
          value={category}
          onChange={(ev) => setCategory(ev.target.value)}
        >
          <option value="">Uncategoried</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        {propertiesToFill.length > 0 &&
          propertiesToFill.map((p, index) => (
            <div key={index} className="flex gap-1">
              <div>{p.name}</div>
              <select
                value={productProperties[p.name]}
                onChange={(ev) => setProductProp(p.name, ev.target.value)}
              >
                {p.values.map((v, index) => (
                  <option value={v} key={index}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          ))}
      </div>

      <div>
        <label htmlFor="Photos">Photos</label>

        <div className="mb-2 flex flex-wrap gap-2">
          <ReactSortable
            className="flex flex-wrap gap-2"
            list={images}
            setList={updateImagesOrder}
            animation={200}
            delayOnTouchStart={true}
          >
            {!!images?.length &&
              images.map((link, i) => (
                <div key={link + i} className="inline-block h-24">
                  <CldImage
                    width={0}
                    height={0}
                    className="rounded-lg object-cover shadow-sm border w-auto h-full"
                    alt="Image_upload"
                    src={link.toString()}
                  />
                </div>
              ))}
          </ReactSortable>

          {isUploading && (
            <div className="h-24 flex items-center p-2">
              <Spinner />
            </div>
          )}
          <label
            htmlFor="file_input"
            className="w-24 h-24 cursor-pointer border text-center flex flex-col items-center justify-center text-sm gap-1 text-gray-500 rounded-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7.5 7.5h-.75A2.25 2.25 0 004.5 9.75v7.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25v-7.5a2.25 2.25 0 00-2.25-2.25h-.75m0-3l-3-3m0 0l-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 012.25 2.25v7.5a2.25 2.25 0 01-2.25 2.25h-7.5a2.25 2.25 0 01-2.25-2.25v-.75"
              />
            </svg>
            <div>Upload</div>
          </label>
          <input
            id="file_input"
            onChange={uploadImages}
            type="file"
            className="hidden"
          />
        </div>
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
