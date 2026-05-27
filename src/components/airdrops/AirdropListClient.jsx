"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  FaArrowUpRightFromSquare,
  FaBolt,
  FaCalendarDays,
  FaCoins,
  FaPenToSquare,
  FaPlus,
  FaUserGroup,
} from "react-icons/fa6";
import DeleteAirdropButton from "@/components/airdrops/DeleteAirdropButton";
import Pagination from "@/components/airdrops/Pagination";
import AirdropSearch from "@/components/airdrops/AirdropSearch";
import InfoMsg from "../alerts/Info";
import { formatDate, formatRelativeWindow } from "@/lib/formatters";
import Loading from "../utilities/Loading";

const SEARCH_DEBOUNCE_MS = 350;

function summarizeAccounts(accounts) {
  return accounts
    .map(
      (account) =>
        account.label || account.username || account.email || account.wallet,
    )
    .filter(Boolean)
    .slice(0, 4);
}

function getImportantDates(item) {
  return [
    { key: "payment", label: "Payment", value: item.expectedPaymentDate },
    { key: "tge", label: "TGE", value: item.expectedTgeDate },
    { key: "end", label: "End", value: item.endDate },
  ];
}

function getNextMilestone(item) {
  const now = Date.now();
  const dates = getImportantDates(item)
    .filter((entry) => entry.value)
    .map((entry) => ({
      ...entry,
      timestamp: new Date(entry.value).getTime(),
    }))
    .filter((entry) => !Number.isNaN(entry.timestamp) && entry.timestamp >= now)
    .sort((a, b) => a.timestamp - b.timestamp);

  return dates[0] ?? null;
}

