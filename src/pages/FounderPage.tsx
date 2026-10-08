import { useEffect, useMemo, useRef, useState } from 'react';
import { CARD_H, CARD_W, CardBack, CardFront, CardSquare, SQUARE } from '../components/BusinessCard';
import { CardPreview, type Face } from '../components/CardPreview';
import { founder, isPlaceholder, site } from '../data/site';
import { useCardActions } from '../hooks/useCardActions';
import { useLanguage } from '../hooks/useLanguage';
import { useQr } from '../hooks/useQr';
import { buildVCard, slug, type CardData } from '../utils/card';
import { PageShell } from './PageShell';

/**
 * Carte du fondateur (/carte en français, /card en anglais) : pré-remplie, non modifiable.
 * Le QR code mène à la page d'accueil du studio (faire découvrir Adwini) ;
 * « Télécharger le contact » couvre l'enregistrement des coordonnées.
 */
export function FounderPage() {
  const { t } = useLanguage();
  const c = t.card;
  const f = t.founderPage;
  const [face, setFace] = useState<Face>('front');
  const frontRef = useRef<SVGSVGElement>(null);
  const backRef = useRef<SVGSVGElement>(null);
  const squareRef = useRef<SVGSVGElement>(null);
  const actions = useCardActions({ downloaded: c.downloaded, copied: c.copied, shared: c.shared, error: c.error });

  useEffect(() => {
    document.title = f.title;
  }, [f.title]);

  const data: CardData = useMemo(
    () => ({
      name: founder.name,
      role: f.role,
      company: founder.company,
      email: founder.email,
      phone: founder.phone,
      website: founder.website,
      linkedin: founder.linkedin,
      instagram: founder.instagram,
    }),
    [f.role],
  );

  // Le contact .vcf n'emporte pas les emplacements « [À REMPLIR] ».
  const vcard = useMemo(() => {
    const clean = Object.fromEntries(Object.entries(data).map(([k, v]) => [k, isPlaceholder(v) ? '' : v])) as CardData;
    return buildVCard(clean);
  }, [data]);

  const qr = useQr(site.url);
  const base = `adwini-${slug(founder.name)}`;
  const faces = () => [frontRef.current, backRef.current];
  const placeholders = { name: '', role: '', company: '' };

  return (
    <PageShell backLabel={f.back}>
      <section className="founder wrap" aria-labelledby="founder-title">
        <header className="founder__head">
          <p className="meta">ADWINI / 001</p>
          <h1 id="founder-title" className="founder__title">
            {f.heading}
          </h1>
          <p className="lead">{f.intro}</p>
        </header>

        <div className="founder__card">
          <CardPreview
            face={face}
            frontLabel={c.front}
            backLabel={c.back}
            front={<CardFront ref={frontRef} taglineLines={c.taglineLines} label={`${f.heading} — ${c.front}`} />}
            back={<CardBack ref={backRef} data={data} placeholders={placeholders} qr={qr} qrText={site.url} label={`${f.heading} — ${c.back}`} />}
          />
        </div>

        <div className="founder__actions cardmaker__actions">
          <button type="button" className="btn btn--outline" onClick={() => setFace((x) => (x === 'front' ? 'back' : 'front'))}>
            {c.flip}
          </button>
          <button type="button" className="btn btn--solid" disabled={actions.busy} onClick={() => actions.downloadPng(faces, CARD_W, CARD_H, `${base}.png`)}>
            {c.download}
          </button>
          <button
            type="button"
            className="btn btn--outline"
            disabled={actions.busy}
            onClick={() =>
              actions.share({
                url: window.location.href.split('#')[0],
                title: f.title,
                text: f.intro,
                file: async () => new File([await actions.png(faces(), CARD_W, CARD_H)], `${base}.png`, { type: 'image/png' }),
              })
            }
          >
            {c.share}
          </button>
          <button type="button" className="btn btn--outline" disabled={actions.busy} onClick={() => actions.downloadFile(vcard, 'text/vcard;charset=utf-8', `${base}.vcf`)}>
            {c.vcard}
          </button>
          <button type="button" className="btn btn--outline" disabled={actions.busy} onClick={() => actions.downloadPng(faces, CARD_W, CARD_H, `${base}-hd.png`, { scale: 3 })}>
            {f.hd}
          </button>
        </div>
        <p className="cardmaker__status" role="status">
          {actions.status}
        </p>

        <div className="founder__square">
          <p className="meta">{f.squareLabel}</p>
          <div className="founder__square-card">
            <CardSquare ref={squareRef} data={data} qr={qr} taglineLines={c.taglineLines} label={f.squareLabel} />
          </div>
          <button
            type="button"
            className="btn btn--outline"
            disabled={actions.busy}
            onClick={() => actions.downloadPng(() => [squareRef.current], SQUARE, SQUARE, `${base}-1080.png`, { scale: 1, gap: 0 })}
          >
            {f.square}
          </button>
        </div>

        <p className="founder__note">{f.note}</p>
      </section>
    </PageShell>
  );
}
