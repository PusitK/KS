"use strict";
// http://survey-report.triple3.io/download.html?file=U3VydmV5XzYxYjMyOWM1XzE0OTk3ODIxNzkzMjEueGxzeA==
if(/[?&]file=/.test(location.search)){
    var url_string = window.location.href;
    var url = new URL(url_string);
    var filename = url.searchParams.get("file");
    window.onload = function (event) {
        $.ajax({
            url: "https://a0n3yz3jbj.execute-api.ap-southeast-1.amazonaws.com/prod/v2/download",
            type: "POST",
            dataType: 'json',
            headers: {
                "Content-Type": 'application/json; charset=utf-8',
            },
            data: JSON.stringify({
                filename : filename
            }),
        }).done(function (result) {
            window.location = result.data;
        });
    }
}
