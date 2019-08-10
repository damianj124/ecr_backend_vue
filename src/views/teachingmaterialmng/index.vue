<template>
  <section>
    <el-col>
      <el-col :span="24" class="ecrm-search-title">
        <a class="selected">教材教辅管理</a>
      </el-col>

      <!-- Filter Panel -->
      <el-col :span="24" class="ecrm-content-panel">
        <el-form label-width="70px">
          <el-col :span="4">
            <el-form-item label="学段:">
              <el-select v-model="filters.schoolsectionid" @change="onSchoolSectionChange()">
                <el-option label="全部" value></el-option>
                <el-option
                  :label="item.dictname"
                  :value="item.dictvalue"
                  v-for="(item, idx) in schoolSections"
                  :key="idx"
                  :data="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="学科:">
              <el-select v-model="filters.subjectid" @change="getNaviEditionTypeList()">
                <el-option label="全部" value></el-option>
                <el-option
                  :label="item.dictname"
                  :value="item.dictvalue"
                  v-for="(item, idx) in subjects"
                  :key="idx"
                  :data="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="年级:">
              <el-select v-model="filters.gradeid">
                <el-option label="全部" value></el-option>
                <el-option
                  :label="item.dictname"
                  :value="item.dictvalue"
                  v-for="(item, idx) in grades"
                  :key="idx"
                  :data="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="版本:">
              <el-select v-model="filters.editiontypeid" @change="getNaviBookModelList()">
                <el-option label="全部" value></el-option>
                <el-option
                  :label="item.dictname"
                  :value="item.dictvalue"
                  v-for="(item, idx) in editionTypes"
                  :key="idx"
                  :data="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="册别:">
              <el-select v-model="filters.bookmodelid">
                <el-option label="全部" value></el-option>
                <el-option
                  :label="item.dictname"
                  :value="item.dictvalue"
                  v-for="(item, idx) in bookModels"
                  :key="idx"
                  :data="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="2">
            <el-form-item>
              <el-button type="primary" v-on:click="search" id="searchBtn">查询</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-col>
      <!-- filter end -->
      <el-col :span="24" style="margin-top: 10px; margin-bottom: 10px;">
        <el-button style="float: right;" type="table-op" size="small" @click="addBook">添加</el-button>
      </el-col>

      <el-col :span="24">
        <img
          src="static/img/ecrw-empty-data-resource.png"
          :style="{ width:(imageSize.width) + 'px', height:(imageSize.height) + 'px' }"
          v-if="books.length==0"
        >
        <el-table :data="books" v-loading="listLoading" style="width: 100%;" v-if="books.length>0">
          <el-table-column prop="bookname" align="center" label="名称"></el-table-column>
          <el-table-column prop="schoolsection" align="center" label="学段"></el-table-column>
          <el-table-column prop="subject" align="center" label="学科"></el-table-column>
          <el-table-column prop="grade" align="center" label="年级"></el-table-column>
          <el-table-column prop="editiontype" align="center" label="版本"></el-table-column>
          <el-table-column prop="bookmodel" align="center" label="册别"></el-table-column>
          <el-table-column prop="type" align="center" label="类型"></el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button size="small" @click="editBook(scope.$index, scope.row)">修改</el-button>
              <el-button size="small" @click="deleteBook(scope.$index, scope.row)">删除</el-button>
              <el-button size="small" @click="bookStatistics(scope.row)">资源统计</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-col :span="24" style="margin-bottom: 50px; margin-top: 30px;">
          <my-pagination
            @current-change="handleCurrentChange"
            @pgSize-change="handlePageSizeChange"
            :page="page"
            :page-size="page_size"
            :total="total"
            :pagetotal="page_total"
          ></my-pagination>
        </el-col>
      </el-col>
    </el-col>

    <!-- Add Teaching Material Dialog -->
    <el-dialog :size="dlgSize" :close-on-click-modal="false" v-model="addVisible">
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </el-dialog>

    <!-- Add Teaching Material Dialog End -->
    <!-- Teaching Material Statistics Dialog -->
    <el-dialog title="资源统计" :close-on-click-modal="true" v-model="statisticsVisible">
      <el-form label-width="80px">
        <el-form-item label="全体 :">
          <span class="ecrm-color-red">{{ totalGoodsCount }}</span>个
          <el-button
            style="float: right;"
            type="table-op"
            size="small"
            @click="doExport"
            :loading="exportLoading"
          >导出</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="bookInfo"
        style="width: 100%;"
        v-loading="statListLoading"
        v-if="bookInfo.length>0"
      >
        <el-table-column prop="name" align="center" label="资源类型"></el-table-column>
        <el-table-column prop="count" align="center" label="数量"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="statisticsVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <!-- Teaching Material Statistics Dialog End -->
  </section>
