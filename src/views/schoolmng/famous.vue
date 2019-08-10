<template>
  <section>
    <el-col :span="24" class="ecrm-search-title">
      <a class="selected">名校管理</a>
    </el-col>

    <el-col :span="24" class="ecrm-content-panel">
      <!-- Filter Panel -->
      <el-form label-width="120px">
        <el-col :span="6">
          <el-form-item label="学校名校:">
            <el-input v-model="filters.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="学校ID:">
            <el-input v-model="filters.orgid"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="名校状态:">
            <el-select v-model="filters.famousstatus">
              <el-option label="全部" value></el-option>
              <el-option label="名校" value="1"></el-option>
              <el-option label="普通" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="所属省份:">
            <el-select style="float:left; width: calc(100% - 70px)" v-model="filters.area">
              <el-option label="全部" value></el-option>
              <el-option
                :label="item.areaname"
                :value="item.areaid"
                v-for="(item, idx) in areas"
                :key="idx"
                :data="item"
              ></el-option>
            </el-select>
            <el-button
              style="margin-left:10px; float:right"
              type="primary"
              v-on:click="search"
              id="searchBtn"
            >查询</el-button>
          </el-form-item>
        </el-col>
      </el-form>

      <!-- Filter Panel End -->
      <!-- Batch Operation Panel -->
      <el-col :span="24" style="margin-bottom:10px;text-align:right;">
        <el-button
          type="table-op"
          size="small"
          :disabled="this.sels.length===0"
          @click="doBatchRemove"
        >删除</el-button>
        <el-button
          type="table-op"
          size="small"
          :disabled="this.sels.length===0"
          @click="doBatchSetFamous"
        >名校设置</el-button>
        <el-button
          type="table-op"
          size="small"
          :disabled="this.sels.length===0"
          @click="doBatchSetArea"
        >省份设置</el-button>
      </el-col>

      <!-- Batch Operation Panel End -->
      <!-- Data Table -->
      <img
        src="static/img/ecrw-empty-data-resource.png"
        :style="{ width:(imageSize.width) + 'px', height:(imageSize.height) + 'px' }"
        v-if="schools.length==0"
      >
      <el-table
        :data="schools"
        v-loading="listLoading"
        @selection-change="selsChange"
        v-if="schools.length>0"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="orgid" label="学校ID" align="center"></el-table-column>
        <el-table-column label="名校状态" align="center">
          <template slot-scope="school">
            <span>{{ formatFamousStatus(school.row.isnamed) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="areaname" label="所属区域" align="center"></el-table-column>
        <el-table-column prop="orgname" label="学校名称" align="center"></el-table-column>
        <el-table-column prop="schooltypename" label="学校类型中文" align="center"></el-table-column>
        <el-table-column prop="createtime" label="创建时间" align="center"></el-table-column>
        <el-table-column prop="lastmodifytime" label="最后更新时间" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="300">
          <template slot-scope="school">
            <el-button
              size="small"
              @click="doDelete(school.$index, school.row)"
              style="margin:0px"
            >删除</el-button>
            <el-button
              size="small"
              @click="doSetFamous(school.$index, school.row)"
              style="margin:0px"
            >名校设置</el-button>
            <el-button
              size="small"
              @click="doSetsequence(school.$index, school.row)"
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

    <!-- SetFamous Dialog -->
    <el-dialog title="名校设置" v-model="famousFormVisible" :close-on-click-modal="false">
      <el-form label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label style="width: 100%">
              <el-radio-group v-model="isnamed">
                <el-radio label="名校"></el-radio>
                <el-radio label="普通"></el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="isBatch == false">
            <el-form-item label="学校标签:" style="width: 100%">
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
            <el-form-item label="学校简介:" style="width: 100%">
              <el-input type="textarea" v-model="description" :maxlength="1000"></el-input>
              <br>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="famousFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="setThumb" :loading="addLoading">确定</el-button>
      </div>
    </el-dialog>

    <!-- SetFamous Dialog End -->
    <!-- SetArea Dialog -->
    <el-dialog title="省份设置" v-model="areaFormVisible" :close-on-click-modal="false">
      <el-form label-width="120px">
        <el-col :span="23">
          <el-form-item label="省份:">
            <el-select v-model="areaid">
              <el-option
                :label="item.areaname"
                :value="item.areaid"
                v-for="(item, idx) in areas"
                :key="idx"
                :data="item"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="areaFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="areaSubmit" :loading="addLoading">确定</el-button>
      </div>
    </el-dialog>

    <!-- SetArea Dialog End -->
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
import { SHARE_RANGE } from "../../common/js/const.js";
import {
  getSchoolList,
  batchSetSchoolNamed,
  getAreasByParent,
  batchDeleteSchool,
  batchSetArea2School,
  setOrdernoByOrgid,
  uploadFile
} from "../../api/api";

export default {
  data() {
    return {
      filters: {
        name: "",
        orgid: "",
        famousstatus: "",
        area: ""
      },

      /////////// Pagination ///////////
      total: 0,
      page: 1,
      page_size: 10,
      page_total: 0,
      /////////// Pagination End ////////

      areas: [],
      schools: [],
      listLoading: false,
      addLoading: false,
      sels: [], //列表选中列

      famousFormVisible: false,
      areaFormVisible: false,
      sequenceFormVisible: false,
      isnamed: "名校",
      thumb: {
        blobfile: "",
        file: null
      },
      description: "",
      areaid: "",
      sequence: 0,
      curSchool: {},
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
      if (input.files[0]) {
        thumb.file = input.files[0];
        if (!thumb.file.type.startsWith("image")) {
          this.$message({
            message: "只能支持图片格式。",
            type: "error"
          });
          return;
        }
        reader.readAsDataURL(thumb.file);
      }
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getSchools();
    },
    // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
    // Modify Reason : Bug Number #491
    // Data Start : 2019-1-28 11:05 AM
    handlePageSizeChange(pageSize) {
      this.page_size = pageSize;
      this.getSchools();
    },
    // Author : GOD, 资源管理 审核页面显示的资源条数不支持选择，按照需求说明书，要支持可以显示10条，20条，50条。需求说明已经截图。
    // Data End : 2019-1-28 12:35 AM
    selsChange: function(sels) {
      this.sels = sels;
    },
    search() {
      this.page = 1;
      this.getSchools();
    },
    doDelete(index, school) {
      this.$confirm("确定从ECR系统中删除学校？", "提示", {
        type: "warning"
      })
        .then(() => {
          batchDeleteSchool([school.orgid])
            .then(res => {
              if (res.data.serverResult.resultCode == "200") {
                this.$message({
                  message: "删除成功！",
                  type: "success"
                });

                this.getSchools();
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
    doSetFamous(index, school) {
      this.isBatch = false;
      this.famousFormVisible = true;
      this.curSchool = school;
      if (this.curSchool.description != null) {
        this.description = this.curSchool.description;
      } else {
        this.description = "";
      }

      this.isnamed = this.formatFamousStatus(this.curSchool.isnamed);
      this.thumb.blobfile = ECO_MEDIA_PATH + this.curSchool.photopath;
      this.thumb.file = null;
    },
    doSetArea(index, school) {
      this.isBatch = false;
      this.areaid = "";
      this.areaFormVisible = true;
      this.curSchool = school;
    },
    doSetsequence(index, school) {
      this.sequence = school.orderno;
      this.sequenceFormVisible = true;
      this.curSchool = school;
    },
    doBatchRemove() {
      this.$confirm("确定从ECR系统中删除学校？", "提示", {
        type: "warning"
      })
        .then(() => {
          let params = [];
          this.sels.forEach(function(school) {
            params.push(school.orgid);
          });
          this.listLoading = true;
          batchDeleteSchool(params)
            .then(res => {
              if (res.data.serverResult.resultCode == "200") {
                this.$message({
                  message: "删除成功！",
                  type: "success"
                });
                this.getSchools();
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
      this.isnamed = "名校";
      this.famousFormVisible = true;
    },
    doBatchSetArea() {
      this.isBatch = true;
      this.areaid = "";
      this.areaFormVisible = true;
    },
    getSchools() {
      let param = {
        pagination: {
          numPerPage: this.page_size,
          pageNo: this.page,
          calTotal: true
        },
        conditions: [
          {
            fieldName: "orgname",
            fieldValues: [this.filters.name],
            prepender: null,
            operator: "EQUAL",
            childCondtions: null
          },
          {
            fieldName: "orgid",
            fieldValues: [this.filters.orgid],
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
            fieldName: "areaid",
            fieldValues: [this.filters.area],
            prepender: null,
            operator: "EQUAL",
            childCondtions: null
          }
        ]
      };

      this.listLoading = true;
      getSchoolList(param)
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.total = res.data.pageInfo.total;
            this.schools = res.data.pageInfo.list;
            this.page_total = res.data.pageInfo.list.length;
          } else {
            this.$message({
              message: res.data.serverResult.resultMessage,
              type: "error"
            });
            this.total = 0;
            this.schools = [];
          }
          this.listLoading = false;
          this.imageSize.width = $("section").width();
          this.imageSize.height = $("section").height();
        })
        .catch(() => {
          this.total = 0;
          this.schools = [];
          this.listLoading = false;

          this.$message({
            message: "加载失败!",
            type: "error"
          });
        });
    },
    formatFamousStatus(isnamed) {
      if (isnamed == "1") {
        return "名校";
      } else if (isnamed == "0") {
        return "普通";
      }
    },
    formatIsnamed(isnamed) {
      if (isnamed == "名校") {
        return "1";
      } else if (isnamed == "普通") {
        return "0";
      }

      return "";
    },
    setThumb() {
      var file = this.thumb.file;
      this.addLoading = true;
      this.uploadpath = "";

      if (file != null) {
        this.uploadImage(file)
          .then(res => {
            if (res.data.serverReults.resultCode == "200") {
              this.thumb.blobfile = ECO_MEDIA_PATH + res.data.fileInfos[0].localPath;
              this.uploadpath = res.data.fileInfos[0].localPath;
              this.famousSubmit();
            } else {
              this.$message({
                message: res.data.serverReults.resultMessage,
                type: "error"
              });
            }
          })
          .catch(() => {
            this.addLoading = false;
            this.$message({
              message: "操作失败",
              type: "error"
            });
          });
      } else if (file == null) {
        this.thumb.blobfile = ECO_MEDIA_PATH + this.curSchool.photopath;
        this.uploadpath = this.curSchool.photopath;
        this.famousSubmit();
      }
    },
    famousSubmit() {
      let params = [];
      var isnamed = this.formatIsnamed(this.isnamed);
      if (this.isBatch) {
        this.sels.forEach(function(school) {
          params.push({
            orgid: school.orgid,
            isnamed: isnamed
          });
        });
      } else {
        params.push({
          orgid: this.curSchool.orgid,
          isnamed: isnamed,
          description: this.description,
          photopath: this.uploadpath
        });
      }

      batchSetSchoolNamed(params)
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.$message({
              message: "标记成功！",
              type: "success"
            });
            this.famousFormVisible = false;
            this.getSchools();
          } else {
            this.$message({
              message: res.data.serverResult.resultMessage,
              type: "error"
            });
          }
          this.addLoading = false;
        })
        .catch(() => {
          this.$message({
            message: "操作失败",
            type: "error"
          });
          this.addLoading = false;
        });
    },
    areaSubmit() {
      let params = [];
      var areaid = this.areaid;
      if (this.isBatch) {
        this.sels.forEach(function(school) {
          params.push({
            orgid: school.orgid,
            areaid: areaid
          });
        });
      } else {
        params.push({
          orgid: this.curSchool.orgid,
          areaid: areaid
        });
      }

      this.addLoading = true;
      batchSetArea2School(params)
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.$message({
              message: "标记成功！",
              type: "success"
            });
            this.areaFormVisible = false;
            this.getSchools();
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
        orgid: this.curSchool.orgid,
        orderno: this.sequence
      };
      this.addLoading = true;
      setOrdernoByOrgid(params)
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.$message({
              message: "标记成功！",
              type: "success"
            });
            this.sequenceFormVisible = false;
            this.getSchools();
          } else if (res.data.serverResult.resultCode == "401") {
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
    },
    getAreas() {
      getAreasByParent("-1")
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.areas = res.data.pageInfo.list;
          } else {
            this.$message({
              message: res.data.serverResult.resultMessage,
              type: "error"
            });
            this.areas = [];
          }
        })
        .catch(() => {
          this.areas = [];
        });
    },
    uploadImage(file) {
      const data = new FormData();
      data.append("file", file);

      return uploadFile({ data: data, onUploadProgress: null });
    }
  },
  created() {
    this.getSchools();
    this.getAreas();
  }
};
</script>

<style lang="scss" scoped>
@import "~scss_vars";

.el-input,
.el-select {
  width: 100%;
}
.ecrm-upload-image {
  width: 210px;
  height: 121px;
  border: 1px dashed gray;
  float: left;
  margin-right: 10px;
}
</style>