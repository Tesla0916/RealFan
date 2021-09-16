import cx from 'classnames';
import _ from 'lodash';
import { useRecoilState, useRecoilValue, useSetRecoilState, } from 'recoil';
import { currentChartIdAtom, } from '../../modules/reportEditor/atom';
import styles from './index.module.css';
import { chartListSelector } from '../../modules/reportEditor/selectors';
import { currentChartFieldIdAtom } from '../../modules/chartEditor/atom';
import { IChart } from '@/types';

export default function ReportEditor() {
  const chartList = useRecoilValue(chartListSelector);
  const [currentChartId, setCurrentChartId] = useRecoilState(currentChartIdAtom);
  const setCurrentChartFieldId = useSetRecoilState(currentChartFieldIdAtom);

  // chart可以反选
  const toggleChartSelectedStatus = (chart: IChart) => {
    if (currentChartId
      && chart.id === currentChartId) {
      setCurrentChartId('');
    } else {
      setCurrentChartId(chart.id);
    }
    setCurrentChartFieldId('');
  };

  const chartNodes = _.map(chartList, (chart, i) => {
    return (
      <div
        className={cx(styles.chart, {
          [styles.active]: chart.id === currentChartId,
        })}
        key={i}
        onClick={() => toggleChartSelectedStatus(chart)}
      >
        <div className={styles.chartName}>
          {chart.name}
        </div>
        <div className={styles.chartType}>
          {chart.type}
        </div>
        <div className={styles.chartType}>
          fields count:
          { chart?.fields.length }
        </div>
      </div>
    );
  });

  return (
    <div className={styles.reportEditor}>
      {chartNodes}
    </div>
  );
}