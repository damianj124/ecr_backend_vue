<template>
  <section>
    <el-col :span="24" class="ecrm-search-title">
      <a class="selected">名师管理</a>
    </el-col>

    <el-col :span="24" class="ecrm-content-panel">
      <!-- Filter Panel -->
      <el-form label-width="120px">
        <el-col :span="6">
          <el-form-item label="教师姓名:">
            <el-input v-model="filters.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="登录名:">
            <el-input v-model="filters.loginname"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="机构名称:">
            <el-input v-model="filters.orgname"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="名师状态:">
            <el-select v-model="filters.famousstatus">
              <el-option label="全部" value></el-option>
              <el-option label="名师" value="1"></el-option>
              <el-option label="普通" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="范围:">
            <el-select style="float:left; width: calc(100% - 70px)" v-model="filters.sharerange">
              <el-option label="全部" value></el-option>
              <el-option label="全国" value="1"></el-option>
              <el-option label="全省" value="2"></el-option>
              <el-option label="全市" value="3"></el-option>
            </el-select>
            <el-button
              style="margin-left:10px; float:right"
              type="primary"
              v-on:click="search"
              id="searchBtn"
            >查询</el-button>
          </el-form-item>
        </el-col>
        <!-- Filter Panel End -->
        <!-- Batch Operation Panel -->
        <el-col :span="18" style="margin-bottom:10px;text-align:right;">
          <el-button
            type="table-op"
            size="medium"
            :disabled="this.sels.length===0"
            @click="doBatchRemove"
          >删除</el-button>
          <el-button
            type="table-op"
            size="medium"
            :disabled="this.sels.length===0"
            @click="doBatchSetFamous"
          >名师设置</el-button>
          <el-button
            type="table-op"
            size="medium"
            :disabled="this.sels.length===0"
            @click="doBatchSetShareRange"
          >范围设置</el-button>
        </el-col>

        <!-- Batch Operation Panel End -->
        <!-- Data Table -->
      </el-form>

      
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
        <el-table-column prop="userid" label="用户ID" align="center"></el-table-column>
        <el-table-column label="名师状态" align="center">
          <template slot-scope="teacher">
            <span>{{ formatFamousStatus(teacher.row.isnamed) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="范围" align="center">
          <template slot-scope="teacher">
            <span>{{ formatShareRange(teacher.row.sharerange) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="realname" label="教师姓名" align="center"></el-table-column>
        <el-table-column prop="loginname" label="登录名" align="center"></el-table-column>
        <el-table-column prop="job_status" :formatter="formatJobStatus" label="在岗状态" align="center"></el-table-column>
        <el-table-column prop="orgname" label="机构名称" align="center"></el-table-column>
        <el-table-column prop="personprofile" label="个人简介" align="center"></el-table-column>
        <el-table-column prop="status" :formatter="formatUserStatus" label="用户表状态" align="center"></el-table-column>
        <el-table-column prop="birthday" label="出生日期" align="center"></el-table-column>
        <el-table-column prop="sex" :formatter="formatSex" label="性别" align="center"></el-table-column>
        <el-table-column prop="createtime" label="创建时间" align="center"></el-table-column>
        <el-table-column prop="lastmodifytime" label="最后更新时间" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="300">
          <template slot-scope="teacher">
            <el-button
              size="small"
              @click="doDelete(teacher.$index, teacher.row)"
              style="margin:0px"
            >删除</el-button>
            <el-button
              size="small"
              @click="doSetFamous(teacher.$index, teacher.row)"
              style="margin:0px"
            >名师设置</el-button>
            <el-button
              size="small"
              @click="doSetShareRange(teacher.$index, teacher.row)"
              style="margin:0px"
            >范围设置</el-button>
            <el-button
              size="small"
              @click="doSetSequence(teacher.$index, teacher.row)"
              style="margin:0px"
            >顺序号设置</el-button>
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

    <el-dialog title="名师设置" v-model="famousFormVisible" :close-on-click-modal="false">
      <el-form label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label style="width: 100%">
              <el-radio-group v-model="isnamed">
                <el-radio label="名师"></el-radio>
                <el-radio label="普通"></el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="isBatch == false">
            <el-form-item label="头像" style="width: 100%" class = "is-required">
              <input
                type="file"
                id="thumb"
                @change="readThumb(thumb)"
                style="display:none"
                accept=".png, .jpg"
              >
              <img :src="thumb.blobfile" class="ecrm-upload-image" @click="openThumbFile">
              <div>
                <el-button
                  type="small"
                  style="width: 80px; margin-top: 30px;"
                  @click="openThumbFile"
                >上传</el-button>
                <br>
                <el-button type="small" style="width: 80px;" @click="clearThumbFile(thumb)">清空</el-button>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="isBatch == false">
            <el-form-item label="简介" style="width: 100%">
              <el-input type="textarea" v-model="description" :maxlength="1000"></el-input>
              <br>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="famousFormVisible = false; this.thumb.blobfile='';">取消</el-button>
        <el-button type="primary" @click.native="setThumb" :loading="addLoading">确定</el-button>
      </div>
    </el-dialog>

    <!-- SetFamous Dialog End -->
    <!-- Set ShareRange Dialog -->
    <el-dialog title="范围设置" v-model="shareRangeFormVisible" :close-on-click-modal="false">
      <el-row style="text-align: center">
        <el-radio-group v-model="shareRange">
          <el-radio label="全国" value="1"></el-radio>
          <el-radio label="全省" value="2"></el-radio>
          <el-radio label="全市" value="3"></el-radio>
        </el-radio-group>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="shareRangeFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="shareRangeSubmit" :loading="addLoading">确定</el-button>
      </div>
    </el-dialog>

    <!-- Set ShareRange Dialog End -->
    <!-- SetSequence Dialog -->
    <el-dialog title="顺序号设置" v-model="sequenceFormVisible" :close-on-click-modal="false">
      <el-form label-width="120px">
        <el-row style="text-align: center">
          <el-col :span="1">
            <el-form-item label="顺序号:">
              <el-input-number v-model="sequence" :min="0"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="sequenceFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="sequenceSubmit" :loading="addLoading">确定</el-button>
      </div>
    </el-dialog>

    <!-- SetSequence Dialog End -->
  </section>
</template>

<script>
import ECRUtil from "../../common/js/util";
import {} from "../../common/js/const.js";
import {
  getTeacherList,
  batchDeleteTeacher,
  batchSetTeacherNamed,
  batchSetSharerange2Teacher,
  setOrdernoByUserid,
  uploadFile
} from "../../api/api";

export default {
  data() {
    return {
      filters: {
        name: "",
        loginname: "",
        orgname: "",
        jobstatus: "",
        famousstatus: "",
        sharerange: ""
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
      addLoading: false,
      sels: [], //列表选中列

      famousFormVisible: false,
      shareRangeFormVisible: false,
      sequenceFormVisible: false,
      isnamed: "名师",
      shareRange: "全国",
      thumb: {
        blobfile: "",
        file: null
      },
      description: "",
      sequence: 0,
      curTeacher: {},
      isBatch: false,
      imageSize: {
        width: 0,
        height: 0
      }
    };
  },
  methods: {
    openThumbFile() {
      document.getElementById("thumb").click();
    },
    clearThumbFile(thumb) {
      if (thumb != null) {
        thumb.file = null;
        thumb.blobfile = "";
      }
      document.getElementById("thumb").value = null;
    },
    readThumb(thumb) {
      var input = document.getElementById("thumb");
      var reader = new FileReader();

      reader.onload = function(e) {
        thumb.blobfile = e.target.result;
      };
      thumb.file = input.files[0];
      if (thumb.file && !thumb.file.type.startsWith("image")) {
        this.$message({
          message: "只能支持图片格式。",
          type: "error"
        });
        return;
      }
      reader.readAsDataURL(thumb.file);
    },
    uploadImage(file) {
      const data = new FormData();
      data.append("file", file);

      return uploadFile({ data: data, onUploadProgress: null });
    },
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
    doDelete(index, teacher) {
      this.$confirm("确定从ECR系统中删除教师？", "提示", {
        type: "warning"
      })
        .then(() => {
          batchDeleteTeacher([teacher.userid])
            .then(res => {
              if (res.data.serverResult.resultCode == "200") {
                this.$message({
                  message: "删除成功！",
                  type: "success"
                });

                this.getTeachers();
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
        })
        .catch(() => {});
    },
    doSetFamous(index, teacher) {
      this.isBatch = false;
      this.famousFormVisible = true;
      this.curTeacher = teacher;
      if (this.curTeacher.description != null) {
        this.description = this.curTeacher.description;
      } else {
        this.description = "";
      }

      this.isnamed = this.formatFamousStatus(this.curTeacher.isnamed);
      this.thumb.blobfile = ECO_MEDIA_PATH + this.curTeacher.photopath;
      this.thumb.file = null;
    },
    doSetShareRange(index, teacher) {
      this.isBatch = false;
      this.shareRange = this.formatShareRange(teacher.sharerange);
      this.shareRangeFormVisible = true;
      this.curTeacher = teacher;
    },
    doSetSequence(index, teacher) {
      this.sequence = teacher.orderno;
      this.sequenceFormVisible = true;
      this.curTeacher = teacher;
    },
    doBatchRemove() {
      this.$confirm("确定从ECR系统中删除教师？", "提示", {
        type: "warning"
      })
        .then(() => {
          let params = [];
          this.sels.forEach(function(teacher) {
            params.push(teacher.userid);
          });
          this.listLoading = true;
          batchDeleteTeacher(params)
            .then(res => {
              if (res.data.serverResult.resultCode == "200") {
                this.$message({
                  message: "删除成功！",
                  type: "success"
                });
                this.getTeachers();
              } else {
                this.$message({
                  message: res.data.serverResult.resultMessage,
                  type: "error"
                });
                this.listLoading = false;
              }
            })
            .catch(() => {
              this.listLoading = false;
              this.$message({
                message: "操作失败",
                type: "error"
              });
            });
        })
        .catch(() => {});
    },
    doBatchSetFamous() {
      this.isBatch = true;
      this.isnamed = "名师";
      this.famousFormVisible = true;
    },
    doBatchSetShareRange() {
      this.isBatch = true;
      this.shareRange = "全国";
      this.shareRangeFormVisible = true;
    },
    getTeachers() {
      let param = {
        pagination: {
          numPerPage: this.page_size,
          pageNo: this.page,
          calTotal: true
        },
        conditions: [
          {
            fieldName: "realname",
            fieldValues: [this.filters.name],
            prepender: null,
            operator: "EQUAL",
            childCondtions: null
          },
          {
            fieldName: "orgname",
            fieldValues: [this.filters.orgname],
            prepender: null,
            operator: "EQUAL",
            childCondtions: null
          },
          {
            fieldName: "loginname",
            fieldValues: [this.filters.loginname],
            prepender: null,
            operator: "EQUAL",
            childCondtions: null
          },
          {
            fieldName: "job_status",
            fieldValues: [this.filters.jobstatus],
            prepender: null,
            operator: "EQUAL",
            childCondtions: null
          },
          {
            fieldName: "isnamed",
            fieldValues: [this.filters.famousstatus],
            prepender: null,
            operator: "EQUAL",
            childCondtions: null
          },
          {
            fieldName: "sharerange",
            fieldValues: [this.filters.sharerange],
            prepender: null,
            operator: "EQUAL",
            childCondtions: null
          }
        ]
      };

      this.listLoading = true;
      getTeacherList(param)
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.total = res.data.pageInfo.total;
            this.teachers = res.data.pageInfo.list;
            this.page_total = res.data.pageInfo.list.length;
          } else {
            this.$message({
              message: res.data.serverResult.resultMessage,
              type: "error"
            });
            this.total = 0;
            this.teachers = [];
          }
          this.listLoading = false;
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
    formatFamousStatus(isnamed) {
      if (isnamed == "1") {
        return "名师";
      } else if (isnamed == "0") {
        return "普通";
      }

      return "";
    },
    formatSex(row, col) {
      if (row.sex == "0") {
        return "男";
      } else if (row.sex == "1") {
        return "女";
      }

      return "";
    },
    formatShareRange(sharerange) {
      if (sharerange == "1") {
        return "全国";
      } else if (sharerange == "2") {
        return "全省";
      } else if (sharerange == "3") {
        return "全市";
      }

      return "";
    },
    formatIsnamed(isnamed) {
      if (isnamed == "名师") {
        return "1";
      } else if (isnamed == "普通") {
        return "0";
      }

      return "";
    },
    getShareRangeId(sharerangename) {
      if (sharerangename == "全国") {
        return "1";
      } else if (sharerangename == "全省") {
        return "2";
      } else if (sharerangename == "全市") {
        return "3";
      }

      return "";
    },
    setThumb() {
      this.addLoading = true;
      this.uploadpath = "";
      var file = this.thumb.file;
      if (file != null) {
        this.uploadImage(file).then(res => {
          if (res.data.serverReults.resultCode == "200") {
            this.thumb.blobfile = ECO_MEDIA_PATH + res.data.fileInfos[0].localPath;
            this.uploadpath = res.data.fileInfos[0].localPath;
            this.famousSubmit();
          }
        });
      } else if (file == null) {
        this.thumb.blobfile = ECO_MEDIA_PATH + this.curTeacher.photopath;
        this.uploadpath = this.curTeacher.photopath;
        this.famousSubmit();
      }
    },
    famousSubmit() {
      let params = [];
      var isnamed = this.formatIsnamed(this.isnamed);
      if (this.isBatch) {
        this.sels.forEach(function(teacher) {
          params.push({
            userid: teacher.userid,
            isnamed: isnamed
          });
        });
      } else {
        params.push({
          userid: this.curTeacher.userid,
          isnamed: isnamed,
          description: this.description,
          photopath: this.uploadpath
        });
      }
      batchSetTeacherNamed(params)
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.$message({
              message: "标记成功！",
              type: "success"
            });
            this.famousFormVisible = false;
            this.getTeachers();
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
    shareRangeSubmit() {
      let params = [];
      var sharerange = this.getShareRangeId(this.shareRange);
      if (this.isBatch) {
        this.sels.forEach(function(teacher) {
          params.push({
            userid: teacher.userid,
            sharerange: sharerange
          });
        });
      } else {
        params.push({
          userid: this.curTeacher.userid,
          sharerange: sharerange
        });
      }
      this.addLoading = true;
      batchSetSharerange2Teacher(params)
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.$message({
              message: "标记成功！",
              type: "success"
            });
            this.shareRangeFormVisible = false;
            this.getTeachers();
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
    sequenceSubmit() {
      let params = {
        userid: this.curTeacher.userid,
        orderno: this.sequence
      };
      this.addLoading = true;
      setOrdernoByUserid(params)
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.$message({
              message: "标记成功！",
              type: "success"
            });
            this.sequenceFormVisible = false;
            this.getTeachers();
          }  else if (res.data.serverResult.resultCode == "401") {
            this.$message({
              message: "该序号已占用! ",
              type: "warning"
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
.ecrm-upload-image {
  width: 210px;
  height: 121px;
  border: 1px dashed gray;
  float: left;
  margin-right: 10px;
}
</style>