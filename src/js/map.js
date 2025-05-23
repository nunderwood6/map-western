// var d3 = require("d3");
console.log("hi");

let maplibregl = require("maplibre-gl");

const style = {
            version: 8,
            glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
            projection: {
                      type: "mercator",
            },
            sources: {
              maplibre: {
                url: "https://demotiles.maplibre.org/tiles/tiles.json",
                type: "vector",
              },
            },
            layers: [
              {
                id: "background",
                type: "background",
                paint: {
                  "background-color": "#fff",
                },
              }]
};

// geographic coords top left -> counter clockwise
// -73.4310300635716828,44.4950662663119232
// -73.0704385089753572,45.0095067940014886
const icemap = {
          coords: [
            [-73.4310300635716828, 45.0095067940014886],
            [-73.0704385089753572, 45.0095067940014886],
            [-73.0704385089753572, 44.4950662663119232],
            [-73.4310300635716828, 44.4950662663119232],
          ],
          url: `assets/ice-map.jpg`,
};

const malletsBay = [[
              -73.30427451179548,
              44.60639559890427
            ],
            [
              -73.17715588086575,
              44.73659897006388
            ]
  ];
            

let map = new maplibregl.Map({
  container: 'map',
  style,
  bounds: [malletsBay[0],malletsBay[1]],
  interactive: false,
  maplibreLogo: false,
  attributionControl: false
});

map.on("load", () => {
  // add image
  map.addSource("icemap", {
            type: "image",
            url: icemap.url,
            coordinates: icemap.coords,
  });
  map.addLayer(
  {
    id: "ice-map",
    type: "raster",
    source: "icemap",
    paint: {
      "raster-fade-duration": 1000
    }
  });





});

// map.addSource("sat", {
// 	type: "image",
// 	url: "../assets/inland-sea-01-24-25-80.jpg",
// 	coordinates: [
// 		]
// })


// map.addSource('radar', {
//             type: 'image',
//             url: getPath(),
//             coordinates: [
//                 [-80.425, 46.437],
//                 [-71.516, 46.437],
//                 [-71.516, 37.936],
//                 [-80.425, 37.936]
//             ]
//         });
//         map.addLayer({
//             id: 'radar-layer',
//             'type': 'raster',
//             'source': 'radar',
//             'paint': {
//                 'raster-fade-duration': 0
//             }
//         });