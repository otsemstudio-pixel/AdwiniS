import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import { BriefCard, CARD_H, CARD_W } from '../components/BusinessCard';
import { Section } from '../components/Section';
import { site } from '../data/site';
import { useCardActions } from '../hooks/useCardActions';
import { useLanguage } from '../hooks/useLanguage';
import {
  BUDGETS,
  DEADLINES,
  LIMITS,
  NEEDS,
  briefCode,
  emptyBrief,
  encodeBrief,
  missingFields,
  quickWhatsappUrl,
  whatsappUrl,
  type Brief,
  type BriefField,
  type Need,
} from '../utils/brief';
import { slug } from '../utils/card';

/** Adresse de la page /brief, construite depuis la base du site (fonctionne aussi en local). */
const briefLink = (d: string) => `${window.location.origin}${import.meta.env.BASE_URL}brief/?d=${d}`;

/**
 * Contact = carte de brief. Le visiteur décrit son besoin en six champs ; sa carte se compose
 * en direct ; « Envoyer sur WhatsApp » ouvre un message pré-rempli qui contient un lien vers
 * la carte (les réponses voyagent dans le lien, jamais sur un serveur).
 * La sortie rapide ouvre WhatsApp sans formulaire.
 */
export function Contact({ index }: { index: number }) {
  const { t } = useLanguage();
  const c = t.contact;
  const b = t.brief;
  const [brief, setBrief] = useState<Brief>(emptyBrief);
  const [link, setLink] = useState('');
  const [missing, setMissing] = useState<BriefField[]>([]);
  const cardRef = useRef<SVGSVGElement>(null);
  const actions = useCardActions({ downloaded: b.downloaded, copied: b.copied, error: b.error });

  // Le lien de la carte est recalculé à chaque saisie (encodage asynchrone : compression native).
  useEffect(() => {
    let alive = true;
    encodeBrief(brief).then((d) => alive && setLink(briefLink(d)));
    return () => {
      alive = false;
    };
  }, [brief]);

  const names = useMemo(
    () => ({
      needs: brief.needs.map((n) => b.needs[n]).join(', '),
      deadline: brief.deadline ? b.deadlines[brief.deadline] : '',
      budget: brief.budget ? b.budgets[brief.budget] : '',
    }),
    [brief, b],
  );

  const waHref = useMemo(
    () =>
      link
        ? whatsappUrl(
            site.whatsappNumber,
            brief,
            link,
            b.message,
            names,
          )
        : '',
    [link, brief, b, names],
  );

  const set = <K extends keyof Brief>(key: K, value: Brief[K]) => {
    setBrief((prev) => ({ ...prev, [key]: value }));
    setMissing((m) => m.filter((f) => f !== key));
  };

  // « Je ne sais pas encore » exclut les autres besoins, et inversement.
  const toggleNeed = (n: Need) =>
    set(
      'needs',
      brief.needs.includes(n) ? brief.needs.filter((x) => x !== n) : n === 'unk' ? ['unk'] : [...brief.needs.filter((x) => x !== 'unk'), n],
    );

  /** Vérifie les champs obligatoires ; sinon annonce ce qui manque et y place le focus. */
  const ensureComplete = () => {
    const m = missingFields(brief);
    setMissing(m);
    if (m.length) document.getElementById(`brief-${m[0]}`)?.focus();
    return m.length === 0;
  };

  const onSend = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!ensureComplete() || !waHref) e.preventDefault();
  };

  const code = briefCode(brief);
  const fieldLabel = (f: BriefField) => b.fields[f].label;

  return (
    <Section id="contact" index={index} label={c.label} title={c.title} aside={<p className="lead">{c.intro}</p>} className="contact brief">
      <div className="brief__grid">
        <div className="brief__aside">
          <div className="brief__preview">
            <div className="bcard bcard--single">
              <BriefCard
                ref={cardRef}
                name={brief.name}
                company={brief.company}
                sentence={brief.sentence}
                needs={brief.needs.map((n) => b.needs[n])}
                deadline={names.deadline}
                budget={names.budget}
                code={code}
                labels={b.card}
                placeholders={{ name: b.card.placeholderName, company: b.card.placeholderCompany, sentence: b.card.placeholderSentence }}
                label={b.previewLabel}
              />
            </div>
          </div>
          <div className="brief__actions">
            <a href={waHref || undefined} className="btn btn--solid brief__send" target="_blank" rel="noopener noreferrer" onClick={onSend}>
              {b.send}
            </a>
            <button type="button" className="btn btn--outline" disabled={actions.busy} onClick={() => ensureComplete() && link && actions.copyLink(link)}>
              {b.copy}
            </button>
            <button
              type="button"
              className="btn btn--outline"
              disabled={actions.busy}
              onClick={() => actions.downloadPng(() => [cardRef.current], CARD_W, CARD_H, `adwini-brief-${slug(brief.company || brief.name)}.png`)}
            >
              {b.download}
            </button>
          </div>
          <p className="cardmaker__status" role="status">
            {missing.length ? b.missing.replace('{fields}', missing.map(fieldLabel).join(', ')) : actions.status}
          </p>
        </div>

        <form className="brief__form" onSubmit={(e) => e.preventDefault()} noValidate>
          <div className="brief__quick">
            <p className="brief__quick-title">{b.quickTitle}</p>
            <a href={quickWhatsappUrl(site.whatsappNumber, c.whatsappMessage)} className="btn btn--outline" target="_blank" rel="noopener noreferrer">
              {b.quick}
            </a>
          </div>

          <div className="fields brief__fields">
            {(['name', 'company'] as const).map((f) => (
              <div key={f} className="field">
                <label htmlFor={`brief-${f}`} className="field__label">
                  {b.fields[f].label} <span className="field__req">({b.required})</span>
                </label>
                <input
                  id={`brief-${f}`}
                  className="field__input"
                  type="text"
                  autoComplete={f === 'name' ? 'name' : 'organization'}
                  maxLength={LIMITS[f]}
                  placeholder={b.fields[f].placeholder}
                  value={brief[f]}
                  aria-invalid={missing.includes(f) || undefined}
                  required
                  onChange={(e) => set(f, e.target.value)}
                />
              </div>
            ))}
          </div>

          <ChoiceGroup id="brief-needs" label={b.needsLabel} hint={b.optional}>
            {NEEDS.map((n) => (
              <button key={n} type="button" className="choice" aria-pressed={brief.needs.includes(n)} onClick={() => toggleNeed(n)}>
                {b.needs[n]}
              </button>
            ))}
          </ChoiceGroup>

          <div className="field">
            <label htmlFor="brief-sentence" className="field__label">
              {b.fields.sentence.label} <span className="field__req">({b.required})</span>
            </label>
            <textarea
              id="brief-sentence"
              className="field__input field__input--area"
              rows={3}
              maxLength={LIMITS.sentence}
              placeholder={b.fields.sentence.placeholder}
              value={brief.sentence}
              aria-describedby="brief-counter"
              aria-invalid={missing.includes('sentence') || undefined}
              required
              onChange={(e) => set('sentence', e.target.value)}
            />
            <p id="brief-counter" className="field__counter">
              {b.counter.replace('{n}', String(brief.sentence.length)).replace('{max}', String(LIMITS.sentence))}
            </p>
          </div>

          <ChoiceGroup id="brief-deadline" label={b.deadlineLabel} hint={b.optional}>
            {DEADLINES.map((d) => (
              <button key={d} type="button" className="choice" aria-pressed={brief.deadline === d} onClick={() => set('deadline', brief.deadline === d ? '' : d)}>
                {b.deadlines[d]}
              </button>
            ))}
          </ChoiceGroup>

          <ChoiceGroup id="brief-budget" label={b.budgetLabel} hint={b.optional}>
            {BUDGETS.map((g) => (
              <button key={g} type="button" className="choice" aria-pressed={brief.budget === g} onClick={() => set('budget', brief.budget === g ? '' : g)}>
                {b.budgets[g]}
              </button>
            ))}
          </ChoiceGroup>

          <p className="cardmaker__privacy">{b.privacy}</p>

          <div className="brief__other">
            <a href={`mailto:${site.email}`} className="contact__email">
              <span className="link-draw">{c.email}</span>
              <span className="contact__detail">{site.email}</span>
            </a>
            <div className="contact__socials">
              <p className="meta">{c.socials}</p>
              <ul className="contact__social-list">
                {site.socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} className="btn btn--outline btn--small" target="_blank" rel="noopener noreferrer">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </form>
      </div>
    </Section>
  );
}

/** Groupe de choix : un intitulé et des boutons-bascules (aria-pressed), pas de liste déroulante. */
function ChoiceGroup({ id, label, hint, children }: { id: string; label: string; hint: string; children: React.ReactNode }) {
  return (
    <div className="choice-group" role="group" aria-labelledby={`${id}-label`}>
      <p id={`${id}-label`} className="field__label">
        {label} <span className="field__req">({hint})</span>
      </p>
      <div className="choice-group__options">{children}</div>
    </div>
  );
}
