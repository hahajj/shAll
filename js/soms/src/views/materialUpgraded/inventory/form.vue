<template>
  <el-dialog ref="materials" :append-to-body="true" :close-on-click-modal="false" :visible.sync="dialog" :before-close="resetForm" :title="inventory === '备件库存盘点' ? '备件库存盘点' : '物资库存盘点'" width="600px">
    <!--备件新增-->
    <el-form v-if="inventory === '备件库存盘点'" ref="equipment" :model="equipment" :rules="rules" size="small" label-width="120px" status-icon>
      <el-row :gutter="15">
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
          <el-form-item label="设备名称" prop="equipmentName">
            <el-input v-model="equipment.equipmentName" disabled="" style="width: 370px;"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
          <el-form-item label="备件名称" prop="equipmentPartName">
            <el-input v-model="equipment.equipmentPartName" :disabled = "!addEdit" placeholder="点击添加" style="width: 370px;" @focus="insideDialog"/>
            <!--备件名称嵌套的对话框-->
            <el-dialog :append-to-body="true" :visible.sync="equipmentVisible" width="40%" title="备件">
              <el-row :gutter="15">
                <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10">
                  <el-tree v-loading="equipmentDataLoading" :data="equipmentData" :props="defaultProps" @node-click="handleNodeClick"/>
                </el-col>
                <el-col :xs="14" :sm="14" :md="14" :lg="14" :xl="14">
                  <!--搜索栏-->
                  <div style="overflow: hidden">
                    <el-input v-model="equipment.equipmentPartName" clearable style="float: left;width: 200px;margin: 0 10px" @keyup.enter.native="nameSearch"/>
                    <el-button type="success" style="float: left;" @click="nameSearch">查询</el-button>
                  </div>
                  <!--设备栏-->
                  <div style="margin: 5px;">
                    <el-tree v-loading = "equipmentPartLoading" :data="equipmentPart" :props="defaultProps" @node-click="handleEquipmentPartName"/>
                  </div>
                </el-col>
              </el-row>
              <div slot="footer" class="dialog-footer">
                <el-button @click="cancelInnerVisible">取 消</el-button>
                <el-button type="primary" @click="equipmentVisible = false">确 定</el-button>
              </div>
            </el-dialog>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
          <el-form-item label="备件规格" prop="name">
            <el-input v-model="equipment.name" disabled style="width: 370px;"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
          <el-form-item label="备件号" prop="code">
            <el-input v-model="equipment.code" disabled style="width: 370px;"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
          <el-form-item label="最低保有量" prop="miniumAmount">
            <el-input v-model="equipment.miniumAmount" :min="0" type="Number" onkeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" style="width: 200px;"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
          <el-form-item label="本月新增数量" prop="arrivedAmount">
            <el-input v-model="equipment.arrivedAmount" :disabled="equipmentAutoInventory" :min="0" type="Number" style="width: 200px;" onkeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
          <el-form-item label="本月消耗数量" prop="consumeAmount">
            <el-input v-model="equipment.consumeAmount" :max="equipment.amount" :min="0" type="Number" style="width: 200px;" onkeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
          <el-form-item label="上月库存情况" prop="lastMonthAmount">
            <el-input v-model="equipment.lastMonthAmount" :disabled="equipmentAutoInventory" :min="0" type="Number" style="width: 200px;" onkeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
          <el-form-item label="当前库存数量" prop="amount">
            <el-input v-model="equipment.amount" disabled style="width: 200px;"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
          <el-form-item>
            <el-checkbox v-model="equipment.checked" label="初始化填写" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
          <el-form-item v-if="equipment.checked" label="历史库存数量" prop="hisAmount">
            <el-input v-model="equipment.hisAmount" :min="0" type="Number" style="width: 200px;" onkeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!--物资新增-->
    <el-form v-if="inventory === '物资库存盘点'" ref="material" :model="material" :rules="rules" size="small" label-width="120px" status-icon>
      <el-row :gutter="15">
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
          <el-form-item label="物资类别" prop="materialSpec">
            <el-input v-model="material.materialSpec" disabled style="width: 370px;"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
          <el-form-item label="物资名称" prop="materialName">
            <el-input v-model="material.materialName" :disabled = "!addEdit" placeholder="点击添加" clearable style="width: 370px;" @focus="insideDialog"/>
            <!--物资名称嵌套的对话框-->
            <el-dialog :append-to-body="true" :visible.sync="innerVisible" width="40%" title="物资盘点">
              <el-row :gutter="15">
                <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10">
                  <el-tree v-loading = "treeLoading" :data="materialSpec" :props="defaultProps" @node-click="handleNodeClick"/>
                </el-col>
                <el-col :xs="14" :sm="14" :md="14" :lg="14" :xl="14">
                  <!--搜索栏-->
                  <div style="overflow: hidden">
                    <el-input v-model="material.materialName" placeholder="请输入物资名称" clearable style="float: left;width: 200px;margin: 0 10px" @keyup.enter.native="nameSearch"/>
                    <el-button type="success" style="float: left;" @click="nameSearch">查询</el-button>
                  </div>
                  <!--设备栏-->
                  <div style="margin: 5px;">
                    <el-tree :v-loading="infoLoading" :data="materialsInfo" :props="defaultProps" @node-click="handleMaterialName"/>
                  </div>
                </el-col>
              </el-row>
              <div slot="footer" class="dialog-footer">
                <el-button @click="cancelInnerVisible">取 消</el-button>
                <el-button type="primary" @click="innerVisible = false">确 定</el-button>
              </div>
            </el-dialog>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
          <el-form-item label="物资规格" prop="materialSpecName">
            <el-input v-model="material.materialSpecName" disabled style="width: 370px;"/>
          </el-form-item>
        </el-col>
        <!--<el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">-->
        <!--<el-form-item label="最低保有量" prop="mMiniumAmount">-->
        <!--<el-input v-model="material.mMiniumAmount" :min="0" type="Number" onkeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" style="width: 370px;"/>-->
        <!--</el-form-item>-->
        <!--</el-col>-->
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
          <el-form-item label="本月新增数量" prop="arrivedAmount">
            <el-input v-model="material.arrivedAmount" :disabled="materialAutoInventory" style="width: 200px;"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
          <el-form-item label="本月消耗数量" prop="mConsumeAmount">
            <el-input v-model="material.mConsumeAmount" :max="material.amount" :min="0" type="Number" style="width: 200px;" onkeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
          <el-form-item label="上月库存情况" prop="lastMonthAmount">
            <el-input v-model="material.lastMonthAmount" :disabled="materialAutoInventory" style="width: 200px;"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
          <el-form-item label="当前库存数量" prop="amount">
            <el-input v-model="material.amount" disabled style="width: 200px;"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
          <el-form-item>
            <el-checkbox v-model="material.checked" label="初始化填写"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
          <el-form-item v-if="material.checked" label="历史库存数量" prop="mHisAmount">
            <!--material.amount-->
            <el-input v-model="material.mHisAmount" :min="0" type="Number" style="width: 200px;" onkeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addEquipment, editEquipment, addMaterial, editMaterial, getMaterialSpec, getEquipmentData, getEquipmentPart, getEquipmentInventory, getMaterialInventory } from '@/api/inventory'
