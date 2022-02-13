import { gsap, TextPlugin, ScrollTrigger } from 'gsap/all'
import { COVID19 } from '../constants/index'

const pageContainer = document.querySelector('.page1 .container')
const txtBox = pageContainer.querySelector('.txt-box')
const titleEl = txtBox.querySelector('.title')
const typingCursor = txtBox.querySelector('.typing-cursor')
const icnBox = pageContainer.querySelector('.icn-box')
const titleContent = COVID19.MAIN_TITLE
const titleTypingDuration = 4
const typingCursorDuration = 0.4

gsap.registerPlugin(TextPlugin, ScrollTrigger)

const pageTL = gsap.timeline()

pageTL.to(titleEl, {
  text: titleContent,
  ease: 'none',
  duration: titleTypingDuration,
})

const iconBoxAnimation = pageTL.from(icnBox, 1, {
  opacity: 0,
  ease: 'Power0.easeNone',
  repeat: -1,
  yoyo: true,
})

gsap
  .to(typingCursor, typingCursorDuration, {
    opacity: 0,
    ease: 'Power0.easeNone',
  })
  .repeat(titleTypingDuration / typingCursorDuration + 2)
  .yoyo(true)

ScrollTrigger.create({
  trigger: icnBox,
  onEnter: () => iconBoxAnimation.play(),
  onLeave: () => iconBoxAnimation.pause(),
  onEnterBack: () => iconBoxAnimation.play(),
})
