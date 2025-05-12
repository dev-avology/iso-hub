import React, { useEffect, useRef, useState } from "react";
import { FileText, Calendar, Loader2, FastForward } from "lucide-react";
import SignaturePad from "react-signature-canvas";
import { useSearchParams } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import { AlertCircle } from "lucide-react";
import OwnerForm from "../../components/OwnerForm";
import BankingDocs from "../../components/BankingDocs";

interface FormData {
  signature_date: string;
  signature: string;

  business_dba: string;
  business_corporate_legal_name: string;
  business_location_address: string;
  business_corporate_address: string;
  business_city: string;
  business_state: string;
  business_zip: string;
  business_phone_number: string;
  business_contact_name: string;
  business_contact_number: string;
  business_start_date: string;
  business_tax_id: string;
  business_profile_business_type: string[];

  ownership_owner_name: string;
  ownership_title: string;
  ownership_percent: string;
  ownership_phone_number: string;
  ownership_city: string;
  ownership_state: string;
  ownership_zip: string;
  ownership_email: string;
  ownership_dob: string;
  ownership_social_security_number: string;
  ownership_residential_street_address: string;
  ownership_driver_licence_number: string;

  bank_name: string;
  aba_routing: string;
  doa: string;

  business_type: string[];
  processing_services: string[];

  terminal: string[];
  terminal_special_features: string;
  terminal_type_or_model: string;

  mobile_app: string[];
  mobile_app_special_features: string;
  mobile_app_cardreader_type_model: string;

  pos_point_of_sale: string[];
  pos_special_features: string;
  system_type_model: string;
  number_of_stations: string;
  pos_other_items: string;

  virtual_terminal: string[];
  business_type_other: string;
  location_description: string;
  estimation_early_master_card: string;
  estimated_average_ticket: string;

  // Credit Card Processing Information
  estimated_highest_ticket: string;
  transaction_card_present: string;
  transaction_keyed_in: string;
  transaction_all_online: string;
  auto_settle_time: string;
  auto_settle_type: string; // 'auto' or 'manual'
  add_tips_to_account: string; // 'yes' or 'no'
  tip_amounts: string;
}

// Put this outside your component
const blankFormData: FormData = {
  signature_date: "",
  signature: "",

  business_dba: "",
  business_corporate_legal_name: "",
  business_location_address: "",
  business_corporate_address: "",
  business_city: "",
  business_state: "",
  business_zip: "",
  business_phone_number: "",
  business_contact_name: "",
  business_contact_number: "",
  business_start_date: "",
  business_tax_id: "",
  business_profile_business_type: [],

  ownership_owner_name: "",
  ownership_title: "",
  ownership_percent: "",
  ownership_phone_number: "",
  ownership_city: "",
  ownership_state: "",
  ownership_zip: "",
  ownership_email: "",
  ownership_dob: "",
  ownership_social_security_number: "",
  ownership_residential_street_address: "",
  ownership_driver_licence_number: "",

  bank_name: "",
  aba_routing: "",
  doa: "",

  business_type: [],
  processing_services: [],

  terminal: [],
  terminal_special_features: "",
  terminal_type_or_model: "",

  mobile_app: [],
  mobile_app_special_features: "",
  mobile_app_cardreader_type_model: "",

  pos_point_of_sale: [],
  pos_special_features: "",
  system_type_model: "",
  number_of_stations: "",
  pos_other_items: "",

  virtual_terminal: [],
  business_type_other: "",
  location_description: "",
  estimation_early_master_card: "",
  estimated_average_ticket: "",

  // Credit Card Processing Information
  estimated_highest_ticket: "",
  transaction_card_present: "",
  transaction_keyed_in: "",
  transaction_all_online: "",
  auto_settle_time: "",
  auto_settle_type: "auto",
  add_tips_to_account: "no",
  tip_amounts: "",
};

// Add this CSS at the top of the file
const datePickerStyles = `
  input[type="date"]::-webkit-calendar-picker-indicator {
    filter: invert(1);
    opacity: 0.5;
    cursor: pointer;
  }
`;

