import React from "react";

/**
 * Parses inline **bold** markdown and returns React nodes.
 */
function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <span key={match.index} className="text-text-primary font-semibold">
        {match[1]}
      </span>
    );
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length === 1 && typeof parts[0] === "string" ? parts[0] : <>{parts}</>;
}

/**
 * Detects if a line is a bullet (starts with • or * followed by space).
 * Lines starting with ** (bold) are NOT bullets.
 */
function isBulletLine(line: string): boolean {
  const trimmed = line.trimStart();
  if (trimmed.startsWith("\u2022")) return true;
  // * followed by space is a bullet, but ** is bold syntax
  if (trimmed.startsWith("* ")) return true;
  return false;
}

/**
 * Renders structured agent text with support for headers, bullet lists,
 * dash separators, colon separators, and **bold** inline formatting.
 */
export function FormattedAgentText({ text }: { text: string }) {
  const blocks = text.split("\n\n");

  return (
    <div className="flex flex-col gap-2.5 text-[14px] leading-[22px] text-text-secondary">
      {blocks.map((block, bi) => {
        const lines = block.split("\n");
        const bulletLines = lines.filter(isBulletLine);
        const nonBulletLines = lines.filter((l) => !isBulletLine(l));

        // Pure paragraph (no bullets)
        if (bulletLines.length === 0) {
          const isHeader = lines.length === 1 && lines[0].endsWith(":") && lines[0].length < 60;
          if (isHeader) {
            return (
              <p key={bi} className="text-text-primary text-[13px] tracking-[0.1px] mt-1 font-semibold">
                {renderInline(lines[0])}
              </p>
            );
          }
          return (
            <p key={bi}>
              {renderInline(block)}
            </p>
          );
        }

        // Block with header + bullet list
        return (
          <div key={bi} className="flex flex-col gap-1">
            {nonBulletLines.map((line, li) =>
              line.trim() ? (
                <p key={`h-${li}`} className="text-text-primary text-[13px] tracking-[0.1px] font-semibold">
                  {renderInline(line)}
                </p>
              ) : null
            )}
            <ul className="flex flex-col gap-1 pl-1">
              {bulletLines.map((line, li) => {
                const content = line.trimStart().replace(/^[\u2022*]\s*/, "");
                const dashMatch = content.match(/^(.+?)\s*[\u2014\u2013]\s*(.+)$/);
                const colonMatch = !dashMatch && content.match(/^(.+?):\s*(.+)$/);

                return (
                  <li key={li} className="flex gap-2 items-start text-[13px] leading-[20px]">
                    <span className="text-text-muted mt-[2px] shrink-0">{"\u2022"}</span>
                    <span>
                      {dashMatch ? (
                        <>
                          <span className="text-text-primary font-medium">{renderInline(dashMatch[1])}</span>
                          <span className="text-text-muted mx-1">{"\u2014"}</span>
                          {renderInline(dashMatch[2])}
                        </>
                      ) : colonMatch ? (
                        <>
                          <span className="text-text-primary font-medium">{renderInline(colonMatch[1])}:</span>{" "}
                          {renderInline(colonMatch[2])}
                        </>
                      ) : (
                        renderInline(content)
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
