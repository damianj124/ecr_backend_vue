import Vue from 'vue'
// Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
// Modify Reason : Bug Number #491
// Data Start : 2019-1-28 11:05 AM

Vue.component('my-pagination', {
  template: '<div class="my-pagination" v-if="total > 0">\
          <el-button @click="toPage(0)" class="ecrm-mode-page-index">首页</el-button>\
          <el-button @click="toPage(curPg-1)" class="ecrm-mode-page-num">上一页</el-button>\
          <el-button v-if="Math.floor((curPg-1)/pgSize) * pgSize + 1 > 5" @click="toPage(Math.floor((curPg-1)/pgSize) * pgSize)">...</el-button>\
          <el-button v-for="i in pages" @click="toPage(i)" :class="{\'el-button--primary\':i==curPg}" :key="i" :data="i">{{ i }}</el-button>\
          <el-button v-if="Math.floor((curPg-1)/pgSize) * pgSize + 5 < lastPg" @click="toPage(Math.floor((curPg-1)/pgSize) * pgSize + 6)">...</el-button>\
          <el-button @click="toPage(curPg+1)">下一页</el-button>\
          <el-button @click="toPage(lastPg)">尾页</el-button>\
          <div style="display:inline-block">\
            <span>\
              &nbsp;共{{ total }}条&nbsp;\
            </span>\
            <span>\
                到\
                <el-input style="display:inline-block; width: 100px;" v-model="toPg"></el-input>\
                页\
            </span>\
            <span>\
              <el-select @change="changePageSize(pgSize)" v-model="pgSize">\
                <el-option label="5" value=5></el-option>\
                <el-option label="25" value=25></el-option>\
                <el-option label="50" value=50></el-option>\
              </el-select>\
            </span>\
          </div>\
          <span>\
            <el-button type="primary" @click="toPage(toPg)">确定</el-button>\
          </span>\
        </div>',
  replace: true,
  props: {
    page: {
      type: Number,
      default: 1,
      required: false
    },
    total: {
      type: Number,
      default: 0,
      required: true
    },
    pageSize: {
      type: Number,
      default: 5,
      required: false
    },
    pagetotal: {
      type: Number,
      default: 0,
      required: true
    }
  },
  watch: {
    total: function (val, oldVal) {
      this.lastPg = Math.ceil(val / this.pageSize);
    },
    curPg: function (val, oldVal) {
      this.toPg = val;
    },
    page: function(val, oldVal) {
      this.curPg = val;
    },
    pgSize: function(val, oldVal) {
      this.pgSize = val;
    }
  },
  data: function () {
    return {
      curPg: this.page,
      lastPg: 1,
      toPg: 1,
      pgSize: 5
    }
  },
  computed: {
    pages: function() {
      var startPg = Math.floor((this.curPg-1)/this.pgSize) * this.pgSize + 1;
      var endPg = Math.min(this.lastPg, Math.floor((this.curPg-1)/this.pgSize) * this.pgSize + 5);
      var pageNums = [];
      for (var i=startPg; i<=endPg; i++) {
        pageNums.push(i);
      }
      if ((pageNums.length > 0) && (pageNums.length < this.toPg) && (this.pagetotal == 0))
        this.$emit('current-change', 1);
      return pageNums;
    }
  },
  methods: {
    toPage: function(pg) {
      if (pg < 1) pg = 1;
      if (pg > this.lastPg) pg = this.lastPg;
      this.curPg = pg;

      this.$emit('current-change', parseInt(this.curPg));
    },
    changePageSize: function(pgSize) {
      this.lastPg = Math.ceil(this.total / pgSize);
      this.$emit('pgSize-change', parseInt(pgSize));
    }
  }
});


// Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
// Data End : 2019-1-28 12:35 AM