import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Categories() {
  const [name, setName] = useState("");
  const [editedCategory, setEditedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [properties, setProperties] = useState([]);
  const [parentCategory, setParentCategory] = useState("");

  async function deleteCategory(category) {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete ${category.name}`,
      showCancelButton: true,
      confirmButtonText: "Yes, Delete!",
      reverseButtons: true,
      confirmButtonColor: "#d55",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { _id } = category;
        const res = await axios.delete(`/api/categories?_id=${_id}`);
        Swal.fire("Deleted!", "", "success");
        fetchCategories();
      }
    });
  }

  const handlePropertyNameChange = (index, property, newName) => {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  };

  const handlePropertyValuesChange = (index, property, newValues) => {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    });
  };

  function addProperty() {
    setProperties((prev) => [...prev, { name: "", values: "" }]);
  }

  async function saveCategory(ev) {
    ev.preventDefault();
    const data = {
      name,
      properties: properties.map((p) => ({
        name: p.name,
        values: p.values.split(","),
      })),
    };
    if (parentCategory) {
      data.parentCategory = parentCategory;
    }
    if (!editedCategory) {
      await axios.post("/api/categories", data);
    } else {
      data._id = editedCategory._id;
      await axios.put("/api/categories", data);
    }
    setName("");
    fetchCategories();
    setParentCategory("");
    setProperties([]);
    setEditedCategory(null);
  }

  function fetchCategories() {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }

  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
    setProperties(
      category.properties.map(({ name, values }) => ({
        name,
        values: values.join(","),
      }))
    );
  }

  function removeProperty(index) {
    setProperties((prev) => {
      return [...prev].filter((property, pIndex) => {
        return pIndex !== index;
      });
    });
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Layout>
      <div>Categories</div>
      <label>
        {editedCategory
          ? `Edit category ${editedCategory.name}`
          : "Create new category"}
      </label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input
            className="mb-0"
            type="text"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            placeholder="Category name"
          />
          <select
            className="mb-0"
            value={parentCategory}
            onChange={(ev) => setParentCategory(ev.target.value)}
          >
            <option value="">No parent category</option>
            {categories.length > 0 &&
              categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block">Properties</label>
          {properties.length > 0 &&
            properties.map((property, index) => (
              <div key={index} className="flex gap-1 mb-2">
                <input
                  type="text"
                  className="mb-0"
                  placeholder="property name (example: color)"
                  value={property.name}
                  onChange={(ev) =>
                    handlePropertyNameChange(index, property, ev.target.value)
                  }
                />
                <input
                  type="text"
                  className="mb-0"
                  placeholder="value (example: red)"
                  value={property.values}
                  onChange={(ev) =>
                    handlePropertyValuesChange(index, property, ev.target.value)
                  }
                />

                <button
                  type="button"
                  className="btn-default"
                  onClick={() => removeProperty(index)}
                >
                  Remove
                </button>
              </div>
            ))}
          <button
            type="button"
            className="btn-default text-sm"
            onClick={addProperty}
          >
            Add new property
          </button>
        </div>
        <div className="flex gap-1">
          {editedCategory && (
            <button
              type="button"
              className="btn-default"
              onClick={() => {
                setEditedCategory(null);
                setName("");
                setParentCategory("");
                setProperties([]);
              }}
            >
              Cancel
            </button>
          )}
          <button type="submit" className="btn-primary">
            Save
          </button>
        </div>
      </form>

      {!editedCategory && (
        <table className="basic mt-4">
          <thead>
            <tr>
              <th>Category name</th>
              <th>Parent category</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 &&
              categories.map((category) => (
                <tr key={category._id}>
                  <td>{category.name}</td>
                  <td>{category.parent?.name}</td>
                  <td>
                    <button
                      className="btn-primary mr-1"
                      onClick={() => editCategory(category)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-primary mr-1"
                      onClick={() => deleteCategory(category)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}
