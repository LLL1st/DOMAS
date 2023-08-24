<template>
    <div class="page">
        <div class="bg-white">
        <el-form size="mini" :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
            <!-- 搜索框-->
         <el-form-item prop="office.id">
            <SelectTree
                  ref="office.id"
                  :props="{
                      value: 'id',             // ID字段名
                      label: 'name',         // 显示名称
                      children: 'children'    // 子级字段名
                    }"
                  placeholder="请选择归属部门"
                  size="mini"
                  :url="`/sys/office/treeData?type=2`"
                  :value="searchForm.office.id"
                  :clearable="true"
                  :accordion="true"
                  @getValue="(value) => {searchForm.office.id=value}"/>
         </el-form-item>
         <el-form-item prop="user.id">
            <user-select :limit='1' size="mini" placeholder="请选择员工" :value="searchForm.user.id" @getValue='(value) => {searchForm.user.id=value}'></user-select>
         </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="refreshList()" size="mini" icon="el-icon-search">查询</el-button>
            <el-button @click="resetSearch()" size="mini" icon="el-icon-refresh-right">重置</el-button>
          </el-form-item>
      </el-form>
        <!-- 导入导出-->
      <el-dialog  title="导入Excel" :visible.sync="isImportCollapse">
          <el-form size="mini" :inline="true" v-show="isImportCollapse"  ref="importForm">
             <el-form-item>
              <el-button type="default" @click="downloadTpl()" size="mini">下载模板</el-button>
             </el-form-item>
             <el-form-item prop="loginName">
                <el-upload
                  class="upload-demo"
                  :action="`${this.$http.BASE_URL}/test/testFormLeave/import`"
                  :on-success="uploadSuccess"
                   :show-file-list="true">
                  <el-button size="mini" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">只允许导入“xls”或“xlsx”格式文件！</div>
                </el-upload>
            </el-form-item>
          </el-form>
      </el-dialog>
      <el-row>
        <el-button v-if="hasPermission('test:testFormLeave:add')" type="primary" size="mini" icon="el-icon-plus" @click="add()">新建</el-button>
        <el-button v-if="hasPermission('test:testFormLeave:edit')" type="warning" size="mini" icon="el-icon-edit-outline" @click="edit()"
         :disabled="dataListSelections.length != 1" plain>修改</el-button>
        <el-button v-if="hasPermission('test:testFormLeave:del')" type="danger"   size="mini" icon="el-icon-delete" @click="del()"
                  :disabled="dataListSelections.length <= 0" plain>删除
        </el-button>
        <el-button-group class="pull-right">
            <el-button v-if="hasPermission('test:testFormLeave:import')" type="default" size="mini" icon="el-icon-upload2" title="导入" @click="isImportCollapse = !isImportCollapse"></el-button>
            <el-button v-if="hasPermission('test:testFormLeave:export')" type="default" size="mini" icon="el-icon-download" title="导出" @click="exportExcel()"></el-button>
            <el-button
              type="default"
              size="mini"
              icon="el-icon-refresh"
              @click="refreshList">
            </el-button>
        </el-button-group>
      </el-row>
    <el-table
      border
      :data="dataList"
       size="mini"
      @selection-change="selectionChangeHandle"
      @sort-change="sortChangeHandle"
      class="table">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="office.name"
        show-overflow-tooltip
        sortable="custom"
        label="归属部门">
            <template slot-scope="scope">
              <el-link  type="primary" :underline="false" v-if="hasPermission('test:testFormLeave:edit')" @click="edit(scope.row.id)">{{scope.row.office.name}}</el-link>
              <el-link  type="primary" :underline="false" v-else-if="hasPermission('test:testFormLeave:view')"  @click="view(scope.row.id)">{{scope.row.office.name}}</el-link>
              <span v-else>{{scope.row.office.name}}</span>
            </template>
      </el-table-column>
      <el-table-column
        prop="user.name"
        show-overflow-tooltip
        sortable="custom"
        label="员工">
      </el-table-column>
      <el-table-column
        prop="area.name"
        show-overflow-tooltip
        sortable="custom"
        label="归属区域">
      </el-table-column>
    <el-table-column
        prop="beginDate"
        show-overflow-tooltip
        sortable="custom"
        label="请假开始日期">
      </el-table-column>
    <el-table-column
        prop="endDate"
        show-overflow-tooltip
        sortable="custom"
        label="请假结束日期">
      </el-table-column>
    <el-table-column
        prop="remarks"
        show-overflow-tooltip
        sortable="custom"
        label="remarks">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        :key="Math.random()"
        width="200"
        label="操作">
        <template  slot-scope="scope">
          <el-button v-if="hasPermission('test:testFormLeave:view')" type="text" icon="el-icon-view" size="mini" @click="view(scope.row.id)">查看</el-button>
          <el-button v-if="hasPermission('test:testFormLeave:edit')" type="text" icon="el-icon-edit" size="mini" @click="edit(scope.row.id)">修改</el-button>
          <el-button v-if="hasPermission('test:testFormLeave:del')" type="text"  icon="el-icon-delete" size="mini" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageNo"
      :page-sizes="[10, 15, 20, 50, 100]"
      :page-size="pageSize"
      :total="total"
      background
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    </div>
        <!-- 弹窗, 新增 / 修改 -->
    <TestFormLeaveForm  ref="testFormLeaveForm" @refreshDataList="refreshList"></TestFormLeaveForm>
  </div>
