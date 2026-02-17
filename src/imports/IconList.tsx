import svgPaths from "./svg-8oo5o2i4y5";

function Icon() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path clipRule="evenodd" d={svgPaths.p16e20a00} fill="var(--fill-0, #3B82F6)" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Logo() {
  return (
    <div className="content-stretch flex gap-[5.333px] items-center justify-center overflow-clip relative shrink-0" data-name="_logo">
      <Icon />
    </div>
  );
}

function ButtonIcon() {
  return (
    <div className="content-stretch flex items-center justify-center p-[6px] relative rounded-[14px] shrink-0" data-name="Button Icon">
      <Logo />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <ButtonIcon />
    </div>
  );
}

function PlusIcon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Plus Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Plus Icon">
          <path d={svgPaths.p1b9e1d40} fill="var(--fill-0, #767676)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function ButtonIcon1() {
  return (
    <div className="content-stretch flex items-center justify-center p-[4px] relative rounded-[6px] shrink-0" data-name="Button Icon">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[6px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04)]" />
      <PlusIcon />
    </div>
  );
}

export default function IconList() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-center relative size-full" data-name="Icon List">
      <Frame />
      <ButtonIcon1 />
      <div className="absolute bg-[#3b82f6] h-[24px] left-[2px] rounded-[7px] top-[6px] w-[4px]" />
    </div>
  );
}