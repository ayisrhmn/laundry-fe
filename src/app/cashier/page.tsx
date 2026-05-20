import { Construction } from "lucide-react";

export default function CashierPage() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-6 text-center">
      {/* Animated icon */}
      <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-amber-400/10 ring-2 ring-amber-400/30">
        <Construction className="h-12 w-12 animate-pulse text-amber-400" />
        <span className="absolute -right-1 -top-1 flex h-4 w-4">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-60" />
          <span className="relative inline-flex h-4 w-4 rounded-full bg-amber-500" />
        </span>
      </div>

      {/* Heading */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Under Construction</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Halaman kasir sedang dalam pengembangan. Fitur ini akan segera hadir.
        </p>
      </div>

      {/* Decorative badge */}
      <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs font-medium text-amber-400 tracking-widest uppercase">
        Coming Soon
      </span>
    </div>
  );
}
