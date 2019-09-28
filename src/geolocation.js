fetch("https://ipinfo.io").then((response) => {
    console.log(response.city, response.country);
}, "jsonp");