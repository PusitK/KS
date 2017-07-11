    "use strict";
    if(sessionStorage.token != null){
         $('body').show();
    }else{
        window.location = "http://survey-report.triple3.io";
    }

    /* When the user clicks on the button, 
    toggle between hiding and showing the dropdown content */
    function dropdownLogOut() {
        document.getElementById("myDropdown").classList.toggle("show");
        document.getElementById("myDropdownTri").classList.toggle("show");
    }

    // Close the dropdown menu if the user clicks outside of it
    window.onclick = function (event) {
        if (!event.target.matches('.dropbtn')) {
            var dropdowns = document.getElementsByClassName("dropdown-content");
            var i;
            for (i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    }

    function logout() {

        sessionStorage.clear();
        window.location = "http://survey-report.triple3.io"

    }


    let time_list = [{
        "name": "12:00 AM",
        "value": "24"
    }, {
        "name": "1:00 AM",
        "value": "1"
    }, {
        "name": "2:00 AM",
        "value": "2"
    }, {
        "name": "3:00 AM",
        "value": "3"
    }, {
        "name": "4:00 AM",
        "value": "4"
    }, {
        "name": "5:00 AM",
        "value": "5"
    }, {
        "name": "6:00 AM",
        "value": "6"
    }, {
        "name": "7:00 AM",
        "value": "7"
    }, {
        "name": "8:00 AM",
        "value": "8"
    }, {
        "name": "9:00 AM",
        "value": "9"
    }, {
        "name": "10:00 AM",
        "value": "10"
    }, {
        "name": "11:00 AM",
        "value": "11"
    }, {
        "name": "12:00 PM",
        "value": "12"
    }, {
        "name": "1:00 PM",
        "value": "13"
    }, {
        "name": "2:00 PM",
        "value": "14"
    }, {
        "name": "3:00 PM",
        "value": "15"
    }, {
        "name": "4:00 PM",
        "value": "16"
    }, {
        "name": "5:00 PM",
        "value": "17"
    }, {
        "name": "6:00 PM",
        "value": "18"
    }, {
        "name": "7:00 PM",
        "value": "19"
    }, {
        "name": "8:00 PM",
        "value": "20"
    }, {
        "name": "9:00 PM",
        "value": "21"
    }, {
        "name": "10:00 PM",
        "value": "22"
    }, {
        "name": "11:00 PM",
        "value": "23"
    }];

    var categories = ['55+', '45-54', '35-44', '25-34', '18-24', 'Under 18'];
    let getSelectBranch = document.getElementById('branch0');
    let getSelectValue = document.getElementById('values0');
    let formbusiness = document.getElementById('formbusiness');
    let formSelect = document.getElementById('formSelect');
    let blackdrop = document.getElementById('blackdrop');
    let is_completed;
    let is_identified;
    let branch_list = {};
    let IDform = 1;
    let startdate, enddate;
    let countFilter = [];
    let sum_question = [];
    let sum_question_table = [];
    let sum_question_graph = [];
    let all_count_v_color = [];
    let all_count_h_color = [];
    let sum_gender = [];
    let sum_gender_line = [];
    var start = moment().startOf('day');
    var end = moment().endOf('day');

    var model = {

        getDate: function (start, end) {
            $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
            startdate = start.unix() * 1000;
            enddate = end.unix() * 1000;
            return startdate, enddate;
        },
        onloadFetch: function () {
            $.ajax({
                url: "https://qwmpk1nu5e.execute-api.ap-southeast-1.amazonaws.com/dev/v2/selector/form",
                type: "GET",
                dataType: 'json',
                headers: {
                    "Content-Type": 'application/json; charset=utf-8',
                    "Authorization": sessionStorage.token
                }
            }).done(function (result) {
                var form_list = result.data;
                let key = [],
                    value = [];
                for (let i in form_list) {
                    key.push(form_list[i].FormId);
                    value.push(form_list[i].FormName);
                }
                view.createFormList(key, value, formbusiness);
            });

            $.ajax({
                url: "https://qwmpk1nu5e.execute-api.ap-southeast-1.amazonaws.com/dev/v2/selector/tags",
                type: "GET",
                dataType: 'json',
                headers: {
                    "Content-Type": 'application/json; charset=utf-8',
                    "Authorization": sessionStorage.token
                    // get total number of form
                }
            }).done(function (data) {
                branch_list = data.data;
                let key = [];
                for (let i in branch_list) {
                    key.push(i.charAt(0).toUpperCase() + i.slice(1));
                }
                view.createFormList(key, key, getSelectBranch);
            });
        },
        fetchAPI: function (com, iden) {

            if ((com && iden) == null) {

                com = '*';
                iden = '*';
                for (let i = 1; i <= 4; i++) {
                    document.getElementById('inlineCheckbox' + i).checked = true;
                }
            }
            document.getElementById('blackdrop').style.display = 'block';
            let param = {
                "startdate": startdate,
                "enddate": enddate,
                "form": formbusiness.value,
                "branch": getSelectValue.value
            };
            let param_with_filter = {
                "startdate": startdate,
                "enddate": enddate,
                "form": formbusiness.value,
                "branch": getSelectValue.value,
                "is_completed": com,
                "is_identified": iden
            };
            let header = {
                "Content-Type": 'application/json; charset=utf-8',
                "Cache-Control": "no-cache",
                "Authorization": sessionStorage.token

            };
            let header_no_cache = {
                "Content-Type": 'application/json; charset=utf-8',
                "Authorization": sessionStorage.token
                // get total number of form
            };
            $.ajax({
                crossDomain: true,
                url: "https://qwmpk1nu5e.execute-api.ap-southeast-1.amazonaws.com/dev/v2/selector/filter",
                headers: header_no_cache,
                type: "POST",
                processData: false,
                data: JSON.stringify(param)
            }).done(function (response) {
                countFilter = response.data;
                view.countForm();
            });
            // Progress Score
            $.ajax({
                crossDomain: true,
                url: "https://qwmpk1nu5e.execute-api.ap-southeast-1.amazonaws.com/dev/v2/overall/score-graph",
                headers: header,
                type: "POST",
                processData: false,
                data: JSON.stringify(param_with_filter),
                success: function (response) {
                    createall(response.data, function () {
                        // Graph Emotion Gender
                        $.ajax({
                            crossDomain: true,
                            url: "https://qwmpk1nu5e.execute-api.ap-southeast-1.amazonaws.com/dev/v2/summary/question",
                            headers: header_no_cache,
                            type: "POST",
                            processData: false,
                            data: JSON.stringify(param_with_filter),
                            success: function (response) {
                                sum_question = response.data;
                            }
                        }).done(function () {
                            createSummaryQuestion();
                        });
                        // Table
                        $.ajax({
                            crossDomain: true,
                            url: "https://qwmpk1nu5e.execute-api.ap-southeast-1.amazonaws.com/dev/v2/summary/question-table",
                            headers: header_no_cache,
                            type: "POST",
                            processData: false,
                            data: JSON.stringify(param_with_filter),
                            success: function (response) {
                                sum_question_table = response.data;
                            }
                        }).done(function () {
                            view.removeTable();
                        });

                        // LINE GRAPH Each question
                        $.ajax({
                            crossDomain: true,
                            url: "https://qwmpk1nu5e.execute-api.ap-southeast-1.amazonaws.com/dev/v2/summary/question-graph",
                            headers: header_no_cache,
                            type: "POST",
                            processData: false,
                            data: JSON.stringify(param_with_filter),
                            success: function (response) {
                                sum_question_graph = response.data;
                            }
                        }).done(function () {
                            createSummaryQuestionGraph();
                        });
                        //  P' Kwan API
                        //Summary -Question - Graph
                        $.ajax({
                            crossDomain: true,
                            url: "https://qwmpk1nu5e.execute-api.ap-southeast-1.amazonaws.com/dev/v2/overall/age-graph",
                            headers: header,
                            type: "POST",
                            processData: false,
                            data: JSON.stringify(param_with_filter),
                            success: function (response) {

                                sum_gender = response.data;
                            }
                        }).done(function () {
                            createGenderGraph();
                        });
                        // Line Graph 
                        $.ajax({
                            crossDomain: true,
                            url: "https://qwmpk1nu5e.execute-api.ap-southeast-1.amazonaws.com/dev/v2/overall/gender-graph/",
                            headers: header,
                            type: "POST",
                            processData: false,
                            data: JSON.stringify(param_with_filter),
                            success: function (response) {

                                sum_gender_line = response.data;
                            }
                        }).done(function (response) {

                            createGenderLineGrape();
                        });

                    });

                    if (response.data[0].que_sum_score == 0) {

                        view.display('hide');
                        document.getElementById('showForm').style.display = 'block';
                        document.getElementById('blackdrop').style.display = 'none';
                    } else {

                        view.display('show');
                        createProgQuestion(response.data);
                        document.getElementById('blackdrop').style.display = 'none';
                    }
                }
            });

        }
    };

    var view = {
        createFormList: function (key, value, formElem) {
            //create select dropdown
            for (let i in key) {
                let opts = document.createElement('option');
                opts.value = key[i];
                opts.name = value[i];
                opts.innerHTML = value[i];
                formElem.appendChild(opts);
            }
        },
        countForm: function () {

            for (let i = 1; i <= 5; i++) {
                //5 = number length of filterCheckbox type
                let elemnumber = document.getElementById('checknumber' + i);
                if (i === 1) {
                    elemnumber.innerText = countFilter[0].is_completed.true + countFilter[0].is_completed.false;
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
        },
        display: function (atb) {
            if (atb == 'show') {
                // document.getElementById('display-section').style.display = 'block';
                $('#display-section').attr("style", "display: block !important;");
                document.getElementById('display-section-af-search').style.display = 'block';
                document.getElementById('error-display').style.display = 'none';
            } else if (atb === 'hide') {
                // document.getElementById('display-section').style.display = 'none';
                $('#display-section').attr("style", "display: none !important;");
                document.getElementById('error-display').style.display = 'block';
                document.getElementById('error-text').innerText = 'No Data';
            } else if (atb === 'clear') {
                // document.getElementById('display-section').style.display = 'none';
                $('#display-section').attr("style", "display: none !important;");
                document.getElementById('error-display').style.display = 'none';
                document.getElementById('display-section-af-search').style.display = 'none';
            }
        },
        graphEmotion: function (chart) {
            Highcharts.chart('container-2-q1', chart[0]);
            Highcharts.chart('container-2-q2', chart[1]);
            Highcharts.chart('container-2-q3', chart[2]);
            Highcharts.chart('container-2-q4', chart[3]);
            Highcharts.chart('container-2-q5', chart[4]);
        },
        setColor: function (pos, percent) {
            if (percent > 0 && percent <= 25) {
                pos.style.backgroundColor = "#f1f8ff";
            } else if (percent > 25 && percent <= 50) {
                pos.style.backgroundColor = "#d7ecff";
            } else if (percent > 50 && percent <= 75) {
                pos.style.backgroundColor = "#bee0ff";
            } else if (percent > 75 && percent <= 100) {
                pos.style.backgroundColor = "#a4d4ff";
            }
        },
        precreateTable: function () {
            let score = [5, 4, 3, 2, 1];
            let gender = ['m', 'f', 'u']; // m = male  f = femalle u = unknow s = summary
            let allbody = document.querySelectorAll('.tbody-value');
            for (let b = 0; b < allbody.length; b++) {
                for (let i in time_list) {
                    let tr1 = document.createElement('tr');
                    tr1.innerHTML = `<td><b>` + time_list[i].name + `</b></td>`;
                    for (let x in gender) {
                        for (let j in score) {
                            tr1.innerHTML += `<td class="` + gender[x] + `-` + time_list[i].value + `-` + score[j] + `"></td>`;
                        }
                    }
                    tr1.innerHTML += `<td class="s-` + time_list[i].value + ` sum-col"></td>`;
                    allbody[b].appendChild(tr1);
                }
            }
            // create summary row (Last rows)
            let allSummaryrow = document.querySelectorAll('.summary-row');
            for (let i = 0; i < allSummaryrow.length; i++) {
                let trSum = document.createElement('tr');
                trSum.innerHTML = `<td><b>Total</b></td>`;
                for (let x in gender) {
                    for (let j in score) {

                        trSum.innerHTML += `<td class ="` + gender[x] + `-t-` + score[j] + ` sum-row"></td>`;
                    }
                }
                trSum.innerHTML += `<td class="total-summary" id="sum-q` + (i + 1) + `" style="background:white;  border-bottom: double 2px #777777;font-size:20px;">0</td>`;
                allSummaryrow[i].appendChild(trSum);
            }
            createTable();
        },
        removeTable: function () {
            let all_body_table = document.querySelectorAll('.tbody-value');
            let all_row = document.querySelectorAll('.summary-row');
            for (let i = 0; i < all_body_table.length; i++) {
                while (all_body_table[i].hasChildNodes()) {
                    all_body_table[i].removeChild(all_body_table[i].lastChild);
                }
            }
            for (let i = 0; i < all_row.length; i++) {
                while (all_row[i].hasChildNodes()) {
                    all_row[i].removeChild(all_row[i].lastChild);
                }
            }
            view.precreateTable();
        }
    };

    var ctrl = {
        getCheckbox: function (id) {
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
                is_completed = true;
            } else {
                is_completed = false;
            }
            if (document.querySelector('#inlineCheckbox3').checked) {
                is_identified = true;
            } else {
                is_identified = false;
            }
            if (document.querySelector('#inlineCheckbox1').checked && document.querySelector('#inlineCheckbox2').checked) {
                is_completed = '*';
            }
            if (document.querySelector('#inlineCheckbox3').checked && document.querySelector('#inlineCheckbox4').checked) {
                is_identified = '*';
            }
            model.fetchAPI(is_completed, is_identified);
        }

    };

    window.onload = model.onloadFetch();

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
    }, model.getDate);
    model.getDate(start, end);

    function getValueList(value, id) {

        let getValueIdElem = document.getElementById('values' + id.slice(6));

        for (let i in branch_list) {
            if (i.toLowerCase() === value.toLowerCase()) {
                getValueIdElem.innerHTML = '';
                let key = branch_list[i];
                let createDefultOpt = `<option selected disabled value=''>-- Select --</option>`;
                getValueIdElem.insertAdjacentHTML('beforeend', createDefultOpt);
                view.createFormList(key, key, getValueIdElem);
            }
        }
    }

    function generateColorSummary(vcol, hrow) {

        let eachRow = document.querySelectorAll('.sum-row');
        let eachCol = document.querySelectorAll('.sum-col');
        let totalelem = document.querySelectorAll('.total-summary');
        for (let z = 0; z < totalelem.length; z++) {
            /// length = 5 all table
            for (let i in eachCol) {
                // summary of column
                let valueOfEachCol = Number(eachCol[i].innerHTML);
                let percent = Math.floor(valueOfEachCol / vcol[z] * 100);
                if (typeof eachCol[i] !== 'undefined') {
                    view.setColor(eachCol[i], percent);
                }
            }
            for (let i in eachRow) {
                // summary of row
                let valueOfEachRow = Number(eachRow[i].innerHTML);
                let percent = Math.floor(valueOfEachRow / hrow[z] * 100);
                if (typeof eachRow[i] !== 'undefined') {
                    view.setColor(eachRow[i], percent);
                }
            }
        }
    }

    function createGenderLineGrape() {

        let all_gender_arr = [];
        let all_men_arr = [];
        let all_women_arr = [];
        let all_unknow_arr = [];

        for (let i in sum_gender_line) {
            // sum_gender_line[i] Object of m ,f ,all "key" == m/f/n
            for (let j in sum_gender_line[i].interval_date) {
                //j = 'male' , 'female','all'
                var timestamp = moment.utc(sum_gender_line[i].interval_date[j].datetime).valueOf();
                if (sum_gender_line[i].key === 'male') {
                    //sum_gender_line[i][j][z]) == {count , datetime}
                    all_men_arr.push([timestamp, sum_gender_line[i].interval_date[j].amount]);
                } else if (sum_gender_line[i].key === 'female') {
                    //sum_gender_line[i][j][z]) == {count , datetime}
                    all_women_arr.push([timestamp, sum_gender_line[i].interval_date[j].amount]);
                } else if (sum_gender_line[i].key === 'all') {
                    //sum_gender_line[i][j][z]) == {count , datetime}
                    all_gender_arr.push([timestamp, sum_gender_line[i].interval_date[j].amount]);
                } else if (sum_gender_line[i].key === 'unknown') {
                    //sum_gender_line[i][j][z]) == {count , datetime}
                    all_unknow_arr.push([timestamp, sum_gender_line[i].interval_date[j].amount]);
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
                verticalAlign: 'top'
            },
            credits: {
                enabled: false
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
                name: 'Un-Identified',
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
                    if (isNaN(total_gender)) {
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
        let data_question = [];
        let data_question_sum = [];

        for (let i in sum_question) {
            // i = q1,q2,q3,q4,q5
            // console.log(sum_question[i]); Object of q1,2,3,4,5
            for (let j in sum_question[i]) {
                // j is a1,a2,a3
                if (j[j.length - 1] == 1) {
                    var q1 = {
                        name: 'Upset',
                        color: '#e74c3c',
                        y: sum_question[i][j].total
                    };
                } else if (j[j.length - 1] == 2) {
                    var q1 = {
                        name: 'Dislike',
                        color: '#e67e22',
                        y: sum_question[i][j].total
                    };
                } else if (j[j.length - 1] == 3) {
                    var q1 = {
                        name: 'Normal',
                        color: '#f1c40f',
                        y: sum_question[i][j].total
                    };
                } else if (j[j.length - 1] == 4) {
                    var q1 = {
                        name: 'Like',
                        color: '#96CFEA',
                        y: sum_question[i][j].total
                    };
                } else if (j[j.length - 1] == 5) {
                    var q1 = {
                        name: 'Love',
                        color: '#004384',
                        y: sum_question[i][j].total
                    };
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
                            if (this.value == "Love") return '<img src="img/point1.png" style="width: 30px; vertical-align: middle" />';
                            else if (this.value == "Like") return '<img src="img/point2.png" style="width: 30px; vertical-align: middle" />';
                            else if (this.value == "Normal") return '<img src="img/point3.png" style="width: 30px; vertical-align: middle" />';
                            else if (this.value == "Dislike") return '<img src="img/point4.png" style="width: 30px; vertical-align: middle" />';
                            else if (this.value == "Upset") return '<img src="img/point5.png" style="width: 30px; vertical-align: middle" />';
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
        view.graphEmotion(chart_Question);
    }
    // P' vit DID
    function createSummaryQuestionGraph() {
        let male_data = [];
        let female_data = [];
        let na_data = [];
        let all_data = [];

        let all_count = [];

        for (let i = 0; i < 5; i++) {
            na_data[i] = [];
            male_data[i] = [];
            female_data[i] = [];
            all_data[i] = [];

            let all_count_male = [];
            let all_count_female = [];
            let all_count_na = [];

            for (let j = 0; j < 24; j++) {
                let male_data_temp = 0;
                let male_data_sum = 0;
                let female_data_temp = 0;
                let female_data_sum = 0;
                let na_data_temp = 0;
                let na_data_sum = 0;
                let all_data_temp = 0;
                let all_data_sum = 0;

                let count_male = 0;
                let count_female = 0;
                let count_na = 0;

                for (let k = 1; k <= 5; k++) {
                    if (sum_question_graph["q" + (i + 1)]["Male"] !== undefined) {
                        if (sum_question_graph["q" + (i + 1)]["Male"]["" + k] !== undefined) {
                            if (sum_question_graph["q" + (i + 1)]["Male"]["" + k]["" + j] !== undefined) {

                                male_data_temp += sum_question_graph["q" + (i + 1)]["Male"]["" + k]["" + j] * k;
                                male_data_sum += sum_question_graph["q" + (i + 1)]["Male"]["" + k]["" + j] * 5;
                                count_male += sum_question_graph["q" + (i + 1)]["Male"]["" + k]["" + j];
                            }
                        }
                    }
                    if (sum_question_graph["q" + (i + 1)]["Female"] !== undefined) {
                        if (sum_question_graph["q" + (i + 1)]["Female"]["" + k] !== undefined) {
                            if (sum_question_graph["q" + (i + 1)]["Female"]["" + k]["" + j] !== undefined) {
                                female_data_temp += sum_question_graph["q" + (i + 1)]["Female"]["" + k]["" + j] * k;
                                female_data_sum += sum_question_graph["q" + (i + 1)]["Female"]["" + k]["" + j] * 5;
                                count_female += sum_question_graph["q" + (i + 1)]["Female"]["" + k]["" + j];
                            }
                        }
                    }
                    if (sum_question_graph["q" + (i + 1)]["Unidentified"] !== undefined) {
                        if (sum_question_graph["q" + (i + 1)]["Unidentified"]["" + k] !== undefined) {
                            if (sum_question_graph["q" + (i + 1)]["Unidentified"]["" + k]["" + j] !== undefined) {
                                na_data_temp += sum_question_graph["q" + (i + 1)]["Unidentified"]["" + k]["" + j] * k;
                                na_data_sum += sum_question_graph["q" + (i + 1)]["Unidentified"]["" + k]["" + j] * 5;
                                count_na += sum_question_graph["q" + (i + 1)]["Unidentified"]["" + k]["" + j];
                            }
                        }
                    }
                }

                all_data_temp = male_data_temp + female_data_temp + na_data_temp;
                all_data_sum = male_data_sum + female_data_sum + na_data_sum;

                if (all_data_sum == 0) {
                    all_data_sum = NaN;
                }
                all_count_male.push(count_male);
                all_count_female.push(count_female);
                all_count_na.push(count_na);

                na_data[i].push(na_data_temp);
                male_data[i].push(male_data_temp);
                female_data[i].push(female_data_temp);
                all_data[i].push(all_data_sum);
            }
            all_count.push({
                'Male': all_count_male,
                'Female': all_count_female,
                'Un-Identified': all_count_na
            });
        }
        // Collect All Data
        let chart_Question = [];

        for (let i = 0; i < 5; i++) {
            chart_Question[i] = new Highcharts.chart('container-1-q' + (i + 1), {
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

                    },
                    series: {
                        events: {
                            legendItemClick: function () {
                                // console.log(all_count[i].Male);
                                let name = this.name;
                                var legenedItemIndex = this.index; // index of highchart legend item
                                var visibility = this.visible ? 'hidden' : 'visible'; // check series visibility ?
                                if (legenedItemIndex !== 3) {
                                    // 3 is full score don't mess with it!!
                                    for (let j in this.options.data) {
                                        if (!isNaN(all_data[i][j])) {
                                            if (visibility == 'hidden') {
                                                all_data[i][j] -= all_count[i][name][j] * 5;
                                            } else {
                                                all_data[i][j] += all_count[i][name][j] * 5;
                                            }
                                        }
                                    }
                                }
                                redraw(chart_Question[i], all_data[i]);
                            }
                        }
                    }
                },
                xAxis: {
                    categories: ['12AM', '1AM', '2AM', '3AM', '4AM', '5AM', '6AM', '7AM', '8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM', '7PM', '8PM', '9PM', '10PM', '11PM']
                },
                tooltip: {
                    formatter: function () {
                        return '<p><b>' + this.series.name + ' : ' + this.y + '</b></p>';
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
                    name: 'Un-Identified',
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
    }

    function redraw(chart, data) {
        chart.series[3].setData(data, true, true, false);
    }

    function createTable() {

        let allTable = document.querySelectorAll('.tbody-value');
        let sum_per_row = 1;
        let sum_total = 0;
        let all_count_v_color = [];
        let all_count_h_color = [];

        for (let i in sum_question_table) {
            // i = q1,q2,q3
            let count_v_color = 0;
            let count_h_color = 0;
            let sum_total_ele = document.getElementById('sum-' + i); //last column last row
            let sum_total_row_ele = document.getElementById('summary-' + i); //all sum row 
            let bodyIdx = document.getElementById('table-body-' + i); // get tbody
            for (let j in sum_question_table[i]) {
                // j = male,female,n/a
                //  console.log(sum_question_table[i][j]); // == inside m,f,n
                for (let z in sum_question_table[i][j]) {
                    /// z  === type of score
                    // console.log(sum_question_table[i][j][z]);  /// sum_question_table[i][j][z] == Object  of time
                    for (let time in sum_question_table[i][j][z]) {
                        // console.log(sum_question_table[i][j][z][time]); /// value
                        time = Number(time);
                        time = Math.abs(time);
                        if (j === 'Male') {

                            bodyIdx.querySelector('.m' + '-' + time + '-' + z).innerText = sum_question_table[i][j][z][time]; // set value in postion

                            bodyIdx.querySelector('.s' + '-' + time).innerText = Number(bodyIdx.querySelector('.s' + '-' + time).innerText) + sum_question_table[i][j][z][time]; //this line for summary row

                            sum_total_row_ele.querySelector('.m-t-' + z).innerText = Number(sum_total_row_ele.querySelector('.m-t-' + z).innerText) + sum_question_table[i][j][z][time]; //this line for summary column

                            sum_total += sum_question_table[i][j][z][time];
                        } else if (j === 'Female') {

                            bodyIdx.querySelector('.f' + '-' + time + '-' + z).innerText = sum_question_table[i][j][z][time];
                            bodyIdx.querySelector('.s' + '-' + time).innerText = Number(bodyIdx.querySelector('.s' + '-' + time).innerText) + sum_question_table[i][j][z][time]; //this line for summary row

                            sum_total_row_ele.querySelector('.f-t-' + z).innerText = Number(sum_total_row_ele.querySelector('.f-t-' + z).innerText) + sum_question_table[i][j][z][time]; //this line for summary column

                            sum_total += sum_question_table[i][j][z][time];
                        } else if (j === "Unidentified") {

                            bodyIdx.querySelector('.u' + '-' + time + '-' + z).innerText = sum_question_table[i][j][z][time];
                            bodyIdx.querySelector('.s' + '-' + time).innerText = Number(bodyIdx.querySelector('.s' + '-' + time).innerText) + sum_question_table[i][j][z][time]; //this line for summary row

                            sum_total_row_ele.querySelector('.u-t-' + z).innerText = Number(sum_total_row_ele.querySelector('.u-t-' + z).innerText) + sum_question_table[i][j][z][time]; //this line for summary column
                            sum_total += sum_question_table[i][j][z][time];
                        }
                        // bodyIdx.querySelector('.s'+'-'+time).innerText = sum_per_row+1;
                        let max_h = Math.max(Number(sum_total_row_ele.querySelector('.u-t-' + z).innerText), Number(sum_total_row_ele.querySelector('.f-t-' + z).innerText), Number(sum_total_row_ele.querySelector('.m-t-' + z).innerText));

                        if (Number(count_h_color) <= Number(max_h)) {
                            count_h_color = max_h;
                        }
                        if (Number(count_v_color) <= Number(bodyIdx.querySelector('.s' + '-' + time).innerText)) {
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
        generateColorSummary(all_count_v_color, all_count_h_color);
    }

    function createProgQuestion(data) {

        let prog_elem = document.getElementById('progress-question');
        prog_elem.innerHTML = '';
        let sum_prog_elem = document.getElementById('summary-progress');
        sum_prog_elem.innerHTML = '';
        let count = 0;
        let sum_score = 0;
        let percent_summary = 0;
        for (let i in data) {
            count = count += data[i].doc_count * 5;
            sum_score = sum_score += data[i].que_sum_score;
            percent_summary = Math.floor(sum_score / count * 100);
            if (data[i].que_sum_score == 0) {
                var percent_value = " - ";
            } else {
                var percent_value = Math.floor(data[i].que_sum_score / (data[i].doc_count * 5) * 100);
            }
            let progress_element = `<div class="form-group">
                        <label class="label-title"> ` + data[i].q_num + `. ` + data[i].question[0] + ` </label>
                        <div class="progress col-lg-10" style="padding:0">
                            <div class="progress-bar color-intensity-2" role="progressbar" 
                            aria-valuenow="` + percent_value + `"
                                            aria-valuemin="0" aria-valuemax="100" 
                            style="width:` + percent_value + `%">
                                <span class="progress-value">` + percent_value + `%</span>
                            </div>
                        </div>
                        <span class="col-lg-2 ">` + data[i].que_sum_score + '/' + data[i].doc_count * 5 + `</span>
                    </div>`;
            // 5 is max score 
            prog_elem.insertAdjacentHTML('beforeend', progress_element);
        }
        let createSumProgElem = `<div class="progress margin-top-1 col-lg-10" style="padding:0">
                    <div class="progress-bar color-intensity-3" role="progressbar" aria-valuenow="` + percent_summary + `"
                                    aria-valuemin="0" aria-valuemax="100" style="width:` + percent_summary + `%">
                        <span class="progress-value"><b>` + percent_summary + `%</b></span>
                    </div>
                </div>
                <span class="col-lg-2 progress-number">` + sum_score + '/' + count + `</span>`;
        sum_prog_elem.insertAdjacentHTML('beforeend', createSumProgElem);
    }

    function addFilter() {

        let FormDIV = document.getElementById('filterForm'); // clone div filter dropdown
        let cln = FormDIV.cloneNode(true); //set id in filterform
        cln.id = "form" + IDform;
        let selectElem = cln.getElementsByTagName('select');
        selectElem[selectElem.length - 1].innerHTML = '';
        let div_elem = cln.getElementsByTagName('div');
        let createDefultOpt = `<option selected disabled value=''>-- Select --</option>`;
        selectElem[selectElem.length - 1].insertAdjacentHTML('beforeend', createDefultOpt);
        cln.getElementsByTagName('label')[0].innerHTML = ''; // clear text of label

        for (let i = 0; i < selectElem.length; i++) {
            selectElem[i].id = selectElem[i].id + IDform; /// add id of <select> <= value , branch
            div_elem[i].id = div_elem[i].id + IDform; /// add id of <select> <= divvalue , divbranch
        }

        let lastDiv = cln.getElementsByTagName('div');
        lastDiv = lastDiv[lastDiv.length - 1];
        let icon_remove = `<i class="fa fa-minus-circle minus-btn"
                            id="addBtn" onclick = removeForm("form"+` + IDform + `);
                            aria-hidden="true"></i>`;

        lastDiv.insertAdjacentHTML('beforeend', icon_remove);
        formSelect.appendChild(cln);
        IDform += 1;
    }

    function checkState() {

        if (getSelectBranch.value !== '' && getSelectValue.value !== '' && formbusiness.value !== '') {
            document.getElementById('buttonShow').disabled = false;
        } else {
            document.getElementById('buttonShow').disabled = true;
        }
    }

    function removeForm(id) {
        let parentFilter = document.getElementById('formSelect');
        parentFilter.removeChild(document.getElementById(id));
    }

    function scrollToTop() {

        $("html,body").animate({
            scrollTop: $("html,body").offset().top
        }, "1000");
    }


    function createall(data, callback) {

        let containerQuestion = document.getElementById('question-all');
        while (containerQuestion.hasChildNodes()) {
            containerQuestion.removeChild(containerQuestion.lastChild);
        }

        for (let i = 0; i < data.length; i++) {
            let creatediv = document.createElement('DIV');
            creatediv.className = 'row';
            creatediv.innerHTML = `
                <div class="panel panel-default panel-body">
                    <h3> ` + data[i].q_num + `. ` + data[i].question[0] + `</h3>
                    <div class="col-md-8">
                        <div id="container-1-q` + data[i].q_num + `"></div>
                    </div>
                    <div class="col-md-4">
                        <div id="container-2-q` + data[i].q_num + `"></div>
                    </div>

                    <!--taboe-->
                    <div class="col-md-12 table-style" >
                        <table style="width:100%" class="margin-top-5">
                            <thead>
                                <tr>
                                    <td rowspan="2"></td>
                                    <td colspan="5" class="border-right">
                                        <b>Male </b> 
                                    </td>
                                    <td colspan="5" class="border-right">
                                        <b>Female</b>  
                                    </td>
                                    <td colspan="5" class="border-right">
                                        <b>Un-Identified</b>  
                                    </td>
                                    <td rowspan="2"></td>
                                </tr>
                                <tr>
                                    <td>Love</td><td>Like</td><td>Normal</td><td>Dislike</td><td class="border-right">Upset</td>
                                    <td>Love</td><td>Like</td><td>Normal</td><td>Dislike</td><td class="border-right">Upset</td>
                                    <td>Love</td><td>Like</td><td>Normal</td><td>Dislike</td><td class="border-right">Upset</td>
                                    
                                </tr>
                            </thead>
                            <tbody id = "table-body-q` + data[i].q_num + `" class = "tbody-value"> 

                            </tbody>
                            <tbody  class="border-disable summary-row" id = "summary-q` + data[i].q_num + `"> 
                                
                            </tbody>
                        </table>
                    </div>
                </div>`;
            containerQuestion.appendChild(creatediv);
        }
        callback();
    }