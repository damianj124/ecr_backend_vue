<template>
  <section>
    <el-col :span="24" class="ecrm-search-title">
      <a class="selected">教师查询</a>
    </el-col>

    <el-col :span="24" class="ecrm-content-panel">
      <!-- Filter Panel -->
      <el-form label-width="120px">
        <el-col :span="7">
          <el-form-item label="教师姓名:">
            <el-input v-model="filters.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="登录名:">
            <el-input v-model="filters.loginname"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="机构名称:">
            <el-input v-model="filters.orgname"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-button
              style="margin-left:30px; float:right"
              type="primary"
              v-on:click="search"
              id="searchBtn"
            >查询</el-button>
        <!--   <el-form-item label="在岗状态:">
            <el-select style="float:left; width: calc(100% - 70px)" v-model="filters.jobstatus">
              <el-option label="全部" value></el-option>
              <el-option label="在职" value="0"></el-option>
              <el-option label="调离" value="1"></el-option>
              <el-option label="离职" value="2"></el-option>
              <el-option label="开除" value="3"></el-option>
              <el-option label="退休" value="4"></el-option>
            </el-select>
            <el-button
              style="margin-left:10px; float:right"
              type="primary"
              v-on:click="search"
              id="searchBtn"
            >查询</el-button>
          </el-form-item> -->
        </el-col>
      </el-form>

      <!-- Filter Panel End -->
      <!-- Batch Operation Panel -->
      <el-col :span="24" style="margin-bottom:10px;text-align:right;">
        <el-button
          type="table-op"
          size="small"
          :disabled="this.sels.length===0"
          @click="doBatchSave"
          :loading="addLoading"
        >保存到ECR</el-button>
        <el-button
          type="table-op"
          size="small"
          :disabled="this.sels.length===0"
          @click="doBatchMark"
          :loading="addLoading"
        >标记为名师</el-button>
      </el-col>

      <!-- Batch Operation Panel End -->
      <!-- Data Table -->
      <img
        src="static/img/ecrw-empty-data-resource.png"
        :style="{ width:(imageSize.width) + 'px', height:(imageSize.height) + 'px' }"
        v-if="teachers.length==0"
      >
      <el-table
        :data="teachers"
        v-loading="listLoading"
        @selection-change="selsChange"
        v-if="teachers.length>0"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="userId" label="用户ID" align="center"></el-table-column>
        <el-table-column prop="realName" label="教师姓名" align="center"></el-table-column>
        <el-table-column prop="loginName" label="登录名" align="center"></el-table-column>
        <!-- <el-table-column prop="status" :formatter="formatJobStatus" label="在岗状态" align="center"></el-table-column> -->
        <el-table-column prop="orgName" label="机构名称" align="center"></el-table-column>
        <!-- <el-table-column prop="personalinfo" label="个人简介" align="center"></el-table-column> -->
        <el-table-column
          prop="status"
          :formatter="formatUserStatus"
          label="用户表状态"
          align="center"
        ></el-table-column>
        <el-table-column prop="birthday" label="出生日期" align="center"></el-table-column>
        <el-table-column prop="sex" :formatter="formatSex" label="性别" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        <el-table-column prop="lastModifyTime" label="最后更新时间" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="teacher">
            <el-button
              size="small"
              @click="doSave(teacher.$index, teacher.row)"
              style="margin:0px"
            >保存到ECR</el-button>
            <el-button
              size="small"
              @click="doMark(teacher.$index, teacher.row)"
              style="margin:0px"
            >标记为名师</el-button>
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

      <!-- Data Table End -->
    </el-col>
  </section>
</template>

<script>
import ECRUtil from "../../common/js/util";
import {
  getEcoTeacherList,
  getEcoOrgInfo,
  batchRegisterTeacher
} from "../../api/api";

