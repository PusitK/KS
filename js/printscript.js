
let data = JSON.parse(sessionStorage.data);
for(let i in data.tags){
    data.tags[i] = Array.from(new Set(data.tags[i]));
} 

console.log(startdate);
let startdate = moment(data.startdate).format('LL');
let enddate = moment(data.enddate).format('LL');
let time_list = [{"name": "12:00 AM","value": "24"}, {"name": "1:00 AM","value": "1"}, {"name": "2:00 AM","value": "2"}, {"name": "3:00 AM","value": "3"}, {"name": "4:00 AM","value": "4"}, {"name": "5:00 AM","value": "5"}, { "name": "6:00 AM","value": "6"}, {"name": "7:00 AM","value": "7"}, {"name": "8:00 AM","value": "8"}, {"name": "9:00 AM","value": "9"}, {"name": "10:00 AM","value": "10"}, {"name": "11:00 AM","value": "11"}, {"name": "12:00 PM","value": "12"}, {"name": "1:00 PM","value": "13"}, {"name": "2:00 PM","value": "14"}, {"name": "3:00 PM","value": "15"}, {"name": "4:00 PM","value": "16"}, {"name": "5:00 PM","value": "17"}, {"name": "6:00 PM","value": "18"}, {"name": "7:00 PM","value": "19"}, {"name": "8:00 PM","value": "20"}, {"name": "9:00 PM","value": "21"}, {"name": "10:00 PM","value": "22"}, {"name": "11:00 PM","value": "23"}];

