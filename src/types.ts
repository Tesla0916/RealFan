export interface IReport {
  id: string;
  name: string;
  charts: IChart[];
}

export interface INormalizedReport {
  id: string;
  name: string;
  charts: string[];
}

export interface IChart {
  id: string;
  name: string;
  type: string;
  fields: IChartField[];
  dsId: string;
}

export interface INormalizedChart {
  id: string;
  name: string;
  type: string;
  fields: string[];
  dsId: string;
}

export interface IChartField {
  chartFieldId: string;
  dsFieldId: string;
  name: string;
}

export interface IDataSet {
  id: string;
  name: string;
  fields: IDataSetField[];
}

export interface INormalizedDataSet {
  id: string;
  name: string;
  fields: string[];
}

export interface IDataSetField {
  id: string;
  name: string;
  dataType: string;
}

export interface IReportsDetail {
  reportId: string;
  chartName: string;
  chartId: string;
  chartFieldName: string;
  dsFieldId: string;
  chartFieldId: string;
}

export interface IDatasetFieldDetail extends IDataSetField {
  dsFieldCitedList: IReportsDetail[]
}

export enum EDatasetFieldsTypes {
  VIEW_CHART_FIELDS,
  DELETE_CHART_FIELDS
}

export enum EDeleteChartFieldTypes {
  DELETE_AT_CHART_FIELD,
  DELETE_AT_DATASET_FIELD_MODAL
}