
<script setup>
import changePwdDialog from '@/components/user/changePwdDialog.vue'

const emit = defineEmits(["profileUpdate"]);

const { updateProfile } = useIam();
const updateSuccessful = ref(false);
let profileError = ref(null);
const uploadPic = ref(false);
const changePwd=ref(false)
const newImage = ref('')

const isOldPwd = ref(false);
const isNewPwd = ref(false);
const isConfirmPwd = ref(false);

// Some profile values
// const profile = ref({
//   uuid: "3200700176759",
//   firstName: "Teerin",
//   lastName: "Leepaiboon",
//   email:"L.Teerin@gmail.com",
//   permission:"canAccessAdmin",
//   role:"SUPER_ADMIN",
//   isActive:true
// })

const roleOptions = [
  "SUPER_ADMIN","ADMIN","GENERNAL"
]

const profile = reactive({
  uuid: "",
  firstName: "",
  lastName: "",
});

// Get profile passed through attributes
const attrs = useAttrs();
profile.uuid = attrs.profile.uuid;
profile.firstName = attrs.profile.firstName;
profile.lastName = attrs.profile.lastName;

// Csrf token should be part of profile
const csrfToken = attrs.profile.csrfToken;

// Attempt to update user profile
async function updateMyProfile() {
  if (
    profile.firstName === attrs.profile.firstName &&
    profile.lastName === attrs.profile.lastName
  )
    return;

  // Object with updatable values
  const values = reactive({
    uuid: profile.uuid,
    firstName: profile.firstName,
    lastName: profile.lastName,
    csrfToken: csrfToken,
  });

  const { error, data } = await updateProfile(values);

  // If error, display error
  if (error) {
    console.log("error: ", error);
    profileError.value = error;
    return;
  }

  updateSuccessful.value = true;

  emit("profileUpdate");
}
</script>

<template>
    <div class="row q-px-md justify-center">
      <q-card  class="q-mx-xl" style="width:900px">
        <q-card-section>
          <q-form @submit.prevent="updateMyProfile">  
            <div class="row">
              <div class="col-2 q-px-md">
                <q-btn round title="Change picture" @click="uploadPic=true">
                  <q-avatar  size="70px">
                    <img src="https://cdn.quasar.dev/img/avatar.png" />
                    <!-- <q-badge floating color="blue">Edit</q-badge> -->
                  </q-avatar>
                </q-btn> 
              </div>
              <div class="col-8 q-px-md q-mb-md">
                <div class="text-h6">User Profile</div>
                  <div class="text-subtitle2">{{profile.firstName}}&nbsp{{profile.lastName}} </div>
              </div>
              <div class="col-2">
                <q-toggle 
                  v-model="$attrs.profile.isActive" 
                  label="Active" 
                  checked-icon="check"
                  unchecked-icon="clear"
                  :true-value="true" 
                  :false-value="false"
                  color="green"
                  size="lg"
                  disable
                />
              </div>
            </div>
            <div class="row">
              <div class="col-6 q-px-sm ">
                <q-input v-model="profile.uuid" label="uuid" filled readonly class="q-mb-md text-subtitle2" >
                  <template v-slot:append>
                    <q-icon name="badge" />
                  </template>
                </q-input>
              </div>
              <div class="col-6 q-px-sm">
                  <q-input
                    v-model="$attrs.profile.email"
                    label-color="black"
                    label="email"
                    type="email"
                    filled
                    readonly
                    class="q-mb-md text-subtitle2"
                  >
                    <template v-slot:append>
                      <q-icon name="email" />
                    </template>
                  </q-input>
              </div>
            </div>
            <div class="row">
              <div class="col-6 q-px-sm">
                <q-input
                  v-model="profile.firstName"
                  label-color="black"
                  label="First Name"
                  outlined
                  class="q-mb-md"
                >
                  <template v-slot:append>
                    <q-icon name="account_circle" />
                  </template>
                </q-input>
              </div>
              <div class="col-6 q-px-sm">
                <q-input
                  v-model="profile.lastName"
                  label="Last Name"
                  outlined
                  class="q-mb-md"
                >
                  <template v-slot:append>
                    <q-icon name="person" />
                  </template>
                </q-input>
              </div>
            </div>
            <div class="row">
              <div class="col-6 q-px-sm">
                <q-input
                  v-model="$attrs.profile.permissions"
                  label-color="black"
                  label="permissions"
                  filled
                  class="q-mb-md"
                  readonly
                >
                  <template v-slot:prepend>
                    <q-icon name="security" />
                  </template>
                </q-input>
              </div>
              <div class="col-6 q-px-sm">
                <q-select
                  v-model="$attrs.profile.role"
                  :options="roleOptions"
                  label="role"
                  filled
                  class="q-mb-md"
                  readonly
                >
                  <template v-slot:prepend>
                    <q-icon name="local_police" />
                  </template>
                </q-select>
              </div>
            </div>
            <div class="q-gutter-md">
              <q-btn label="Update Profile" type="submit" color="primary"  class="q-mt-md"/>
              <q-btn label="Change Password" color="primary" @click="changePwd=true"/>     
            </div>

          </q-form>
        </q-card-section> 
      </q-card>

      <q-dialog v-model="uploadPic" persistent>
        <q-card style="min-width: 500px; min-height: 300px;">
          <q-card-section>
            <q-file 
              label="Upload image" 
              v-model="newImage"
              outlined
              use-chips
              accept=".jpg, image/*"
              @rejected="onRejected"
              style="min-width: 500px; min-height:300px"
            /> 
          </q-card-section>
          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn flat label="Change Image" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
     
      <changePwdDialog v-model="changePwd"/>
    </div>


</template>