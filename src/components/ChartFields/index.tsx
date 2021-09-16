import _ from 'lodash';
import styles from './index.module.less';
import cx from 'classnames';
import { currentChartSelector } from '../../modules/reportEditor/selectors';
import { currentChartFieldIdAtom } from '../../modules/chartEditor/atom';
import { useRecoilValue } from 'recoil';
import { DeleteOutlined } from '@ant-design/icons';
import { useChartEditorActions } from '../../modules/chartEditor/hooks';
import React from 'react';
import { IChartField, EDeleteChartFieldTypes } from '../../types';

export default function ChartFields() {
  const currentFieldId = useRecoilValue(currentChartFieldIdAtom);
  const currentChart = useRecoilValue(currentChartSelector);
  const { selectChartField, deleteChartField } = useChartEditorActions();

  const onClickDeleteIcon = (event: React.MouseEvent, chartFieldId: string) => {
    event.stopPropagation();
    deleteChartField(chartFieldId, EDeleteChartFieldTypes.DELETE_AT_CHART_FIELD);
  };

  const onClickChartFieldItem = (chartField: IChartField) => {
    selectChartField(chartField);
  };

  const chartFieldsNodes = _.map(_.get(currentChart, 'fields', []), (chartFieldItem) => {
    return (
      <div
        className={cx(styles.chartImg, {
          [styles.active]: chartFieldItem.chartFieldId === currentFieldId,
        })}
        key={chartFieldItem.chartFieldId}
        onClick={() => {
          onClickChartFieldItem(chartFieldItem);
        }}
      >
        <div className={styles.fieldItemWrap}>
          {chartFieldItem?.name}
          <div
            className={cx('deleteIcon', {
              deleteIconActive: chartFieldItem.chartFieldId === currentFieldId
            })}
          >
            <DeleteOutlined
              onClick={(event) => {
                onClickDeleteIcon(event, chartFieldItem.chartFieldId);
              }}
            />
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className={styles.chartPicker}>
      {chartFieldsNodes}
    </div>
  );
}