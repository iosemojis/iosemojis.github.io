import React, { useEffect } from 'react';

interface AdSlotProps {
  slot?: string;
  format?: string;
  minHeight?: string;
  className?: string;
  pageKey?: any;
  position?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({
  slot = '6477240404',
  format = 'auto',
  minHeight = 'min-h-[90px]',
  className = '',
  pageKey,
  position,
}) => {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (e) {
      console.debug('AdSense init notice:', e);
    }
  }, [pageKey]);

  return (
    <aside
      aria-label="Advertisement"
      className={`w-full ${minHeight} my-6 flex flex-col items-center justify-center rounded-xl bg-neutral-100/70 border border-dashed border-neutral-300/80 overflow-hidden text-center p-2 transition-colors ${className}`}
    >
      <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
        Advertisement
      </div>
      <div className="w-full flex justify-center">
        <ins
          className="adsbygoogle"
          style={{ display: 'block', minWidth: '280px', width: '100%' }}
          data-ad-client="ca-pub-9534887202409405"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    </aside>
  );
};
