import { useCallback } from 'react';
import { useResetRecoilState, useSetRecoilState, } from 'recoil';
import { getReports } from '../../services/request';
import { currentReportIdAtom, reportIdsAtom, } from './atom';
import { currentChartIdAtom } from '../reportEditor/atom';
import { currentChartTypeAtom } from '../chartEditor/atom';
import { reportStore } from '../../store';

export default function useReportModule() {
  const setReports = useSetRecoilState(reportIdsAtom);
  const setReportId = useSetRecoilState(currentReportIdAtom);
  const resetCurrentChartId = useResetRecoilState(currentChartIdAtom);
  const resetChartType = useResetRecoilState(currentChartTypeAtom);
  const setStoreOfReport = reportStore.useSetState();

  // 初始化报表数据
  const initReports = useCallback(async () => {
    const data = await getReports();
    // set 返回所有主键
    const ids = setStoreOfReport(data);
    setReports(ids as string[]);
  }, [setStoreOfReport, setReports]);

  // 报表页面切换
  const changeReportId = useCallback((reportId: string) => {
    setReportId(reportId);
    // 清空相关的数据 清空当前选中的图表高亮 清空当前图表的类型
    resetCurrentChartId();
    resetChartType();
  }, [setReportId, resetChartType, resetCurrentChartId]);

  return {
    initReports,
    changeReportId,
  };
}
