function pesoLabel(elementId, labels, total, magro, gordo) {
    var ctx = document.getElementById(elementId);
    var myChart = new Chart(ctx, {
      type:    'line',
      data:    {
          labels: labels, //labels: ['label1', 'label2'],
          datasets: [
              {
                label: "Total",
                pointRadius: 1,
                data: total, //data: [1,2]
            }, {
                label: 'Magro',
                pointRadius: 1,
                backgroundColor: "rgba(38, 185, 154, 0.31)",
                borderColor: "rgba(38, 185, 154, 0.7)",
                pointBackgroundColor: "rgba(38, 185, 154, 0.7)",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointBorderWidth: 1,
                data: magro //data: [2,3]
            }, {
                label: "Gordo",
                pointRadius: 1,
                backgroundColor: "rgba(3, 88, 106, 0.3)",
                borderColor: "rgba(3, 88, 106, 0.70)",
                pointBorderColor: "rgba(3, 88, 106, 0.70)",
                pointBackgroundColor: "rgba(3, 88, 106, 0.70)",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(151,187,205,1)",
                pointBorderWidth: 1,
                data: gordo //data: [3,4]
            }
          ]
      },
      options: {
        responsive: true,
      }
    })
}

//requires     <script src="../vendors/Chart.js/dist/Chart.bundle.min.js"></script>
function pesoDate(elementId, total, magro, gordo) {
    var ctx = document.getElementById(elementId);
    var myChart = new Chart(ctx, {
        type:    'line',
        data:    {
            datasets: [
                {
                label: "Peso",
                pointRadius: 1,
                // data: [
                //     {x:new Date(2011, 10-1, 10), y:74.3},
                //     {x:new Date(2012, 2-1, 15), y:71.2},
                //     {x:new Date(2012, 7-1, 10), y:71.9},
                //     {x:new Date(2016, 10-1, 5), y:97.6},
                //     {x:new Date(2017, 5-1, 25), y:95.5},
                //     {x:new Date(2017, 8-1, 14), y:96.8},
                //     {x:new Date(2017, 12-1, 4), y:97.1}
                // ],
                data: total,
            }, {
                label: 'Peso Magro',
                pointRadius: 1,
                backgroundColor: "rgba(38, 185, 154, 0.31)",
                borderColor: "rgba(38, 185, 154, 0.7)",
                pointBackgroundColor: "rgba(38, 185, 154, 0.7)",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointBorderWidth: 1,
                // data: [
                //     {x:new Date(2011, 10-1, 10), y:59.93},
                //     {x:new Date(2012, 2-1, 15), y:63.91},
                //     {x:new Date(2012, 7-1, 10), y:65.64},
                //     {x:new Date(2016, 10-1, 5), y:73.25},
                //     {x:new Date(2017, 5-1, 25), y:73.82},
                //     {x:new Date(2017, 8-1, 14), y:75.02},
                //     {x:new Date(2017, 12-1, 4), y:74.77}
                // ],
                data: magro,
                // fill:  false,
                // borderColor: 'blue'
            }, {
                label: "Peso Gordo",
                pointRadius: 1,
                backgroundColor: "rgba(3, 88, 106, 0.3)",
                borderColor: "rgba(3, 88, 106, 0.70)",
                pointBorderColor: "rgba(3, 88, 106, 0.70)",
                pointBackgroundColor: "rgba(3, 88, 106, 0.70)",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(151,187,205,1)",
                pointBorderWidth: 1,
                // data: [
                //     {x:new Date(2011, 10-1, 10), y:14.37},
                //     {x:new Date(2012, 2-1, 15), y:7.26},
                //     {x:new Date(2012, 7-1, 10), y:6.26},
                //     {x:new Date(2016, 10-1, 5), y:24.35},
                //     {x:new Date(2017, 5-1, 25), y:21.68},
                //     {x:new Date(2017, 8-1, 14), y:21.78},
                //     {x:new Date(2017, 12-1, 4), y:22.33}
                // ],
                data: gordo,
            }
            ]
        },
        options: {
            responsive: true,
            // title:      {
            //     display: true,
            //     text:    "Chart.js Time Scale"
            // },
            scales:     {
                xAxes: [{
                    type:       "time",
                    time:       {
                        // format: 'DD/MM/YYYY',
                        tooltipFormat: 'll',
                        displayFormats: {
                        quarter: 'MMM YYYY'
                    }                    },
                    // scaleLabel: {
                    //     display:     true,
                    //     labelString: 'Date'
                    // }
                }],
                // yAxes: [{
                //     scaleLabel: {
                //         display:     true,
                //         labelString: 'value'
                //     }
                // }]
            }
        }
    })
}

