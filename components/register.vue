<script setup lang="ts">
import { useQuasar } from 'quasar';

const $q = useQuasar();
const { register } = useIam();
const verifyRegistrations =
  useRuntimeConfig().public.iamVerifyRegistrations === "true";

// Error and success flags
// let registerError = ref(null);
let registerSuccess = ref(false);

const registerForm = reactive({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
});

const acceptTerms = ref(false);
const isPwd = ref(true);

async function tryRegister() {
  // Check terms and conditions checkbox
  if (!acceptTerms.value) {
    $q.notify({
      message: "You must accept terms and conditions",
      color: "negative",
      position: "right",
      icon:"error",
      timeout: 2500,
    });
    return;
  }

  // Send registration data
  const { status, error } = await register(
    registerForm.firstName,
    registerForm.lastName,
    registerForm.email,
    registerForm.password
  );

  // If we get an error
  if (error) {
    $q.notify({
      message: error.message,
      color: "negative",
      position: "right",
      icon:"error",
      timeout: 2500,
    });
    console.log("error: ", error);
  }

  // If successful, show success message, wait, then navigate to login page
  if (status === "success") {
    registerSuccess.value = true;
    $q.notify({
      message: "Registration successful",
      color: "positive",
      position: "top",
      icon:"done",
      timeout: 1000,
    });
    setTimeout(() => { navigateTo("/backend/dashboard"); }, 1000);
  }
}

useHead({
  title: "WashPoinnt Register",  
});

</script>


<template>
    <div class="row " q-col-gutter-lg>
        <div class="col-7  text-center">
            <div class="column  justify-center" style="height:760px">
                <q-img
                src="https://cdn.pixabay.com/photo/2018/04/08/22/49/puzzle-3302737__480.jpg"
                style="height:100%"
                fit="cover"
                ></q-img>
            </div>
        </div>
        <div class="col-5 text-center">
            <div class="column justify-center " style="height:760px">
                <q-card flat class="q-mx-xl" style="height:650px" >
                    <q-card-section>
                        <div class="text-h4 text-left text-weight-bold q-mt-md q-ml-md">สมัครใช้งาน</div>
                        <div class="text-subtitle1 text-left q-mt-sm q-ml-md">ป้อนข้อมูลสำหรับสมัครใช้งาน</div>
                    </q-card-section>
                    <q-card-section>
                        <div class="q-gutter-md" style="max-width: 500px">
                            <q-form >
                                <q-input class="q-mb-sm" color="gray-3" outlined v-model="registerForm.firstName" label="Firstname" type="text">
                                    <template v-slot:prepend>
                                        <q-icon name="person" />
                                    </template>     
                                </q-input>
                                <q-input class="q-mb-sm" color="gray-3" outlined v-model="registerForm.lastName" label="Lastname" type="text">
                                    <template v-slot:prepend>
                                        <q-icon name="person" />
                                    </template>     
                                </q-input>
                                <q-input class="q-mb-sm" color="gray-3" outlined v-model="registerForm.email" label="Email" type="email">
                                    <template v-slot:prepend>
                                        <q-icon name="email" />
                                    </template>     
                                </q-input>

                                <q-input color="gray-3" outlined v-model="registerForm.password" label="Password" :type="isPwd ? 'password' : 'text'">
                                    <template v-slot:prepend>
                                        <q-icon name="key" />
                                    </template>    
                                    <template v-slot:append>
                                        <q-icon
                                            :name="isPwd ? 'visibility_off' : 'visibility'"
                                            class="cursor-pointer"
                                            @click="isPwd = !isPwd"
                                        />
                                    </template>   
                                </q-input>  
                                <div class="text-left q-mt-sm">
                                    <q-toggle
                                        v-model="acceptTerms"
                                        checked-icon="check"
                                        color="green"
                                        unchecked-icon="clear"
                                        
                                    />
                                    <span class="text-capital">ยอมรับเงื่อนไขการใช้งาน&nbsp&nbsp</span>
                                    <NuxtLink to="/termcondition">
                                        <span class="text-capital">รายละเอียดเงื่อนไข</span>
                                    </NuxtLink>

                                </div>

                            </q-form>
                        </div>
                        <q-btn label="Join" color="primary" class=" full-width text-subtitle1" @click="tryRegister" > </q-btn>
                        <div class="row q-py-md " >
                            <div class="col-6 text-left">
                                <div>
                                    <q-btn  to ="/iam/login" flat style="color:blue" class="item-start" icon="login">&nbspเข้าใช้งาน</q-btn>
                                </div>
                            </div>
                        </div>
                    </q-card-section>
                </q-card>              
            </div>
        </div>
    </div>
</template>