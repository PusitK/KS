// form filter
let getSelectBranch = document.getElementById('branch0');
let getSelectValue = document.getElementById('values0');
// form DIV
let branchDiv = document.getElementById('branchDiv0');
let valueDiv = document.getElementById('valueDiv0');

let formbusiness = document.getElementById('formbusiness');

let blackdrop = document.getElementById('blackdrop');

let branchList = {};
let formSelect = document.getElementById('formSelect');
let IDform = 1;
let startdate, enddate

let countFilter = [];
let sum_question = [];
let sum_question_table = [];
let sum_question_graph = [];


var all_count_v_color = [];
var all_count_h_color = [];
//P'kwan Summary Graph
let sum_gender = [];
// 
let sum_gender_line = [];

var start = moment().startOf('day');
var end = moment().endOf('day');

function cb(start, end) {
    $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));

    startdate = start.unix() * 1000;
    enddate = end.unix() * 1000 ;
  
}


$('#reportrange').daterangepicker({
    startDate: start,
    endDate: end,
    ranges: {
        'Today': [moment().startOf('day'), moment().endOf('day')],
        'Yesterday': [moment().startOf('day').subtract(1, 'days'), moment().endOf('day').subtract(1, 'days')],
        'Last 7 Days': [moment().startOf('day').subtract(6, 'days'), moment().endOf('day')],
        'Last 30 Days': [moment().startOf('day').subtract(29, 'days'), moment().endOf('day')],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    }
}, cb);
cb(start, end);



// Age categories
var categories = ['55+', '45-54', '35-44', '25-34',
    '18-24', 'Under 18'
];
window.onload = precreateTable();

function precreateTable() {

    let time = ['12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM', '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
        '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM'
    ];

    let idx = ['24', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12',
        '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'
    ];


    let tbodyQ1 = document.getElementById('table-body-q1');
    let tbodyQ2 = document.getElementById('table-body-q2');
    let tbodyQ3 = document.getElementById('table-body-q3');
    let tbodyQ4 = document.getElementById('table-body-q4');
    let tbodyQ5 = document.getElementById('table-body-q5');
    for (let i in time) {
        let tr1 = document.createElement('tr');
        let tr2 = document.createElement('tr');
        let tr3 = document.createElement('tr');
        let tr4 = document.createElement('tr');
        let tr5 = document.createElement('tr');
        //
        // m = male
        // f = femalle
        // u = unknow
        // s = summary
        //
        // numberID = s.substring(0, s.indexOf('?'));
        tr1.innerHTML = `
            <td><b> ` + time[i] + `</b></td>
            <td class="m-` + idx[i] + `-5"></td>  <td class="m-` + idx[i] + `-4"></td>  <td class="m-` + idx[i] + `-3"></td>  <td class="m-` + idx[i] + `-2"></td>  <td class="m-` + idx[i] + `-1"></td>

            <td class="f-` + idx[i] + `-5"></td>  <td class="f-` + idx[i] + `-4"></td>  <td class="f-` + idx[i] + `-3"></td>  <td class="f-` + idx[i] + `-2"></td>  <td class="f-` + idx[i] + `-1"></td>

            <td class="u-` + idx[i] + `-5"></td>  <td class="u-` + idx[i] + `-4"></td>  <td class="u-` + idx[i] + `-3"></td>  <td class="u-` + idx[i] + `-2"></td>  <td class="u-` + idx[i] + `-1"></td>
            <td class="s-` + idx[i] + ` sum-row"></td>`;


        tr2.innerHTML = `
            <td><b> ` + time[i] + `</b></td>
            <td class="m-` + idx[i] + `-5"></td>  <td class="m-` + idx[i] + `-4"></td>  <td class="m-` + idx[i] + `-3"></td>  <td class="m-` + idx[i] + `-2"></td>  <td class="m-` + idx[i] + `-1"></td>

            <td class="f-` + idx[i] + `-5"></td>  <td class="f-` + idx[i] + `-4"></td>  <td class="f-` + idx[i] + `-3"></td>  <td class="f-` + idx[i] + `-2"></td>  <td class="f-` + idx[i] + `-1"></td>

            <td class="u-` + idx[i] + `-5"></td>  <td class="u-` + idx[i] + `-4"></td>  <td class="u-` + idx[i] + `-3"></td>  <td class="u-` + idx[i] + `-2"></td>  <td class="u-` + idx[i] + `-1"></td>
            <td class="s-` + idx[i] + ` sum-row"></td>`;

        tr3.innerHTML = `
            <td><b> ` + time[i] + `</b></td>
            <td class="m-` + idx[i] + `-5"></td>  <td class="m-` + idx[i] + `-4"></td>  <td class="m-` + idx[i] + `-3"></td>  <td class="m-` + idx[i] + `-2"></td>  <td class="m-` + idx[i] + `-1"></td>

            <td class="f-` + idx[i] + `-5"></td>  <td class="f-` + idx[i] + `-4"></td>  <td class="f-` + idx[i] + `-3"></td>  <td class="f-` + idx[i] + `-2"></td>  <td class="f-` + idx[i] + `-1"></td>

            <td class="u-` + idx[i] + `-5"></td>  <td class="u-` + idx[i] + `-4"></td>  <td class="u-` + idx[i] + `-3"></td>  <td class="u-` + idx[i] + `-2"></td>  <td class="u-` + idx[i] + `-1"></td>
            <td class="s-` + idx[i] + ` sum-row"></td>`;

        tr4.innerHTML = `
            <td><b> ` + time[i] + `</b></td>
            <td class="m-` + idx[i] + `-5"></td>  <td class="m-` + idx[i] + `-4"></td>  <td class="m-` + idx[i] + `-3"></td>  <td class="m-` + idx[i] + `-2"></td>  <td class="m-` + idx[i] + `-1"></td>

            <td class="f-` + idx[i] + `-5"></td>  <td class="f-` + idx[i] + `-4"></td>  <td class="f-` + idx[i] + `-3"></td>  <td class="f-` + idx[i] + `-2"></td>  <td class="f-` + idx[i] + `-1"></td>

            <td class="u-` + idx[i] + `-5"></td>  <td class="u-` + idx[i] + `-4"></td>  <td class="u-` + idx[i] + `-3"></td>  <td class="u-` + idx[i] + `-2"></td>  <td class="u-` + idx[i] + `-1"></td>
            <td class="s-` + idx[i] + ` sum-row"></td>`;

        tr5.innerHTML = `
            <td><b> ` + time[i] + `</b></td>
            <td class="m-` + idx[i] + `-5"></td>  <td class="m-` + idx[i] + `-4"></td>  <td class="m-` + idx[i] + `-3"></td>  <td class="m-` + idx[i] + `-2"></td>  <td class="m-` + idx[i] + `-1"></td>

            <td class="f-` + idx[i] + `-5"></td>  <td class="f-` + idx[i] + `-4"></td>  <td class="f-` + idx[i] + `-3"></td>  <td class="f-` + idx[i] + `-2"></td>  <td class="f-` + idx[i] + `-1"></td>

            <td class="u-` + idx[i] + `-5"></td>  <td class="u-` + idx[i] + `-4"></td>  <td class="u-` + idx[i] + `-3"></td>  <td class="u-` + idx[i] + `-2"></td>  <td class="u-` + idx[i] + `-1"></td>
            <td class="s-` + idx[i] + ` sum-row" ></td>`;

        tbodyQ1.appendChild(tr1);
        tbodyQ2.appendChild(tr2);
        tbodyQ3.appendChild(tr3);
        tbodyQ4.appendChild(tr4);
        tbodyQ5.appendChild(tr5);

    }

}