function evolucaoLabel(elementId, labels, quadrilEvolucao, toraxEvolucao, abdomenEvolucao, cinturaEvolucao, antebracosEvolucao, bracosEvolucao, coxasEvolucao, panturrilhasEvolucao) {
    // var ctx = document.getElementById("evolucaoChart");
    var ctx = document.getElementById(elementId);
    var myChart = new Chart(ctx, {
      type:    'line',
      data:    {
          labels: labels,
          datasets: [
              {
                label: "Braços",
                pointRadius: 1,
                backgroundColor: "rgba(0, 0, 0, 0)",
                borderColor: "#26B99A",
                pointBorderColor: "rgba(3, 88, 106, 0.70)",
                pointBackgroundColor: "rgba(3, 88, 106, 0.70)",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(151,187,205,1)",
                pointBorderWidth: 1,
                data: bracosEvolucao,
                hidden: true,
            }, {
                label: 'Quadril',
                pointRadius: 1,
                backgroundColor: "rgba(0, 0, 0, 0)",
                borderColor: "rgba(108, 145, 114, 0.7)",
                pointBackgroundColor: "rgba(38, 185, 154, 0.7)",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointBorderWidth: 1,
                data: quadrilEvolucao,
                // spanGaps: true,
            }, {
                label: "Peitoral",
                pointRadius: 1,
                backgroundColor: "rgba(0, 0, 0, 0)",
                borderColor: "#9B0906",
                pointBorderColor: "rgba(3, 88, 106, 0.70)",
                pointBackgroundColor: "rgba(3, 88, 106, 0.70)",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(151,187,205,1)",
                pointBorderWidth: 1,
                data: toraxEvolucao,
            }, {
                label: "Abdomen",
                pointRadius: 1,
                backgroundColor: "rgba(0, 0, 0, 0)",
                borderColor: "#E74C3C",
                pointBorderColor: "rgba(3, 88, 106, 0.70)",
                pointBackgroundColor: "rgba(3, 88, 106, 0.70)",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(151,187,205,1)",
                pointBorderWidth: 1,
                data: abdomenEvolucao,
            }, {
                label: "Cintura",
                pointRadius: 1,
                backgroundColor: "rgba(0, 0, 0, 0)",
                borderColor: "#CFD4D8",
                pointBorderColor: "rgba(3, 88, 106, 0.70)",
                pointBackgroundColor: "rgba(3, 88, 106, 0.70)",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(151,187,205,1)",
                pointBorderWidth: 1,
                data: cinturaEvolucao,
            }, {
                label: "Antebraço",
                pointRadius: 1,
                backgroundColor: "rgba(0, 0, 0, 0)",
                borderColor: "#3498DB",
                pointBorderColor: "rgba(3, 88, 106, 0.70)",
                pointBackgroundColor: "rgba(3, 88, 106, 0.70)",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(151,187,205,1)",
                pointBorderWidth: 1,
                data: antebracosEvolucao,
                hidden: true,
            }, {
                label: "Coxas",
                pointRadius: 1,
                backgroundColor: "rgba(0, 0, 0, 0)",
                borderColor: "#B370CF",
                pointBorderColor: "rgba(3, 88, 106, 0.70)",
                pointBackgroundColor: "rgba(3, 88, 106, 0.70)",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(151,187,205,1)",
                pointBorderWidth: 1,
                data: coxasEvolucao,
                hidden: true,
            }, {
                label: "Panturrilhas",
                pointRadius: 1,
                backgroundColor: "rgba(0, 0, 0, 0)",
                borderColor: "rgba(3, 88, 106, 0.70)",
                pointBorderColor: "rgba(3, 88, 106, 0.70)",
                pointBackgroundColor: "rgba(3, 88, 106, 0.70)",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(151,187,205,1)",
                pointBorderWidth: 1,
                data: panturrilhasEvolucao,
                hidden: true,
            }
          ]
      },
      options: {
        responsive: true,
        // elements: {
        //   line: {
        //     skipNull: true,
        //     drawNull: false,
        //   },
        // }
        scales: {
          yAxes: [{
            ticks: {
              callback: function(tick) {
                return tick.toString() + '%';
              }
            }
          }]
        }
      }
    })
}

