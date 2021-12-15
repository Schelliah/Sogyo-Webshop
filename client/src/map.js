
console.log("start")
var map = L.map('discoverablemap').setView([52.1026406, 5.175044799999999], 10);

var stamen = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 18,
	ext: 'png'
});

stamen.addTo(map);
console.log("map is set up")

function setMarker(attraction){
    let popinfo ="<h1>"+attraction.name + "</h1>" + "<p>" + attraction.description + "</p>";
    let marker = L.marker([attraction.latitude, attraction.longitude]).addTo(map).bindPopup(popinfo);

}

async function setUpAttractions(){
    let attractions = await getAttractionsFromServer();
    attractions.forEach(attraction => setMarker(attraction))
}

setUpAttractions()