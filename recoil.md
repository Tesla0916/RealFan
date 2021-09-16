1. 中介者的模块划分如何界定，一个模块影响多个模块如何操作

2. 如果我直接从一个模块去影响另一个模块会有什么问题

3. set(chartId, { type: currentType }) 的时候，是如何做到 useRecoilValue(currentChartSelector); 和 useRecoilValue(chartStore.getDataSelector(currentChartId)) 保持一直的
如果说set是改变了前端存储的唯一一份数据的话，那么我之前存的currentChart为什么会发生改变 => 中间的数据是如何映射的

set() => 使得 reports 发生变化 => 所以 chartList 发生变化 => currentChartSelector 变化被监听 => currentChart 发生变化 



## 重点进展

* 设计并实现较为复杂的数据流使用场景，验证当前框架中数据流库，在设计场景下，数据流工作良好;
* 通过CR的方式对齐团队的编码规范;

## 下周工作
* 整理数据流库与开发框架结合使用的开发文档;
* 参照竞品Alation data整体产品的设计模块，分析其中模块实现流程，运用当前数据流框架还原部分功能;