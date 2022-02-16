import * as d3 from 'd3'
import '../assets/scss/covid19OutBreakStatus.scss'
import { START_DATE, LAST_DATE } from '../constants/index'

async function makeCovidStatusChart() {
  const margin = { top: 20, right: 20, bottom: 30, left: 50 }
  const widthMargin = margin.left + margin.right
  const heightMargin = margin.top + margin.bottom
  const width = 780 - widthMargin
  const height = 500 - heightMargin
  const startDate = new Date(START_DATE)
  const lastDate = new Date(LAST_DATE)
  const pointColor = 'rgb(67, 128, 97)'

  const xSize = d3.scaleTime().range([0, width])
  const ySize = d3.scaleLinear().range([height, 0])

  const valueLine = d3
    .line()
    .x((d) => xSize(d.date))
    .y((d) => ySize(d.total))

  const valueArea = d3
    .area()
    .x((d) => xSize(d.date))
    .y0(height)
    .y1((d) => ySize(d.total))

  const svg = d3
    .select('.page4 .graph-box')
    .append('svg')
    .attr('width', width + widthMargin + 100)
    .attr('height', height + heightMargin)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  const rawData = await d3.csv('./data/covid_outbreak_status_chart.csv')
  const data = rawData
    .map((d) => {
      d.date = new Date(d.date)
      d.total = parseFloat(d.total) || 0

      return d
    })
    .filter((d) => d.date >= startDate && d.date <= lastDate)

  xSize.domain(d3.extent(data, (d) => d.date))
  ySize.domain([0, d3.max(data, (d) => d.total)])

  svg.append('path').attr('class', 'value-area').attr('d', valueArea(data))

  svg
    .append('g')
    .append('path')
    .attr('class', 'value-line')
    .attr('d', valueLine(data))

  svg
    .append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(xSize))
  svg.append('g').call(d3.axisLeft(ySize))

  const focus = svg.append('g').style('display', 'none')

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
    .attr('x', 10)
    .attr('y', -22)
    .attr('rx', 4)
    .attr('ry', 4)
  focus.append('text').attr('class', 'tooltip-date').attr('x', 18).attr('y', -2)
  focus.append('text').attr('x', 18).attr('y', 18).text('Total :')
  focus
    .append('text')
    .attr('class', 'tooltip-total')
    .attr('x', 60)
    .attr('y', 18)

  const handleMousemove = () => {
    const pointerX = xSize.invert(d3.pointer(event, this)[0])
    const bisectDate = d3.bisector((d) => d.date).left
    const pointerIdx = bisectDate(data, pointerX, 1)
    const frontD = data[pointerIdx - 1]
    const backD = data[pointerIdx]
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
    .style('fill', 'none')
    .style('pointer-events', 'all')
    .on('mouseover', function () {
      focus.style('display', null)
    })
    .on('mouseout', function () {
      focus.style('display', 'none')
    })
    .on('mousemove', handleMousemove)
}

makeCovidStatusChart()
