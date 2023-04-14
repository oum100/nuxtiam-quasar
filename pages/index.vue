<template>
  <!-- <div class="q-mt-xl"> -->
    <div class=" column item-center">
        <div class="row q-mt-xl">
            <div class="col-5 text-center">
              <NuxtLink to="https://nuxt.com/" target="_blank">
                <img class="q-mx-auto q-mb-md" src="http://imgur.com/V4LtoII.png" width="120px">
              </NuxtLink>   
            </div>   
            <div class="col-2 text-center">
              <NuxtLink to="https://quasar.dev" target="_blank">
                <img src="https://cdn.quasar.dev/logo-v2/svg/logo.svg" width="70"> 
                <div class="align-center"><img src="https://cdn.quasar.dev/logo-v2/svg/logotype.svg" width="180px"></div>
              </NuxtLink>
            </div>
            <div class="col-5 text-center ">
              <NuxtLink to="https://github.com/jeremycoder/nuxt-iam" target="_blank">
                <img src="~~/iam/ui/img/nuxt-iam-logo2.png" alt="Nuxt IAM logo" width="180px">
              </NuxtLink>
            </div>
        </div>      
        <div class="text-center"><h3 class="text-weight-bolder">Nuxt 3 &nbsp&nbsp&nbsp Quasar 2.x &nbsp&nbsp&nbsp Nuxt-IAM 0.01</h3></div> 
    </div>

    <div class="column items-center" style="height: 100px">
      <div class="col " style="width:760px" >
        <p class="text-center text-subtitle1">
          Quickly build an amazing app with the Nuxt 3,Quasar 2x and Nuxt-IAM starter kit. 
          The Quasar is grate UI framework come with many components. 
          The Nuxt-IAM is authentication framework build all necessary that ready to use.
          This twm combination allows you to build a great app in a short time. 
        </p>
      </div> 
    </div>

    <div class=" q-mt-xl column items-center">
        <div class="q-pa-md q-gutter-sm">
          <q-btn href="https://quasar.dev/" color="primary">Quasar</q-btn>
          <q-btn href="https://github.com/jeremycoder/nuxt-iam" color="warning" text-color="black" >Nuxt-IAM</q-btn>
        </div>  
    </div>
  <!-- </div> -->
</template>

<script setup lang="ts">
  useHead({
    title: 'Home Page'
  })
</script>