function benchmarking(elementId, braco, peitoral, coxa, panturrilha, cintura, peso, altura) {
    //   var ctx = document.getElementById("benchmarkingChart");
    var ctx = document.getElementById(elementId);
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Braço", "Peitoral", "Coxa", "Panturrilha", "Cintura", "Peso", "Altura"],
            datasets: [{
            label: 'Eu',
            backgroundColor: "#03586A",
            borderWidth: 1,
            data: [braco, peitoral, coxa, panturrilha, cintura, peso, altura],
            }, {
            label: 'Arnold',
            backgroundColor: "#26B99A",
            borderWidth: 1,
            data: [55.88, 144.78, 72.39, 50.8, 83.8, 106.5, 188],
            }]
        },

        options: {
            scales: {
                xAxes: [{ stacked: true }],
                yAxes: [{
                        ticks: {
                            beginAtZero:true
                        },
                        stacked: false
                }]
            }
        }
    });
}

function timeInBed(elementId, asleepData, awakeData, fallAsleepData, afterWakeUpData) {
    const weekDayName = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
    const chartColors = {
        red: 'rgb(255, 99, 132)',
        orange: 'rgb(255, 159, 64)',
        yellow: 'rgb(255, 205, 86)',
        green: 'rgb(75, 192, 192)',
        blue: 'rgb(54, 162, 235)',
        purple: 'rgb(153, 102, 255)',
        grey: 'rgb(201, 203, 207)',
    };
    let todayDate = new Date();
    let yesterdayDate = new moment(todayDate).subtract(1, 'days') 
    let last2DaysDate = new moment(todayDate).subtract(2, 'days') 
    let last3DaysDate = new moment(todayDate).subtract(3, 'days') 
    let last4DayDate = new moment(todayDate).subtract(4, 'days') 

        //   var ctx = document.getElementById("benchmarkingChart");
        var ctx = document.getElementById(elementId);
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [
                    'Ano', 
                    'Trim.', 
                    'Mês', 
                    weekDayName[last4DayDate.day()], 
                    weekDayName[last3DaysDate.day()], 
                    weekDayName[last2DaysDate.day()], 
                    weekDayName[yesterdayDate.day()], 
                    'Hoje'],
                datasets: [{
                    label: 'Dormindo',
                    backgroundColor: chartColors.red,
                    data: asleepData,
                } , {
                    label: 'Acordado',
                    backgroundColor: chartColors.blue,
                    data: awakeData,
                } , {
                    label: 'Ant. Dormir',
                    backgroundColor: chartColors.green,
                    data: fallAsleepData,
                } , {
                    label: 'Dep. dormir',
                    backgroundColor: chartColors.orange,
                    data: afterWakeUpData
                }]
            },
            options: {
                tooltips: {
                    mode: 'index',
                    intersect: false
                },
                responsive: true,
                scales: {
                    xAxes: [{
                        stacked: true,
                    }],
                    yAxes: [{
                        stacked: true
                    }]
                }
            }
        }
    );
}

