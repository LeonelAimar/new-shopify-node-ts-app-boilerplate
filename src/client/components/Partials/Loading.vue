<template>
    <section>
        <div class="polaris-progress">
            <progress class="polaris-progress__progress" value="1" ref="progressBar" max="100"></progress>
            <div class="polaris-progress__bar polaris-progress__bar--small" ref="progressWidth"></div>
        </div>
        <div class="loadingContainer">
            <svg width="44" height="44" viewBox="0 0 44 44" class="polaris-spinner" role="status"><path d="M15.542 1.487A21.507 21.507 0 0 0 .5 22c0 11.874 9.626 21.5 21.5 21.5 9.847 0 18.364-6.675 20.809-16.072a1.5 1.5 0 0 0-2.904-.756C37.803 34.755 30.473 40.5 22 40.5 11.783 40.5 3.5 32.217 3.5 22c0-8.137 5.3-15.247 12.942-17.65a1.5 1.5 0 1 0-.9-2.863z"></path></svg>
            <span>{{ loadingText }}</span>
        </div>
    </section>
</template>

<script lang="ts">
import { ref, defineComponent, onMounted } from 'vue'
import { HelpersClass } from '../../providers/HelpersService'

export default defineComponent({
    setup() {
        const width = ref(1);
        const loadingText = ref('Cargando...');
        const progressBar = ref(HelpersClass.elemNodeForRefs)
        const progressWidth = ref(HelpersClass.elemNodeForRefs)
        
        onMounted(() => {
            progressBar.value.setAttribute('value', width.value.toString());
            progressWidth.value.style.width = width.value + '%';

            const barInc = setInterval(() => {
                if ( width.value >= 100 || progressBar.value === null ) {
                    clearInterval(barInc)
                } else {
                    width.value++;
                    progressBar.value.setAttribute('value', width.value.toString());
                    progressWidth.value.style.width = width.value + '%';
                }
            }, 25)
        })

        const moveLoading = setInterval(
            () => loadingText.value = ( loadingText.value.includes('...') ) ? 'Cargando..' : 'Cargando...'
        , 350)

        return {
            progressBar,
            progressWidth,
            loadingText
        }
    },
})
</script>


<style scoped>
.loadingContainer {
    text-align: center;
    align-items: center;
    display: flex;
    flex-direction: column;
    margin-top: 15%;

}

.loadingContainer span {
    margin-top: 25px;
    font-weight: bold;
    font-size: 2rem;
    letter-spacing: .07rem;
}
</style>