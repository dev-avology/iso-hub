import React, { useState, useEffect } from "react";
import { Edit, Download, Trash2, Megaphone } from "lucide-react";


export default function Marketing() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showItemModal, setShowItemModal] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  // const [items, setItems] = useState([{ title: "" }]);
  const [items, setItems] = useState([{ title: "", description: "" }]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editItemData, setEditItemData] = useState({ id: null, title: "", description: "" });



  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("auth_token");

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/marketing/lists`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const result = await response.json();

      if (response.ok && result.status === "success" && Array.isArray(result.data)) {
        setCategories(result.data);
      } else {
        throw new Error(result.message || "Unexpected response format");
      }
    } catch (error) {
      console.error("Error fetching categories:", error.message);
      alert("Failed to fetch categories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      const response = await fetch(`${API_BASE_URL}/marketing/create-category`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        setShowModal(false);
        setNewCategoryName("");
        fetchCategories();
      } else {
        throw new Error(data.message || "Failed to add category.");
      }
    } catch (error) {
      console.error("Error adding category:", error.message);
      alert("Failed to add category. Please try again.");
    }
  };

  const handleEditItemClick = async (itemId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/marketing/get-item-details/${itemId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        setEditItemData({
          id: itemId,
          title: data.data.title, // assuming response format { data: { title: "..." } }
          description: data.data.description
        });
        setShowEditModal(true);
      } else {
        throw new Error(data.message || "Item not found.");
      }
    } catch (error) {
      console.error("Error fetching item details:", error.message);
      alert("Could not fetch item details.");
    }
  };


  const handleAddItemsToCategory = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/marketing/create-item`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          category_id: selectedCategoryId,
          // items: items.filter((item) => item.title.trim() !== ""),
          items: items.filter((item) => item.title !== "").map((item) => ({
            title: item.title,
            description: item.description,
          })),

        }),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        setShowItemModal(false);
        setItems([{ title: "", description: "" }]);

        fetchCategories();
      } else {
        throw new Error(data.message || "Failed to add items.");
      }
    } catch (error) {
      console.error("Error adding items:", error.message);
      alert("Failed to add items. Please try again.");
    }
  };

  const handleUpdateItem = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/marketing/update-item`, {
        method: "POST", // or POST depending on your API
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          title: editItemData.title,
          id: editItemData.id,
          description: editItemData.description
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        setShowEditModal(false);
        fetchCategories(); // refresh list
      } else {
        throw new Error(data.message || "Update failed.");
      }
    } catch (error) {
      console.error("Error updating item:", error.message);
      alert("Failed to update item.");
    }
  };

  const confirmAndDeleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/marketing/remove-item/${id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (response.ok && result.status === "success") fetchCategories();
    } catch (error) {
      alert("Failed to delete item.");
    }
  };

  const confirmAndDeleteCat = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/marketing/remove-category/${id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (response.ok && result.status === "success") fetchCategories();
    } catch (error) {
      alert("Failed to delete item.");
    }
  };


  return (
    <>
      {/* Header */}
      <div className="mb-8 bg-yellow-400 rounded-lg p-6 shadow-lg">
        <div className="flex items-center space-x-3">
          <Megaphone className="h-10 w-10 text-black" />
          <div>
            <h1 className="text-3xl font-bold text-black">Marketing</h1>
            <p className="text-black/80 mt-1">
              Access and customize your marketing materials below:
            </p>
          </div>
        </div>
      </div>

      {/* Add Category Button */}
      <div>
        <button
          onClick={() => setShowModal(true)}
          className="w-fit bg-yellow-400 rounded py-2 px-5 font-semibold uppercase flex items-center justify-center hover:bg-yellow-600 gap-2 text-black"
        >
          Add New Category
        </button>
      </div>

      {loading ? (
        <p className="text-white mt-4 text-center text-sm">Loading...</p>
      ) : categories.length === 0 ? (
        <div className="flex justify-center items-center mt-8">
          <p className="text-white text-center text-sm">No marketing categories found.</p>
        </div>
      ) : (
        categories.map((category) => (
          <div key={category.id} className="markiting-wrap mt-8">
            <div className="marketing-heading flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-white text-base font-semibold">{category.name}</h3>
                <button
                  onClick={() => confirmAndDeleteCat(category.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => {
                  setSelectedCategoryId(category.id);
                  setItems([{ title: "", description: "" }]);
                  setShowItemModal(true);
                }}
                className="w-fit bg-yellow-400 rounded py-1 px-3 text-xs font-semibold uppercase flex items-center justify-center hover:bg-yellow-600 gap-1 text-black"
              >
                Add
              </button>
            </div>
            {category.items.map((item, index) => (
              <div key={index} className="markiting-list-wrap">
                <div className="markiting-list group px-4 py-3 rounded border border-gray-700 mt-3 bg-gray-700 cursor-pointer relative text-white">
                  <h4 className="font-medium text-sm">{item.title}</h4>
                  <p className="text-xs text-gray-300 mt-0.5">
                     {item.description}
                  </p>
                  <div className="edit-delete-btn absolute right-4 top-3 hidden group-hover:block">
                    <div className="edit_data flex gap-2 items-center">
                      <button onClick={() => handleEditItemClick(item.id)} className="hover:text-yellow-500">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => confirmAndDeleteItem(item.id)} className="hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <a href="#" className="hover:text-yellow-500">
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))
      )}



      {/* Add Category Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4">Add Marketing Category</h2>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter category name"
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                className="bg-yellow-500 px-4 py-2 rounded text-white hover:bg-yellow-600"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Items Modal */}
      {showItemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4">Add Items to Category</h2>

            {items.map((item, index) => (
              <div key={index} className="mb-4">
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => {
                    const updated = [...items];
                    updated[index].title = e.target.value;
                    setItems(updated);
                  }}
                  placeholder={`Title ${index + 1}`}
                  className="w-full p-2 border border-gray-300 rounded mb-2"
                />
                <textarea
                  value={item.description}
                  onChange={(e) => {
                    const updated = [...items];
                    updated[index].description = e.target.value;
                    setItems(updated);
                  }}
                  placeholder={`Description ${index + 1}`}
                  className="w-full p-2 border border-gray-300 rounded"
                ></textarea>
              </div>
            ))}


            <button
              onClick={() => setItems([...items, { title: "", description: "" }])}
              className="mb-4 text-sm text-blue-600 hover:underline"
            >
              + Add another item
            </button>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowItemModal(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddItemsToCategory}
                className="bg-yellow-500 px-4 py-2 rounded text-white hover:bg-yellow-600"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4">Edit Item</h2>
            <input
              type="text"
              value={editItemData.title}
              onChange={(e) =>
                setEditItemData({ ...editItemData, title: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded mb-4"
              placeholder="Enter new title"
            />
            <textarea
              className="w-full p-2 border border-gray-300 rounded mt-2"
              placeholder="Enter description"
              value={editItemData.description}
              onChange={(e) =>
                setEditItemData({ ...editItemData, description: e.target.value })
              }
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowEditModal(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateItem}
                className="bg-yellow-500 px-4 py-2 rounded text-white hover:bg-yellow-600"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}


    </>
  );
}