let view = {
    header: function () {
        if (startdate === enddate) {
            document.getElementById('date').innerHTML = 'Date : ' + startdate;
        } else {
            document.getElementById('date').innerHTML = 'Date : ' + startdate + ' - ' + enddate;
        }
        document.getElementById('form').innerHTML = 'Form : ' + data.form;
        let tags = document.getElementById('tags');

        for (let i in data.tags) {
            tags.innerHTML += i.charAt(0).toUpperCase() + i.slice(1) + " : ";

            for (let j = 0; j < data.tags[i].length; j++) {
                if (j === 0) {
                    tags.innerHTML += data.tags[i][j];
                } else {
                    tags.innerHTML += " , " + data.tags[i][j];
                }
            }
            tags.innerHTML += '</br>';
        }
    },
    filterForm: function () {
        //total form
        let total = document.getElementById('total');
        let isCompleted_true = document.getElementById('isCompleted_true');
        let isCompleted_false = document.getElementById('isCompleted_false');
        let isUnidentify_true = document.getElementById('isUnidentify_true');
        let isUnidentify_false = document.getElementById('isUnidentify_false');

        let total_number = (data.filter[0].is_completed.true + data.filter[0].is_completed.false);
        let per_com_true = (data.filter[0].is_completed.true / total_number * 100).toFixed(2);
        if (isNaN(per_com_true)) per_com_true = 0;
        let per_com_false = (data.filter[0].is_completed.false / total_number * 100).toFixed(2);
        if (isNaN(per_com_false)) per_com_false = 0;
        let per_iden_true = (data.filter[0].is_identified.true / total_number * 100).toFixed(2);
        if (isNaN(per_iden_true)) per_iden_true = 0;
        let per_iden_false = (data.filter[0].is_identified.false / total_number * 100).toFixed(2);
        if (isNaN(per_iden_false)) per_iden_false = 0;

        total.innerHTML = 'Total Form(s) : ' + (data.filter[0].is_completed.true + data.filter[0].is_completed.false) + ' form(s)';

        isCompleted_true.innerHTML = '<b>Complete Form</b> :' +
            data.filter[0].is_completed.true + ' form(s) \u2014 ' + per_com_true + "%";

        isCompleted_false.innerHTML = '<b>Un-Complete Form</b> :' +
            data.filter[0].is_completed.false + ' form(s) \u2014 ' + per_com_false + "%";

        isUnidentify_true.innerHTML = '<b>Identified Form</b> :' +
            data.filter[0].is_identified.true + ' form(s) \u2014 ' + per_iden_true + "%";

        isUnidentify_false.innerHTML = '<b>Un-Identified Form</b> :' +
            data.filter[0].is_identified.false + ' form(s) \u2014 ' + per_iden_false + "%";
    },
    createSummaryLineGraph : function(){
        let all_gender_arr = [];
        let all_men_arr = [];
        let all_women_arr = [];
        let all_unknow_arr = [];

        if(sessionStorage.graph === 'front'){
            for (let i in data.graphSum1) {
                for (let j in data.graphSum1[i].interval_date) {
                    var timestamp = moment.utc(data.graphSum1[i].interval_date[j].datetime).valueOf();
                    if (data.graphSum1[i].key === 'male') {
                        all_men_arr.push([timestamp, data.graphSum1[i].interval_date[j].amount]);
                    } else if (data.graphSum1[i].key === 'female') {
                        all_women_arr.push([timestamp, data.graphSum1[i].interval_date[j].amount]);
                    } else if (data.graphSum1[i].key === 'all') {
                        all_gender_arr.push([timestamp, data.graphSum1[i].interval_date[j].amount]);
                    } else if (data.graphSum1[i].key === 'undefined') {
                        all_unknow_arr.push([timestamp, data.graphSum1[i].interval_date[j].amount]);
                    }
                }
            }
            generate.graphSum1(all_gender_arr,all_men_arr,all_women_arr,all_unknow_arr,'sum_graph_line');
        }else{
            let value_avg = 0;
            for (let i in data.graphSum1) {
                for (let j in data.graphSum1[i].interval_date) {
                    var timestamp = moment.utc(data.graphSum1[i].interval_date[j].datetime).valueOf();
                    if (data.graphSum1[i].key === 'male') {
                        
                        value_avg = Math.round(data.graphSum1[i].interval_date[j].avg * 1e2) / 1e2;
                        all_men_arr.push([timestamp, value_avg]);
                    } else if (data.graphSum1[i].key === 'female') {
                        
                        value_avg = Math.round(data.graphSum1[i].interval_date[j].avg * 1e2) / 1e2;
                        all_women_arr.push([timestamp, value_avg]);
                    } else if (data.graphSum1[i].key === 'all') {
                        
                        value_avg = Math.round(data.graphSum1[i].interval_date[j].avg * 1e2) / 1e2;
                        all_gender_arr.push([timestamp, value_avg]);
                    } else if (data.graphSum1[i].key === 'undefined') {
                        
                        value_avg = Math.round(data.graphSum1[i].interval_date[j].avg * 1e2) / 1e2;
                        all_unknow_arr.push([timestamp, value_avg]);
                    }
                }
            }
            generate.graphSum1(all_gender_arr,all_men_arr,all_women_arr,all_unknow_arr,'sum_graph_line','max5');
        }
    },
    createSummaryGenderGraph : function(){

        let m_data = [];
        let f_data = [];
        let total = 0;
        var total_m = 0;
        var total_f = 0;

        for (let i = 0; i < data.graphSum2.length; i++) {
            for (let z = 0; z < data.graphSum2[i].age.length; z++) {
                if (data.graphSum2[i].gender === 'Female') {
                    total_f += data.graphSum2[i].age[z].count;
                } else if (data.graphSum2[i].gender === 'Male') {
                    total_m += data.graphSum2[i].age[z].count;
                }
                total += data.graphSum2[i].age[z].count;
            }
        }

        total = parseFloat(total);
        total_m = parseFloat(total_m);
        total_f = parseFloat(total_f);

        for (let i = 0; i < data.graphSum2.length; i++) {
            for (let z = 0; z < data.graphSum2[i].age.length; z++) {
                if (data.graphSum2[i].gender === 'Female') {
                    f_data.push(data.graphSum2[i].age[z].count / total_f * 100);
                } else if (data.graphSum2[i].gender === 'Male') {
                    m_data.push(-Math.abs(data.graphSum2[i].age[z].count / total_m * 100));
                }
            }
        }
        generate.graphSum2(m_data,f_data,total,total_m,total_f);
    },
    createScore : function(){

        if(sessionStorage.score === 'front'){
            let prog_elem = document.getElementById('score');
            let count = 0;
            let sum_score = 0;
            let percent_summary = 0;
            for (let i in data.score) {
                count = count += data.score[i].doc_count * 5;
                sum_score = sum_score += data.score[i].que_sum_score;
                percent_summary = Math.floor(sum_score / count * 100);
                if (data.score[i].que_sum_score == 0) {
                    var percent_value = " - ";
                } else {
                    var percent_value = Math.floor(data.score[i].que_sum_score / (data.score[i].doc_count * 5) * 100);
                }
                let progress_element = 
                        `<div class="dashboard-stat red-intense">
                            <h1 class="text-stat text-percent"><u style="margin-top:5px;" class="text-stat">` + percent_value + `%</u></h1>
                            <div class="details">
                                <div class="desc">
                                    <h3 style="margin-top: 3px;" class="text-stat">` + data.score[i].q_num + `. ` + data.score[i].question[0] + `</h3>
                                </div>
                                <div class="number">
                                    <h1 class="text-stat">` + data.score[i].que_sum_score + '/' + data.score[i].doc_count * 5 + `</h1>
                                </div>
                            </div>
                        </div>`
                // 5 is max score 
                prog_elem.insertAdjacentHTML('beforeend', progress_element);
            }
        }else{

            let prog_elem = document.getElementById('score');
            let count = 0;
            let max5_count = 0;
            let max5_color = 0;
            let max5_image = 0;
            let max5 = 0 ;
            let percent_value = 0;
            for (let i in data.score) {
                count = count += data.score[i].doc_count * 5;

                if (data.score[i].que_sum_score == 0) {
                    percent_value = " - ";
                    max5 = " - ";
                    max5_image = " - ";
                } else {
                    percent_value = Math.floor(data.score[i].que_sum_score / (data.score[i].doc_count * 5) * 100);
                    max5 = (data.score[i].que_sum_score / (data.score[i].doc_count * 5) * 5).toFixed(2);
                    max5_count = max5_count + data.score[i].que_sum_score / (data.score[i].doc_count * 5) * 5;
                    if(max5 >= 4.5){
                        max5_color = '#004384 !important';
                        max5_image = '<img src="img/point5-white.svg" width="60px"/>';
                    }else if(max5 >= 4 && max5 < 4.5){
                        max5_color = '#96cfea !important';
                        max5_image = '<img src="img/point4-white.svg" width="60px"/>';
                    }else if(Math.floor(max5) == 3){
                        max5_color = '#f0c514 !important';
                        max5_image = '<img src="img/point3-white.svg" width="60px"/>';
                    }else if(Math.floor(max5) == 2){
                        max5_color = '#e67e22 !important';
                        max5_image = '<img src="img/point2-white.svg" width="60px"/>';
                    }else if(Math.floor(max5) == 1){
                        max5_color = '#e84c3c !important';
                        max5_image = '<img src="img/point1-white.svg" width="60px"/>';
                    }
                }
                let progress_element = 
                    `<div class="dashboard-stat" style = "background-color:`+ max5_color +`">
                        <div class="visual">
                            `+ max5_image +`
                        </div>
                        <div class="details">
                            <div class="desc">
                                <h3 style="margin-top: 3px;" class="text-stat">` + data.score[i].q_num + ". " + data.score[i].question[0] + `</h3>
                            </div>
                            <div class="number">
                                <h1 class="text-stat">` + max5 + `</h1>
                            </div>
                        </div>
                    </div>`
                // 5 is max score 
                prog_elem.insertAdjacentHTML('beforeend', progress_element);
            }
        }
    },
    createTable : function(){

        let containerQuestion = document.getElementById('question');
        for (let i = 0; i < data.score.length; i++) {
            let creatediv = `
                
                <div class="col-md-12 margin-top-2 question">

                    <h3 class="margin-left-05"> ` + data.score[i].q_num + `. ` + data.score[i].question[0] + `</h3>
                    <div class="col-xs-8 graph2" style="padding:0">
                        <div id="container-1-q` + data.score[i].q_num + `" style="width:100%; margin: 0 auto;height:300px"></div>
                    </div>
                    <div class="col-xs-4 graph3" style="padding:0">
                        <div id="container-2-q` + data.score[i].q_num + `" style="width:100%;  margin: 0 auto; height:300px"></div>
                    </div>
                    <!--table-->
                    <div class="col-xs-12 table-style" >
                        <table style="width:100%" class="margin-top-1" id = "table` + i + `">
                            <thead>
                                <tr>
                                    <td rowspan="2"></td>
                                    <td colspan="5" class="border-right">
                                        Male  
                                    </td>
                                    <td colspan="5" class="border-right">
                                        Female  
                                    </td>
                                    <td colspan="5" class="border-right">
                                        Un-Identified  
                                    </td>
                                    <td rowspan="2"></td>
                                </tr>
                                <tr>
                                    <td class="m-5">Love</td><td class="m-4">Like</td><td class="m-3">Normal</td><td class="m-2">Dislike</td><td class="border-right m-1">Upset</td>
                                    <td class="f-5">Love</td><td class="f-4">Like</td><td class="f-3">Normal</td><td class="f-2">Dislike</td><td class="border-right f-1">Upset</td>
                                    <td class="u-5">Love</td><td class="u-4">Like</td><td class="u-3">Normal</td><td class="u-2">Dislike</td><td class="border-right u-1">Upset</td>
                                    
                                </tr>
                            </thead>
                            <tbody id = "table-body-q` + data.score[i].q_num + `" class = "tbody-value"> 

                            </tbody>
                            <tbody  class="border-disable summary-row" id = "summary-q` + data.score[i].q_num + `"> 
                                
                            </tbody>
                        </table>
                    </div>
                </div>`;
            containerQuestion.insertAdjacentHTML('beforeend', creatediv);
        }
        view.createInsideTable();
    },
    createInsideTable : function(){
        let score = [5, 4, 3, 2, 1];
        let gender = ['m', 'f', 'u']; // m = male  f = femalle u = unknow s = summary
        let allbody = document.querySelectorAll('.tbody-value');
        for (let b = 0; b < allbody.length; b++) {
            for (let i in time_list) {
                let tr1 = document.createElement('tr');
                tr1.innerHTML = `<td class="time-`+ time_list[i].value +`">` + time_list[i].name + `</td>`;
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
            trSum.innerHTML = `<td>Total</td>`;
            for (let x in gender) {
                for (let j in score) {

                    trSum.innerHTML += `<td class ="` + gender[x] + `-t-` + score[j] + ` sum-row"></td>`;
                }
            }
            trSum.innerHTML += `<td class="total-summary" id="sum-q` + (i + 1) + `" style="background:white;  border-bottom: double 2px #777777;font-size:20px;">0</td>`;
            allSummaryrow[i].appendChild(trSum);
        }   
        view.createDataTable();
    },
    createDataTable : function(){
        let allTable = document.querySelectorAll('.tbody-value');
        let sum_per_row = 1;
        let sum_total = 0;
        let all_count_v_color = [];
        let all_count_h_color = [];
        
        for (let i in data.table) {
            let count_v_color = 0;
            let count_h_color = 0;
            let sum_total_ele = document.getElementById('sum-' + i);
            let sum_total_row_ele = document.getElementById('summary-' + i); 
            let bodyIdx = document.getElementById('table-body-' + i);
            for (let j in data.table[i]) {
                for (let z in data.table[i][j]) {
                    for (let time in data.table[i][j][z]) {
                        time = Number(time);
                        time = Math.abs(time);
                        if (j === 'Male') {
                            bodyIdx.querySelector('.m' + '-' + time + '-' + z).innerText = data.table[i][j][z][time]; 

                            bodyIdx.querySelector('.s' + '-' + time).innerText = Number(bodyIdx.querySelector('.s' + '-' + time).innerText) + data.table[i][j][z][time]; 

                            sum_total_row_ele.querySelector('.m-t-' + z).innerText = Number(sum_total_row_ele.querySelector('.m-t-' + z).innerText) + data.table[i][j][z][time]; 

                            sum_total += data.table[i][j][z][time];
                        } else if (j === 'Female') {

                            bodyIdx.querySelector('.f' + '-' + time + '-' + z).innerText = data.table[i][j][z][time];
                            bodyIdx.querySelector('.s' + '-' + time).innerText = Number(bodyIdx.querySelector('.s' + '-' + time).innerText) + data.table[i][j][z][time]; 

                            sum_total_row_ele.querySelector('.f-t-' + z).innerText = Number(sum_total_row_ele.querySelector('.f-t-' + z).innerText) + data.table[i][j][z][time]; 

                            sum_total += data.table[i][j][z][time];
                        } else if (j === "Unidentified") {

                            bodyIdx.querySelector('.u' + '-' + time + '-' + z).innerText = data.table[i][j][z][time];
                            bodyIdx.querySelector('.s' + '-' + time).innerText = Number(bodyIdx.querySelector('.s' + '-' + time).innerText) + data.table[i][j][z][time]; 

                            sum_total_row_ele.querySelector('.u-t-' + z).innerText = Number(sum_total_row_ele.querySelector('.u-t-' + z).innerText) + data.table[i][j][z][time]; 
                            sum_total += data.table[i][j][z][time];
                        }
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
            all_count_v_color.push(count_v_color);
            all_count_h_color.push(count_h_color);
        }
        generate.ColorSummary(all_count_v_color, all_count_h_color);
    },
    createEmotionGraph : function(){
        let data_question = [];
        let data_question_sum = [];

        for (let i in data.graphEmotion) {
            for (let j in data.graphEmotion[i]) {
                if (j[j.length - 1] == 1) {
                    var q1 = {
                        name: 'Upset',
                        color: '#e74c3c',
                        y: data.graphEmotion[i][j].total
                    };
                } else if (j[j.length - 1] == 2) {
                    var q1 = {
                        name: 'Dislike',
                        color: '#e67e22',
                        y: data.graphEmotion[i][j].total
                    };
                } else if (j[j.length - 1] == 3) {
                    var q1 = {
                        name: 'Normal',
                        color: '#f1c40f',
                        y: data.graphEmotion[i][j].total
                    };
                } else if (j[j.length - 1] == 4) {
                    var q1 = {
                        name: 'Like',
                        color: '#96CFEA',
                        y: data.graphEmotion[i][j].total
                    };
                } else if (j[j.length - 1] == 5) {
                    var q1 = {
                        name: 'Love',
                        color: '#004384',
                        y: data.graphEmotion[i][j].total
                    };
                }
                data_question.push(q1);
            }
            data_question_sum.push(data_question.reverse());
            data_question = [];
        }
        generate.graphEmotion(data_question_sum);
    },
    createGraphQuestion : function(){ 
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
                    if (data.graph["q" + (i + 1)]["Male"] !== undefined) {
                        if (data.graph["q" + (i + 1)]["Male"]["" + k] !== undefined) {
                            if (data.graph["q" + (i + 1)]["Male"]["" + k]["" + j] !== undefined) {

                                male_data_temp += data.graph["q" + (i + 1)]["Male"]["" + k]["" + j] * k;
                                male_data_sum += data.graph["q" + (i + 1)]["Male"]["" + k]["" + j] * 5;
                                count_male += data.graph["q" + (i + 1)]["Male"]["" + k]["" + j];
                            }
                        }
                    }
                    if (data.graph["q" + (i + 1)]["Female"] !== undefined) {
                        if (data.graph["q" + (i + 1)]["Female"]["" + k] !== undefined) {
                            if (data.graph["q" + (i + 1)]["Female"]["" + k]["" + j] !== undefined) {
                                female_data_temp += data.graph["q" + (i + 1)]["Female"]["" + k]["" + j] * k;
                                female_data_sum += data.graph["q" + (i + 1)]["Female"]["" + k]["" + j] * 5;
                                count_female += data.graph["q" + (i + 1)]["Female"]["" + k]["" + j];
                            }
                        }
                    }
                    if (data.graph["q" + (i + 1)]["Unidentified"] !== undefined) {
                        if (data.graph["q" + (i + 1)]["Unidentified"]["" + k] !== undefined) {
                            if (data.graph["q" + (i + 1)]["Unidentified"]["" + k]["" + j] !== undefined) {
                                na_data_temp += data.graph["q" + (i + 1)]["Unidentified"]["" + k]["" + j] * k;
                                na_data_sum += data.graph["q" + (i + 1)]["Unidentified"]["" + k]["" + j] * 5;
                                count_na += data.graph["q" + (i + 1)]["Unidentified"]["" + k]["" + j];
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
        generate.graph(all_data,male_data,female_data,na_data);
    },
    render: function () {
        view.header();
        view.filterForm();
        view.createSummaryLineGraph();
        view.createSummaryGenderGraph();
        view.createScore();
        view.createTable();
        view.createEmotionGraph();
        view.createGraphQuestion();
    }
};
let ctrl = {
    exportPDF : function(){
        window.print();
    }
}
let generate = {
    graphSum1 : function(all,men,women,unknow,chartname,type){
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
                    },
                    min:0
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
                plotOptions: {
                    column: {
                         dataLabels: {
                            enabled: true
                        },
                        events: {
                            legendItemClick: function () {
                                return false; 
                            }
                        }
                    },
                    line: {
                         dataLabels: {
                            enabled: true
                        },
                        events: {
                            legendItemClick: function () {
                                return false; 
                            }
                        }
                    },
                    allowPointSelect: false,
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
                chartOption.yAxis = {max : 5,min : 0};
                Highcharts.chart(chartname, chartOption);
            }else{
                chartOption.chart = {type : 'column'};
                chartOption.yAxis = {max : 5,min : 0};
                Highcharts.chart(chartname, chartOption);
            }
        }
    },
    graphSum2: function(m_data,f_data,total,total_m,total_f){
        
        let chartSum2 = {
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
                categories: ['55+', '45-54', '35-44', '25-34', '18-24', 'Under 18'],
                reversed: false,
                labels: {
                    step: 1
                }
            }, { // mirror axis on right side
                opposite: true,
                reversed: false,
                categories: ['55+', '45-54', '35-44', '25-34', '18-24', 'Under 18'],
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
                    },
                    events: {
                        legendItemClick: function () {
                            return false; 
                        }
                    },
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
        }
        if(data.score.length > 5){
            document.getElementById('sum_graph_gender_more').style.display = 'block';
            Highcharts.chart('sum_graph_gender_more', chartSum2);
        }else{
            document.getElementById('sum_graph_gender_less').style.display = 'block';
            Highcharts.chart('sum_graph_gender_less', chartSum2);
        }
        
    },
    ColorSummary :function(vcol, hrow){
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
                        generate.setColor(elem_score_table, percent);
                    }
                    generate.setColor(eachCol[i], percent);
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
                        generate.setColor(elem_score_table, percent);
                    }
                    generate.setColor(eachRow[i], percent);
                }
            }
        }
    },
    setColor : function(pos, percent) {
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
    graphEmotion : function(data_question_sum){
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
                    categories: ['Upset', 'Dislike', 'Normal', 'Like', 'Love'].reverse(),
                    labels: {
                        padding: 5,
                        useHTML: true
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
                    pointWidth: 36
                }]
            });
        }
        Highcharts.chart('container-2-q1', chart_Question[0]);
        Highcharts.chart('container-2-q2', chart_Question[1]);
        Highcharts.chart('container-2-q3', chart_Question[2]);
        Highcharts.chart('container-2-q4', chart_Question[3]);
        Highcharts.chart('container-2-q5', chart_Question[4]);
    },
    graph : function(all_data,male_data,female_data,na_data){
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
                        stacking: 'normal',
                      
                        events: {
                            legendItemClick: function () {
                                return false; 
                            }
                        },
                    },
                    scatter:{
                      
                        events: {
                            legendItemClick: function () {
                                return false; 
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
}

view.render();