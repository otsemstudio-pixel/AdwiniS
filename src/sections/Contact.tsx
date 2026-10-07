import { Section } from '../components/Section';
import { isPlaceholder, site } from '../data/site';
import { useLanguage } from '../hooks/useLanguage';

/** Pas de formulaire (aucun backend) : WhatsApp en premier, puis e-mail et réseaux. */
export function Contact({ index }: { index: number }) {
  const { t } = useLanguage();
  const c = t.contact;
  const waHref = `https://wa.me/${site.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(c.whatsappMessage)}`;

  return (
    <Section id="contact" index={index} label={c.label} title={c.title} aside={<p className="lead">{c.intro}</p>} className="contact">
      <div className="contact__grid">
        <a href={waHref} className="contact__whatsapp cut" target="_blank" rel="noopener noreferrer">
          <span className="code">WHA—001</span>
          <span className="contact__whatsapp-label">{c.whatsapp}</span>
          <span className="contact__detail">
            {isPlaceholder(site.whatsappNumber) ? site.whatsappNumber : `+${site.whatsappNumber}`}
          </span>
          <span className="contact__arrow" aria-hidden="true">
            →
          </span>
        </a>
        <div className="contact__secondary">
          <a href={`mailto:${site.email}`} className="contact__link">
            <span className="contact__link-label">{c.email}</span>
            <span className="contact__detail">{site.email}</span>
          </a>
          <div className="contact__socials">
            <p className="contact__link-label">{c.socials}</p>
            <ul className="contact__social-list">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} className="contact__social" target="_blank" rel="noopener noreferrer">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