$('html').ready(function () {
    $.ajax({
        url: "https://qwmpk1nu5e.execute-api.ap-southeast-1.amazonaws.com/dev/list/tags",
        type: "GET",
        dataType: 'json',
        success: function (result) {
            //  result.data;
        }
    }).done(function (data) {
        branchList = data.data;
        createBranchList();
    });
});

$('html').ready(function () {

    $.ajax({
        url: "https://qwmpk1nu5e.execute-api.ap-southeast-1.amazonaws.com/dev/list/form",
        type: "GET",
        dataType: 'json',
        success: function (result) {
            var formList = result.data;
            let key = [],
                value = [];
            for (let i in formList) {

                key.push(formList[i].FormId);
                value.push(formList[i].FormName);
            }
            createFormList(key, value, formbusiness);
        }
    }).done(function () {
        // blackdrop.style.display = 'none';
    });
});

function generateColorSummary() {

    
    let tr_total_arr = document.querySelectorAll('.border-disable');
    let td_arr = [];

    let sum_total_arr = document.querySelectorAll('.sum-row');
    let sum_arr = [sum_total_arr];

    let totalelem=document.querySelectorAll('.total-summary');
    
    for (let i in sum_total_arr) {
        for(let z=0; z< totalelem.length ; z++ ){ /// length = 5
            for(let j in all_count_v_color){
                let numberSum = Number(sum_total_arr[i].innerHTML);
                let percent = Math.floor((numberSum / all_count_v_color[j]) * 100);
                if(typeof sum_total_arr[i] !== 'undefined'){
                    if (percent > 0 && percent <= 25) {
                        sum_total_arr[i].style.backgroundColor  = "#f1f8ff";
                    } else if (percent > 25 && percent <= 50) {
                        sum_total_arr[i].style.backgroundColor  = "#d7ecff";
                    } else if (percent > 50 && percent <= 75) {
                        sum_total_arr[i].style.backgroundColor  = "#bee0ff";
                    } else if (percent > 75 && percent <= 100) {
                        sum_total_arr[i].style.backgroundColor  = "#a4d4ff";
                    } 
                }
            }
        }
    }

    for (let i = 0; i < tr_total_arr.length; i++) {

        td_arr.push(tr_total_arr[i].getElementsByTagName('td'));

    }

    for (let i = 0; i < td_arr.length; i++) {
       
        for (var j in td_arr[i]) {
            for(let z=0; z< totalelem.length ; z++ ){
                for(let h in all_count_h_color){
                    // console.log(td_arr[i][j])  /// position of graph
                    let total = Number(td_arr[i][j].innerText);
                    let percent = Math.floor((total / all_count_h_color[h]) * 100); 

                    if (percent > 0 && percent <= 25) {
                        td_arr[i][j].style.backgroundColor  = "#f1f8ff";
                    } else if (percent > 25 && percent <= 50) {
                        td_arr[i][j].style.backgroundColor  = "#d7ecff";
                    } else if (percent > 50 && percent <= 75) {
                        td_arr[i][j].style.backgroundColor  = "#bee0ff";
                    } else if (percent > 75 && percent <= 100) {
                        td_arr[i][j].style.backgroundColor  = "#a4d4ff";
                    } 
                }
            }
        }
    }
}

// get number IN filter Below Date picker
function getCountFilter() {

    $.ajax({
        crossDomain: true,
        url: "https://qwmpk1nu5e.execute-api.ap-southeast-1.amazonaws.com/dev/rpt-filter-complete-identify-form-dev",
        headers: {
            "Content-Type": 'application/json',
            "Cache-Control": "no-cache"
        },
        type: "POST",
        processData: false,
        data: JSON.stringify({
            "startdate": startdate,
            "enddate": enddate,
            "form": formbusiness.value,
            "branch": getSelectValue.value
        }),
        success: function (response) {

            countFilter = response.data;
            // console.log(countFilter);
        }
    }).done(function () {

        for (let i = 1; i <= 5; i++) {
            let elemnumber = document.getElementById('checknumber' + i);
            if (i === 1) {
                elemnumber.innerText = countFilter[0].is_identified.true +
                    countFilter[0].is_identified.false;

            } else if (i === 2) {
                elemnumber.innerText = countFilter[0].is_completed.true;
            } else if (i === 3) {
                elemnumber.innerText = countFilter[0].is_completed.false;
            } else if (i === 4) {
                elemnumber.innerText = countFilter[0].is_identified.true;
            } else {
                elemnumber.innerText = countFilter[0].is_identified.false;
            }
        }
    });
}