function cardioDayly(elementId, todayData = [], lastDay1Data = [], lastDay2Data = [], lastDay3Data = [], lastDay4Data = []) {
    const weekDayName = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
    var ctx = document.getElementById(elementId);
    let todayDate = new Date();

    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [
            {
                label: weekDayName[new moment(todayDate).subtract(4, 'days').day()],
                pointRadius: 0,
                backgroundColor: "rgba(0, 0, 0, 0)",
                borderColor: "rgba(108, 145, 114, 0.7)",
                data: lastDay4Data,
                hidden: true,
            }, {
                label: weekDayName[new moment(todayDate).subtract(3, 'days').day()],
                pointRadius: 0,
                backgroundColor: "rgba(0, 0, 0, 0)",
                borderColor: "#9B0906",
                data: lastDay3Data,
                hidden: true,
            }, {
                label: weekDayName[new moment(todayDate).subtract(2, 'days').day()],
                pointRadius: 0,
                backgroundColor: "rgba(0, 0, 0, 0)",
                borderColor: "#E74C3C",
                data: lastDay2Data,
            }, {
                label: weekDayName[new moment(todayDate).subtract(1, 'days').day()],
                pointRadius: 0,
                backgroundColor: "rgba(0, 0, 0, 0)",
                borderColor: "#CFD4D8",
                data: lastDay1Data,
            }, {
                label: "Hoje",
                borderColor: "#3498DB",
                backgroundColor: "rgba(0, 0, 0, 0)",
                pointRadius: 0,
                data: todayData,
            }]
        },
        options: {
            responsive: true,
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        unit: 'hour',
                        displayFormats: {
                            hour: 'HH:mm A'
                        }
                    }
                }]
            },
        }
    })
}

