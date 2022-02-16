import Globe from 'globe.gl'
import { scaleSequentialSqrt, interpolateYlOrRd } from 'd3'
import '../assets/scss/covid19WorldGlobePage.scss'
import { Vector3 } from 'three'

const pageSection = document.querySelector('.page3')
const globeBox = pageSection.querySelector('.container .globe-box')

const createGlobe = async () => {
  const colorScale = scaleSequentialSqrt(interpolateYlOrRd)

  const getVal = (feat) => feat.properties.total_case_per_1M || 0

  fetch('./data/covid_total_case_world_map.geojson')
    .then((res) => res.json())
    .then((countries) => {
      const maxVal = Math.max(...countries.features.map(getVal))
      colorScale.domain([0, maxVal])

      const world = Globe()
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
        .lineHoverPrecision(0)
        .polygonsData(
          countries.features.filter((d) => d.properties.ISO_A2 !== 'AQ')
        )
        .polygonAltitude(0.06)
        .polygonCapColor((feat) => colorScale(getVal(feat)))
        .polygonSideColor(() => 'rgba(0, 100, 0, 0.15)')
        .polygonStrokeColor(() => '#111')
        .polygonLabel(({ properties }) => {
          const { admin, iso_a2, total_case_per_1M } = properties

          return `
            <b>${admin} (${iso_a2}):</b> <br />
            TOTAL CASE(M)': <i>${total_case_per_1M || 'No data'}</i><br/>
          `
        })
        .onPolygonHover((hoverD) =>
          world
            .polygonAltitude((d) => (d === hoverD ? 0.12 : 0.06))
            .polygonCapColor((d) =>
              d === hoverD ? 'yellowgreen' : colorScale(getVal(d))
            )
        )
        .polygonsTransitionDuration(300)(globeBox)

      world.controls().enableZoom = false
      world.controls().minDistance = 500
    })
}

createGlobe()
