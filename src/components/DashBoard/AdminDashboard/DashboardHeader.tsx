import { NotificationIcon, HambugerIcon } from '@/assets/icons';

type Props = {
  onMenuClick?: () => void;
};

const DashboardHeader = ({ onMenuClick }: Props) => {
  return (
    <div className="w-full h-26 bg-neutral-1000 flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <button
          className="lg:hidden p-2 rounded-md hover:bg-white/5"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <HambugerIcon />
        </button>

        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
      </div>

      <div className="flex items-center justify-center p-2 rounded-lg hover:bg-white/5 cursor-pointer relative">
        <NotificationIcon />
        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          2
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
