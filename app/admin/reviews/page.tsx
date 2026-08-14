import { adminListReviews } from "@kattadam/data-layer/server";
import { actionSetReviewApproved } from "@/app/admin/actions";

export default async function ReviewsPage() {
  const reviews = await adminListReviews();

  return (
    <div className="flex-1">
      <header className="bg-white border-b border-cement-200 px-4 md:px-6 py-4">
        <h1 className="font-semibold text-lg text-cement-900">Reviews & complaints</h1>
        <p className="text-xs text-cement-500">Moderation · dealer verified / top dealer from Dealers screen</p>
      </header>
      <div className="p-4 md:p-6">
        {!reviews?.length ? (
          <p className="text-sm text-cement-500 admin-card p-6">No reviews yet.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr>
                  <th className="admin-th">Rating</th>
                  <th className="admin-th">Comment</th>
                  <th className="admin-th">Flags</th>
                  <th className="admin-th">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((r) => (
                  <tr key={r.id}>
                    <td className="admin-td font-medium">{r.rating} / 5</td>
                    <td className="admin-td text-cement-600 max-w-md">{r.comment ?? "—"}</td>
                    <td className="admin-td text-xs">
                      {r.complaint ? <span className="text-red-600">Complaint</span> : "—"}
                      {!r.approved && !r.complaint && <span className="text-amber-600"> Pending</span>}
                    </td>
                    <td className="admin-td">
                      <div className="flex gap-1">
                        <form action={actionSetReviewApproved.bind(null, r.id, true)}>
                          <button type="submit" className="text-[10px] px-2 py-1 rounded-lg border border-cement-200">
                            Approve
                          </button>
                        </form>
                        <form action={actionSetReviewApproved.bind(null, r.id, false)}>
                          <button type="submit" className="text-[10px] px-2 py-1 rounded-lg border border-cement-200">
                            Hide
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
