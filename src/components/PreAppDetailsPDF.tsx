import React from "react";
import dayjs from "dayjs";
import {
  FormInput,
  Eye,
  Loader2,
  X,
  Copy,
  CheckCircle,
  ExternalLink,
  Send,
  Copy as Duplicate,
  Trash2,
  Download,
  SpaceIcon,
  FileText,
  Image,
  File,
} from "lucide-react";

export default function PreAppDetailsPDF({ form }: { form: any }) {
  console.log('form',form);
  if (!form) return null;
  const isChecked = (array: string | string[] | undefined, value: string) => {
    if (!array) return false;
    let parsedArray: string[] = [];
    if (typeof array === "string") {
      try {
        const parsed = JSON.parse(array);
        if (Array.isArray(parsed)) {
          parsedArray = parsed;
        } else {
          return false;
        }
      } catch {
        return false;
      }
    } else if (Array.isArray(array)) {
      parsedArray = array;
    } else {
      return false;
    }
    return parsedArray.includes(value);
  };

  // Helper function to check if file is an image
  const isImageFile = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    return ["jpg", "jpeg", "png", "gif"].includes(ext || "");
  };

   // Helper function to get file icon based on extension
  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />;
      case "doc":
      case "docx":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <Image className="h-5 w-5 text-green-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div style={{ width: 800, background: "white", color: "black", padding: 24, fontFamily: 'sans-serif' }}>
      <h2 style={{ fontSize: 24, fontWeight: "bold", color: "#eab308" }}>Pre-Application Details</h2>
      <hr style={{ margin: "12px 0" }} />
      {/* Business Information */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, color: '#eab308', marginBottom: 8 }}>Business Information</h3>
        <div><b>DBA:</b> {form.business_dba || "-"}</div>
        <div><b>Street Address:</b> {form.get_jotform_details?.[0]?.dba_street_address || "-"}</div>
        <div><b>Street Address Line 2:</b> {form.get_jotform_details?.[0]?.dba_street_address2 || "-"}</div>
        <div><b>City:</b> {form.business_city || "-"}</div>
        <div><b>State:</b> {form.business_state || "-"}</div>
        <div><b>ZIP:</b> {form.business_zip || "-"}</div>
        <div><b>Business Type:</b> {Array.isArray(form.business_profile_business_type) ? form.business_profile_business_type.join(', ') : form.business_profile_business_type || "-"}</div>
        <div><b>Shipping Address:</b> {form.is_same_shipping_address === "1" ? "Yes" : form.is_same_shipping_address === "0" ? "No" : "-"}</div>
      </div>
      {/* Corporate Contact Information */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, color: '#eab308', marginBottom: 8 }}>Corporate Contact Information</h3>
        <div><b>Street Address:</b> {form.get_jotform_details?.[0]?.corporate_street_address1 || "-"}</div>
        <div><b>Street Address Line 2:</b> {form.get_jotform_details?.[0]?.corporate_street_address2 || "-"}</div>
        <div><b>City:</b> {form.get_jotform_details?.[0]?.corporate_city || "-"}</div>
        <div><b>State:</b> {form.get_jotform_details?.[0]?.corporate_state || "-"}</div>
        <div><b>ZIP:</b> {form.get_jotform_details?.[0]?.corporate_zip || "-"}</div>
        <div><b>Contact Name:</b> {form.business_contact_name || "-"}</div>
        <div><b>Contact Email:</b> {form.get_jotform_details?.[0]?.business_contact_mail || "-"}</div>
        <div><b>Location Phone Number:</b> {form.get_jotform_details?.[0]?.business_location_phone_number || "-"}</div>
        <div><b>Date Business Started:</b> {form.business_start_date || "-"}</div>
        <div><b>Business Website:</b> {form.get_jotform_details?.[0]?.business_website || "-"}</div>
        <div><b>Business Legal Name as appears on tax return:</b> {form.get_jotform_details?.[0]?.business_legal_name || "-"}</div>
        <div><b>Federal Tax ID:</b> {form.business_tax_id || "-"}</div>
        <div><b>Products Sold or Services Provided:</b> {form.get_jotform_details?.[0]?.business_products_sold || "-"}</div>
        <div><b>Return Policy:</b> {form.get_jotform_details?.[0]?.business_return_policy || "-"}</div>
      </div>
      {/* Owner/Officer Information */}
      {Array.isArray(form.get_jotform_owner_docs) && form.get_jotform_owner_docs.length > 0 && form.get_jotform_owner_docs.map((owner: any, index: number) => (
        <div key={index} style={{ marginBottom: 24, border: '1px solid #eab308', borderRadius: 8, padding: 12 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: '#eab308', marginBottom: 8 }}>Owner / Officer Information {index + 1}</h3>
          <div><b>First Name:</b> {owner.ownership_first_name || "-"}</div>
          <div><b>Last Name:</b> {owner.ownership_last_name || "-"}</div>
          <div><b>Ownership Percent:</b> {owner.ownership_percent ? `${owner.ownership_percent}%` : "-"}</div>
          <div><b>Phone Number:</b> {owner.ownership_phone_number || "-"}</div>
          <div><b>Email:</b> {owner.ownership_email || "-"}</div>
          <div><b>Date of Birth:</b> {owner.ownership_dob || "-"}</div>
          <div><b>Social Security Number:</b> {owner.ownership_social_security_number || "-"}</div>
          <div><b>Driver License Number:</b> {owner.ownership_driver_licence_number || "-"}</div>
          <div><b>Title:</b> {owner.ownership_title || "-"}</div>
        </div>
      ))}
      {/* Credit Card Processing Information */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, color: '#eab308', marginBottom: 8 }}>Credit Card Processing Information</h3>
        <div><b>Card Present Transactions:</b> {form.get_jotform_details?.[0]?.transaction_card_present || "-"}%</div>
        <div><b>Keyed-in Transactions:</b> {form.get_jotform_details?.[0]?.transaction_keyed_in || "-"}%</div>
        <div><b>Online Transactions:</b> {form.get_jotform_details?.[0]?.transaction_all_online || "-"}%</div>
        <div><b>Average Ticket:</b> ${form.get_jotform_details?.[0]?.estimated_average_ticket || "-"}</div>
        <div><b>Highest Ticket:</b> ${form.get_jotform_details?.[0]?.estimated_highest_ticket || "-"}</div>
        <div><b>Early Mastercard:</b> {form.get_jotform_details?.[0]?.estimation_early_master_card || "-"}</div>
        <div><b>Auto Settle / Batch time:</b> {form.get_jotform_details?.[0]?.auto_settle_time || "-"}</div>
        <div><b>I do not need Auto Settle:</b> {form.get_jotform_details?.[0]?.auto_settle_type || "-"}</div>
        <div><b>Add Tips to my account:</b> {form.get_jotform_details?.[0]?.add_tips_to_account || "-"}</div>
        <div><b>Tip Amounts:</b> {(() => { try { return JSON.parse(form.get_jotform_details?.[0]?.tip_amounts || "[]").join(', '); } catch { return "-"; } })()}</div>
      </div>
      {/* Details Section */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, color: '#eab308', marginBottom: 8 }}>Details</h3>
        <div><b>Business Type:</b> {form.business_type || "-"}</div>
        <div><b>Processing Services:</b> {form.processing_services || "-"}</div>
        <div><b>Terminal:</b> {form.terminal || "-"}</div>
        <div><b>Terminal Type/Model:</b> {form.terminal_type_or_model || "-"}</div>
        <div><b>Mobile App:</b> {form.mobile_app || "-"}</div>
        <div><b>Mobile App Special Features:</b> {form.mobile_app_special_features || "-"}</div>
        <div><b>Cardreader Type/Model:</b> {form.mobile_app_cardreader_type_model || "-"}</div>
        <div><b>POS (Point of Sale) System:</b> {form.pos_point_of_sale || "-"}</div>
        <div><b>POS Special Features:</b> {form.pos_special_features || "-"}</div>
        <div><b>System Type Model:</b> {form.system_type_model || "-"}</div>
        <div><b>Number of Stations:</b> {form.number_of_stations || "-"}</div>
        <div><b>POS other items:</b> {form.pos_other_items || "-"}</div>
        <div><b>Virtual Terminal:</b> {form.virtual_terminal || "-"}</div>
        <div><b>Location Description:</b> {form.get_jotform_details?.[0]?.location_description || "-"}</div>
      </div>
      {/* Documents Section */}
      {form.get_jotform_docs && form.get_jotform_docs.length > 0 && (
        <div style={{ marginTop: 16, marginBottom: 24 }}>
          <b>Business Documents:</b>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 8 }}>
            {form.get_jotform_docs.map((doc: any) => (
              <div key={doc.id} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                {/* <img
                  src={`${import.meta.env.VITE_IMAGE_URL}${doc.file_path}`}
                  alt={doc.file_original_name}
                  style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, marginBottom: 4 }}
                /> */}

                {isImageFile(doc.file_original_name) ? (
                  <img
                    src={`${import.meta.env.VITE_IMAGE_URL}${
                      doc.file_path
                    }`}
                    alt={doc.file_original_name}
                    className="h-12 w-12 object-cover rounded"
                  />
                ) : (
                  getFileIcon(doc.file_original_name)
                )}

                <span style={{ fontSize: 12 }}>{doc.file_original_name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Signature Section */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, color: '#eab308', marginBottom: 8 }}>Signature</h3>
        <div><b>Date:</b> {form.signature_date || "-"}</div>
        <div><b>Signature:</b> {form.signature ? <img src={form.signature} alt="Signature" style={{ maxWidth: 200, maxHeight: 80, display: 'block', marginTop: 8, border: '1px solid #ccc', borderRadius: 4 }} /> : <span>-</span>}</div>
      </div>
    </div>
  );
} 