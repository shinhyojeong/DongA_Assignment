import * as d3 from 'd3'
import '../assets/scss/covid19OutBreakStatus.scss'
import { START_DATE, LAST_DATE } from '../constants/index'

async function makeCovidStatusChart() {
  const heightValue = 300
  const widthValue = 600
  const strokeWidth = 1.5
  const margin = { top: 0, bottom: 20, left: 30, right: 20 }
  const width = 600 - margin.left - margin.right - strokeWidth * 2
  const height = 300 - margin.top - margin.bottom
  const startDate = new Date(START_DATE)
  const lastDate = new Date(LAST_DATE)
  const pointColor = 'rgb(67, 128, 97)'

  const rawData = await d3.csv('./data/covid_outbreak_status_chart.csv')
  const data = rawData
    .map((d) => {
      d.date = new Date(d.date)
      d.total = parseFloat(d.total) || 0

      return d
    })
    .filter((d) => d.date >= startDate && d.date <= lastDate)

  const svg = d3
    .select('.page4 .container .graph-container .graph-box')
    .append('svg')
    .attr('viewBox', `0 0 ${widthValue} ${heightValue}`)

  const chart = svg.append('g').attr('transform', `translate(${margin.left},0)`)

  const graph = chart
    .append('g')
    .attr(
      'transform',
      `translate(-${margin.left - strokeWidth},-${margin.top})`
    )

  const xSize = d3
    .scaleTime()
    .range([0, width - 100])
    .domain(d3.extent(data, (d) => d.date))

  const ySize = d3
    .scaleLinear()
    .range([height, 0])
    .domain([0, d3.max(data, (d) => d.total)])

  const valueArea = d3
    .area()
    .x((d) => xSize(d.date))
    .y0(height)
    .y1((d) => ySize(d.total))

  graph
    .append('path')
    .attr('transform', `translate(${margin.left},0)`)
    .style('fill', pointColor)
    .attr('stroke', 'steelblue')
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', strokeWidth)
    .attr('d', valueArea(data))

  chart
    .append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(xSize).ticks(8))

  chart
    .append('g')
    .attr('transform', `translate(0, 0)`)
    .call(d3.axisLeft(ySize))

  const focus = chart.append('g').style('display', 'none')

  focus
    .append('circle')
    .attr('class', 'hover-circle')
    .style('fill', pointColor)
    .style('stroke', pointColor)
    .attr('r', 4)

  focus
    .append('rect')
    .attr('class', 'tooltip')
    .attr('width', 100)
    .attr('height', 50)
    .attr('y', -5)
    .attr('rx', 4)
    .attr('ry', 4)
    .attr('fill', 'white')

  focus.append('text').attr('class', 'tooltip-date').attr('x', 3).attr('y', 15)
  focus.append('text').attr('x', 3).attr('y', 35).text('Total :')
  focus
    .append('text')
    .attr('class', 'tooltip-total')
    .attr('x', 50)
    .attr('y', 35)

  const handleMousemove = () => {
    const pointerX = xSize.invert(d3.pointer(event, this)[0])
    const bisectDate = d3.bisector((d) => d.date).left
    const pointerIdx = bisectDate(data, pointerX, 1)
    const frontD = data[pointerIdx - 1]
    const backD = data[pointerIdx]
    if (!backD) {
      return
    }

    const currentD =
      pointerX - frontD.date > backD.date - pointerX ? backD : frontD
    const dateFormatter = d3.timeFormat('%y/%m/%d')
    const formatValue = d3.format(',')

    focus.attr(
      'transform',
      `translate(${xSize(currentD.date)},${ySize(currentD.total)})`
    )
    focus.select('.tooltip-date').text(dateFormatter(currentD.date))
    focus.select('.tooltip-total').text(formatValue(currentD.total))
  }

  svg
    .append('rect')
    .attr('width', width)
    .attr('height', height)
    .attr('transform', `translate(${margin.left},0)`)
    .attr('class', 'focus')
    .style('fill', 'none')
    .style('pointer-events', 'all')
    .on('mouseover', () => focus.style('display', null))
    .on('mouseout', () => focus.style('display', 'none'))
    .on('mousemove', handleMousemove)
}

makeCovidStatusChart()
