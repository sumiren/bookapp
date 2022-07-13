import { useDisplay } from 'vuetify'
import type { Ref } from 'vue'

export const useBreakpoint = () => {
  const isMobile: Ref = useState('isMobile', () => false)

  onMounted(() => {
    const { smAndDown } = useDisplay()
    isMobile.value = computed(() => smAndDown.value)
  })

  return {
    isMobile: readonly(isMobile)
  }
}
