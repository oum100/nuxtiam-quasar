<script setup lanng="ts">
    import { useIamProfileStore } from '@/stores/useIamProfileStore'

    const iamStore = useIamProfileStore()
    const { isAuthenticated, getProfile, logout, verifyEmail } = useIam();

    const isLoaded = ref(false);
    const iAmLoggedIn = ref(false);
    const showProfile = ref(false);
    let getProfileError = ref(null);
    let verificationEmailSent = ref(false);

    // Profile variables
    const firstName = ref("");
    const lastName = ref("");

    // Check email verification
    const verifyRegistrations =
      useRuntimeConfig().public.iamVerifyRegistrations === "true";
    const emailIsVerified = ref(false);

    // User profile
    const profile = {
      uuid: "",
      firstName: "",
      lastName: "",
      email: "",
      role: "",
      avatar: "",
      csrfToken: "",
      isActive: "",
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
      permissions: "",
    };

    

    onMounted(async () => {
      await isLoggedIn();
      await getMyProfile();
      isLoaded.value = true;
    });

    async function isLoggedIn() {
      iAmLoggedIn.value = await isAuthenticated();

      // If user is not authenticated, push to login page
      if (!iAmLoggedIn.value) navigateTo("/iam/login");  
    }

    // Check is user is admin 
    const isAdmin = computed(() => {
      if (profile && profile.permissions) return profile.permissions.includes('canAccessAdmin')
      else return false
    })


    // Log user out
    async function logMeOut() {
      const { status } = await logout();
      if (status === "success") {
        
        // Clear store variables
        iamStore.setIsLoggedIn(false)
        iamStore.clearProfile()

        navigateTo("/iam/login");
      }
    }

    // Attempt to get user profile
    async function getMyProfile() {
      const { status, error, data } = await getProfile();  

      // If error, show error
      if (error) {
        console.log("error: ", error);
        getProfileError.value = error;
      }

      // If successful, data will contain profile
      if (status === "success") {
        profile.id = data.id;
        profile.uuid = data.uuid;
        profile.firstName = data.first_name;
        profile.lastName = data.last_name;
        profile.email = data.email;
        profile.avatar = data.avatar;
        profile.csrfToken = data.csrf_token;
        profile.isActive = data.is_active;
        profile.role = data.role;
        profile.permissions = data.permissions;

        // Assign to local reactive variables
        firstName.value = profile.firstName;
        lastName.value = profile.lastName;

        // Check email verification status
        emailIsVerified.value = data.email_verified;
        showProfile.value = true;    

        // Store some profile data in store
        iamStore.setProfile({
          firstName: profile.firstName,
          lastName: profile.lastName,
          avatar: profile.avatar,
        })
        
        // Set log in true in store
        iamStore.setIsLoggedIn(true)
        iamStore.setUpdateCount()

        
      }  
    }

    /**
     * @desc Sends API request to verify email
     * @param email User email
     */
    async function verifyMyEmail(email) {  
      verifyEmail(email);
      verificationEmailSent.value = true;
    }

    useHead({
      title: "WashPoint Dashboard",  
    });

    function getBreadcrumbs(){
      const crumbs = useUtils()
      const items =crumbs.getBreadcrumb()
      console.log(items)
      return items
    }  

</script>

<template>
    <div v-if="isLoaded">
        <div v-if="isLoggedIn && profile">
            <div v-if="verifyRegistrations && !emailIsVerified" >
                <div>
                    <h3>Email verification is required</h3>
                    <div v-if="!verificationEmailSent">
                        <p>Please click the button below to verify your email</p>
                        <q-btn @click="verifyMyEmail(profile.email)">
                            Send email verification
                        </q-btn>
                        <q-btn @click="logMeOut()">
                            Logout
                        </q-btn>
                    </div>
                    <div v-else>
                        <p>
                            Please check your email. Check your spam folder too. Click the
                            link in the email to verify your email. You should receive it
                            within 15 minutes.
                        </p>
                    </div>
                </div>
            </div>
            <div v-else-if="getProfileError">
                <div>
                    <h3>There was an error</h3>
                    <p>{{ getProfileError }}</p>
                    <q-btn @click="logMeOut()">
                        Logout
                    </q-btn>
                </div>
            </div>
            <div v-else class="q-gutter-x-md">       
                <breadcrumbBar/>         
                <NuxtPage :profile="profile" @profileUpdate="getMyProfile"/>         
            </div>
        </div>
    </div>
    <div v-else>
        <q-inner-loading
        showing=true
        label="Please wait..." 
        label-class="text-teal"
        label-style="font-size: 1.1em"
      />
    </div>
</template>