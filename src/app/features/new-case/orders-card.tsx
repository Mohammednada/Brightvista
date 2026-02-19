import { motion } from "motion/react";
import { User, Calendar, Stethoscope } from "lucide-react";
import type { OrderCardData } from "./types";

// ── Priority badge ──────────────────────────────────────────────────────────

const priorityConfig: Record<OrderCardData["priority"], { label: string; bg: string; text: string }> = {
  urgent: { label: "Urgent", bg: "bg-[#fef2f2]", text: "text-[#D02241]" },
  routine: { label: "Routine", bg: "bg-[#dcfce7]", text: "text-[#099F69]" },
  stat: { label: "STAT", bg: "bg-[#fff7ed]", text: "text-[#ea580c]" },
};

// ── OrdersCard ──────────────────────────────────────────────────────────────

interface OrdersCardProps {
  orders: OrderCardData[];
  onSelect: (order: OrderCardData) => void;
}

export function OrdersCard({ orders, onSelect }: OrdersCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-2"
    >
      {orders.map((order, i) => {
        const badge = priorityConfig[order.priority];

        return (
          <motion.button
            key={order.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.08 * i }}
            onClick={() => onSelect(order)}
            className="w-full text-left bg-card-bg rounded-xl border border-border-default px-4 py-3 cursor-pointer hover:border-brand/30 hover:shadow-md transition-all group"
          >
            {/* Top row — patient name + priority */}
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <User size={14} className="text-text-muted shrink-0" />
                <span className="text-[13px] font-semibold text-text-primary truncate">
                  {order.patientName}
                </span>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${badge.bg} ${badge.text}`}>
                {badge.label}
              </span>
            </div>

            {/* Procedure */}
            <p className="text-[12px] text-text-primary font-medium mb-1">
              {order.procedure}
              <span className="text-text-muted font-normal"> — CPT {order.cptCode}</span>
            </p>

            {/* Meta row */}
            <div className="flex items-center gap-3 text-[11px] text-text-muted">
              <span className="flex items-center gap-1">
                <Stethoscope size={11} />
                {order.physician}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={11} />
                {order.date}
              </span>
              <span>{order.department}</span>
            </div>
          </motion.button>
        );
      })}
    </motion.div>
  );
}