function precreatesum() {
    let sum_body1 = document.getElementById('summary-q1');
    let sum_body2 = document.getElementById('summary-q2');
    let sum_body3 = document.getElementById('summary-q3');
    let sum_body4 = document.getElementById('summary-q4');
    let sum_body5 = document.getElementById('summary-q5');
    let q1 = `<td><b>Total</b></td>
            <td class ="m-t-5"></td><td class ="m-t-4"></td><td class ="m-t-3"></td><td class ="m-t-2"></td><td class ="m-t-1"></td>
            <td class ="f-t-5"></td><td class ="f-t-4"></td><td class ="f-t-3"></td><td class ="f-t-2"></td><td class ="f-t-1"></td>
            <td class ="u-t-5"></td><td class ="u-t-4"></td><td class ="u-t-3"></td><td class ="u-t-2"></td><td class ="u-t-1"></td>
            <td class="total-summary" id="sum-q1" style="background:white;  border-bottom: double 2px #777777;font-size:20px;">0</td>`;
    let q2 = `<td><b>Total</b></td>
            <td class ="m-t-5"></td><td class ="m-t-4"></td><td class ="m-t-3"></td><td class ="m-t-2"></td><td class ="m-t-1"></td>
            <td class ="f-t-5"></td><td class ="f-t-4"></td><td class ="f-t-3"></td><td class ="f-t-2"></td><td class ="f-t-1"></td>
            <td class ="u-t-5"></td><td class ="u-t-4"></td><td class ="u-t-3"></td><td class ="u-t-2"></td><td class ="u-t-1"></td>
            <td class="total-summary" id="sum-q2" style="background:white;  border-bottom: double 2px #777777;font-size:20px;">0</td>`;
    let q3 = `<td><b>Total</b></td>
            <td class ="m-t-5"></td><td class ="m-t-4"></td><td class ="m-t-3"></td><td class ="m-t-2"></td><td class ="m-t-1"></td>
            <td class ="f-t-5"></td><td class ="f-t-4"></td><td class ="f-t-3"></td><td class ="f-t-2"></td><td class ="f-t-1"></td>
            <td class ="u-t-5"></td><td class ="u-t-4"></td><td class ="u-t-3"></td><td class ="u-t-2"></td><td class ="u-t-1"></td>
            <td class="total-summary" id="sum-q3" style="background:white;  border-bottom: double 2px #777777;font-size:20px;">0</td>`;
    let q4 = `<td><b>Total</b></td>
            <td class ="m-t-5"></td><td class ="m-t-4"></td><td class ="m-t-3"></td><td class ="m-t-2"></td><td class ="m-t-1"></td>
            <td class ="f-t-5"></td><td class ="f-t-4"></td><td class ="f-t-3"></td><td class ="f-t-2"></td><td class ="f-t-1"></td>
            <td class ="u-t-5"></td><td class ="u-t-4"></td><td class ="u-t-3"></td><td class ="u-t-2"></td><td class ="u-t-1"></td>
            <td class="total-summary" id="sum-q4" style="background:white;  border-bottom: double 2px #777777;font-size:20px;">0</td>`;

    let q5 = `<td><b>Total</b></td>
            <td class ="m-t-5"></td><td class ="m-t-4"></td><td class ="m-t-3"></td><td class ="m-t-2"></td><td class ="m-t-1"></td>
            <td class ="f-t-5"></td><td class ="f-t-4"></td><td class ="f-t-3"></td><td class ="f-t-2"></td><td class ="f-t-1"></td>
            <td class ="u-t-5"></td><td class ="u-t-4"></td><td class ="u-t-3"></td><td class ="u-t-2"></td><td class ="u-t-1"></td>
            <td class="total-summary" id="sum-q5" style="background:white;  border-bottom: double 2px #777777;font-size:20px;">0</td>`;
    sum_body1.insertAdjacentHTML('beforeend', q1);
    sum_body2.insertAdjacentHTML('beforeend', q2);
    sum_body3.insertAdjacentHTML('beforeend', q3);
    sum_body4.insertAdjacentHTML('beforeend', q4);
    sum_body5.insertAdjacentHTML('beforeend', q5);
}

// Get question Progress BAR
function getQuestion(id) {

    document.getElementById('blackdrop').style.display = 'block';
    let tbodyQ1 = document.getElementById('table-body-q1');
    let tbodyQ2 = document.getElementById('table-body-q2');
    let tbodyQ3 = document.getElementById('table-body-q3');
    let tbodyQ4 = document.getElementById('table-body-q4');
    let tbodyQ5 = document.getElementById('table-body-q5');

    while (tbodyQ1.hasChildNodes()) {
        tbodyQ1.removeChild(tbodyQ1.lastChild);
    }
    while (tbodyQ2.hasChildNodes()) {
        tbodyQ2.removeChild(tbodyQ2.lastChild);
    }
    while (tbodyQ3.hasChildNodes()) {
        tbodyQ3.removeChild(tbodyQ3.lastChild);
    }
    while (tbodyQ4.hasChildNodes()) {
        tbodyQ4.removeChild(tbodyQ4.lastChild);
    }
    while (tbodyQ5.hasChildNodes()) {
        tbodyQ5.removeChild(tbodyQ5.lastChild);
    }

    let sum_body1 = document.getElementById('summary-q1');
    let sum_body2 = document.getElementById('summary-q2');
    let sum_body3 = document.getElementById('summary-q3');
    let sum_body4 = document.getElementById('summary-q4');
    let sum_body5 = document.getElementById('summary-q5');
    while (sum_body1.hasChildNodes()) {
        sum_body1.removeChild(sum_body1.lastChild);
    }
    while (sum_body2.hasChildNodes()) {
        sum_body2.removeChild(sum_body2.lastChild);
    }
    while (sum_body3.hasChildNodes()) {
        sum_body3.removeChild(sum_body3.lastChild);
    }
    while (sum_body4.hasChildNodes()) {
        sum_body4.removeChild(sum_body4.lastChild);
    }
    while (sum_body5.hasChildNodes()) {
        sum_body5.removeChild(sum_body5.lastChild);
    }



    precreatesum();
    precreateTable();

    let isCompleted;
    let isIdentified;
    if (document.querySelector('#inlineCheckbox1').checked === false && document.querySelector('#inlineCheckbox2').checked === false) {

        if (id[id.length - 1] === '1') {
            document.querySelector('#inlineCheckbox2').checked = true;
        } else {
            document.querySelector('#inlineCheckbox1').checked = true;
        }
    }
    if (!document.querySelector('#inlineCheckbox3').checked && !document.querySelector('#inlineCheckbox4').checked) {
        if (id[id.length - 1] === '3') {
            document.querySelector('#inlineCheckbox4').checked = true;
        } else {
            document.querySelector('#inlineCheckbox3').checked = true;
        }
    }

    if (document.querySelector('#inlineCheckbox1').checked) {
        isCompleted = true;
    } else {
        isCompleted = false;
    }
    if (document.querySelector('#inlineCheckbox3').checked) {
        isIdentified = true;
    } else {
        isIdentified = false;
    }
    if (document.querySelector('#inlineCheckbox1').checked && document.querySelector('#inlineCheckbox2').checked) {
        isCompleted = '*';
    }
    if (document.querySelector('#inlineCheckbox3').checked && document.querySelector('#inlineCheckbox4').checked) {
        isIdentified = '*';
    }

    let selected = document.getElementById('values0').value;

    $.ajax({
        crossDomain: true,
        url: "https://qwmpk1nu5e.execute-api.ap-southeast-1.amazonaws.com/dev/rpt-count-question-score-dev/",
        headers: {
            "Content-Type": 'application/json',
            "Cache-Control": "no-cache"
        },
        type: "POST",
        processData: false,
        data: JSON.stringify({
            "startdate": startdate,
            "enddate": enddate,
            "form": formbusiness.value,
            "branch": selected,
            "is_completed": isCompleted,
            "is_identified": isIdentified
        }),
        success: function (response) {

            createProgQuestion(response.data);

        }
    }).done(function () {
        getCountFilter();
    });
}