function sonoEstagios(elementIdName, lastYear, last3Months, lastMonth, last4Day, last3Days, last2Days, yesterday, today, lastYearElementId, last3MonthsElementId, lastMonthElementId, last4DayElementId, last3DaysElementId, last2DaysElementId, yesterdayElementId, todayElementId, acordadoElementId, remElementId, profundoElementId, leveElementId) {
    const weekDayName = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
    const chartColors = {
        red: 'rgb(255, 99, 132)',
        orange: 'rgb(255, 159, 64)',
        yellow: 'rgb(255, 205, 86)',
        green: 'rgb(75, 192, 192)',
        blue: 'rgb(54, 162, 235)',
        purple: 'rgb(153, 102, 255)',
        grey: 'rgb(201, 203, 207)',
    };
    let todayDate = new Date();
    let yesterdayDate = new moment(todayDate).subtract(1, 'days') 
    let last2DaysDate = new moment(todayDate).subtract(2, 'days') 
    let last3DaysDate = new moment(todayDate).subtract(3, 'days') 
    let last4DayDate = new moment(todayDate).subtract(4, 'days') 

    let showSonoDescription = (show, label, elementId) => {
      if(!elementId || !label) {
        return;
      }

      if(show) {
        document.getElementById(elementId).innerHTML = label
      } else {
        document.getElementById(elementId).innerHTML = `<s>${label}</s>`
      }
    }

    let showSonoLastYear = (show) => showSonoDescription(show, 'Ano', lastYearElementId)
    let showSonoLast3Months = (show) => showSonoDescription(show, 'Trim', last3MonthsElementId)
    let showSonoLastMonth = (show) => showSonoDescription(show, 'Mês', lastMonthElementId)
    let showSonoLast4Day = (show) => showSonoDescription(show, weekDayName[last4DayDate.day()], last4DayElementId)
    let showSonoLast3Days = (show) => showSonoDescription(show, weekDayName[last3DaysDate.day()],last3DaysElementId)
    let showSonoLast2Days = (show) => showSonoDescription(show, weekDayName[last2DaysDate.day()], last2DaysElementId)
    let showSonoYesterday = (show) => showSonoDescription(show, weekDayName[yesterdayDate.day()], yesterdayElementId)
    let showSonoToday = (show) => showSonoDescription(show, 'Hoje', todayElementId)

    let lastYearShow = !(!lastYear || lastYear.length <= 0 || (lastYear[0] == 0 && lastYear[1] == 0 && lastYear[2] == 0 && lastYear[3] == 0))
    let last3MonthsShow = !(!last3Months || last3Months.length <= 0 || (last3Months[0] == 0 && last3Months[1] == 0 && last3Months[2] == 0 && last3Months[3] == 0))
    let lastMonthShow = !(!lastMonth || lastMonth.length <= 0 || (lastMonth[0] == 0 && lastMonth[1] == 0 && lastMonth[2] == 0 && lastMonth[3] == 0))
    let last4DayShow = false
    let last3DaysShow = false
    let last2DaysShow = !(!last2Days || last2Days.length <= 0 || (last2Days[0] == 0 && last2Days[1] == 0 && last2Days[2] == 0 && last2Days[3] == 0))
    let yesterdayShow = !(!yesterday || yesterday.length <= 0 || (yesterday[0] == 0 && yesterday[1] == 0 && yesterday[2] == 0 && yesterday[3] == 0))
    let todayShow = !(!today || today.length <= 0 || (today[0] == 0 && today[1] == 0 && today[2] == 0 && today[3] == 0))

    showSonoLastYear(lastYearShow)
    showSonoLast3Months(last3MonthsShow)
    showSonoLastMonth(lastMonthShow)
    showSonoLast4Day(last4DayShow)
    showSonoLast3Days(last3DaysShow)
    showSonoLast2Days(last2DaysShow)
    showSonoYesterday(yesterdayShow)
    showSonoToday(todayShow)

    let colors = [chartColors.red, chartColors.orange, chartColors.blue, chartColors.green]

    let showSonoLabelDescription = (show, label, elementId, color) => {
      if(!elementId || !label) {
        return;
      }

      if(show) {
        document.getElementById(elementId).innerHTML = `<i class="fa fa-square" style="color:${color}"></i>${label}`
      } else {
        document.getElementById(elementId).innerHTML = `<i class="fa fa-square" style="color:${color}"></i><s>${label}</s>`
      }
    }

    let showSonoAcordadoLabel = (show) => showSonoLabelDescription(show, 'Acordado', acordadoElementId, colors[0])
    let showSonoRemLabel = (show) => showSonoLabelDescription(show, 'REM', remElementId, colors[1])
    let showSonoProfundoLabel = (show) => showSonoLabelDescription(show, 'Profundo', profundoElementId, colors[2])
    let showSonoLeveLabel = (show) => showSonoLabelDescription(show, 'Leve', leveElementId, colors[3])

    showSonoAcordadoLabel(true)
    showSonoRemLabel(true)
    showSonoProfundoLabel(true)
    showSonoLeveLabel(true)

    let ctx = document.getElementById(elementIdName);
    let sonoEstagiosChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ["Awake", "REM", "Deep", "Light"],
        datasets: [
        {
            backgroundColor: colors,
            data: lastYear,
            hidden: !lastYearShow,
          },
          {
            backgroundColor: colors,
            data: last3Months,
            hidden: !last3MonthsShow,
          },
          {
            backgroundColor: colors,
            data: lastMonth,
            hidden: !lastMonthShow,
          },
          {
            backgroundColor: colors,
            data: last4Day,
            hidden: !last4DayShow,
          },
          {
            backgroundColor: colors,
            data: last3Days,
            hidden: !last3DaysShow,
          },
          {
            backgroundColor: colors,
            data: last2Days,
            hidden: !last2DaysShow,
          },
          {
            backgroundColor: colors,
            data: yesterday,
            hidden: !yesterdayShow,
          },
          {
            backgroundColor: colors,
            data: today,
            hidden: !todayShow,
          },
        ],
        // hiddenSlices: [1, 3]
      },
      options: {
        responsive: true,
        legend: {
            display: false
        },              
        circumference: Math.PI,
        rotation: Math.PI /2
      }
    })

    let hiddeItem = (hidde, index) => {
      sonoEstagiosChart.data.datasets[index].hidden = hidde;
      sonoEstagiosChart.update();
    }
      
    document.getElementById(lastYearElementId).onclick = () => { let hidde = !sonoEstagiosChart.data.datasets[0].hidden; showSonoLastYear(!hidde); hiddeItem(hidde, 0); }
    document.getElementById(last3MonthsElementId).onclick = () => { let hidde = !sonoEstagiosChart.data.datasets[1].hidden; showSonoLast3Months(!hidde); hiddeItem(hidde, 1); }
    document.getElementById(lastMonthElementId).onclick = () => { let hidde = !sonoEstagiosChart.data.datasets[2].hidden; showSonoLastMonth(!hidde); hiddeItem(hidde, 2); }
    document.getElementById(last4DayElementId).onclick = () => { let hidde = !sonoEstagiosChart.data.datasets[3].hidden; showSonoLast4Day(!hidde); hiddeItem(hidde, 3); }
    document.getElementById(last3DaysElementId).onclick = () => { let hidde = !sonoEstagiosChart.data.datasets[4].hidden; showSonoLast3Days(!hidde); hiddeItem(hidde, 4); }
    document.getElementById(last2DaysElementId).onclick = () => { let hidde = !sonoEstagiosChart.data.datasets[5].hidden; showSonoLast2Days(!hidde); hiddeItem(hidde, 5); }
    document.getElementById(yesterdayElementId).onclick = () => { let hidde = !sonoEstagiosChart.data.datasets[6].hidden; showSonoYesterday(!hidde); hiddeItem(hidde, 6); }
    document.getElementById(todayElementId).onclick = () => { let hidde = !sonoEstagiosChart.data.datasets[7].hidden; showSonoToday(!hidde); hiddeItem(hidde, 7); }

    let hiddeLabel = (hidde, index) => {
      let shouldHidde = hidde === true ? true : false;
      for (var i = 0; i < sonoEstagiosChart.data.datasets.length; ++i) {
        sonoEstagiosChart.getDatasetMeta(i).data[index].hidden = shouldHidde;
      }
      sonoEstagiosChart.update();
    }

    document.getElementById(acordadoElementId).onclick = () => { let hidde = !sonoEstagiosChart.getDatasetMeta(0).data[0].hidden; showSonoAcordadoLabel(!hidde); hiddeLabel(hidde, 0); }
    document.getElementById(remElementId).onclick = () => { let hidde = !sonoEstagiosChart.getDatasetMeta(0).data[1].hidden; showSonoRemLabel(!hidde); hiddeLabel(hidde, 1); }
    document.getElementById(profundoElementId).onclick = () => { let hidde = !sonoEstagiosChart.getDatasetMeta(0).data[2].hidden; showSonoProfundoLabel(!hidde); hiddeLabel(hidde, 2); }
    document.getElementById(leveElementId).onclick = () => { let hidde = !sonoEstagiosChart.getDatasetMeta(0).data[3].hidden; showSonoLeveLabel(!hidde); hiddeLabel(hidde, 3); }
}

