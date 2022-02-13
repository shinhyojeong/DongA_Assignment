import mapboxgl from 'mapbox-gl'
import { TweenMax, TimelineMax } from 'gsap'
import { ScrollMagicPluginGsap } from 'scrollmagic-plugin-gsap'
import * as ScrollMagic from 'scrollmagic'
import '../assets/scss/stageOfCovid19OutbreakPage.scss'
import { processMarkers, flyToNextStep } from '../utils/handleMapBox'
import {
  MAPBOX_STYLE_URL,
  MAPBOX_KEY,
  MAPBOX_MARK_IMG_URL,
  MAPBOX_DEFAULT_DATA,
  MAPBOX_MARK_DATA_LIST,
} from '../constants/index'

const pageSection = document.querySelector('.page2')
const pageContainer = pageSection.querySelector('.container')
const stepList = pageContainer.querySelectorAll('.txt-box')
const { coordinates, zoom } = MAPBOX_DEFAULT_DATA

mapboxgl.accessToken = MAPBOX_KEY

const covid19StepMap = new mapboxgl.Map({
  container: 'map',
  style: MAPBOX_STYLE_URL,
  center: [coordinates.lng, coordinates.lat],
  zoom,
})

covid19StepMap.scrollZoom.disable()
covid19StepMap.on('load', () => {
  covid19StepMap.loadImage(MAPBOX_MARK_IMG_URL, (error, image) => {
    if (error) throw error
    covid19StepMap.addImage('custom-marker', image)
    covid19StepMap.addSource('points', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: processMarkers(MAPBOX_MARK_DATA_LIST),
      },
    })
    covid19StepMap.addLayer({
      id: 'points',
      type: 'symbol',
      source: 'points',
      layout: {
        'icon-image': 'custom-marker',
      },
    })
  })
})

ScrollMagicPluginGsap(ScrollMagic, TweenMax, TimelineMax)

const stepController = new ScrollMagic.Controller({
  globalSceneOptions: {
    triggerHook: 0,
  },
})

const stepListTL = new TimelineMax()

stepList.forEach((stepItem, idx) => {
  stepListTL.to(stepItem, 20, {
    opacity: 1,
    delay: 1,
    y: '-=100',
    repeatDelay: 20,
    repeat: 1,
    yoyo: true,
    onStart: flyToNextStep,
    onStartParams: [idx, covid19StepMap, MAPBOX_MARK_DATA_LIST],
    onRepeat: flyToNextStep,
    onRepeatParams: [idx, covid19StepMap, MAPBOX_MARK_DATA_LIST],
  })
})

new ScrollMagic.Scene({
  triggerElement: '.page2',
  duration: '2500',
  triggerHook: 0.2,
})
  .setTween(stepListTL)
  .setPin(pageSection)
  .addTo(stepController)
