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

    return output;
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const city = parsedUrl.query.city;

    if (pathname === "/") {
        let output = homeFile;

        output = output.replace("{%display%}", "none"); // hide weather
        output = output.replace("{%city%}", ""); // clear city
        output = output.replace("{%error%}", ""); // clear error

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

server.listen(8000, "127.0.0.1");
console.log("Exit");
