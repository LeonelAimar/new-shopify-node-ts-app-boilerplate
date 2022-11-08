<template>
  <div class="about">
    <h1>This is an about page, visit our page:</h1>
    <a href="https://innovategroup.agency">Innovate• Group Agency</a><br>
    <div>
        <button class="Polaris-Button Polaris-Button--primary" type="button" @click="testPicker">
            <span class="Polaris-Button__Content">
                <span class="Polaris-Button__Text">Add product</span>
            </span>
        </button>
        <div id="PolarisPortalsContainer"></div>
    </div><br>

    <PolarisIndex />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PolarisIndex from '@/components/PolarisIndex.vue'
import ShopifyBridge, { ShopifyApp } from '@/services/ShopifyAppBridgeService';
import { ResourcePicker } from '@shopify/app-bridge/actions';

export default defineComponent({
    components: { PolarisIndex },
    setup() {
        console.log(ShopifyBridge)
        const productPicker = ResourcePicker.create(ShopifyApp, {
            resourceType: ResourcePicker.ResourceType.Product,
            options: { selectMultiple: true, showHidden: true }
        });

        const testPicker = () => productPicker.dispatch(ResourcePicker.Action.OPEN);

        productPicker.subscribe(ResourcePicker.Action.CANCEL, () => {
            // Picker was cancelled
            console.log('closed')
        });

        productPicker.subscribe(ResourcePicker.Action.SELECT, (selectPayload) => {
            const selection = selectPayload.selection;
            // Do something with `selection`
            console.log(selection)
        });

        return {
            testPicker
        }
    },
})
</script>


<style scoped>
a, h1 {
    text-decoration: none;
    color: white;
    font-size: 2rem;
}

a:hover { color: #42b983; }
</style>