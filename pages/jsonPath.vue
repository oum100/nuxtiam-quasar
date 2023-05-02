<script setup lang="ts">

    const JSONPathPlus = useUtils().JSONPathPlus
    const JMESPath = useUtils().JMESPath
    const JP = useUtils().jsonpath
   
    const jsondata = ref('')
    const jsonPath = ref('')
    const jmesPath = ref('')
    const result = ref('')

</script>

<template>
    <div class = "row q-pa-md">
        <q-card style="min-width:200px; min-height:600px">
            <q-card-section>
                <div class="row">
                    <div class=" col-4 text-h6">
                        Test JsonPath
                    </div>
                    <div class="col-8 text-right">
                        <q-btn round icon="add" title="Add" color="primary" />
                    </div>
                </div>
            </q-card-section>
            <q-card-section>
                <div class="col-12 q-px-sm">
                    <q-input 
                        v-model="jsondata" 
                        outlined label="jsondata" 
                        type="textarea"
                        class="q-mb-md"
                        style="min-height:150px"
                    />
                </div>
                
                <div class="col-12 q-px-sm">
                    <q-input v-model="jsonPath" outlined label="jsonPath" class="q-mb-md"></q-input>
                </div>

                <div class="col-12 q-px-sm">
                    <q-input v-model="jmesPath" outlined label="jmesPath for jmesPath only" class="q-mb-md"></q-input>
                </div>
                <div class="q-gutter-md text-center">
                    <q-btn label="Cancel" color="negative" v-close-popup style="min-width:120px"/>
                    <q-btn label="JSONPath-Plus" type="submit" color="primary" style="min-width:120px" 
                        class="q-mt-md"
                        @click=" result=JSONPathPlus(jsondata, jsonPath)"
                    />
                    <q-btn label="jmesPath" type="submit" color="positive" style="min-width:120px" 
                        class="q-mt-md"
                        @click="result=JMESPath(jsondata, jmesPath)"
                    />
                    <q-btn label="JSONPath" type="submit" color="warning" style="min-width:120px" 
                        class="q-mt-md"
                        @click="result=JP(jsondata, jsonPath)"
                    />
                    <q-btn label="Huawei" type="submit" color="info" style="min-width:120px" 
                        class="q-mt-md"
                    />
                </div>
            </q-card-section>
            <q-card-section>
                <q-field standout="bg-teal text-white" label="Result" stack-label>
                    <template v-slot:control>
                        <div class="self-center full-width no-outline" tabindex="0">{{result}}</div>
                    </template>
                </q-field>
            </q-card-section>
        </q-card>
        
    </div>
</template>