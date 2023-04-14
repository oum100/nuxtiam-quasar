<script setup lang="ts">
    import {
        GoogleSignInButton,
        type CredentialResponse,
    } from "vue3-google-signin";

    import { useQuasar } from "quasar";

    const $q = useQuasar();
    // Get necessary functions from useIam composable
    const { login, loginWithGoogle } = useIam();
    const allowGoogleAuth = useRuntimeConfig().public.iamAllowGoogleAuth === "true";
    // const allowGoogleAuth = ref(false);

    // These variables come from response from calling Nuxt IAM api
    // let loginError = ref(<{ message: "" } | null>null);

    const loginForm = reactive({
        email: "",
        password: "",
    });

    const isPwd = ref(true);

    async function tryLogin() {
        const { status, error } = await login(loginForm.email, loginForm.password); 

        // If error, log error and return
        if (status === 'fail'){
            // loginError.value = error
            $q.notify ({
                message: error.message,
                color: "negative",
                position: "right",
                icon: "error",
                timeout: 2500,
            });
            console.error(error); 
            return
        }
        
        // If successful, navigate to dashboard
        if (status === "success") navigateTo("/backend/dashboard");
    }

    const handleGoogleLoginSuccess = async (response: CredentialResponse) => {
        const { credential } = response;
        let res = null;
        if (credential) res = await loginWithGoogle(credential);

        // Check for error
        if (res?.error) {
            // loginError.value = res.error;
            $q.notify ({
                message: res.error.message,
                color: "negative",
                position: "right",
                icon: "error",
                timeout: 2500,
            });
        } else {
            navigateTo("/backend/dashboard");
        }
    };

        // Handle Google error event
    const handleGoogleLoginError = () => {
        console.error("Login failed");
    };

    // If you're using the same version of Bootstrap in your whole app, you can remove the links and scripts below
    useHead({
        title: "WashPoint Login",  
    });


</script>


<template>
    <div class="row " q-col-gutter-lg>
        <div class="col-7  text-center">
            <div class="column  justify-center" style="height:760px">
                <q-img
                src="https://cdn.pixabay.com/photo/2021/10/11/17/54/technology-6701504__480.jpg"
                style="height:100%"
                fit="cover"
                ></q-img>
            </div>
                
            
            
        </div>
        <div class="col-5 text-center">
            <div class="column justify-center " style="height:760px">
                <q-card flat class="q-mx-xl" style="height:550px" >
                    <q-card-section>
                        <div class="text-h4 text-left text-weight-bold q-mt-md q-ml-md">เข้าสู่ระบบ</div>
                        <div class="text-subtitle1 text-left q-mt-sm q-ml-md">ป้อนอีเมล์และรหัสผ่านสำหรับเข้าใช้งาน</div>
                    </q-card-section>
                    <q-card-section>
                        <div class="q-gutter-md" style="max-width: 500px">
                            <div v-if="allowGoogleAuth">
                                <GoogleSignInButton
                                    @success="handleGoogleLoginSuccess"
                                    @error="handleGoogleLoginError"
                                ></GoogleSignInButton>
                            </div>
                            <q-form >
                                <q-input class="q-mb-sm" color="gray-3" outlined v-model="loginForm.email" label="Email" type="email">
                                    <template v-slot:prepend>
                                        <q-icon name="email" />
                                    </template>     
                                </q-input>

                                <q-input color="gray-3" outlined v-model="loginForm.password" label="Password" :type="isPwd ? 'password' : 'text'">
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
                            </q-form>
                        </div>
                        <q-btn label="เข้าสู่ระบบ" color="primary" class="q-mt-md full-width text-subtitle1" @click="tryLogin" > </q-btn>
                        <div class="row q-py-md " >
                            <div class="col-6  text-left">
                                <div>
                                    <q-btn to="/iam/register" flat style="color:blue" class="item-start" icon="person_add">&nbspRegister</q-btn>
                                </div>
                            </div>
                            <div class="col-6 text-right">
                                <div>
                                    <q-btn  to="/iam/reset" flat style="color:blue" icon="mdi-lock-reset">&nbspForget Password</q-btn>
                                </div>
                            </div>
                        </div>

                    </q-card-section>
                </q-card>
                
            </div>
        </div>
    </div>
</template>