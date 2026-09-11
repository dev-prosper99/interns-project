export default function Loader() {
      return (
            <div className="flex min-h-dvh items-center justify-center bg-neutral-925" role="status" aria-label="Loading">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-600/25 border-t-orange-600" />
            </div>
      );
}
