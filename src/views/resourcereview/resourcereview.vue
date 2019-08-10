<template>
  <section class="vscroll">
    <el-col :span="24" class="ecrm-search-title">
      <a class="selected">资源审核</a>
    </el-col>

    <el-col :span="24" class="ecrm-content-panel">
      <el-form label-width="100px">
        <el-col :span="6">
          <el-form-item label="学段：">
            <el-select
              v-model="filters.order"
              placeholder="请选择活动学段"
              @change="onChangeOrder(filters.order)"
            >
              <el-option :label="order.label" :value="order.value" v-for="order in orders"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="年级：">
            <el-select v-model="filters.grade" placeholder="请选择活动年级">
              <el-option :label="grade.label" :value="grade.value" v-for="grade in grades"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="学期：">
            <el-select v-model="filters.term" placeholder="请选择活动学期">
              <el-option :label="term.label" :value="term.value" v-for="term in terms"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="学科：">
            <el-select v-model="filters.subject" placeholder="请选择活动学科">
              <el-option :label="subject.label" :value="subject.value" v-for="subject in subjects"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="资源类别：">
            <el-select v-model="filters.resourceclassification" placeholder="请选择活动资源类别">
              <el-option
                :label="resourceclassification.label"
                :value="resourceclassification.value"
                v-for="resourceclassification in resourceclassifications"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="资源类型：">
            <el-select v-model="filters.resourcetype" placeholder="请选择活动资源类型">
              <el-option
                :label="resourcetype.label"
                :value="resourcetype.value"
                v-for="resourcetype in resourcetypes"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="状态：">
            <el-select v-model="filters.status" placeholder="请选择活动状态">
              <el-option :label="state.label" :value="state.value" v-for="state in status"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="范围：">
            <el-select v-model="filters.scope" placeholder="请选择活动范围">
              <el-option :label="scope.label" :value="scope.value" v-for="scope in scopes"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="创建时间">
            <el-date-picker type="date" v-model="filters.create_time"></el-date-picker>-
            <el-date-picker type="date" v-model="filters.last_time"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-input v-model="filters.searchlabel"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button
            style="margin-left:10px"
            type="primary"
            v-on:click="getAccounts"
            id="searchBtn"
          >查询</el-button>
        </el-col>
      </el-form>

      <el-col :span="24" style="margin-bottom: 10px">
        <el-button
          style="float: right;"
          type="table-op"
          size="small"
          :disabled="this.sels.length===0"
          @click="funcAccept"
        >审核不通过</el-button>
        <el-button
          style="float: right; margin-right: 10px"
          type="table-op"
          size="small"
          :disabled="this.sels.length===0"
          @click="batchRemove"
        >审核通过</el-button>
      </el-col>

      <el-table
        :data="accounts"
        highlight-current-row
        v-loading="listLoading"
        @selection-change="selsChange"
        border
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <!--<el-table-column type="index" width="60" align="center">
        </el-table-column>-->
        <el-table-column prop="userid" label="资源名称" align="center"></el-table-column>
        <el-table-column prop="loginname" label="审核" align="center"></el-table-column>
        <el-table-column prop="realname" label="评分" align="center"></el-table-column>
      </el-table>

      <!--工具条-->
      <el-col :span="24" style="margin-bottom: 50px; margin-top: 30px;">
        <my-pagination
          @current-change="handleCurrentChange"
          @pgSize-change="handlePageSizeChange"
          :page-size="10"
          :total="total"
        ></my-pagination>
      </el-col>
    </el-col>
  </section>
</template>

<script>
import util from "../../common/js/util";
import {
  getAccountListPage,
  batchRemoveAccount,
  addAccount,
  editAccount,
  batchResetPassword,
  getRoleListPage,
  handleLock,
  handleAccept,
  getOrderList,
  getGradesOfOrder,
  getSubjectsOfOrder
} from "../../api/api";

