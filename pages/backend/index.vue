<script setup lang="ts">
    import menuItems from '@/components/landing/menuItems'
    const stars = ref(4.2)
    // const getCrumbs = useUtils()
</script>
<template>  
    <div class="q-px-md">
        <q-page>
            <div class="row text-center" >
                <div class="col-3 q-pa-md " v-for="btn,i in menuItems" :key="i">
                    <q-btn  push color="light-blue" :to="btn.to" padding="xl" style="width:180px;height:150px" size="lg">
                      <div class="columns justify-center no-wrap">
                        <q-icon :name="btn.icon" size="lg"></q-icon>
                        <br><div >{{ btn.title }}</div>
                      </div>
                    </q-btn>
                </div>
            </div>
        </q-page>
    </div>
    
</template>