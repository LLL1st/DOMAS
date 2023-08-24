<template>
<div>
  <el-dialog
    title="生成代码"
    :close-on-click-modal="false"
     v-dialogDrag
    :visible.sync="visible">
    <el-form size="mini" v-loading="loading" :model="inputForm"  ref="inputForm" @keyup.enter.native="doSubmit()"
             label-width="120px" @submit.native.prevent>
      <el-row  :gutter="15">
        <el-col :span="24">
          <el-form-item label="后端生成路径" prop="projectPath" :rules="[{required: true, message: '必填项不能为空', trigger: 'blur'}]">
            <el-input placeholder="请输入生成路径" v-model="inputForm.projectPath" class="input-with-select">
              <el-button type="primary" @click="selectFilePath()" slot="append">选择后端代码生成目录</el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="前端生成路径" prop="frontProjectPath" :rules="[{required: true, message: '必填项不能为空', trigger: 'blur'}]">
            <el-input placeholder="请输入生成路径" v-model="inputForm.frontProjectPath" class="input-with-select">
              <el-button type="primary" @click="selectFrontFilePath()" slot="append">选择前端代码生成目录</el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="选择代码模板" prop="category" :rules="[{required: true, message: '必填项不能为空', trigger: 'blur'}]">
            <el-select v-model="inputForm.category" placeholder="请选择"  style="width: 100%;">
                <el-option
                  v-for="item in codeTemplateGroupList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="生成包路径" prop="packageName" :rules="[{required: true, message: '必填项不能为空', trigger: 'blur'}]">
            <el-input maxlength="200" v-model="inputForm.packageName" 
                  placeholder="生成包路径"></el-input>
                   <div class="sub-title">建议模块包：com.cordwood</div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="生成模块名" prop="moduleName" :rules="[{required: true, message: '必填项不能为空', trigger: 'blur'}]">
            <el-input maxlength="200" v-model="inputForm.moduleName" 
                  placeholder="可理解为子系统名，例如 sys"></el-input>
          </el-form-item>
        </el-col>
      
        <el-col :span="24">
          <el-form-item label="生成子模块名" prop="subModuleName">
            <el-input maxlength="200" v-model="inputForm.subModuleName" 
                  placeholder="可选，分层下的文件夹"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="生成功能描述" prop="functionName" :rules="[{required: true, message: '必填项不能为空', trigger: 'blur'}]">
            <el-input maxlength="200" v-model="inputForm.functionName" 
                  placeholder="functionName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="生成功能名" prop="functionNameSimple" :rules="[{required: true, message: '必填项不能为空', trigger: 'blur'}]">
            <el-input maxlength="200" v-model="inputForm.functionNameSimple" 
                  placeholder="用作功能提示，如：保存“某某”成功"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="生成功能作者" prop="packageName" :rules="[{required: true, message: '必填项不能为空', trigger: 'blur'}]">
            <el-input maxlength="200" v-model="inputForm.functionAuthor" 
                  placeholder="功能开发者"></el-input>
          </el-form-item>
        </el-col>

      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="mini" @click="visible = false, loading=false">关闭</el-button>
      <el-button size="mini" type="primary" @click="doSubmit()" v-noMoreClick>确定</el-button>
    </span>
  </el-dialog>
  <file-tree ref="fileTree" @getValue="value => inputForm.projectPath=value"></file-tree>
  <file-tree ref="frontFileTree" @getValue="value => inputForm.frontProjectPath=value"></file-tree>
</div>
</template>

<script>
  import FileTree from './FileTree'
  import SelectTree from './treeSelect.vue'
  export default {
    data () {
      return {
        visible: false,
        loading: false,
        codeTemplateGroupList: [],
        tableList: [],
        inputForm: {
          id: '',
          codeTable: {
            id: ''
          },
          projectPath: '',
          frontProjectPath: '',
          category: '',
          packageName: 'com.cordwood',
          moduleName: '',
          subModuleName: '',
          functionName: '',
          functionNameSimple: '',
          functionAuthor: ''
        }
      }
    },
    components: {
      SelectTree,
      FileTree
    },
    methods: {
      init (id) {
        this.inputForm.codeTable.id = id
        this.visible = true
        this.$nextTick(() => {
          this.$refs['inputForm'].resetFields()
          this.$http.get(`/code/codeTable/queryGenCodeForm?codeTable.id=${this.inputForm.codeTable.id}&tableType=0`).then(({data}) => {
            this.inputForm = this.recover(this.inputForm, data.codeParam)
            this.codeTemplateGroupList = data.codeTemplateGroupList
            this.tableList = data.tableList
          })
        })
      },

      selectFilePath () {
        this.$refs.fileTree.init()
      },
      selectFrontFilePath () {
        this.$refs.frontFileTree.init()
      },
      // 表单提交
      doSubmit () {
        this.$refs['inputForm'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.$http({
              url: `/code/codeTable/makeCode`,
              method: 'post',
              data: this.inputForm
            }).then(({data}) => {
              this.loading = false
              if (data && data.success) {
                this.$message.success({dangerouslyUseHTMLString: true,
                  duration: 20000,
                  showClose: true,
                  message: data.msg})
              }
              this.visible = false
            }).catch(() => {
              this.loading = false
            })
          }
        })
      }
    }
  }
</script>