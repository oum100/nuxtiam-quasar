<script setup lang="ts">
    const $q = useQuasar();
    const { resetPassword } = useIam();
    const formSent = ref(false);

    const resetForm = {
        email: "",
    };


    async function resetMyPassword() {
    // If nothing is in form, just return without sending anything to server
    if (resetForm.email.length === 0) return;

    // For security purposes, this always returns successful
    // Check your server console logs for debugging purposes
    const result = await resetPassword(resetForm.email);
        console.log("reset form: ", result);
        formSent.value = true;
    }

    useHead({
        title: "Nuxt IAM Register", 
    });

    const showNotify = () => {
        $q.notify ({
            progress:true,
            message: "Please check your email for reset instructions. Check your spam folder too.",
            color: "positive",
            position: "center",
            icon: "done",
            timeout: 2000,
        });
    }
</script>

<template>
    <div class="row" v-if="!formSent">
        <div class="col-7 text-center">
            <div class="column justify-center" style="height:760px">
                <q-img
                src="https://cdn.pixabay.com/photo/2017/03/03/16/09/key-2114302__480.jpg"
                style="height:100%"
                fit="cover"
                ></q-img>
            </div>
        </div>
        <div class="col-5 text-center ">
            <div class="column justify-center " style="height:760px">
                <q-card flat class="q-mx-xl" style="height:500px">
                    <q-card-section>
                        <div class="text-h4 text-left text-weight-bold q-mt-md q-ml-md">Password Reset</div>
                        <div class="text-subtitle1 text-left q-mt-sm q-ml-md">Please enter your email address and we'll send you an email to reset your password.</div>
                    </q-card-section>
                    <q-card-section>
                        <div class="q-gutter-md" style="max-width: 500px">
                            <q-form>
                                <q-input class="q-mb-sm" color="gray-5" outlined v-model="resetForm.email" label="Email" type="email">
                                    <template v-slot:prepend>
                                        <q-icon name="email" />
                                    </template>     
                                </q-input>
                            </q-form>
                        </div>
                        <q-btn label="Reset Password" color="primary" class=" full-width text-subtitle1" @click.prevent="resetMyPassword"></q-btn>
                        <div class="row q-py-md " >
                            <div class="col-6  text-left">
                                <div>
                                    <q-btn to="/iam/register" flat style="color:blue" class="item-start" icon="person_add">&nbspJoin Us</q-btn>
                                </div>
                            </div>
                            <div class="col-6 text-right">
                                <div>
                                    <q-btn  to="/iam/login" flat style="color:blue" icon="mdi-login">&nbspLogin</q-btn>
                                </div>
                            </div>
                        </div>
                    </q-card-section>
                </q-card>
            </div>
        </div>
    </div>
    <div v-else >
        <q-dialog v-model="formSent">
            <q-card>
                <q-card-section>
                    <div class="text-h6 text-weight-bold text-center">Alert</div>
                </q-card-section>
                <q-card-section class="q-pt-none">
                    <div class="q-pa-md text-subtitle2">Please check your email for reset instructions. Check your spam folder too.</div>
                </q-card-section>
                <q-card-actions align="center">
                    <q-btn label="OK" color="primary" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
        <!-- <div class = "q-pa-md">
          <div class="column" >
            <div class="row items-center justify-center">
                <div class="col-4"></div>
                <div class="col-4">
                    <q-card>
                        <q-card-section>
                            <div class="text-h6 text-weight-bold text-center">Email sent</div>
                        </q-card-section>
                        <div class="q-pa-md text-subtitle2">Please check your email for reset instructions. Check your spam folder too.</div>
                    </q-card>
                </div>
                <div class="col-4"></div>
            </div>
          </div>
        </div> -->
    </div>
</template>