import _ from 'lodash';
import { selector } from 'recoil';
import { currentDataSetIdAtom } from './atom';
import { datasetStore } from '../../store';
import { IDataSetField } from '../../types';

export const dataSetFieldsSelector = selector<IDataSetField[]>({
  key: 'dataSetFields',
  get: ({ get }) => {
    const currentDsId = get(currentDataSetIdAtom);
    // 从store去取回来
    if (currentDsId) {
      // 获取orm中当前的 dataset
      const dataset = datasetStore.getValue(get, currentDsId);
      const dsFieldList = _.get(dataset, 'fields', []);
      return dsFieldList;
    }
    return [];
  },
});
