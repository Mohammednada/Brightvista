import svgPaths from "./svg-wmp8kfiaqf";

function Container1() {
  return (
    <div className="absolute left-[6.61px] size-[312.929px] top-[12.6px]" data-name="Container">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 312.929 312.929">
        <g id="Container">
          <g id="Ellipse 99" opacity="0.8">
            <mask fill="white" id="path-1-inside-1_1_38324">
              <path d={svgPaths.p23764f80} />
            </mask>
            <path d={svgPaths.p23764f80} fill="var(--fill-0, #C6DDFB)" mask="url(#path-1-inside-1_1_38324)" stroke="var(--stroke-0, white)" strokeWidth="2" />
          </g>
          <g id="Ellipse 102" opacity="0.8">
            <mask fill="white" id="path-2-inside-2_1_38324">
              <path d={svgPaths.p33afb5c0} />
            </mask>
            <path d={svgPaths.p33afb5c0} fill="var(--fill-0, #F2C1CA)" mask="url(#path-2-inside-2_1_38324)" stroke="var(--stroke-0, white)" strokeWidth="2" />
          </g>
          <g id="Ellipse 100" opacity="0.8">
            <mask fill="white" id="path-3-inside-3_1_38324">
              <path d={svgPaths.p25bf0400} />
            </mask>
            <path d={svgPaths.p25bf0400} fill="var(--fill-0, #FBCB9D)" mask="url(#path-3-inside-3_1_38324)" stroke="var(--stroke-0, white)" strokeWidth="2" />
          </g>
          <g id="Ellipse 103" opacity="0.8">
            <mask fill="white" id="path-4-inside-4_1_38324">
              <path d={svgPaths.p3c683900} />
            </mask>
            <path d={svgPaths.p3c683900} fill="var(--fill-0, #8ED3BA)" mask="url(#path-4-inside-4_1_38324)" stroke="var(--stroke-0, white)" strokeWidth="2" />
          </g>
          <g id="Ellipse 101" opacity="0.8">
            <mask fill="white" id="path-5-inside-5_1_38324">
              <path d={svgPaths.p920a900} />
            </mask>
            <path d={svgPaths.p920a900} fill="var(--fill-0, #90D6EC)" mask="url(#path-5-inside-5_1_38324)" stroke="var(--stroke-0, white)" strokeWidth="2" />
          </g>
          <g id="Ellipse 98" opacity="0.8">
            <mask fill="white" id="path-6-inside-6_1_38324">
              <path d={svgPaths.p2368df00} />
            </mask>
            <path d={svgPaths.p2368df00} fill="var(--fill-0, #A1C7F8)" mask="url(#path-6-inside-6_1_38324)" stroke="var(--stroke-0, white)" strokeWidth="2" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col items-center pb-[1.889px] relative shrink-0" data-name="Container">
      <p className="font-['Ubuntu_sans:Bold',sans-serif] leading-[21px] not-italic relative shrink-0 text-[#1b2124] text-[16px]" style={{ fontFeatureSettings: "\'case\', \'lnum\', \'pnum\'" }}>
        1053
      </p>
      <p className="font-['Ubuntu_Sans:Medium',sans-serif] font-medium leading-[18px] relative shrink-0 text-[#9caeb8] text-[12px]" style={{ fontVariationSettings: "\'wdth\' 100", fontFeatureSettings: "\'case\', \'lnum\', \'pnum\'" }}>
        Total
      </p>
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute bg-[#f7fafc] content-stretch flex flex-col items-center left-[98px] pb-[34.829px] pt-[23.262px] px-[7.754px] rounded-[87.073px] size-[130px] top-[97px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[87.073px]" />
      <Container3 />
    </div>
  );
}

export default function Container() {
  return (
    <div className="relative size-full" data-name="Container">
      <Container1 />
      <Container2 />
    </div>
  );
}