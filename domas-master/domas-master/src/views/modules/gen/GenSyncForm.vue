<template>
<div>
    <el-dialog
    title="同步数据库"
    :append-to-body="true"
    :close-on-click-modal="false"
    width="400px"
    :before-close="()=>{loading=false, visible=false}"
     v-dialogDrag
    :visible.sync="visible">
      <el-form size="mini" :model="inputForm"    v-loading = "loading" ref="inputForm" @keyup.enter.native="doSubmit()"
              label-width="10px" :class="method==='view'?'readonly':''" :disabled="method==='view'" @submit.native.prevent>
          <el-form-item>
确认要同步数据库吗? 请慎重操作，同步数据库将删除所有数据重新建表!
            <br/>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
            <el-button size="mini" type="primary" @click="doSubmit" v-noMoreClick>确定</el-button>
            <el-button size="mini" @click="visible=false, loading=false">关闭</el-button>
      </span>
    </el-dialog>

</div>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        loading: false,
        method: '',
        title: '新增',
        inputForm: {
          id: '',
          isForce: '2'
        }
      }
    },
    methods: {
      init (id) {
        this.inputForm.id = id
        this.visible = true
      },
      // 表单提交
      doSubmit () {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$http.get(`/code/codeTable/synchDb?id=${this.inputForm.id}&isForce=${this.inputForm.isForce}`).then(({data}) => {
              this.loading = false
              if (data && data.success) {
                this.$message.success(data.msg)
                this.visible = false
                this.$emit('refreshDataList')
              }
            })
          }
        })
      }
    }
  }
</script>