"use client";

import { useRef, useState, startTransition } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaRegTrashCan } from "react-icons/fa6";
import { deleteAirdropAction } from "@/app/actions/airdrops";

const DeleteAirdropButton = ({ id, name }) => {
  const dialogRef = useRef(null);
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleDelete = () => {
    setIsPending(true);

    startTransition(async () => {
      const result = await deleteAirdropAction(id);

      if (!result?.ok) {
        toast.error(result?.message || "Failed to delete airdrop.");
        setIsPending(false);
        return;
      }

      toast.success(result.message);
      dialogRef.current?.close();
      router.refresh();
      setIsPending(false);
    });
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-ghost btn-sm text-error"
        onClick={() => dialogRef.current?.showModal()}
      >
        <FaRegTrashCan />
        Delete
      </button>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box max-w-md">
          <h3 className="text-lg font-bold">Delete this airdrop?</h3>
          <p className="mt-2 text-sm text-base-content/70">
            This will permanently remove <span className="font-semibold">{name}</span>
            {" "}from your tracker.
          </p>
          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost rounded-full"
              onClick={() => dialogRef.current?.close()}
              disabled={isPending}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-error rounded-full"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default DeleteAirdropButton;
