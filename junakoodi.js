var urlalku = "https://rata.digitraffic.fi/api/v1/live-trains/station/";
var urllahtopaikka = "";
var urlsaapumispaikka = "";
var urlloppu = "";
var lahtokaupunki = "";
var tulokaupunki = "";
var valittupaatekaupunki = "";


//määritellään ajan esitysmuoto
var nyt = new Date();
var asemat = [];

//Ajan default arvon lisääminen:
Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}

//Määritetään urlin osia lähtö- ja saapumiskaupungin perusteella
function init() {
nyt.addHours(3);
$("#aika").val(nyt.toISOString().slice(0, -8));
}

//Määritetään URL osoite, josta dataa haetaan kaupunkivalinnan perusteella
function maaritaUrl() {

    valittulahtokaupunki = $("#lahtopaikka option:selected").val();
    console.log(valittulahtokaupunki);

    if (valittulahtokaupunki === "Helsinki") {
        urllahtopaikka = "HKI";
    }

    if (valittulahtokaupunki === "Oulu") {
        urllahtopaikka = "OL";
    }

    if (valittulahtokaupunki === "Tampere") {
        urllahtopaikka = "TPE";
    }

    if (valittulahtokaupunki === "Turku") {
        urllahtopaikka = "TKU";
    }

    valittupaatekaupunki = $("#saapumispaikka option:selected").val();
    console.log(valittupaatekaupunki);

    if (valittupaatekaupunki === "Helsinki") {
        urlsaapumispaikka = "HKI";
    }

    if (valittupaatekaupunki === "Oulu") {
        urlsaapumispaikka = "OL";
    }

    if (valittupaatekaupunki === "Tampere") {
        urlsaapumispaikka = "TPE";
    }

    if (valittupaatekaupunki === "Turku") {
        urlsaapumispaikka = "TKU";
    }

    urlloppu = urllahtopaikka + "/" + urlsaapumispaikka;

haedata();
}

var optiot = { hour: '2-digit', minute: '2-digit', hour12: false };

// haetaan data lähtöajan mukaan:
function haeLahtoAika() {
    maaritaUrl();
    $("#tiedot").empty();
    var alkuaika = new Date($("#aika").val());
    console.dir(alkuaika);
    console.log(alkuaika.toISOString());
    var startfilter = "startDate=" + alkuaika.toISOString();
    var url = urlalku + urlloppu + "?" + startfilter;
    $.getJSON(url, haettu)
}

//haetaan junan saapumisaika asemalle
function getSaapumisaika(timeTableRows, asema) {
    var sr=timeTableRows.find(function (tr) {
        return tr.stationShortCode == asema;
    });
    console.dir(sr);
    return sr.scheduledTime;
}

//haetaan junan lähtöaika asemalta
function getLahtoaika(timeTableRows, asema) {
    var sr = timeTableRows.find(function (tr) {
        return tr.stationShortCode == asema;
    });
    console.dir(sr);
    return sr.scheduledTime;
}

//Hakee kaikkien asemien tiedot eri API:sta, ja tallettaa ne asemat-arrayhyn(määritelty globaaliksi muuttujaksi ylhäällä)
function haeAsemienTiedot() {
   
    var url = "https://rata.digitraffic.fi/api/v1/metadata/stations";
    $.getJSON(url, function (data) {
        asemat = data;
    })
}
haeAsemienTiedot();

//Hakee yksittäisen aseman shortcoden ja kiinnittää sen arvon asemanlyhenne-parametriin. Funktio palauttaa asemanlyhennettä vastaavan aseman nimen.
function haeAsemanTiedot(asemanlyhenne) {
    var asema = asemat.find(function (asema) {
        return asema.stationShortCode==asemanlyhenne
    })
    return asema.stationName;
}

//järjestää haetun datan halutulla tavalla:
function haettu(data) {
    console.dir(data);
    tallenna(data);
    let rivit = "";
    var otsikko = "<table><th>Mistä</th><th>Lähtöaika</th><th>Minne</th><th>Saapumisaika</th><th>Junan tiedot</th></table>";

    for (let juna of data) {

        //var lahtoaika = new Date(juna.timeTableRows[0].scheduledTime).toLocaleTimeString("fi", optiot);
        var lahtoaika = new Date(getLahtoaika(juna.timeTableRows, urllahtopaikka)).toLocaleTimeString("fi", optiot);
        var saapumisaika = new Date(getSaapumisaika(juna.timeTableRows, urlsaapumispaikka)).toLocaleTimeString("fi", optiot);
        var lahtoasema = $("#lahtopaikka").val();
        var paateasema = $("#saapumispaikka").val();
        var valiasemat = ""
        console.dir(juna.timeTableRows);
       
        for (var valiasematieto of juna.timeTableRows) {


            if (valiasematieto.stationShortCode !== urlsaapumispaikka) {

                if (valiasematieto.type === "DEPARTURE" && valiasematieto.trainStopping === true) {
                    var valiaika = new Date(valiasematieto.scheduledTime).toLocaleTimeString("fi", optiot)
                    valiasemat += valiaika + ":" + haeAsemanTiedot(valiasematieto.stationShortCode) + ", ";
                }
            } else {

                var valiaika = new Date(valiasematieto.scheduledTime).toLocaleTimeString("fi", optiot)
                valiasemat += valiaika + ":" + haeAsemanTiedot(valiasematieto.stationShortCode);

                break;
            }
        }
    
        rivit += `<table><tr><td>${lahtoasema}</td><td>${lahtoaika}</td><td>${paateasema}</td><td>${saapumisaika}</td><td>${juna.trainType + juna.trainNumber}</td></tr></table><table><tr><td>Väliasemat:</td><td colspan="4">${valiasemat}</td></tr></table>`;
    }
    document.getElementById("tiedot").innerHTML = otsikko + rivit;
}

//hakee kaiken datan:
function haedata() {
    var url = urlalku + urlloppu;
    $.getJSON(url, haettu)
}

//Tallentaa haun tiedot localStorageen
function tallenna(data) {
    localStorage.setItem("junatiedot", JSON.stringify(data));

}

//sijaintihommat VAROVASTI
var x = document.getElementById("demo");

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    x.innerHTML = "Latitude: " + position.coords.latitude +
        "<br>Longitude: " + position.coords.longitude;
}
