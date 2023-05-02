<script setup lang="ts">
    const columns = [   
        {name: 'index', label: 'No', field: 'index', align: 'left', sortable: true, style: 'width: 20px'},
        {name: 'firstname', label: 'Firstname', field: 'firstname', align: 'left', sortable: true,style: 'width: 80px'},
        {name: 'lastname', label: 'Lastname', field: 'lastname', align: 'left', sortable: true,style: 'width: 100px'},
        {name: 'uuid', label: 'Uuid', field: 'uuid', align: 'left', sortable: true,style: 'width: 100px'},
        {name: 'email', label: 'Email', field: 'email', align: 'left', sortable: true, style: 'width: 120px'},
        {name: 'status', label: 'Status', field: 'status', align: 'left', sortable: true,style: 'width: 100px'},
        {name: 'permission', label: 'Permission', field: 'permission', align: 'left', sortable: true,style: 'width: 150px'},
        {name: 'role', label: 'role', field: 'role', align: 'left', sortable: true, style: 'width: 120px'},
        {name: 'updateAt', label: 'Update At', field: 'updateAt', align: 'left', sortable: true, style: 'width: 200px'},
        {name: 'actions', label: 'Actions', field: 'actions', align: 'center', sortable: true},
    ]

    let rows: any[]= []
    const selected = ref([])
    const filter = ref('')
    const pagination= ref({
            sortBy:'desc',
            descending: false,
            page:1,
            rowsPerPage: 10,
            rowsNumber:10
    })
    const getSelectedString = () => {
        if (selected.value.length === 0) {
            return 'No rows selected'
        }
        if (selected.value.length === 1) {
            return '1 row selected'
        }
        return `${selected.value.length} rows selected`
    }

</script>
<template>
    <div class="q-pa-md">       
        <q-page>
            <q-table
                flat bordered
                title="User List"
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

                </template>

            </q-table>
        </q-page>
    </div>
</template>