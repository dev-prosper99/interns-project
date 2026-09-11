import Sidebar from "./Sidebar";

type ResponsiveAdminSidebarProps = {
      isOpen: boolean;
      onClose: () => void;
};

export default function ResponsiveAdminSidebar({ isOpen, onClose }: ResponsiveAdminSidebarProps) {
      return (
            <>
                  <div className="hidden lg:block">
                        <Sidebar />
                  </div>

                  {isOpen && (
                        <>
                              <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />
                              <div className="fixed inset-y-0 left-0 z-50 w-[min(21rem,88vw)] lg:hidden">
                                    <Sidebar onClose={onClose} />
                              </div>
                        </>
                  )}
            </>
      );
}
