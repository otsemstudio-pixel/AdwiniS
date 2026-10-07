import fr from './content.fr';
import en from './content.en';
import type { Content, Lang } from './types';

export const contents: Record<Lang, Content> = { fr, en };
export const languages: Lang[] = ['fr', 'en'];
export type { Content, Lang };