const AirdropListClient = ({ items, pagination }) => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [results, setResults] = useState(items);
  const [pager, setPager] = useState(pagination);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timerId);
  }, [search]);

  useEffect(() => {
    let ignore = false;

    async function loadAirdrops(page = 1) {
      setIsLoading(true);
      try {
        const query = new URLSearchParams({
          page: String(page),
          search: debouncedSearch,
        });
        const response = await fetch(`/api/airdrops?${query.toString()}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const payload = await response.json();
        if (!ignore) {
          setResults(payload.items || []);
          setPager(payload.pagination || pagination);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadAirdrops(1);
    return () => {
      ignore = true;
    };
  }, [debouncedSearch, pagination]);

  const visibleItems = useMemo(() => results, [results]);

  const handleSearchPageChange = async (nextPage) => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams({
        page: String(nextPage),
        search: debouncedSearch,
      });
      const response = await fetch(`/api/airdrops?${query.toString()}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        return;
      }

      const payload = await response.json();
      setResults(payload.items || []);
      setPager(payload.pagination || pagination);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 items-center">
        <h1 className="text-3xl font-black tracking-tight order-1">
          <span className="text-primary">Airdrops</span> List
        </h1>

        <div className="order-3 col-span-full lg:place-self-center lg:col-span-1 w-full lg:order-2">
          <AirdropSearch value={search} onChange={setSearch} />
        </div>
        <div className="order-2 lg:order-3 place-self-end">
          <Link href="/dashboard/airdrops/add" className="btn btn-primary">
            <FaPlus />
            Add airdrop
          </Link>
        </div>
      </div>

      {isLoading ? <Loading /> : null}

      {visibleItems.length ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {visibleItems.map((item) => {
            const accountSummary = summarizeAccounts(item.accounts);
            const nextMilestone = getNextMilestone(item);
            const importantDates = getImportantDates(item);

            return (
              <article
                key={item._id}
                className="card border border-base-300 bg-base-200/30 backdrop-blur-sm shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="card-body gap-2 p-4 sm:p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-bold tracking-tight">
                          {item.name}
                        </h2>
                        {item.multiple ? (
                          <span className="badge badge-outline badge-primary badge-sm">
                            Multiple
                          </span>
                        ) : null}
                        {item.needsDailyTasks ? (
                          <span className="badge badge-warning badge-sm gap-1.5">
                            <FaBolt className="text-[10px]" />
                            Daily
                          </span>
                        ) : null}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-base-content/60">
                        <span>Joined {formatDate(item.joinedAt)}</span>
                        <span className="hidden h-1 w-1 rounded-full bg-base-content/30 sm:inline-block" />
                        <span>
                          {item.accounts?.length || 0} account
                          {item.accounts?.length === 1 ? "" : "s"}
                        </span>
                      </div>
                    </div>

                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-soft btn-sm"
                    >
                      <FaArrowUpRightFromSquare />
                      Open post
                    </a>
                  </div>

                  <div className="grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="rounded-2xl border border-primary/15 bg-primary/8 p-3.5">
                      <div className="mb-2 flex items-center gap-2">
                        <FaUserGroup className="text-primary" size={14} />
                        <h3 className="text-sm font-semibold">
                          Accounts & identity
                        </h3>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {accountSummary.length ? (
                          accountSummary.map((account) => (
                            <span
                              key={`${item._id}-${account}`}
                              className="badge badge-sm badge-primary"
                            >
                              {account}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-base-content/60">
                            No identifiers saved
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-primary/15 bg-primary/8 p-3.5">
                      <div className="mb-2 flex items-center gap-2">
                        <FaCalendarDays className="text-primary" size={14} />
                        <h3 className="text-sm font-semibold">
                          Next milestone
                        </h3>
                      </div>

                      {nextMilestone ? (
                        <div className="space-y-1">
                          <p className="text-[11px] uppercase tracking-[0.2em] text-base-content/50">
                            {nextMilestone.label}
                          </p>
                          <p className="text-base font-bold">
                            {formatDate(nextMilestone.value)}
                          </p>
                          <p className="text-xs text-primary">
                            {formatRelativeWindow(nextMilestone.value)}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <p className="text-xs text-base-content/60">
                            No upcoming milestone
                          </p>
                          <p className="text-xs text-base-content/50">
                            Add payment, TGE, or end dates to show the next
                            event.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FaCalendarDays className="text-primary" size={14} />
                      <h3 className="text-sm font-semibold">Key dates</h3>
                    </div>

                    <div className="grid gap-2.5 sm:grid-cols-3">
                      {importantDates.map((entry) => (
                        <div
                          key={`${item._id}-${entry.key}`}
                          className="rounded-2xl border border-base-300 bg-base-300 p-3"
                        >
                          <p className="text-[11px] uppercase tracking-[0.2em] text-base-content/50">
                            {entry.label}
                          </p>
                          <p className="mt-1.5 text-sm font-semibold">
                            {formatDate(entry.value)}
                          </p>
                          <p className="mt-1 text-xs text-base-content/60">
                            {formatRelativeWindow(entry.value)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 border-t border-base-content/50 pt-2 -mb-2 sm:flex-row items-center sm:justify-between mt-2">
                    <InfoMsg
                      message={
                        item.needsDailyTasks
                          ? "This campaign needs daily attention."
                          : "No daily task requirement tracked."
                      }
                      sm={true}
                    />
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/dashboard/airdrops/update/${item._id}`}
                        className="btn btn-info btn-soft btn-sm"
                      >
                        <FaPenToSquare />
                        Update
                      </Link>
                      <DeleteAirdropButton id={item._id} name={item.name} />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="card border border-base-200 bg-base-100/70 shadow-sm">
          <div className="card-body items-center gap-4 py-14 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/12 text-primary">
              <FaCoins size={24} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">No matching airdrops found</h2>
              <p className="max-w-xl text-sm leading-6 text-base-content/65">
                Try a different keyword for &quot;{debouncedSearch}&quot; or
                clear the search to see all campaigns.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSearch("")}
              className="btn btn-soft rounded-full"
            >
              Clear search
            </button>
          </div>
        </div>
      )}

      <Pagination
        page={pager.page}
        totalPages={pager.totalPages}
        onPageChange={handleSearchPageChange}
        isLoading={isLoading}
      />
    </section>
  );
};

export default AirdropListClient;
