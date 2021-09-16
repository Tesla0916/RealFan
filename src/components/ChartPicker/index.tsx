import _ from 'lodash';
import styles from './index.module.css';
import cx from 'classnames';
import { CHART_TYPES, currentChartTypeAtom, } from '../../modules/chartEditor/atom';
import { currentChartIdAtom } from '@/modules/reportEditor/atom';
import { useRecoilValue, } from 'recoil';
import { useChartEditorActions } from '../../modules/chartEditor/hooks';

export default function ChartPicker() {
  const currentChartType = useRecoilValue(currentChartTypeAtom);
  const { selectChartType, addChart } = useChartEditorActions(); // 可以改变图表类型
  const currentChartId = useRecoilValue(currentChartIdAtom);

  const onSelectTypeChange = (chartType: string) => {
    if (!currentChartId) {
    // 没有选中chart时创建一个新的表
      addChart(chartType);
    }
    selectChartType(chartType);
  };

  const chartTypeNodes = _.map(CHART_TYPES, (chartType, i) => {
    return (
      <div
        className={cx(styles.chartImg, {
          [styles.active]: chartType === currentChartType,
        })}
        key={i}
        onClick={() => onSelectTypeChange(chartType)}
      >
        {chartType}
      </div>
    );
  });

  return (
    <div className={styles.chartPicker}>
      {chartTypeNodes}
    </div>
  );
}