"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaCirclePlus, FaTelegram, FaTrashCan, FaWandMagicSparkles } from "react-icons/fa6";
import { analyzeTelegramAirdropAction } from "@/app/actions/airdrops";
import { isSupportedTelegramMessageLink } from "@/lib/telegram";

const createAccount = (id) => ({
  id,
  label: "",
  username: "",
  email: "",
  wallet: "",
});

function formatDateInput(value) {
  if (!value) {
    return "";
  }

  return new Date(value).toISOString().slice(0, 10);
}

const AirdropForm = ({ mode, initialData, action }) => {
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
    initialData?.accounts?.length ? initialData.accounts : [createAccount("account-1")],
  );
  const [isPending, setIsPending] = useState(false);
  const [isAnalyzingTelegram, setIsAnalyzingTelegram] = useState(false);
  const [nextAccountNumber, setNextAccountNumber] = useState(
    (initialData?.accounts?.length || 1) + 1,
  );

  const canFetchFromTelegram = isSupportedTelegramMessageLink(link);

  const handleAccountChange = (id, field, value) => {
    setAccounts((current) =>
      current.map((account) =>
        account.id === id ? { ...account, [field]: value } : account,
      ),
    );
  };

  const addAccount = () => {
    setAccounts((current) => [
      ...current,
      createAccount(`account-${nextAccountNumber}`),
    ]);
    setNextAccountNumber((current) => current + 1);
  };

  const removeAccount = (id) => {
    setAccounts((current) => {
      if (current.length === 1) {
        return [createAccount("account-1")];
      }

      return current.filter((account) => account.id !== id);
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
    if (!nextValue) {
      return false;
    }

    if (String(currentValue || "").trim()) {
      return false;
    }

    setter(nextValue);
    return true;
  };

  const handleTelegramFetch = () => {
    if (!canFetchFromTelegram || isAnalyzingTelegram) {
      return;
    }

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

      if (applyIfEmpty(name, data.name, setName)) {
        appliedCount += 1;
      }

      if (applyIfEmpty(notes, data.notes, setNotes)) {
        appliedCount += 1;
      }

      if (applyIfEmpty(endDate, data.endDate, setEndDate)) {
        appliedCount += 1;
      }

      if (
        applyIfEmpty(
          expectedPaymentDate,
          data.expectedPaymentDate,
          setExpectedPaymentDate,
        )
      ) {
        appliedCount += 1;
      }

      if (applyIfEmpty(expectedTgeDate, data.expectedTgeDate, setExpectedTgeDate)) {
        appliedCount += 1;
      }

      if (appliedCount > 0) {
        toast.success(
          `${result.message} Applied ${appliedCount} empty field${
            appliedCount === 1 ? "" : "s"
          }.`,
        );
      } else {
        toast(result.message, {
          icon: "ℹ️",
        });
      }

      setIsAnalyzingTelegram(false);
    });
  };

  return (
    <form action={submitAction} className="space-y-8">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="form-control">
          <span className="label-text mb-2 font-semibold">Airdrop name</span>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="input input-bordered w-full"
            placeholder="Layer3 Season 3"
            required
          />
        </label>

        <div className="form-control">
          <span className="label-text mb-2 font-semibold">Airdrop link</span>
          <div className="flex flex-col gap-3">
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
                className="btn btn-outline join-item"
                onClick={handleTelegramFetch}
                disabled={!canFetchFromTelegram || isAnalyzingTelegram}
              >
                {isAnalyzingTelegram ? (
                  <>
                    <span className="loading loading-spinner loading-xs" />
                    Fetching
                  </>
                ) : (
                  <>
                    <FaTelegram />
                    <FaWandMagicSparkles className="text-xs" />
                    Fetch
                  </>
                )}
              </button>
            </div>
            <p className="text-sm text-base-content/65">
              Public Telegram message links are supported for autofill. Private
              Telegram posts are not supported yet.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold">Account identifiers</h2>
            <p className="text-sm text-base-content/65">
              Each row needs at least one of username, email, or EVM wallet.
            </p>
          </div>
          <label className="label cursor-pointer gap-3">
            <span className="label-text font-semibold">Multiple accounts</span>
            <input
              type="checkbox"
              name="multiple"
              checked={multiple}
              onChange={(event) => handleMultipleChange(event.target.checked)}
              className="toggle toggle-primary"
            />
          </label>
        </div>

        <div className="space-y-4">
          {accounts.map((account, index) => (
            <div
              key={account.id}
              className="rounded-2xl border border-base-300 bg-base-200/50 p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="font-semibold">
                  Account {index + 1}
                </h3>
                {multiple ? (
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm text-error"
                    onClick={() => removeAccount(account.id)}
                  >
                    <FaTrashCan />
                    Remove
                  </button>
                ) : null}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="form-control">
                  <span className="label-text mb-2">Label</span>
                  <input
                    type="text"
                    value={account.label}
                    onChange={(event) =>
                      handleAccountChange(account.id, "label", event.target.value)
                    }
                    className="input input-bordered w-full"
                    placeholder="Main wallet"
                  />
                </label>

                <label className="form-control">
                  <span className="label-text mb-2">Username</span>
                  <input
                    type="text"
                    value={account.username}
                    onChange={(event) =>
                      handleAccountChange(account.id, "username", event.target.value)
                    }
                    className="input input-bordered w-full"
                    placeholder="@hunter"
                  />
                </label>

                <label className="form-control">
                  <span className="label-text mb-2">Email</span>
                  <input
                    type="email"
                    value={account.email}
                    onChange={(event) =>
                      handleAccountChange(account.id, "email", event.target.value)
                    }
                    className="input input-bordered w-full"
                    placeholder="you@example.com"
                  />
                </label>

                <label className="form-control">
                  <span className="label-text mb-2">EVM wallet</span>
                  <input
                    type="text"
                    value={account.wallet}
                    onChange={(event) =>
                      handleAccountChange(account.id, "wallet", event.target.value)
                    }
                    className="input input-bordered w-full"
                    placeholder="0x..."
                  />
                </label>
              </div>
            </div>
          ))}
        </div>

        {multiple ? (
          <button
            type="button"
            className="btn btn-outline mt-4 rounded-full"
            onClick={addAccount}
          >
            <FaCirclePlus />
            Add another account
          </button>
        ) : null}
      </div>

      <div className="rounded-3xl border border-base-300 bg-base-100 p-5 shadow-sm">
        <label className="label cursor-pointer justify-start gap-4">
          <input
            type="checkbox"
            name="needsDailyTasks"
            checked={needsDailyTasks}
            onChange={(event) => setNeedsDailyTasks(event.target.checked)}
            className="checkbox checkbox-primary"
          />
          <div>
            <span className="label-text text-base font-semibold">
              Needs daily check-in or tasking
            </span>
            <p className="mt-1 text-sm text-base-content/65">
              Turn this on for airdrops that require daily check-ins, streaks,
              or recurring tasks so they appear in the dashboard reminder area.
            </p>
          </div>
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <label className="form-control">
          <span className="label-text mb-2 font-semibold">End date</span>
          <input
            type="date"
            name="endDate"
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
            className="input input-bordered w-full"
          />
        </label>

        <label className="form-control">
          <span className="label-text mb-2 font-semibold">
            Expected payment date
          </span>
          <input
            type="date"
            name="expectedPaymentDate"
            value={expectedPaymentDate}
            onChange={(event) => setExpectedPaymentDate(event.target.value)}
            className="input input-bordered w-full"
          />
        </label>

        <label className="form-control">
          <span className="label-text mb-2 font-semibold">Expected TGE date</span>
          <input
            type="date"
            name="expectedTgeDate"
            value={expectedTgeDate}
            onChange={(event) => setExpectedTgeDate(event.target.value)}
            className="input input-bordered w-full"
          />
        </label>
      </div>

      <label className="form-control">
        <span className="label-text mb-2 font-semibold">Notes</span>
        <textarea
          name="notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          className="textarea textarea-bordered min-h-32 w-full"
          placeholder="Tasks completed, wallets used, proof links, extra reminders..."
        />
      </label>

      {initialData?.joinedAt ? (
        <div className="rounded-2xl border border-base-300 bg-base-100 px-4 py-3 text-sm text-base-content/70">
          Joined automatically on {new Date(initialData.joinedAt).toLocaleDateString()}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          className="btn btn-primary rounded-full"
          disabled={isPending}
        >
          {isPending
            ? mode === "create"
              ? "Saving..."
              : "Updating..."
            : mode === "create"
              ? "Add airdrop"
              : "Update airdrop"}
        </button>
        <button
          type="button"
          className="btn btn-ghost rounded-full"
          onClick={() => router.push("/dashboard/airdrops")}
          disabled={isPending}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AirdropForm;
