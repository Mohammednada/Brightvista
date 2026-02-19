import { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { useClickOutside } from "@/shared/hooks/use-click-outside";
import { NotificationCard } from "@/app/components/shared/notification-card";
import { managerNotifications } from "@/mock/dashboard";
import { useDashboardAnalytics } from "@/hooks/use-api";

export function NeedsAttention({ onAskAgent }: { onAskAgent?: (text: string) => void }) {
  const { data } = useDashboardAnalytics();
  const notifications = (data.notifications.length > 0 ? data.notifications : managerNotifications) as typeof managerNotifications;
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useClickOutside(sortRef, () => setSortOpen(false));

  return (
    <div className="bg-surface-bg w-full px-6 py-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex flex-col gap-2">
          <p
            className="text-[21px] leading-[32px] text-text-primary font-bold"
          >
            Needs Attention
          </p>
          <p className="text-[14px] leading-[18px] text-text-secondary">
            Here's some issues needing your attention
          </p>
        </div>
        <div className="relative" ref={sortRef}>
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className="bg-surface-dropdown rounded-lg h-[30px] px-2.5 flex items-center gap-1 cursor-pointer hover:bg-surface-hover"
          >
            <span
              className="text-[14px] leading-[18px] text-dropdown-text font-semibold"
            >
              Sort by
            </span>
            <ChevronDown size={16} className="text-dropdown-text" />
          </button>
          {sortOpen && (
            <div className="absolute right-0 top-full mt-1 bg-card-bg border border-border-default rounded-lg shadow-lg z-20 w-[140px]">
              {["Priority", "Date", "Department"].map((option) => (
                <button
                  key={option}
                  onClick={() => setSortOpen(false)}
                  className="w-full text-left px-3 py-1.5 text-[13px] hover:bg-surface-bg text-text-secondary cursor-pointer"
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Cards */}
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <NotificationCard {...notifications[0]} onAskAgent={onAskAgent} />
          <NotificationCard {...notifications[1]} onAskAgent={onAskAgent} />
        </div>
        <div className="flex gap-4">
          {notifications[2] && <NotificationCard {...notifications[2]} onAskAgent={onAskAgent} />}
          {notifications[3] && <NotificationCard {...notifications[3]} onAskAgent={onAskAgent} />}
        </div>
      </div>
    </div>
  );
}
