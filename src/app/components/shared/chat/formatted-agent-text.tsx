/**
 * Renders structured agent text with support for headers, bullet lists,
 * dash separators, and colon separators.
 * Supports both \u2022 and * as bullet characters.
 */
export function FormattedAgentText({ text }: { text: string }) {
  const blocks = text.split("\n\n");

  return (
    <div className="flex flex-col gap-2.5 text-[14px] leading-[22px] text-text-secondary">
      {blocks.map((block, bi) => {
        const lines = block.split("\n");
        const bulletLines = lines.filter(
          (l) => l.trimStart().startsWith("\u2022") || l.trimStart().startsWith("*")
        );
        const nonBulletLines = lines.filter(
          (l) => !l.trimStart().startsWith("\u2022") && !l.trimStart().startsWith("*")
        );

        // Pure paragraph (no bullets)
        if (bulletLines.length === 0) {
          const isHeader = lines.length === 1 && lines[0].endsWith(":") && lines[0].length < 60;
          if (isHeader) {
            return (
              <p key={bi} className="text-text-primary text-[13px] tracking-[0.1px] mt-1 font-semibold">
                {lines[0]}
              </p>
            );
          }
          return (
            <p key={bi}>
              {block}
            </p>
          );
        }

        // Block with header + bullet list
        return (
          <div key={bi} className="flex flex-col gap-1">
            {nonBulletLines.map((line, li) =>
              line.trim() ? (
                <p key={`h-${li}`} className="text-text-primary text-[13px] tracking-[0.1px] font-semibold">
                  {line}
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
                          <span className="text-text-primary font-medium">{dashMatch[1]}</span>
                          <span className="text-text-muted mx-1">{"\u2014"}</span>
                          {dashMatch[2]}
                        </>
                      ) : colonMatch ? (
                        <>
                          <span className="text-text-primary font-medium">{colonMatch[1]}:</span>{" "}
                          {colonMatch[2]}
                        </>
                      ) : (
                        content
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
