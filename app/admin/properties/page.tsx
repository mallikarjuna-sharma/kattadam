import { adminListPropertyListings } from "@kattadam/data-layer/server";
import AddPropertyListingForm from "@/components/admin/AddPropertyListingForm";
import { actionDeletePropertyListing } from "@/app/admin/actions";

export default async function PropertiesAdminPage() {
  const listings = await adminListPropertyListings();

  return (
    <div className="flex-1">
      <header className="bg-white border-b border-cement-200 px-4 md:px-6 py-4">
        <h1 className="font-semibold text-lg text-cement-900">Real estate listings</h1>
        <p className="text-xs text-cement-500">Buy and rent listings shown on the customer Real estate page when published.</p>
      </header>
      <div className="p-4 md:p-6 space-y-6">
        <div className="admin-card p-5">
          <h2 className="font-semibold text-sm text-cement-900 mb-3">Add listing</h2>
          <AddPropertyListingForm />
        </div>
        {!listings?.length ? (
          <p className="text-sm text-cement-500 admin-card p-6">No listings yet.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="w-full min-w-[960px]">
              <thead>
                <tr>
                  <th className="admin-th">Title</th>
                  <th className="admin-th">Type</th>
                  <th className="admin-th">Subtype</th>
                  <th className="admin-th">Price</th>
                  <th className="admin-th">District</th>
                  <th className="admin-th">Area</th>
                  <th className="admin-th">Pub</th>
                  <th className="admin-th">Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((p) => (
                  <tr key={p.id}>
                    <td className="admin-td font-medium max-w-[200px]">{p.title}</td>
                    <td className="admin-td text-xs">{p.listingType}</td>
                    <td className="admin-td text-xs">{p.propertySubtype}</td>
                    <td className="admin-td text-xs">₹{p.price.toLocaleString()}</td>
                    <td className="admin-td text-xs">{p.district}</td>
                    <td className="admin-td text-xs">{p.area}</td>
                    <td className="admin-td text-xs">{p.published ? "Yes" : "No"}</td>
                    <td className="admin-td">
                      <form action={actionDeletePropertyListing.bind(null, p.id)}>
                        <button type="submit" className="text-xs text-red-600 hover:underline font-medium">
                          Delete
                        </button>
                      </form>
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
