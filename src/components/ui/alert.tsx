import { SuccessIcon } from "@/assets/icons";
import {ErrorIcon} from "@/assets/icons";

interface AlertProps {
  type: "success" | "error";
  title: string;
  message: string;
  onClose?: () => void;
}

const Alert = ({ type, title, message, onClose }: AlertProps) => {
  const isSuccess = type === "success";

  return (
    <div className="flex items-start justify-between rounded-2xl bg-[#111216] p-5 text-white shadow-lg">
      <div className="flex gap-4">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full ${
            isSuccess ? "bg-green-100" : "bg-red-100"
          }`}
        >
          {isSuccess ? (
            <SuccessIcon className="h-5 w-5 text-green-600" />
          ) : (
            <ErrorIcon className="h-5 w-5 text-red-600" />
          )}
        </div>

        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-gray-400">{message}</p>
        </div>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default Alert;