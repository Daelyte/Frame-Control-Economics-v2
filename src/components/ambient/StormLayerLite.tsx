// components/ambient/StormLayerLite.tsx
export default function StormLayerLite({ intensity = 1, lightning = true }:{ intensity?: 0|1|2; lightning?: boolean }) {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
      {intensity>0 && (
        <>
          <div className={`absolute inset-0 opacity-[0.12] ${intensity===2?'animate-[rainA_2.8s_linear_infinite]':'animate-[rainA_3.6s_linear_infinite]'}
          bg-[repeating-linear-gradient(12deg,transparent_0_38px,color-mix(in_oklab,black_25%,transparent)_38px_40px)]`} />
          <div className={`absolute inset-0 opacity-[0.10] ${intensity===2?'animate-[rainB_3.6s_linear_infinite]':'animate-[rainB_4.6s_linear_infinite]'}
          bg-[repeating-linear-gradient(12deg,transparent_0_46px,color-mix(in_oklab,black_22%,transparent)_46px_48px)]`} />
          <div className={`absolute inset-0 opacity-[0.08] ${intensity===2?'animate-[rainC_4.2s_linear_infinite]':'animate-[rainC_5.2s_linear_infinite]'}
          bg-[repeating-linear-gradient(12deg,transparent_0_52px,color-mix(in_oklab,black_18%,transparent)_52px_54px)]`} />
        </>
      )}
      {lightning && <div className="absolute inset-0 mix-blend-screen animate-[flash_22s_ease-in-out_infinite]" />}
      <style jsx global>{`
        @keyframes rainA{0%{background-position:0 0}100%{background-position:-140px 260px}}
        @keyframes rainB{0%{background-position:0 0}100%{background-position:-190px 360px}}
        @keyframes rainC{0%{background-position:0 0}100%{background-position:-230px 420px}}
        @keyframes flash{
          0%,7%,100%{opacity:0}8%{opacity:.45}9%{opacity:0}10%{opacity:.35}11%{opacity:0}
          38%,39%{opacity:.25}40%{opacity:0}63%{opacity:.32}64%{opacity:0}
        }
        @media (prefers-reduced-motion: reduce){
          .animate-[rainA_3.6s_linear_infinite],.animate-[rainB_4.6s_linear_infinite],
          .animate-[rainC_5.2s_linear_infinite],.animate-[flash_22s_ease-in-out_infinite],
          .animate-[rainA_2.8s_linear_infinite],.animate-[rainB_3.6s_linear_infinite],.animate-[rainC_4.2s_linear_infinite]{animation:none!important}
        }
      `}</style>
    </div>
  );
}