<script setup lang="ts">
    const getCrumbs = useUtils()
    const crumb = ref([])

</script>

<template>
        <q-toolbar>
            <q-breadcrumbs  class="text-subtitle2 text-capitalize">
                <template v-for = "crumb,i in getCrumbs.getBreadcrumb()">
                    <q-breadcrumbs-el 
                    v-if="i !== 0"
                    :key="i" 
                    :label="crumb.title" 
                    :to="crumb.to" 
                    />
                </template>

            </q-breadcrumbs>
        </q-toolbar>

</template>