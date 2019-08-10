<template>
  <table class="ecrm-table-main ecrm-table-long-main">
    <tr class="ecrm-table-header">
      <th class="ecrm-table-name-main">层级</th>
      <th class="ecrm-table-name">合计</th>
      <th class="ecrm-table-name">课件</th>
      <th class="ecrm-table-name">教学设计</th>
      <th class="ecrm-table-name">拓展文本</th>
      <th class="ecrm-table-name">试卷</th>
      <th class="ecrm-table-name">图片</th>
      <th class="ecrm-table-name">视频</th>
      <th class="ecrm-table-name">音频</th>
      <th class="ecrm-table-name">动画(SWF)</th>
      <th class="ecrm-table-name">动画(H5)</th>
      <th class="ecrm-table-name">电子书</th>
      <th class="ecrm-table-name">压缩文件</th>
      <th class="ecrm-table-name">其他</th>
    </tr>
    <tr v-for="(item, idx) in data" :key="idx" :data="item">
      <td> <span class="ecrm-table-left-list"></span>{{item.label}} </td>
      <td class="ecrm-table-text"> {{item.resCnt[15].count}} </td>
      <td class="ecrm-table-text"> {{item.resCnt[0].count}} </td>
      <td class="ecrm-table-text"> {{item.resCnt[1].count}} </td>
      <td class="ecrm-table-text"> {{item.resCnt[2].count}} </td>
      <td class="ecrm-table-text"> {{item.resCnt[3].count}} </td>
      <td class="ecrm-table-text"> {{item.resCnt[4].count}} </td>
      <td class="ecrm-table-text"> {{item.resCnt[5].count}} </td>
      <td class="ecrm-table-text"> {{item.resCnt[6].count}} </td>
      <td class="ecrm-table-text"> {{item.resCnt[7].count}} </td>
      <td class="ecrm-table-text"> {{item.resCnt[8].count}} </td>
      <td class="ecrm-table-text"> {{item.resCnt[9].count}} </td>
      <td class="ecrm-table-text"> {{item.resCnt[10].count}} </td>
      <td class="ecrm-table-text"> {{item.resCnt[11].count}} </td>
    </tr>
  </table>
</template>

<script>
  import ECRUtil from '../../../common/js/util'

  export default {
    props: {
      data: {
        type: Array,
        default: [],
        required: true
      },
    },
    data: function() {
      return {
        ECRUtil:ECRUtil
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~scss_vars';
  .ecrm-table-main{width:100%;table-layout: auto; border: 1px solid #dadbdb;}
  .ecrm-table-header{height: 50px; background: #07b9ad;color: #fff;}
  .ecrm-table-name{width:85px;text-align:center;}
  .ecrm-table-form,.ecrm-table-form-long{width:170px;height:35px;border:1px solid #c8c6c4;border-radius:2px;padding: 0px 10px;box-sizing: border-box;}
  .ecrm-table-form-long{width:354px;}
  .ecrm-table-text{width:85px;text-align:center;}
  .ecrm-table-name-main{width:50%;text-align:center;}
  .ecrm-table-last{table-layout: fixed;}
  .ecrm-table-main td{padding-bottom:20px;}
  .ecrm-table-left-list {
        background: url('../../../../static/img/ecrm-icon-open-open.png') no-repeat left center;
        width: 18px;
        height: 11px;
        display: inline-block;
    }
</style>