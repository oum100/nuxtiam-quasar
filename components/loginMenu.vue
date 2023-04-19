<script setup lang="ts">
import { useIamProfileStore } from '@/stores/useIamProfileStore'
import menuItems from './landing/menuItems'

const drawerLeft = ref(false)
const menus = ref(menuItems)
const miniState = ref(true)

// Pinia store for iamProfile
const iamStore = useIamProfileStore()
const { logout } = useIam();

const iAmLoggedIn = ref(false);
const showMenu = ref(false);

// Profile variables
const firstName = ref(<string|undefined>(undefined))
const lastName = ref(<string|undefined>(undefined))
const avatar = ref(<string|undefined>(undefined))

// Watch the iamProfile store
iamStore.$subscribe((mutation, state) => { 
  iAmLoggedIn.value = state.isLoggedIn
 
  // If profile values
  if (iAmLoggedIn.value) {
    const temp = iamStore.getProfile
    if (temp) {
      firstName.value = temp.firstName
      lastName.value = temp.lastName
      avatar.value = temp.avatar
      avatar.value ="/images/users/2.jpg"   //temp avatar please delete
    }
  }
})

/**
 * @Desc Toggle profile menu
 */
 async function toggleMenu() {
  showMenu.value = !showMenu.value;  
}

/**
 * @Desc Log user out
 */
async function logMeOut() {
  const { status } = await logout();
  if (status === "success") {
    
    // Clear store variables
    iamStore.setIsLoggedIn(false)
    iamStore.clearProfile()

    navigateTo("/iam/login");
  }
}

</script>
<template>
    <div v-if="!iAmLoggedIn"> 
        <q-btn to="/iam/login" flat  size="md" icon="mdi-login" class="q-mr-sm" >
            <q-tooltip>Login</q-tooltip>
            &nbspLogin
        </q-btn>
        <q-btn to="/iam/register" flat icon="mdi-account-plus" class="q-mr-sm">
            <q-tooltip>Register</q-tooltip>
            &nbspJoin
        </q-btn>
    </div>
    <div v-else>
        <q-btn flat size="md"  @click="toggleMenu()" >
            <q-tooltip>User Menu</q-tooltip>
            {{firstName}} {{lastName}} &nbsp
            <q-avatar>
                <img :src="avatar" />
            </q-avatar>          
            <q-menu  >
                <q-list style="min-width: 150px">
                    <q-item to="/backend/dashboard/userProfile" clickable v-ripple >
                        <q-item-section avatar><q-icon name="person"/></q-item-section>
                        <q-item-section>Profile</q-item-section>
                    </q-item>
                    <q-item  to="/backend/dashboard/userSetting" clickable v-ripple>
                        <q-item-section avatar><q-icon name="admin_panel_settings"/></q-item-section>
                        <q-item-section>Setting</q-item-section>
                    </q-item>
                    <q-item clickable v-ripple @click="logMeOut">
                        <q-item-section avatar><q-icon name="logout"/></q-item-section>
                        <q-item-section >Logout</q-item-section>
                    </q-item>
                </q-list>
            </q-menu>  
        </q-btn>

        <!-- Side menu  -->
        <q-drawer
        v-model="drawerLeft"
        :width="200"
        :breakpoint="700"
        show-if-above
        :mini="miniState"
        @mouseover="miniState = false"
        @mouseout="miniState = true"
        mini-to-overlay
        class="bg-primary"
        >
            <q-scroll-area class="fit" >
                <q-list padding class="menu-list" >
                    <template v-for="item,i in menus" :key="i" >
                        <div v-if="item.header">
                            <q-expansion-item :label="item.title" :icon="item.icon" expand-icon-class="text-white">
                                <div v-for="subitem,i in item.children" :key="i">
                                    <q-item clickable v-ripple :to="subitem.to" :inset-level="0.2">
                                        <q-item-section avatar><q-icon color="white" :name="subitem.icon" /></q-item-section>
                                        <q-item-section class="text-white" >{{subitem.title }}</q-item-section>
                                    </q-item>
                                </div>
                            </q-expansion-item>
                        </div>
                        <q-item v-else clickable v-ripple  :to="item.to" >
                            <q-item-section avatar><q-icon color="white"  :name="item.icon" /></q-item-section>
                            <q-item-section class="text-white" >{{item.title }}</q-item-section>
                        </q-item>
                        <q-separator color="blue-4" inset :key="'sepa'+i" v-if="item.separator"/>     

                    </template>
                </q-list>
            </q-scroll-area>  
        </q-drawer>
    </div>    
</template>