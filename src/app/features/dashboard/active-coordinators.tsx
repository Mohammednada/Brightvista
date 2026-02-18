import { useState, useRef, useEffect, useCallback } from "react";
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { coordinators, coordinatorColorLabels } from "@/mock/dashboard";

const stickyIdWidth = 72;
const stickyNameWidth = 160;

function StickyIdCell({
  children,
  bg,
  className = "",
}: {
  children: React.ReactNode;
  bg: string;
  className?: string;
}) {
  return (
    <div
      className={`w-[${stickyIdWidth}px] shrink-0 sticky left-0 z-10 ${className}`}
      style={{
        width: stickyIdWidth,
        minWidth: stickyIdWidth,
        backgroundColor: bg,
      }}
    >
      {children}
    </div>
  );
}

function StickyNameCell({
  children,
  bg,
  showShadow,
  className = "",
}: {
  children: React.ReactNode;
  bg: string;
  showShadow: boolean;
  className?: string;
}) {
  return (
    <div
      className={`w-[${stickyNameWidth}px] shrink-0 sticky z-10 ${className}`}
      style={{
        width: stickyNameWidth,
        minWidth: stickyNameWidth,
        left: stickyIdWidth,
        backgroundColor: bg,
        boxShadow: showShadow
          ? "4px 0 8px -2px rgba(0,0,0,0.08)"
          : "none",
        transition: "box-shadow 0.2s ease",
      }}
    >
      {children}
    </div>
  );
}

