<template>
  <div>
    <el-form :inline="true" :model="searchForm" :rules="searchFormRules" style="margin-left: 20px; margin-top: 20px">
      <el-form-item label="使用模型">
        <el-input
          v-model="this.tableTitle"
         :disabled="true"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="接口名称" prop="apiName">
        <el-input
          v-model="searchForm.apiName"
          placeholder="请输入接口名称"
          clearable
          @clear="getApiList"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="searchForm.isUsed" clearable @clear="getApiList" placeholder="全部">
          <el-option
            v-for="(item,index) in statusSearchOption"
            :key="item.key"
            :label="item.display_name"
            :value="item.key">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button @click="getApiList">搜索</el-button>
      </el-form-item>

      <el-form-item>
        <el-popconfirm title="这是确定批量删除吗？" @confirm="delHandleSelect(null)">
          <el-button type="danger" slot="reference" :disabled="delBtlStatu">批量删除</el-button>
        </el-popconfirm>
      </el-form-item>
    </el-form>

    <el-table
      :data="tableData"
      :header-cell-style="rowStyle"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      :default-sort = "{prop: 'apiName'}"
      stripe
      default-expand-all
      @selection-change="handleSelectionChange">

      <el-table-column
          align="center"    type="selection"
        width="55">
      </el-table-column>

      <el-table-column
          align="center"
          v-if="false"
          prop="apiId"
        label="ID"
        width="65">
      </el-table-column>

      <el-table-column
          align="center"    prop="apiName"
        label="名称"
        width="100">
      </el-table-column>

      <el-table-column
          align="center"    prop="method"
        label="请求类型"
        width="105">
      </el-table-column>

      <el-table-column
          align="center"    prop="type"
        label="操作类型"
        width="105">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.type === 'add'" >新增</el-tag>
          <el-tag size="small" v-else-if="scope.row.type === 'delete'" >删除</el-tag>
          <el-tag size="small" v-else-if="scope.row.type === 'query'" >查询</el-tag>
          <el-tag size="small" v-else-if="scope.row.type === 'update'" >更新</el-tag>
        </template>
      </el-table-column>

      <el-table-column
          align="center"    prop="url"
        label="接口地址"
        width="330">
      </el-table-column>

      <el-table-column

        label="接口参数"
        width="180">
        <template slot-scope="scope">
          <div>
            <div>
              <!--              <json-viewer :value="JSON.parse(scope.row.filter)"  :expand-depth=1 />-->
              <JsonView :json="JSON.parse(scope.row.filter)" closed="closed"></JsonView>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column align="center"    prop="description"
        label="描述信息"

        width="140">
      </el-table-column>

      <el-table-column align="center"    prop="author"
        label="创建者"
        width="70">
      </el-table-column>

      <el-table-column align="center"    prop="accessUser"
        label="授权用户">
      </el-table-column>

      <el-table-column align="center"    prop="isUsed"
        label="状态">
        <template slot-scope="scope">
          <el-tag size="small" v-if="scope.row.isUsed === 1" type="success">启用</el-tag>
          <!--          <el-tag size="small" v-if="scope.row.status === 2" type="success">草稿</el-tag>-->
          <el-tag size="small" v-else-if="scope.row.isUsed === 0" type="danger">禁用</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center"    prop="modelName"
                       width="120px"
        label="模型名称">
        <template slot-scope="scope">
          <el-button type="text" @click="viewModelParam(scope.row.parameter)">{{scope.row.modelName}}</el-button>
        </template>
      </el-table-column>

      <el-table-column align="center"    prop="icon"
        label="操作"
        width="180px">

        <template slot-scope="scope">
          <el-button type="text" @click="editHandle(scope.row)">编辑</el-button>
          <el-divider direction="vertical"></el-divider>
          <template>
            <el-popconfirm title="确定删除此接口吗？" @confirm="delHandle(scope.row.apiId)">
              <el-button type="text" slot="reference">删除</el-button>
            </el-popconfirm>
          </template>
          <el-divider direction="vertical"></el-divider>
          <el-button v-if="scope.row.isUsed===1" type="text" @click="editIsUsed_off(scope.row.apiId)">禁用</el-button>
          <el-button v-if="scope.row.isUsed===0" type="text" @click="editIsUsed_on(scope.row.apiId)">启用</el-button>
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

    <!--参数预览 json形式-->
    <el-dialog
      title="模型参数结构"
      width="30%"
      :visible.sync="viewModelJson"
    >
      <div style="width:100%;height: 390px;overflow-y: scroll;" >
        <JsonView :json="jsonData"></JsonView>
      </div>
    </el-dialog>

    <!--    编辑框-->
    <el-dialog
      title="接口信息编辑"
      :visible.sync="dialogEditView"
      width="550px"
      :before-close="handleClose">

      <el-form :model="editViewForm" :rules="editFormRules" ref="editViewForm">
        <el-form-item label="接口名称" prop="name" label-width="120px">
          <el-input v-model="editViewForm.apiName" autocomplete="off" :disabled="true" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item :required="true" label="基本请求类型" :rules="editFormRules" label-width="120px" :inline="true">
          <el-select v-model="editViewForm.type" placeholder="请选择操作类型" size="small" :disabled="true" style="width: 300px">
            <el-option label="新增" value="add"></el-option>
            <el-option label="删除" value="delete"></el-option>
            <el-option label="更新" value="update"></el-option>
            <el-option label="查询" value="query"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :required="true" label="模型名称" :rules="editFormRules" label-width="120px">
          <div style="text-align: left">
            <el-input v-model="editViewForm.modelName" autocomplete="off" :disabled="true" style="width: 300px"></el-input>
          </div>
        </el-form-item>
        <el-form-item :required="true" label="可使用人员" label-width="120px" :inline="true">
          <el-select
            v-model="editViewForm.uservalue"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="请输入人员名称"
            :remote-method="remoteMethod"
            style="width: 300px"
            :loading="loading">
            <el-option
              v-for="item in useroptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :required="true" label="描述信息" prop="description" label-width="120px" >
          <el-input
            type="textarea"
            autosize
            style="width: 300px"
            :rows="12"
            v-model="editViewForm.description">
          </el-input>
        </el-form-item>

        <el-form-item :required="true" label="参数设置"  label-width="120px" >
