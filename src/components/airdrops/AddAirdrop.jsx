"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  FaCirclePlus,
  FaTelegram,
  FaTrashCan,
  FaUserGroup,
  FaWandMagicSparkles,
  FaCalendar,
  FaFileLines,
  FaCircleCheck,
} from "react-icons/fa6";
import { LuLink } from "react-icons/lu";
import { analyzeTelegramAirdropAction } from "@/app/actions/airdrops";
import { isSupportedTelegramMessageLink } from "@/lib/telegram";
import { MdCancel, MdLabel } from "react-icons/md";
import InfoMsg from "../alerts/Info";
import { PiListChecksFill } from "react-icons/pi";
import { TbParachute } from "react-icons/tb";

import Link from "next/link";

const createAccount = (id) => ({
  id,
  label: "",
  username: "",
  email: "",
  wallet: "",
});

const ACCOUNT_ANIMATION_MS = 300;

function formatDateInput(value) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

const AddAirdrop = ({ mode, initialData, action }) => {
  const router = useRouter();
  const [name, setName] = useState(initialData?.name ?? "");
  const [link, setLink] = useState(initialData?.link ?? "");
  const [notes, setNotes] = useState(initialData?.notes ?? "");
  const [endDate, setEndDate] = useState(formatDateInput(initialData?.endDate));
  const [expectedPaymentDate, setExpectedPaymentDate] = useState(
    formatDateInput(initialData?.expectedPaymentDate),
  );
  const [expectedTgeDate, setExpectedTgeDate] = useState(
    formatDateInput(initialData?.expectedTgeDate),
  );
  const [multiple, setMultiple] = useState(Boolean(initialData?.multiple));
  const [needsDailyTasks, setNeedsDailyTasks] = useState(
    Boolean(initialData?.needsDailyTasks),
  );
  const [accounts, setAccounts] = useState(
    initialData?.accounts?.length
      ? initialData.accounts
      : [createAccount("account-1")],
  );
  const [isPending, setIsPending] = useState(false);
  const [isAnalyzingTelegram, setIsAnalyzingTelegram] = useState(false);
  const [nextAccountNumber, setNextAccountNumber] = useState(
    (initialData?.accounts?.length || 1) + 1,
  );
  const [enteringAccountIds, setEnteringAccountIds] = useState([]);
  const [removingAccountIds, setRemovingAccountIds] = useState([]);

  const canFetchFromTelegram = isSupportedTelegramMessageLink(link);

  const handleAccountChange = (id, field, value) => {
    setAccounts((current) =>
      current.map((account) =>
        account.id === id ? { ...account, [field]: value } : account,
      ),
    );
  };

  const addAccount = () => {
    const nextId = `account-${nextAccountNumber}`;

    setAccounts((current) => [...current, createAccount(nextId)]);
    setEnteringAccountIds((current) => [...current, nextId]);
    setNextAccountNumber((current) => current + 1);

    window.setTimeout(() => {
      setEnteringAccountIds((current) => current.filter((id) => id !== nextId));
    }, ACCOUNT_ANIMATION_MS);
  };

  const removeAccount = (id) => {
    if (removingAccountIds.includes(id)) return;

    setAccounts((current) => {
      if (current.length === 1) {
        return [createAccount("account-1")];
      }

      setRemovingAccountIds((items) => [...items, id]);

      window.setTimeout(() => {
        setAccounts((items) => items.filter((account) => account.id !== id));
        setRemovingAccountIds((items) => items.filter((item) => item !== id));
        setEnteringAccountIds((items) => items.filter((item) => item !== id));
      }, ACCOUNT_ANIMATION_MS);

      return current;
    });
  };

  const handleMultipleChange = (checked) => {
    setMultiple(checked);
    if (!checked) {
      setAccounts((current) => [current[0] || createAccount("account-1")]);
    }
  };

  const submitAction = async (formData) => {
    setIsPending(true);
    formData.set("accounts", JSON.stringify(accounts));

    startTransition(async () => {
      const result = await action(formData);

      if (!result?.ok) {
        toast.error(result?.message || "Something went wrong.");
        setIsPending(false);
        return;
      }

      toast.success(result.message);
      router.push("/dashboard/airdrops");
      router.refresh();
      setIsPending(false);
    });
  };

  const applyIfEmpty = (currentValue, nextValue, setter) => {
    if (!nextValue) return false;
    if (String(currentValue || "").trim()) return false;
    setter(nextValue);
    return true;
  };

  const applyDailyTasksIfUnset = (currentValue, nextValue, setter) => {
    if (nextValue !== true) return false;
    if (currentValue === true) return false;
    setter(true);
    return true;
  };

  const handleTelegramFetch = () => {
    if (!canFetchFromTelegram || isAnalyzingTelegram) return;

    setIsAnalyzingTelegram(true);

    startTransition(async () => {
      const result = await analyzeTelegramAirdropAction(link);

      if (!result?.ok) {
        toast.error(result?.message || "Telegram autofill failed.");
        setIsAnalyzingTelegram(false);
        return;
      }

      let appliedCount = 0;
      const data = result.data || {};

      if (applyIfEmpty(name, data.name, setName)) appliedCount += 1;
      if (applyIfEmpty(notes, data.notes, setNotes)) appliedCount += 1;
      if (applyIfEmpty(endDate, data.endDate, setEndDate)) appliedCount += 1;
      if (
        applyIfEmpty(
          expectedPaymentDate,
          data.expectedPaymentDate,
          setExpectedPaymentDate,
        )
      )
        appliedCount += 1;
      if (
        applyIfEmpty(expectedTgeDate, data.expectedTgeDate, setExpectedTgeDate)
      )
        appliedCount += 1;
      if (
        applyDailyTasksIfUnset(
          needsDailyTasks,
          data.needsDailyTasks,
          setNeedsDailyTasks,
        )
      )
        appliedCount += 1;

      if (appliedCount > 0) {
        toast.success(
          `${result.message} Applied ${appliedCount} empty field${
            appliedCount === 1 ? "" : "s"
          }.`,
        );
      } else {
        toast(result.message, { icon: "ℹ️" });
      }

      setIsAnalyzingTelegram(false);
    });
  };

  return (
    <form action={submitAction} className="space-y-6">
      <div className="space-y-2 flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          {mode === "create" ? (
            <>
              Add New <span className="text-primary">Airdrop</span>
            </>
          ) : (
            <>
              Update <span className="text-primary">Airdrop</span>
            </>
          )}
        </h2>
        <Link href="/dashboard/airdrops" class="btn btn-primary">
          <TbParachute />
          All Airdrops
        </Link>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 items-end">
          <div>
            <label className="form-control block input-label">
              <MdLabel className="text-primary inline mb-1 mr-1" size={26} />
              Airdrop Name
            </label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="input input-bordered w-full"
              placeholder="Layer3 Season 3"
              required
            />
          </div>

          <div>
            <label className="form-control block input-label">
              <LuLink className="text-primary inline mb-1 mr-2" size={18} />
              Airdrop Post Link (Public)
            </label>
            <div className="join w-full">
              <input
                type="url"
                name="link"
                value={link}
                onChange={(event) => setLink(event.target.value)}
                className="input input-bordered join-item w-full"
                placeholder="https://t.me/channel/123"
                required
              />
              <button
                type="button"
                className="btn btn-info join-item gap-2"
                onClick={handleTelegramFetch}
                disabled={!canFetchFromTelegram || isAnalyzingTelegram}
              >
                {isAnalyzingTelegram ? (
                  <>
                    <span className="loading loading-spinner loading-xs" />
                    Fetching...
                  </>
                ) : (
                  <>
                    <FaWandMagicSparkles size={14} /> Fetch
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FaUserGroup className="text-primary" size={20} />
            <h2 className="text-lg font-semibold">Account Details</h2>
          </div>
          <label className="label cursor-pointer gap-2">
            <input
              type="checkbox"
              name="multiple"
              checked={multiple}
              onChange={(event) => handleMultipleChange(event.target.checked)}
              className="checkbox checkbox-sm checkbox-primary"
            />
            <span className="label-text text-sm font-semibold">
              Multiple accounts
            </span>
          </label>
        </div>

        <div className="space-y-4">
          {accounts.map((account, index) => (
            <div
              key={account.id}
              className={`overflow-hidden transition-all duration-300 ease-out ${
                removingAccountIds.includes(account.id)
                  ? "max-h-0 -translate-y-2 scale-95 opacity-0"
                  : "max-h-128 translate-y-0 scale-100 opacity-100"
              } ${
                enteringAccountIds.includes(account.id)
                  ? "animate-in fade-in slide-in-from-bottom-2 zoom-in-95"
                  : ""
              }`}
            >
              <div className="card border border-base-200 bg-base-100/30 p-6 space-y-3 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">
                    {index === 0 ? <>Main Account</> : <>Account {index + 1}</>}
                  </h3>
                  {multiple && accounts.length > 1 && index !== 0 && (
                    <button
                      type="button"
                      className="btn btn-error btn-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 active:scale-[0.98]"
                      onClick={() => removeAccount(account.id)}
                      disabled={removingAccountIds.includes(account.id)}
                    >
                      <FaTrashCan size={14} />
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="input-label">Label (optional)</label>
                    <input
                      type="text"
                      value={account.label}
                      onChange={(event) =>
                        handleAccountChange(
                          account.id,
                          "label",
                          event.target.value,
                        )
                      }
                      className="input input-bordered input-sm w-full"
                      placeholder="Main wallet"
                    />
                  </div>
                  <div>
                    <label className="form-control">Username (optional)</label>
                    <input
                      type="text"
                      value={account.username}
                      onChange={(event) =>
                        handleAccountChange(
                          account.id,
                          "username",
                          event.target.value,
                        )
                      }
                      className="input input-bordered input-sm w-full"
                      placeholder="@hunter"
                    />
                  </div>
                  <div>
                    <label className="input-label">Email (optional) </label>
                    <input
                      type="email"
                      value={account.email}
                      onChange={(event) =>
                        handleAccountChange(
                          account.id,
                          "email",
                          event.target.value,
                        )
                      }
                      className="input input-bordered input-sm w-full"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="input-label">EVM Wallet (optional)</label>
                    <input
                      type="text"
                      value={account.wallet}
                      onChange={(event) =>
                        handleAccountChange(
                          account.id,
                          "wallet",
                          event.target.value,
                        )
                      }
                      className="input input-bordered input-sm w-full"
                      placeholder="0x..."
                    />
                  </div>
                </div>
                <InfoMsg message="At least one identifier is required" />
              </div>
            </div>
          ))}
        </div>

        {multiple && (
          <button
            type="button"
            className="btn btn-info btn-soft gap-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm active:translate-y-0 active:scale-[0.98]"
            onClick={addAccount}
          >
            <FaCirclePlus size={16} />
            Add Another Account
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FaCalendar className="text-primary" size={18} />
          <h2 className="text-lg font-semibold">Important Dates</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="input-label">End Date </label>
            <input
              type="date"
              name="endDate"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="input-label">Payment Date</label>
            <input
              type="date"
              name="expectedPaymentDate"
              value={expectedPaymentDate}
              onChange={(event) => setExpectedPaymentDate(event.target.value)}
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="input-label">TGE Date</label>
            <input
              type="date"
              name="expectedTgeDate"
              value={expectedTgeDate}
              onChange={(event) => setExpectedTgeDate(event.target.value)}
              className="input input-bordered w-full"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4 grid md:grid-cols-2 gap-4 items-start">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FaFileLines className="text-primary mb-0.5" size={18} />
            <h2 className="text-lg font-semibold">Notes</h2>
          </div>
          <label className="form-control">
            <textarea
              name="notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              className="textarea textarea-bordered input min-h-28 w-full h-fit"
              placeholder="Add any notes about this campaign..."
            />
          </label>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <PiListChecksFill className="text-primary mb-0.5" size={22} />
            <h2 className="text-lg font-semibold">Requirements</h2>
          </div>
          <div className="card bg-base-100/30 border border-base-300 space-y-2 p-3">
            <label className="label cursor-pointer gap-2">
              <input
                type="checkbox"
                name="needsDailyTasks"
                checked={needsDailyTasks}
                onChange={(event) => setNeedsDailyTasks(event.target.checked)}
                className="checkbox checkbox-primary"
              />
              <div>Daily check-in required</div>
            </label>
            <InfoMsg message="Enable this for airdrops with daily tasks or streaks" />
          </div>
        </div>
      </div>

      {initialData?.joinedAt && (
        <div className="p-4 border border-base-300 rounded-lg bg-base-100/50">
          <p className="text-sm text-base-content/70">
            Joined on {new Date(initialData.joinedAt).toLocaleDateString()}
          </p>
        </div>
      )}

      <div className="flex flex-row gap-2 justify-end">
        <button
          type="button"
          className="btn btn-soft flex-1 sm:flex-none"
          onClick={() => router.push("/dashboard/airdrops")}
          disabled={isPending}
        >
          <MdCancel />
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary flex-1 sm:flex-none"
          disabled={isPending}
        >
          <FaCircleCheck />
          {isPending
            ? mode === "create"
              ? "Adding..."
              : "Updating..."
            : mode === "create"
              ? "Add Airdrop"
              : "Update Airdrop"}
        </button>
      </div>
    </form>
  );
};

export default AddAirdrop;
