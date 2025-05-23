// var d3 = require("d3");

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
// -121.9707503187089230,40.1101212998359600
// -119.3316898341525132,37.9643184340571409


const westernFull = {
          coords: [
            [-121.9707503187089230,40.1101212998359600],
            [-119.3316898341525132,40.1101212998359600],
            [-119.3316898341525132,37.9643184340571409],
            [-121.9707503187089230, 37.9643184340571409],
          ],
          url: `assets/synced/toned-shaded.jpg`,
};

// starting zoom wider
const wider = [[
              -121.4987305998364633,38.5189233389010539
            ],
            [
              -119.6605278119377118,39.5056242589138549
            ]
];


// course extent
const course = [[
              -121.0678000000000054,38.8924099999999981
            ],
            [
              -120.2364699999999971,39.2238400000000027
            ]
];
            

let map = new maplibregl.Map({
  container: 'map',
  style,
  bounds: [wider[0],wider[1]],
  interactive: false,
  maplibreLogo: false,
  attributionControl: false
});

map.on("load", () => {
  // add image
  map.addSource("western", {
            type: "image",
            url: westernFull.url,
            coordinates: westernFull.coords,
  });
  map.addLayer(
  {
    id: "western-base",
    type: "raster",
    source: "western",
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