export default function JotForm() {
  const [formData, setFormData] = useState<FormData>({ ...blankFormData });

  const signatureRef = useRef<SignaturePad>(null);

  const [isValidLink, setIsValidLink] = useState<boolean>(false);
  const [isCheckingLink, setIsCheckingLink] = useState<boolean>(true);
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const data = searchParams.get("data");
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [isReadOnly, setIsReadOnly] = useState<{
    readOnly?: boolean;
    disabled?: boolean;
  }>({});
  // console.log(isReadOnly,'read only');

  useEffect(() => {
    const checkUniqueString = async () => {
      if (!data) {
        setIsValidLink(true);
        setIsCheckingLink(false);
        setIsReadOnly({}); // No readonly/disabled when no URL data
        setFormData({ ...blankFormData });
        return;
      }

      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/jotform-check-unique-string/${data}`
        );
        const responseData = await response.json();
        console.log("hello");
        console.log(responseData, "responsedata");

        if (response.ok) {
          setIsValidLink(true);

          // Store fetched data if available
          if (responseData.data && Object.keys(responseData.data).length > 0) {
            console.log("Form data before setting:", responseData.data);
            // Ensure arrays are properly handled
            const formattedData = {
              ...responseData.data,
              business_profile_business_type: Array.isArray(
                responseData.data.business_profile_business_type
              )
                ? responseData.data.business_profile_business_type
                : [],
              business_type: Array.isArray(responseData.data.business_type)
                ? responseData.data.business_type
                : [],
              processing_services: Array.isArray(
                responseData.data.processing_services
              )
                ? responseData.data.processing_services
                : [],
              terminal: Array.isArray(responseData.data.terminal)
                ? responseData.data.terminal
                : [],
              mobile_app: Array.isArray(responseData.data.mobile_app)
                ? responseData.data.mobile_app
                : [],
              pos_point_of_sale: Array.isArray(
                responseData.data.pos_point_of_sale
              )
                ? responseData.data.pos_point_of_sale
                : [],
              virtual_terminal: Array.isArray(
                responseData.data.virtual_terminal
              )
                ? responseData.data.virtual_terminal
                : [],
            };
            console.log("Formatted form data:", formattedData);
            setFormData((prev) => ({ ...prev, ...formattedData }));
            setIsReadOnly({ readOnly: true, disabled: true }); // Set both readonly and disabled
          } else {
            console.log("No data received, setting blank form");
            setFormData({ ...blankFormData });
            setIsReadOnly({}); // No readonly/disabled when no data
          }
        } else {
          setIsValidLink(false);
          setIsReadOnly({}); // No readonly/disabled on error
          toast.error("Invalid or expired upload link");
        }
      } catch (error) {
        console.error("Error checking link:", error);
        setIsValidLink(false);
        setIsReadOnly({}); // No readonly/disabled on error
        toast.error("Failed to validate upload link");
      } finally {
        setIsCheckingLink(false);
      }
    };

    checkUniqueString();
    setIsReadOnly({}); // No readonly/disabled when no URL data
  }, [data]);

  // Add a useEffect to log state changes
  useEffect(() => {
    // console.log('Current readonly state:', isReadOnly);
    // console.log('Current form data:', formData);
  }, [isReadOnly, formData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      const cleanName = name.replace("[]", ""); // Remove [] if present

      setFormData((prev) => {
        const existing = Array.isArray(prev[cleanName as keyof FormData])
          ? (prev[cleanName as keyof FormData] as string[])
          : [];

        if (checked) {
          return {
            ...prev,
            [cleanName]: [...existing, value],
          };
        } else {
          return {
            ...prev,
            [cleanName]: existing.filter((v: string) => v !== value),
          };
        }
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const signaturePad = signatureRef.current;
    const signatureData =
      signaturePad && !signaturePad.isEmpty() ? signaturePad.toDataURL() : "";

    // Reset previous errors
    setErrors({});

    if (!signatureData) {
      toast.error("Please provide a signature");
      return;
    }

    if (!data) {
      toast.error("Invalid form link");
      return;
    }

    const finalFormData = {
      ...formData,
      signature: signatureData,
      unique_string: data,
    };

    // console.log(finalFormData);
    // return false;

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("auth_token");

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/jot-forms`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(finalFormData),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        if (response.status === 422) {
          const validationErrors = responseData.errors || {};
          setErrors(validationErrors);

          // Show toast for each error message
          Object.values(validationErrors).forEach(
            (fieldErrors: string[] | any) => {
              fieldErrors.forEach((msg: string) => toast.error(msg));
            }
          );
        } else {
          toast.error(responseData.message || "Form submission failed");
        }
        return;
      }

      toast.success(responseData.message || "Form submitted successfully!");

      // Reset form on success
      setFormData({ ...blankFormData });
      signaturePad?.clear();

      setTimeout(() => {
        location.reload();
      }, 2000);
    } catch (error: any) {
      console.error("Error submitting form:", error);
      const message = error?.message?.includes("Failed to fetch")
        ? "Network error. Please check your internet connection and try again."
        : error.message || "Failed to submit form. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
    }
  };

  if (isCheckingLink) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <Toaster position="top-right" />
        <div className="bg-zinc-900 rounded-lg shadow-xl p-8 border border-yellow-400/20 text-center max-w-md w-full">
          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Validating Jotfrom link...</p>
        </div>
      </div>
    );
  }

  if (!isValidLink) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
        <Toaster position="top-right" />
        <div className="bg-zinc-900 rounded-lg shadow-xl p-8 border border-yellow-400/20 text-center max-w-md w-full">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">
            Invalid Jotform Link
          </h1>
          <p className="text-gray-400 mb-6">
            This Jotform link is invalid or has expired. Please contact your
            administrator to request a new secure Jotform link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 py-8 px-4 sm:px-6 lg:px-8">
      <style>{datePickerStyles}</style>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 bg-yellow-400 rounded-lg p-6 shadow-lg">
          <div className="flex items-center space-x-3">
            <FileText className="h-10 w-10 text-black" />
            <div>
              <h1 className="text-3xl font-bold text-black">
                Merchant Pre-Application
              </h1>
              <p className="text-black/80 mt-1">Tracer C2 Financial Services</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {Object.keys(isReadOnly).length > 0 && (
            <input type="hidden" name="is_duplicate" value="1" />
          )}

          {/* BUSINESS PROFILE */}
          <fieldset className="border border-gray-300 rounded-lg p-6">
            <legend className="text-lg font-semibold text-gray-800 px-2 text-white">
              BUSINESS PROFILE
            </legend>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white">
                  Doing Business As (DBA)
                </label>
                <input
                  type="text"
                  {...isReadOnly}
                  required
                  onChange={handleInputChange}
                  name="business_dba"
                  value={formData.business_dba}
                  className={`mt-1 block w-full rounded-md shadow-sm ${
                    errors.business_dba ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.business_dba && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.business_dba[0]}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-white">
                  Address
                </label>
                <input
                  type="text"
                  {...isReadOnly}
                  required
                  onChange={handleInputChange}
                  name="dba_address"
                  className={`mt-1 block w-full rounded-md shadow-sm ${
                    errors.dba_address ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.dba_address && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.dba_address[0]}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-white">
                  Street Address
                </label>
                <input
                  type="text"
                  {...isReadOnly}
                  required
                  onChange={handleInputChange}
                  name="dba_street_address"
                  className={`mt-1 block w-full rounded-md shadow-sm ${
                    errors.dba_street_address
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />

                {errors.dba_street_address && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.dba_street_address[0]}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-white">
                  Street Address Line 2
                </label>
                <input
                  type="text"
                  {...isReadOnly}
                  name="business_corporate_address"
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md shadow-sm ${
                    errors.dba_street_address2
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.dba_street_address2 && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.dba_street_address2[0]}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white">
                    City
                  </label>
                  <input
                    type="text"
                    {...isReadOnly}
                    name="business_city"
                    required
                    onChange={handleInputChange}
                    value={formData.business_city}
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.business_city
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.business_city && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.business_city[0]}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-white">
                    State
                  </label>
                  <input
                    type="text"
                    {...isReadOnly}
                    name="business_state"
                    required
                    onChange={handleInputChange}
                    value={formData.business_state}
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.business_state
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.business_state && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.business_state[0]}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-white">
                    ZIP
                  </label>
                  <input
                    type="text"
                    {...isReadOnly}
                    name="business_zip"
                    required
                    onChange={handleInputChange}
                    value={formData.business_zip}
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.business_zip ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.business_zip && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.business_zip[0]}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Business Type
                </label>
                <div className="flex flex-wrap gap-4">
                  {[
                    { value: "llc", label: "LLC" },
                    { value: "corp", label: "Corp" },
                    { value: "non_profit", label: "Non-Profit" },
                    { value: "sole_prop", label: "Sole Prop" },
                    { value: "gov", label: "Gov" },
                    { value: "association", label: "Association/Estate/Trust" },
                    { value: "other", label: "Other" },
                  ].map(({ value, label }) => (
                    <label
                      key={value}
                      className="inline-flex items-center text-white"
                    >
                      <input
                        type="checkbox"
                        {...isReadOnly}
                        onChange={handleInputChange}
                        name="business_profile_business_type"
                        value={value}
                        checked={formData.business_profile_business_type.includes(
                          value
                        )}
                        className="h-4 w-4 mr-2 rounded border-gray-300 text-yellow-400 focus:ring-yellow-400"
                      />
                      {label}
                      {errors.business_profile_business_type && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.business_profile_business_type[0]}
                        </p>
                      )}
                    </label>
                  ))}
                </div>
                {formData.business_profile_business_type.includes("other") && (
                  <div className="mt-4">
                    {/* <label className="block text-sm font-medium text-white">Other</label> */}
                    <input
                      type="text"
                      placeholder="Please type another option here"
                      required
                      name="business_profile_business_type_other"
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md shadow-sm ${
                        errors.business_profile_business_type_other
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                  </div>
                )}
              </div>
            </div>
          </fieldset>

          {/* Corporate Contact */}
          <fieldset className="border border-gray-300 rounded-lg p-6">
            <legend className="text-lg font-semibold text-gray-800 px-2 text-white">
              Corporate Contact Information
            </legend>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white">
                  Address
                </label>
                <input
                  type="text"
                  {...isReadOnly}
                  required
                  onChange={handleInputChange}
                  name="corporate_address"
                  className={`mt-1 block w-full rounded-md shadow-sm ${
                    errors.corporate_address
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.corporate_address && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.corporate_address[0]}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-white">
                  Street Address
                </label>
                <input
                  type="text"
                  {...isReadOnly}
                  required
                  onChange={handleInputChange}
                  name="corporate_street_address1"
                  className={`mt-1 block w-full rounded-md shadow-sm ${
                    errors.corporate_street_address1
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors.corporate_street_address1 && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.corporate_street_address1[0]}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-white">
                  Street Address Line 2
                </label>
                <input
                  type="text"
                  {...isReadOnly}
                  required
                  onChange={handleInputChange}
                  name="corporate_street_address2"
                  className={`mt-1 block w-full rounded-md shadow-sm ${
                    errors.corporate_street_address2
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />

                {errors.corporate_street_address2 && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.corporate_street_address2[0]}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white">
                    City
                  </label>
                  <input
                    type="text"
                    {...isReadOnly}
                    name="corporate_city"
                    required
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.corporate_city
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.corporate_city && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.corporate_city[0]}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-white">
                    State
                  </label>
                  <input
                    type="text"
                    {...isReadOnly}
                    name="corporate_state"
                    required
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.corporate_state
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.corporate_state && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.corporate_state[0]}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-white">
                    ZIP
                  </label>
                  <input
                    type="text"
                    name="corporate_zip"
                    required
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.corporate_zip
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.corporate_zip && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.corporate_zip[0]}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    {...isReadOnly}
                    name="business_contact_name"
                    required
                    onChange={handleInputChange}
                    value={formData.business_contact_name}
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.business_contact_name
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.business_contact_name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.business_contact_name[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white">
                    Contact Email
                  </label>
                  <input
                    type="text"
                    {...isReadOnly}
                    name="business_contact_mail"
                    required
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.business_contact_mail
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />

                  {errors.business_contact_mail && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.business_contact_mail[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white">
                    Location Phone Number
                  </label>
                  <input
                    type="number"
                    {...isReadOnly}
                    name="business_location_phone_number"
                    required
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.business_location_phone_number
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.business_location_phone_number && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.business_location_phone_number[0]}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white">
                    Date Business Started
                  </label>
                  <input
                    type="text"
                    {...isReadOnly}
                    name="business_contact_name"
                    required
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.business_date_started
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.business_date_started && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.business_date_started[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white">
                    Business Website
                  </label>
                  <input
                    type="text"
                    {...isReadOnly}
                    name="business_website"
                    required
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.business_website
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />

                  {errors.business_website && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.business_website[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white">
                    Business Legal Name as appears on tax return
                  </label>
                  <input
                    type="number"
                    {...isReadOnly}
                    name="business_legal_name"
                    required
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.business_legal_name
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.business_legal_name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.business_legal_name[0]}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white">
                    Federal Tax ID
                  </label>
                  <input
                    type="text"
                    {...isReadOnly}
                    name="business_federal_tax_id"
                    required
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.business_federal_tax_id
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.business_federal_tax_id && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.business_federal_tax_id[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white">
                    Products Sold or Services Provided
                  </label>
                  <input
                    type="text"
                    {...isReadOnly}
                    name="business_products_sold"
                    required
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.business_products_sold
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />

                  {errors.business_products_sold && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.business_products_sold[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white">
                    Return Policy
                  </label>
                  <input
                    type="number"
                    {...isReadOnly}
                    name="business_return_policy"
                    required
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.business_return_policy
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.business_return_policy && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.business_return_policy[0]}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </fieldset>

          {/* OWNERSHIP */}

          <fieldset className="border border-gray-300 rounded-lg p-6">
            <legend className="text-lg font-semibold text-gray-800 px-2 text-white">
              Owner / Officer Information
            </legend>

            <OwnerForm />
          </fieldset>

          {/* BANKING INFORMATION */}

          <fieldset className="border border-gray-300 rounded-lg p-6">
            <legend className="text-lg font-semibold text-gray-800 px-2 text-white">
              BANKING INFORMATION
            </legend>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    {...isReadOnly}
                    required
                    name="bank_name"
                    onChange={handleInputChange}
                    value={formData.bank_name}
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.bank_name ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.bank_name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.bank_name[0]}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-white">
                    TransitABARouting Number
                  </label>
                  <input
                    type="text"
                    {...isReadOnly}
                    required
                    name="aba_routing"
                    onChange={handleInputChange}
                    value={formData.aba_routing}
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.aba_routing ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.aba_routing && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.aba_routing[0]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white">
                    Deposit Account Number
                  </label>
                  <input
                    type="text"
                    {...isReadOnly}
                    name="doa"
                    onChange={handleInputChange}
                    value={formData.doa}
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.doa ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.doa && (
                    <p className="text-red-500 text-sm mt-1">{errors.doa[0]}</p>
                  )}
                </div>
              </div>
              <BankingDocs></BankingDocs>
            </div>
          </fieldset>

          {/* BUSINESS TYPE */}

          <fieldset className="border border-gray-300 rounded-lg p-6">
            <legend className="text-lg font-semibold text-white px-2">
              BUSINESS TYPE
            </legend>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Business Type
                </label>
                <div className="flex flex-wrap gap-4">
                  {[
                    { value: "retail", label: "Retail" },
                    { value: "hospitality", label: "Hospitality" },
                    { value: "services", label: "Services" },
                    { value: "b2b", label: "B2B" },
                    { value: "other", label: "Other" },
                  ].map(({ value, label }) => (
                    <label
                      key={value}
                      className="inline-flex items-center text-white"
                    >
                      <input
                        type="radio"
                        name="business_type"
                        value={value}
                        checked={formData.business_type === value}
                        onChange={handleInputChange}
                        className="mr-2 h-4 w-4 border-gray-300 text-yellow-400 focus:ring-yellow-400"
                      />
                      {label}
                    </label>
                  ))}
                </div>

                {errors.business_type && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.business_type[0]}
                  </p>
                )}
              </div>

              {/* Show "Other" input if selected */}
              {formData.business_type === "other" && (
                <div>
                  <input
                    type="text"
                    name="business_type_other"
                    placeholder="Please type another option here"
                    value={formData.business_type_other}
                    onChange={handleInputChange}
                    className={`mt-2 block w-full rounded-md shadow-sm ${
                      errors.business_type_other
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                </div>
              )}
            </div>
          </fieldset>

          {/* PROCESSING SERVICES */}
          <fieldset className="border border-gray-300 rounded-lg p-6">
            <legend className="text-lg font-semibold text-white px-2">
              PROCESSING SERVICES
            </legend>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Processing Services
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {[
                      {
                        value: "traditional_processing",
                        label: "Traditional Processing",
                      },
                      { value: "surcharging", label: "Surcharging" },
                      { value: "qr_code", label: "QR Code" },
                      { value: "check_services", label: "Check Services" },
                      {
                        value: "qb_or_software_integration",
                        label: "QB/Software Integration",
                      },
                      { value: "cash_discounting", label: "Cash Discounting" },
                      {
                        value: "online_ordering",
                        label: "Online Ordering(OLO)",
                      },
                      { value: "gift_cards", label: "Gift Cards" },
                      { value: "invoice_manager", label: "Invoice Manager" },
                    ].map(({ value, label }) => (
                      <label
                        key={value}
                        className="inline-flex items-center text-white"
                      >
                        <input
                          type="radio"
                          {...isReadOnly}
                          name="processing_services"
                          onChange={handleInputChange}
                          value={value}
                          checked={formData.processing_services === value}
                          className="mr-2 h-4 w-4 border-gray-300 text-yellow-400 focus:ring-yellow-400"
                        />
                        {label}
                      </label>
                    ))}
                  </div>

                  {errors.processing_services && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.processing_services[0]}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </fieldset>

          {/* PROCESSING HARDWARE */}

          <fieldset className="border border-gray-300 rounded-lg p-6">
            <legend className="text-lg font-semibold text-gray-800 px-2 text-white">
              PROCESSING HARDWARE
            </legend>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Terminal
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {[
                      { value: "dial", label: "Dial" },
                      { value: "ip", label: "IP" },
                      { value: "wifi", label: "WIFI" },
                      { value: "4g", label: "4G" },
                      { value: "other", label: "Other" },
                    ].map(({ value, label }) => (
                      <label
                        key={value}
                        className="inline-flex items-center text-white"
                      >
                        <input
                          type="radio"
                          {...isReadOnly}
                          name="terminal"
                          onChange={handleInputChange}
                          value={value}
                          checked={formData.terminal === value}
                          className="mr-2 h-4 w-4 border-gray-300 text-yellow-400 focus:ring-yellow-400"
                        />
                        {label}
                      </label>
                    ))}

                    {/* Show input box when "other" is selected */}
                    {formData.terminal === "other" && (
                      <div className="w-full mt-2">
                        <input
                          type="text"
                          placeholder="Please type another option here"
                          name="terminal_other"
                          onChange={handleInputChange}
                          value={formData.terminal_other}
                          className={`block w-full rounded-md shadow-sm ${
                            errors.terminal_other
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {errors.terminal_other && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.terminal_other[0]}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white">
                    Terminal Type/Model
                  </label>
                  <input
                    type="text"
                    {...isReadOnly}
                    required
                    name="terminal_type_or_model"
                    onChange={handleInputChange}
                    value={formData.terminal_type_or_model}
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.terminal_type_or_model
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.terminal_type_or_model && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.terminal_type_or_model[0]}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Mobile App
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {[
                      { value: "ios", label: "IOS" },
                      { value: "android", label: "Android" },
                    ].map(({ value, label }) => (
                      <label
                        key={value}
                        className="inline-flex items-center text-white"
                      >
                        <input
                          type="radio"
                          {...isReadOnly}
                          name="mobile_app"
                          onChange={handleInputChange}
                          value={value}
                          checked={formData.mobile_app === value}
                          className="mr-2 h-4 w-4 border-gray-300 text-yellow-400 focus:ring-yellow-400"
                        />
                        {label}
                      </label>
                    ))}

                    {errors.mobile_app && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.mobile_app[0]}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white">
                      Mobile App Special Features (Optional)
                    </label>
                    <input
                      type="text"
                      {...isReadOnly}
                      name="mobile_app_special_features"
                      onChange={handleInputChange}
                      value={formData.mobile_app_special_features}
                      className={`mt-1 block w-full rounded-md shadow-sm ${
                        errors.mobile_app_special_features
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.mobile_app_special_features && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.mobile_app_special_features[0]}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white">
                      Cardreader Type/Model
                    </label>
                    <input
                      type="text"
                      {...isReadOnly}
                      name="mobile_app_cardreader_type_model"
                      onChange={handleInputChange}
                      value={formData.mobile_app_cardreader_type_model}
                      className={`mt-1 block w-full rounded-md shadow-sm ${
                        errors.mobile_app_cardreader_type_model
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.mobile_app_cardreader_type_model && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.mobile_app_cardreader_type_model[0]}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    POS (Point of Sale) System
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {[
                      { value: "ios", label: "IOS" },
                      { value: "android", label: "Android" },
                      { value: "windows_or_pc", label: "Windows/PC" },
                    ].map(({ value, label }) => (
                      <label
                        key={value}
                        className="inline-flex items-center text-white"
                      >
                        <input
                          type="radio"
                          {...isReadOnly}
                          name="pos_point_of_sale"
                          value={value}
                          onChange={handleInputChange}
                          checked={formData.pos_point_of_sale === value}
                          className="mr-2 h-4 w-4 border-gray-300 text-yellow-400 focus:ring-yellow-400"
                        />
                        {label}
                      </label>
                    ))}

                    {errors.pos_point_of_sale && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.pos_point_of_sale[0]}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white">
                      POS Special Features
                    </label>
                    <input
                      type="text"
                      {...isReadOnly}
                      name="pos_special_features"
                      onChange={handleInputChange}
                      value={formData.pos_special_features}
                      className={`mt-1 block w-full rounded-md shadow-sm ${
                        errors.pos_special_features
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.pos_special_features && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.pos_special_features[0]}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white">
                      System Type Model
                    </label>
                    <input
                      type="text"
                      {...isReadOnly}
                      required
                      name="system_type_model"
                      onChange={handleInputChange}
                      value={formData.system_type_model}
                      className={`mt-1 block w-full rounded-md shadow-sm ${
                        errors.system_type_model
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.system_type_model && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.system_type_model[0]}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white">
                      Number of Stations
                    </label>
                    <input
                      type="text"
                      {...isReadOnly}
                      required
                      name="number_of_stations"
                      onChange={handleInputChange}
                      value={formData.number_of_stations}
                      className={`mt-1 block w-full rounded-md shadow-sm ${
                        errors.number_of_stations
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.number_of_stations && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.number_of_stations[0]}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white">
                      POS other items
                    </label>
                    <input
                      type="text"
                      {...isReadOnly}
                      required
                      name="pos_other_items"
                      onChange={handleInputChange}
                      value={formData.pos_other_items}
                      className={`mt-1 block w-full rounded-md shadow-sm ${
                        errors.pos_other_items
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.pos_other_items && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.pos_other_items[0]}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Virtual Terminal
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {[
                      {
                        value: "test_or_email_link_to_pay",
                        label: "Text/Email Link to Pay",
                      },
                      {
                        value: "hot_button",
                        label: "Hot Button on Web Pay Now/Donate Now",
                      },
                      {
                        value: "cnp_cash_discount",
                        label: "CNP Cash Discount/Surcharge",
                      },
                      {
                        value: "text_notification",
                        label: "Text Notification",
                      },
                    ].map(({ value, label }) => (
                      <label
                        key={value}
                        className="inline-flex items-center text-white"
                      >
                        <input
                          type="radio"
                          {...isReadOnly}
                          name="virtual_terminal"
                          onChange={handleInputChange}
                          value={value}
                          checked={formData.virtual_terminal === value}
                          className="mr-2 h-4 w-4 border-gray-300 text-yellow-400 focus:ring-yellow-400"
                        />
                        {label}
                      </label>
                    ))}

                    {errors.virtual_terminal && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.virtual_terminal[0]}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Location Description
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {[
                      {
                        value: "shopping_center",
                        label: "Shopping center",
                      },
                      {
                        value: "industrial_building",
                        label: "Industrial Building",
                      },
                      {
                        value: "residence",
                        label: "Residence",
                      },
                      {
                        value: "tradeshow",
                        label: "Tradeshow",
                      },
                      {
                        value: "brick_and_mortar",
                        label: "Brick and Mortar",
                      },
                    ].map(({ value, label }) => (
                      <label
                        key={value}
                        className="inline-flex items-center text-white"
                      >
                        <input
                          type="radio"
                          {...isReadOnly}
                          name="location_description"
                          onChange={handleInputChange}
                          value={value}
                          checked={formData.location_description === value}
                          className="mr-2 h-4 w-4 border-gray-300 text-yellow-400 focus:ring-yellow-400"
                        />
                        {label}
                      </label>
                    ))}

                    {errors.location_description && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.location_description[0]}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white">
                      Estimated Yearly VisaMastercardAMEXDiscover
                    </label>
                    <input
                      type="text"
                      name="estimation_early_master_card"
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md shadow-sm ${
                        errors.estimation_early_master_card
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.estimation_early_master_card && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.estimation_early_master_card[0]}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white">
                      Estimated Average Ticket
                    </label>
                    <input
                      type="text"
                      required
                      name="estimated_average_ticket"
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md shadow-sm ${
                        errors.estimated_average_ticket
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {errors.estimated_average_ticket && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.estimated_average_ticket[0]}
                      </p>
                    )}
                  </div>
                  
                
                </div>
              </div>
            </div>
          </fieldset>

          <fieldset className="border border-gray-300 rounded-lg p-6">
            <legend className="text-lg font-semibold text-gray-800 px-2 text-white">
              Signature
            </legend>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="signature_date"
                  className="block text-sm font-medium text-gray-300"
                >
                  Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="signature_date"
                    name="signature_date"
                    value={formData.signature_date}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded bg-gray-700 text-white border border-gray-600 focus:border-yellow-400 focus:ring-yellow-400 px-3 py-2"
                  />
                  <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
                {errors.signature_date && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.signature_date[0]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Signature
                </label>
                <div className="border border-gray-600 rounded bg-gray-700 p-2">
                  <SignaturePad
                    ref={signatureRef}
                    canvasProps={{
                      className: "w-full h-40 bg-white rounded",
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={clearSignature}
                  className="mt-2 px-4 py-2 text-sm text-gray-300 hover:text-white"
                >
                  Clear Signature
                </button>
                {errors.signature && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.signature[0]}
                  </p>
                )}
              </div>
            </div>
          </fieldset>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-8 py-3 bg-yellow-400 text-black rounded-lg font-semibold flex items-center space-x-2
                ${
                  isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-yellow-500"
                }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Submit Form</span>
              )}
            </button>
          </div>
        </form>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