export default {
  data() {
    return {
      filters: {
        order: "",
        grade: "",
        term: "",
        subject: "",
        resourceclassification: "",
        resourcetype: "",
        status: "",
        scope: "",
        create_time: "",
        last_time: "",
        searchlabel: ""
      },
      orders: [],
      grades: [],
      terms: [
        {
          value: "0",
          label: "全部"
        },
        {
          value: "1",
          label: "册"
        },
        {
          value: "2",
          label: "模块"
        }
      ],
      subjects: [],
      resourceclassifications: [
        {
          value: "0",
          label: "全部"
        },
        {
          value: "1",
          label: "课件"
        },
        {
          value: "2",
          label: "视频"
        },
        {
          value: "3",
          label: "音频"
        },
        {
          value: "4",
          label: "动画"
        },
        {
          value: "5",
          label: "试题"
        },
        {
          value: "6",
          label: "试卷"
        },
        {
          value: "7",
          label: "图片"
        },
        {
          value: "8",
          label: "文档"
        },
        {
          value: "9",
          label: "电子书"
        },
        {
          value: "10",
          label: "压缩文件"
        },
        {
          value: "11",
          label: "其他"
        }
      ],
      resourcetypes: [
        {
          value: "0",
          label: "全部"
        },
        {
          value: "1",
          label: "课件"
        },
        {
          value: "2",
          label: "视频"
        },
        {
          value: "3",
          label: "音频"
        },
        {
          value: "4",
          label: "动画"
        },
        {
          value: "5",
          label: "试题"
        },
        {
          value: "6",
          label: "试卷"
        },
        {
          value: "7",
          label: "图片"
        },
        {
          value: "8",
          label: "文档"
        },
        {
          value: "9",
          label: "电子书"
        },
        {
          value: "10",
          label: "压缩文件"
        },
        {
          value: "11",
          label: "其他"
        }
      ],
      status: [
        {
          value: "0",
          label: "待审核"
        },
        {
          value: "1",
          label: "已审核"
        },
        {
          value: "0",
          label: "已驳回"
        }
      ],
      scopes: [
        {
          value: "0",
          label: "全部"
        },
        {
          value: "1",
          label: "全网"
        },
        {
          value: "2",
          label: "本省"
        },
        {
          value: "3",
          label: "本市"
        },
        {
          value: "4",
          label: "本区"
        },
        {
          value: "5",
          label: "本校"
        }
      ],
      accounts: [],
      total: 0,
      page: 1,
      listLoading: false,
      sels: [] //列表选中列
    };
  },
  methods: {
    onChangeOrder(order) {
      this.getGradesOfOrder(order);
      this.getSubjectsOfOrder(order);
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getAccounts();
    },
    // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
    // Modify Reason : Bug Number #491
    // Data Start : 2019-1-28 11:05 AM
    handlePageSizeChange(pageSize) {
      this.page_size = pageSize;
      this.getAccounts();
    },
    // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
    // Data End : 2019-1-28 12:35 AM
    getAccounts() {
      let para = {
        pageno: this.page,
        pagesize: 10,
        loginname: this.filters.order,
        realname: this.filters.grade,
        loginemail: this.filters.term,
        loginmobile: this.filters.subject,
        idcardno: this.filters.resourceclassification,
        create_time:
          !this.filters.create_time || this.filters.create_time == ""
            ? ""
            : util.formatDate.format(
                new Date(this.filters.create_time),
                "yyyy-MM-dd"
              ),
        last_time:
          !this.filters.last_time || this.filters.last_time == ""
            ? ""
            : util.formatDate.format(
                new Date(this.filters.last_time),
                "yyyy-MM-dd"
              )
      };
      this.listLoading = true;
      getAccountListPage(para).then(res => {
        this.total = res.data.total;
        this.accounts = res.data.list;
        this.listLoading = false;
      });
    },
    selsChange: function(sels) {
      this.sels = sels;
    },
    getOrders() {
      getOrderList().then(res => {
        this.orders = res.orders;
      });
    },
    getGradesOfOrder(order) {
      getGradesOfOrder({ order: order }).then(res => {
        this.grades = res.grades;
      });
    },
    getSubjectsOfOrder(order) {
      getSubjectsOfOrder({ order: order }).then(res => {
        this.subjects = res.subjects;
      });
    }
  },
  mounted() {
    this.getAccounts();
    this.getOrders();
  }
};
</script>

<style lang="scss" scoped>
@import "~scss_vars";
</style>