<!--          <json-viewer v-if="editViewForm.filter!==undefined" :value="JSON.parse(editViewForm.filter)" boxed copyable :expand-depth=3 />-->
          <vue-json-editor
            v-model="jsonValue"
            :show-btns="false"
            :mode="'code'"
            lang="zh"
            style="height: 300px"
            @json-change="onJsonChange"
            @json-save="onJsonSave"
            @has-error="onError">
          </vue-json-editor>
<!--          <b-code-editor v-model="editViewForm.filter" :auto-format="true"  :smart-indent="true" height=200px  :indent-unit="4" :gutter="false" ref="editor"></b-code-editor>-->
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="resetViewForm('editViewForm')">取 消</el-button>
        <el-button type="primary" @click="updateApi('editViewForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!--字段条件-->
    <el-dialog
      title="字段条件"
      :visible.sync="dialogconditionVisible"
      width="850px">

      <el-form :model="editConditionForm" :rules="editFormRules" ref="editConditionStringForm" :inline="true">
        <el-form-item label="字段名称" prop="name" label-width="100px">
          <!--          <el-input v-model="editConditionForm.name" autocomplete="off" ></el-input>-->
          <el-select
            v-model="editConditionForm.name"
            placeholder="请输入关键词">
            <el-option
              v-for="item in tableData1"
              :key="item.name"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>

        </el-form-item>


        <el-form-item :required="true" label="字段类型选择" label-width="160px" :inline="true">
          <el-select v-model="editConditionForm.opType" placeholder="请选择操作类型" size="small">
            <el-option label="string" value="string"></el-option>
            <el-option label="int" value="int"></el-option>
            <el-option label="date" value="date"></el-option>
            <el-option label="double" value="double"></el-option>
          </el-select>
        </el-form-item>
        <div v-if="editConditionForm.opType==='string'">
          <el-form-item :required="true" label="操作条件" :rules="editFormRules" label-width="100px">
            <div style="text-align: left">
              <el-select v-model="editConditionForm.conditionvalue" placeholder="请选择">
                <el-option
                  v-for="item in conditionoptions"
                  :key="item.conditionvalue"
                  :label="item.conditionlabel"
                  :value="item.conditionvalue">
                </el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item :required="true" label="字段内容选择" label-width="145px" :inline="true">
            <el-select
              v-model="editConditionForm.choice"
              placeholder="请输入关键词">
              <el-option
                v-for="item in ziduanoptions"
                :key="item.ziduanvalue"
                :label="item.ziduanlabel"
                :value="item.ziduanvalue">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :required="true" label="是否使用模糊查询" prop="mohu" label-width="155px">
            <el-radio-group v-model="editConditionForm.mohu">
              <el-radio :label="0">是</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="自定义字段内容" prop="model" :rules="editFormRules" label-width="210px">
            <el-input v-if="editConditionForm.choice==='changeValue'" v-model="editConditionForm.foruser"
                      autocomplete="off" :disabled="true"></el-input>
            <el-input v-if="editConditionForm.choice==='userDefined'" v-model="editConditionForm.foruser"
                      autocomplete="off"></el-input>
          </el-form-item>
        </div>


        <div v-if="editConditionForm.opType==='int'">
          <el-form-item :required="true" label="操作条件" :rules="editFormRules" label-width="100px">
            <div style="text-align: left">
              <el-select v-model="editConditionForm.conditionvalue" placeholder="请选择">
                <el-option
                  v-for="item in conditionoptions"
                  :key="item.conditionvalue"
                  :label="item.conditionlabel"
                  :value="item.conditionvalue">
                </el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item :required="true" label="字段内容选择" label-width="145px" :inline="true">
            <el-select
              v-model="editConditionForm.choice"
              placeholder="请输入关键词">
              <el-option
                v-for="item in ziduanoptions"
                :key="item.ziduanvalue"
                :label="item.ziduanlabel"
                :value="item.ziduanvalue">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :required="true" label="是否使用模糊查询" prop="mohu" :rules="editFormRules" label-width="155px">
            <el-radio-group v-model="editForm.mohu">
              <el-radio :label="0">是</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="自定义字段内容" prop="model" label-width="215px">
            <el-input-number v-if="editConditionForm.choice==='changeValue'" v-model="editConditionForm.foruser"
                             @change="handleChange" :min="1" :max="10" :disabled="true" label="描述文字"></el-input-number>
            <el-input-number v-if="editConditionForm.choice==='userDefined'" v-model="editConditionForm.foruser"
                             @change="handleChange" :min="1" :max="10" label="描述文字"></el-input-number>
          </el-form-item>
        </div>

        <div v-if="editConditionForm.opType==='double'">
          <el-form-item :required="true" label="操作条件" :rules="editFormRules" label-width="100px">
            <div style="text-align: left">
              <el-select v-model="editConditionForm.conditionvalue" placeholder="请选择">
                <el-option
                  v-for="item in conditionoptions"
                  :key="item.conditionvalue"
                  :label="item.conditionlabel"
                  :value="item.conditionvalue">
                </el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item :required="true" label="字段内容选择" label-width="145px" :inline="true">
            <el-select
              v-model="editConditionForm.choice"
              placeholder="请输入关键词">
              <el-option
                v-for="item in ziduanoptions"
                :key="item.ziduanvalue"
                :label="item.ziduanlabel"
                :value="item.ziduanvalue">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :required="true" label="是否使用模糊查询" prop="mohu" label-width="155px">
            <el-radio-group v-model="editConditionForm.mohu">
              <el-radio :label="0">是</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="自定义字段内容" prop="model" :rules="editFormRules" label-width="210px">
            <el-input-number v-if="editConditionForm.choice==='changeValue'" v-model="editConditionForm.foruser"
                             :precision="2" :step="0.01" :max="10" :disabled="true"></el-input-number>
            <el-input-number v-if="editConditionForm.choice==='userDefined'" v-model="editConditionForm.foruser"
                             :precision="2" :step="0.01" :max="10"></el-input-number>
          </el-form-item>
        </div>

        <div v-if="editConditionForm.opType==='date'">
          <el-form-item :required="true" label="操作条件" :rules="editFormRules" label-width="100px">
            <div style="text-align: left">
              <el-select v-model="editConditionForm.conditionvalue" placeholder="请选择">
                <el-option
                  v-for="item in conditionoptions"
                  :key="item.conditionvalue"
                  :label="item.conditionlabel"
                  :value="item.conditionvalue">
                </el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item :required="true" label="字段内容选择" label-width="145px" :inline="true">
            <el-select
              v-model="editConditionForm.choice"
              placeholder="请输入关键词">
              <el-option
                v-for="item in ziduanoptions"
                :key="item.ziduanvalue"
                :label="item.ziduanlabel"
                :value="item.ziduanvalue">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item :required="true" label="日期选择" prop="status" label-width="100px">
            <el-date-picker
              v-if="editConditionForm.choice==='changeValue'"
              :disabled="true"
              v-model="editConditionForm.foruser"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions">
            </el-date-picker>
            <el-date-picker
              v-if="editConditionForm.choice==='userDefined'"
              v-model="editConditionForm.foruser"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>

        </div>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="resetconditionForm('editConditionStringForm')">取 消</el-button>
        <!--        <el-button type="primary" @click="submitForm('editForm')">下一步</el-button>-->
        <el-button type="primary" @click="addCondition()">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import {page, updateAPI, remove, addAPI, getAPIByID, delAPI} from '@/api/api'
  import {getAllModel,idModelVo} from "@/api/model";
  import {getUserList} from "@/api/sys";
  import axios from "@/utils/httpRequest";
  import JsonViewer from 'vue-json-viewer'
  import 'vue-json-viewer/style.css'
  import JsonView from '@/components/JsonView'
  import CustomModel from "@/views/modules/hepsapi/model/CustomModel";
  import {checkNameReg} from "@/utils/common";
  import vueJsonEditor from 'vue-json-editor';


  export default {
    name: "ModelApis",
    components: {
      JsonViewer,
      JsonView,
      CustomModel,
      vueJsonEditor
    },
    data() {
      const generateData = _ => {
        const data = [];
        const cities = ['3W1', '4W1B', 'Wanghf实验组模型', '计算中心模型', '1W1A', 'Wanghf补充模型', 'Luoq'];
        const pinyin = ['shanghai', 'beijing', 'guangzhou', 'shenzhen', 'nanjing', 'xian', 'chengdu'];
        cities.forEach((city, index) => {
          data.push({
            label: city,
            key: index,
            pinyin: pinyin[index]
          });
        });
        return data;
      };

      return {
        jsonValue:{},
        tableTitle:null,
        num: 1,
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        value1: '',
        value2: '',
        modelvalue: '',
        uservalue: '',
        tableData2: [],
        modeloptions: [],
        useroptions: [],
        ziduanoptions: [{
          ziduanvalue: 'userDefined',
          ziduanlabel: '用户自定义'
        }, {
          ziduanvalue: 'changeValue',
          ziduanlabel: '变量'
        }],
        conditionoptions: [{
          conditionvalue: '$gt',
          conditionlabel: '＞'
        }, {
          conditionvalue: '$lt',
          conditionlabel: '＜'
        }, {
          conditionvalue: 'equal',
          conditionlabel: '＝'
        }, {
          conditionvalue: '$gte',
          conditionlabel: '＞＝'
        }, {
          conditionvalue: '$lte',
          conditionlabel: '＜＝'
        }],
        tableData1: [],
        tableData_delete: [],
        logicoptions: [{
          logicvalue: 'AND',
          label: 'AND'
        }, {
          logicvalue: 'OR',
          label: 'OR'
        }, {
          logicvalue: 'NOR',
          label: 'NOR'
        }],
        logicvalue: '',
        conditionvalue: '',
        data: generateData(),
        value: [],
        filterMethod(query, item) {
          return item.pinyin.indexOf(query) > -1;
        },
        total: 0,
        size: 10,
        current: 1,
        searchForm: {},
        viewModelJson:false,
        delBtlStatu: true,
        dialogVisible: false,
        dialogFormVisible: false,
        dialogdeleteVisible: false,
        dialogupdateVisible: false,
        dialogqueryVisible: false,
        dialogEditView:false,
        dialogconditionVisible: false,
        editConditionStringForm: false,
        editConditionIntForm: false,
        editConditionDateForm: false,
        editConditionDoubleForm: false,
        options: [],
        list: [],
        loading: false,
        states: [],
        jsonData: {
          total: 25,
          limit: 10,
          skip: 0,
          links: {
            previous: undefined,
            next: function () {},
          }},
        statusSearchOption:[
          {key:'1',display_name:'可用'},
          {key: '0',display_name: '禁用'}
        ],
        editForm: {},
        editViewForm: {},
        editViewFormCopy: {},
        editFormTable: {},
        editConditionForm: {},
        editdeleteTable: {},
        editupdateTable: {},
        editqueryTable: {},
        editconditionTable: {},
        editFormRules: {
          name: [
            {required: true, message: '请输入英文名称', trigger: 'blur'},
            {validator:checkNameReg}
          ],
        },
        searchFormRules:{
          apiName:[
            {trigger: 'blur'},
            {validator:checkNameReg}
          ]
        },
        tableData: []
      };
    },


  mounted() {
    getUserList().then(res => {
      this.list = res.data.data.map(item => {
        return {
          value: item.id,
          label: item.loginName,
        }
      })
      this.useroptions = this.list
    })
  },

    created() {
        getAllModel()
        .then(response => {
          this.modeloptions = response.data.data;
          this.getApiList();
        });
    },
    watch:{
      '$route.path':{
        immediate:true,
        handler(to,from){
          if (to === '/hepsapi/api/ModelApis') {
            this.searchForm['modelId'] = this.$route.query.modelId
            this.tableTitle = this.$route.query.modelName
            this.getApiList()
          }
        }
      },
    },
    methods: {
      onJsonChange (value) {
        // console.log('更改value:', value);
        // 实时保存
        this.onJsonSave(value)
      },
      onJsonSave (value) {
        // console.log('保存value:', value);
        this.resultInfo = value
        this.hasJsonFlag = true
      },
      onError(value) {
        // console.log("json错误了value:", value);
        this.hasJsonFlag = false
      },
      rowStyle() {
        return "text-align:center";
      },
      isJSON(str) {
        if (typeof str == 'string') {
          try {
            var obj=JSON.parse(str);
            if(typeof obj == 'object' && obj ){
              return true;
            }else{
              return false;
            }

          } catch(e) {
            return false;
          }
        }else if (typeof str == 'object'  && str) {
          return true;
        }
      },
      JsonSubumit(){
        if (!this.isJSON(this.editViewForm.filter)){
          this.$message.error(`json格式错误`)
          return false
        }else {
          this.$message.success('json格式正确')
          return true
        }

      },

      viewModelParam(item){
        this.jsonData = JSON.parse(item)
        this.viewModelJson = true

      },

      editIsUsed_on(isused_id){
        const data = {
          query:{
            id: isused_id,
          },
          set:{
            isUsed: 1,
          }
        }
       updateAPI(data).then(res => {
         if (res.data.code == 200){
           this.$message({
             showClose:true,
             message:'操作成功',
             type:'success'
           })
           this.getApiList();
         }else{
           this.$message({
             showClose:true,
             message:'操作失败',
             type:'failed'
           })
         }
        })
      },
      editIsUsed_off(isused_id){
        const data = {
          query:{
            id: isused_id,
          },
          set:{
            isUsed: 0,
          }
        }
        updateAPI(data).then(res => {
          if (res.data.code == 200){
            this.$message({
              showClose:true,
              message:'操作成功',
              type:'success'
            })
            this.getApiList();
          }else{
            this.$message({
              showClose:true,
              message:'操作失败',
              type:'failed'
            })
          }
        })
      },
      updateApi(formName){
        if (!this.isJSON(this.editViewForm.filter)){
          this.$message.error(`json格式错误`)
          return false
        }else {
          this.$message.success('json格式正确')
          if (formName !== null) {
            const data = {
              query:{
                id: this.editViewForm.apiId,
              },
              set:{
                description: this.editViewForm.description,
                accessUser: this.editViewForm.uservalue.toString(),
              }

            }
            updateAPI(data)
              .then(res => {
                this.$message({
                  showClose: true,
                  message: '恭喜你，操作成功',
                  type: 'success',

                });
                this.getApiList()
                this.handleCloseAdd()
                this.dialogVisible = false
              })
          } else {
            console.log('error submit!!');
            return false;
          }
          this.dialogEditView = false
        }

      },
      submitadd(formName) {

        const method = {
          add: "insert",
          delete: "delete",
          update: "update",
          query: "find",
          0: 0,
          1: 1,
          2: 1,

        }
        const queryMethod = {
          add: "post",
          delete: "del",
          update: "post",
          query: "get",
        }

        console.log(this.editForm)

        const documents = {}

        this.tableData1.forEach(item => {
          documents[item.name] = ""
        })

        const data = {
          apiName: this.editForm.name,
          author: this.editForm.uservalue.toString(),
          modelId: this.editForm.modelvalue,
          method: queryMethod[this.editForm.opType],
          description: this.editForm.tips,
          accessUser: this.editForm.uservalue.toString(),
          isUsed: 1,
          type: this.editForm.opType,
          filter: JSON.stringify({
            [method[this.editForm.opType]]: this.editForm.name,
            documents: [documents],
          })
        }
        console.log(data)

        if (formName !== null) {
          updateAPI(data)
            .then(res => {

              this.$message({
                showClose: true,
                message: '恭喜你，操作成功',
                type: 'success',

              });
              this.handleCloseAdd()
              this.dialogVisible = false
            })
        } else {
          console.log('error submit!!');
          return false;
        }
        this.dialogFormVisible = false
      },
      submitdelete(formName) {

        const method = {
          add: "insert",
          delete: "delete",
          update: "update",
          query: "find",
          0: 0,
          1: 1,
          2: 1,

        }
        const queryMethod = {
          add: "post",
          delete: "del",
          update: "post",
          query: "get",
        }

        console.log(this.editForm)

        const q = {}
        this.tableData1.forEach(item => {
          q[item.name] = ""
        })
        const deletes = {
          q,
          limit: this.editForm.limit
        }


        const data = {
          apiName: this.editForm.name,
          author: this.editForm.uservalue.toString(),
          modelId: this.editForm.modelvalue,
          method: queryMethod[this.editForm.opType],
          description: this.editForm.tips,
          accessUser: this.editForm.uservalue.toString(),
          isUsed: method[this.editForm.status],
          type: this.editForm.opType,
          filter: JSON.stringify({
            [method[this.editForm.opType]]: this.editForm.name,
            deletes: [deletes]
          })
        }
        console.log(data)

        if (formName !== null) {
         addAPI(data)
            .then(res => {

              this.$message({
                showClose: true,
                message: '恭喜你，操作成功',
                type: 'success',

              });
              this.handleCloseAdd()
              this.dialogVisible = false
            })
        } else {
          console.log('error submit!!');
          return false;
        }
        this.dialogdeleteVisible = false
      },


      submitupdate(formName) {

        const method = {
          add: "insert",
          delete: "delete",
          update: "update",
          query: "find",
          0: 0,
          1: 1,
          2: 1,

        }
        const queryMethod = {
          add: "post",
          delete: "del",
          update: "post",
          query: "get",
        }

        const q = {}
        this.tableData1.forEach(item => {
          q[item.name] = ""
        })

        // console.log(this.tableData2)

        const u = {}


        this.tableData2.forEach(item => {
          u[item.conditionvalue] = {
            [item.conditionName]: ""
          }
        })

        const updates = {
          q,
          u: {
            ...u,
            multi: this.editForm.multi
          }
        }


        const data = {
          apiName: this.editForm.name,
          author: this.editForm.uservalue.toString(),
          modelId: this.editForm.modelvalue,
          method: queryMethod[this.editForm.opType],
          description: this.editForm.tips,
          accessUser: this.editForm.uservalue.toString(),
          isUsed: method[this.editForm.status],
          type: this.editForm.opType,
          filter: JSON.stringify({
            [method[this.editForm.opType]]: this.editForm.name,
            updates:[updates]


          }),

        }
        console.log("data", data)
        this.tableData2 = []

        if (formName !== null) {
          addAPI(data)
            .then(res => {

              this.$message({
                showClose: true,
                message: '恭喜你，操作成功',
                type: 'success',

              });
              this.handleCloseAdd()
              this.dialogVisible = false
            })
        } else {
          console.log('error submit!!');
          return false;
        }
        this.dialogupdateVisible = false

      },


      submitquery(formName) {

        const method = {
          add: "insert",
          delete: "delete",
          update: "update",
          query: "find",
          0: 0,
          1: 1,
          2: 1,

        }
        const queryMethod = {
          add: "post",
          delete: "del",
          update: "post",
          query: "get",
        }

        console.log(this.editForm)

        const documents = {}

        this.tableData1.forEach(item => {
          documents[item.name] = ""
        })

        const data = {
          apiName: this.editForm.name,
          author: this.editForm.uservalue.toString(),
          modelId: this.editForm.modelvalue,
          method: queryMethod[this.editForm.opType],
          description: this.editForm.tips,
          accessUser: this.editForm.uservalue.toString(),
          isUsed: method[this.editForm.status],
          type: this.editForm.opType,
          filter: JSON.stringify({
            [method[this.editForm.opType]]: this.editForm.name,
            filter: documents,
          })
        }
        console.log("data", data)

        if (formName !== null) {
          addAPI(data)
            .then(res => {

              this.$message({
                showClose: true,
                message: '恭喜你，操作成功',
                type: 'success',

              });
              this.handleCloseAdd()
              this.dialogVisible = false
            })
        } else {
          console.log('error submit!!');
          return false;
        }
        this.dialogqueryVisible = false
      },

      handleChange(value) {
        console.log(value);
      },
      handleSwitch() {
        if (this.editForm.modelvalue !== undefined && this.editForm.opType!==undefined) {
          this.tableData1 = []
            idModelVo(this.editForm.modelvalue)
            .then(response => {
              const data = JSON.parse(response.data.data.parameter).parameter

              this.tableData1 = Object.keys(data).filter(k => k !== "relation").map(k => ({
                name: k,
                type: data[k].type
              }))
              console.log(this.tableData1)
            })
        }
      },
      addCondition() {
        console.log(this.editConditionForm)
        this.tableData2.push({
          conditionName: this.editConditionForm.name,
          conditionType: this.editConditionForm.opType,
          ...this.editConditionForm
        })
        console.log('tableData2:', this.tableData2)
        this.dialogconditionVisible = false;
      },
      getApiList() {
        if(this.searchForm['apiName'] ===''){
          this.searchForm['apiName'] = null;
        }
        this.searchForm['currentPage'] = this.current;
        this.searchForm['pageSize'] = this.size;

        page(this.searchForm).then(res => {
          this.tableData = res.data.data.list
          this.total = res.data.data.count
          for (let i = 0; i < this.tableData.length; i++) {
            for(let j = 0; j < this.modeloptions.length; j++) {
              if (this.tableData[i].modelId == this.modeloptions[j].modelId){
                this.tableData[i].modelName = this.modeloptions[j].modelName
                this.tableData[i].parameter = this.modeloptions[j].parameter
              }
            }
          }
          // this.size = res.data.data.size
          // this.current = res.data.data.current
        })
      },

      deleteRow(index, rows) {
        rows.splice(index, 1);
      },

      resetForm(formName) {
        if (this.$refs[formName] !== undefined) {
          this.$refs[formName].resetFields();
        }
        // this.$refs[formName].resetFields();
        this.dialogVisible = false
        this.editForm = {}
      },
      resetViewForm(formName) {
        if (this.$refs[formName] !== undefined) {
          this.$refs[formName].resetFields();
        }
        // this.$refs[formName].resetFields();
        this.dialogEditView = false
        this.editViewForm = {}
      },
      resetconditionForm(formName) {
        if (this.$refs[formName] !== undefined) {
          this.$refs[formName].resetFields();
        }
        // this.$refs[formName].resetFields();
        this.dialogconditionVisible = false
        this.editConditionForm = {}
        this.tableData2 = []

      },
      resetFormTable(formName) {
        if (this.$refs['form'] !== undefined) {
          this.$refs['form'].resetFields();
        }
        // this.$refs[formName].resetFields();
        this.dialogFormVisible = false
        this.editFormTable = {}
      },

      resetdeleteTable(formName) {
        if (this.$refs['form'] !== undefined) {
          this.$refs['form'].resetFields();
        }
        // this.$refs[formName].resetFields();
        this.dialogdeleteVisible = false
        this.editdeleteTable = {}
      },

      resetqueryTable(formName) {
        if (this.$refs['form'] !== undefined) {
          this.$refs['form'].resetFields();
        }
        // if (this.$refs.form !== undefined) this.$refs.form.resetFields()
        this.dialogqueryVisible = false
        this.editqueryTable = {}
      },

      resetupdateTable(formName) {
        if (this.$refs['form'] !== undefined) {
          this.$refs['form'].resetFields();
        }

        // this.$refs[formName].resetFields();
        this.dialogupdateVisible = false
        this.editupdateTable = {}
      },

      handleCloseAdd() {

        this.resetqueryTable('editqueryTable')
        this.resetupdateTable('editupdateTable')
        this.resetForm('editForm')



      },

      handleClose() {
        this.resetdeleteTable('editdeleteTable')
        this.resetForm('editForm')
        this.resetFormTable('editFormTable')
        this.resetViewForm('editViewForm')
      },

      handleSelectionChange(val) {
        this.multipleSelection = val;
        this.delBtlStatu = val.length == 0
      },
      remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.useroptions = this.list.filter(item => {
              return item.label.toLowerCase()
                .indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
        } else {
          this.useroptions = [];
        }
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.size = val
        this.getApiList()
      },

      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.current = val
        this.getApiList()
      },
      editHandle(item) {
          this.editViewForm = item
          this.editViewFormCopy = item
          this.jsonValue = JSON.parse(this.editViewForm.filter)
          this.dialogEditView = true
      },
      delHandle(item){
        delAPI(item).then(res =>{
          if(res.data.code == 200){
            this.$message({
              showClose:true,
              message:'删除成功',
              type:"success"
            })
            this.getApiList()
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
            ids.push(row.apiId)
          })
        }
        remove(ids).then(res => {
          if (res.data.code == 200){
            this.$message({
              showClose:true,
              message:'操作成功',
              type:'success'
            })
            this.getApiList()
          }else{
            this.$message({
              showClose:true,
              message:'操作失败',
              type:'failed'
            })
          }
        })
      },
    },
  }
</script>

<style scoped>

  .transfer-footer {
    margin-left: 20px;
    padding: 6px 5px;
  }

  .el-table th.gutter {
    display: table-cell !important;
  }

  .divcss5-left {
    float: right;
  }
  .divcss5-center{
    position:relative;
    left:20%;
    float:left;
    padding:0 10px;
    margin-bottom: -50px;
  }
  .divcss-left {
    float: right;
    margin-top: -38px;
  }

  .jv-container-r .jv-code-r {
    overflow: hidden;
    padding: 0px 20px;

  }

  div >>>.jsoneditor-vue{
    height: 100%;
  }

</style>
