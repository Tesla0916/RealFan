import {
  IChartField, INormalizedChart, INormalizedDataSet, IChart, IReport, IDataSet, IDataSetField, INormalizedReport
} from '../types';
import initModel from '@aloudata/recoil-normalize-orm';

const ReportConfig = {
  name: 'Report',
  idAttr: 'id',
  fields: {
    charts: 'Chart',
  },
};

const ChartConfig = {
  name: 'Chart',
  idAttr: 'id',
  fields: {
    fields: 'ChartField'
  }
};

const ChartFieldConfig = {
  name: 'ChartField',
  idAttr: 'chartFieldId'
};

const DatasetConfig = {
  name: 'Dataset',
  idAttr: 'id',
  fields: {
    fields: 'DatasetField'
  }
};

const DatasetFieldConfig = {
  name: 'DatasetField',
  idAttr: 'id',
};

const { createModel, } = initModel();

export const reportStore = createModel<IReport, INormalizedReport>(ReportConfig);
export const chartStore = createModel<IChart, INormalizedChart>(ChartConfig);
export const chartFieldStore = createModel<IChartField>(ChartFieldConfig);
export const datasetStore = createModel<IDataSet, INormalizedDataSet>(DatasetConfig);
export const datasetFieldStore = createModel<IDataSetField>(DatasetFieldConfig);