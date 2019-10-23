//var urlalku = "https://rata.digitraffic.fi/api/v1";
//var urlloppu = "/live-trains/station/HKI/TPE";

//määritellään ajan esitysmuoto
var nyt = new Date();

Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}

Date.prototype.addDate = function (d) {
    this.setDate(this.getDate() + (d));
    return this;
}

//nyt.addHours(3);
//$("#lahtoaika").val(nyt.toISOString().slice(0, -8));
//console.log(nyt.toISOString().slice(0, -5));
//nyt.addHours(3);
//$("#saapumisaika").val(nyt.toISOString().slice(0, -8));

var optiot = { hour: '2-digit', minute: '2-digit', hour12: false };


//haetaan junan saapumisaika asemalle
function getSaapumisaika(timeTableRows, asema) {
    var sr=timeTableRows.find(function (tr) {
        return tr.stationShortCode == asema;
    });
    console.dir(sr);
    return sr.scheduledTime;
}



//järjestää haetun datan:
function haettu(data) {
    console.dir(data);
    tallenna(data);
    let rivit = "";
    var otsikko = "<table><th>Lähtöaika</th><th>Saapumisaika</th><th>Junan tiedot</th></table>";

    for (let juna of data) {

        var lahtoaika = new Date(juna.timeTableRows[0].scheduledTime).toLocaleTimeString("fi", optiot);
        var saapumisaika = new Date(getSaapumisaika(juna.timeTableRows, "TPE")).toLocaleTimeString("fi", optiot);
   
        rivit += `<table><tr><td>${lahtoaika}</td><td>${saapumisaika}</td><td>${juna.trainType + juna.trainNumber}</td></tr></table>`;
    }
    document.getElementById("tiedot").innerHTML = otsikko + rivit;
    
}

//hakee datan:
function haedata() {
    $.getJSON("https://rata.digitraffic.fi/api/v1/live-trains/station/HKI/TPE", haettu)
    console.log("getJSON-metodia kutsuttu")
}




function tallenna(data) {
    localStorage.setItem("junatiedot", JSON.stringify(data));

}

