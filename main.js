import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import Vector from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import Style from 'ol/style/Style';
import Text from 'ol/style/Text';
import Stroke from 'ol/style/Stroke';
import * as olProj from 'ol/proj';
import Circle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import OSM from 'ol/source/OSM';
import XYZ from 'ol/source/XYZ';



const contr = document.getElementById('control')

const map = new Map({
    target: 'map',
    view: new View({
        center: olProj.fromLonLat([15.756522, 48.258624]),
        zoom: 8.7
    })
});
// map.addLayer(new TileLayer({
//     source: new Stamen({
//         layers: 'watercolor'
//     })
// }))
// ;

const layer1 = new VectorLayer({
    source: new Vector({
        url: 'data/testmeldungen.json',
        format: new GeoJSON()
    })
});
layer1.setStyle(function (feature) {
    return new Style({
        text: new Text({
            text: feature.get('name'),
            font: 'Bold 8pt Verdana',
            stroke: new Stroke({
                color: 'white',
                width: 3
            })
        })
    });
});

const layer2 = new VectorLayer({
    source: new Vector({ 
        url: 'data/grenzennoe.json',
        format: new GeoJSON()
    })
});


const layer3 = new VectorLayer({
    source: new Vector({
        url: 'data/testmeldungen.json',
        format: new GeoJSON()
    })
});

// Satelliten-Layer einrichten
const satLayer = new TileLayer({
    source: new XYZ({
    attributions: ['Powered by Esri', 'Source: Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community'],
    attributionsCollapsible: false,
    url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    maxZoom: 30
  })
});

const baseLayer = new TileLayer({
  source: new OSM()
});

//Base Layer von OSM hinzufügen
map.addLayer(baseLayer);
map.addLayer(layer2);
map.addLayer(layer3);
map.addLayer(layer1);

// Get the base Sat-Button
const sat = document.getElementById('sat');
sat.addEventListener('click', function(event) {
  contr.style.color = 'ffffff';
  //Anderen Layer entfernen
  map.removeLayer(baseLayer);
  map.removeLayer(layer2);
  map.removeLayer(layer3);
  map.removeLayer(layer1);
  //Satelliten Layer hinzufügen
  map.addLayer(satLayer);
  map.addLayer(layer2);
  map.addLayer(layer3);
  map.addLayer(layer1);
});

// Get the base Base-Button
const base = document.getElementById('base');
base.addEventListener('click', function(event) {
  //Anderen Layer entfernen
  map.removeLayer(satLayer);
  map.removeLayer(layer2);
  map.removeLayer(layer3);
  map.removeLayer(layer1);
  //Satelliten Layer hinzufügen
  map.addLayer(baseLayer);
  map.addLayer(layer2);
  map.addLayer(layer3);
  map.addLayer(layer1);
  
});

const searchResultSource = new Vector();
const searchResultLayer = new VectorLayer({
  source: searchResultSource
});

searchResultLayer.setStyle(new Style({
  image: new Circle({
    fill: new Fill({
      color: 'rgba(255,255,255,0.4)'
    }),
    stroke: new Stroke({
      color: '#3399CC',
      width: 1.25
    }),
    radius: 15
  })
}));
map.addLayer(searchResultLayer);

var element = document.getElementById('search');  
element.addEventListener('keydown', listenerFunction);

function listenerFunction(event) {
  console.log(event);
  console.log(event.keyCode);
  if (event.keyCode === 13) {
    
    const xhr = new XMLHttpRequest;
    xhr.open('GET', 'https://photon.komoot.de/api/?q=' + element.value);
    xhr.onload = function() {
      const json = JSON.parse(xhr.responseText);
      const geoJsonReader = new GeoJSON({
        featureProjection: 'EPSG:3857'
      });  
      searchResultSource.clear(); 
      const features = geoJsonReader.readFeatures(json);
      console.log(features);
      searchResultSource.addFeatures(features);
    };
    xhr.send();


  }
}