import Vue from 'vue'

Vue.component('my-resource', {
  template: '<div class="my-resource" style="margin: 10px 5px;">\
          <el-col :span="3">\
            <!--<img :src="resource.thumb"/>-->\
            <img src="static/img/resource.png" style="width:70px;height:70px;"/>\
          </el-col>\
          <el-col :span="21">\
            <ul style="list-style-type:none; float:left; margin: 0px;">\
              <li align=left><h1 style="margin: 0px;">{{resource.name}}</h1></li>\
              <li align=left>{{getContentType(resource.contenttype)}} &nbsp; {{resource.subject}} &nbsp; {{resource.grade}} &nbsp; {{resource.schoolsection}}</li>\
              <li align=left>{{resource.creatorname}} &nbsp; 更新时间:{{resource.lastupdatetime}}</li>\
            </ul>\
          </el-col>\
        </div>',

  replace: true,
  props: {
    resource: {
      type: Object,
    }
  },
  data: function() {
    return {
    }
  },
  methods: {
    getContentType(contentType) {
      if (contentType == 'K') {
        return '课件';
      } else if (contentType == 'T1') {
        return '教学设计';
      } else if (contentType == 'T2') {
        return '拓展文本';
      } else if (contentType == 'T3') {
        return '试卷';
      } else if (contentType == 'P') {
        return '图片';
      } else if (contentType == 'V') {
        return '视频';
      } else if (contentType == 'M') {
        return '音频';
      } else if (contentType == 'C') {
        return '动画';
      } else if (contentType == 'E') {
        return '电子书';
      }
    }
  },
  created: function() {
  }
});