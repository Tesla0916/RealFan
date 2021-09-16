import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { currentChartSelector } from './reportEditor/selectors';
import { useChartEditorActions } from './chartEditor/hooks';

function useMediatorOfChartTypeWithCurrentChart() {
  /**
   * 报表编辑器中选中图表后，在图表编辑器中设置当前选中图表的图表类型
   */
  const currentChart = useRecoilValue(currentChartSelector);
  const { selectChartType } = useChartEditorActions();

  useEffect(() => {
    const newChartType = currentChart?.type;
    selectChartType(newChartType!);
  }, [currentChart, selectChartType]);
}

/**
 * 各module间的中介者，维护各module间的关联关系
 */

export default function useMediators() {
  useMediatorOfChartTypeWithCurrentChart();
}