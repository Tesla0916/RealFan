import { IReport, IChart, IChartField, EDeleteChartFieldTypes } from '../../types';

import { useCallback } from 'react';
import { useRecoilValue, useSetRecoilState, useRecoilState } from 'recoil';
import { chartStore, chartFieldStore, reportStore } from '../../store';
import { currentChartTypeAtom, currentChartFieldIdAtom } from './atom';
import { currentChartIdAtom } from '../reportEditor/atom';
import { currentReportIdAtom } from '@/modules/report/atom';
import { dataSetsAtom, currentDataSetIdAtom, currentDsFieldIdAtom } from '../dataset/atom';
import _ from 'lodash';

export function useChartEditorActions() {
  const setCurrentChartType = useSetRecoilState(currentChartTypeAtom);
  const setStoreOfChart = chartStore.useSetState();

  // const currentChart = useRecoilValue(currentChartSelector) 等同于下面写法
  const [currentChartId, setChartId] = useRecoilState(currentChartIdAtom);
  const currentChart = chartStore.useGetValue(currentChartId) as IChart;

  // const setCurrentFieldId = useSetRecoilState(currentChartFieldIdAtom);
  const setCurrentDataSetId = useSetRecoilState(currentDataSetIdAtom);
  const setCurrentDataSetFieldId = useSetRecoilState(currentDsFieldIdAtom);
  const dataSetsList = useRecoilValue(dataSetsAtom);

  const [currentChartField, setCurrentChartField] = useRecoilState(currentChartFieldIdAtom);
  const removeChartField = chartFieldStore.useRemoveState();

  // 修改图表类型
  const selectChartType = useCallback((chartType: string) => {
    setCurrentChartType(chartType);
    const chartId = currentChart?.id;
    if (!chartId) {
      return;
    }
    const currentChartType = currentChart?.type;
    if (currentChartType === chartType) {
      return;
    }
    // 修改当前chart的type
    setStoreOfChart(chartId, {
      type: chartType,
    });
  }, [setStoreOfChart, setCurrentChartType, currentChart]);

  // 点击图表字段，高亮选中并且高亮对应数据集中的字段
  const selectChartField = useCallback((chartField: IChartField) => {
    const { chartFieldId, dsFieldId } = chartField;
    setCurrentChartField(chartFieldId);
    const dataSetId = _.get(
      _.filter(dataSetsList, (dataset) => {
        return _.some(dataset.fields, (datasetField) => {
          return datasetField.id === dsFieldId;
        });
      }),
      '0.id'
    );
    setCurrentDataSetId(dataSetId);
    setCurrentDataSetFieldId(dsFieldId);
  }, [setCurrentChartField, dataSetsList, setCurrentDataSetId, setCurrentDataSetFieldId]);

  // 删除图表中的字段 1. 在图表字段中点击 icon删除 2. 在其他地方删除
  const deleteChartField = useCallback((chartFieldId: string, deleteType: EDeleteChartFieldTypes) => {
    if (deleteType === EDeleteChartFieldTypes.DELETE_AT_CHART_FIELD) {
      if (chartFieldId === currentChartField) {
        removeChartField([chartFieldId]);
        setCurrentChartField('');
      }
    } else if (deleteType === EDeleteChartFieldTypes.DELETE_AT_DATASET_FIELD_MODAL) {
      removeChartField([chartFieldId]);
    }
  }, [removeChartField, setCurrentChartField, currentChartField]);

  const setReportId = useRecoilValue(currentReportIdAtom);
  const [currentReport, setReports] = reportStore.useState(setReportId);

  const addChart = useCallback((type: string) => {
    const { charts } = currentReport as IReport;
    const chartId = _.uniqueId('report_new_chart_');

    // 创建一个新的chart
    setReports(setReportId, {
      ...currentReport,
      charts: charts.concat([{
        name: `${chartId}`,
        type,
        id: chartId,
        dsId: '',
        fields: []
      }])
    });

    // 选中新建的chart
    setChartId(chartId);
  }, [currentReport, setReports, setReportId, setChartId]);

  return {
    selectChartType,
    selectChartField,
    deleteChartField,
    addChart,
  };
}