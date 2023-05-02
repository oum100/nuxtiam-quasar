<script setup lang="ts">
    const stars = ref(4.2)
    const getCrumbs = useUtils()
</script>
<template>  
    <div class="q-px-md">
        <q-page>
            <div>To show in priod of today , weekly, monthly yearly </div>
            <div>Income total , qr, coin, each machine type (best selling channel)</div>
            <div>To show best selling product in each area</div>
            <div>Status from job/machine to understand how well they perform their job, when should maintenance them</div>
            <div class="row" style="height: 200px">
                <div class="col-3 q-pa-md">
                    <q-card class="my-card" flat bordered>
                        <q-card-section>
                            <div class="text-h6 q-mb-xs">Our Changing Planet</div>
                            <div class="row no-wrap items-center">
                            <q-rating size="18px" v-model="stars" :max="5" color="primary" />
                            <span class="text-caption text-grey q-ml-sm">4.2 (551)</span>
                            </div>
                        </q-card-section>
                        <img src="https://cdn.quasar.dev/img/mountains.jpg">
                    </q-card>
                </div>
                <div class="col-3 bg-blue-3 text-center">
                    Weekley, Monthly, Yearly
                </div>
                <div class="col-3 bg-blue-4 text-center">
                    Transaction for , qr, coin, each type
                </div>
                <div class="col-3 bg-blue-4 text-center">
                    status job, iot (success failure)
                    frequency use
                </div>
            </div>
        </q-page>
    </div>
    
</template>