$(document).ready(function () {

    // Ajax call to get data from the odds api
    $.ajax({
        url: "https://api.the-odds-api.com/v3/odds/?apiKey=18dba54709eb4aae0d163bd1f9a42646&sport=americanfootball_nfl&region=uk&mkt=h2h",
        method: "GET"
    }).then(function (oddsResponse) {

        // Pulls all upcoming home teams and displays them as a button
        var dataArr = oddsResponse.data.slice(0, 10);

        for (i = 0; i < dataArr.length; i++) {

            var team = dataArr[i].home_team;
            $("#data").append(`<button class="team">${team}</button></br>`);
        }


        // Added click function for button
        $(".team").on('click', function (e) {

            var teamName = e.target.textContent;
            $("#websites").html(" ");

            for (i = 0; i < dataArr.length; i++) {

                var homeTeam = dataArr[i].home_team;
                var teamsPlaying = dataArr[i].teams;

                // Matches team name in this API to home team for results
                if (teamName == homeTeam) {

                    var time = dataArr[i].commence_time;
                    var myDate = new Date(time * 1000);

                    $("#gametime").html(myDate.toLocaleString());
                    $("#gameteams").html(teamsPlaying[0] + " -VS- " + teamsPlaying[1]);
                    $("#hometeam").html(homeTeam);

                    var sites = dataArr[i].sites.slice(0, 5);
                    var odd;
                    for (i = 0; i < sites.length; i++) {
                        var odd = sites[i].odds.h2h[0] + " / " + sites[i].odds.h2h[1];
                        $("#websites").append(sites[i].site_nice + " : " + odd + "<br>");
                    }
                }
            }

            var queryURL = "https://en.wikipedia.org/w/api.php?action=parse&pageid=10814816&prop=text&format=json";
            var pageHolder = "";

            // Ajax request for wikipedia stadium table
            $.ajax({
                url: queryURL,
                method: "GET",
                crossDomain: true,
                dataType: 'jsonp',
            }).then(function (wikiResponse) {

                // Parses the table to an object array
                var wikipage = wikiResponse.parse.text["*"]
                pageHolder = $("<div>").html(wikipage)
                var wikiTable = pageHolder.find("table.wikitable.sortable")[0];
                var tableRows = $(wikiTable).find("tr:not(tr:first-child)")

                // Loop through the table data and write dynamically to the page
                $.each(tableRows, function (index, stadiumTR) {
                    var tdArray = $(stadiumTR).find("td, th");

                    // var imgSrc = "https:" + tdArray[0].children[0].children[0].attributes[1].value;
                    // imgSrc = imgSrc.replace(/(120px|1200px)/g, function ($1) {
                    //     return $1 === '120px' ? '1200px' : '120px';

                    if (teamName.trim() == tdArray[6].outerText.trim()) {

                        // $("#imageEl").html(imgSrc);
                        $("#stadiumEl").html(tdArray[1].outerText);
                        $("#teamEl").html(tdArray[6].outerText);
                        $("#roofEl").html(tdArray[5].outerText);
                        $("#turfEl").html(tdArray[4].outerText.split("[")[0]);
                        $("#capacityEl").html(tdArray[2].outerText);
                        $("#locationEl").html(tdArray[3].outerText);

                        var cityName = tdArray[3].outerText.split(",")[0];
                        var appID = "21292f97c006ec7feb138c594d793fed";
                        var qURL = "https://api.openweathermap.org/data/2.5/forecast/?q=" + cityName + "&units=imperial&appid=" + appID;


                        // Ajax request for current searched city weather info
                        $.ajax({
                            url: qURL,
                            method: "GET"
                        }).then(function (response) {

                            // Added City name to weather section
                            var weatherCity = response.city.name;

                            for (i = 0; i < response.city.name.length; i++) {
                                $("#weatherCity").html(weatherCity);
                            }

                            var dayList = " ";

                            for (i = 0; i < response.list.length; i++) {
                                // Retrieves only the 3:00 forecast 
                                if (response.list[i].dt_txt.split(" ")[1] === "18:00:00") {
                                    // dynamically displays weather data
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
                                    dayList += "<hr>";
                                }
                                // Writes weather data to the page
                            } $("#weather").html(dayList);

                        });
                    }
                });
            });

        });



    });
});




