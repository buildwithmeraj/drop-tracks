import Link from "next/link";
import { redirect } from "next/navigation";
import {
  FaArrowUpRightFromSquare,
  FaBolt,
  FaPenToSquare,
  FaPlus,
} from "react-icons/fa6";
import { auth } from "@/auth";
import { buildLoginRedirect } from "@/lib/auth-redirect";
import DeleteAirdropButton from "@/components/airdrops/DeleteAirdropButton";
import Pagination from "@/components/airdrops/Pagination";
import { formatDate } from "@/lib/formatters";
import { listAirdropsByUser } from "@/lib/airdrops";

export const metadata = {
  title: "Airdrops",
  description: "Track, review, edit, and organize all saved airdrop campaigns.",
};

function summarizeAccounts(accounts) {
  return accounts
    .map(
      (account) =>
        account.username || account.email || account.wallet || account.label,
    )
    .filter(Boolean)
    .slice(0, 3);
}

export default async function AirdropsList({ searchParams }) {
  const session = await auth();

  if (!session?.user) {
    redirect(buildLoginRedirect("/dashboard/airdrops"));
  }

  const params = await searchParams;
  const page = Number(params?.page) || 1;
  const { items, pagination } = await listAirdropsByUser(session.user.id, page);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Airdrops</h2>
        <Link
          href="/dashboard/airdrops/add"
          className="btn btn-primary rounded-full"
        >
          <FaPlus />
          Add airdrop
        </Link>
      </div>

      <div className="overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Airdrop</th>
                <th>Identifiers</th>
                <th>Daily tasks</th>
                <th>Key dates</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length ? (
                items.map((item) => {
                  const accountSummary = summarizeAccounts(item.accounts);

                  return (
                    <tr key={item._id}>
                      <td className="min-w-56">
                        <div className="space-y-1">
                          <p className="font-semibold">{item.name}</p>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-base-content/60">
                            <span>Joined {formatDate(item.joinedAt)}</span>
                            {item.multiple ? (
                              <span className="badge badge-outline badge-sm">
                                Multiple
                              </span>
                            ) : null}
                          </div>
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-primary"
                          >
                            Open link
                            <FaArrowUpRightFromSquare className="text-xs" />
                          </a>
                        </div>
                      </td>
                      <td className="min-w-52">
                        <div className="flex flex-wrap gap-2">
                          {accountSummary.length ? (
                            accountSummary.map((account) => (
                              <span
                                key={`${item._id}-${account}`}
                                className="badge badge-neutral badge-outline"
                              >
                                {account}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-base-content/60">
                              No identifiers
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="min-w-40">
                        {item.needsDailyTasks ? (
                          <span className="badge badge-warning gap-2">
                            <FaBolt className="text-xs" />
                            Daily check-in
                          </span>
                        ) : (
                          <span className="text-sm text-base-content/60">
                            No
                          </span>
                        )}
                      </td>
                      <td className="min-w-52">
                        <div className="space-y-1 text-sm">
                          <p>Payment: {formatDate(item.expectedPaymentDate)}</p>
                          <p>TGE: {formatDate(item.expectedTgeDate)}</p>
                          <p>End: {formatDate(item.endDate)}</p>
                        </div>
                      </td>
                      <td>
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/dashboard/airdrops/update/${item._id}`}
                            className="btn btn-ghost btn-sm"
                          >
                            <FaPenToSquare />
                            Update
                          </Link>
                          <DeleteAirdropButton id={item._id} name={item.name} />
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="py-12 text-center">
                    <div className="space-y-3">
                      <p className="text-lg font-semibold">
                        No airdrops tracked yet
                      </p>
                      <p className="text-sm text-base-content/65">
                        Add your first campaign to start tracking accounts,
                        expected payouts, and TGE dates.
                      </p>
                      <Link
                        href="/dashboard/airdrops/add"
                        className="btn btn-primary rounded-full"
                      >
                        <FaPlus />
                        Add first airdrop
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination page={pagination.page} totalPages={pagination.totalPages} />
    </section>
  );
}
