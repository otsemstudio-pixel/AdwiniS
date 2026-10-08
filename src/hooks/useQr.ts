import { useEffect, useMemo, useState, type RefObject } from 'react';
import { loadQr, qrToPath, type QrShape } from '../utils/qr';

type Encode = Awaited<ReturnType<typeof loadQr>>;

/**
 * QR code d'un texte. L'encodeur (≈ 4 Ko) est chargé à la demande :
 * dès l'approche de `near` si elle est fournie, sinon immédiatement.
 */
export function useQr(text: string, near?: RefObject<Element>): QrShape | null {
  const [encode, setEncode] = useState<Encode | null>(null);

  useEffect(() => {
    const load = () => loadQr().then((fn) => setEncode(() => fn));
    const el = near?.current;
    if (!el || !('IntersectionObserver' in window)) return void load();
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          load();
        }
      },
      { rootMargin: '600px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [near]);

  return useMemo(() => (encode ? qrToPath(encode, text) : null), [encode, text]);
}
