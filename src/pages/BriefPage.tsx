import { useEffect, useRef, useState } from 'react';
import { BriefCard, CARD_H, CARD_W } from '../components/BusinessCard';
import { useCardActions } from '../hooks/useCardActions';
import { useLanguage } from '../hooks/useLanguage';
import { briefCode, decodeBrief, type Brief } from '../utils/brief';
import { slug } from '../utils/card';
import { PageShell } from './PageShell';

type State = { kind: 'loading' } | { kind: 'ok'; brief: Brief } | { kind: 'error' };

/**
 * /brief?d=… : reconstitue la carte de brief depuis son lien.
 * Le paramètre est décodé puis VALIDÉ (forme, valeurs, longueurs) ; en cas de problème,
 * une page d'erreur propre s'affiche. Tout est rendu comme texte (React), jamais en HTML brut.
 */
export function BriefPage() {
  const { t } = useLanguage();
  const b = t.brief;
  const p = t.briefPage;
  const [state, setState] = useState<State>({ kind: 'loading' });
  const cardRef = useRef<SVGSVGElement>(null);
  const actions = useCardActions({ downloaded: b.downloaded, copied: b.copied, error: b.error });

  useEffect(() => {
    document.title = p.title;
  }, [p.title]);

  useEffect(() => {
    const d = new URLSearchParams(window.location.search).get('d');
    decodeBrief(d)
      .then((brief) => setState({ kind: 'ok', brief }))
      .catch(() => setState({ kind: 'error' }));
  }, []);

  if (state.kind === 'loading') {
    return (
      <PageShell backLabel={p.back}>
        <section className="wrap brief-page" aria-busy="true" />
      </PageShell>
    );
  }

  if (state.kind === 'error') {
    return (
      <PageShell backLabel={p.back}>
        <section className="wrap brief-page brief-page--error" aria-labelledby="brief-title">
          <p className="meta">BRF—????</p>
          <h1 id="brief-title" className="founder__title">
            {p.errorTitle}
          </h1>
          <p className="lead">{p.errorBody}</p>
          <a href={import.meta.env.BASE_URL} className="btn btn--solid">
            {p.back}
          </a>
        </section>
      </PageShell>
    );
  }

  const brief = state.brief;
  const code = briefCode(brief);
  const needs = brief.needs.map((n) => b.needs[n]);
  const deadline = brief.deadline ? b.deadlines[brief.deadline] : '';
  const budget = brief.budget ? b.budgets[brief.budget] : '';

  return (
    <PageShell backLabel={p.back}>
      <section className="wrap brief-page" aria-labelledby="brief-title">
        <p className="meta">BRF—{code}</p>
        <h1 id="brief-title" className="founder__title">
          {brief.name} — {brief.company}
        </h1>
        <p className="lead">{p.intro}</p>

        <div className="bcard bcard--single brief-page__card">
          <BriefCard
            ref={cardRef}
            name={brief.name}
            company={brief.company}
            sentence={brief.sentence}
            needs={needs}
            deadline={deadline}
            budget={budget}
            code={code}
            labels={b.card}
            placeholders={{ name: '', company: '', sentence: '' }}
            label={`${b.card.label} BRF—${code}`}
          />
        </div>

        {/* Version texte complète : lisible sans l'image, et par les lecteurs d'écran. */}
        <dl className="brief-page__facts">
          <div>
            <dt>{b.fields.sentence.label}</dt>
            <dd>{brief.sentence}</dd>
          </div>
          <div>
            <dt>{b.needsLabel}</dt>
            <dd>{needs.join(', ') || b.message.none}</dd>
          </div>
          <div>
            <dt>{b.deadlineLabel}</dt>
            <dd>{deadline || b.message.none}</dd>
          </div>
          <div>
            <dt>{b.budgetLabel}</dt>
            <dd>{budget || b.message.none}</dd>
          </div>
        </dl>

        <div className="cardmaker__actions">
          <button
            type="button"
            className="btn btn--solid"
            disabled={actions.busy}
            onClick={() => actions.downloadPng(() => [cardRef.current], CARD_W, CARD_H, `adwini-brief-${slug(brief.company)}-${code.toLowerCase()}.png`)}
          >
            {p.download}
          </button>
        </div>
        <p className="cardmaker__status" role="status">
          {actions.status}
        </p>
      </section>
    </PageShell>
  );
}
