import { NotificationCard } from "@/app/components/shared/notification-card";
import { coordinatorNotifications } from "@/mock/coordinator";

export function CoordinatorNeedsAttention({ onAskAgent }: { onAskAgent?: (text: string) => void }) {
  return (
    <div className="bg-surface-bg w-full px-6 py-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex flex-col gap-2">
          <p className="text-[21px] leading-[32px] text-text-primary font-bold">
            My Action Items
          </p>
          <p className="text-[14px] leading-[18px] text-text-secondary">
            Tasks requiring your immediate action
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <NotificationCard {...coordinatorNotifications[0]} onAskAgent={onAskAgent} />
          <NotificationCard {...coordinatorNotifications[1]} onAskAgent={onAskAgent} />
        </div>
        <div className="flex gap-4">
          <NotificationCard {...coordinatorNotifications[2]} onAskAgent={onAskAgent} />
          <NotificationCard {...coordinatorNotifications[3]} onAskAgent={onAskAgent} />
        </div>
      </div>
    </div>
  );
}
