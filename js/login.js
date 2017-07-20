"use strict";
// $('body').show();

if (localStorage.idToken != null) {
    window.location = "/index.html";
} else {
    $('body').show();
}

$('form').submit(function (e) {
    e.preventDefault();
    //code goes here
    var arrText = [];
    $('input').each(function () {

        arrText.push($(this).val());
    });
    document.getElementById('blackdrop').style.display = 'block';
    $.ajax({
        url: "https://qwmpk1nu5e.execute-api.ap-southeast-1.amazonaws.com/dev/v2/login",
        type: "POST",
        dataType: 'json',
        headers: {
            "Content-Type": 'application/json'
        },
        data: JSON.stringify({
            business: arrText[0].trim(),
            username: arrText[1].trim(),
            password: arrText[2].trim()
        }), success: function success(response) {
            if (response.success) {
                localStorage.idToken = response.data.idToken;
                localStorage.refreshToken = response.data.refreshToken;
                localStorage.business = arrText[0].trim();
                localStorage.user = arrText[1].trim();
                window.location = "/index.html";
                // window.location = "file:///C:/Users/WhitelineTech/Desktop/esquare/surveyV1.2/index.html?=" + response.data.token;
            } else {
                $("#problem").html("Business or Username or Password Incorrect!");
            }
        }
    }).done(function () {
        document.getElementById('blackdrop').style.display = 'none';
    });
});
