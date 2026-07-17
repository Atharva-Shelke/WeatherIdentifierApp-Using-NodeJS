console.log("Running");
const http = require("http");
const fs = require("fs");
const url = require("url");

var requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal, cityName) => {
    const temp = orgVal.main.temp;
    const tempMin = orgVal.main.temp_min;
    const tempMax = orgVal.main.temp_max;
    let output = tempVal.replace("{%tempval%}", temp.toFixed(2));
    output = output.replace("{%tempmin%}", tempMin.toFixed(2));
    output = output.replace("{%tempmax%}", tempMax.toFixed(2));
    output = output.replace("{%location%}", orgVal.name);
    output = output.replace("{%country%}", orgVal.sys.country);
    output = output.replace("{%main%}", orgVal.weather[0]["main"]);
    output = output.replace("{%description%}", orgVal.weather[0]["description"],);
    output = output.replace("{%display%}", "block");
    output = output.replace("{%city%}", cityName);
    output = output.replace("{%error%}", "");
    output = output.replace("{%humidity%}", orgVal.main.humidity);
    output = output.replace("{%pressure%}", orgVal.main.pressure);
    output = output.replace("{%feelslike%}", orgVal.main.feels_like.toFixed(1));
    output = output.replace("{%wind%}", orgVal.wind.speed);
    output = output.replace("{%icon%}", orgVal.weather[0].icon);

    let bgClass = "default-bg";

    switch (orgVal.weather[0].main.toLowerCase()) {
        case "clear":
            bgClass = "sunny";
            break;
        case "clouds":
            bgClass = "clouds";
            break;
        case "rain":
            bgClass = "rain";
            break;
        case "drizzle":
            bgClass = "drizzle";
            break;
        case "thunderstorm":
            bgClass = "thunderstorm";
            break;
        case "snow":
            bgClass = "snow";
            break;
        case "mist":
        case "fog":
        case "haze":
        case "smoke":
            bgClass = "mist";
            break;
    }

    output = output.replace("{%bgclass%}", bgClass);
    return output;
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const city = parsedUrl.query.city;

    if (req.url === "/styles.css") {
        res.writeHead(200, { "Content-Type": "text/css" });
        res.end(fs.readFileSync("./styles.css"));
        return;
    }

    if (pathname === "/") {
        let output = homeFile;

        output = output.replace("{%display%}", "none"); // hide weather
        output = output.replace("{%city%}", ""); // clear city
        output = output.replace("{%error%}", ""); // clear error
        output = output.replace("{%bgclass%}", "default-bg");

        res.write(output);
        res.end();
    } else if (pathname === "/weather") {
        console.log("Inside req");
        const cityName = city || "pune";

        requests(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=3ca2e81cada743a0af1c5d503cde4ae1&units=metric`,
        )
            .on("data", (chunk) => {
                const objData = JSON.parse(chunk);
                if (!objData.main) {
                    let output = homeFile;

                    output = output.replace("{%display%}", "none"); // hide weather
                    output = output.replace("{%city%}", cityName);

                    // Add error message
                    output = output.replace("{%error%}", objData.message);

                    res.write(output);
                    return;
                }

                const realTimeData = replaceVal(homeFile, objData);
                res.write(realTimeData);
            })
            .on("end", (err) => {
                if (err) {
                    console.log(err);
                    res.end("Error fetching weather");
                }
                res.end();
            });
    }
});

server.listen(8000);
console.log("Exit");