function getQuestionData(id) {

    // Summary - Question 
    let isCompleted;
    let isIdentified;

    if (document.querySelector('#inlineCheckbox1').checked === false && document.querySelector('#inlineCheckbox2').checked === false) {

        if (id[id.length - 1] === '1') {
            document.querySelector('#inlineCheckbox2').checked = true;
        } else {
            document.querySelector('#inlineCheckbox1').checked = true;
        }
    }
    if (!document.querySelector('#inlineCheckbox3').checked && !document.querySelector('#inlineCheckbox4').checked) {
        if (id[id.length - 1] === '3') {
            document.querySelector('#inlineCheckbox4').checked = true;
        } else {
            document.querySelector('#inlineCheckbox3').checked = true;
        }
    }

    if (document.querySelector('#inlineCheckbox1').checked) {
        isCompleted = true;
    } else {
        isCompleted = false;
    }
    if (document.querySelector('#inlineCheckbox3').checked) {
        isIdentified = true;
    } else {
        isIdentified = false;
    }
    if (document.querySelector('#inlineCheckbox1').checked && document.querySelector('#inlineCheckbox2').checked) {
        isCompleted = '*';
    }
    if (document.querySelector('#inlineCheckbox3').checked && document.querySelector('#inlineCheckbox4').checked) {
        isIdentified = '*';
    }

    $.ajax({
        crossDomain: true,
        url: "https://qwmpk1nu5e.execute-api.ap-southeast-1.amazonaws.com/dev/summary/question",
        headers: {
            "Content-Type": 'application/json'
            // "Cache-Control": "no-cache"
        },
        type: "POST",
        processData: false,
        data: JSON.stringify({
            "startdate": startdate,
            "enddate": enddate,
            "form": formbusiness.value,
            "branch": getSelectValue.value,
            "is_completed": isCompleted,
            "is_identified": isIdentified
        }),
        success: function (response) {
            // console.log('graph image x');
            // console.log(response);
            sum_question = response.data;
            // console.log(sum_question);
        }
    }).done(function () {

        createSummaryQuestion();

    });

    //Summary - Question -  Table
    $.ajax({
        crossDomain: true,
        url: "https://qwmpk1nu5e.execute-api.ap-southeast-1.amazonaws.com/dev/summary/question-table",
        headers: {
            "Content-Type": 'application/json'
            // "Cache-Control": "no-cache"
        },
        type: "POST",
        processData: false,
        data: JSON.stringify({
            "startdate": startdate,
            "enddate": enddate,
            "form": formbusiness.value,
            "branch": getSelectValue.value,
            "is_completed": isCompleted,
            "is_identified": isIdentified
        }),
        success: function (response) {
            sum_question_table = response.data;
        }
    }).done(function () {
        createTable();
    });

    // LINE GRAPH QUESTION
    $.ajax({
        crossDomain: true,
        url: "https://qwmpk1nu5e.execute-api.ap-southeast-1.amazonaws.com/dev/summary/question-graph",
        headers: {
            "Content-Type": 'application/json'
            // "Cache-Control": "no-cache"
        },
        type: "POST",
        processData: false,
        data: JSON.stringify({
            "startdate": startdate,
            "enddate": enddate,
            "form": formbusiness.value,
            "branch": getSelectValue.value,
            "is_completed": isCompleted,
            "is_identified": isIdentified
        }),
        success: function (response) {
            // console.log('graph p vit');
            // console.log(response);
            sum_question_graph = response.data
        }
    }).done(function () {
        createSummaryQuestionGraph();
    });

    //  P' Kwan API
    //Summary -Question - Graph
    $.ajax({
        crossDomain: true,
        url: "https://qwmpk1nu5e.execute-api.ap-southeast-1.amazonaws.com/dev/rpt-gender-score-summary-dev",
        headers: {
            "Content-Type": 'application/json'
            // "Cache-Control": "no-cache"
        },
        type: "POST",
        processData: false,
        data: JSON.stringify({
            "startdate": startdate,
            "enddate": enddate,
            "form": formbusiness.value,
            "branch": getSelectValue.value,
            "is_completed": isCompleted,
            "is_identified": isIdentified
        }),
        success: function (response) {
            // console.log('P kwan gender');
            // console.log(response);
            sum_gender = response.data
        }
    }).done(function () {
        createGenderGraph();
    });

    // Line Graph 
    $.ajax({
        crossDomain: true,
        url: "https://qwmpk1nu5e.execute-api.ap-southeast-1.amazonaws.com/dev/rpt-summary-gender-score-graph-dev",
        headers: {
            "Content-Type": 'application/json'
        },
        type: "POST",
        processData: false,
        data: JSON.stringify({
            "startdate": startdate,
            "enddate": enddate,
            "form": formbusiness.value,
            "branch": getSelectValue.value,
            "is_completed": isCompleted,
            "is_identified": isIdentified
        }),
        success: function (response) {
            // console.log('P kwan Line Graph');
            // console.log(response);
            sum_gender_line = response.data;
        }
    }).done(function () {
        createGenderLineGrape();
    });
}

