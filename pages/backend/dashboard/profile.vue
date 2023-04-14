<script setup>
const emit = defineEmits(["profileUpdate"]);

const { updateProfile } = useIam();
const updateSuccessful = ref(false);
let profileError = ref(null);

// Some profile values
const profile = {
  uuid: "",
  firstName: "",
  lastName: "",
};

// Get profile passed through attributes
const attrs = useAttrs();
// profile.uuid = attrs.profile.uuid;
// profile.firstName = attrs.profile.firstName;
// profile.lastName = attrs.profile.lastName;

// // Csrf token should be part of profile
// const csrfToken = attrs.profile.csrfToken;

// // Attempt to update user profile
// async function updateMyProfile() {
//   if (
//     profile.firstName === attrs.profile.firstName &&
//     profile.lastName === attrs.profile.lastName
//   )
//     return;

//   // Object with updatable values
//   const values = {
//     uuid: profile.uuid,
//     firstName: profile.firstName,
//     lastName: profile.lastName,
//     csrfToken: csrfToken,
//   };

//   const { error, data } = await updateProfile(values);

//   // If error, display error
//   if (error) {
//     console.log("error: ", error);
//     profileError.value = error;
//     return;
//   }

//   updateSuccessful.value = true;

//   emit("profileUpdate");
// }
</script>

<template>
    <q-page>
      <div class="q-pa-md">
        <h4>User Profile page</h4>
      </div>
    </q-page>
</template>