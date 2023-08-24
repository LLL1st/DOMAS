<template>
    <div>
        <el-form :inline="true" :model="searchForm" :rules="searchFormRules" ref="searchForm" style="margin-left: 20px; margin-top: 20px">
            <el-form-item label="模型名称" prop="modelName">
                <el-input
                        v-model="searchForm.modelName"
                        placeholder="请输入模型名称"
                        clearable @clear="getModelList"
                >
                </el-input>
            </el-form-item>
            <el-form-item label="状态">
                <el-select v-model="searchForm.isUsed" clearable @clear="getModelList" placeholder="全部">
                    <el-option
                            v-for="(item,index) in statusSearchOption"
                            :key="item.key"
                            :label="item.display_name"
                            :value="item.key">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button @click="getModelList">搜索</el-button>
            </el-form-item>
            <el-form-item>
                <el-popconfirm title="这是确定批量删除吗？" @confirm="delHandleSelect(null)">
                    <el-button type="danger" slot="reference" :disabled="delBtlStatu">批量删除</el-button>
                </el-popconfirm>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="viewAddDialogVisible=true">新增</el-button>
            </el-form-item>
        </el-form>

        <el-table
                ref="multipleTable"
                :data="tableData"
                :header-cell-style="rowStyle"
                :cell-style="rowStyle"
                tooltip-effect="dark"
                style="width: 100%;margin-bottom: 20px;"
                border
                @selection-change="handleSelectionChange"
                stripe>
            <el-table-column
              type="selection"
              :selectable="checkSelect"
              width="auto">
            </el-table-column>

            <el-table-column
                    v-if="false"
                    prop="modelId"
                    label="编号"
                    width="65px">
            </el-table-column>

            <el-table-column
                    prop="modelName"
                    label="模板名称"
                    v-if="false"
                    width="80px">
            </el-table-column>

            <el-table-column
                    prop="parameter"
                    label="模型名称"
                    width="150px">
                <template slot-scope="scope">
                    <el-button type="text" @click="viewJsonParams(scope.row.parameter)">{{scope.row.modelName}}</el-button>
                </template>
            </el-table-column>

          <el-table-column
            prop="description"
            label="模型描述"
            width="200px">
          </el-table-column>

          <el-table-column
            prop="isInitModel"
            label="模型类型"
            width="180px">
            <template slot-scope="scope">
              <el-tag size="small" v-if="scope.row.isInitModel === 1">基础模型</el-tag>
              <el-tag size="small" v-if="scope.row.isInitModel === 0" type="success">自定义模型</el-tag>
            </template>

          </el-table-column>

            <el-table-column
                    prop="isUsed"
                    label="状态"
                    width="150px">
                <template slot-scope="scope">
                    <el-tag size="small" v-if="scope.row.isUsed === 1" type="success">可用</el-tag>
                    <el-tag size="small" v-if="scope.row.isUsed === 0" type="danger">禁用</el-tag>
                </template>
            </el-table-column>

          <el-table-column
            prop="author"
            label="创建用户"
            width="80px">
          </el-table-column>

            <el-table-column
                    prop="createTime"
                    label="创建时间"
                    width="220px">
            </el-table-column>

            <el-table-column
                prop="modifyTime"
                label="更新时间"
                width="220px">

            </el-table-column>

            <el-table-column
                    prop="icon"
                    width="auto"
                    label="操作">

                <template slot-scope="scope">
                    <el-button type="text" :disabled="scope.row.isInitModel==1" @click="editModel(scope.row)" >编辑</el-button>
                    <el-divider direction="vertical"></el-divider>
                  <template v-if="scope.row.isInitModel==0">
                  <router-link  :to="{path:'/hepsapi/api/ModelApis',query:{modelId:scope.row.modelId,modelName: scope.row.modelName}}">附属接口</router-link>
                    <el-divider direction="vertical"></el-divider>
                  </template>
                    <template>
                        <el-popconfirm title="这是一段内容确定删除吗？" @confirm="delHandle(scope.row.modelId)" >
                            <el-button type="text" :disabled="scope.row.isInitModel==1" slot="reference">删除</el-button>
                        </el-popconfirm>
                    </template>
                </template>
            </el-table-column>

        </el-table>
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                layout="total, sizes, prev, pager, next, jumper"
                :page-sizes="[10, 20, 50, 100]"
                :current-page="current"
                :page-size="size"
                :total="total">
        </el-pagination>

        <!--新增模型-->
        <el-dialog
            title="新增模型"
            :visible.sync="viewAddDialogVisible"
            width="500px"
            :before-close="resetForm">
            <el-form :model="addForm" :rules="addFormRules" ref="addForm" label-position="left" size="middle" label-width="100px">
                <el-form-item label="模型名称" prop="modelName">
                    <el-col :span="14">
                        <el-input clearable v-focus v-model="addForm.modelName" autocomplete="off" placeholder="请输入模型名称" style="width: 300px;height: 35px;float: left;"></el-input>
                    </el-col>
                </el-form-item>
              <el-form-item label="模型描述">
                <el-col :span="14">
                  <el-input clearable type="textarea" :row="2" v-model="addForm.description" style="width: 300px;height: 35px;float: left;"></el-input>
                </el-col>
              </el-form-item>
                <el-form-item label="参考基础模型" prop="useBaseModel">
                    <el-switch v-model="addForm.useBaseModel"></el-switch>
                </el-form-item>
                <el-form-item v-if="addForm.useBaseModel" label="基础模型" prop="baseModel">
                    <el-col :span="14">
                        <el-select  clearable  v-model="addForm.baseModel" placeholder="请选择基础模型" style="width: 300px;height: 35px;float: left;">
                            <el-option v-for="(item,index) in baseModelNameList" :key="index" :value="item">{{item}}</el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="编辑参数" prop="parameter">
                    <el-button type="primary" :disabled="addForm.modelName==null" @click="addForm.useBaseModel ? editParam(addForm.baseModel) : editParam()">开始</el-button>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetForm('addForm')">取消</el-button>
                <el-button type="primary" @click="submitForm('addForm')">确定</el-button>
            </div>
        </el-dialog>

        <!--参数预览 json形式-->
        <el-dialog
                title="模型参数结构"
                width="30%"
                :visible.sync="viewJsonDialogVisible"
        >
            <div style="width:100%;height: 390px;overflow-y: scroll;" >
                <JsonView :json="jsonData"></JsonView>
            </div>
        </el-dialog>

        <!--新增模型参数编辑-->
        <el-dialog
                title="模型参数结构"
                width="30%"
                :visible.sync="editParamVisible"
        >
            <div>
                <vue-json-editor
                        v-model="jsonStr"
                        :show-btns="true"
                        :mode="'code'"
                        lang="zh"
                        style="height: 500px"
                        @json-change="onJsonChange"
                        @json-save="onAddSave"
                        @has-error="onError"></vue-json-editor>
                <el-button type="primary" @click="editParamVisible=false" size="mini" style="margin-top: 10px;background-color:#20A0FF;margin-left:30%;padding:5px 10px;border-bottom-width:2px;font-size: 13.333px;">取消</el-button>
            </div>
        </el-dialog>

      <!--模型编辑-->
      <el-dialog
        title="模型信息编辑"
        width="40%"
        :visible.sync="editModelVisible">
        <el-form :model="editModelForm" :rules="addFormRules"  ref="editModelForm" label-position="left" size="middle" label-width="100px">
          <el-form-item label="模型名称" prop="modelName">
            <el-input clearable v-focus v-model="editModelForm.modelName" autocomplete="off" placeholder="请输入模型名称" style="width: 300px;height: 35px;float: left;"></el-input>
          </el-form-item>
          <el-form-item label="模型描述" prop="description">
            <el-input clearable type="textarea" :row="2" v-model="editModelForm.description" style="width: 300px;height: 35px;float: left;"></el-input>
          </el-form-item>
          <el-form-item label="禁用" prop="isUsed">
            <el-switch :active-value=0 :inactive-value=1 v-model="editModelForm.isUsed"></el-switch>
          </el-form-item>
        </el-form>
        <div>
          <vue-json-editor
            v-model="jsonStr"
            :show-btns="false"
            :mode="'code'"
            lang="zh"
            style="height: 500px"
            @json-change="editorModelParameter=true"
            @json-save="onJsonSave"
            @has-error="onError">
          </vue-json-editor>
