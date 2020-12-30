const USGS_TOPO = "https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}";
const OSM = "http://a.tile.openstreetmap.org/{z}/{x}/{y}.png";
const EARTHQUAKE_10_20_URL = "https://earthquake.usgs.gov/fdsnws/event/1/query.geojson?starttime=2010-01-01%2000:00:00&endtime=2020-01-01%2000:00:00&maxlatitude=50&minlatitude=24.6&maxlongitude=-65&minlongitude=-125&minmagnitude=3&orderby=time";
const EARTHQUAKE_00_20_URL = "https://earthquake.usgs.gov/fdsnws/event/1/query.geojson?starttime=2000-01-01%2000:00:00&endtime=2020-01-01%2000:00:00&maxlatitude=50&minlatitude=24.6&maxlongitude=-65&minlongitude=-125&minmagnitude=3&orderby=time";

const earthquakeMapOne = L.map("eq-map-1").setView([37.8, -96], 5);
L.tileLayer(USGS_TOPO, {
    tileSize: 512,
    zoomOffset: -1
}).addTo(earthquakeMapOne);

const popupTemplate = "<span>Location: {place}</span><br><span>Magnitude: {mag}</span>" +
    "<br><span>Felt: {felt}</span><br><span>Details: <a href='{detail}'>{detail}</a></span>";

$.ajax({
    type: "GET",
    url: EARTHQUAKE_10_20_URL,
    dataType: "json",
    success: (response) => {
        L.geoJSON(response, {
            pointToLayer: (feature, latlng) => {
                return L.circleMarker(latlng, getEarthquakeOneStyle(feature))
            },
            filter: earthquakeFilter
        }).addTo(earthquakeMapOne).bindPopup(
            e => {
                return L.Util.template(popupTemplate, e.feature.properties);
            }
        );
    }
});

const earthquakeMagLegend = L.control({position: "bottomright"});
earthquakeMagLegend.onAdd = (map) => {
    let div = L.DomUtil.create("div", "earthquake-mag-legend");
    for (let i = 4; i >= 0; i--) {
        if (i === 4) {
            div.innerHTML += `<i style='width: ${(i + 1) * 16}px; height: ${(i + 1) * 16}px; 
                float: left; border-radius: 50%;background-color: #ffcdd2;border-width: 1px;border-style: solid;
                border-color: #f44336;'></i>`;
        } else {
            div.innerHTML += `<i style='width: ${(i + 1) * 16}px; height: ${(i + 1) * 16}px; 
                float: left; border-radius: 50%;background-color: #ffcdd2;border-width: 1px;border-style: solid;
                border-color: #f44336; margin-top: ${64 - 16 * i}px;margin-left:${- 48 - 8 * i}px'>
                </i>`;
        }
    }
    return div;
};
earthquakeMagLegend.addTo(earthquakeMapOne);

function getEarthquakeOneStyle(feature) {
    return {
        radius: getRadiusByMag(feature),
        color: "#f44336",
        fillColor: "#d32f2f",
        opacity: 0.8,
        weight: 0.5
    }
}

function earthquakeFilter(feature) {
    const eqType = feature.properties.type;
    if (eqType === "earthquake") {
        return true;
    } else {
        return false;
    }
}

function getColorByDepth(feature) {
    let depth = 0;
    $.ajax({
        url: feature.properties.detail,
        type: "GET",
        dataType: "json",
        success: (response) => {
            depth = response.properties.products.dyfi.properties.depth;
        }
    });
    if (depth >= 3.0 && depth < 3.5) {
        return "#b71c1c"
    } else if (depth >= 3.5 && depth < 4.0) {
        return "#EC8E77";
    } else if (depth >= 4.0 && depth < 4.5) {
        return "#F9D1BF";
    } else if (depth >= 4.5 && depth < 5.0) {
        return "#EADCD4";
    } else if (depth >= 5.0 && depth < 5.5) {
        return "#C9D9F6";
    } else if (depth >= 5.5 && depth < 6.0) {
        return "#B3CCFF";
    } else if (depth >= 6.0 && depth < 7.0) {
        return "#8AA7F7";
    } else if (depth >= 7.0) {
        return "#7287DE";
    }
}

function getRadiusByMag(feature) {
    const mag = feature.properties.mag;
    let radius = 0;
    if (mag >= 3.0 && mag < 4.0) {
        radius = 8;
    } else if (mag >= 4.0 && mag < 5.0) {
        radius = 16;
    } else if (mag >= 5.0 && mag < 6.0) {
        radius = 24;
    } else if (mag >= 6.0 && mag < 7.0) {
        radius = 32;
    } else if (mag >= 7.0) {
        radius = 40;
    }
    return radius;
}

const earthquakeMapTwo = L.map("eq-map-2").setView([37.8, -96], 5);
L.tileLayer(USGS_TOPO, {
    tileSize: 512,
    zoomOffset: -1
}).addTo(earthquakeMapTwo);

$.ajax({
    type: "GET",
    url: EARTHQUAKE_00_20_URL,
    dataType: "json",
    success: (response) => {
        const earthquakePoints = response.features.map(feature => {
            const lng = feature.geometry.coordinates[1];
            const lat = feature.geometry.coordinates[0];
            return [lng, lat];
        });
        L.heatLayer(earthquakePoints, {
            radius: 50,
            max: 0.6
        }).addTo(earthquakeMapTwo);
    }
});

const earthquakeMapThree = L.map("eq-map-3").setView([37.8, -96], 5);
L.tileLayer(USGS_TOPO, {
    tileSize: 512,
    zoomOffset: -1
}).addTo(earthquakeMapThree);
L.geoJSON(statesData, {style: populationStyle}).addTo(earthquakeMapThree);

$.ajax({
    type: "GET",
    url: EARTHQUAKE_10_20_URL,
    dataType: "json",
    success: (response) => {
        L.geoJSON(response, {
            pointToLayer: (feature, latlng) => {
                return L.circleMarker(latlng, getEarthquakeThreeStyle(feature))
            },
            filter: earthquakeFilter
        }).addTo(earthquakeMapThree).bindPopup(
            e => {
                return L.Util.template(popupTemplate, e.feature.properties);
            }
        );
    }
});

function populationStyle(feature) {
    return {
        fillColor: getColorByDensity(feature.properties.density),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function getColorByDensity(d) {
    return d > 1000 ? '#800026' :
        d > 500  ? '#BD0026' :
            d > 200  ? '#E31A1C' :
                d > 100  ? '#FC4E2A' :
                    d > 50   ? '#FC9C7D' :
                        d > 20   ? '#FCC5AE' :
                            d > 10   ? '#FEE5DA' :
                                '#FEF1EA';
}

function getEarthquakeThreeStyle(feature) {
    return {
        radius: 5,
        color: "#B8B9D9",
        fillColor: "#21058F",
        opacity: 0.8,
        weight: 0.5
    }
}

const earthquakeMapFour = L.map("eq-map-4").setView([37.8, -96], 5);

const markers = L.markerClusterGroup();
L.tileLayer(USGS_TOPO, {
    tileSize: 512,
    zoomOffset: -1
}).addTo(earthquakeMapFour);

$.ajax({
    type: "GET",
    url: EARTHQUAKE_10_20_URL,
    dataType: "json",
    success: (response) => {
        const earthquakes = L.geoJSON(response, {
            pointToLayer: (feature, latlng) => {
                return L.circleMarker(latlng, getEarthquakeOneStyle(feature))
            },
            filter: earthquakeFilter
        });
        markers.addLayer(earthquakes).addTo(earthquakeMapFour);
    }
});