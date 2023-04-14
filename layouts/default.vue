<script setup lang="ts">
    import Header from '~/components/landing/Header.vue'
    import Footer from '~/components/landing/Footer.vue'

</script>
<template>
    <q-layout style="height: 1800px">
        <Header />
        <q-page-container>
            <q-page>
                <slot />
            </q-page>
        </q-page-container>
        <Footer />
    </q-layout>
</template>