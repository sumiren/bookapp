// ナビゲーションの表示・非表示を制御する

import type { Ref } from 'vue'

export const useNavigation = () => {
  const isNavigationShown = useState('isNavigationShown', () => true)
  const switchNavigationDisplay = (isNavigationShown: Ref<boolean>) => () => {
    isNavigationShown.value = !isNavigationShown.value
  }

  return {
    isNavigationShown: isNavigationShown,
    switchNavigationDisplay: switchNavigationDisplay(isNavigationShown)
  }
}
