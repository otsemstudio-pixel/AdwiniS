import { useEffect, useMemo, useRef, useState } from 'react';
import { CARD_H, CARD_W, CardBack, CardFront } from '../components/BusinessCard';
import { CardPreview, type Face } from '../components/CardPreview';
import { Section } from '../components/Section';
import { site } from '../data/site';
import { useCardActions } from '../hooks/useCardActions';
import { useLanguage } from '../hooks/useLanguage';
import { useQr } from '../hooks/useQr';
import { buildVCard, cardFromHash, cardToHash, emptyCard, hasContent, slug, type CardData, type CardKey } from '../utils/card';

/**
 * « Emportez Adwini avec vous » : formulaire, aperçu en direct, export.
 * Rien ne quitte le navigateur : PNG, vCard et QR sont générés localement.
 */
export function CardMaker({ index }: { index: number }) {
  const { t } = useLanguage();
  const c = t.card;
  const [data, setData] = useState<CardData>(emptyCard);
  const [face, setFace] = useState<Face>('front');
  const sectionRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<SVGSVGElement>(null);
  const backRef = useRef<SVGSVGElement>(null);
  const actions = useCardActions({ downloaded: c.downloaded, copied: c.copied, shared: c.shared, error: c.error });

  // Une carte partagée arrive par le lien « #carte?… » : on pré-remplit.
  useEffect(() => {
    const shared = cardFromHash(window.location.hash);
    if (shared) {
      setData(shared);
      setFace('back');
      document.getElementById('carte')?.scrollIntoView();
    }
  }, []);

  const vcard = useMemo(() => buildVCard(data), [data]);
  const qr = useQr(hasContent(data) ? vcard : site.url, sectionRef);

  const placeholders = useMemo(() => {
    const get = (k: CardKey) => c.fields.find((f) => f.key === k)?.placeholder ?? '';
    return { name: get('name'), role: get('role'), company: get('company') };
  }, [c.fields]);

  const update = (key: CardKey, value: string) => setData((d) => ({ ...d, [key]: value }));
  const fileBase = `adwini-${slug(data.name)}`;
  const faces = () => [frontRef.current, backRef.current];

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
          <p className="cardmaker__privacy">{c.privacy}</p>
          <p className="cardmaker__note">{c.shareNote}</p>
        </form>

        {/* Mobile : « stage » s'efface (display: contents) et seul l'aperçu reste collé en haut.
            Bureau : aperçu et actions collent ensemble dans la colonne de droite. */}
        <div className="cardmaker__stage">
          <div className="cardmaker__preview">
            <CardPreview
              face={face}
              frontLabel={c.front}
              backLabel={c.back}
              front={<CardFront ref={frontRef} taglineLines={c.taglineLines} label={`${c.previewLabel} — ${c.front}`} />}
              back={<CardBack ref={backRef} data={data} placeholders={placeholders} qr={qr} label={`${c.previewLabel} — ${c.back}`} />}
            />
          </div>

          <div className="cardmaker__tools">
            <div className="cardmaker__actions">
              <button type="button" className="btn btn--outline" onClick={() => setFace((f) => (f === 'front' ? 'back' : 'front'))}>
                {c.flip}
              </button>
              <button type="button" className="btn btn--solid" onClick={() => actions.downloadPng(faces, CARD_W, CARD_H, `${fileBase}.png`)} disabled={actions.busy}>
                {c.download}
              </button>
              <button
                type="button"
                className="btn btn--outline"
                disabled={actions.busy}
                onClick={() =>
                  actions.share({
                    url: `${window.location.origin}${window.location.pathname}${cardToHash(data)}`,
                    title: c.shareTitle,
                    text: c.shareText,
                    file: async () => new File([await actions.png(faces(), CARD_W, CARD_H)], `${fileBase}.png`, { type: 'image/png' }),
                  })
                }
              >
                {c.share}
              </button>
              <button type="button" className="btn btn--outline" onClick={() => actions.downloadFile(vcard, 'text/vcard;charset=utf-8', `${fileBase}.vcf`)} disabled={actions.busy}>
                {c.vcard}
              </button>
            </div>
            <p className="cardmaker__status" role="status">
              {actions.status}
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
