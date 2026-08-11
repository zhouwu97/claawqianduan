<template>
  <div>
    <div class="time">{{ timeShort }}</div>
    <div class="date">{{ formattedDateShort }}</div>
    <div class="status-line"><span>当前状态</span><strong>{{ status }}</strong></div>
    <div class="mini-quote">“{{ quote }}”</div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  props: ['formattedTime', 'formattedDateShort', 'status', 'quote'],
  setup(props) {
    const timeShort = computed(() => {
      const parts = (props.formattedTime || '').split(' : ')
      return parts.length >= 2 ? `${parts[0]}:${parts[1]}` : props.formattedTime
    })
    return { timeShort }
  }
}
</script>
