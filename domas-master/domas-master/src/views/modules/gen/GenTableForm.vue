<template>
  <el-dialog
    :title="title"
    :fullscreen="true"
    :append-to-body="true"
    :close-on-click-modal="false"
    :visible.sync="visible">

          <el-form size="mini" :model="inputForm"  ref="inputForm"
                  label-width="100px" :class="method==='view'?'readonly':''" :disabled="method==='view'">
            <el-row  :gutter="15">
              <el-col :span="12">
                  <el-form-item label="表名" prop="name" :rules="[{required: true, message: '表名不能为空', trigger: 'blur'}]">
                  <el-input maxlength="50" v-model="inputForm.name" placeholder="请输入表名"></el-input>
                  </el-form-item>
              </el-col>

              <el-col :span="12">
                  <el-form-item label="所属数据库"  prop="dataSource.id"  :rules="[{required: true, message: '所属数据库不能为空', trigger: 'blur'}]">
                    <SelectTree
                    ref="dataSourceTree"
                    :props="{
                        value: 'id',             // ID字段名
                        label: 'label',         // 显示名称
                        children: 'children'    // 子级字段名
                      }"
                    :data="dataSourceTree"
                    :value="inputForm.dataSource.id"
                    :label="inputForm.dataSource.name"
                    :clearable="true"
                    :accordion="true"
                    :disabled="method !== 'add'"
                    @getValue="(id, label, node) => {inputForm.dataSource.id=id, inputForm.dataSource.type=node?node.dbType:''}"/>
                  </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="说明" prop="comments"  :rules="[{required: true, message: '说明不能为空', trigger: 'blur'}]">
                  <el-input  v-model="inputForm.comments" placeholder="请输入表的说明"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="主键策略" prop="codeIdType" :rules="[{required: true, message: '主键策略不能为空', trigger: 'blur'}]">
                  <el-select v-model="inputForm.codeIdType" placeholder="请选择"  style="width: 100%;">
                      <el-option
                        v-for="(item, index) in this.$dictUtils.getDictList('code_id_type')"
                        :key="index"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="表类型" prop="tableType" :rules="[{required: true, message: '表类型不能为空', trigger: 'blur'}]">
                  <el-select v-model="inputForm.tableType" placeholder="请选择"  style="width: 100%;">
                      <el-option
                        v-for="(item, index) in this.$dictUtils.getDictList('table_type')"
                        :key="index"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="类名" prop="className" :rules="[{required: true, message: '类名不能为空', trigger: 'blur'}]">
                  <el-input  placeholder="类名首字符必须大写" v-model="inputForm.className"></el-input>
                </el-form-item>
              </el-col>
            <el-col :span="12">
                <el-form-item label="主表表名" prop="parentTable">
                  <el-select v-model="inputForm.parentTable" placeholder="请选择" clearable  style="width: 100%;">
                      <el-option
                        v-for="(item, index) in tableList"
                        :key="index"
                        :label="item.nameAndComments"
                        :value="item.name">
                      </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="当前表外键" prop="parentTableFk">
                  <el-select v-model="inputForm.parentTableFk" placeholder="请选择" clearable  style="width: 100%;">
                    <el-option
                      v-for="(item, index) in inputForm.columnList"
                      :key="index"
                      :label="item.name"
                      :value="item.name">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-tabs v-model="activeName">
            <el-tab-pane label="数据库表设置" name="first">
             <el-row style="margin-bottom:10px">
                <el-button size="mini" type="primary" @click="addRow">新增</el-button>
                <el-button size="mini" type="danger" @click="delRow">删除</el-button>
              </el-row>
              <el-table
              border
              :data="inputForm.columnList"
              @selection-change="selectionChangeHandle"
              row-key="sort"
              height="500px">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                prop="sort"
                label="拖动"
                align="center"
                width="50">
                <template>
                <i class="el-icon-rank handle"></i>
                </template>
              </el-table-column>
              <el-table-column
                prop="sort"
                label="排序"
                align="center"
                width="50">
                <template slot-scope="scope">
                  {{scope.row.sort = scope.$index}}
                </template>
              </el-table-column>
              <el-table-column
                prop="name"
                label="列名"
                width="200">
                <template slot-scope="scope">
                  <el-input size="mini" v-model="scope.row.name"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                prop="comments"
                label="说明"
                width="200">
                <template slot-scope="scope">
                  <el-input size="mini" v-model="scope.row.comments"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                prop="jdbcType"
                label="物理类型">
                  <template slot-scope="scope">
                        <el-autocomplete
                        size="mini"
                          class="inline-input"
                          style="width:100%"
                          v-model="scope.row.jdbcType"
                          :fetch-suggestions="querySearch"
                          placeholder="请输入内容"
                        ></el-autocomplete>
                  </template>
              </el-table-column>
              <el-table-column
                prop="isPk"
                label="主键">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row.isPk" true-label="1" false-label="0"></el-checkbox>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="Java实体设置" name="second">
            <el-table
              border
              :data="inputForm.columnList"
              >
              <el-table-column
                prop="name"
                label="列名"
                width="200">
              </el-table-column>
              <el-table-column
                prop="comments"
                label="说明"
                width="200">
              </el-table-column>
              <el-table-column
                prop="javaType"
                label="Java类型">
                  <template slot-scope="scope">
                    <el-select size="mini" v-model="scope.row.javaType" @change="selectJavaType(scope.row)" placeholder="请选择"  style="width: 100%;">
                          <el-option
                            v-for="(item, index) in config.javaTypeList"
                            :key="index"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                      </el-select>
                  </template>
              </el-table-column>
              <el-table-column
                prop="javaField"
                label="Java属性名称">
                <template slot-scope="scope">
                  <el-input size="mini" v-model="scope.row.javaField">
                  </el-input>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="表单页面" name="third">

              <el-table
                border
                :data="inputForm.columnList"
                >
                <el-table-column
                  prop="name"
                  label="列名"
                  width="200">
                </el-table-column>
                <el-table-column
                  prop="comments"
                  label="说明"
                  width="200">
                </el-table-column>
                <el-table-column
                  prop="isForm"
                  label="表单显示">
                  <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.isForm" true-label="1" false-label="0"></el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="showType"
                  label="表单类型">
                    <template slot-scope="scope">
                      <div class="el-input el-input-group el-input-group--append">
                          <el-select size="mini" v-model="scope.row.showType" placeholder="请选择"    style="width: 100%;">
                                <el-option
                                  v-for="(item, index) in config.showTypeList"
                                  :key="index"
                                  :label="item.label"
                                  :value="item.value">
                                </el-option>
                          </el-select>
                      </div>

                    </template>
                </el-table-column>
                <el-table-column
                  prop="dictType"
                  label="字典类型">
                    <template slot-scope="scope">
                      <el-select size="mini" filterable v-model="scope.row.dictType" placeholder="请选择" clearable  style="width: 100%;">
                            <el-option
                              v-for="(item, index) in dictList"
                              :key="index"
                              :label="`${item.description}:${item.type}`"
                              :value="item.type">
                            </el-option>
                      </el-select>
                    </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="表单校验" name="fourth">
              <el-table
                border
                :data="inputForm.columnList">
                <el-table-column
                  prop="name"
                  label="列名"
                  width="200">
                </el-table-column>
                <el-table-column
                  prop="comments"
                  label="说明"
                  width="200">
                </el-table-column>
                <el-table-column
                  prop="isNull"
                  label="可空">
                    <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.isNull" true-label="1" false-label="0"></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column
                  prop="validateType"
                  label="校验类型">
                    <template slot-scope="scope">
                      <el-select size="mini" v-model="scope.row.validateType" clearable placeholder="请选择"  style="width: 100%;">
                            <el-option
                              v-for="(item, index) in config.validateTypeList"
                              :key="index"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                      </el-select>
                    </template>
                </el-table-column>
                <el-table-column
                  prop="minLength"
                  label="最小长度">
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.minLength"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="maxLength"
                  label="最大长度">
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.maxLength"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="minValue"
                  label="最小值">
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.minValue"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="maxValue"
                  label="最大值">
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.maxValue"></el-input>
                  </template>
                </el-table-column>

              </el-table>
          </el-tab-pane>
          <el-tab-pane label="列表页面" name="fifth">
                <el-table
                  border
                  :data="inputForm.columnList">
                  <el-table-column
                    prop="name"
                    label="列名"
                    width="200">
                  </el-table-column>
                  <el-table-column
                    prop="comments"
                    label="说明"
                    width="200">
                  </el-table-column>
                  <el-table-column
                    prop="isList"
                    label="列表字段">
                      <template slot-scope="scope">
                      <el-checkbox v-model="scope.row.isList" true-label="1" false-label="0"></el-checkbox>
                      </template>
                  </el-table-column>
                  <el-table-column
                    prop="isQuery"
                    label="查询">
                      <template slot-scope="scope">
                      <el-checkbox v-model="scope.row.isQuery" true-label="1" false-label="0"></el-checkbox>
                      </template>
                  </el-table-column>
                  <el-table-column
                    prop="queryType"
                    label="查询匹配方式">
                    <template slot-scope="scope">
                        <el-select size="mini" v-model="scope.row.queryType" clearable placeholder="请选择"  style="width: 100%;">
                              <el-option
                                v-for="(item, index) in config.queryTypeList"
                                :key="index"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                        </el-select>
                      </template>
                  </el-table-column>
                </el-table>
          </el-tab-pane>
      </el-tabs>

    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="visible = false">关闭</el-button>
      <el-button size="mini" v-if="method != 'view'" type="primary" @click="doSubmit()">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import SelectTree from './treeSelect.vue'
  import Sortable from 'sortablejs'
  import { setTimeout } from 'timers'
  import pick from 'lodash.pick'
