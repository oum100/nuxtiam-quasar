<script setup lang="ts">
    const isOldPwd = ref(false);
    const isNewPwd = ref(false);
    const isConfirmPwd = ref(false);

    const oldPwd = ref('');
    const newPwd = ref('');
    const confirmPwd = ref('');

    const changePwd = () => {
        console.log(oldPwd.value);
        console.log(newPwd.value);
        console.log(confirmPwd.value);
    }

</script>
<template>
    <q-dialog >
        <q-card style="min-width:500px ; min-height:400px">
            <q-card-section>
                <q-form @submit.prevent="changePwd">
                <div class="row">
                    <div class="text-h6 q-pa-md">Change Password</div>
                </div>
                <div class="row">
                    <div class="col-12 q-px-sm">
                    <q-input
                        v-model="oldPwd"
                        label="Old Password"
                        :type="isOldPwd ? 'password' : 'text'"
                        filled
                        class="q-mb-md"
                    >
                        <template v-slot:prepend>
                            <q-icon name="key" />
                        </template>    
                        <template v-slot:append>
                            <q-icon
                                :name="isOldPwd ? 'visibility_off' : 'visibility'"
                                class="cursor-pointer"
                                @click="isOldPwd = !isOldPwd"
                            />
                        </template>   
                    </q-input>
                    </div>
                    <div class="col-12 q-px-sm">
                    <q-input
                        v-model="newPwd"
                        label="New Password"
                        :type="isNewPwd ? 'password' : 'text'"
                        filled
                        class="q-mb-md"
                    >
                        <template v-slot:prepend>
                            <q-icon name="key" />
                        </template>    
                        <template v-slot:append>
                            <q-icon
                                :name="isNewPwd ? 'visibility_off' : 'visibility'"
                                class="cursor-pointer"
                                @click="isNewPwd = !isNewPwd"
                            />
                        </template> 
                    </q-input>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12 q-px-sm">
                    <q-input
                        v-model="confirmPwd"
                        label="Confirm Password"
                        :type="isConfirmPwd ? 'password' : 'text'"
                        filled
                        class="q-mb-md"
                    >
                        <template v-slot:prepend>
                            <q-icon name="key" />
                        </template>    
                        <template v-slot:append>
                            <q-icon
                                :name="isConfirmPwd ? 'visibility_off' : 'visibility'"
                                class="cursor-pointer"
                                @click="isConfirmPwd = !isConfirmPwd"
                            />
                        </template> 
                    </q-input>
                    </div>
                </div>
                <div class="q-gutter-md text-center">
                    <q-btn label="Cancel" color="primary" v-close-popup style="min-width:180px"/>
                    <q-btn label="Change Password" type="submit" color="primary" style="min-width:180px" class="q-mt-md"/>
                </div>
                </q-form>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>