export default {
  // 新增或编辑，备件或物资
  props: {
    addEdit: {
      type: Boolean,
      required: true
    },
    inventory: {
      type: String,
      required: true
    }
  },
  data() {
    var validateEquipmentUse = (rule, value, callback) => {
      if (value === '' && rule.field === 'consumeAmount') {
        callback(new Error('请输入本月消耗量'))
      } else if (!this.equipment.equipmentName) {
        callback(new Error('请确认已选择备件'))
      } else {
        if (value !== '') {
          if (this.equipment.checked && this.equipment.hisAmount) {
            if (Number(this.equipment.hisAmount) + Number(this.equipment.arrivedAmount) - this.equipment.consumeAmount < 0) {
              callback(new Error('请确认消耗量<历史库存+新增-当前库存'))
            }
          } else {
            if (Number(this.equipment.amount) + Number(this.equipment.arrivedAmount) - this.equipment.consumeAmount < 0) {
              callback(new Error('请确认消耗量<当前库存+新增'))
            }
          }
        }
        callback()
      }
    }
    var validateMaterialUse = (rule, value, callback) => {
      if (value === '' && rule.field === 'mConsumeAmount') {
        callback(new Error('请输入本月消耗量'))
      } else if (!this.material.materialSpec) {
        callback(new Error('请确认已选择物资'))
      } else {
        if (value !== '') {
          if (this.material.checked && this.material.mHisAmount) {
            if (Number(this.material.mHisAmount) + Number(this.material.arrivedAmount) - this.material.mConsumeAmount < 0) {
              callback(new Error('请确认消耗量<历史库存+新增-当前库存'))
            }
          } else {
            if (Number(this.material.amount) + Number(this.material.arrivedAmount) - this.material.mConsumeAmount < 0) {
              callback(new Error('请确认消耗量<当前库存+新增'))
            }
          }
        }
        callback()
      }
    }
    return {
      loading: false, dialog: false,
      equipment: {
        checked: false,
        equipmentName: '',
        equipmentPartName: '',
        code: '',
        name: '',
        planNo: '',
        arrivedAmount: '',
        consumeAmount: '',
        amount: '',
        lastMonthAmount: '',
        hisAmount: '',
        miniumAmount: '',
        equipmentPartSpecId: '',
        equipmentPartInventoryId: '',
        organizationId: this.$store.state.user.user.partyDTO.organization.organizationId
      },
      material: {
        checked: false,
        materialSpec: '',
        materialName: '',
        materialSpecName: '',
        arrivedAmount: '',
        mConsumeAmount: '',
        amount: '',
        lastMonthAmount: '',
        mHisAmount: '',
        // mMiniumAmount: ''
      },
      newMaterial: {
        materialSpecId: '',
        arrivedAmount: '',
        consumeAmount: '',
        amount: '',
        lastMonthAmount: '',
        hisAmount: '',
        // miniumAmount: '',
        materialInventoryId: '',
        organizationId: this.$store.state.user.user.partyDTO.organization.organizationId
      },
      // 物资盘点
      innerVisible: false,
      treeLoading: false,
      infoLoading: false,
      materialSpec: [],
      materialsInfo: [],
      // 无库存时允许填写本月新增等数据
      materialAutoInventory: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // 备件盘点
      equipmentVisible: false,
      equipmentDataLoading: false,
      equipmentPartLoading: false,
      equipmentData: [],
      equipmentPart: [],
      equipmentAutoInventory: false,
      rules: {
        equipmentName: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
        name: [{ required: true, message: '请输入备件规格', trigger: 'blur' }],
        code: [{ required: true, message: '请输入备件号', trigger: 'blur' }],
        consumeAmount: [{ required: true, validator: validateEquipmentUse, trigger: 'blur' }],
        hisAmount: [{ validator: validateEquipmentUse, trigger: 'change' }],
        materialSpec: [{ required: true, message: '请输入物资类别', trigger: 'blur' }],
        // materialName: [{ required: true, message: '请输入物资名称', trigger: 'blur' }],
        materialSpecName: [{ required: true, message: '请输入物资规格', trigger: 'blur' }],
        mConsumeAmount: [{ required: true, validator: validateMaterialUse, trigger: 'blur' }],
        mHisAmount: [{ validator: validateMaterialUse, trigger: 'change' }]
      }
    }
  },
  methods: {
    // 新增--物资名称
    insideDialog() {
      if (this.inventory === '备件库存盘点') {
        this.equipmentVisible = true
        this.equipmentAutoInventory = false
        this.equipmentData = []
        this.equipmentPart = []
        this.equipmentChange()
      }
      if (this.inventory === '物资库存盘点') {
        this.innerVisible = true
        this.materialAutoInventory = false
        this.materialSpecChange()
      }
    },
    // 物资--转换为树形结构需要的格式
    materialSpecChange() {
      let result = false
      let equialId
      this.materialSpec = []
      this.materialsInfo = []
      this.treeLoading = true
      getMaterialSpec().then(res => {
        this.treeLoading = false
        res.content.map(v => {
          result = this.materialSpec.some((item, index) => {
            if (item.materialId === v.materialId.materialId) {
              equialId = index
              return true
            }
          })
          if (!result) {
            this.materialSpec.push({
              materialId: v.materialId.materialId,
              name: v.materialId.materialClassCode.materialClassName,
              children: [{
                name: v.materialId.name + ' ' + v.name,
                materialSpecId: v.materialSpecId,
                materialSpecName: v.name,
                materialName: v.materialId.materialClassCode.materialClassName
              }]
            })
          } else {
            this.materialSpec[equialId].children.push({
              name: v.materialId.name + ' ' + v.name,
              materialSpecId: v.materialSpecId,
              materialSpecName: v.name,
              materialName: v.materialId.materialClassCode.materialClassName
            })
          }
        })
      })
    },
    // 备件--设备树形结构
    equipmentChange() {
      this.equipmentDataLoading = true
      getEquipmentData().then(res => {
        this.equipmentDataLoading = false
        this.equipmentData = res.content
      })
    },
    handleNodeClick(data) {
      if (data.children && data.children.length > 0) {
        return
      }
      if (this.inventory === '备件库存盘点') {
        let res = false
        res = this.equipmentPart.some((item) => {
          if (item.equipmentId === data.equipmentId) {
            return true
          }
        })
        if (!res) {
          this.treeLoading = true
          this.equipmentPartLoading = true
          getEquipmentPart({ equipmentId: data.equipmentId }).then(res => {
            this.equipmentPartLoading = false
            if (res.content.length) {
              this.setEquipmentTreeData(res.content)
            } else {
              this.equipmentPart.push({
                name: data.name,
                equipmentId: data.equipmentId,
                children: []
              })
            }
            this.treeLoading = false
          })
        }
      }
      if (this.inventory === '物资库存盘点') {
        let result = false
        result = this.materialsInfo.some((item) => {
          if (item.materialSpecId === data.materialSpecId) {
            return true
          }
        })
        if (this.materialsInfo.length === 0 || !result) {
          this.materialsInfo.push({
            name: data.name,
            materialSpecId: data.materialSpecId,
            materialSpecName: data.materialSpecName,
            materialName: data.materialName,
            children: []
          })
        }
      }
    },
    // 备件--数据改写成树形图需要的格式
    setEquipmentTreeData(data) {
      const isEquipment = []
      data.map((v, i) => {
        this.equipmentPart.map((item) => {
          if (item.equipmentId === v.equipmentPartId.equipmentId.equipmentId) {
            item.children.push({
              name: v.equipmentPartId.name + ' ' + v.name,
              equipmentPartId: v.equipmentPartId.equipmentPartId,
              equipmentPartID: v.equipmentPartId ? JSON.stringify(v.equipmentPartId) : '',
              equipmentPartSpecId: v.equipmentPartSpecId,
              code: v.equipmentPartId.code,
              equipmentPartName: v.name
            })
            isEquipment.push(i)
          }
        })
        if (v.equipmentPartId.equipmentId && isEquipment.indexOf(i) === -1) {
          this.equipmentPart.push({
            name: v.equipmentPartId.equipmentId.name,
            equipmentId: v.equipmentPartId.equipmentId.equipmentId,
            children: [{
              name: v.equipmentPartId.name + ' ' + v.name,
              equipmentPartId: v.equipmentPartId.equipmentPartId,
              equipmentPartID: JSON.stringify(v.equipmentPartId),
              equipmentPartSpecId: v.equipmentPartSpecId,
              code: v.equipmentPartId.code,
              equipmentPartName: v.name
            }]
          })
        }
      })
    },
    // 新增--名称搜索
    nameSearch() {
      if (this.inventory === '备件库存盘点') {
        this.equipmentPart = []
        this.equipmentPartLoading = true
        getEquipmentPart({ name: this.equipment.equipmentPartName }).then(res => {
          this.equipmentPartLoading = false
          this.setEquipmentTreeData(res.content)
        })
      }
      if (this.inventory === '物资库存盘点') {
        this.infoLoading = true
        this.materialsInfo = []
        getMaterialSpec({ name: this.material.materialName }).then(res => {
          this.infoLoading = false
          res.content.map(v => {
            this.materialsInfo.push({
              name: v.materialId.name + ' ' + v.name,
              materialSpecId: v.materialSpecId,
              materialSpecName: v.name,
              materialName: v.materialId.materialClassCode.materialClassName,
              children: []
            })
          })
        })
      }
    },
    handleMaterialName(data) {
      this.materialAutoInventory = false
      this.material.materialName = data.name
      this.material.materialSpec = data.materialName
      this.material.materialSpecName = data.materialSpecName
      this.newMaterial.materialSpecId = data.materialSpecId
      getMaterialInventory({ materialSpecId: data.materialSpecId, organizationId: this.newMaterial.organizationId }).then(res => {
        if (res.content.length > 0) {
          this.material.arrivedAmount = res.content[0].arrivedAmount
          this.material.lastMonthAmount = res.content[0].lastMonthAmount
          this.material.amount = res.content[0].amount
          this.newMaterial.materialInventoryId = res.content[0].materialInventoryId
          this.materialAutoInventory = true
        } else {
          this.material.arrivedAmount = 0
          this.material.lastMonthAmount = 0
          this.material.amount = 0
          this.newMaterial.materialInventoryId = ''
          this.materialAutoInventory = false
        }
      })
    },
    cancelInnerVisible() {
      if (this.inventory === '备件库存盘点') {
        this.equipmentVisible = false
        this.equipment.equipmentName = ''
        this.equipment.code = ''
        this.equipment.arrivedAmount = ''
        this.equipment.lastMonthAmount = ''
        this.equipment.amount = ''
        this.equipment.equipmentPartName = ''
        this.equipment.equipmentPartSpecId = ''
        this.equipment.name = ''
        this.equipment.equipmentPartInventoryId = ''
        this.equipmentAutoInventory = false
      }
      if (this.inventory === '物资库存盘点') {
        this.innerVisible = false
        this.material.materialName = ''
        this.material.materialSpec = ''
        this.material.materialSpecName = ''
        this.material.arrivedAmount = ''
        this.material.lastMonthAmount = ''
        this.material.amount = ''
        this.newMaterial.materialSpecId = ''
        this.newMaterial.materialInventoryId = ''
        this.materialAutoInventory = false
      }
    },
    handleEquipmentPartName(data) {
      if (!data.children) {
        if (data.equipmentPartID) {
          this.equipmentPartID = JSON.parse(data.equipmentPartID)
          this.equipment.equipmentName = this.equipmentPartID.equipmentId.name
          this.equipment.code = this.equipmentPartID.equipmentId.code
        } else {
          this.equipmentPartID = ''
        }
        this.equipment.equipmentPartName = data.name
        this.equipment.equipmentPartSpecId = data.equipmentPartSpecId
        this.equipment.name = data.equipmentPartName
        getEquipmentInventory({ equipmentPartSpecName: data.equipmentPartName, organizationId: this.equipment.organizationId }).then((res) => {
          if (res.content.length > 0) {
            this.equipment.equipmentPartInventoryId = res.content[0].equipmentPartInventoryId
            this.equipment.arrivedAmount = res.content[0].arrivedAmount
            this.equipment.lastMonthAmount = res.content[0].lastMonthAmount
            this.equipment.amount = res.content[0].amount
            this.equipmentAutoInventory = true
          } else {
            this.equipment.equipmentPartInventoryId = ''
            this.equipment.arrivedAmount = 0
            this.equipment.lastMonthAmount = 0
            this.equipment.amount = 0
            this.equipmentAutoInventory = false
          }
        })
      }
    },
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      if (this.inventory === '备件库存盘点') {
        this.$refs['equipment'].validate((valid) => {
          if (valid) {
            this.loading = true
            if (this.addEdit) {
              this.doAdd()
            } else this.doEdit()
          }
        })
      }
      if (this.inventory === '物资库存盘点') {
        this.$refs['material'].validate((valid) => {
          if (valid) {
            this.loading = true
            if (this.addEdit) {
              this.doAdd()
            } else this.doEdit()
          }
        })
      }
    },
    doAdd() {
      if (this.inventory === '备件库存盘点') {
        this.equipment.equipmentPartSpecName = this.equipment.name
        addEquipment(this.equipment).then(res => {
          this.resetForm()
          this.$notify({
            title: '添加成功',
            type: 'success',
            duration: 2500
          })
          this.loading = false
          this.$parent.$parent.$parent.init()
        }).catch(err => {
          this.loading = false
          console.log(err.response.data.message)
        })
      }
      if (this.inventory === '物资库存盘点') {
        const _this = this.newMaterial
        _this.arrivedAmount = this.material.arrivedAmount
        _this.consumeAmount = this.material.mConsumeAmount
        _this.amount = this.material.amount
        _this.lastMonthAmount = this.material.lastMonthAmount
        // _this.miniumAmount = this.material.mMiniumAmount
        _this.hisAmount = this.material.checked ? this.material.mHisAmount : ''
        addMaterial(this.newMaterial).then(res => {
          this.resetForm()
          this.$notify({
            title: '添加成功',
            type: 'success',
            duration: 2500
          })
          this.loading = false
          this.$parent.$parent.$parent.getMaterial()
        }).catch(err => {
          this.loading = false
          console.log(err.response.data.message)
        })
      }
    },
    doEdit() {
      if (this.inventory === '备件库存盘点') {
        if (this.equipment.checked && this.equipment.hisAmount) {
          this.equipment.amount = Number(this.equipment.hisAmount) + Number(this.equipment.arrivedAmount) - Number(this.equipment.consumeAmount)
        }
        editEquipment(this.equipment).then(res => {
          this.resetForm()
          this.$notify({
            title: '添加成功',
            type: 'success',
            duration: 2500
          })
          this.loading = false
          this.$parent.$parent.$parent.init()
        }).catch(err => {
          this.loading = false
          console.log(err.response.data.message)
        })
      }
      if (this.inventory === '物资库存盘点') {
        if (this.material.checked) {
          this.newMaterial.amount = Number(this.material.mHisAmount) + Number(this.material.arrivedAmount) - Number(this.material.mConsumeAmount)
        }
        const _this = this.newMaterial
        _this.arrivedAmount = this.material.arrivedAmount
        _this.consumeAmount = this.material.mConsumeAmount
        _this.lastMonthAmount = this.material.lastMonthAmount
        // _this.miniumAmount = this.material.mMiniumAmount
        _this.hisAmount = this.material.checked ? this.material.mHisAmount : ''
        editMaterial(this.newMaterial).then(res => {
          this.resetForm()
          this.$notify({
            title: '修改成功',
            type: 'success',
            duration: 2500
          })
          this.loading = false
          this.$parent.$parent.$parent.getMaterial()
        }).catch(err => {
          this.loading = false
          console.log(err.response.data.message)
        })
      }
    },
    resetForm() {
      if (this.inventory === '备件库存盘点') {
        this.$refs['equipment'].resetFields()
        this.dialog = false
        this.equipment = {
          checked: false,
          equipmentName: '',
          equipmentPartName: '',
          code: '',
          name: '',
          planNo: '',
          arrivedAmount: '',
          consumeAmount: '',
          amount: '',
          lastMonthAmount: '',
          hisAmount: '',
          miniumAmount: '',
          equipmentPartInventoryId: '',
          organizationId: this.$store.state.user.user.partyDTO.organization.organizationId
        }
      }
      if (this.inventory === '物资库存盘点') {
        this.$refs['material'].clearValidate()
        this.dialog = false
        this.material = {
          checked: false,
          materialSpec: '',
          materialName: '',
          materialSpecName: '',
          arrivedAmount: '',
          mConsumeAmount: '',
          amount: '',
          lastMonthAmount: '',
          mHisAmount: ''
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
