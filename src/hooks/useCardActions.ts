import { useCallback, useState } from 'react';
import { copyText, downloadBlob } from '../utils/card';

export interface ActionMessages {
  downloaded: string;
  copied: string;
  shared?: string;
  error: string;
}

interface PngOptions {
  /** Densité de sortie : 2 = export standard, 3 = haute définition. */
  scale?: number;
  /** Marge autour des faces, en unités de carte (0 pour un format exact). */
  gap?: number;
  background?: string;
}

/**
 * Actions communes à toutes les cartes (visite, fondateur, brief) :
 * export PNG, fichier texte (.vcf), partage natif avec repli sur copie du lien.
 * Un seul état « occupé / message » par carte, annoncé dans une zone role="status".
 */
export function useCardActions(messages: ActionMessages) {
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  const run = useCallback(
    async (action: () => Promise<string | void>) => {
      setBusy(true);
      setStatus('');
      try {
        const message = await action();
        if (message) setStatus(message);
      } catch (err) {
        // L'utilisateur a fermé la feuille de partage : ce n'est pas une erreur.
        if ((err as DOMException)?.name !== 'AbortError') setStatus(messages.error);
      } finally {
        setBusy(false);
      }
    },
    [messages.error],
  );

  /** Rendu PNG des faces SVG (chargé à la demande avec les polices incorporées). */
  const png = useCallback(async (faces: (SVGSVGElement | null)[], w: number, h: number, opts: PngOptions = {}) => {
    const { facesToPng } = await import('../utils/exportCard');
    const list = faces.filter(Boolean) as SVGSVGElement[];
    return facesToPng(list, w, h, opts.background ?? '#FAF8F4', opts.scale ?? 2, opts.gap ?? 40);
  }, []);

  const downloadPng = useCallback(
    (faces: () => (SVGSVGElement | null)[], w: number, h: number, filename: string, opts?: PngOptions) =>
      run(async () => {
        downloadBlob(await png(faces(), w, h, opts), filename);
        return messages.downloaded;
      }),
    [run, png, messages.downloaded],
  );

  const downloadFile = useCallback(
    (content: string, type: string, filename: string) =>
      run(async () => {
        downloadBlob(new Blob([content], { type }), filename);
        return messages.downloaded;
      }),
    [run, messages.downloaded],
  );

  const copyLink = useCallback(
    (url: string) => run(async () => ((await copyText(url)) ? messages.copied : messages.error)),
    [run, messages.copied, messages.error],
  );

  /** Partage natif (avec l'image si possible), sinon copie du lien. */
  const share = useCallback(
    (opts: { url: string; title: string; text: string; file?: () => Promise<File> }) =>
      run(async () => {
        if (navigator.share) {
          const payload: ShareData = { title: opts.title, text: opts.text, url: opts.url };
          try {
            const file = opts.file && (await opts.file());
            if (file && navigator.canShare?.({ files: [file] })) payload.files = [file];
          } catch {
            /* pas d'image : on partage le lien seul */
          }
          await navigator.share(payload);
          return messages.shared;
        }
        return (await copyText(opts.url)) ? messages.copied : messages.error;
      }),
    [run, messages.shared, messages.copied, messages.error],
  );

  return { status, busy, run, png, downloadPng, downloadFile, copyLink, share };
}
