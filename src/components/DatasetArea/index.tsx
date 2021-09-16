import { useRecoilValue, useRecoilState, } from 'recoil';
import cx from 'classnames';
import _ from 'lodash';
import { useEffect, useCallback } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { datasetStore, reportStore } from '@/store';
import styles from './index.module.css';
import { reportIdsAtom, } from '../../modules/report/atom';
import { dataSetsAtom, currentDataSetIdAtom } from '../../modules/dataset/atom';
import { dataSetFieldsSelector } from '@/modules/dataset/selectors';
import useDataSetModuleActions from '../../modules/dataset/hooks';
import { IReport } from '@/types';

export default function DataSetArea() {
  const dataSets = useRecoilValue(dataSetsAtom);
  const [currentDataSetId] = useRecoilState(currentDataSetIdAtom);
  const { initDataSets, changeDataSetId, } = useDataSetModuleActions();
  const deleteDataset = useDeleteDataset();

  useEffect(() => {
    initDataSets();
  }, [initDataSets]);

  const dataSetList = _.map(dataSets, (dataSet, i) => {
    return (
      <div
        className={cx(styles.dataSetItem, {
          [styles.active]: dataSet.id === currentDataSetId,
        })}
        key={i}
        onClick={() => {
          changeDataSetId(dataSet.id);
        }}
      >
        {dataSet.name}
        <div
          className={cx('deleteIcon', {
            deleteIconActive: dataSet.id === currentDataSetId,
          })}
        >
          <DeleteOutlined
            onClick={(e) => {
              e.stopPropagation();
              deleteDataset(dataSet.id);
            }}
          />
        </div>
      </div>
    );
  });

  return (
    <div className={styles.datasetArea}>
      {dataSetList}
    </div>
  );
}

// 删除数据集
const useDeleteDataset = () => {
  const datasetFields = useRecoilValue(dataSetFieldsSelector);
  const removeDataset = datasetStore.useRemoveState();
  const reportIds = useRecoilValue(reportIdsAtom);
  const [reportInfos, setReports] = reportStore.useState(reportIds);
  const { changeDataSetId, } = useDataSetModuleActions();

  const [dataSets, setDataSets] = useRecoilState(dataSetsAtom);

  return useCallback((id) => {
    // 所删除数据集下的所有字段
    const datasetFieldsIds = datasetFields.map((fields) => fields.id);

    // 获取清除数据集字段后的新报表
    const batchUpdatedReport = (reportInfos as IReport[])
      ?.map((report) => {
        const { charts } = report;
        const newCharts = charts.map((chart) => {
          const { fields } = chart;
          return {
            ...chart,
            fields: fields.filter((field) => !datasetFieldsIds.includes(field.dsFieldId))
          };
        });
        return {
          ...report,
          charts: newCharts,
        };
      });

    const newDatasets = dataSets.filter((dataset) => dataset.id !== id);

    // 删除数据集、清除报表上关联数据集及字段
    removeDataset(id);
    setDataSets(newDatasets);
    changeDataSetId(_.get(newDatasets, '0.id'));
    setReports(batchUpdatedReport);
  }, [dataSets,
    removeDataset,
    setDataSets,
    datasetFields,
    reportInfos,
    setReports,
    changeDataSetId]);
};