export default {
    data () {
      return {
        config: '',
        loading: false,
        activeName: 'first',
        dictList: {},
        tableList: [],
        dataListSelections: [],
        dataSourceTree: [],
        baseTableField: ['id', 'create_by', 'update_by', 'create_date', 'update_date', 'remarks', 'del_flag'],
        baseTreeField: ['id', 'create_by', 'update_by', 'create_date', 'update_date', 'remarks', 'del_flag', 'parent_id', 'parent_ids', 'name', 'sort'],
        visible: false,
        method: '',
        title: '新增',
        currRow: '',
        initColumnList: [
          {sort: '0',
            isInsert: '1',
            isEdit: '0',
            name: 'id',
            comments: '主键',
            jdbcType: 'varchar(64)',
            isPk: '1',
            javaType: 'String',
            javaField: 'id',
            isForm: '0',
            showType: 'input',
            dictType: '',
            fieldLabels: '',
            fieldKeys: '',
            searchLabel: '',
            searchKey: '',
            isNull: '0',
            validateType: '',
            minLength: '',
            maxLength: '',
            minValue: '',
            maxValue: '',
            isList: '0',
            isQuery: '0',
            queryType: '='
          },
          {sort: '1',
            isInsert: '1',
            isEdit: '0',
            name: 'create_by',
            comments: '创建者',
            jdbcType: 'varchar(64)',
            isPk: '0',
            javaType: 'String',
            javaField: 'createBy.id',
            isForm: '0',
            showType: 'input',
            dictType: '',
            fieldLabels: '',
            fieldKeys: '',
            searchLabel: '',
            searchKey: '',
            isNull: '0',
            validateType: '',
            minLength: '',
            maxLength: '',
            minValue: '',
            maxValue: '',
            isList: '0',
            isQuery: '0',
            queryType: '='
          },
          {sort: '2',
            isInsert: '1',
            isEdit: '0',
            name: 'create_date',
            comments: '创建时间',
            jdbcType: 'datetime',
            isPk: '0',
            javaType: 'java.util.Date',
            javaField: 'createDate',
            isForm: '0',
            showType: 'dateselect',
            dictType: '',
            fieldLabels: '',
            fieldKeys: '',
            searchLabel: '',
            searchKey: '',
            isNull: '0',
            validateType: '',
            minLength: '',
            maxLength: '',
            minValue: '',
            maxValue: '',
            isList: '0',
            isQuery: '0',
            queryType: '='
          },
          {sort: '3',
            isInsert: '1',
            isEdit: '1',
            name: 'update_by',
            comments: '更新者',
            jdbcType: 'varchar(64)',
            isPk: '0',
            javaType: 'String',
            javaField: 'updateBy.id',
            isForm: '0',
            showType: 'input',
            dictType: '',
            fieldLabels: '',
            fieldKeys: '',
            searchLabel: '',
            searchKey: '',
            isNull: '0',
            validateType: '',
            minLength: '',
            maxLength: '',
            minValue: '',
            maxValue: '',
            isList: '0',
            isQuery: '0',
            queryType: '='
          },
          {sort: '4',
            isInsert: '1',
            isEdit: '1',
            name: 'update_date',
            comments: '更新时间',
            jdbcType: 'datetime',
            isPk: '0',
            javaType: 'java.util.Date',
            javaField: 'updateDate',
            isForm: '0',
            showType: 'dateselect',
            dictType: '',
            fieldLabels: '',
            fieldKeys: '',
            searchLabel: '',
            searchKey: '',
            isNull: '0',
            validateType: '',
            minLength: '',
            maxLength: '',
            minValue: '',
            maxValue: '',
            isList: '0',
            isQuery: '0',
            queryType: '='
          },
          {sort: '5',
            isInsert: '1',
            isEdit: '1',
            name: 'remarks',
            comments: '备注信息',
            jdbcType: 'nvarchar(255)',
            isPk: '0',
            javaType: 'String',
            javaField: 'remarks',
            isForm: '1',
            showType: 'textarea',
            dictType: '',
            fieldLabels: '',
            fieldKeys: '',
            searchLabel: '',
            searchKey: '',
            isNull: '1',
            validateType: '',
            minLength: '',
            maxLength: '',
            minValue: '',
            maxValue: '',
            isList: '1',
            isQuery: '0',
            queryType: '='
          },
          {sort: '6',
            isInsert: '1',
            isEdit: '0',
            name: 'del_flag',
            comments: '逻辑删除标记（0：显示；1：隐藏',
            jdbcType: 'varchar(64)',
            isPk: '0',
            javaType: 'String',
            javaField: 'delFlag',
            isForm: '0',
            showType: 'radiobox',
            dictType: '',
            fieldLabels: '',
            fieldKeys: '',
            searchLabel: '',
            searchKey: '',
            isNull: '0',
            validateType: '',
            minLength: '',
            maxLength: '',
            minValue: '',
            maxValue: '',
            isList: '0',
            isQuery: '0',
            queryType: '='}

        ],
        inputForm: {
          id: '',
          isSync: '0',
          name: '',
          dataSource: {
            id: 'master',
            name: '本地数据库',
            type: ''
          },
          comments: '',
          codeIdType: '1',
          tableType: '0',
          className: '',
          parentTable: '',
          parentTableFk: '',
          columnList: []

        }
      }
    },
    components: {
      SelectTree,
      Sortable
    },
    watch: {
      'inputForm.tableType' (value) {
        let names = ',' + this.inputForm.columnList.map((item) => {
          return item.name + ','
        }).join(',')
        if (value === '3' || value === '4') {
          if (!names.includes('parent_id')) {
            this.inputForm.columnList.push({sort: '',
              isInsert: '1',
              isEdit: '1',
              name: 'parent_id',
              comments: '父级编号',
              jdbcType: 'varchar(64)',
              isPk: '0',
              javaType: 'This',
              javaField: 'parent.id|name',
              isForm: '1',
              showType: 'treeselect',
              dictType: '',
              fieldLabels: '',
              fieldKeys: '',
              searchLabel: '',
              searchKey: '',
              isNull: '1',
              validateType: '',
              minLength: '',
              maxLength: '',
              minValue: '',
              maxValue: '',
              isList: '0',
              isQuery: '0',
              queryType: '='})
          }
          if (!names.includes('parent_ids')) {
            this.inputForm.columnList.push({sort: '',
              isInsert: '1',
              isEdit: '1',
              name: 'parent_ids',
              comments: '所有父级编号',
              jdbcType: 'varchar(2000)',
              isPk: '0',
              javaType: 'String',
              javaField: 'parentIds',
              isForm: '0',
              showType: 'input',
              dictType: '',
              fieldLabels: '',
              fieldKeys: '',
              searchLabel: '',
              searchKey: '',
              isNull: '0',
              validateType: '',
              minLength: '',
              maxLength: '',
              minValue: '',
              maxValue: '',
              isList: '0',
              isQuery: '0',
              queryType: 'like'})
          }
          if (!names.includes('name')) {
            this.inputForm.columnList.push({sort: '',
              isInsert: '1',
              isEdit: '1',
              name: 'name',
              comments: '名称',
              jdbcType: 'varchar(100)',
              isPk: '0',
              javaType: 'String',
              javaField: 'name',
              isForm: '1',
              showType: 'input',
              dictType: '',
              fieldLabels: '',
              fieldKeys: '',
              searchLabel: '',
              searchKey: '',
              isNull: '0',
              validateType: '',
              minLength: '',
              maxLength: '',
              minValue: '',
              maxValue: '',
              isList: '1',
              isQuery: '1',
              queryType: 'like'})
          }
          if (!names.includes('sort')) {
            this.inputForm.columnList.push({sort: '',
              isInsert: '1',
              isEdit: '1',
              name: 'sort',
              comments: '排序',
              jdbcType: 'integer',
              isPk: '0',
              javaType: 'Integer',
              javaField: 'sort',
              isForm: '1',
              showType: 'input',
              dictType: '',
              fieldLabels: '',
              fieldKeys: '',
              searchLabel: '',
              searchKey: '',
              isNull: '0',
              validateType: 'isNumber',
              minLength: '',
              maxLength: '',
              minValue: '',
              maxValue: '',
              isList: '0',
              isQuery: '0',
              queryType: '='})
          }
        } else {
          this.delRowByName('parent_id')
          this.delRowByName('parent_ids')
          this.delRowByName('name')
          this.delRowByName('sort')
        }

        if (value === '6') {
          if (!names.includes('proc_ins_id')) {
            this.inputForm.columnList.push({sort: '',
              isInsert: '1',
              isEdit: '1',
              name: 'proc_ins_id',
              comments: '流程实例id',
              jdbcType: 'varchar(64)',
              isPk: '0',
              javaType: 'String',
              javaField: 'procInsId',
              isForm: '0',
              showType: 'input',
              dictType: '',
              fieldLabels: '',
              fieldKeys: '',
              searchLabel: '',
              searchKey: '',
              isNull: '1',
              validateType: '',
              minLength: '',
              maxLength: '',
              minValue: '',
              maxValue: '',
              isList: '0',
              isQuery: '0',
              queryType: '='})
          }
        } else {
          this.delRowByName('proc_ins_id')
        }
      }
    },
    methods: {
      init (method, id) {
        this.method = method
        this.inputForm.id = id
        if (method === 'add') {
          this.title = '新增表单'
        } else if (method === 'edit') {
          this.title = '修改表单'
        } else if (method === 'view') {
          this.title = '查看表单'
        }
        this.$http.get(`/sys/dict/type/list`, {params: {pageSize: -1, pageNo: 1}}).then(({data}) => {
          this.dictList = data.page.list
        })
        this.$http.get(`/code/codeTable/queryConfig`).then(({data}) => {
          this.config = data.config
          this.tableList = data.tableList
        })
        this.$http.get(`/database/datalink/dataSource/treeData2`).then(({data}) => {
          this.dataSourceTree = data.treeData
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.inputForm.columnList = JSON.parse(JSON.stringify(this.initColumnList))
            this.inputForm.dataSource.id = 'master'
            this.inputForm.dataSource.type = this.dataSourceTree[0].children[0].dbType
            this.$refs['inputForm'].resetFields()
            setTimeout(() => {
              this.rowDrop()
            }, 1000)
          })
        }).then(() => {
          if (method === 'edit' || method === 'view') { // 修改或者查看
            this.$http({
              url: `/code/codeTable/queryById?id=${this.inputForm.id}`,
              method: 'get'
            }).then(({data}) => {
              this.inputForm = this.recover(this.inputForm, data.codeTable)
              this.inputForm.columnList = []
              data.codeTable.columnList.forEach((column) => {
                column = pick(column, 'id', 'sort',
                  'isInsert',
                  'isEdit',
                  'name',
                  'comments',
                  'jdbcType',
                  'isPk',
                  'javaType',
                  'javaField',
                  'isForm',
                  'showType',
                  'dictType',
                  'fieldLabels',
                  'fieldKeys',
                  'searchLabel',
                  'searchKey',
                  'isNull',
                  'validateType',
                  'minLength',
                  'maxLength',
                  'minValue',
                  'maxValue',
                  'isList',
                  'isQuery',
                  'queryType')
                this.inputForm.columnList.push(column)
              })
            })
          }
        })
      },
      querySearch (queryString, cb) {
        let dbType = this.inputForm.dataSource.type
        var restaurants = this.config.mysqlFieldType
        if (dbType === 'oracle') {
          restaurants = this.config.oracleFieldType
        } else if (dbType === 'mssql' || dbType === 'sqlserver') {
          restaurants = this.config.mssqlFieldType
        } else if (dbType === 'postgre') {
          restaurants = this.config.postGreSqlFieldType
        }
        cb(restaurants)
      },
       // 行拖拽
      rowDrop () {
        const tbody = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[1]
        const _this = this
        Sortable.create(tbody, {
          handle: '.handle', // handle's class
          animation: 150,
          onEnd ({ newIndex, oldIndex }) {
            const currRow = _this.inputForm.columnList.splice(oldIndex, 1)[0]
            _this.inputForm.columnList.splice(newIndex, 0, currRow)
          }
        })
      //   new Sortable(example5, {
      //     handle: '.handle', // handle's class
      //     animation: 150
      // })
      },
      addRow () {
        let length = this.inputForm.columnList.size
        if (length === 0) {
          this.inputForm.columnList.push({sort: '',
            isInsert: '1',
            isEdit: '1',
            name: '',
            comments: '',
            jdbcType: 'varchar(64)',
            isPk: '0',
            javaType: 'String',
            javaField: '',
            isForm: '1',
            showType: 'input',
            dictType: '',
            fieldLabels: '',
            fieldKeys: '',
            searchLabel: '',
            searchKey: '',
            isNull: '1',
            validateType: '',
            minLength: '',
            maxLength: '',
            minValue: '',
            maxValue: '',
            isList: '1',
            isQuery: '0',
            queryType: '='})
        } else {
          this.inputForm.columnList.splice(1, 0, {sort: '',
            isInsert: '1',
            isEdit: '1',
            name: '',
            comments: '',
            jdbcType: 'varchar(64)',
            isPk: '0',
            javaType: 'String',
            javaField: '',
            isForm: '1',
            showType: 'input',
            dictType: '',
            fieldLabels: '',
            fieldKeys: '',
            searchLabel: '',
            searchKey: '',
            isNull: '1',
            validateType: '',
            minLength: '',
            maxLength: '',
            minValue: '',
            maxValue: '',
            isList: '1',
            isQuery: '0',
            queryType: '='})
        }
      },
      delRow () {
        this.dataListSelections.map((item) => {
          for (var i = 0; i < this.inputForm.columnList.length; i++) {
            if (this.inputForm.columnList[i] === item) {
              this.inputForm.columnList.splice(i, 1)
              break
            }
          }
        })
      },
      delRowByName (name) {
        for (var i = 0; i < this.inputForm.columnList.length; i++) {
          if (this.inputForm.columnList[i].name === name && !this.inputForm.columnList[i].id) {
            this.inputForm.columnList.splice(i, 1)
            break
          }
        }
      },
      selectJavaType (row) {
        if (row.javaType && row.javaType.startsWith('com.')) {
          row.showSelect = true
          if (row.javaType.endsWith('User')) {
            row.showType = 'userselect'
          } else if (row.javaType.endsWith('Area')) {
            row.showType = 'areaselect'
          } else if (row.javaType.endsWith('Office')) {
            row.showType = 'officeselect'
          }
          if ((this.inputForm.tableType !== '3' && this.inputForm.tableType !== '4' && this.baseTableField.indexOf(row.name.toLowerCase()) === -1) || ((this.inputForm.tableType === '3' || this.inputForm.tableType === '4') && this.baseTreeField.indexOf(row.name.toLowerCase()) === -1)) {
            if (row.javaType.endsWith('User') || row.javaType.endsWith('Area') || row.javaType.endsWith('Office')) {
              if (!row.javaField.split('.')[0]) {
                row.javaField = this.toUpTreeJavaField(row.name)
              } else if (row.javaField.split('.')[0].toLowerCase().endsWith('id')) {
                row.javaField = row.javaField.split('.')[0].substring(0, row.javaField.split('.')[0].length - 2) + '.id|name'
              } else {
                row.javaField = row.javaField.split('.')[0] + '.id|name'
              }
            } else if (row.javaField.indexOf('.') < 0) {
              if (!row.javaField) {
                row.javaField = this.toUpJavaField(row.name)
              } else
              if (row.javaField.toLowerCase().endsWith('id')) {
                row.javaField = row.javaField.substring(0, row.javaField.length - 2) + '.id'
              } else {
                row.javaField = row.javaField + '.id'
              }
            }
          }
        } else {
          row.showSelect = false
          if (row.javaType === 'String' || row.javaType === 'Long' || row.javaType === 'Integer' || row.javaType === 'Double') {
            row.showType = 'input'
          }
          if (row.javaType === 'java.util.Date') {
            row.showType = 'dateselect'
          }
          if (row.showType === 'userselect' || row.showType === 'officeselect' || row.showType === 'areaselect') {
            row.showType = 'input'
          }
          if ((this.inputForm.tableType !== '3' && this.inputForm.tableType !== '4' && this.baseTableField.indexOf(row.name.toLowerCase()) === -1) || ((this.inputForm.tableType === '3' || this.inputForm.tableType === '4') && this.baseTreeField.indexOf(row.name.toLowerCase()) === -1)) {
            row.javaField = row.javaField.split('.')[0]
          }
        }
      },
      getJavaFieldNames (value) {
        let name = this.currRow.javaField.split('.')[0]
        if (name === '') {
          name = this.toUpJavaField(this.currRow.name).split('.')[0]
        }
        this.currRow.javaField = name + '.' + value
      },
         // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      toUpTreeJavaField (str) {
        var arr = str.split('_')
        var size = arr.length
        if (arr[arr.length - 1] === 'id') {
          size = size - 1
        }
        let javaField = arr[0]
        for (var i = 1; i < size; i++) {
          javaField = javaField + arr[i].charAt(0).toUpperCase() + arr[i].substring(1)
        }
        return javaField + '.id|name'
      },
      toUpJavaField (str) {
        var arr = str.split('_')
        var size = arr.length
        if (arr[arr.length - 1] === 'id') {
          size = size - 1
        }
        let javaField = arr[0]
        for (var i = 1; i < size; i++) {
          javaField = javaField + arr[i].charAt(0).toUpperCase() + arr[i].substring(1)
        }
        return javaField + '.id'
      },
      toUp (str) {
        var arr = str.split('_')
        for (var i = 1; i < arr.length; i++) {
          arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].substring(1)
        }
        return arr.join('')
      },
      validateForm () {
        let valid = true
        this.inputForm.columnList.forEach((item) => {
          if (item.name === '') {
            this.$message.error('列名不能为空')
            valid = false
          }
          if (item.comments === '') {
            this.$message.error(`列[${item.name}]的说明不能为空`)
            valid = false
          }
          if (item.jdbcType === '') {
            this.$message.error(`列[${item.name}]物理类型不能为空`)
            valid = false
          }

                // 主附表的附表
          if (this.inputForm.tableType === '2' && (!item.javaField || !item.javaField.endsWith('.id')) && item.name === this.inputForm.parentTableFk) {
            item.javaField = this.toUpJavaField(item.name)
          } else if ((!item.javaField || item.javaField.indexOf('.')) < 0 && item.name === this.inputForm.parentTableFk) {
            item.javaField = this.toUpJavaField(item.name)
          } else if (item.javaType && item.javaType.startsWith('com.') && (!item.javaField || item.javaField.indexOf('.') < 0)) {
            if (item.javaField === '') {
              item.javaField = this.toUpJavaField(item.name)
            } else {
              if (item.javaField.toLowerCase().endsWith('id')) {
                item.javaField = item.javaField.substring(0, item.javaField.length - 2) + '.id'
              } else {
                item.javaField = item.javaField + '.id'
              }
            }
          } else if (!item.javaField) {
            item.javaField = this.toUp(item.name)
          }

          if (item.javaType && item.javaType.startsWith('com.')) {
            item.showSelect = true
          } else {
            item.showSelect = false
          }

          if (!item.javaType) {
            this.$message.error(`列[${item.name}]的Java类型不能为空`)
            valid = false
          }
          if (!item.javaField) {
            this.$message.error(`列[${item.name}]的Java属性名称不能为空`)
            valid = false
          }
          if (item.javaField.endsWith('.') || item.javaField.startsWith('.')) {
            this.$message.error(`Java属性名称【${item.javaField}】非法`)
            valid = false
          }
          if (item.javaType && item.javaType.startsWith('com.') && item.javaField.indexOf('.') < 0) {
            this.$message.error(`Java属性【${item.javaField}】至少要选择一条关联字段`)
            valid = false
          }
        })
        this.inputForm.columnList.forEach((item) => {
          if (this.inputForm.tableType === '5' && item.name === this.inputForm.parentTableFk) {
            if (item.isQuery === '0') {
              this.$message.error(`列【${item.name}】作为左树右表的附表的外键，它的查询属性必须勾选。`)
              valid = false
            }
            // 主附表的附表
          }
        })

        return valid
      },
      // 表单提交
      doSubmit () {
        let valid2 = this.validateForm()
        this.$refs['inputForm'].validate((valid) => {
          if (valid && valid2) {
            this.$http({
              url: `/code/codeTable/save`,
              method: 'post',
              data: this.inputForm
            }).then(({data}) => {
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
<style>
.handle {
    cursor: grab;
}
</style>
