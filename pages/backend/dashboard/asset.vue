<script setup lang="ts">
    
    const tableRef = ref()
    const selected = ref([])
    const filter = ref('')
    const loading = ref(false)
    const pagination= ref({
            sortBy:'desc',
            descending: false,
            page:1,
            rowsPerPage: 10,
            rowsNumber:10
    })

    const columns = [   
        {name: 'index', label: 'No', field: 'index', align: 'left', sortable: true, style: 'width: 20px'},
        {name: 'asset', label: 'Asset', field: 'asset', align: 'left', sortable: true,style: 'width: 80px'},
        {name: 'uuid', label: 'Uuid', field: 'uuid', align: 'left', sortable: true,style: 'width: 100px'},
        {name: 'state', label: 'State', field: 'state', align: 'left', sortable: true,style: 'width: 100px'},
        {name: 'type', label: 'Machine Type', field: 'type', align: 'left', sortable: true,style: 'width: 100px'},
        {name: 'status', label: 'Status', field: 'status', align: 'left', sortable: true,style: 'width: 100px'},
        {name: 'job', label: 'Job', field: 'job', align: 'left', sortable: true, style: 'width: 120px'},
        {name: 'product', label: 'Products', field: 'products', align: 'left', sortable: true,style: 'width: 150px'},
        {name: 'updateAt', label: 'Update At', field: 'updateAt', align: 'left', sortable: true, style: 'width: 200px'},
        {name: 'actions', label: 'Actions', field: 'actions', align: 'center', sortable: true},
    ]

 

    const info=[
        {   
            asset:'INS-001',
            uuid:'ABCDEFGHIJKLMNOPQ',
            mac:'00:ff:ff:ff:ff:ff',
            type:'Washer',
            job:{
                sku:'WASH-P1',
                name:'฿30',
                price:30,
                qty:60,
                unit:'Mins'
            },
            state:'active',
            status:'ready',
            store:'RGH18',
            machine:'HAIER HDV79E1',
            products:[
                {sku:'WASH-P1',name:'฿20',price:'20',qty:'30',unit:'Mins'},
                {sku:'WASH-P2',name:'฿30',price:'30',qty:'60',unit:'Mins'},
            ],
            createAt: '2021-01-01 15:15',
            updateAt: '2021-01-01 15:15',
        },
        {   
            asset:'HDV-001',
            uuid:'ABCDEFGHIJKLMNOPQ',
            mac:'00:ff:ff:ff:ff:ff',
            type:'Dryer',
            job:{
                sku:'WASH-P1',
                name:'฿40',
                price:40,
                qty:60,
                unit:'Mins'
            },
            state:'active',
            status:'booked',
            store:'RGH18',
            machine:'HAIER HDV79E1',
            products:[
                {sku:'DRY-P1',name:'฿40',price:'40',qty:'60',unit:'Mins'},
                {sku:'DRY-P2',name:'฿50',price:'50',qty:'75',unit:'Mins'},
            ],
            createAt: '2021-01-01 15:15',
            updateAt: '2021-01-01 15:15',
        },
        {   
            asset:'HDV-002',
            uuid:'ABCDEFGHIJKLMNOPQ',
            mac:'00:ff:ff:ff:ff:ff',
            type:'Dryer',
            job:{
  
            },
            state:'registered',
            status:'ready',
            store:'RGH18',
            machine:'HAIER HDV79E1',
            products:[
     
            ],
            createAt: '2021-01-01 15:15',
            updateAt: '2021-01-01 15:15',
        }
    ]

    let rows: any[]= []
    // for (let i = 0; i < 10; i++) {
    //     rows = rows.concat(info.slice(0).map(r => ({ ...r })))
    // }

    rows=rows.concat(info)
    rows.forEach((row:any, index:number) => {
        row.index = index+1
    })

    const getSelectedString = ()=> {
        return selected.value.length === 0 ? '' : `${selected.value.length} record${selected.value.length > 1 ? 's' : ''} selected of ${rows.length}`
      }


</script>