function createGenderLineGrape() {

    let all_gender_arr = [];
    let all_men_arr = [];
    let all_women_arr = [];
    let all_unknow_arr = [];

    for (let i in sum_gender_line) {
        // sum_gender_line[i] Object of m ,f ,all "key" == m/f/n
        for (let j in sum_gender_line[i].interval_date) { //j = 'male' , 'female','all'

            //var timestamp = moment(sum_gender_line[i].interval_date[j].datetime).utcOffset("+07:00").format('YYYY-MM-DD HH:mm');
   var timestamp = new Date(sum_gender_line[i].interval_date[j].datetime).getTime();
            if (sum_gender_line[i].key === 'male') { //sum_gender_line[i][j][z]) == {count , datetime}
                all_men_arr.push([
                    timestamp,
                    sum_gender_line[i].interval_date[j].amount
                ]);
            } else if (sum_gender_line[i].key === 'female') { //sum_gender_line[i][j][z]) == {count , datetime}
                all_women_arr.push([
                    timestamp,
                    sum_gender_line[i].interval_date[j].amount
                ]);
            } else if (sum_gender_line[i].key === 'all') { //sum_gender_line[i][j][z]) == {count , datetime}
                all_gender_arr.push([
                    timestamp,
                    sum_gender_line[i].interval_date[j].amount
                ]);
            } else if (sum_gender_line[i].key === 'unknown') { //sum_gender_line[i][j][z]) == {count , datetime}
                all_unknow_arr.push([
                    timestamp,
                    sum_gender_line[i].interval_date[j].amount
                ]);
            }
        }
    }

    Highcharts.chart('scoresummary', {

        title: {
            text: ''
        },

        subtitle: {
            text: ''
        },

        yAxis: {
            title: {
                text: 'Score'
            }
        },
        xAxis: {
            labels: {
                enabled: true
            },
   type: 'datetime'

        },
        legend: {
            enabled: true,
            align: 'right',
            verticalAlign: 'top',
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            // series: {
            //     pointStart: 0
            // }
   
        },

        series: [{
            name: 'All',
            data: all_gender_arr,
            color: '#000'
        }, {
            name: 'Male',
            data: all_men_arr,
            color: '#2980b9'
        }, {
            name: 'Female',
            data: all_women_arr,
            color: '#E08283'
        }, {
            name: 'N/A',
            data: all_unknow_arr,
            color: '#aaa'
        }]

    });

}

function createGenderGraph() {

    let m_data = [];
    let f_data = [];

    let total = 0;
    var total_m = 0;
    var total_f = 0;

    // calculate total male + female // male // female
    for (let i = 0; i < sum_gender.length; i++) {
        for (let z = 0; z < sum_gender[i].age.length; z++) {
            if (sum_gender[i].gender === 'Female') {
                total_f += sum_gender[i].age[z].count;
            } else if (sum_gender[i].gender === 'Male') {
                total_m += sum_gender[i].age[z].count;
            }
            total += sum_gender[i].age[z].count;
        }
    }

    // change total to float and calculate the percentage of male and female
    total = parseFloat(total);
    total_m = parseFloat(total_m);
    total_f = parseFloat(total_f);

    // put normalized (percentage) value of male and female
    for (let i = 0; i < sum_gender.length; i++) {
        for (let z = 0; z < sum_gender[i].age.length; z++) {
            if (sum_gender[i].gender === 'Female') {
                f_data.push(sum_gender[i].age[z].count / total_f * 100);
            } else if (sum_gender[i].gender === 'Male') {
                m_data.push(-Math.abs(sum_gender[i].age[z].count / total_m * 100));
            }
        }
    }

    Highcharts.chart('container2', {
        chart: {
            type: 'bar'
        },
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        xAxis: [{
            categories: categories,
            reversed: false,
            labels: {
                step: 1
            }
        }, { // mirror axis on right side
            opposite: true,
            reversed: false,
            categories: categories,
            linkedTo: 0,
            labels: {
                step: 1
            }
        }],
        credits: {
            enabled: false
        },
        legend: {
            useHTML: true,
            verticalAlign: 'top',
            labelFormatter: function () {
                let name = this.name;

                // set percentage label 
                let total_gender;
                let img;
              
           
                if (name === 'Male') {
                    img = '<i class="fa fa-male icon-male" aria-hidden="true"></i>';
                    total_gender = total_m / total * 100;
                } else {
                    img = '<i class="fa fa-female icon-female" aria-hidden="true"></i>';
                    total_gender = total_f / total * 100;
                }
                 if(isNaN(total_gender)){
                     return img + name + '-';
                 }
                return img + '  ' + name + ' (' + total_gender.toFixed(2) + '%)';
            }
        },
        yAxis: {
            title: {
                text: null
            },
            labels: {
                formatter: function () {
                    return Math.abs(this.value) + '%';
                }
            },

            // set min max to -100 and 100
            min: -100,
            max: 100
        },

        plotOptions: {
            series: {
                stacking: 'normal'
            },
            bar: {
                dataLabels: {
                    enabled: true,
                    formatter: function () {
                        if (Math.abs(this.y) != 0) {
                            return Math.abs(this.y).toFixed(2) + '%';
                        }
                        return "";
                    },
                    style: {
                        fontWeight: 'normal'
                    }
                }
            }
        },
        tooltip: {
            enabled: true,
            formatter: function () {
                return `<b>` + this.x + `</b>` + " : " + Math.abs(this.y).toFixed(2) + '%';
            }
        },
        series: [{
            name: 'Male',
            data: m_data.reverse(),
            color: '#2980b9'

        }, {
            name: 'Female',
            data: f_data.reverse(),
            color: '#E08283'

        }]
    });
}

