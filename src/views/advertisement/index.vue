<template>
  <section>
    <el-row>
      <el-col :span="24" class="ecrm-search-title">
        <a class="selected">广告管理</a>
      </el-col>
    </el-row>
    <el-row :span="24" class="ecrm-content-panel">
      <!-- Batch Operation Panel -->
      <el-col :span="24" style="margin-bottom:10px;text-align:right;">
        <el-button type="table-op" size="small" @click="doAdd">新增</el-button>
      </el-col>

      <!-- Batch Operation Panel End -->
      <!--Data Table -->
      <img
        src="static/img/ecrw-empty-data-resource.png"
        :style="{ width:(imageSize.width) + 'px', height:(imageSize.height) + 'px' }"
        v-if="advertList.length==0"
      >
      <el-table :data="advertList" v-loading="listLoading" v-if="advertList.length>0">
        <el-table-column prop="name" label="广告名称" align="center"></el-table-column>
        <el-table-column prop="imagepath" label="广告图片" align="center" width="100">
          <template slot-scope="advert">
            <el-button size="small" @click="showImage(advert.$index, advert.row)">预览</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="adverturl" label="跳转地址" align="center"></el-table-column>
        <el-table-column prop="sequence" label="排序序号" align="center" width="100"></el-table-column>
        <el-table-column prop="status" label="状态" align="center" width="100">
          <template slot-scope="advert">
            <span
              :class="{ 'ecrm-color-red':advert.row.status=='0', 'ecrm-color-green':advert.row.status=='1'}"
            >{{ formatStatus(advert.row.status) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="advert">
            <el-button size="small" @click="doEdit(advert.$index, advert.row)">修改</el-button>
            <el-button size="small" @click="doDelete(advert.$index, advert.row)">删除</el-button>
            <el-button
              size="small"
              @click="doStatus(advert.$index, advert.row)"
            >{{ advert.row.status=='0'?'有效':'无效' }}</el-button>
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
    </el-row>

    <!-- Add Dialog -->
    <el-dialog title="新增广告" v-model="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm">
        <el-form-item prop="name" label="广告名称 :">
          <el-input placeholder="请输入广告名称" v-model="addForm.name" :maxlength="25"></el-input>
        </el-form-item>
        <el-form-item class="is-required" label="广告图片 :" prop="advertimg">
          <input
            type="file"
            id="advertimg"
            @change="readThumb(addForm, 'advertimg')"
            style="display:none"
            accept=".png, .jpg"
          >
          <img
            :src="addForm.advertimg.blobfile"
            style="width: 210px; height: 121px; border: 1px dashed gray; float:left; margin-right: 10px;"
            @click="openThumbFile('advertimg')"
          >
          <div style="height: 121px;">
            <el-button
              type="small"
              style="width: 80px; margin-top: 30px;"
              @click="openThumbFile('advertimg')"
            >本地上传</el-button>
            <br>
            <el-button
              type="small"
              style="width: 80px;"
              @click="clearThumbFile(addForm, 'advertimg')"
            >清空</el-button>
          </div>
        </el-form-item>
        <el-form-item prop="adverturl" label="跳转地址 :">
          <el-input placeholder="请输入跳转地址" v-model="addForm.adverturl"></el-input>
        </el-form-item>
        <el-form-item prop="sequence" label="排序序号 :">
          <el-input-number placeholder="请输入排序序号" v-model="addForm.sequence" :min="1"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">保存</el-button>
      </div>
    </el-dialog>

    <!-- Modify Dialog -->
    <el-dialog title="修改广告" v-model="editFormVisible" :close-on-click-modal="false">
      <el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
        <el-form-item prop="name" label="广告名称 :">
          <el-input placeholder="请输入广告名称" v-model="editForm.name" :maxlength="25"></el-input>
        </el-form-item>
        <el-form-item class="is-required" label="广告图片 :" prop="advertimg">
          <input
            type="file"
            id="edit_advertimg"
            @change="readThumb(editForm, 'edit_advertimg')"
            style="display:none"
            accept=".png, .jpg"
          >
          <img
            :src="editForm.advertimg.blobfile"
            style="width: 210px; height: 121px; border: 1px dashed gray; float:left; margin-right: 10px;"
            @click="openThumbFile('edit_advertimg')"
          >
          <div style="height: 121px;">
            <el-button
              type="small"
              style="width: 80px; margin-top: 30px;"
              @click="openThumbFile('edit_advertimg')"
            >本地上传</el-button>
            <br>
            <el-button
              type="small"
              style="width: 80px;"
              @click="clearThumbFile(editForm, 'edit_advertimg')"
            >清空</el-button>
          </div>
        </el-form-item>
        <el-form-item prop="adverturl" label="跳转地址 :">
          <el-input placeholder="请输入跳转地址" v-model="editForm.adverturl"></el-input>
        </el-form-item>
        <el-form-item prop="sequence" label="排序序号 :">
          <el-input-number placeholder="请输入排序序号" v-model="editForm.sequence" :min="1"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">保存</el-button>
      </div>
    </el-dialog>
    <!-- End Modify Dialog -->
    <!-- Picture Preview Image -->
    <el-dialog v-model="previewFormVisible" :close-on-click-modal="true">
      <img :src="ECO_MEDIA_PATH + curAdvert.imagepath" style="width: 100%;" v-if="curAdvert!=null">
    </el-dialog>
    <!-- End Picture Preview Image -->
  </section>
</template>

<script>
import {
  getAdvertList,
  removeAdvert,
  setAdvertStatus,
  insertAdvert,
  modifyAdvert,
  uploadFile
} from "../../api/api";

export default {
  data() {
    return {
      advertList: [],
      listLoading: false,

      page_size: 10,
      total: 0,
      page: 1,
      page_total: 0,

      ECO_MEDIA_PATH: ECO_MEDIA_PATH,
      previewFormVisible: false,

      addFormVisible: false,
      addLoading: false,
      addForm: {
        name: "",
        adverturl: "",
        sequence: 0,
        advertimg: {
          blobfile: "",
          file: null
        }
      },
      addFormRules: {
        name: [{ required: true, message: "请输入广告名称", trigger: "blur" }],
        advertimg: [{ validator: this.validateThumbFile, trigger: "blur" }],
        adverturl: [
          { required: true, message: "请输入跳转地址", trigger: "blur" }
        ]
      },

      editFormVisible: false,
      editLoading: false,
      curAdvert: null,
      editForm: {
        advertid: 0,
        name: "",
        adverturl: "",
        sequence: 0,
        advertimg: {
          blobfile: "",
          file: null
        }
      },
      editFormRules: {
        name: [{ required: true, message: "请输入广告名称", trigger: "blur" }],
        adverturl: [
          { required: true, message: "请输入跳转地址", trigger: "blur" }
        ]
      },
      imageSize: {
        width: 0,
        height: 0
      }
    };
  },
  methods: {
    formatStatus: function(chargestatus) {
      if (chargestatus == "1") {
        return "有效";
      } else if (chargestatus == "0") {
        return "无效";
      }
    },
    load() {
      let para = {
        pagination: {
          numPerPage: this.page_size,
          pageNo: this.page,
          calTotal: true
        },
        conditions: []
      };

      this.listLoading = true;
      getAdvertList(para)
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.advertList = res.data.pageInfo.list;
            this.total = res.data.pageInfo.total;
            this.page_total = res.data.pageInfo.list.length;
          } else {
            this.$message({
              message: res.data.serverResult.resultMessage,
              type: "error"
            });
            this.advertList = [];
            this.total = 0;
          }
          this.listLoading = false;
          this.imageSize.width = $("section").width();
          this.imageSize.height = $("section").height();
        })
        .catch(() => {
          this.advertList = [];
          this.total = 0;
          this.listLoading = false;

          this.$message({
            message: "加载失败!",
            type: "error"
          });
        });
    },
    validateThumbFile(rule, value, callback) {
      if (this.addForm.advertimg.file == null) {
        callback(new Error("请输入广告图片"));
      } else {
        callback();
      }
    },
    openThumbFile(imgid) {
      document.getElementById(imgid).click();
    },
    readThumb(form, imgid) {
      var input = document.getElementById(imgid);
      var reader = new FileReader();
      var _this = this;

      reader.onload = function(e) {
        form.advertimg.blobfile = e.target.result;
      };

      form.advertimg.file = input.files[0];
      if (!form.advertimg.file.type.startsWith("image")) {
        this.$message({
          message: "只能支持图片格式。",
          type: "error"
        });
        return;
      }
      reader.readAsDataURL(form.advertimg.file);
    },
    clearThumbFile(form, imgid) {
      form.advertimg.file = null;
      form.advertimg.blobfile = "";
      document.getElementById(imgid).value = null;
    },
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
    doAdd: function() {
      this.addForm = {
        name: "",
        adverturl: "",
        sequence: 0,
        advertimg: {
          blobfile: "",
          file: null
        }
      };
      this.addFormVisible = true;
    },
    doEdit: function($index, advert) {
      this.editFormVisible = true;

      this.curAdvert = advert;
      this.editForm.advertid = advert.advertid;
      this.editForm.name = advert.name;
      this.editForm.advertimg.blobfile =
        ECO_MEDIA_PATH + advert.imagepath;
      this.editForm.advertimg.file = null;
      this.editForm.adverturl = advert.adverturl;
      this.editForm.sequence = parseInt(advert.sequence);
    },
    doDelete: function($index, advert) {
      this.$confirm("是否删除当前广告？", "提示", {
        type: "warning"
      }).then(() => {
        removeAdvert(advert.advertid)
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
    doStatus: function($index, advert) {
      let params = {
        advertid: advert.advertid,
        status: advert.status == "0" ? "1" : "0",
        sequence: advert.sequence
      };
      setAdvertStatus(params)
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
    },
    addSubmit: function() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          const data = new FormData();
          data.append("file", this.addForm.advertimg.file);
          uploadFile({ data: data, onUploadProgress: null }).then(res => {
            if (res.data.serverReults.resultCode == "200") {
              var path = res.data.fileInfos[0].localPath;
              this.addAdvertment(path);
            } else {
              this.$message({
                message: res.data.serverReults.resultMessage,
                type: "error"
              });
            }
          });
        }
      });
    },
    addAdvertment(path) {
      let para = {
        name: this.addForm.name,
        imagepath: path,
        adverturl: this.addForm.adverturl,
        sequence: this.addForm.sequence
      };

      this.addLoading = true;
      insertAdvert(para)
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.load();
          } else {
            this.$message({
              message: res.data.serverResult.resultMessage,
              type: "error"
            });
          }
          this.addLoading = false;
          this.addFormVisible = false;
        })
        .catch(() => {
          this.$message({
            message: "操作失败",
            type: "error"
          });
          this.addLoading = false;
          this.addFormVisible = false;
        });
    },
    editSubmit: function() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          if (this.editForm.advertimg.file == null) {
            this.modifyAdvertisment(this.curAdvert.imagepath);
          } else {
            const data = new FormData();
            data.append("file", this.editForm.advertimg.file);
            uploadFile({ data: data, onUploadProgress: null }).then(res => {
              if (res.data.serverReults.resultCode == "200") {
                var path = res.data.fileInfos[0].localPath;
                this.modifyAdvertisment(path);
              } else {
                this.$message({
                  message: res.data.serverResult.resultMessage,
                  type: "error"
                });
              }
            });
          }
        }
      });
    },
    modifyAdvertisment(path) {
      let para = {
        advertid: this.editForm.advertid,
        name: this.editForm.name,
        imagepath: path,
        adverturl: this.editForm.adverturl,
        sequence: this.editForm.sequence
      };

      this.editLoading = true;
      modifyAdvert(para)
        .then(res => {
          if (res.data.serverResult.resultCode == "200") {
            this.load();
          } else {
            this.$message({
              message: res.data.serverResult.resultMessage,
              type: "error"
            });
          }
          this.editLoading = false;
          this.editFormVisible = false;
        })
        .catch(() => {
          this.$message({
            message: "操作失败",
            type: "error"
          });
          this.addLoading = false;
          this.addFormVisible = false;
        });
    },
    showImage($index, advert) {
      this.curAdvert = advert;
      this.previewFormVisible = true;
    }
  },
  created() {
    this.load();
  }
};
</script>

<style scoped lang="scss">
@import "~scss_vars";
</style>