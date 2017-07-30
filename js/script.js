    "use strict";
    if (localStorage.idToken != null) {
        $('body').show();
    } else {
        window.location = "http://survey-report.dev.triple3.io";
    }

    let time_list = [{"name": "12:00 AM","value": "24"}, {"name": "1:00 AM","value": "1"}, {"name": "2:00 AM","value": "2"}, {"name": "3:00 AM","value": "3"}, {"name": "4:00 AM","value": "4"}, {"name": "5:00 AM","value": "5"}, { "name": "6:00 AM","value": "6"}, {"name": "7:00 AM","value": "7"}, {"name": "8:00 AM","value": "8"}, {"name": "9:00 AM","value": "9"}, {"name": "10:00 AM","value": "10"}, {"name": "11:00 AM","value": "11"}, {"name": "12:00 PM","value": "12"}, {"name": "1:00 PM","value": "13"}, {"name": "2:00 PM","value": "14"}, {"name": "3:00 PM","value": "15"}, {"name": "4:00 PM","value": "16"}, {"name": "5:00 PM","value": "17"}, {"name": "6:00 PM","value": "18"}, {"name": "7:00 PM","value": "19"}, {"name": "8:00 PM","value": "20"}, {"name": "9:00 PM","value": "21"}, {"name": "10:00 PM","value": "22"}, {"name": "11:00 PM","value": "23"}];

    let categories = ['55+', '45-54', '35-44', '25-34', '18-24', 'Under 18'];
    let formbusiness = document.getElementById('formbusiness');
    let formSelect = document.getElementById('formSelect');
    let blackdrop = document.getElementById('blackdrop');
    let is_completed;
    let is_identified;
    let branch_list = {};
    let IDform = 0;
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

    let arr_filter_select = [];
    let tag = {};
    
    let print_data = {};
    var model = {

        redirect: function(){
            window.location = "http://survey-report.dev.triple3.io";
        },

        getDate: function (start, end) {
            $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
            startdate = start.unix() * 1000;
            enddate = end.unix() * 1000;
            return startdate, enddate;
        },
        refreshToken: function (com, iden) {
            $.ajax({
                crossDomain: true,
                url: "https://a0n3yz3jbj.execute-api.ap-southeast-1.amazonaws.com/prod/v2/token/refresh",
                type: "POST",
                dataType: 'json',
                headers: {
                    "Content-Type": 'application/json; charset=utf-8',
                    "Authorization": localStorage.refreshToken
                },
                data: JSON.stringify({
                    username: localStorage.user
                }),
                processData: false,
                success: function (response) {
                    localStorage.idToken = response.data.idToken;
                    if (com != null) {
                        model.fetchAPI(com, iden);
                    } else {
                        model.onloadFetch();
                    };
                },
                error: function () {
                    localStorage.clear();
                    model.redirect(); // redirect to index.html
                }
            });
        },

        onloadFetch: function () {
            document.getElementById('blackdrop').style.display = 'block';
            $.ajax({
                url: "https://a0n3yz3jbj.execute-api.ap-southeast-1.amazonaws.com/prod/v2/selector/form?business=" + localStorage.business,
                type: "GET",
                dataType: 'json',
                headers: {
                    "Content-Type": 'application/json; charset=utf-8',
                    "Authorization": localStorage.idToken
                },
                error: function (xhr, textStatus, errorThrown) {
                    model.refreshToken();
                },
                success: function (result) {
                    let form_list = result.data;
                    let key = [],
                        value = [];
                    for (let i in form_list) {
                        key.push(form_list[i].FormId);
                        value.push(form_list[i].FormName);
                    }
                    view.createFormList(key, value, formbusiness);
                    checkState();
                }
            }).done(function () {}).then(function (){
                document.getElementById('blackdrop').style.display = 'none';
            });
            $.ajax({
                url: "https://a0n3yz3jbj.execute-api.ap-southeast-1.amazonaws.com/prod/v2/selector/tags?business=" + localStorage.business,
                type: "GET",
                dataType: 'json',
                headers: {
                    "Content-Type": 'application/json; charset=utf-8',
                    "Authorization": localStorage.idToken
                },
                success: function (data) {
                    branch_list = data.data;
                }
            });
        },
        fetchAPI: function (show) {
            print_data = {
                "graphSum1":[],
                "graphSum2":[],
                "score":[],
                "graph":[],
                "graphEmotion" : [],
                "table" : []
            };
            if(localStorage.idToken == null){
                model.redirect();
            }
            let checkboxValue = ctrl.getValueCheckbox();
            let com = checkboxValue[0];
            let iden = checkboxValue[1];

            let filter_div = document.querySelectorAll('.filter-div');
            let arr = [];
            for (let i = 0; i < filter_div.length; i++) {
                let get_branch = filter_div[i].querySelector('.branchs');
                let get_value = filter_div[i].querySelector('.values');
                if (get_branch.value.length > 0 && get_value.value.length > 0) {
                    arr.push(get_value.value);
                    let key = get_branch.value.toLowerCase();
                    tag[key] = arr
                }
            }
            if (show) {
                com = '*';
                iden = '*';
                for (let i = 1; i <= 4; i++) {
                    document.getElementById('inlineCheckbox' + i).checked = true;
                }
            }
            document.getElementById('blackdrop').style.display = 'block';
            let param_with_filter = {
                "startdate": startdate,
                "enddate": enddate,
                "form": formbusiness.value,
                "tags": tag,
                "is_completed": com,
                "is_identified": iden
            };

            //data for Print
            print_data.startdate = startdate;
            print_data.enddate = enddate;
            print_data.form = formbusiness.options[formbusiness.selectedIndex].text; 
            print_data.tags = tag;

            let header = {
                "Content-Type": 'application/json; charset=utf-8',
                "Authorization": localStorage.idToken

            };
            $.ajax({
                crossDomain: true,
                url: "https://a0n3yz3jbj.execute-api.ap-southeast-1.amazonaws.com/prod/v2/selector/filter",
                headers: header,
                type: "POST",
                processData: false,
                data: JSON.stringify({
                "startdate": startdate,
                "enddate": enddate,
                "form": formbusiness.value,
                "tags": tag
            }),
                error: function (xhr, textStatus, errorThrown) {
                    model.refreshToken(com, iden);
                }
            }).done(function (response) {
                countFilter = response.data;
                print_data.filter = response.data;
                view.countForm();
            });
            // Progress Score
            $.ajax({
                crossDomain: true,
                url: "https://a0n3yz3jbj.execute-api.ap-southeast-1.amazonaws.com/prod/v2/overall/score-graph",
                headers: header,
                type: "POST",
                processData: false,
                data: JSON.stringify(param_with_filter),
                success: function (response) {

                    if (response.data[0].que_sum_score == 0) {

                        view.display('hide');
                        document.getElementById('showForm').style.display = 'block';
                        document.getElementById('blackdrop').style.display = 'none';
                    } else {

                        view.display('show');
                        print_data.score = response.data;
                        createProgQuestion(response.data);
                        createProgMax5(response.data);
                        // document.getElementById('blackdrop').style.display = 'none';
                    }

                    if (!response.success) {
                        view.display('hide');
                        document.getElementById('showForm').style.display = 'block';
                        document.getElementById('blackdrop').style.display = 'none';
                    } else {
                        createquestionstarter(response.data, function () {
                            // Graph Emotion Gender
                            $.ajax({
                                crossDomain: true,
                                url: "https://a0n3yz3jbj.execute-api.ap-southeast-1.amazonaws.com/prod/v2/summary/question",
                                headers: header,
                                type: "POST",
                                processData: false,
                                data: JSON.stringify(param_with_filter),
                                success: function (response) {

                                    print_data.graphEmotion = response.data;
                                    sum_question = response.data;
                                    // this error handler No Data!
                                },
                                error: function (xhr, textStatus, errorThrown) {
                                    model.refreshToken(com, iden);
                                }
                            }).done(function () {
                                createSummaryQuestion();
                            });
                            // Table
                            $.ajax({
                                crossDomain: true,
                                url: "https://a0n3yz3jbj.execute-api.ap-southeast-1.amazonaws.com/prod/v2/summary/question-table",
                                headers: header,
                                type: "POST",
                                processData: false,
                                data: JSON.stringify(param_with_filter),
                                success: function (response) {

                                    print_data.table = response.data;
                                    sum_question_table = response.data;
                                },
                                error: function (xhr, textStatus, errorThrown) {
                                    model.refreshToken(com, iden);
                                }
                            }).done(function () {
                                view.removeTable();
                            });

                            // LINE GRAPH Each question
                            $.ajax({
                                crossDomain: true,
                                url: "https://a0n3yz3jbj.execute-api.ap-southeast-1.amazonaws.com/prod/v2/summary/question-graph",
                                headers: header,
                                type: "POST",
                                processData: false,
                                data: JSON.stringify(param_with_filter),
                                success: function (response) {
                                    print_data.graph = response.data;
                                    sum_question_graph = response.data;
                                },
                                error: function (xhr, textStatus, errorThrown) {
                                    model.refreshToken(com, iden);
                                }
                            }).done(function () {
                                createSummaryQuestionGraph();
                            });
                            //  P' Kwan API
                            //Summary -Question - Graph
                            $.ajax({
                                crossDomain: true,
                                url: "https://a0n3yz3jbj.execute-api.ap-southeast-1.amazonaws.com/prod/v2/overall/age-graph",
                                headers: header,
                                type: "POST",
                                processData: false,
                                data: JSON.stringify(param_with_filter),
                                success: function (response) {

                                    print_data.graphSum2 = response.data;
                                    sum_gender = response.data;
                                }
                            }).done(function () {
                                createGenderGraph();
                            });
                            // Line Graph 
                            $.ajax({
                                crossDomain: true,
                                url: "https://a0n3yz3jbj.execute-api.ap-southeast-1.amazonaws.com/prod/v2/overall/gender-graph/",
                                headers: header,
                                type: "POST",
                                processData: false,
                                data: JSON.stringify(param_with_filter),
                                success: function (response) {
                                    print_data.graphSum1 = response.data;
                                    sum_gender_line = response.data;
                                }
                            }).done(function (response) {

                                createGenderLineGrape();
                                createGenderLineGrapeShowAvg();
                            });

                        });
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    // model.refreshToken('click');
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
                let total = countFilter[0].is_completed.true + countFilter[0].is_completed.false;
                let per_com_true = (countFilter[0].is_completed.true / total * 100).toFixed(2);
                if (isNaN(per_com_true)) per_com_true = 0;
                let per_com_false = (countFilter[0].is_completed.false / total * 100).toFixed(2);
                if (isNaN(per_com_false)) per_com_false = 0;
                let per_iden_true = (countFilter[0].is_identified.true / total * 100).toFixed(2);
                if (isNaN(per_iden_true)) per_iden_true = 0;
                let per_iden_false = (countFilter[0].is_identified.false / total * 100).toFixed(2);
                if (isNaN(per_iden_false)) per_iden_false = 0;

                if (i === 1) { // Total
                    elemnumber.innerText = countFilter[0].is_completed.true + countFilter[0].is_completed.false;
                } else if (i === 2) { // Complete Form
                    elemnumber.innerText = countFilter[0].is_completed.true + " form(s) \u2014 " + per_com_true + "%";

                } else if (i === 3) { // Un-Complete Form
                    elemnumber.innerText = countFilter[0].is_completed.false + " form(s) \u2014 " + per_com_false + "%";

                } else if (i === 4) { // Identify Form 
                    elemnumber.innerText = countFilter[0].is_identified.true + " form(s) \u2014 " + per_iden_true + "%";

                } else { // Un-Identify Form
                    elemnumber.innerText = countFilter[0].is_identified.false + " form(s) \u2014 " + per_iden_false + "%";

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
                pos.style.setProperty("background", "rgb(241,248,255)", "important");
            } else if (percent > 25 && percent <= 50) {
                pos.style.setProperty("background", "rgb(215,236,255)", "important");
            } else if (percent > 50 && percent <= 75) {
                pos.style.setProperty("background", "rgb(190,224,255)", "important");
            } else if (percent > 75 && percent <= 99) {
                pos.style.setProperty("background", "rgb(164,212,255)", "important");
            } else if (percent == 100) {
                pos.style.setProperty("background", "#93bee5", "important");
            }
        },
        precreateTable: function () {
            let score = [5, 4, 3, 2, 1];
            let gender = ['m', 'f', 'u']; // m = male  f = femalle u = unknow s = summary
            let allbody = document.querySelectorAll('.tbody-value');
            for (let b = 0; b < allbody.length; b++) {
                for (let i in time_list) {
                    let tr1 = document.createElement('tr');
                    tr1.innerHTML = `<td class="time-`+ time_list[i].value +`"><b>` + time_list[i].name + `</b></td>`;
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
                $('all_body_table[i]').innerHTML = '';
            }
            for (let i = 0; i < all_row.length; i++) {
                $('all_row[i]').innerHTML = '';
            }
            view.precreateTable();
        }
    };

    var ctrl = {
        getCheckbox: function (id) {    
            if (document.querySelector('#inlineCheckbox1').checked === false && 
                document.querySelector('#inlineCheckbox2').checked === false) {
                
                if (id[id.length - 1] === '1') {
                    document.querySelector('#inlineCheckbox2').checked = true;
                } else {
                    document.querySelector('#inlineCheckbox1').checked = true;
                }
            }
            if (!document.querySelector('#inlineCheckbox3').checked && 
                !document.querySelector('#inlineCheckbox4').checked) {

                if (id[id.length - 1] === '3') {
                    document.querySelector('#inlineCheckbox4').checked = true;
                } else {
                    document.querySelector('#inlineCheckbox3').checked = true;
                }
            }
            model.fetchAPI();
        },

        getValueCheckbox:function(){
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
            if (document.querySelector('#inlineCheckbox1').checked && 
                document.querySelector('#inlineCheckbox2').checked) {
                is_completed = '*';
            }
            if (document.querySelector('#inlineCheckbox3').checked && 
                document.querySelector('#inlineCheckbox4').checked) {
                is_identified = '*';
            }
            return [is_completed,is_identified];
        },

        exportPDF:function(){
            sessionStorage.data = JSON.stringify(print_data);
            let scoreElem = document.getElementById('scoreCard');
            let graphElem = document.getElementById('graphCard');
            let findSpace = scoreElem.className.indexOf(' ');
            let findSpaceGraph = graphElem.className.indexOf(' ');
            if(findSpace == -1){
                sessionStorage.score = 'front';
            }else{
                sessionStorage.score = 'back';
            }
            if(findSpaceGraph == -1){
                sessionStorage.graph = 'front';
            }else{
                sessionStorage.graph = 'back';
            }

            let res = document.URL.replace("index", "print");
            window.open(res, '_blank');
        },

        exportExcel: function () {

            //redraw animation
            let elm = document.getElementById('checkAnimate');
            let newone = elm.cloneNode(true);
            elm.parentNode.replaceChild(newone, elm);

            let checkboxValue = ctrl.getValueCheckbox();
            let com = checkboxValue[0];
            let iden = checkboxValue[1];
            document.getElementById('checkAnimate').style.display = 'block';
            $.ajax({
                crossDomain: true,
                url: "https://a0n3yz3jbj.execute-api.ap-southeast-1.amazonaws.com/prod/v2/export/excel",
                headers: {
                    "Content-Type": 'application/json; charset=utf-8',
                    "Authorization": localStorage.token
                },
                type: "POST",
                processData: false,
                data: JSON.stringify({
                    "startdate": startdate,
                    "enddate": enddate,
                    "form": formbusiness.value,
                    "tags" : tag,
                    "is_completed": com,
                    "is_identified": iden,
                    "email":document.getElementById('email').value
                }),
                success: function (response) {
                   
                }
            }).done(function (response) {});
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



    function generateColorSummary(vcol, hrow) {

        let totalelem = document.querySelectorAll('.total-summary');
        for (let z = 0; z < totalelem.length; z++) {
            /// length = 5 all table
            let idTable = document.getElementById('table' + z);
            let eachRow = idTable.querySelectorAll('.sum-row');
            let eachCol = idTable.querySelectorAll('.sum-col');
            for (let i in eachCol) { // loop 120 time 

                let valueOfEachCol = Number(eachCol[i].innerHTML);
                let percent = Math.floor((valueOfEachCol / vcol[z]) * 100);
                if (typeof eachCol[i] !== 'undefined' && !isNaN(percent)) {
                    
                    let class_of_score = '';
                    let class_name = '';
                    let elem_score_table = '';
                    // If below is for set color in thead  = Love,Like,Normal,Dislike,Upset
                    if(eachCol[i].className[0] === 's'){
                        let spacePosition = eachCol[i].className.indexOf(' ');
                        
                        if (spacePosition !== -1){

                            class_name = eachCol[i].className.substr(0, spacePosition); /// s-{time}
                            class_of_score = 'time' + class_name.slice(1);
                            elem_score_table = idTable.querySelector('.'+class_of_score);
                        }
                        view.setColor(elem_score_table, percent);
                    }
                    view.setColor(eachCol[i], percent);
                }
            }
            for (let i in eachRow) {

                let valueOfEachRow = Number(eachRow[i].innerHTML);
                let percent = Math.floor(valueOfEachRow / hrow[z] * 100);
                if (typeof eachRow[i] !== 'undefined' && !isNaN(percent)) {
                    
                    let class_of_score = '';
                    let class_name = '';
                    let elem_score_table = '';
                    // If below is for set color in thead  = Love,Like,Normal,Dislike,Upset
                    if(eachRow[i].className[0] != 's'){
                        let spacePosition = eachRow[i].className.indexOf(' ');
                        
                        if (spacePosition !== -1){
                            class_name = eachRow[i].className.substr(0, spacePosition);
                            class_of_score = class_name[0]+ '-' + class_name[class_name.length - 1];
                            elem_score_table = idTable.querySelector('.'+class_of_score);
                        }
                        view.setColor(elem_score_table, percent);
                    }
                    
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
                } else if (sum_gender_line[i].key === 'undefined') {
                    //sum_gender_line[i][j][z]) == {count , datetime}
                    all_unknow_arr.push([timestamp, sum_gender_line[i].interval_date[j].amount]);
                }
            }
        }
        // 
        generateSumLineGraph(all_gender_arr,all_men_arr,all_women_arr,all_unknow_arr,'scoresummary');
    }

    function createGenderLineGrapeShowAvg() {

        let all_gender_arr = [];
        let all_men_arr = [];
        let all_women_arr = [];
        let all_unknow_arr = [];

        let value_avg = 0;
        for (let i in sum_gender_line) {
            // sum_gender_line[i] Object of m ,f ,all "key" == m/f/n
            for (let j in sum_gender_line[i].interval_date) {
                //j = 'male' , 'female','all'
                var timestamp = moment.utc(sum_gender_line[i].interval_date[j].datetime).valueOf();
                if (sum_gender_line[i].key === 'male') {
                    
                    value_avg = Math.round(sum_gender_line[i].interval_date[j].avg * 1e2) / 1e2;
                    all_men_arr.push([timestamp, value_avg]);
                } else if (sum_gender_line[i].key === 'female') {
                    
                    value_avg = Math.round(sum_gender_line[i].interval_date[j].avg * 1e2) / 1e2;
                    all_women_arr.push([timestamp, value_avg]);
                } else if (sum_gender_line[i].key === 'all') {
                    
                    value_avg = Math.round(sum_gender_line[i].interval_date[j].avg * 1e2) / 1e2;
                    all_gender_arr.push([timestamp, value_avg]);
                } else if (sum_gender_line[i].key === 'undefined') {
                    
                    value_avg = Math.round(sum_gender_line[i].interval_date[j].avg * 1e2) / 1e2;
                    all_unknow_arr.push([timestamp, value_avg]);
                }
            }
        }
    
        generateSumLineGraph(all_gender_arr,all_men_arr,all_women_arr,all_unknow_arr,'scoresummaryshowavg','max5'); 
    }

    function generateSumLineGraph(all,men,women,unknow,chartname,type){

        let start_only_date = moment(startdate).format('LL');
        let end_only_date = moment(enddate).format('LL');
        let chartOption = {
             
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
                    data: all,
                    color: '#000'
                }, {
                    name: 'Male',
                    data: men,
                    color: '#2980b9'
                }, {
                    name: 'Female',
                    data: women,
                    color: '#E08283'
                }, {
                    name: 'Un-Identified',
                    data: unknow,
                    color: '#aaa'
                }]

            }
    if(type !== 'max5'){
        if(start_only_date !== end_only_date){
            Highcharts.chart(chartname, chartOption);
        }else{
            chartOption.chart = {type : 'column'};
            Highcharts.chart(chartname, chartOption);
        }
    }else{

        if(start_only_date !== end_only_date){

            chartOption.yAxis = {max : 5};
            Highcharts.chart(chartname, chartOption);
        }else{
            
            chartOption.chart = {type : 'column'};
            chartOption.yAxis = {max : 5};
            Highcharts.chart(chartname, chartOption);
        }
    }
        
        document.getElementById('blackdrop').style.display = 'none'
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
                    type: 'column',
                    marginBottom: 50
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

    function createProgMax5(data) {

        let prog_elem = document.getElementById('progress-question-max5');
        prog_elem.innerHTML = '';
        let sum_prog_elem = document.getElementById('summary-progress-max5');
        sum_prog_elem.innerHTML = '';
        let count = 0;
        let max5_count = 0;

        let max5_color = 0;
        let max5_image = 0;

        let sum_score = 0;
        let max5_sum_score = 0;
        let max5 = 0 ;
        let percent_value = 0;
        let percent_summary = 0;
        for (let i in data) {
            count = count += data[i].doc_count * 5;
            sum_score = sum_score += data[i].que_sum_score;
            percent_summary = Math.floor(sum_score / count * 100);
            if (data[i].que_sum_score == 0) {
                percent_value = " - ";
                max5 = " - ";
                max5_image = " - ";
            } else {
                percent_value = Math.floor(data[i].que_sum_score / (data[i].doc_count * 5) * 100);
                max5 = (data[i].que_sum_score / (data[i].doc_count * 5) * 5).toFixed(2);

                max5_sum_score += 5;
                max5_count = max5_count + data[i].que_sum_score / (data[i].doc_count * 5) * 5;
                if(Math.floor(max5) == 5){
                    max5_color = '#004384 !important';
                    max5_image = '<img src="img/point5.svg" class="emotion-progress"/>';
                }else if(Math.floor(max5) == 4){
                    max5_color = '#96cfea !important';
                    max5_image = '<img src="img/point4.svg" class="emotion-progress"/>';
                }else if(Math.floor(max5) == 3){
                    max5_color = '#f0c514 !important';
                    max5_image = '<img src="img/point3.svg" class="emotion-progress"/>';
                }else if(Math.floor(max5) == 2){
                    max5_color = '#e67e22 !important';
                    max5_image = '<img src="img/point2.svg" class="emotion-progress"/>';
                }else if(Math.floor(max5) == 1){
                    max5_color = '#e84c3c !important';
                    max5_image = '<img src="img/point1.svg" class="emotion-progress"/>';
                }
            }
            let progress_element = `<div class="form-group">
                <label class="label-title"> ` + data[i].q_num + ". " + data[i].question[0] + `</label>
                <div class="progress col-lg-10" style="padding:0">
                    <div class="progress-bar color-intensity-2" role="progressbar" aria-valuenow="` + percent_value + `" "aria-valuemin="0" aria-valuemax="100" style="width:` + percent_value + `%; background-color:` + max5_color + `; ">
                    <span class="progress-value">`+ max5_image +`</span>
                    </div>
                </div>
                    <span class="col-lg-2 ">` + max5 + '/5' + `</span>
                </div>`;
            // 5 is max score 
            prog_elem.insertAdjacentHTML('beforeend', progress_element);
        }
        let sum_max5 = (max5_count / max5_sum_score * 5).toFixed(2);
        if(Math.floor(sum_max5) == 5){
            max5_color = '#004384 !important';
            max5_image = '<img src="img/point5.svg" class="emotion-progress"/>';
        }else if(Math.floor(sum_max5) == 4){
            max5_color = '#96cfea !important';
            max5_image = '<img src="img/point4.svg" class="emotion-progress"/>';
        }else if(Math.floor(sum_max5) == 3){
            max5_color = '#f0c514 !important';
            max5_image = '<img src="img/point3.svg" class="emotion-progress"/>';
        }else if(Math.floor(sum_max5) == 2){
            max5_color = '#e67e22 !important';
            max5_image = '<img src="img/point2.svg" class="emotion-progress"/>';
        }else if(Math.floor(sum_max5) == 1){
            max5_color = '#e84c3c !important';
            max5_image = '<img src="img/point1.svg" class="emotion-progress"/>';
        }
        let createSumProgElem = `<div class="progress margin-top-1 col-lg-10" style="padding:0">                                                <div class="progress-bar color-intensity-3" role="progressbar" 
                                        aria-valuenow="` + percent_summary + `" aria-valuemin="0" aria-valuemax="100" style="width:` + percent_summary + `%;background-color:`+ max5_color +`;">
                                    <span class="progress-value"><b>` + max5_image + `</b></span>
                                    </div>
                                </div>
                                <span class="col-lg-2 progress-number">` + (max5_count / max5_sum_score * 5).toFixed(2) + '/5' + `</span>`;
        sum_prog_elem.insertAdjacentHTML('beforeend', createSumProgElem);
    }
    function flip(id) {
        $('#'+id).toggleClass('flipped');
    }

    function addFilter() {

        let filterString = `
                            <div class="form-group filter-div">
                                <label for="branch" class="col-lg-2 control-label label-filter"></label>
                                    <div class="col-lg-4 col-branch" id="branchDiv0">
                                        <select class="form-control branchs" id="branch` + IDform + `" name="branch" onchange="getValueList(value , id);checkState()" autocomplete="off">
                                            <option selected disabled value='' >-- Select --</option>
                                        </select>
                                    </div>
                                    <div class="col-lg-6 col-value" id="valueDiv0">
                                        <select class="form-control values" id="values` + IDform + `" onchange="checkState()" autocomplete="off">
                                            <option selected disabled value=''>-- Select --</option>
                                        </select>
                                        <i class="fa fa-minus-circle minus-btn"
                                        id="addBtn" onclick = removeForm("form` + IDform + `");
                                        aria-hidden="true"></i>
                                    </div>
                            </div>`;
        let formFieldset = document.getElementById('formSelect');
        let elementFilter = document.createElement('div');
        elementFilter.id = "form" + IDform;
        elementFilter.className = "form";
        elementFilter.innerHTML = filterString;
        formFieldset.appendChild(elementFilter);

        formFieldset.getElementsByTagName('label')[1].innerHTML = "Filter : ";
        let getSelectBranch = document.getElementById('branch' + IDform);
        let key = [];
        for (let i in branch_list) {
            key.push(i.charAt(0).toUpperCase() + i.slice(1));
        }
        view.createFormList(key, key, getSelectBranch);
        IDform += 1;

    }

    function removeForm(id) {

        let parentFilter = document.getElementById('formSelect');
        let idElem = document.getElementById(id);
        let arr_select_idElem = idElem.getElementsByTagName('select')
        let brach_for_del = arr_select_idElem[0].value;
        let value_for_del = arr_select_idElem[1].value;
        if (!$.isEmptyObject(tag) && brach_for_del.length > 0) // = already value in 'tag'
        {
            let idx = tag[brach_for_del.toLowerCase()].indexOf(value_for_del);
            if(idx != -1){

                tag[brach_for_del.toLowerCase()].splice(idx, 1);
            }
            if(tag[brach_for_del.toLowerCase()].length === 0){
                delete tag[brach_for_del.toLowerCase()];
            }
        }
        parentFilter.removeChild(document.getElementById(id));
        if (parentFilter.getElementsByTagName('label').length > 1) {
            parentFilter.getElementsByTagName('label')[1].innerHTML = "Filter : ";
        }
    }

    function checkState() {

        if (formbusiness.value !== '') {
            document.getElementById('buttonShow').disabled = false;
        } else {
            document.getElementById('buttonShow').disabled = true;
        }
    }

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

    function scrollToTop() {

        $("html,body").animate({
            scrollTop: $("html,body").offset().top
        }, "1000");
    }


    function createquestionstarter(data, callback) {

        let containerQuestion = document.getElementById('question-all');
        containerQuestion.innerHTML = '';

        for (let i = 0; i < data.length; i++) {
            let creatediv = document.createElement('DIV');
            creatediv.className = 'row';
            creatediv.innerHTML = `
                <div class="panel panel-default panel-body question">
                    <h3> ` + data[i].q_num + `. ` + data[i].question[0] + `</h3>
                    <div class="col-md-8 graph2">
                        <div id="container-1-q` + data[i].q_num + `" style="width:100%; min-width: 310px; margin: 0 auto"></div>
                    </div>
                    <div class="col-md-4 graph3">
                        <div id="container-2-q` + data[i].q_num + `" style="width:100%; min-width: 310px; margin: 0 auto"></div>
                    </div>

                    <!--table-->
                    <div class="col-md-12 table-style" >
                        <table style="width:100%" class="margin-top-5" id = "table` + i + `">
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
                                    <td class="m-5">Love</td><td class="m-4">Like</td><td class="m-3">Normal</td><td class="m-2">Dislike</td><td class="border-right m-1">Upset</td>
                                    <td class="f-5">Love</td><td class="f-4">Like</td><td class="f-3">Normal</td><td class="f-2">Dislike</td><td class="border-right f-1">Upset</td>
                                    <td class="u-5">Love</td><td class="u-4">Like</td><td class="u-3">Normal</td><td class="u-2">Dislike</td><td class="border-right u-1">Upset</td>
                                    
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



    function dropdownLogOut() {
        document.getElementById("myDropdown").classList.toggle("show");
        document.getElementById("myDropdownTri").classList.toggle("show");
    }
    // Close the dropdown menu if the user clicks outside of it
    window.onclick = function (event) {
    let matches = event.target.matches ? event.target.matches('.dropbtn') : event.target.msMatchesSelector('.dropbtn');
        if (!matches) {
            let dropdowns = document.getElementsByClassName("dropdown-content");

            for (let i = 0; i < dropdowns.length; i++) {
                let openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    }

// Fix popover show only in second click
    if ($.fn.popover.Constructor.VERSION == "3.3.7") {
        $('[data-toggle="popover"]').on("hidden.bs.popover", function() {
            $(this).data("bs.popover").inState.click = false
        })
    }

    $('#excelDialog').popover({
         trigger: 'click',
        title: `<h3>Export Excel</h3>`,
        content: `
                <form action="javascript:ctrl.exportExcel();" style="width:254px;">
                        <div class="form-group">
                            <div class="col-md-10" style="padding-right:0;padding-left:0;">
                                <input id="email" name="email" type="email" required placeholder="Your email" class="form-control"
                                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$" >
                            </div>
                            <div class="wrapper" id = "checkAnimate" style="display:none;float:right">
                                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                    viewBox="0 0 98.5 98.5" enable-background="new 0 0 98.5 98.5" xml:space="preserve">
                                    <path class="checkmark" fill="none" stroke-width="8" stroke-miterlimit="10" d="M81.7,17.8C73.5,9.3,62,4,49.2,4
                                    C24.3,4,4,24.3,4,49.2s20.3,45.2,45.2,45.2s45.2-20.3,45.2-45.2c0-8.6-2.4-16.6-6.5-23.4l0,0L45.6,68.2L24.7,47.3"/>
                                </svg>
                            </div>
                        </div>
                        <button class="btn btn-xs btn-primary btn-block" value="export" 
                            type="submit" style="padding: 5px;
                            float: right;
                            margin-top: 1em;
                            margin-bottom: 1em;">export</button>
                </form>`,
        placement: 'top',
        html: true
    });

    $('html').on('mouseup', function(e) {
        if(!$(e.target).closest('.popover').length) {
            $('.popover').each(function(){
                $(this.previousSibling).popover('hide');
            });
        }
    });

    function logout() {

        localStorage.clear();
        model.redirect();
    }
