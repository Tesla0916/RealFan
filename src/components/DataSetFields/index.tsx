import cx from 'classnames';
import _ from 'lodash';
import { useRecoilState, useRecoilValue } from 'recoil';
import styles from './index.module.less';
import { currentDsFieldIdAtom } from '../../modules/dataset/atom';
import { dataSetFieldsSelector } from '../../modules/dataset/selectors';
import { PlusOutlined, FormOutlined } from '@ant-design/icons';
import DatasetFieldModal from './DsFieldModal';
import { useState, useCallback, } from 'react';
import { chartStore } from '@/store';
import { currentChartSelector } from '@/modules/reportEditor/selectors';

export default function DataSetFields() {
  const dsFields = useRecoilValue(dataSetFieldsSelector);
  const [currentDsFieldId, setCurrentDsFieldId] = useRecoilState(currentDsFieldIdAtom);
  const addDataSetFieldsToChart = useAddDataSetFieldsToChart();

  const [modalVisible, setModalVisible] = useState(false);

  // TODO 把这两个方法包成一个方法
  // 通过表字段的点击 将其增加到图表字段中
  const addDsFieldToCurrentChartFields = (event: React.MouseEvent, dsFieldId: string) => {
    event.stopPropagation();
    addDataSetFieldsToChart(dsFieldId);
  };

  const editDsField = (event: React.MouseEvent) => {
    event.stopPropagation();
    setModalVisible(true);
  };

  const onModalCancel = () => {
    setModalVisible(false);
  };

  const fieldNodes = _.map(dsFields, (field, i) => {
    return (
      <div
        className={cx(styles.dsField, {
          [styles.active]: field.id === currentDsFieldId,
        })}
        key={i}
        onClick={() => {
          setCurrentDsFieldId(field.id);
        }}
      >
        <div className={styles.dsFieldWrap}>
          {field.name}
          <div
            className={cx(styles.addIcon, {
              [styles.iconActive]: field.id === currentDsFieldId
            })}
          >
            <FormOutlined onClick={(event) => editDsField(event)} />
            <PlusOutlined onClick={(event) => addDsFieldToCurrentChartFields(event, field.id)} />
          </div>
        </div>
      </div>
    );
  });

  return (
    <>
      <div className={styles.dataSetFields}>
        {fieldNodes}
      </div>
      { modalVisible && <DatasetFieldModal onModalCancel={onModalCancel} modalVisible={modalVisible} /> }
    </>
  );
}

function useAddDataSetFieldsToChart() {
  const currentChart = useRecoilValue(currentChartSelector);
  const setStoreOfChart = chartStore.useSetState();
  // 将选中的数据集字段添加到当前图表字段中去
  return useCallback((dsFieldId: string) => {
    if (!currentChart) {
      return;
    }
    const newChartFieldList = _.cloneDeep(_.get(currentChart, 'fields'));
    const isExisted = _.findIndex(newChartFieldList, { dsFieldId }) > -1;

    if (isExisted) {
      return;
    }

    const newChartField = {
      chartFieldId: dsFieldId,
      dsFieldId,
      name: `新增 + ${dsFieldId}`
    };

    newChartFieldList.push(newChartField);
    const chartId = currentChart?.id;

    setStoreOfChart(chartId, {
      fields: newChartFieldList
    });
  }, [currentChart, setStoreOfChart]);
}
