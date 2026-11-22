import { asset } from '../lib/asset';
import { Sparkle } from './Sparkle';

export function BelindLogo({ className = 'w-10 h-10', sparkle = true }: { className?: string; sparkle?: boolean }) {
  return (
    <span className={`relative inline-block shrink-0 ${className}`}>
      <img
        src={asset('/assets/belind-logo.webp')}
        alt=""
        width={96}
        height={96}
        decoding="async"
        className="w-full h-full rounded-full ring-1 ring-black/10 bg-white object-cover"
      />
      <span className="logo-shine" aria-hidden="true" />
      {sparkle && (
        <>
          <Sparkle className="absolute -top-1 -right-1.5" size={13} delay={0.6} />
          <Sparkle className="absolute -bottom-0.5 -left-1" size={8} delay={1.9} duration={3.1} color="#E5C990" />
        </>
      )}
    </span>
  );
}
