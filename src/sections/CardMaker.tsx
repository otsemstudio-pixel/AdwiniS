import { useEffect, useMemo, useRef, useState } from 'react';
import { CARD_COLORS, CARD_H, CARD_W, CardBack, CardFront } from '../components/BusinessCard';
import { Section } from '../components/Section';
import { site } from '../data/site';
import { useLanguage } from '../hooks/useLanguage';
import {
  buildVCard,
  cardFromHash,
  cardToHash,
  copyText,
  downloadBlob,
  emptyCard,
  hasContent,
  slug,
  type CardData,
  type CardKey,
} from '../utils/card';
import { loadQr, qrToPath } from '../utils/qr';

type Face = 'front' | 'back';
type Encode = Awaited<ReturnType<typeof loadQr>>;

/**
 * « Emportez Adwini avec vous » : formulaire, aperçu en direct, export.
 * Rien ne quitte le navigateur : PNG, vCard et QR sont générés localement.
 */
export function CardMaker({ index }: { index: number }) {
  const { t } = useLanguage();
  const c = t.card;
  const [data, setData] = useState<CardData>(emptyCard);
  const [face, setFace] = useState<Face>('front');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [encode, setEncode] = useState<Encode | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<SVGSVGElement>(null);
  const backRef = useRef<SVGSVGElement>(null);

  // Une carte partagée arrive par le lien « #carte?… » : on pré-remplit.
  useEffect(() => {
    const shared = cardFromHash(window.location.hash);
    if (shared) {
      setData(shared);
      setFace('back');
      document.getElementById('carte')?.scrollIntoView();
    }
  }, []);

  // L'encodeur QR n'est chargé qu'à l'approche de la section.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const load = () => loadQr().then((fn) => setEncode(() => fn));
    if (!('IntersectionObserver' in window)) return void load();
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
  }, []);

  const vcard = useMemo(() => buildVCard(data), [data]);
  const qr = useMemo(() => {
    if (!encode) return null;
    return qrToPath(encode, hasContent(data) ? vcard : site.url);
  }, [encode, data, vcard]);

  const placeholders = useMemo(() => {
    const get = (k: CardKey) => c.fields.find((f) => f.key === k)?.placeholder ?? '';
    return { name: get('name'), role: get('role'), company: get('company') };
  }, [c.fields]);

  const update = (key: CardKey, value: string) => setData((d) => ({ ...d, [key]: value }));
  const fileBase = `adwini-${slug(data.name)}`;
  const shareUrl = () => `${window.location.origin}${window.location.pathname}${cardToHash(data)}`;

  async function makePng() {
    const { facesToPng } = await import('../utils/exportCard');
    const faces = [frontRef.current, backRef.current].filter(Boolean) as SVGSVGElement[];
    return facesToPng(faces, CARD_W, CARD_H, CARD_COLORS.ivory);
  }

  async function run(action: () => Promise<string | void>) {
    setBusy(true);
    setStatus('');
    try {
      const message = await action();
      if (message) setStatus(message);
    } catch (err) {
      // L'utilisateur a fermé la feuille de partage : ce n'est pas une erreur.
      if ((err as DOMException)?.name !== 'AbortError') setStatus(c.error);
    } finally {
      setBusy(false);
    }
  }

  const onDownload = () =>
    run(async () => {
      downloadBlob(await makePng(), `${fileBase}.png`);
      return c.downloaded;
    });

  const onVcard = () =>
    run(async () => {
      downloadBlob(new Blob([vcard], { type: 'text/vcard;charset=utf-8' }), `${fileBase}.vcf`);
      return c.downloaded;
    });

  const onShare = () =>
    run(async () => {
      const url = shareUrl();
      if (navigator.share) {
        const payload: ShareData = { title: c.shareTitle, text: c.shareText, url };
        try {
          const file = new File([await makePng()], `${fileBase}.png`, { type: 'image/png' });
          if (navigator.canShare?.({ files: [file] })) payload.files = [file];
        } catch {
          /* pas d'image : on partage le lien seul */
        }
        await navigator.share(payload);
        return c.shared;
      }
      return (await copyText(url)) ? c.copied : c.error;
    });

  return (
    <Section id="carte" index={index} label={c.label} title={c.title} aside={<p className="lead">{c.intro}</p>} className="cardmaker">
      <div className="cardmaker__grid" ref={sectionRef}>
        <form className="cardmaker__form" onSubmit={(e) => e.preventDefault()} noValidate>
          <div className="fields">
            {c.fields.map((f) => (
              <div key={f.key} className="field">
                <label htmlFor={`card-${f.key}`} className="field__label">
                  {f.label}
                </label>
                <input
                  id={`card-${f.key}`}
                  name={f.key}
                  className="field__input"
                  type={f.type}
                  inputMode={f.type === 'url' ? 'url' : undefined}
                  autoComplete={f.autoComplete}
                  placeholder={f.placeholder}
                  maxLength={120}
                  value={data[f.key]}
                  onChange={(e) => update(f.key, e.target.value)}
                />
              </div>
            ))}
          </div>
          <p className="cardmaker__privacy filet">{c.privacy}</p>
          <p className="cardmaker__note">{c.shareNote}</p>
        </form>

        {/* Mobile : « stage » s'efface (display: contents) et seul l'aperçu reste collé en haut.
            Bureau : aperçu et actions collent ensemble dans la colonne de droite. */}
        <div className="cardmaker__stage">
        <div className="cardmaker__preview">
          <p className="cardmaker__face meta-mono" aria-live="polite">
            {face === 'front' ? c.front : c.back}
          </p>
          <div className={`bcard ${face === 'back' ? 'is-flipped' : ''}`}>
            <div className="bcard__inner">
              <div className="bcard__face bcard__face--front" aria-hidden={face !== 'front'}>
                <CardFront ref={frontRef} taglineLines={c.taglineLines} label={`${c.previewLabel} — ${c.front}`} />
              </div>
              <div className="bcard__face bcard__face--back" aria-hidden={face !== 'back'}>
                <CardBack
                  ref={backRef}
                  data={data}
                  placeholders={placeholders}
                  qr={qr}
                  label={`${c.previewLabel} — ${c.back}`}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="cardmaker__tools">
          <div className="cardmaker__actions">
            <button type="button" className="btn btn--outline" onClick={() => setFace((f) => (f === 'front' ? 'back' : 'front'))}>
              {c.flip}
            </button>
            <button type="button" className="btn btn--solid" onClick={onDownload} disabled={busy}>
              {c.download}
            </button>
            <button type="button" className="btn btn--outline" onClick={onShare} disabled={busy}>
              {c.share}
            </button>
            <button type="button" className="btn btn--outline" onClick={onVcard} disabled={busy}>
              {c.vcard}
            </button>
          </div>
          <p className="cardmaker__status" role="status">
            {status}
          </p>
        </div>
        </div>
      </div>
    </Section>
  );
}
