import _ from 'lodash';
import { GetRecoilValue, selector } from 'recoil';
import { IChart } from '../../types';
import { currentReportInfoSelector } from '../report/selectors';
import { currentChartIdAtom, } from './atom';

export const currentChartSelector = selector<IChart | null>({
  key: 'currentChart',
  get: ({ get }) => {
    const charts = getChartList(get);
    const currentChartId = get(currentChartIdAtom);
    return _.find(charts, (chart) => {
      return chart.id === currentChartId;
    }) || null;
  },
});

export const chartListSelector = selector<IChart[]>({
  key: 'chartList',
  get: ({ get }) => {
    return getChartList(get);
  },
});

function getChartList(get: GetRecoilValue) {
  const currentReport = get(currentReportInfoSelector);
  if (!currentReport) {
    return [];
  }
  const { charts } = currentReport;
  return charts;
}