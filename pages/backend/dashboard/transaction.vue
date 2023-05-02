<script setup lang="ts">
    const selected = ref([])
    const columns = [
        {name: 'index', label: 'No', field: 'index', align: 'left', sortable: true, style: 'width: 15px'},
        {name: 'date', label: 'Date', field: 'date', align: 'left', sortable: true, style: 'width: 100px'},
        {name: 'transaction', label: 'Transaction', field: 'transaction', align: 'left', sortable: true, style: 'width: 120px'},
        {name: 'asset', label: 'Asset', field: 'asset', align: 'left', sortable: true, style: 'width: 100px'},
        {name: 'type', label: 'Machine', field: 'type', align: 'left', sortable: true, style: 'width: 100px'},
        {name: 'uuid', label: 'Uuid', field: 'uuid', align: 'left', sortable: false},
        {name: 'channel', label: 'Pay by', field: 'channel', align: 'left', sortable: false},
        {name: 'status', label: 'Status', field: 'status', align: 'left', sortable: false},
        {name: 'actions', label: 'Actions', field: 'actions', align: 'center', sortable: false},
    ]

    const info=[
        {  
            date: '2021-01-01 15:15',
            asset:'INS-001',
            type:'Washer',
            transaction:'01234567890123456789',
            uuid:'0123456789123456',
            channel:'QR',
            status:'paid',
            actions:''
        },
        {  
            date: '2021-01-01 15:30',
            asset:'INS-002',
            type:'Washer',
            transaction:'TR-002',
            uuid:'ABCDEFGHI',
            channel:'refund',
            status:'refund',
            actions:''
        },
        {
            date: '2021-01-01 15:50',
            asset:'INS-004',
            type:'Washer',
            transaction:'TR-002',
            uuid:'ABCDEFGHI',
            channel:'coin',
            status:'cancel',
            actions:''
        },
        {
            date: '2021-01-01 14:00',
            asset:'INS-005',
            type:'Washer',
            transaction:'TR-002',
            uuid:'ABCDEFGHI',
            channel:'free',
            status:'admin',
            actions:''
        },
        {  
            date: '2021-01-01 15:15',
            asset:'INS-001',
            type:'Washer',
            transaction:'TR-001',
            uuid:'ABCDEFGHI',
            channel:'coin',
            status:'paid',
            actions:''
        },
        {  
            date: '2021-01-01 15:30',
            asset:'INS-002',
            type:'Washer',
            transaction:'TR-002',
            uuid:'ABCDEFGHI',
            channel:'refund',
            status:'refund',
            actions:''
        },
        {
            date: '2021-01-01 20:50',
            asset:'DRY-004',
            type:'Dryer',
            transaction:'TR-002',
            uuid:'ABCDEFGHI',
            channel:'QR',
            status:'paid',
            actions:''
        },
        {
            date: '2021-01-01 19:00',
            asset:'DRY-002',
            type:'Dryer',
            transaction:'TR-002',
            uuid:'ABCDEFGHI',
            channel:'QR',
            status:'paid',
            actions:''
        },
        {
            date: '2021-01-02 20:50',
            asset:'DRY-004',
            type:'Dryer',
            transaction:'TR-002',
            uuid:'ABCDEFGHI',
            channel:'QR',
            status:'paid',
            actions:''
        },
        {
            date: '2021-01-03 19:00',
            asset:'DRY-002',
            type:'Dryer',
            transaction:'TR-002',
            uuid:'ABCDEFGHI',
            channel:'QR',
            status:'paid',
            actions:''
        }
    ]

    let rows:any[]=[]
    // for (let i = 0; i < 10; i++) {
    //     rows = rows.concat(info.slice(0).map(r => ({ ...r })))
    // }

    rows=rows.concat(info)
    rows.forEach((row, index) => {
        row.index = index+1
    })

    const pagination= ref({rowsPerPage: 10})

</script>

<template>
    <div class="q-px-md">
        <div class="row " style="height: 130px">
            <div class="col-3 q-px-md">
                <q-card style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)" class="text-white">
                    <q-card-section>
                        <div class="row">
                            <div class="col-7">
                                <div class="row text-h6">Today</div>
                                <div class="row text-subtitle2">Revenues:&nbsp<span>300</span></div>
                                <div class="row text-subtitle2">Transaction:&nbsp<span>20</span></div>
                            </div>
                            <div class="col-5 q-pa-sm">
                                <div class="row justify-start items-center">
                                    <div class="col-4">
                                        <q-icon name="qr_code_2" size="sm" class="q-mr-sm"/>
                                    </div>
                                    <div class="col-4 text-subtitle2 text-center">3</div>
                                    <div class="col-4 text-subtitle2 text-center">120</div>
                                </div>
                                <div class="row justify-start items-center">
                                    <div class="col-4">
                                        <q-icon name="monetization_on" size="sm" class="q-mr-sm"/>
                                    </div>
                                    <div class="col-4 text-subtitle2 text-center">3</div>
                                    <div class="col-4 text-subtitle2 text-center">120</div>
                                </div>
                            </div>
                        </div>
      
                    </q-card-section>
                </q-card>
            </div>
            <div class="col-3 q-px-md ">
                <q-card style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)" class="text-white">
                    <q-card-section>
                        <div class="text-h6">Weekly</div>
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
                        <div class="text-h6">Summary Status</div>
                        <div class="text-h4">100</div>
                    </q-card-section>
                </q-card>
            </div>   
        </div>
        <q-table
        flat bordered
        title="Shop Transactions"
        :rows="rows"
        :columns="columns"
        row-key="index"
       
        virtual-scroll
        :rows-per-page-options="[5,10,20,30]"
        v-model:pagination="pagination"
       
        >
            <template #header="props">
                <q-tr :props="props" >
                   
                    <q-th
                    v-for = "col in props.cols"
                    :key ="col.name"
                    :props="props"
                    class="bg-grey-4"
                    >
                    {{ col.label }}
                    </q-th>
                </q-tr>
            </template>
            <template #body-cell-channel="props">
                <q-td :props="props" auto-width>
                    <div class="text-start">
                        <q-icon name="qr_code_2" v-if="props.row.channel === 'QR'" size="2em"/>
                        <q-icon name="monetization_on" v-else-if="props.row.channel === 'coin'" size="2em"/>
                        <q-icon name="undo" v-else-if="props.row.channel === 'refund'" size="2em"/>
                        <q-icon name="minimize" size="2em" v-else />
                    </div>
                </q-td>
            </template>
            <template #body-cell-status="props">
                <q-td :props="props" auto-width class="text-center">
                    <q-badge v-if="props.row.status === 'paid'" color="green-9" class="text-white text-capitalize">{{ props.row.status }}</q-badge>
                    <q-badge v-else-if="props.row.status === 'refund'" color="red" class="text-white text-capitalize">{{ props.row.status }}</q-badge>
                    <q-badge v-else-if="props.row.status == 'cancel'" color="grey-6" class="text-white text-capitalize">{{ props.row.status }}</q-badge>
                    <q-badge v-else-if="props.row.status == 'admin'" color="blue" class="text-white text-capitalize">{{ props.row.status }}</q-badge>
                </q-td>
            </template>
            <template #body-cell-actions="props">
                <q-td class="text-center">
                    <q-btn flat square size="md" icon="currency_exchange" color="blue" title="Refund" />
                    <q-btn flat square size="md" icon="cancel_presentation" color="red" title="Cancel"> </q-btn>
                </q-td>
            </template>

           
        </q-table>
    </div>
</template>