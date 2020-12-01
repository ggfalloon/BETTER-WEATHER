$(document).ready(function () {

    // var oddsAPIkey = "0d039577f178b02a3ea70051b5b0b6bb";

    // $.ajax({
    //     url: "https://api.the-odds-api.com/v3/odds/?sport=upcoming&region=us&mkt=h2h&dateFormat=iso&apiKey=" + oddsAPIkey,
    // }).then(function (odddata) {

    $("#searchBtn").click(function () {
        // var teamName = $("#teamName").val();
        var cityName = $("#price").val();
        var appID = "21292f97c006ec7feb138c594d793fed";
        var queryURL = "https://api.openweathermap.org/data/2.5/forecast/?q=" + cityName + "&units=imperial&appid=" + appID;


        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response)

            var dayList = " ";

            for (i = 0; i < response.list.length; i++) {

                if (response.list[i].dt_txt.split(" ")[1] === "18:00:00") {

                    dayList += "<hr>";
                    dayList += "<br>";
                    dayList += "<ul>";
                    dayList += "<li >Date: " + moment(response.list[i].dt_txt.split(" ")[0], "YYYY-MM-DD").format("MM-DD-YYYY") + "</li>";
                    dayList += "<li>" + "<img src='https://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png'>" + "</li>";
                    dayList += "<li>Temp: " + Math.trunc(response.list[i].main.temp) + "\u00B0</li>";
                    dayList += "<li>Humidity: " + response.list[i].main.humidity + "%</li>";
                    dayList += "<li>Wind Speed: " + response.list[i].wind.speed + "mph</li>";
                    dayList += "<li> Visibility: " + response.list[i].visibility + "m</li>";
                    dayList += "<li>Precipitation: " + response.list[i].pop + "\"\</li>";
                    dayList += "</ul>";
                    dayList += "<br>";
                }

            } $("#weather").html(dayList);

        });

        var queryURL = "https://en.wikipedia.org/w/api.php?action=parse&pageid=10814816&prop=text&format=json";
        var pageHolder = "";
        $.ajax({
            url: queryURL,
            method: "GET",
            crossDomain: true,
            dataType: 'jsonp',
        }).then(function (response) {

            var wikipage = response.parse.text["*"]
            pageHolder = $("<div>").html(wikipage)
            var wikiTable = pageHolder.find("table.wikitable.sortable")[0];
            var tableRows = $(wikiTable).find("tr:not(tr:first-child)")
            var stadiumArray = [];

            $.each(tableRows, function (index, stadiumTR) {
                var tdArray = $(stadiumTR).find("td, th");
                // console.log($(stadiumTR).find("td, th"))
                var imgSrc = "https:" + tdArray[0].children[0].children[0].attributes[1].value;
                imgSrc = imgSrc.replace(/(120px|1200px)/g, function ($1) {
                    return $1 === '120px' ? '1200px' : '120px';
                });

                if (cityName == tdArray[3].outerText.split(",")[0]) {

                    // $("imageEl").html()
                    $("#stadiumEl").html(tdArray[1].outerText);
                    $("#teamEl").html(tdArray[6].outerText);
                    $("#roofEl").html(tdArray[5].outerText);
                    $("#turfEl").html(tdArray[4].outerText);
                    $("#capacityEl").html(tdArray[2].outerText);
                    $("#locationEl").html(tdArray[3].outerText);

                    var stadiumObj = {
                        img: imgSrc,
                        name: tdArray[1].outerText,
                        capacity: tdArray[2].outerText,
                        location: tdArray[3].outerText,
                        surface: tdArray[4].outerText,
                        roofType: tdArray[5].outerText,
                        team: tdArray[6].outerText
                    }
                    stadiumArray.push(stadiumObj)

                }

            });

            // console.log(stadiumArray);
            // $("#wikipage").html(wikiTable)
        });

    });

});

