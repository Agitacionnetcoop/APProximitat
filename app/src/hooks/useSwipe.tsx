export function useSwipe(onSwipeLeft?: () => void, onSwipeRight?: () => void) {
  // when touch ends check for swipe directions
  function onTouchEnd(e: any) {
    // get touch velocity
    const positionX = e.nativeEvent.velocity.x

    // check if position is growing positively
    if (positionX > 0) {
      if (onSwipeRight) {
        onSwipeRight()
      }
    }
    // check if position is growing negatively
    else if (positionX < 0) {
      if (onSwipeLeft) {
        onSwipeLeft()
      }
    }
  }

  return { onTouchEnd }
}
