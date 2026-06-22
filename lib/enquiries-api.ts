/**
 * Client-side Send Enquiry API — POST /api/enquiries
 */

/** Core contract fields required by the backend enquiry route. */
export interface CreateEnquiryPayload {
  customerName: string;
  phone: string;
  message: string;
  /** Human-readable enquiry subject (material name, service, category label, etc.). */
  target: string;
  materialId?: string;
  dealerId?: string;
  /** Optional contact / delivery fields accepted by the API route. */
  altPhone?: string;
  email?: string;
  currentAddress?: string;
  deliveryAddress?: string;
}

export interface CreateEnquirySuccess {
  ok: true;
  id: string;
}

export interface CreateEnquiryFailure {
  ok: false;
  error: string;
  code?: string;
  detail?: string;
  hint?: string;
}

export type CreateEnquiryResponse = CreateEnquirySuccess | CreateEnquiryFailure;

/** Form state shape used by EnquiryModal before mapping to the API payload. */
export interface EnquiryFormValues {
  name: string;
  phone: string;
  altPhone: string;
  email: string;
  currentAddress: string;
  deliveryAddress: string;
  message: string;
}

export interface EnquiryContext {
  target: string;
  dealerId?: string;
  materialId?: string;
}

/** Map modal form + page context to the JSON body sent on submit. */
export function buildCreateEnquiryPayload(
  form: EnquiryFormValues,
  context: EnquiryContext
): CreateEnquiryPayload {
  const payload: CreateEnquiryPayload = {
    customerName: form.name.trim(),
    phone: form.phone,
    message: form.message.trim(),
    target: context.target,
    currentAddress: form.currentAddress.trim(),
    deliveryAddress: form.deliveryAddress.trim(),
  };

  if (form.altPhone) payload.altPhone = form.altPhone;
  if (form.email.trim()) payload.email = form.email.trim();
  if (context.dealerId) payload.dealerId = context.dealerId;
  if (context.materialId) payload.materialId = context.materialId;

  return payload;
}

export async function submitEnquiry(payload: CreateEnquiryPayload): Promise<CreateEnquiryResponse> {
  // POST directly to the provided AWS Lambda endpoint.
  const url =
    "https://3ykaxi3hty6ngrwgf64v5fcdgy0bctgn.lambda-url.ap-south-1.on.aws/";

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // Try to parse JSON response; if parsing fails, return generic error.
    const data = await (async () => {
      try {
        return (await res.json()) as Record<string, unknown>;
      } catch {
        return null;
      }
    })();

    if (!res.ok) {
      const message = data && typeof data.message === "string" ? data.message : "Server error";
      return { ok: false, error: message };
    }

    // Expected lambda response shape: { success: true, messageId: string }
    if (data && data.success === true) {
      const id = typeof data.messageId === "string" ? data.messageId : "";
      return { ok: true, id };
    }

    // If lambda returns success:false or unexpected shape, map to failure
    const errMsg = data && typeof data.message === "string" ? data.message : "Could not send enquiry.";
    return { ok: false, error: errMsg };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, error: `Network error: ${msg}` };
  }
}