function createSummaryQuestion() {

    // console.log(sum_question);
    let data_question = []
    let data_question_sum = [];
    for (i in sum_question) { // i = q1,q2,q3,q4,q5
        for (let j = 0; j < sum_question[i].length; j++) {

            if (sum_question[i][j].choice === 1) {
                var q1 = {
                    name: 'Upset',
                    color: '#e74c3c',
                    y: sum_question[i][j].total
                }
            } else if (sum_question[i][j].choice === 2) {
                var q1 = {
                    name: 'Dislike',
                    color: '#e67e22',
                    y: sum_question[i][j].total
                }
            } else if (sum_question[i][j].choice === 3) {
                var q1 = {
                    name: 'Normal',
                    color: '#f1c40f',
                    y: sum_question[i][j].total
                }
            } else if (sum_question[i][j].choice === 4) {
                var q1 = {
                    name: 'Like',
                    color: '#96CFEA',
                    y: sum_question[i][j].total
                }
            } else if (sum_question[i][j].choice === 5) {
                var q1 = {
                    name: 'Love',
                    color: '#004384',
                    y: sum_question[i][j].total
                }
            }
            data_question.push(q1);
        }
        data_question_sum.push(data_question.reverse());
        data_question = [];
    }

    // Collect All Data
    let chart_Question = [];
    for (let i = 0; i < data_question_sum.length; i++) {

        chart_Question.push({
            chart: {
                type: 'column'
            },
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                series: {
                    color: '#FF0000'
                },
                column: {
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            
            xAxis: {
                categories: ['Upset', 'Dislike', 'Normal', 'Like', 'Love'],
                labels: {
                    padding: 5,
                    useHTML: true,
                    formatter: function () {
                        if (this.value == "Love")
                            return '<img src="img/point1.png" style="width: 30px; vertical-align: middle" />';
                        else if (this.value == "Like")
                            return '<img src="img/point2.png" style="width: 30px; vertical-align: middle" />';
                        else if (this.value == "Normal")
                            return '<img src="img/point3.png" style="width: 30px; vertical-align: middle" />';
                        else if (this.value == "Dislike")
                            return '<img src="img/point4.png" style="width: 30px; vertical-align: middle" />';
                        else if (this.value == "Upset")
                            return '<img src="img/point5.png" style="width: 30px; vertical-align: middle" />';
                    },
                    style: {
                        height: 30
                    }
                }
            },
            legend: {
                enabled: false
            },
            yAxis: {
                allowDecimals: false,
                title: {
                    text: 'Number'
                }
            },
            tooltip: {
                formatter: function () {
                    return '<p><b>' + this.y + '</b></p>';
                }
            },
            series: [{
                data: data_question_sum[i],
                pointWidth: 55
            }]
        });
    }

    Highcharts.chart('container-2-q1', chart_Question[0]);
    Highcharts.chart('container-2-q2', chart_Question[1]);
    Highcharts.chart('container-2-q3', chart_Question[2]);
    Highcharts.chart('container-2-q4', chart_Question[3]);
    Highcharts.chart('container-2-q5', chart_Question[4]);

}
// P' vit DID
function createSummaryQuestionGraph() {

    let male_data = [];
    let female_data = [];
    let na_data = [];
    let all_data = [];

    for (let i = 0; i < 5; i++) {
        na_data[i] = [];
        male_data[i] = [];
        female_data[i] = [];
        all_data[i] = [];
        for (let j = 0; j < 24; j++) {
            male_data_temp = 0;
            male_data_sum = 0;
            female_data_temp = 0;
            female_data_sum = 0;
            na_data_temp = 0;
            na_data_sum = 0;
            all_data_temp = 0;
            all_data_sum = 0;

            for (let k = 1; k <= 5; k++) {
                if (sum_question_graph["q" + (i + 1)]["Male"] !== undefined) {
                    if (sum_question_graph["q" + (i + 1)]["Male"]["" + k] !== undefined) {
                        if (sum_question_graph["q" + (i + 1)]["Male"]["" + k]["" + j] !== undefined) {
                            male_data_temp += sum_question_graph["q" + (i + 1)]["Male"]["" + k]["" + j] * k;
                            male_data_sum += sum_question_graph["q" + (i + 1)]["Male"]["" + k]["" + j] * 5;
                        }
                    }
                }
                if (sum_question_graph["q" + (i + 1)]["Female"] !== undefined) {
                    if (sum_question_graph["q" + (i + 1)]["Female"]["" + k] !== undefined) {
                        if (sum_question_graph["q" + (i + 1)]["Female"]["" + k]["" + j] !== undefined) {
                            female_data_temp += sum_question_graph["q" + (i + 1)]["Female"]["" + k]["" + j] * k;
                            female_data_sum += sum_question_graph["q" + (i + 1)]["Female"]["" + k]["" + j] * 5;
                        }
                    }
                }
                if (sum_question_graph["q" + (i + 1)]["N/A"] !== undefined) {
                    if (sum_question_graph["q" + (i + 1)]["N/A"]["" + k] !== undefined) {
                        if (sum_question_graph["q" + (i + 1)]["N/A"]["" + k]["" + j] !== undefined) {
                            na_data_temp += sum_question_graph["q" + (i + 1)]["N/A"]["" + k]["" + j] * k;
                            na_data_sum += sum_question_graph["q" + (i + 1)]["N/A"]["" + k]["" + j] * 5;
                        }
                    }
                }
            }

            all_data_temp = male_data_temp + female_data_temp + na_data_temp;
            all_data_sum = male_data_sum + female_data_sum + na_data_temp;
            if (all_data_sum == 0) {
                all_data_sum = NaN;
            }
            na_data[i].push(na_data_temp);
            male_data[i].push(male_data_temp);
            female_data[i].push(female_data_temp);
            all_data[i].push(all_data_sum)

        }
    }

    // Collect All Data
    let chart_Question = [];
    for (let i = 0; i < 5; i++) {
        chart_Question.push({
            chart: {
                type: 'column'
            },
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            yAxis: {
                title: {
                    text: 'Score'
                },
                min: 0
            },
            legend: {
                enabled: true,
                align: 'center',
                verticalAlign: 'top'
            },

            credits: {
                enabled: false
            },
            plotOptions: {
                column: {
                    stacking: 'normal'

                }

            },
            xAxis: {
                categories: ['12AM', '1AM', '2AM', '3AM', '4AM', '5AM', '6AM', '7AM', '8AM', '9AM', '10AM', '11AM', '12PM',
                    '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM', '10PM', '11PM'
                ]
            },
            tooltip: {
                formatter: function () {
                    return '<p><b>'+this.series.name + ' : ' + this.y + '</b></p>';
                }
            },

            series: [{
                name: 'Male',
                data: male_data[i],
                color: '#2980b9',
                pointPadding: -0.2

            }, {
                name: 'Female',
                data: female_data[i],
                color: '#E08283',
                pointPadding: -0.2


            }, {
                name: 'N/A',
                data: na_data[i],
                color: '#aaa',
                pointPadding: -0.2

            }, {
                type: 'scatter',
                name: 'Full score',
                data: all_data[i],
                color: '#000',
                marker: {
                    enabled: true
                },
                lineWidth: 0
            }]
        });
    }

    Highcharts.chart('container-1-q1', chart_Question[0]);
    Highcharts.chart('container-1-q2', chart_Question[1]);
    Highcharts.chart('container-1-q3', chart_Question[2]);
    Highcharts.chart('container-1-q4', chart_Question[3]);
    Highcharts.chart('container-1-q5', chart_Question[4]);

}

    function createTable() {

        let allTable = document.querySelectorAll('.tbody-value');

        let sum_per_row = 1;
        let sum_total = 0;

        all_count_v_color = [];
        all_count_h_color = [];
        
        
        for (let i in sum_question_table) { // i = q1,q2,q3
            let count_v_color = 0;
            let count_h_color = 0;
            let sum_total_ele = document.getElementById('sum-' + i);
            let sum_total_col_ele = document.getElementById('summary-' + i);
            let bodyIdx = document.getElementById('table-body-' + i); // get tbody
            for (let j in sum_question_table[i]) { // j = male,female,n/a
                //  console.log(sum_question_table[i][j]); // == inside m,f,n
                for (let z in sum_question_table[i][j]) { /// z  === type of score
                    // console.log(sum_question_table[i][j][z]);  /// sum_question_table[i][j][z] == Object  of time
                    for (let time in sum_question_table[i][j][z]) {
                        // console.log(sum_question_table[i][j][z][time]); /// value
                       
                        time =  Number(time);
                        time = Math.abs(time);

                        if (j === 'Male') {
                            bodyIdx.querySelector('.m' + '-' + time + '-' + z).innerText = sum_question_table[i][j][z][time];

                            bodyIdx.querySelector('.s' + '-' + time).innerText = Number(bodyIdx.querySelector('.s' + '-' + time).innerText) + sum_question_table[i][j][z][time]; //this line for summary row

                            sum_total_col_ele.querySelector('.m-t-' + z).innerText = Number(sum_total_col_ele.querySelector('.m-t-' + z).innerText) + sum_question_table[i][j][z][time]; //this line for summary column

                            sum_total += sum_question_table[i][j][z][time];


                        } else if (j === 'Female') {

                            bodyIdx.querySelector('.f' + '-' + time + '-' + z).innerText = sum_question_table[i][j][z][time];
                            bodyIdx.querySelector('.s' + '-' + time).innerText = Number(bodyIdx.querySelector('.s' + '-' + time).innerText) + sum_question_table[i][j][z][time]; //this line for summary row

                            sum_total_col_ele.querySelector('.f-t-' + z).innerText = Number(sum_total_col_ele.querySelector('.f-t-' + z).innerText) + sum_question_table[i][j][z][time]; //this line for summary column

                            sum_total += sum_question_table[i][j][z][time];
                        } else if (j === "N/A") {

                            bodyIdx.querySelector('.u' + '-' + time + '-' + z).innerText = sum_question_table[i][j][z][time];
                            bodyIdx.querySelector('.s' + '-' + time).innerText = Number(bodyIdx.querySelector('.s' + '-' + time).innerText) + sum_question_table[i][j][z][time]; //this line for summary row
                            
                            sum_total_col_ele.querySelector('.u-t-' + z).innerText = Number(sum_total_col_ele.querySelector('.u-t-' + z).innerText) + sum_question_table[i][j][z][time]; //this line for summary column


                            sum_total += sum_question_table[i][j][z][time];
                            
                        }
                        // bodyIdx.querySelector('.s'+'-'+time).innerText = sum_per_row+1;
                        let max_h = Math.max(Number(sum_total_col_ele.querySelector('.u-t-' + z).innerText), Number(sum_total_col_ele.querySelector('.f-t-' + z).innerText), Number(sum_total_col_ele.querySelector('.m-t-' + z).innerText));
                     
                        if(Number(count_h_color) <= Number(max_h)){
                            count_h_color = max_h;
                            
                        }
                     
                        if(Number(count_v_color) <= Number(bodyIdx.querySelector('.s' + '-' + time).innerText)){
                            
                            count_v_color = bodyIdx.querySelector('.s' + '-' + time).innerText;
                        }
                        
                    }
                    sum_per_row = 0;
                }
            }

            sum_total_ele.innerText = sum_total;
            sum_total = 0;
            //push array to geneerate color
            all_count_v_color.push(count_v_color);
            all_count_h_color.push(count_h_color);
        }
      
        generateColorSummary();
        document.getElementById('blackdrop').style.display = 'none';
    }

function createProgQuestion(example) {

    let prog_elem = document.getElementById('progress-question');
    let sum_prog_elem = document.getElementById('summary-progress');

    prog_elem.innerHTML = '';
    sum_prog_elem.innerHTML = '';
    for (let i in example) {

        let count = example[i].q1.count * 5 + example[i].q2.count * 5 + example[i].q3.count * 5 + example[i].q4.count * 5 + example[i].q5.count * 5;


        let sum_score = example[i].q1.sum_score + example[i].q2.sum_score + example[i].q3.sum_score + example[i].q4.sum_score + example[i].q5.sum_score;

        let percent_summary = Math.floor((sum_score / count) * 100);
        
        if (!isNaN(Math.floor((example[i].q1.sum_score / (example[i].q1.count * 5)) * 100))) { //this for show if have data in period
            display('show');
        } else {
            display('hide');
            document.getElementById('showForm').style.display = 'block';
        }
        if(isNaN(Math.floor((example[i].q1.sum_score / (example[i].q1.count * 5)) * 100))){
            var value1 = '-';
        }else{
            var value1 = Math.floor((example[i].q1.sum_score / (example[i].q1.count * 5)) * 100);
        }
        if(isNaN(Math.floor((example[i].q2.sum_score / (example[i].q2.count * 5)) * 100))){
            var value2 = '-';
        }else{
            var value2 = Math.floor((example[i].q2.sum_score / (example[i].q2.count * 5)) * 100);
        }
        if(isNaN(Math.floor((example[i].q3.sum_score / (example[i].q3.count * 5)) * 100))){
            var value3 = '-';
        }else{
            var value3 = Math.floor((example[i].q3.sum_score / (example[i].q3.count * 5)) * 100);
        }
        if(isNaN(Math.floor((example[i].q4.sum_score / (example[i].q4.count * 5)) * 100))){
            var value4 = '-';
        }else{
            var value4 = Math.floor((example[i].q4.sum_score / (example[i].q4.count * 5)) * 100);
        }
        if(isNaN(Math.floor((example[i].q5.sum_score / (example[i].q5.count * 5)) * 100))){
            var value5 = '-';
        }else{
            var value5 = Math.floor((example[i].q5.sum_score / (example[i].q5.count * 5)) * 100);
        }

        let createProgressElement =
            `<div class="form-group">
                <label class="label-title"> 1.ความพึงพอใจในการต้อนรับ </label>
                <div class="progress col-lg-10" style="padding:0">
                    <div class="progress-bar color-intensity-2" role="progressbar" 
                    aria-valuenow="` + value1 + `"
                                    aria-valuemin="0" aria-valuemax="100" 
                    style="width:` + value1 + `%">

                        <span class="progress-value">` + value1 + `%</span>

                    </div>
                </div>
                <span class="col-lg-2 ">` + example[i].q1.sum_score + '/' + example[i].q1.count * 5 + `</span>
            </div>
            <div class="form-group">
                <label class="label-title">2.ความพึงพอใจในการเอาใจใส่</label>
                <div class="progress col-lg-10" style="padding:0">
                    <div class="progress-bar color-intensity-2" role="progressbar"
                    aria-valuenow="` + value2 + `"
                                    aria-valuemin="0" aria-valuemax="100" 
                    style="width:` + value2 + `%">
                        
                        <span class="progress-value">` + value2 + `%</span>
                    </div>
                </div>
                <span class="col-lg-2 ">` + example[i].q2.sum_score + '/' + example[i].q2.count * 5 + `</span>
            </div>
            <div class="form-group">
                <label class="label-title">3.ความพึงพอใจในระยะเวลาการทำรายการ</label>
                <div class="progress col-lg-10" style="padding:0">
                    <div class="progress-bar color-intensity-2" role="progressbar" 
                        aria-valuenow="` + value3 + `"
                                    aria-valuemin="0" aria-valuemax="100" style="width:` + value3 + `%">
                        <span class="progress-value">` + value3 + `%</span>
                    </div>
                </div>
                <span class="col-lg-2 ">` + example[i].q3.sum_score + '/' + example[i].q3.count * 5 + `</span>
            </div>
            <div class="form-group">
                <label class="label-title">4.ความพึงพอใจในการให้คำแนะนำ</label>
                <div class="progress col-lg-10" style="padding:0">
                    <div class="progress-bar color-intensity-2" role="progressbar" aria-valuenow="` + value4 + `"
                                    aria-valuemin="0" aria-valuemax="100" style="width:` + value4 + `%">
                        <span class="progress-value">` +value4 + `%</span>
                    </div>
                </div>
                <span class="col-lg-2 ">` + example[i].q4.sum_score + '/' + example[i].q4.count * 5 + `</span>
            </div>
            <div class="form-group">
                <label class="label-title">5.ความพึงพอใจในความถูกต้องการทำรายการ</label>
                <div class="progress col-lg-10" style="padding:0">
                    <div class="progress-bar color-intensity-2" role="progressbar" aria-valuenow="` + value5 + `"
                                    aria-valuemin="0" aria-valuemax="100" style="width:` + value5 + `%">
                        <span class="progress-value">` + value5 + `%</span>
                    </div>
                </div>
                <span class="col-lg-2 ">` + example[i].q5.sum_score + '/' + example[i].q5.count * 5 + `</span>
            </div>`

        prog_elem.insertAdjacentHTML('beforeend', createProgressElement);

        let createSumProgElem =
            `<div class="progress margin-top-1 col-lg-10" style="padding:0">
                <div class="progress-bar color-intensity-3" role="progressbar" aria-valuenow="` + percent_summary + `"
                                aria-valuemin="0" aria-valuemax="100" style="width:` + percent_summary + `%">
                     <span class="progress-value"><b>` + percent_summary + `%</b></span>
                </div>
            </div>
            <span class="col-lg-2 progress-number">` + sum_score + '/' + count + `</span>`

        sum_prog_elem.insertAdjacentHTML('beforeend', createSumProgElem);
    }
}

function createBranchList() {

    let key = [];
    for (let i in branchList) {
        key.push(i.charAt(0).toUpperCase() + i.slice(1));
    }
    createFormList(key, key, getSelectBranch);
};

function getValueList(value, id) {

    let getValueIdElem = document.getElementById('values' + id.slice(6));

    for (let i in branchList) {
        if (i.toLowerCase() === value.toLowerCase()) {
            getValueIdElem.innerHTML = '';
            let key = branchList[i];
            let createDefultOpt = `<option selected disabled value=''>-- Select --</option>`;
            getValueIdElem.insertAdjacentHTML('beforeend', createDefultOpt);
            createFormList(key, key, getValueIdElem);
        }
    }
}

function createFormList(key, value, select_id) {

    for (let i in key) {
        let opts = document.createElement('option');
        opts.value = key[i];
        opts.name = value[i];
        opts.innerHTML = value[i];
        select_id.appendChild(opts);
    }
}


function addFilter() {

    let FormDIV = document.getElementById('filterForm');
    let cln = FormDIV.cloneNode(true); // copy div filterform
    cln.id = "form" + IDform; //set id in filterform
    let select_elem = cln.getElementsByTagName('select'); //get select
    let div_elem = cln.getElementsByTagName('div'); // get form  div
    select_elem[select_elem.length - 1].innerHTML = '';

    let createDefultOpt = `<option selected disabled value=''>-- Select --</option>`;
    select_elem[select_elem.length - 1].insertAdjacentHTML('beforeend', createDefultOpt);


    cln.getElementsByTagName('label')[0].innerHTML = '' // clear text of label

    for (let i = 0; i < select_elem.length; i++) {

        select_elem[i].id = select_elem[i].id + IDform; /// add id of <select> <= value , branch
        div_elem[i].id = div_elem[i].id + IDform; /// add id of <select> <= divvalue , divbranch

    }

    let lastDiv = cln.getElementsByTagName('div');
    lastDiv = lastDiv[lastDiv.length - 1];

    let icon_remove = `<i class="fa fa-minus-circle minus-btn"
                                        id="addBtn"
                                        onclick = removeForm("form"+` + IDform + `);
                                        aria-hidden="true"></i>`;

    lastDiv.insertAdjacentHTML('beforeend', icon_remove);
    formSelect.appendChild(cln);
    IDform += 1;

}

function display(att) {

    if (att == 'show') {
        document.getElementById('display-section').style.display = 'block';
        document.getElementById('display-section-af-search').style.display = 'block';
        document.getElementById('error-display').style.display = 'none';
    } else {
        document.getElementById('display-section').style.display = 'none';
        document.getElementById('error-display').style.display = 'block';
        document.getElementById('error-text').innerText = 'No Data';
      
    }
}

function checkState() {

    if (getSelectBranch.value !== '' && getSelectValue.value !== '' && formbusiness.value !== '') {
        document.getElementById('buttonShow').disabled = false;

    } else {
        document.getElementById('buttonShow').disabled = true;
    }
}

function removeForm(id) {
    document.getElementById(id).remove();

}

function scrollToTop() {

    $("html,body").animate({
        scrollTop: $("html,body").offset().top
    }, "1000");
}