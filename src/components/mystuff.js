import Vue from 'vue'

Vue.component('my-stuff', {
  template: '<div class="my-stuff" style="margin: 10px 5px;">\
          <el-col :span="3">\
            <!--<img :src="stuff.thumb"/>-->\
            <img src="static/img/resource.png" style="width:70px;height:70px;"/>\
          </el-col>\
          <el-col :span="21">\
            <ul style="list-style-type:none; float:left; margin: 0px;">\
              <li align=left><h1 style="margin: 0px;">{{stuff.resource.name}}</h1></li>\
              <li align=left>{{stuff.resource.subject}} &nbsp; {{stuff.resource.grade}} &nbsp; {{stuff.resource.schoolsection}}</li>\
              <li align=left>{{stuff.resource.creator}} &nbsp; 更新时间:{{stuff.lastmodifytime}}</li>\
            </ul>\
          </el-col>\
        </div>',

  replace: true,
  props: {
    stuff: {
      type: Object,
    }
  },
  data: function() {
    return {
    }
  },
  methods: {
    // getContentType(contentType) {
    //   if (contentType == 'K') {
    //     return '课件';
    //   } else if (contentType == 'T1') {
    //     return '教学设计';
    //   } else if (contentType == 'T2') {
    //     return '拓展文本';
    //   } else if (contentType == 'T3') {
    //     return '试卷';
    //   } else if (contentType == 'P') {
    //     return '图片';
    //   } else if (contentType == 'V') {
    //     return '视频';
    //   } else if (contentType == 'M') {
    //     return '音频';
    //   } else if (contentType == 'C') {
    //     return '动画';
    //   } else if (contentType == 'E') {
    //     return '电子书';
    //   }
    // }
  },
  created: function() {
    console.log(this.stuff);
    //{{getContentType(sutff.contenttype)}} &nbsp; 
  }
});