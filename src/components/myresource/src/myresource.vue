<template>
  <el-row class="my-resource ecrw-ready-bk-wrap" v-if="resource!=null">
    <el-col :span="24">
      <div class="thumb" :class="className">
          <img :src="thumbpath.localpath" style="width:70px;height:90px;" v-if="thumbpath.localpath!=''"/>
      </div>
      <ul>
        <li align=left>
          <h1>{{resource.name}}</h1>
        </li>
        <li align=left>
          {{ ECRUtil.resourceLabel(resource.contenttype) }}
          {{ resource.bookmodel }}
          {{ resource.editiontype }}
          {{ resource.grade }}
          {{ resource.subject }}
          {{ resource.schoolsection }}
        </li>
        <li align=left>
          {{resource.creatorname}} &nbsp; 更新时间:{{resource.lastupdatetime}}
        </li>
      </ul>
    </el-col>
  </el-row>
</template>

<script>
  import ECRUtil from '../../../common/js/util'

  export default {
    props: {
      resource: {
        type: Object,
      }
    },
    data: function() {
      return {
        ECRUtil:ECRUtil,
        thumbpath:{ localpath:'' },
        className:'',        
      }
    },
    created(){      
      this.className = ECRUtil.getDefaultThumb(this.resource, this.thumbpath);
    },
    watch:{
      'resource':function(val){        
        this.className = ECRUtil.getDefaultThumb(val, this.thumbpath);
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '~scss_vars';
  
  .my-resource {
    margin: 10px 5px;
  }
  .my-resource .thumb {
    float: left;
    width: 70px;
    height: 90px;
    text-align: center;
  }
  .my-resource .thumb img {
    width: 120px;
  }
  .my-resource ul {
    float:left;
    list-style-type:none;
    margin-top:0px;
    margin-bottom:0px;
    padding-left:10px;
    width: calc(100% - 80px);
  }
  h1 {
    margin:0px;
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
  }
  .ecrw-exam-bk-word{background:url(../../../../static/img/ecrw-bk-word.png) no-repeat center center;}
  .ecrw-exam-bk-teach{background:url(../../../../static/img/ecrw-bk-teach.png) no-repeat center center;}
  .ecrw-exam-bk-ext{background:url(../../../../static/img/ecrw-bk-ext.png) no-repeat center center;}
  .ecrw-exam-bk-test{background:url(../../../../static/img/ecrw-bk-test.png) no-repeat center center;}        
  .ecrw-exam-bk-test2{background:url(../../../../static/img/ecrw-bk-test2.png) no-repeat center center;}
  .ecrw-exam-bk-pic{background:url(../../../../static/img/ecrw-bk-pic.png) no-repeat center center;}
  .ecrw-exam-bk-video{background:url(../../../../static/img/ecrw-bk-video.png) no-repeat center center;}
  .ecrw-exam-bk-audio{background:url(../../../../static/img/ecrw-bk-audio.png) no-repeat center center;}
  .ecrw-exam-bk-swf{background:url(../../../../static/img/ecrw-bk-swf.png) no-repeat center center;}
  .ecrw-exam-bk-h5{background:url(../../../../static/img/ecrw-bk-h5.png) no-repeat center center;}
  .ecrw-exam-bk-epub{background:url(../../../../static/img/ecrw-bk-epub.png) no-repeat center center;}
  .ecrw-exam-bk-other{background:url(../../../../static/img/ecrw-bk-other.png) no-repeat center center;}
  .ecrw-exam-bk-zip{background:url(../../../../static/img/ecrw-bk-zip.png) no-repeat center center;}
  .ecrw-exam-bk-shiti{background:url(../../../../static/img/ecrw-bk-shiti.png) no-repeat center center;}
  .ecrw-exam-bk-jiaocai{background:url(../../../../static/img/ecrw-bk-jiaocai.png) no-repeat center center;}
</style>