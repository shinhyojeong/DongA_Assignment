export const processMarkers = (markers) =>
  markers.map((marker) => {
    const { coordinates } = marker

    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [coordinates.lng, coordinates.lat],
      },
    }
  })

export const flyToNextStep = (idx, map, mapMarkDataList) => {
  const { coordinates, zoom } = mapMarkDataList[idx]

  map.flyTo({
    center: [coordinates.lng, coordinates.lat],
    zoom,
    essential: true,
  })
}
