<template>
  <div class="page">
    <div id="fileview"  style="height:100%; width: 100%"></div>
    <el-dialog title="预览" width="70%" v-dialogDrag :visible.sync="videoVisible">
      <video  scrolling="no" autoplay  style="scrolling:no;background-color: black;"
      width="100%" :src="url"  controls="controls">Your browser does not support the video tag.
      </video>
    </el-dialog>
    <el-dialog title="预览" width="70%" v-dialogDrag :visible.sync="audioVisible">
      <audio  autoplay  width="100%" :src="url"  controls="controls">'
            Your browser does not support the audio tag.
      </audio>
    </el-dialog>
    <el-dialog title="预览" width="70%" v-dialogDrag :visible.sync="imageVisible">
      <img width="100%"  :src="url" />
    </el-dialog>
    <el-dialog title="预览" width="70%"  v-dialogDrag :visible.sync="pdfVisible">
       <embed :src="url" type="application/pdf" width="100%" height="100%" internalinstanceid="81"/>
    </el-dialog>
</div>
</template>
<script>
import 'cordwood-filemanager/filemanager/codebase/webix.js'
import 'cordwood-filemanager/filemanager/filemanager.js'
// import FileService from '@/api/sys/FileService'
export default {
  data () {
    return {
      videoVisible: false,
      audioVisible: false,
      imageVisible: false,
      pdfVisible: false,
      url: ''
    }
  },
  // fileService: null,
  // created () {
  //   this.fileService = new FileService()
  // },
  mounted () {
    window.webix.ready(() => {
      let f = window.webix.ui({
        container: 'fileview',
        view: 'filemanager',
        id: 'fm',
        url: `${this.$http.BASE_URL}/sys/file/list`,
        readonly: false,
        handlers: {
          'upload': `${this.$http.BASE_URL}/sys/file/upload`,
          'download': `${this.$http.BASE_URL}/sys/file/download`,
          'copy': `${this.$http.BASE_URL}/sys/file/copy`,
          'move': `${this.$http.BASE_URL}/sys/file/move`,
          'remove': `${this.$http.BASE_URL}/sys/file/remove`,
          'rename': `${this.$http.BASE_URL}/sys/file/rename`,
          'create': `${this.$http.BASE_URL}/sys/file/createFolder`
        }
      })
      window.addEventListener('resize', function () { // 执行
        document.getElementById('fileview').style.height = document.body.clientHeight - 140 + 'px'
        f.resize()
      })
      var actions = window.$$('fm').getMenu()
      let _this = this
      actions.attachEvent('onItemClick', function (id, e) {
        var target = this.nh.id.row ? this.nh.id.row : this.nh.id
        if (id === 'view') {
          _this.fileService.getUrl({dir: target}).then(({data}) => {
            _this.play(data.url, data.type)
          })
          window.$$('fm').getMenu().hide()
        }
      })
    })
  },
  methods: {
    play (url, type) {
      if (type === 'video') {
        this.videoVisible = true
        this.url = url
      } else if (type === 'audio') {
        this.audioVisible = true
        this.url = url
      } else if (type === 'image') {
        this.imageVisible = true
        this.url = url
      } else if (type === 'pdf') {
        this.pdfVisible = true
        this.url = url
      } else {
        this.$message.error('不支持的预览格式')
      }
    }
  }
}
</script>
<style>
   @import '~cordwood-filemanager/filemanager/codebase/webix.css';
    @import '~cordwood-filemanager/filemanager/filemanager.css';

</style>