</template>

<script>
import ECRUtil from "../../common/js/util";
import {
  getBookInfoList,
  deleteBook,
  getSchoolSectionList,
  getSubjectList,
  getNaviGradeList,
  getNaviBookModelList,
  getNaviEditionTypeList,
  getGoodsStatisticsByBookid,
  exportToExcelInStatistics
} from "../../api/api";

export default {
  data() {
    return {
      ECRUtil: ECRUtil,
      filters: {
        schoolsectionid: "",
        subjectid: "",
        gradeid: "",
        editiontypeid: "",
        bookmodelid: ""
      },
      ////////// Filter Data /////////////
      schoolSections: [],
      subjects: [],
      grades: [],
      bookModels: [],
      editionTypes: [],
      /////////// Filter Data End //////////
      books: [],
      bookInfo: [],
      bookId: "",
      totalGoodsCount: 0,
      total: 0,
      page_size: 10,
      page: 1,
      page_total: 0,
      listLoading: false,
      statListLoading: false,
      addVisible: false,
      addLoading: false,
      exportLoading: false,
      dlgSize: "medium",
      statisticsVisible: false,
      imageSize: {
        width: 0,
        height: 0
      }
    };
  },
  watch: {
    addVisible: function(val, oldval) {
      if (val == false) {
        this.$router.push("/teachingmaterial");
      }
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val;
      this.load();
    },
    // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
    // Modify Reason : Bug Number #491
    // Data Start : 2019-1-28 11:05 AM
    handlePageSizeChange(pageSize) {
      this.page_size = pageSize;
      this.load();
    },
    // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
    // Data End : 2019-1-28 12:35 AM
    deleteBook(index, row) {
      this.$confirm("确认删除吗？", "提示", {
        type: "warning"
      }).then(() => {
        deleteBook(row.bookid)
          .then(res => {
            if (res.data.serverResult.resultCode == "200") {
              this.load();
            } else {
              this.$message({
                message: res.data.serverResult.resultMessage,
                type: "error"
              });
            }
          })
          .catch(() => {
            this.$message({
              message: "操作失败",
              type: "error"
            });
          });
      });
    },
    editBook(index, row) {
      this.addVisible = true;
      this.dlgSize = "large";
      this.$router.push("/teachingmaterial/edit/" + row.bookid);
    },
    addBook() {
      this.addVisible = true;
      this.dlgSize = "medium";
      this.$router.push("/teachingmaterial/add");
    },
    bookStatistics(row) {
      this.statisticsVisible = true;
      this.bookId = row.bookid;
      this.statListLoading = true;
      getGoodsStatisticsByBookid(row.bookid)
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.bookInfo = res.data.responseEntity.countInfo;
            this.totalGoodsCount = res.data.responseEntity.totalCount;
          } else {
            this.$message({
              message: res.data.serverResult.resultMessage,
              type: "error"
            });
          }
          this.statListLoading = false;
        })
        .catch(() => {
          this.statListLoading = false;

          this.$message({
            message: "加载失败!",
            type: "error"
          });
        });
    },
    doExport() {
      this.exportLoading = true;
      exportToExcelInStatistics(this.bookId)
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.ECRUtil.download(res.data.responseEntity.downloadUrl);
          } else {
            this.$message({
              message: res.data.serverResult.resultMessage,
              type: "error"
            });
          }
          this.exportLoading = false;
        })
        .catch(() => {
          this.exportLoading = false;

          this.$message({
            message: "操作失败",
            type: "error"
          });
        });
    },
    load() {
      let para = {
        pagination: {
          numPerPage: this.page_size,
          pageNo: this.page
        },
        conditions: [
          {
            fieldName: "schoolsectionid",
            fieldValues: [this.filters.schoolsectionid],
            prepender: null,
            operator: "EQUAL",
            childCondtions: null
          },
          {
            fieldName: "subjectid",
            fieldValues: [this.filters.subjectid],
            prepender: null,
            operator: "EQUAL",
            childCondtions: null
          },
          {
            fieldName: "gradeid",
            fieldValues: [this.filters.gradeid],
            prepender: null,
            operator: "EQUAL",
            childCondtions: null
          },
          {
            fieldName: "bookmodelid",
            fieldValues: [this.filters.bookmodelid],
            prepender: null,
            operator: "EQUAL",
            childCondtions: null
          },
          {
            fieldName: "editiontypeid",
            fieldValues: [this.filters.editiontypeid],
            prepender: null,
            operator: "EQUAL",
            childCondtions: null
          }
        ]
      };

      this.listLoading = true;
      getBookInfoList(para)
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.books = res.data.pageInfo.list;
            this.total = res.data.pageInfo.total;
            this.page_total = res.data.pageInfo.list.length;
            for (var i = 0; i < this.books.length; i++) {
              if (this.books[i].type == 1) {
                this.books[i].type = "教材";
              } else if (this.books[i].type == 2) {
                this.books[i].type = "教辅";
              }
            }
          } else {
            this.$message({
              message: res.data.serverResult.resultMessage,
              type: "error"
            });
            this.books = [];
            this.total = 0;
          }
          this.listLoading = false;
          this.imageSize.width = $("section").width();
          this.imageSize.height = $("section").height();
        })
        .catch(() => {
          this.books = [];
          this.total = 0;
          this.listLoading = false;

          this.$message({
            message: "加载失败!",
            type: "error"
          });
        });
    },
    dialog() {
      this.addVisible = false;
      this.load();
    },
    getSchoolSectionList() {
      getSchoolSectionList({}).then(res => {
        if (res.data.serverResult.resultCode == "200") {
          this.schoolSections = ECRUtil.composeSysDict(res.data.pageInfo.list);
        } else {
          this.schoolSections = [];
        }
      });
    },
    onSchoolSectionChange() {
      this.getSubjectList();
      this.getNaviGradeList();
    },
    getSubjectList() {
      let param = {
        schoolsectionid: this.filters.schoolsectionid
      };
      getSubjectList(param).then(res => {
        if (res.data.serverResult.resultCode == "200") {
          this.subjects = ECRUtil.composeSysDict(res.data.pageInfo.list);
          this.filters.subjectid = "";
        } else {
          this.subjects = [];
        }
      });
    },
    getNaviGradeList() {
      let param = {
        schoolsectionid: this.filters.schoolsectionid
      };
      getNaviGradeList(param).then(res => {
        if (res.data.serverResult.resultCode == "200") {
          this.grades = ECRUtil.composeSysDict(res.data.pageInfo.list);
          this.filters.gradeid = "";
        } else {
          this.grades = [];
        }
      });
    },
    getNaviEditionTypeList() {
      let param = {
        schoolsectionid: this.filters.schoolsectionid,
        subjectid: this.filters.subjectid
      };
      getNaviEditionTypeList(param).then(res => {
        if (res.data.serverResult.resultCode == "200") {
          this.editionTypes = ECRUtil.composeSysDict(res.data.pageInfo.list);
          this.filters.editiontypeid = "";
        } else {
          this.editionTypes = [];
        }
      });
    },
    getNaviBookModelList() {
      let param = {
        schoolsectionid: this.filters.schoolsectionid,
        subjectid: this.filters.subjectid,
        editiontypeid: this.filters.editiontypeid
      };
      getNaviBookModelList(param).then(res => {
        if (res.data.serverResult.resultCode == "200") {
          this.bookModels = ECRUtil.composeSysDict(res.data.pageInfo.list);
          this.filters.bookmodelid = "";
        } else {
          this.bookModels = [];
        }
      });
    },
    search() {
      this.page = 1;
      this.load();
    }
  },
  created() {
    window.EventHub.$on("request-dialog", this.dialog);
  },
  mounted() {
    this.load();
    this.getSchoolSectionList();
    this.getSubjectList();
    this.getNaviGradeList();
    this.getNaviBookModelList();
    this.getNaviEditionTypeList();
    this.onSchoolSectionChange();
  }
};
</script>

<style scoped lang="scss">
@import "~scss_vars";
</style>