export default {
  data() {
    return {
      filters: {
        name: "",
        loginname: "",
        orgname: "",
        jobstatus: ""
      },
      util: ECRUtil,
      /////////// Pagination ///////////
      total: 0,
      page: 1,
      page_size: 10,
      page_total: 0,
      /////////// Pagination End ////////

      teachers: [],
      listLoading: false,
      listCount: 0,
      sels: [], //列表选中列
      addLoading: false,
      imageSize: {
        width: 0,
        height: 0
      }
    };
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val;
      this.getTeachers();
    },
    // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
    // Modify Reason : Bug Number #491
    // Data Start : 2019-1-28 11:05 AM
    handlePageSizeChange(pageSize) {
      this.page_size = pageSize;
      this.getTeachers();
    },
    // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
    // Data End : 2019-1-28 12:35 AM
    selsChange: function(sels) {
      this.sels = sels;
    },
    search() {
      this.page = 1;
      this.getTeachers();
    },
    doBatchSave() {
      let params = [];
      this.sels.forEach(function(teacher) {
        params.push({
          areaid: teacher.areaId,
          userid: teacher.userId,
          loginname: teacher.loginName,
          realname: teacher.realName,
//          job_status: teacher.status,
          sex: teacher.sex,
          birthday: teacher.birthday,
          status: teacher.status,
          orgid: teacher.orgId,
          orgname: teacher.orgName,
//          presonprofile: teacher.personalinfo,
          isnamed: "0",
          createtime: teacher.createTime,
          lastmodifytime: teacher.lastModifyTime
        });
      });
      this.addLoading = true;
      batchRegisterTeacher(params)
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.$message({
              message: "保存成功！",
              type: "success"
            });
          } else {
            this.$message({
              message: res.data.serverResult.resultMessage,
              type: "error"
            });
          }
          this.addLoading = false;
        })
        .catch(() => {
          this.addLoading = false;

          this.$message({
            message: "操作失败",
            type: "error"
          });
        });
    },
    doBatchMark() {
      let params = [];
      this.sels.forEach(function(teacher) {
        params.push({
          areaid: teacher.areaId,
          userid: teacher.userId,
          loginname: teacher.loginName,
          realname: teacher.realName,
//          job_status: teacher.status,
          sex: teacher.sex,
          birthday: teacher.birthday,
          status: teacher.status,
          orgid: teacher.orgId,
          orgname: teacher.orgName,
//          presonprofile: teacher.personalinfo,
          isnamed: "1",
          createtime: teacher.createTime,
          lastmodifytime: teacher.lastModifyTime
        });
      });
      this.addLoading = true;
      batchRegisterTeacher(params)
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.$message({
              message: "保存成功！",
              type: "success"
            });
          } else {
            this.$message({
              message: res.data.serverResult.resultMessage,
              type: "error"
            });
          }
          this.addLoading = false;
        })
        .catch(() => {
          this.addLoading = false;

          this.$message({
            message: "操作失败",
            type: "error"
          });
        });
    },
    doSave(index, teacher) {
      let params = [
        {
          areaid: teacher.areaId,
          userid: teacher.userId,
          loginname: teacher.loginName,
          realname: teacher.realName,
//          job_status: teacher.status,
          sex: teacher.sex,
          birthday: teacher.birthday,
          status: teacher.status,
          orgid: teacher.orgId,
          orgname: teacher.orgName,
//          presonprofile: teacher.personalinfo,
          isnamed: "0",
          createtime: teacher.createTime,
          lastmodifytime: teacher.lastModifyTime
        }
      ];

      batchRegisterTeacher(params)
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.$message({
              message: "保存成功！",
              type: "success"
            });
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
    },
    doMark(index, teacher) {
      let params = [
        {
          areaid: teacher.areaId,
          userid: teacher.userId,
          loginname: teacher.loginName,
          realname: teacher.realName,
//          job_status: teacher.status,
          sex: teacher.sex,
          birthday: teacher.birthday,
          status: teacher.status,
          orgid: teacher.orgId,
          orgname: teacher.orgName,
//          presonprofile: teacher.personalinfo,
          isnamed: "1",
          createtime: teacher.createTime,
          lastmodifytime: teacher.lastModifyTime
        }
      ];

      batchRegisterTeacher(params)
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.$message({
              message: "保存成功！",
              type: "success"
            });
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
    },
    getTeachers() {
      let param = {
        loginName: this.filters.loginname,
        realName: this.filters.name,
        numPerPage: this.page_size,
        orgName: this.filters.orgname,
        orgId: this.filters.orgid,
        pageNo: this.page,
        userId: ""
      };

      this.listLoading = true;
      getEcoTeacherList(param, this.$message)
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.total = res.data.pageInfo.total;
            this.teachers = res.data.pageInfo.list;
            this.page_total = res.data.pageInfo.list.length;
            this.listCount = this.teachers.length;

            this.listLoading = false;
            // if (this.listCount == 0) 
            // {
            //   this.listLoading = false;
            // }
            // for (var i = 0; i < this.teachers.length; i++) {
            //   this.getInfo(i);
            // }
          } else {
            this.$message({
              message: res.data.serverResult.resultMessage,
              type: "error"
            });
            this.total = 0;
            this.teachers = [];
            this.listLoading = false;
          }
          this.imageSize.width = $("section").width();
          this.imageSize.height = $("section").height();
        })
        .catch(() => {
          this.total = 0;
          this.teachers = [];
          this.listLoading = false;

          this.$message({
            message: "加载失败!",
            type: "error"
          });
        });
    },
    getInfo(idx) {
      var param = this.teachers[idx].orgId;
      getEcoOrgInfo(param, this.$message)
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.teachers[idx]["areaid"] = res.data.responseEntity.areaId;
          } else {
            this.$message({
              message: res.data.serverResult.resultMessage,
              type: "error"
            });
          }
          this.listCount -= 1;
          if (this.listCount == 0) this.listLoading = false;
        })
        .catch(() => {
          this.listCount -= 1;
          if (this.listCount == 0) this.listLoading = false;
        });
    },
    formatJobStatus(row, col) {
      if (row.jobStatus == "0") {
        return "在职";
      } else if (row.jobStatus == "1") {
        return "调离";
      } else if (row.jobStatus == "2") {
        return "离职";
      } else if (row.jobStatus == "3") {
        return "开除";
      } else if (row.jobStatus == "4") {
        return "退休";
      }
    },
    formatUserStatus(row, col) {
      if (row.status == "1") {
        return "正常";
      } else if (row.status == "2") {
        return "待审核";
      } else if (row.status == "3") {
        return "待激活";
      } else if (row.status == "4") {
        return "审核不通过";
      } else if (row.status == "7") {
        return "冻结";
      } else if (row.status == "9") {
        return "删除";
      }
    },
    formatSex(row, col) {
      if (row.sex == "0") {
        return "男";
      } else if (row.sex == "1") {
        return "女";
      }
    }
  },
  created() {
    this.getTeachers();
  }
};
</script>

<style lang="scss" scoped>
@import "~scss_vars";

.el-input,
.el-select {
  width: 100%;
}
.cell .el-select {
  width: auto;
}
</style>