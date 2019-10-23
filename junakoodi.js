//var urlalku = "https://rata.digitraffic.fi/api/v1";
//var urlloppu = "/live-trains/station/HKI/TPE";

//määritellään ajan esitysmuoto
var nyt = new Date();


//Ajan default arvon lisääminen:
Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
}

function init() {
nyt.addHours(3);
$("#aika").val(nyt.toISOString().slice(0, -8));
}


Date.prototype.addDate = function (d) {
    this.setDate(this.getDate() + (d));
    return this;
}

var optiot = { hour: '2-digit', minute: '2-digit', hour12: false };

// kokeillaan tehdä erikseen lähtö- ja saapumisajan mukaan
function haeLahtoAika() {
    $("#tiedot").empty();
    var alkuaika = new Date($("#aika").val());
    console.dir(alkuaika);
    console.log(alkuaika.toISOString());
    var startfilter = "startDate=" + alkuaika.toISOString();
    var url = "https://rata.digitraffic.fi/api/v1/live-trains/station/HKI/TPE" + "?" + startfilter;
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

<<<<<<< HEAD


=======
>>>>>>> 239a479a6aa7dabc5cff3380aee778e50b32692f
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

//hakee kaiken datan:
function haedata() {
    $.getJSON("https://rata.digitraffic.fi/api/v1/live-trains/station/HKI/TPE", haettu)
}




<<<<<<< HEAD
function tallenna(data) {
    localStorage.setItem("junatiedot", JSON.stringify(data));

}

=======
//HYLÄTYT VERSIOT:

//HAKUA AJAN PERUSTEELLA, LÄHTÖ JA SAAPUMISAIKA
//var ajanvalinta = $('input[name=aika]:checked').val();

//function aikaHaku() {
//    if (ajanvalinta = "A") {
//        haeLahtoAika();
//    }
//    else if (ajanvalinta = "B") {
//        haeSaapumisAika();
//        console.log("haku toimii!!!")
//    }
//}


//TONIN VERSIO: haetaan juna-aikataulu lähtö- tai saapumisajan perusteella
//function haedataAika() {
//    $("#tiedot").empty();
//    var alkuaika = new Date($("#lahtoaika").val());
//    console.dir(alkuaika);
//    console.log(alkuaika.toISOString());
//    var loppuaika = new Date($("#saapumisaika").val());
//    console.dir(loppuaika);
//    var startfilter = "startDate=" + alkuaika.toISOString();
//    //var endfilter = "endDate=" + loppuaika.toISOString();
//    //var url = "https://rata.digitraffic.fi/api/v1/live-trains/station/HKI/TPE" + "?" + startfilter + "&" + endfilter;
//    var url = "https://rata.digitraffic.fi/api/v1/live-trains/station/HKI/TPE" + "?" + startfilter;
//    $.getJSON(url, haettu)
//}

// HAETAAN VAIN SAAPUMISAJAN PERUSTEELLA:
//function haeSaapumisAika() {
//    $("#tiedot").empty();
//    var loppuaika = new Date($("#aika").val());
//    console.dir(loppuaika);
//    console.log("ei toimi?");
//    var endfilter = "endDate=" + loppuaika.toISOString();
//    var url = "https://rata.digitraffic.fi/api/v1/live-trains/station/HKI/TPE" + "?" + startfilter + "&" + endfilter;
//    $.getJSON(url, haettu)
//}
>>>>>>> 239a479a6aa7dabc5cff3380aee778e50b32692f
