import { atom, selector, } from 'recoil';
import _ from 'lodash';
import { IDataSet } from '../../types';

export const dataSetsAtom = atom<IDataSet[]>({
  key: 'dataSetList',
  default: [],
});

export const dataSetIdsAtom = atom<string[]>({
  key: 'dataSetIdsList',
  default: [],
});

const defaultDataSetIdSelector = selector<string>({
  key: 'currentDataSetIdSelector',
  get: ({ get, }) => {
    return _.get(get(dataSetsAtom), '0.id');
  },
});

export const currentDataSetIdAtom = atom<string>({
  key: 'currentDataSetId',
  default: defaultDataSetIdSelector,
});

export const currentDsFieldIdAtom = atom<string>({
  key: 'currentDsFieldId',
  default: '',
});

export const dsFieldModalVisibleAtom = atom<boolean>({
  key: 'dsFieldModalVisible',
  default: false
});
