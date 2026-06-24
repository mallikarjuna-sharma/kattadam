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
  try {
    const res = await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = (await res.json()) as Record<string, unknown>;

    if (!res.ok || data.ok !== true) {
      const errMsg = typeof data.error === "string" ? data.error : "Something went wrong. Please try again.";
      return {
        ok: false,
        error: errMsg,
        code: typeof data.code === "string" ? data.code : undefined,
        detail: typeof data.detail === "string" ? data.detail : undefined,
        hint: typeof data.hint === "string" ? data.hint : undefined,
      };
    }

    const id = typeof data.id === "string" ? data.id : "";
    return { ok: true, id };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, error: `Network error: ${msg}` };
  }
}
