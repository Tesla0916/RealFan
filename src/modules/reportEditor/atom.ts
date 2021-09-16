import { atom } from 'recoil';

export const currentChartIdAtom = atom<string>({
  key: 'currentChartId',
  default: '',
});
