import { toast } from "react-toastify";

export const confirmDelete = (onConfirm: () => void) => {
  toast(
    ({ closeToast }) => (
      <div>
        <p className="font-medium text-gray-800 mb-3">
          Are you sure you want to delete this employee?
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => {
              closeToast();
              onConfirm();
            }}
            className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm"
          >
            Delete
          </button>
          <button
            onClick={closeToast}
            className="px-3 py-1.5 bg-gray-200 text-gray-800 rounded-lg text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    ),
    {
      autoClose: false,
      closeOnClick: false,
      closeButton: false,
    }
  );
};
