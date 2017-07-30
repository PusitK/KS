let data = JSON.parse(sessionStorage.data);
console.log(data);

let startdate = moment(data.startdate).format('LL');
let enddate = moment(data.enddate).format('LL');

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

        isCompleted_true.innerHTML = '<strong>Complete Form</strong></br>' +
            data.filter[0].is_completed.true + ' form(s) \u2014 ' + per_com_true + "%";

        isCompleted_false.innerHTML = '<strong>Un-Complete Form</strong></br>' +
            data.filter[0].is_completed.false + ' form(s) \u2014 ' + per_com_false + "%";

        isUnidentify_true.innerHTML = '<strong>Identified Form</strong></br>' +
            data.filter[0].is_identified.true + ' form(s) \u2014 ' + per_iden_true + "%";

        isUnidentify_false.innerHTML = '<strong>Un-Identified Form</strong></br>' +
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
    render: function () {
        view.header();
        view.filterForm();
        view.createSummaryLineGraph();
        view.createSummaryGenderGraph();
    }
};
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
                chartOption.yAxis = {max : 5};
                Highcharts.chart(chartname, chartOption);
            }else{
                chartOption.chart = {type : 'column'};
                chartOption.yAxis = {max : 5};
                Highcharts.chart(chartname, chartOption);
            }
        }
    },
    graphSum2: function(m_data,f_data,total,total_m,total_f){

        Highcharts.chart('sum_graph_gender', {
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
        });
    }

}



view.render();