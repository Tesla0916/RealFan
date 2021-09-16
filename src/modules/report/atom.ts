import { atom, selector } from 'recoil';
import _ from 'lodash';

export const reportIdsAtom = atom<string[]>({
  key: 'reports',
  default: [],
});

const defaultReportIdSelector = selector<string>({
  key: 'currentReportIdSelector',
  get: ({ get }) => {
    return _.get(get(reportIdsAtom), '0');
  },
});

export const currentReportIdAtom = atom<string>({
  key: 'currentReportId',
  default: defaultReportIdSelector,
});
