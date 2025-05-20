import React, { useState, useRef, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import {
  Search,
  ExternalLink,
  ChevronDown,
  CreditCard,
  Router,
  HardDrive,
  X,
} from "lucide-react";
import axios from "axios";

const categories = [
  { id: "processors", name: "Processors", icon: CreditCard },
  { id: "gateways", name: "Gateways", icon: Router },
  { id: "hardware", name: "Hardware/Equipment", icon: HardDrive },
];

interface VendorTemplate {
  id: number;
  user_id: number;
  vendor_name: string;
  vendor_email: string;
  vendor_phone: string;
  logo_url: string;
  login_url: string;
  rep_name: string;
  rep_email: string;
  rep_phone: string;
  notes: string;
  support_info: string;
  description: string;
  vendor_type: string;
  created_at: string;
  updated_at: string;
}

interface VendorCard {
  vendor_name: string;
  vendor_email: string;
  vendor_phone: string;
  logo_url: string | null;
  logoFile: File | null;
  login_url: string;
  rep_name: string;
  rep_email: string;
  rep_phone: string;
  notes: string;
  support_info: string;
  description: string;
  vendor_type: string;
  role_id: string;
}

export default function Logins() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    {
      processors: true,
      gateways: false,
      hardware: false,
    }
  );
  const [showAddVendorModal, setShowAddVendorModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [vendorCards, setVendorCards] = useState<VendorCard[]>([]);
  const [vendors, setVendors] = useState<Record<string, VendorTemplate[]>>({
    processors: [],
    gateways: [],
    hardware: [],
  });
  const [adminVendors, setAdminVendors] = useState<
    Record<string, VendorTemplate[]>
  >({
    processors: [],
    gateways: [],
    hardware: [],
  });
  const fileInputs = useRef<any[]>([]);

  useEffect(() => {
    // Fetch vendors for each category
    categories.forEach((category) => {
      fetchVendors(category.id);
      fetchAdminVendors(category.id);
    });
    console.log("hello test");
  }, []);

  const fetchVendors = async (vendorType: string) => {
    const value = localStorage.getItem("auth_user");
    const parsedUser = value ? JSON.parse(value) : null;

    const body: any = {};
    if (parsedUser?.role_id !== 2) {
      body.user_id = parsedUser.id;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/vendor/get-all-vendors-list`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
          body: JSON.stringify(body),
        }
      );

      const responseData = await res.json();

      if (responseData.status === "success") {
        setVendors((prev) => ({
          ...prev,
          [vendorType]: [...prev[vendorType], responseData.data],
        }));
      }
    } catch (error) {
      console.error(`Error fetching ${vendorType} vendors:`, error);
    }
  };

  const fetchAdminVendors = async (vendorType: string) => {
    try {
      const vendorTypeData = {
        vendor_type: vendorType,
      };

      const accessToken = localStorage.getItem("auth_token");
      if (!accessToken) {
        throw new Error("Authentication token not found. Please login again.");
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/vendor/get-admin-vendor`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(vendorTypeData),
        }
      );
      const responseData = await response.json();
      if (responseData.status === "success") {
        setAdminVendors((prev) => ({
          ...prev,
          [vendorType]: responseData.data,
        }));
      }
    } catch (error) {
      console.error(`Error fetching admin ${vendorType} vendors:`, error);
    }
  };

  const fetchVendorTemplate = async (
    vendorName: string,
    vendorType: string
  ) => {
    try {
      const showVendorTemplateData = {
        vendor_name: vendorName,
        vendor_type: vendorType,
        user_id: 2,
      };

      const accessToken = localStorage.getItem("auth_token");
      if (!accessToken) {
        throw new Error("Authentication token not found. Please login again.");
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/vendor/show-vendor-template`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(showVendorTemplateData),
        }
      );

      const responseData = await response.json();
      console.log("Duplicate form response:", responseData);

      if (responseData.status === "success") {
        console.log(responseData.data, "responseData.data");
        return responseData.data;
      }
      return null;
    } catch (error) {
      console.error("Error fetching vendor template:", error);
      return null;
    }
  };

  const toggleCategory = (categoryId: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  // const filterItems = (items: VendorTemplate[]) => {
  //   return items.filter((item) =>
  //     item.vendor_name.toLowerCase().includes(searchQuery.toLowerCase())
  //   );
  // };

  const filterItems = (items: VendorTemplate[]) => {
    if (!searchQuery.trim()) return items;

    return items.filter((item) =>
      item.vendor_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const openAddVendorModal = (category: string) => {
    setSelectedCategory(category);
    setVendorCards([
      {
        vendor_name: "",
        vendor_email: "",
        vendor_phone: "",
        logo_url: null,
        logoFile: null,
        login_url: "",
        rep_name: "",
        rep_email: "",
        rep_phone: "",
        notes: "",
        support_info: "",
        description: "",
        vendor_type: category,
        role_id: "",
      },
    ]);
    setShowAddVendorModal(true);
  };

  const handleCardChange = (idx: number, field: string, value: any) => {
    setVendorCards((cards) =>
      cards.map((c, i) => (i === idx ? { ...c, [field]: value } : c))
    );
  };

  const handleLogoUpload = (idx: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string") {
        setVendorCards((cards) =>
          cards.map((c, i) =>
            i === idx ? { ...c, logo_url: result, logoFile: file } : c
          )
        );
      }
    };
    reader.readAsDataURL(file);
  };

  const addVendorCard = () => {
    setVendorCards((cards) => [
      ...cards,
      {
        vendor_name: "",
        vendor_email: "",
        vendor_phone: "",
        logo_url: null,
        logoFile: null,
        login_url: "",
        rep_name: "",
        rep_email: "",
        rep_phone: "",
        notes: "",
        support_info: "",
        description: "",
        vendor_type: selectedCategory,
        role_id: "",
      },
    ]);
  };

  const removeVendorCard = (idx: number) => {
    setVendorCards((cards) => cards.filter((_, i) => i !== idx));
  };

  const handleVendorSelect = async (idx: number, vendorName: string) => {
    if (vendorName === "Other") {
      // Reset the card to empty state
      setVendorCards((cards) =>
        cards.map((c, i) =>
          i === idx
            ? {
                vendor_name: "",
                vendor_email: "",
                vendor_phone: "",
                logo_url: null,
                logoFile: null,
                login_url: "",
                rep_name: "",
                rep_email: "",
                rep_phone: "",
                notes: "",
                support_info: "",
                description: "",
                vendor_type: selectedCategory,
                role_id: "",
              }
            : c
        )
      );
      return;
    }

    // Fetch template for selected vendor
    const template = await fetchVendorTemplate(vendorName, selectedCategory);

    if (template) {
      setVendorCards((cards) =>
        cards.map((c, i) => {
          if (i === idx) {
            let user_role = template.vendor_user?.role_id
              ? String(template.vendor_user.role_id)
              : "";

            return {
              ...c,
              vendor_name: template?.vendor_name || "",
              vendor_email: template?.vendor_email || "",
              vendor_phone: template?.vendor_phone || "",
              logo_url: template?.logo_url
                ? `${import.meta.env.VITE_IMAGE_URL}${template.logo_url}`
                : null,
              logoFile: null,
              login_url: template?.login_url || "",
              rep_name: template?.rep_name || "",
              rep_email: template?.rep_email || "",
              rep_phone: template?.rep_phone || "",
              notes: template?.notes || "",
              support_info: template?.support_info || "",
              description: template?.description || "",
              vendor_type: selectedCategory,
              role_id: user_role,
            };
          }

          return c;
        })
      );
    }
  };

  const handleSubmit = async () => {
    try {
      // ✅ Validation: Check all fields in each vendorCard
      for (let i = 0; i < vendorCards.length; i++) {
        const card = vendorCards[i];
        const requiredFields = [
          "vendor_name",
          "vendor_email",
          "vendor_phone",
          "login_url",
          "rep_name",
          "rep_email",
          "rep_phone",
          "notes",
          "support_info",
          "description",
        ];

        for (const field of requiredFields) {
          if (!card[field as keyof VendorCard]) {
            toast.error(`Field "${field}" is required in card ${i + 1}`);
            return;
          }
        }
      }

      const parsedUser = JSON.parse(localStorage.getItem("auth_user") || "{}");

      const formData = new FormData();
      const vendorsData = vendorCards.map((card, index) => {
        const vendorData = {
          user_id: String(parsedUser.id),
          vendor_type: card.vendor_type,
          vendor_name: card.vendor_name,
          logo_url: card.logo_url,
          vendor_email: card.vendor_email,
          vendor_phone: card.vendor_phone,
          login_url: card.login_url,
          support_info: card.support_info,
          notes: card.notes,
          rep_name: card.rep_name,
          rep_email: card.rep_email,
          rep_phone: card.rep_phone,
          description: card.description,
        };

        if (card.logoFile) {
          formData.append(`vendors[${index}][logo_url]`, card.logoFile);
        }

        return vendorData;
      });

      const accessToken = localStorage.getItem("auth_token");
      formData.append("vendors", JSON.stringify(vendorsData));

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/vendor/create-vendor-template`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            // Do NOT manually set Content-Type with FormData
          },
          body: formData,
        }
      );

      const data = await response.json();
      console.log("data", data);

      // ✅ Handle API response (including non-ok)
      if (response.ok && data?.status === "success") {
        toast.success("Processor saved successfully.");
        // Uncomment below if needed
        setShowAddVendorModal(false);
        categories.forEach((category) => fetchVendors(category.id));
      } else {
        const errorMessage = data?.message || "Something went wrong.";
        const errorDetails = Array.isArray(data?.errors)
          ? data.errors.join("\n")
          : "";
        toast.error(`${errorDetails}`);
      }
    } catch (error: any) {
      console.error("Error creating vendors:", error);

      // ✅ Try to extract Laravel error details if available
      if (error?.response?.json) {
        try {
          const errorData = await error.response.json();
          const message = errorData?.message || "Error creating vendors.";
          const details = Array.isArray(errorData?.errors)
            ? errorData.errors.join("\n")
            : "";
          toast.error(`${details}`);
          return;
        } catch {}
      }

      toast.error("Error creating vendors.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Toaster position="top-right" reverseOrder={false} />
      {/* Header */}
      <div className="mb-8 bg-yellow-400 rounded-lg p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CreditCard className="h-10 w-10 text-black" />
            <div>
              <h1 className="text-3xl font-bold text-black">Login Portal</h1>
              <p className="text-black/80 mt-1">
                Access all your processor, gateway, and vendor logins in one
                place.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search logins..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500 sm:text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Accordion Categories */}
      <div className="space-y-4">
        {categories.map((category) => {
          const CategoryIcon = category.icon;
          const items = filterItems(vendors[category.id] || []);
          const isOpen = openCategories[category.id];

          return (
            <div
              key={category.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <div className="px-6 py-4 flex items-center justify-between">
                <button
                  className="flex items-center space-x-3 text-left focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-inset"
                  onClick={() => toggleCategory(category.id)}
                >
                  <CategoryIcon className="h-6 w-6 text-gray-400" />
                  <span className="text-lg font-medium text-gray-900">
                    {category.name}
                    <span className="ml-2 text-sm text-gray-500">
                      ({items.length})
                    </span>
                  </span>
                </button>
                <button
                  onClick={() => openAddVendorModal(category.id)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Add {category.name.slice(0, -1)}
                </button>
              </div>

              {isOpen && (
                <div className="px-6 pb-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="relative group bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <img
                              src={item.logo_url}
                              alt={item.vendor_name}
                              className="h-12 w-12 rounded-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-medium text-gray-900 truncate">
                              {item.vendor_name}
                            </h3>
                            <div className="mt-2 space-y-1">
                              <p className="text-sm text-gray-500">
                                <span className="font-medium">Rep:</span>{" "}
                                {item.rep_name}
                              </p>
                              <p className="text-sm text-gray-500">
                                <span className="font-medium">Support:</span>{" "}
                                {item.support_info}
                              </p>
                              {item.notes && (
                                <p className="text-sm text-gray-500 italic">
                                  {item.notes}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <a
                              href={item.login_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              <ExternalLink className="h-5 w-5" />
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Vendor Modal */}
      {showAddVendorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-3xl w-full mx-4 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-bold text-gray-900">
                Add {selectedCategory.slice(0, -1)}
              </h2>
              <button
                onClick={() => setShowAddVendorModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex justify-between items-center mb-2">
              <button
                onClick={addVendorCard}
                className="px-2 py-1 text-xs font-medium text-white bg-green-600 border border-transparent rounded hover:bg-green-700"
              >
                + Add Card
              </button>
              <span className="text-xs text-gray-500">
                You can add multiple cards at once
              </span>
            </div>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {vendorCards.map((card, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 rounded p-3 shadow flex flex-col gap-2 relative"
                >
                  {vendorCards.length > 1 && (
                    <button
                      onClick={() => removeVendorCard(idx)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                      title="Remove Card"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  <div className="flex gap-2 items-center">
                    <label className="block text-xs font-medium text-gray-700 w-24">
                      Select Vendor
                    </label>
                    <select
                      className="block w-48 rounded border-gray-300 text-xs py-1 px-2"
                      value={card.vendor_name}
                      onChange={(e) => handleVendorSelect(idx, e.target.value)}
                    >
                      <option value="">Select Vendor</option>
                      {adminVendors[selectedCategory]?.map((v) => (
                        <option key={v.id} value={v.vendor_name}>
                          {v.vendor_name}
                        </option>
                      ))}
                      <option value="Other">Other (Custom)</option>
                    </select>
                  </div>

                  <div className="flex gap-2 items-center">
                    <label className="block text-xs font-medium text-gray-700 w-24">
                      Vendor Name
                    </label>
                    <input
                      type="text"
                      className="block w-48 rounded border-gray-300 text-xs py-1 px-2"
                      value={card.vendor_name}
                      onChange={(e) =>
                        handleCardChange(idx, "vendor_name", e.target.value)
                      }
                    />
                  </div>

                  <div className="flex gap-2 items-center">
                    <label className="block text-xs font-medium text-gray-700 w-24">
                      Vendor Email
                    </label>
                    <input
                      type="text"
                      className="block w-48 rounded border-gray-300 text-xs py-1 px-2"
                      value={card.vendor_email}
                      onChange={(e) =>
                        handleCardChange(idx, "vendor_email", e.target.value)
                      }
                    />
                  </div>

                  <div className="flex gap-2 items-center">
                    <label className="block text-xs font-medium text-gray-700 w-24">
                      Vendor Phone
                    </label>
                    <input
                      type="text"
                      className="block w-48 rounded border-gray-300 text-xs py-1 px-2"
                      value={card.vendor_phone}
                      onChange={(e) =>
                        handleCardChange(idx, "vendor_phone", e.target.value)
                      }
                    />
                  </div>

                  <div className="flex gap-2 items-center">
                    <label className="block text-xs font-medium text-gray-700 w-24">
                      Logo
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      className="block w-32 text-xs"
                      ref={(el) => (fileInputs.current[idx] = el)}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0])
                          handleLogoUpload(idx, e.target.files[0]);
                      }}
                    />

                    {card.logo_url && (
                      <img
                        src={card.logo_url}
                        alt="Vendor Logo"
                        className="h-10 w-10 rounded-full object-cover mt-2"
                      />
                    )}
                  </div>
                  <div className="flex gap-2 items-center">
                    <label className="block text-xs font-medium text-gray-700 w-24">
                      Login URL
                    </label>
                    <input
                      type="text"
                      className="block w-48 rounded border-gray-300 text-xs py-1 px-2"
                      value={card.login_url}
                      onChange={(e) =>
                        handleCardChange(idx, "login_url", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    <label className="block text-xs font-medium text-gray-700 w-24">
                      Rep Name
                    </label>
                    <input
                      type="text"
                      className="block w-48 rounded border-gray-300 text-xs py-1 px-2"
                      value={card.rep_name}
                      onChange={(e) =>
                        handleCardChange(idx, "rep_name", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    <label className="block text-xs font-medium text-gray-700 w-24">
                      Rep Email
                    </label>
                    <input
                      type="email"
                      className="block w-48 rounded border-gray-300 text-xs py-1 px-2"
                      value={card.rep_email}
                      onChange={(e) =>
                        handleCardChange(idx, "rep_email", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    <label className="block text-xs font-medium text-gray-700 w-24">
                      Rep Phone
                    </label>
                    <input
                      type="tel"
                      className="block w-48 rounded border-gray-300 text-xs py-1 px-2"
                      value={card.rep_phone}
                      onChange={(e) =>
                        handleCardChange(idx, "rep_phone", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    <label className="block text-xs font-medium text-gray-700 w-24">
                      Support Info
                    </label>
                    <input
                      type="text"
                      className="block w-48 rounded border-gray-300 text-xs py-1 px-2"
                      value={card.support_info}
                      onChange={(e) =>
                        handleCardChange(idx, "support_info", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    <label className="block text-xs font-medium text-gray-700 w-24">
                      Notes
                    </label>
                    <textarea
                      className="block w-48 rounded border-gray-300 text-xs py-1 px-2"
                      rows={2}
                      value={card.notes}
                      onChange={(e) =>
                        handleCardChange(idx, "notes", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    <label className="block text-xs font-medium text-gray-700 w-24">
                      Description
                    </label>
                    <textarea
                      className="block w-48 rounded border-gray-300 text-xs py-1 px-2"
                      rows={2}
                      value={card.description}
                      onChange={(e) =>
                        handleCardChange(idx, "description", e.target.value)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setShowAddVendorModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Add Vendor(s)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