</template>

<script>
  import TestFormLeaveForm from './TestFormLeaveForm'
  import SelectTree from '@/components/treeSelect/treeSelect.vue'
  import UserSelect from '@/components/userSelect'
  export default {
    data () {
      return {
        searchForm: {
          office: {
            id: ''
          },
          user: {
            id: ''
          }
        },
        dataList: [],
        pageNo: 1,
        pageSize: 15,
        total: 0,
        orderBy: '',
        dataListSelections: [],
        isImportCollapse: false,
        loading: false
      }
    },
    components: {
      SelectTree,
      UserSelect,
      TestFormLeaveForm
    },
    activated () {
      this.refreshList()
    },
    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: '/test/testFormLeave/list',
          method: 'get',
          params: {
            'pageNo': this.pageNo,
            'pageSize': this.pageSize,
            'orderBy': this.orderBy,
            ...this.searchForm
          }
        }).then(({data}) => {
          if (data && data.success) {
            this.dataList = data.page.list
            this.total = data.page.count
            this.loading = false
          }
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageNo = 1
        this.refreshList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageNo = val
        this.refreshList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },

    // 排序
      sortChangeHandle (obj) {
        if (obj.order === 'ascending') {
          this.orderBy = obj.prop + ' asc'
        } else if (obj.order === 'descending') {
          this.orderBy = obj.prop + ' desc'
        } else {
          this.orderBy = ''
        }
        this.refreshList()
      },
      // 新增
      add () {
        this.$refs.testFormLeaveForm.init('add', '')
      },
      // 修改
      edit (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$refs.testFormLeaveForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.testFormLeaveForm.init('view', id)
      },
      // 删除
      del (id) {
        let ids = id || this.dataListSelections.map(item => {
          return item.id
        }).join(',')
        this.$confirm(`确定删除所选项吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          this.$http({
            url: '/test/testFormLeave/delete',
            method: 'delete',
            params: {'ids': ids}
          }).then(({data}) => {
            if (data && data.success) {
              this.$message.success(data.msg)
              this.refreshList()
            }
            this.loading = false
          })
        })
      },
      // 导入成功
      uploadSuccess (res, file) {
        if (res.success) {
          this.$message.success({dangerouslyUseHTMLString: true,
            message: res.msg})
        } else {
          this.$message.error(res.msg)
        }
      },
      // 下载模板
      downloadTpl () {
        this.$utils.download('/test/testFormLeave/import/template')
      },
      exportExcel () {
        let params = {
          ...this.searchForm
        }
        this.$utils.download('/test/testFormLeave/export', params)
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      }
    }
  }
</script>
