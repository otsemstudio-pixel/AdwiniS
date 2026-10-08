import { Section } from '../components/Section';
import { isPlaceholder, site } from '../data/site';
import { useLanguage } from '../hooks/useLanguage';

/** Pas de formulaire (aucun backend) : WhatsApp en premier et en grand, puis e-mail et réseaux. */
export function Contact({ index }: { index: number }) {
  const { t } = useLanguage();
  const c = t.contact;
  const waHref = `https://wa.me/${site.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(c.whatsappMessage)}`;

  return (
    <Section id="contact" index={index} label={c.label} title={c.title} aside={<p className="lead">{c.intro}</p>} className="contact">
      <a href={waHref} className="contact__whatsapp" target="_blank" rel="noopener noreferrer">
        <span className="contact__whatsapp-label">{c.whatsapp}</span>
        <span className="contact__detail">
          {isPlaceholder(site.whatsappNumber) ? site.whatsappNumber : `+${site.whatsappNumber}`}
        </span>
        <svg className="contact__arrow" viewBox="0 0 48 48" width="40" height="40" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 40L40 8M18 8H40V30" />
        </svg>
      </a>
      <div className="contact__secondary">
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
    </Section>
  );
}