function cardioAcompanhament(elementIdName, outOfRangeData, fatBurnData, cardioData, peakData, belowLowData) {
    const weekDayName = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
    const chartColors = {
        red: 'rgb(255, 99, 132)',
        orange: 'rgb(255, 159, 64)',
        yellow: 'rgb(255, 205, 86)',
        green: 'rgb(75, 192, 192)',
        blue: 'rgb(54, 162, 235)',
        purple: 'rgb(153, 102, 255)',
        grey: 'rgb(201, 203, 207)',
    };
    let todayDate = new Date();
    let yesterdayDate = new moment(todayDate).subtract(1, 'days') 
    let last2DaysDate = new moment(todayDate).subtract(2, 'days') 
    let last3DaysDate = new moment(todayDate).subtract(3, 'days') 
    let last4DayDate = new moment(todayDate).subtract(4, 'days') 
    let ctx = document.getElementById(elementIdName);

    var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: [
              'Ano', 
              'Trim.', 
              'Mês', 
              weekDayName[last4DayDate.day()], 
              weekDayName[last3DaysDate.day()], 
              weekDayName[last2DaysDate.day()], 
              weekDayName[yesterdayDate.day()], 
              'Hoje'],
          datasets: [{
              label: "Pico",
              backgroundColor: chartColors.orange,
              data: peakData
          } , {
              label: "Cardio",
              backgroundColor: chartColors.green,
              data: cardioData,
          } , {
              label: "Queima gordura",
              backgroundColor: chartColors.blue,
              data: fatBurnData,
          } , {
              label: "Baixo",
              backgroundColor: chartColors.red,
              data: outOfRangeData,
          } , {
              label: "< 30 bmp",
              backgroundColor: chartColors.purple,
              data: belowLowData
          }]
      },
      options: {
          tooltips: {
              mode: 'index',
              intersect: false
          },
          responsive: true,
          scales: {
              xAxes: [{
                  stacked: true,
              }],
              yAxes: [{
                  stacked: true
              }]
          }
      }
    })          
  }