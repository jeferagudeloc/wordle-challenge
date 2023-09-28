<template>
  <div>
    <h4 style="text-align: center;">WORDLE</h4>
    <Box></Box>

  </div>
</template>

<script lang="ts">

import { defineComponent } from "vue";
import Box from "./components/worlde/box.vue"

export default defineComponent({
  components: {
    Box
  }
})

</script>