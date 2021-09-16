import { useCallback } from 'react';
import { useResetRecoilState, useSetRecoilState } from 'recoil';
import { getDatasets } from '../../services/request';
import { currentDataSetIdAtom, currentDsFieldIdAtom, dataSetsAtom, dataSetIdsAtom } from './atom';
import { datasetStore } from '../../store';

export default function useDataSetModuleActions() {
  const setDataSets = useSetRecoilState(dataSetsAtom);
  const setCurrentDataSetId = useSetRecoilState(currentDataSetIdAtom);
  const resetCurrentDsFieldId = useResetRecoilState(currentDsFieldIdAtom);
  const setStoreOfDataset = datasetStore.useSetState();
  const setDataSetIdsAtom = useSetRecoilState(dataSetIdsAtom);

  // 初始化数据集数据
  const initDataSets = useCallback(async () => {
    const dataSets = await getDatasets();
    const ids = setStoreOfDataset(dataSets);
    setDataSetIdsAtom(ids as string[]);
    setDataSets(dataSets);
  }, [setStoreOfDataset, setDataSets, setDataSetIdsAtom]);

  // 切换选中数据集
  const changeDataSetId = useCallback((dsId: string) => {
    setCurrentDataSetId(dsId);
    // 清空已选的数据源字段id
    resetCurrentDsFieldId();
  }, [resetCurrentDsFieldId, setCurrentDataSetId]);

  return {
    initDataSets,
    changeDataSetId,
  };
}