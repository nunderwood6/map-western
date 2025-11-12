let d3 = require("d3");
let maplibregl = require("maplibre-gl");
let debounce = require("./lib/debounce");
const scrollama = require("scrollama");
// instantiate scrollama
const scroller = scrollama();
let sticky = d3.select("div.sticky");

// currentZoom zoom
let currentZoom;
let currentBase;

// generic window resize listener event
function handleResize() {
  console.log("resize!")
  // // 1. update height of step elements
  // var stepH = Math.floor(window.innerHeight * 0.75);
  // step.style("height", stepH + "px");

  var figureHeight = window.innerHeight;
  // var figureMarginTop = (window.innerHeight - figureHeight) / 2;

  sticky.style("height", figureHeight + "px")
    // .style("top", figureMarginTop + "px");

  // 3. tell scrollama to update new element dimensions
  scroller.resize();
}

function init(){

  // 1. force a resize on load to ensure proper dimensions are sent to scrollama
  handleResize();

  // 2. setup the scroller passing options
      //    this will also initialize trigger observations
      // 3. bind scrollama event handlers (this can be chained like below)
  // setup scroller
  scroller
    .setup({
      step: ".scrolly .steps .step",
      offset: 0.8
    })
    .onStepEnter((response) => {
          // { element, index, direction }
          let i = response.direction == "down" ? response.index : response.index - 1;
          handleZoom(i);
          handleVisibility(i);
    })
    .onStepExit((response) => {
          // { element, index, direction }
          let i = response.direction == "down" ? response.index : response.index - 1;
          handleZoom(i);
          handleVisibility(i);

          
    });
}

// kick things off
init();

// setup map
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

const lightBase = {
          coords: [
            [-121.9707503187089230,40.1101212998359600],
            [-119.3316898341525132,40.1101212998359600],
            [-119.3316898341525132,37.9643184340571409],
            [-121.9707503187089230, 37.9643184340571409],
          ],
          url: `assets/synced/light-simple.jpg`,
};

// const lightBase = {
//           coords: [
//             [-121.9707503187089230,40.1101212998359600],
//             [-119.3316898341525132,40.1101212998359600],
//             [-119.3316898341525132,37.9643184340571409],
//             [-121.9707503187089230, 37.9643184340571409],
//           ],
//           url: `assets/synced/toned-shaded.jpg`,
// };

currentBase = lightBase.url;

const imagery = {url: "assets/synced/toned-shaded.jpg"};


// starting zoom wider
const wider = [[
              -121.3487305998364633,38.5189233389010539
            ],
            [
              -119.9105278119377118,39.5056242589138549
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

// high country
// -120.54512216443146,
  // 39.26851930961655
// -120.20103394550685,
   // 39.09537394309365
const highCountry = [[
              -120.54512216443146,39.26851930961655
            ],
            [
              -120.20103394550685,39.09537394309365
            ]
];

// start with wider view
currentZoom=wider;
            

let map = new maplibregl.Map({
  container: 'map',
  style,
  bounds: [currentZoom[0],currentZoom[1]],
  interactive: false,
  maplibreLogo: false,
  attributionControl: false
});

// on map load
map.on("load", () => {

  // add image
  map.addSource("base", {
            type: "image",
            url: lightBase.url,
            coordinates: lightBase.coords,
  });

  map.addLayer(
  {
    id: "western-base",
    type: "raster",
    source: "base",
    paint: {
      "raster-fade-duration": 1000
    }
  });

  // add course
  let courseCoords;

  d3.json("assets/course-simple.geojson")
    .then(function(data){
   
    // save full coordinate list
    courseCoords = data.features[0].geometry.coordinates;
    // start by just showing first coordinate
    data.features[0].geometry.coordinates = [courseCoords[0]];

    // add to map
    map.addSource("course", {type: "geojson", data});
    map.addLayer({
      "id": "courseLayer",
      "type": "line",
      "source": "course",
      "paint": {
        "line-color": "#ab1818",
        "line-opacity": 0.85,
        "line-width": 1.5
      }
    });

    // map.jumpTo({'center': courseCoords[0], 'zoom': 11});

    // on a regular basis, add more coordinates from the saved list and update the map
    let i = 0;
    const timer = window.setInterval(() => {
        if (i < courseCoords.length) {

            data.features[0].geometry.coordinates.push(
                courseCoords[i]
            );
            
            map.getSource('course').setData(data);
            // map.panTo(courseCoords[i]);
            i++;
        } else {
            window.clearInterval(timer);
        }
    }, 5);


  }).catch(function(err){
    console.log(err);
  });

});

// after map load
function mapResize(){
  // readjust to currentZoom bounds
  map.fitBounds([currentZoom[0],currentZoom[1]],{"duration": 1500});
  // map.flyTo([currentZoom[0],currentZoom[1]],{"duration": 2000});

};

// setup resize listeners
window.addEventListener("resize", debounce(handleResize,100));
map.on("resize", debounce(mapResize,100));

function handleZoom(index){
    // store previous
    let previous = currentZoom;

    if(index<3) currentZoom = wider;
    if (index==3) currentZoom = highCountry;

    // check if currentZoom = previous, zoom if so
   if (currentZoom!=previous) mapResize();


}

function handleVisibility(index){

  // update basemap
  let previousBase = currentBase;

  if(index<3) currentBase = lightBase.url;
  if (index==3) currentBase = imagery.url;

  if (currentBase!=previousBase) {
      const source = map.getSource("base");
      source.updateImage({
        url: currentBase,
        coordinates: lightBase.coords,
      });
      source.updateImage(currentBase);
  }
 

}



