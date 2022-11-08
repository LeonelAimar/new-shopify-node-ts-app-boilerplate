<template>
	<main class="container-fluid">
       <h1>APP TEST!!</h1> 
	</main>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import ShopifyApp from './providers/ShopifyAppProvider'

onMounted(() => {
    console.log('MOUNTED!!')
    console.log(ShopifyApp)
})
</script>


<style>
body {
    background-color: #000;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #595e63;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