<template>
    <div class="q-px-md">
        <div class="row " style="height: 130px">
            <div class="col-3 q-px-md">
                <q-card style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)" class="text-white">
                    <q-card-section>
                        <div class="text-h6">Total Transaction</div>
                        <div class="text-h4">100</div>
                    </q-card-section>
                </q-card>
            </div>
            <div class="col-3 q-px-md ">
                <q-card style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)" class="text-white">
                    <q-card-section>
                        <div class="text-h6">QR Transaction</div>
                        <div class="text-h4">100</div>
                    </q-card-section>
                </q-card>
            </div>
            <div class="col-3 q-px-md">
                <q-card style="background: radial-gradient(circle, #3588ff 0%, #014a88 100%)" class="text-white">
                    <q-card-section>
                        <div class="text-h6">QR Transaction</div>
                        <div class="text-h4">100</div>
                    </q-card-section>
                </q-card>
            </div>
            <div class="col-3 q-px-md">
                <q-card style="background: radial-gradient(circle, #3588ff 0%, #012a88 100%)" class="text-white">
                    <q-card-section>
                        <div class="text-h6">QR Transaction</div>
                        <div class="text-h4">100</div>
                    </q-card-section>
                </q-card>
            </div>   
        </div>
        <q-table
            flat bordered
            title="Assets"
            :rows="rows"
            :columns="columns"
            row-key="index"
            selection="multiple"
            virtual-scroll
            :rows-per-page-options="[5,10,20,30]"
            :filter="filter"
            v-model:pagination="pagination"
            v-model:selected="selected"
            table-header-style="background: #eeeeee"
            :selected-rows-label="getSelectedString"
        >
            <template #top-right>
                <!-- <div class="q-mr-md q-guttar-md">
                    <q-btn icon="arrow_circle_up" title="Active">Active</q-btn>
                    <q-btn icon="upgrade" title="Firmware Upgrade">OTA</q-btn>
                </div> -->
                <div class="q-mr-md q-guttar-md">
                    <q-btn icon="sync_alt" title="Ping">Ping</q-btn>
                    <q-btn icon="restart_alt" title="Reset">RST</q-btn>
                    <q-btn icon="power_settings_new" title="Turn ON">ON</q-btn>
                    <q-btn icon="mode_standby" title="Turn OFF">OFF</q-btn>
                    <q-btn icon="power_off" title="Out of service">Offline</q-btn>
                </div>
                <div class="q-mr-md q-guttar-md">
                    <q-btn icon="add_circle" title="Create Job">Create</q-btn>
                    <q-btn icon="cancel" title="Cancel existing job">Cancel</q-btn>
                    <q-btn icon="fact_check" title="Testign Asset">Test</q-btn>
                </div>
                
                <!-- <div >
                    <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                        <template v-slot:append>
                            <q-icon name="search" />
                        </template>
                    </q-input>
                </div> -->
            </template>

            <template #body-cell-state="props">
                <q-td :props="props">
                    <div v-if="props.row.state === 'active'" class="text-bold text-positive text-caption text-capitalize">
                        {{ props.row.state }}
                    </div>
                    <div v-if="props.row.state === 'registered'" class="text-bold text-primary text-caption text-capitalize">
                        {{ props.row.state }}
                    </div>
                </q-td>
            </template>

            <!-- <template #body-cell-type="props">

            </template> -->

            <template #body-cell-job="props">
                <q-td :props="props" auto-width class="text-center">
                    <div v-if = "props.row.state === 'active'">
                        <div v-if="props.row.status === 'busy'">
                            <div>
                                <q-badge color="grey-7"  class="text-white  text-bold">
                                    <q-icon name="monetization_on" size="xs"/>{{ props.row.job.price }}
                                </q-badge>
                            </div>  
                            <div>
                                <q-badge color="grey-7" class="text-white  text-bold">
                                    <q-icon name="timer" size="xs"/>{{ props.row.job.qty }}
                                </q-badge>
                            </div>
                        </div>
                        <div v-else>
                            <q-chip>No Job</q-chip>
                        </div>
                    </div>
                    <div v-else>
                        <!-- <q-chip>Not active</q-chip> -->
                    </div>
                </q-td>
            </template>
            <template #body-cell-status="props">
                <q-td :props="props" auto-width class="text-center">
                    <div v-if="props.row.state === 'active'">
                        <q-chip v-if="props.row.status === 'ready'" color="green-9" class="text-white text-capitalize">{{ props.row.status }}</q-chip>
                        <q-chip v-else-if="props.row.status === 'busy'" color="red" class="text-white text-capitalize">{{ props.row.status }}</q-chip>
                        <q-chip v-else-if="props.row.status == 'offline'" color="grey-6" class="text-white text-capitalize">{{ props.row.status }}</q-chip>
                        <q-chip v-else-if="props.row.status == 'booked'" color="amber-7" class="text-white text-capitalize">{{ props.row.status }}</q-chip>
                    </div>
                    <!-- <div v-else>
                        <q-chip>Not active</q-chip>
                    </div>   -->
                </q-td>
            </template>
            <template #body-cell-product="props">
                <q-td :props="props" auto-width class="text-center">
                    <div v-if="props.row.state === 'active'">
                        <div v-for = "product,i in props.row.products" :key="i">
                            <q-badge>
                                {{ product.sku }}
                                &nbsp&nbsp{{ product.name }}
                                &nbsp&nbsp{{ product.qty}}
                                &nbsp{{ product.unit }}
                            </q-badge>
                        </div>
                    </div>
                    <div v-else>
                        <!-- <q-chip>Wait for active</q-chip> -->
                    </div>
                </q-td>
            </template>
            <template #body-cell-actions="props">
                <q-td class="text-center">
                    <!-- <q-btn flat square size="md" icon="add" color="blue" title="Add Product" /> -->
                    <q-btn flat square size="md" icon="edit" color="blue" title="Edit Asset"> </q-btn>
                </q-td>
            </template>

           
        </q-table>
        <!-- <div class="q-mt-md">
            Selected: {{ JSON.stringify(selected) }}
        </div> -->
    </div>
</template>     

<!-- <style lang="sass">
    .q-table__top 
    thead tr:first-child th
        background-color:#eeeeee

</style> -->