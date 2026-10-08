import type { ReactNode } from 'react';

export type Face = 'front' | 'back';

interface CardPreviewProps {
  face: Face;
  front: ReactNode;
  back: ReactNode;
  frontLabel: string;
  backLabel: string;
}

/** Aperçu d'une carte à deux faces, qui se retourne en 3D (transform uniquement). */
export function CardPreview({ face, front, back, frontLabel, backLabel }: CardPreviewProps) {
  return (
    <>
      <p className="cardmaker__face meta" aria-live="polite">
        {face === 'front' ? frontLabel : backLabel}
      </p>
      <div className={`bcard ${face === 'back' ? 'is-flipped' : ''}`}>
        <div className="bcard__inner">
          <div className="bcard__face bcard__face--front" aria-hidden={face !== 'front'}>
            {front}
          </div>
          <div className="bcard__face bcard__face--back" aria-hidden={face !== 'back'}>
            {back}
          </div>
        </div>
      </div>
    </>
  );
}