<!--          <el-button type="primary"  @click="viewDialogVisible=false" size="mini" style="margin-top: 10px;background-color:#20A0FF;margin-left:30%;padding:5px 10px;border-bottom-width:2px;font-size: 13.333px;">取消</el-button>-->
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editModelVisible=false">取消</el-button>
          <el-button type="primary" @click="updateModelStatus('addForm')">确定</el-button>
        </div>

      </el-dialog>
    </div>
</template>

<script>
    import {pageModel, addModel, delModelById, updateModel, updateModelParameter,delModelByIds} from '@/api/model'
    import {checkNameReg,checkIdReg} from '@/utils/common'
    import JsonView from "@/components/JsonView";
    import vueJsonEditor from 'vue-json-editor'
    import Vue from "vue";
    export default {
        name: "CustomModel",
        components:{
            JsonView,
            vueJsonEditor
        },
        data() {
            return {
                editorModelParameter:false,
                editModelVisible:false,
                editParamVisible:false,
                editModelForm:{},
                modelJson:{
                    name: "model Name",
                    description: "description of the model",
                    mongodb:{
                        onDisk:true,
                        collection:"collectionName"
                    },
                    parameter: {
                        field1: {
                            type: "string/date/number/boolean/object/array",
                            isRequired: true,
                            isIndex: true,
                            description: "description of field1"
                        },
                        field2: {
                            type: "string/date/number/boolean/object/array",
                            isRequired: true,
                            isIndex: true,
                            description: "description of field2"
                        },
                        fieldn: {
                            type: "string/date/number/boolean/object/array",
                            isRequired: true,
                            isIndex: true,
                            description: "description of fieldn"
                        }
                    },
                    relation:{
                        modelRelation:[
                            {
                                modelName:"foreignKey",
                                relateModelName:"key"
                            }
                        ]
                    }
                },
                jsonStr:{},
                updateForm:{query:{},set:{}},
                baseModelNameList:[],
                updateParams:{
                    query:{},
                    set:{}
                },
                searchForm:{},
                editForm:{},
                addParamForm:{},
                delBtlStatu: true,
                statusSearchOption:[
                    {key:'1',display_name:'可用'},
                    {key: '0',display_name: '禁用'}
                ],
                viewJsonDialogVisible:false,
                // 分页数据
                total: 0,
                size: 10,
                current: 1,
                viewAddDialogVisible: false,
                addDialogVisible:false,
                addForm: {},
                addFormRules:{
                    modelName:[
                        {required:true,message:'请输入模型名称',trigger:'blur'},
                        {validator:checkNameReg}
                    ],
                    baseModel:[
                        {required:true,message:'请选择一个基本模型',trigger:'change'}
                    ]
                },
                searchFormRules:{
                  modelName:[
                    {trigger:'blur'},
                    {validator:checkNameReg}
                  ]
                },
                addParamFormRules:{
                    fieldName:[
                        {required:true,message:'请输入字段名称',trigger:'blur'},
                        {validator:checkNameReg}
                    ],
                    fieldType:[
                        {required:true,message:'请选择字段类型',trigger:'change'},
                    ],
                    isRequired:[
                        {required:true,message:'请选择是否必需',trigger:'change'},
                    ],
                    isIndex:[
                        {required:true,message:'请选择是否做为索引',trigger:'change'},
                    ],
                    description:[
                        {required:false,message:'请输入备注',trigger:'blur'},
                    ],
                },
                tableData: [],
                multipleSelection: [],
                jsonData:{},
            }
        },
        // 使用directives注册v-focus指令,自动获取焦点
        directives: {
            focus: {
                inserted: function(el) {
                    el.querySelector('input').focus()
                }
            }
        },
        created() {
            this.getModelList()
            this.getBaseModelNameList()
        },
        methods: {
            getBaseModelNameList() {
                pageModel({"isInitModel":1,"currentPage":1,"pageSize":10}).then(res =>{
                    let temData = res.data.data.list
                    for(let i in temData){
                        this.baseModelNameList.push(temData[i].modelName)
                    }
                })
            },
          rowStyle() {
            return "text-align:center";
          },
          //判断表格行是否可选，基础模型不可选
          checkSelect(row,index){
              let flag = true
              if (row.isInitModel === 1) {
                flag = false
              }
              return flag
          },
            onJsonChange (value) {
                console.log('value:', value);
            },
            onJsonSave (value) {
                this.updateForm.set.parameter = JSON.stringify(value)
                updateModelParameter(this.updateForm).then(res =>{
                    if (res.data.code == 200){
                        this.$message({
                            showClose:true,
                            message:'操作成功',
                            type:'success'
                        })
                    }else{
                        this.$message({
                            showClose:true,
                            message:'操作失败',
                            type:'failed'
                        })
                    }
                })
            },
            onAddSave(value){
                this.addForm.parameter = JSON.stringify(value)
                this.editParamVisible = false
            },
            onError (value) {
                console.log('value:', value);
            },
            editParam(item){
                if (item != null) {
                    pageModel({"isInitModel":1,"currentPage":1,"pageSize":10,"modelName":item}).then(res =>{
                        this.jsonStr = JSON.parse(res.data.data.list[0].parameter)
                        this.jsonStr.name = this.addForm.modelName
                        this.jsonStr.description = this.addForm.description
                        this.editParamVisible = true
                    })
                } else {
                    this.jsonStr = this.modelJson
                    this.jsonStr.name = this.addForm.modelName
                    this.jsonStr.description = this.addForm.description
                    this.editParamVisible = true
                }
            },
            getModelList(){
                this.searchForm['currentPage'] = this.current;
                this.searchForm['pageSize'] = this.size;
                if(this.searchForm['modelName'] === '')this.searchForm['modelName'] = null;
                pageModel(this.searchForm).then(res => {
                    this.tableData = res.data.data.list
                    this.total = res.data.data.count
                    this.tableData.sort(function(a, b) {
                      if(a["isInitModel"] === b["isInitModel"]) {
                        if(a["createTime"] > b["createTime"]) {
                          return -1;
                        } else if(a["createTime"] < b["createTime"]) {
                          return 1;
                        } else {
                          return 0;
                        }
                      } else {
                        if(a["isInitModel"] > b["isInitModel"]) {
                          return -1;
                        } else {
                          return 1;
                        }
                      }
                    })
                })
            },
            // toggleSelection(rows) {
            //   if (rows) {
            //     rows.forEach(row => {
            //       this.$refs.multipleTable.toggleRowSelection(row);
            //     });
            //   } else {
            //     this.$refs.multipleTable.clearSelection();
            //   }
            // },
            handleSelectionChange(val) {
              this.multipleSelection = val;
              this.delBtlStatu = val.length == 0
            },
            handleSizeChange(val) {
                this.size = val
                this.getModelList()
            },
            handleCurrentChange(val) {
                this.current = val
                this.getModelList()
            },
            resetForm(formName) {
                this.viewAddDialogVisible = false
                this.addForm = {}
            },
            //新增确认
            submitForm(formName){
                this.$refs[formName].validate((valid) => {
                    if(valid) {
                        delete this.addForm.baseModel
                        delete this.addForm.useBaseModel
                        addModel(this.addForm).then(res => {
                            if(res.data.code == 200){
                                this.$message({
                                    showClose:true,
                                    message:'新增成功',
                                    type:'success'
                                })
                                this.viewAddDialogVisible =false
                                this.getModelList()
                            }else {
                                this.$message({
                                    showClose:true,
                                    message:'操作失败',
                                    type:'failed'
                                })
                                this.viewAddDialogVisible =false
                                this.getModelList()
                            }
                        })
                    }else {
                        return false;
                    }
                })
            },
            //参数预览
            viewJsonParams(item){
                this.viewJsonDialogVisible = true;
                this.jsonData = JSON.parse(item)
            },
            editModel(item){
              this.updateParams.query.id = item.modelId
              this.editModelForm = JSON.parse(JSON.stringify(item))
              this.updateForm.query.id = item.modelId
              this.jsonStr = JSON.parse(item.parameter);
              this.updateParams.set.modelName = item.modelName
              this.editModelVisible = true;
            },
            //编辑模型
            updateModelStatus(item){
                if(this.editorModelParameter){
                   this.onJsonSave(this.jsonStr)
                }
                this.updateParams.set.modelName = this.editModelForm.modelName
                this.updateParams.set.description = this.editModelForm.description
                this.updateParams.set.isUsed = this.editModelForm.isUsed
                updateModel(this.updateParams).then(res => {
                    if (res.data.code == 200){
                        this.$message({
                            showClose:true,
                            message:'操作成功',
                            type:'success'
                        })
                      this.getModelList()
                    }else{
                        this.$message({
                            showClose:true,
                            message:'操作失败',
                            type:'failed'
                        })
                    }
                })
                this.editorModelParameter = false
                this.editModelVisible = false
            },
            //删除模型，至isDelete为1
            delHandle(item){
                delModelById(item).then(res =>{
                    if(res.data.code == 200){
                        this.$message({
                            showClose:true,
                            message:'删除成功',
                            type:"success"
                        })
                      this.getModelList()
                    }else{
                        this.$message({
                            showClose:false,
                            message:'删除失败',
                            type:"success"
                        })
                    }
                })
            },
            delHandleSelect(id) {
                var ids = []
                if (id) {
                    ids.push(id)
                } else {
                    this.multipleSelection.forEach(row => {
                        ids.push(row.modelId)
                    })
                }
                delModelByIds(ids).then(res => {
                  if (res.data.code == 200){
                    this.$message({
                      showClose:true,
                      message:'操作成功',
                      type:'success'
                    })
                    this.getModelList()
                  }else{
                    this.$message({
                      showClose:true,
                      message:'操作失败',
                      type:'failed'
                    })
                  }
                })
            },
        }
    }
</script>

<style scoped>
    .el-pagination {
        float: right;
        margin-top: 22px;
    }
    .searchInput{
        margin-left: 0px;
        margin-right: 15px;
        margin-top: 15px;
        margin-bottom: 15px;
        /*display: flex;*/
    }
    .addModelForm{
        padding-top: 15px;
    }
    div >>>.jsoneditor-vue{
        height: 100%;
    }
</style>
