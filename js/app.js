const DECISION_THRESHOLD = 75

let isAnimating = false
let pullDeltaX = 0 // distance from the card being dragged

function startDrag(event) {
  if (isAnimating) return

  // get the first article element
  const currentCard = event.target.closest('article')
  if (!currentCard) return

  // get initial position of mouse or finger
  const startX = event.pageX ?? event.touches[0].pageX

  // listen the mouse and touch movements
  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onEnd)

  document.addEventListener('touchmove', onMove, { passive: true })
  document.addEventListener('touchend', onEnd, { passive: true })

  function onMove(event) {
    // current position of mouse or finger
    const currentX = event.pageX ?? event.touches[0].pageX

    // the distance between the initial and current position
    pullDeltaX = currentX - startX

    // there is no distance traveled in X axis
    if (pullDeltaX === 0) return

    // change the flag to indicate we are animating
    isAnimating = true

    // calculate the rotation of the card using the distance
    const deg = pullDeltaX / 14

    // apply the transformation to the card
    currentCard.style.transform = `translateX(${pullDeltaX}px) rotate(${deg}deg)`

    // change the cursor to grabbing
    currentCard.style.cursor = 'grabbing'

    // change opacity of the choice info
    const opacity = Math.abs(pullDeltaX) / 100
    const isRight = pullDeltaX > 0

    const choiceEl = isRight
      ? currentCard.querySelector('.choice.like')
      : currentCard.querySelector('.choice.nope')

    choiceEl.style.opacity = opacity
  }

  function onEnd() {
    // remove the event listeners
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onEnd)

    document.removeEventListener('touchmove', onMove)
    document.removeEventListener('touchend', onEnd)

    // saber si el usuario tomo una decisión
    const decisionMade = Math.abs(pullDeltaX) >= DECISION_THRESHOLD

    if (decisionMade) {
      const goRight = pullDeltaX >= 0

      // add class according to the decision
      currentCard.classList.add(goRight ? 'go-right' : 'go-left')
      currentCard.addEventListener('transitionend', () => {
        currentCard.remove()
      })
    } else {
      currentCard.classList.add('reset')
      currentCard.classList.remove('go-right', 'go-left')

      currentCard.querySelectorAll('.choice').forEach(choice => {
        choice.style.opacity = 0
      })
    }

    // reset the variables
    currentCard.addEventListener('transitionend', () => {
      currentCard.removeAttribute('style')
      currentCard.classList.remove('reset')

      pullDeltaX = 0
      isAnimating = false
    })

    // reset the choice info opacity
    currentCard
      .querySelectorAll(".choice")
      .forEach((el) => (el.style.opacity = 0));
  }
}

document.addEventListener('mousedown', startDrag)
document.addEventListener('touchstart', startDrag, { passive: true })