<script setup lang="ts">
    const selected = ref([])
    const columns = [
        {name: 'index', label: 'No', field: 'index', align: 'left', sortable: true, style: 'width: 20px'},
        {name: 'date', label: 'Date', field: 'date', align: 'left', sortable: true, style: 'width: 200px'},
        {name: 'transaction', label: 'Transaction', field: 'transaction', align: 'left', sortable: true,style: 'width: 200px'},
        {name: 'asset', label: 'Asset', field: 'asset', align: 'left', sortable: true,style: 'width: 200px'},
        {name: 'uuid', label: 'Uuid', field: 'uuid', align: 'left', sortable: true,style: 'width: 200px'},
        {name: 'channel', label: 'Pay by', field: 'channel', align: 'left', sortable: true},
        {name: 'status', label: 'Status', field: 'status', align: 'left', sortable: true},
        {name: 'actions', label: 'Actions', field: 'actions', align: 'center', sortable: true},
    ]

    const info=[
        {  
            date: '2021-01-01 15:15',
            asset:'INS-001',
            transaction:'TR-001',
            uuid:'ABCDEFGHI',
            channel:'QR',
            status:'paid',
            actions:''
        },
        {  
            date: '2021-01-01 15:30',
            asset:'INS-002',
            transaction:'TR-002',
            uuid:'ABCDEFGHI',
            channel:'coin',
            status:'refund',
            actions:''
        },
        {
            date: '2021-01-01 15:50',
            asset:'INS-004',
            transaction:'TR-002',
            uuid:'ABCDEFGHI',
            channel:'coin',
            status:'cancel',
            actions:''
        },
        {
            date: '2021-01-01 14:00',
            asset:'INS-005',
            transaction:'TR-002',
            uuid:'ABCDEFGHI',
            channel:'QR',
            status:'admin',
            actions:''
        },
        {  
            date: '2021-01-01 15:15',
            asset:'INS-001',
            transaction:'TR-001',
            uuid:'ABCDEFGHI',
            channel:'QR',
            status:'paid',
            actions:''
        },
        {  
            date: '2021-01-01 15:30',
            asset:'INS-002',
            transaction:'TR-002',
            uuid:'ABCDEFGHI',
            channel:'coin',
            status:'refund',
            actions:''
        },
        {
            date: '2021-01-01 20:50',
            asset:'DRY-004',
            transaction:'TR-002',
            uuid:'ABCDEFGHI',
            channel:'QR',
            status:'paid',
            actions:''
        },
        {
            date: '2021-01-01 19:00',
            asset:'DRY-002',
            transaction:'TR-002',
            uuid:'ABCDEFGHI',
            channel:'QR',
            status:'paid',
            actions:''
        },
        {
            date: '2021-01-02 20:50',
            asset:'DRY-004',
            transaction:'TR-002',
            uuid:'ABCDEFGHI',
            channel:'QR',
            status:'paid',
            actions:''
        },
        {
            date: '2021-01-03 19:00',
            asset:'DRY-002',
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