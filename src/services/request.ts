import _ from 'lodash';
import { IReport } from '../types';

/**
 * 获取数据源列表
 * @returns
 */
export function getDatasets() {
  const data = _.map(_.range(5), (i) => {
    return {
      id: `ds_${i}`,
      name: `dataSet${i}`,
      fields: _.map(_.range(20), (j) => {
        return {
          id: `ds_${i}_field_${j}`,
          name: `ds_${i}_field_${j}`,
          dataType: j % 2 ? 'string' : 'number',
        };
      }),
    };
  });
  return Promise.resolve(data);
}

export function getReports() {
  const data: IReport[] = _.map(_.range(5), (i) => {
    return {
      id: `report_${i}`,
      name: `report_${i}`,
      charts: _.map(_.range(6), (j) => {
        const dsId = `ds_${j % 2 ? 0 : 1}`;
        return {
          id: `report_${i}_chart_${j}`,
          name: `chart${j}`,
          type: j % 2 ? 'TABLE' : 'PIE',
          fields: _.map(_.range(10), (k) => {
            const id = `report_${i}_chart_${j}_${k}`;
            return {
              chartFieldId: id,
              dsFieldId: `${dsId}_field_${k}`,
              name: id,
            };
          }),
          dsId,
        };
      }),
    };
  });
  return Promise.resolve(data);
}
