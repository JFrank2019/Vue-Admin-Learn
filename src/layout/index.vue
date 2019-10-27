<template>
  <div class="layout">
    <app-header></app-header>
    <app-main></app-main>
    <app-navbar></app-navbar>
  </div>
</template>

<script>
import AppHeader from './components/AppHeader'
import AppMain from './components/AppMain'
import AppNavbar from './components/AppNavbar'

export default {
  name: 'layout',
  components: {
    AppHeader,
    AppMain,
    AppNavbar
  }
}
</script>

<style lang="scss" scoped>
.layout {
}
</style>