export function ActiveCoordinators() {
  const [currentPage, setCurrentPage] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 2);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    const observer = new ResizeObserver(checkScroll);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      observer.disconnect();
    };
  }, [checkScroll]);

  return (
    <div className="w-full px-6 py-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <p
          className="text-[21px] leading-[32px] text-text-primary font-bold"
        >
          Active Coordinators
        </p>
        <button className="bg-surface-dropdown rounded-lg h-[30px] px-2.5 flex items-center gap-1 cursor-pointer hover:bg-[#dde8ed]">
          <span
            className="text-[14px] leading-[18px] text-[#111417] font-semibold"
          >
            Manage Access
          </span>
          <ExternalLink size={16} className="text-[#111417]" />
        </button>
      </div>

      {/* Scrollable Table */}
      <div className="relative w-full">
        {/* Right scroll shadow */}
        <div
          className="pointer-events-none absolute top-0 right-0 bottom-0 w-8 z-20 transition-opacity duration-200"
          style={{
            opacity: canScrollRight ? 1 : 0,
            background:
              "linear-gradient(to left, rgba(255,255,255,0.95), transparent)",
          }}
        />

        <div
          ref={scrollRef}
          className="w-full overflow-x-auto"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#c4cdd5 transparent",
          }}
        >
          <div style={{ minWidth: 640 }}>
            {/* Table Header */}
            <div className="bg-surface-bg rounded-t-lg py-2">
              <div className="flex items-center">
                <StickyIdCell bg="#f7fafc" className="pl-4">
                  <span
                    className="text-[14px] leading-[18px] text-text-primary font-medium"
                  >
                    ID no.
                  </span>
                </StickyIdCell>
                <StickyNameCell
                  bg="#f7fafc"
                  showShadow={canScrollLeft}
                >
                  <span
                    className="text-[14px] leading-[18px] text-text-primary font-medium"
                  >
                    Name
                  </span>
                </StickyNameCell>
                <div className="w-[100px] shrink-0 pl-2">
                  <span
                    className="text-[14px] leading-[18px] text-text-primary font-medium"
                  >
                    Specialty
                  </span>
                </div>
                <div className="w-[110px] shrink-0 px-3">
                  <span
                    className="text-[14px] leading-[18px] text-text-primary font-medium"
                  >
                    Cases
                  </span>
                </div>
                <div className="w-[86px] shrink-0 text-right whitespace-nowrap">
                  <span
                    className="text-[14px] leading-[18px] text-text-primary font-medium"
                  >
                    System Access
                  </span>
                </div>
                <div className="flex-1 text-right px-2 pr-4">
                  <span
                    className="text-[14px] leading-[18px] text-text-primary font-medium"
                  >
                    Activity tracking
                  </span>
                </div>
              </div>
            </div>

            {/* Table Rows */}
            {coordinators.map((coord, index) => (
              <div key={coord.id} className="group/row">
                <div className="flex items-center py-1 transition-colors group-hover/row:bg-[#fafbfc]">
                  {/* ID - Sticky */}
                  <StickyIdCell
                    bg="white"
                    className="pl-4 pr-2 group-hover/row:!bg-[#fafbfc] transition-colors"
                  >
                    <span className="text-[14px] leading-[22px] text-text-secondary">
                      {coord.id}
                    </span>
                  </StickyIdCell>
                  {/* Name - Sticky */}
                  <StickyNameCell
                    bg="white"
                    showShadow={canScrollLeft}
                    className="flex flex-col gap-0.5 py-0.5 group-hover/row:!bg-[#fafbfc] transition-colors"
                  >
                    <span
                      className="text-[14px] leading-[18px] text-[#3385f0] cursor-pointer hover:underline font-medium"
                    >
                      {coord.name}
                    </span>
                    <span className="text-[12px] leading-[18px] text-text-secondary">
                      {coord.joinDate}
                    </span>
                  </StickyNameCell>
                  {/* Specialty */}
                  <div className="w-[100px] shrink-0 pl-2">
                    <span className="text-[14px] leading-[22px] text-text-primary">
                      {coord.specialty}
                    </span>
                  </div>
                  {/* Cases */}
                  <div className="w-[110px] shrink-0 px-3 flex flex-col gap-1 relative">
                    <span
                      className="text-[12px] leading-[14px] tracking-[1px] uppercase font-bold"
                      style={{ color: coord.casesColor }}
                    >
                      {coord.cases}
                    </span>
                    <div className="flex items-center rounded-lg overflow-visible bg-surface-bg border border-white h-2">
                      {(() => {
                        const totalWidth = coord.caseBar.reduce(
                          (sum, b) => sum + b.width,
                          0
                        );
                        return coord.caseBar.map((bar, i) => {
                          const count = Math.max(
                            1,
                            Math.round(
                              (bar.width / totalWidth) * coord.cases
                            )
                          );
                          const label =
                            coordinatorColorLabels[bar.color] || "Other";
                          return (
                            <div
                              key={i}
                              className="h-full border border-[#f7fafc] relative group/segment cursor-pointer transition-opacity hover:opacity-80"
                              style={{
                                backgroundColor: bar.color,
                                width: `${bar.width}px`,
                              }}
                            >
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/segment:flex flex-col items-center z-50 pointer-events-none">
                                <div className="bg-[#1b2124] text-white rounded-md px-2.5 py-1.5 whitespace-nowrap shadow-lg flex items-center gap-1.5">
                                  <div
                                    className="w-2 h-2 rounded-sm shrink-0"
                                    style={{
                                      backgroundColor: bar.color,
                                    }}
                                  />
                                  <span
                                    className="text-[11px] leading-[14px] font-semibold"
                                  >
                                    {label}
                                  </span>
                                  <span className="text-[11px] leading-[14px] text-[#9caeb8]">
                                    {count}
                                  </span>
                                </div>
                                <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-[#1b2124]" />
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>
                  {/* System Access */}
                  <div className="w-[86px] shrink-0 flex justify-end">
                    <span
                      className="inline-flex items-center px-1 py-0.5 rounded-full border border-[rgba(9,159,105,0.48)] text-[12px] leading-[14px] text-[#099f69] font-medium"
                    >
                      {coord.systemAccess}
                    </span>
                  </div>
                  {/* Activity */}
                  <div className="flex-1 flex items-center justify-end gap-2 px-2 pr-4">
                    <div className="flex items-end gap-[2px] h-[22px]">
                      {coord.activityBars.map((h, i) => (
                        <div
                          key={i}
                          className="w-[4px] rounded-full bg-[rgba(0,174,239,0.3)]"
                          style={{ height: `${h}px` }}
                        />
                      ))}
                    </div>
                    <span
                      className="text-[14px] leading-[22px] text-text-secondary font-bold"
                    >
                      {coord.activityPercent}
                    </span>
                  </div>
                </div>
                {index < coordinators.length - 1 && (
                  <div className="h-px bg-border-default mx-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer - always visible outside scroll */}
      <div className="bg-surface-bg rounded-b-lg flex items-center justify-between px-4 py-2">
        <span
          className="text-[12px] leading-[18px] text-text-secondary font-bold"
        >
          5 out of 52
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            className="flex items-center gap-1 h-[30px] px-1.5 rounded cursor-pointer hover:bg-[#e4e8eb]"
          >
            <ChevronLeft size={16} className="text-[#9caeb8]" />
            <span
              className="text-[14px] leading-[18px] text-[#9caeb8] font-semibold"
            >
              Previous
            </span>
          </button>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            className="flex items-center gap-1 h-[30px] px-1.5 rounded cursor-pointer hover:bg-[#e4e8eb]"
          >
            <span
              className="text-[14px] leading-[18px] text-[#3385f0] font-semibold"
            >
              Next
            </span>
            <ChevronRight size={16} className="text-[#3385f0]" />
          </button>
        </div>
      </div>
    </div>
  );
}
