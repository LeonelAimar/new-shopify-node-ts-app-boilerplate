<template>
	<main class="container-fluid">
        <Header />
		<router-view/>
	</main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppStore from './store/AppStore'
import ShopifyApp from './providers/ShopifyAppProvider'

import Header from './components/Partials/Header.vue'

export default defineComponent({
    components: {
        Header,
    },
    setup() {
        (async () => AppStore.methods.initFetchings())()
        console.log(ShopifyApp.getState())
    },
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
