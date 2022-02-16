import { gsap } from 'gsap/all'
import '../assets/scss/covid19PreventPage.scss'

const pageSection = document.querySelector('.page5')
const txtBoxList = pageSection.querySelectorAll(
  '.container .txt-container .txt-box'
)
gsap.to(pageSection, {
  x: () => -(pageSection.scrollWidth - document.documentElement.clientWidth),
  scrollTrigger: {
    start: 'top top',
    trigger: pageSection,
    invalidateOnRefresh: true,
    pin: true,
    scrub: 1,
    anticipatePin: 1,
    end: () => `+=${pageSection.offsetWidth}`,
  },
})
