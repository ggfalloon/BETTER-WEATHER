$(document).ready(function () {


    var oddsAPIkey = "0d039577f178b02a3ea70051b5b0b6bb"
    $.ajax({
        url: "https://api.the-odds-api.com/v3/odds/?sport=upcoming&region=us&mkt=h2h&dateFormat=iso&apiKey=" + oddsAPIkey,
    }).then(function (odddata) {
        console.log(odddata);





        $("#searchBtn").click(function () {
            var cityName = $("#cityName").val();
            var appID = "21292f97c006ec7feb138c594d793fed";
            var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=" + appID;


            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (response) {
                console.log(response)

                var dayList = " ";

                for (i = 0; i < response.list.length; i++) {

                    if (response.list[i].dt_txt.split(" ")[1] === "18:00:00") {

                        dayList += "<div>";
                        dayList += "<ul>";
                        dayList += "<li>" + response.list[i].dt_txt.split(" ")[0] + "</li>";
                        dayList += "<li>" + "<img src='https://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png'>" + "</li>";
                        dayList += "<li>" + response.list[i].main.temp + "</li>";
                        dayList += "<li>" + response.list[i].main.humidity + "</li>";
                        dayList += "<li>" + response.list[i].wind.speed + "</li>";
                        dayList += "<li>" + response.list[i].visibility + "</li>";
                        dayList += "<li>" + response.list[i].pop + "</li>";
                        dayList += "</ul>";
                        dayList += "</div>";
                    }

                } $("#fiveDay").html(dayList);

            });
        });
    });
});
