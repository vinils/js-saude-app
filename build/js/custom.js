"use strict";

/**
 * Resize function without multiple trigger
 * 
 * Usage:
 * $(window).smartresize(function(){  
 *     // code here
 * });
 */
(function ($, sr) {
  // debouncing function from John Hann
  // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
  var debounce = function debounce(func, threshold, execAsap) {
    var timeout;
    return function debounced() {
      var obj = this,
          args = arguments;

      function delayed() {
        if (!execAsap) func.apply(obj, args);
        timeout = null;
      }

      if (timeout) clearTimeout(timeout);else if (execAsap) func.apply(obj, args);
      timeout = setTimeout(delayed, threshold || 100);
    };
  }; // smartresize 


  jQuery.fn[sr] = function (fn) {
    return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr);
  };
})(jQuery, 'smartresize');
"use strict";

//   let carregaCardioAjaxBatch = () => {
//     let importDate = new moment().format('YYYY-MM-DD')
//     fetch(`https://api.fitbit.com/1/user/-/activities/heart/date/${importDate}/1d/1sec/time/00:00/23:59.json`, fitbitSettings)
//     .then(res => res.json())
//     .then(json => {
//       let intraday = json['activities-heart-intraday'].dataset
//       let endpoint = odata.url;
//       let dataCast = (intra) => {
//         return {
//           GroupId: groupsId.cardio.frequencia.id,
//           CollectionDate: new moment(new Date(importDate+'T'+intra.time)).format('YYYY-MM-DDTHH:mm:ssZ'),
//           DecimalValue: parseFloat(intra.value)
//         } 
//       }
//       let dataArray = intraday.map(i => dataCast(i))
//       let batchSettings = createAjaxBatchSettings(endpoint)
//       .postBatch(odata.exams.decimals.point, dataArray)
//       $.ajax(batchSettings).done(function (response) {
//         console.log('total reg: ' + intraday.length)
//         console.log('total OK: ' + (response.match(/HTTP\/1.1 200/g) || []).length)
//         console.log('total Created: ' + (response.match(/HTTP\/1.1 201/g) || []).length)
//         console.log('total Conflict: ' + (response.match(/HTTP\/1.1 409/g) || []).length)
//       });
//     });
//   }
function generateUUID() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : r & 0x7 | 0x8).toString(16);
  });
  return uuid;
}

; //       let batchSettings = createAjaxBatchSettings(endpoint)
//       .postBatch(odata.exams.decimals.point, dataArray)
//       $.ajax(batchSettings).done(function (response) {
//         console.log('total reg: ' + intraday.length)
//         console.log('total OK: ' + (response.match(/HTTP\/1.1 200/g) || []).length)
//         console.log('total Created: ' + (response.match(/HTTP\/1.1 201/g) || []).length)
//         console.log('total Conflict: ' + (response.match(/HTTP\/1.1 409/g) || []).length)
//       });

function createAjaxBatchSettings(rootUri) {
  var batchGuid = generateUUID();

  var _addBatch = function addBatch(settings, rootUri, batchGuid, method, link, data) {
    var endBatch = "--batch_".concat(batchGuid, "--");

    if (settings.data) {
      settings.data.replace(endBatch, '');
    }

    var newChangeSetGuid = generateUUID();
    var batchContents = new Array();
    batchContents.push("--batch_" + batchGuid);
    batchContents.push("Content-Type: multipart/mixed; boundary=changeset_" + newChangeSetGuid);
    batchContents.push("");
    batchContents.push("--changeset_" + newChangeSetGuid);
    batchContents.push("Content-Type: application/http");
    batchContents.push("Content-Transfer-Encoding: binary");
    batchContents.push("Content-ID: 1");
    batchContents.push("");
    batchContents.push("".concat(method, " ").concat(rootUri).concat(link, " HTTP/1.1"));
    batchContents.push('Content-Type: application/json');
    batchContents.push("");
    batchContents.push(JSON.stringify(data));
    batchContents.push("--changeset_".concat(newChangeSetGuid, "--"));
    var newChangeSet = batchContents.join("\r\n");
    settings.data += newChangeSet + "\r\n" + endBatch;
    return settings;
  };

  var _postBatch = function postBatch(settings, link, dataArray) {
    var ret = settings;
    dataArray.forEach(function (element) {
      ret = settings.addBatch('POST', link, element);
    });
    return ret;
  };

  var settings = {
    url: rootUri + "/$batch",
    method: "POST",
    headers: {
      "Content-Type": "multipart/mixed;boundary=batch_" + batchGuid,
      "cache-control": "no-cache"
    },
    addBatch: function addBatch(method, link, data) {
      return _addBatch(settings, rootUri, batchGuid, method, link, data);
    },
    postBatch: function postBatch(link, dataArray) {
      return _postBatch(settings, link, dataArray);
    }
  };
  return settings;
}
"use strict";

function pesoLabel(elementId, labels, total, magro, gordo) {
  var ctx = document.getElementById(elementId);
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      //labels: ['label1', 'label2'],
      datasets: [{
        label: "Total",
        pointRadius: 1,
        data: total //data: [1,2]

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

      }]
    },
    options: {
      responsive: true
    }
  });
} //requires     <script src="../vendors/Chart.js/dist/Chart.bundle.min.js"></script>


function pesoDate(elementId, total, magro, gordo) {
  var ctx = document.getElementById(elementId);
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [{
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
        data: total
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
        data: magro // fill:  false,
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
        data: gordo
      }]
    },
    options: {
      responsive: true,
      // title:      {
      //     display: true,
      //     text:    "Chart.js Time Scale"
      // },
      scales: {
        xAxes: [{
          type: "time",
          time: {
            // format: 'DD/MM/YYYY',
            tooltipFormat: 'll',
            displayFormats: {
              quarter: 'MMM YYYY'
            }
          } // scaleLabel: {
          //     display:     true,
          //     labelString: 'Date'
          // }

        }] // yAxes: [{
        //     scaleLabel: {
        //         display:     true,
        //         labelString: 'value'
        //     }
        // }]

      }
    }
  });
}

function evolucaoLabel(elementId, labels, quadrilEvolucao, toraxEvolucao, abdomenEvolucao, cinturaEvolucao, antebracosEvolucao, bracosEvolucao, coxasEvolucao, panturrilhasEvolucao) {
  // var ctx = document.getElementById("evolucaoChart");
  var ctx = document.getElementById(elementId);
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
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
        hidden: true
      }, {
        label: 'Quadril',
        pointRadius: 1,
        backgroundColor: "rgba(0, 0, 0, 0)",
        borderColor: "rgba(108, 145, 114, 0.7)",
        pointBackgroundColor: "rgba(38, 185, 154, 0.7)",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointBorderWidth: 1,
        data: quadrilEvolucao // spanGaps: true,

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
        data: toraxEvolucao
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
        data: abdomenEvolucao
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
        data: cinturaEvolucao
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
        hidden: true
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
        hidden: true
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
        hidden: true
      }]
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
            callback: function callback(tick) {
              return tick.toString() + '%';
            }
          }
        }]
      }
    }
  });
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
        data: [braco, peitoral, coxa, panturrilha, cintura, peso, altura]
      }, {
        label: 'Arnold',
        backgroundColor: "#26B99A",
        borderWidth: 1,
        data: [55.88, 144.78, 72.39, 50.8, 83.8, 106.5, 188]
      }]
    },
    options: {
      scales: {
        xAxes: [{
          stacked: true
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true
          },
          stacked: false
        }]
      }
    }
  });
}

function timeInBed(elementId, asleepData, awakeData, fallAsleepData, afterWakeUpData) {
  var weekDayName = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
  var chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
  };
  var todayDate = new Date();
  var yesterdayDate = new moment(todayDate).subtract(1, 'days');
  var last2DaysDate = new moment(todayDate).subtract(2, 'days');
  var last3DaysDate = new moment(todayDate).subtract(3, 'days');
  var last4DayDate = new moment(todayDate).subtract(4, 'days'); //   var ctx = document.getElementById("benchmarkingChart");

  var ctx = document.getElementById(elementId);
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Ano', 'Trim.', 'Mês', weekDayName[last4DayDate.day()], weekDayName[last3DaysDate.day()], weekDayName[last2DaysDate.day()], weekDayName[yesterdayDate.day()], 'Hoje'],
      datasets: [{
        label: 'Dormindo',
        backgroundColor: chartColors.red,
        data: asleepData
      }, {
        label: 'Acordado',
        backgroundColor: chartColors.blue,
        data: awakeData
      }, {
        label: 'Ant. Dormir',
        backgroundColor: chartColors.green,
        data: fallAsleepData
      }, {
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
          stacked: true
        }],
        yAxes: [{
          stacked: true
        }]
      }
    }
  });
}

function cardioDayly(elementId) {
  var todayData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var lastDay1Data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var lastDay2Data = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
  var lastDay3Data = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];
  var lastDay4Data = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : [];
  var weekDayName = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
  var ctx = document.getElementById(elementId);
  var todayDate = new Date();
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [{
        label: weekDayName[new moment(todayDate).subtract(4, 'days').day()],
        pointRadius: 0,
        backgroundColor: "rgba(0, 0, 0, 0)",
        borderColor: "rgba(108, 145, 114, 0.7)",
        data: lastDay4Data,
        hidden: true
      }, {
        label: weekDayName[new moment(todayDate).subtract(3, 'days').day()],
        pointRadius: 0,
        backgroundColor: "rgba(0, 0, 0, 0)",
        borderColor: "#9B0906",
        data: lastDay3Data,
        hidden: true
      }, {
        label: weekDayName[new moment(todayDate).subtract(2, 'days').day()],
        pointRadius: 0,
        backgroundColor: "rgba(0, 0, 0, 0)",
        borderColor: "#E74C3C",
        data: lastDay2Data
      }, {
        label: weekDayName[new moment(todayDate).subtract(1, 'days').day()],
        pointRadius: 0,
        backgroundColor: "rgba(0, 0, 0, 0)",
        borderColor: "#CFD4D8",
        data: lastDay1Data
      }, {
        label: "Hoje",
        borderColor: "#3498DB",
        backgroundColor: "rgba(0, 0, 0, 0)",
        pointRadius: 0,
        data: todayData
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
      }
    }
  });
}

function sonoEstagios(elementIdName, lastYear, last3Months, lastMonth, last4Day, last3Days, last2Days, yesterday, today, lastYearElementId, last3MonthsElementId, lastMonthElementId, last4DayElementId, last3DaysElementId, last2DaysElementId, yesterdayElementId, todayElementId, acordadoElementId, remElementId, profundoElementId, leveElementId) {
  var weekDayName = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
  var chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
  };
  var todayDate = new Date();
  var yesterdayDate = new moment(todayDate).subtract(1, 'days');
  var last2DaysDate = new moment(todayDate).subtract(2, 'days');
  var last3DaysDate = new moment(todayDate).subtract(3, 'days');
  var last4DayDate = new moment(todayDate).subtract(4, 'days');

  var showSonoDescription = function showSonoDescription(show, label, elementId) {
    if (!elementId || !label) {
      return;
    }

    if (show) {
      document.getElementById(elementId).innerHTML = label;
    } else {
      document.getElementById(elementId).innerHTML = "<s>".concat(label, "</s>");
    }
  };

  var showSonoLastYear = function showSonoLastYear(show) {
    return showSonoDescription(show, 'Ano', lastYearElementId);
  };

  var showSonoLast3Months = function showSonoLast3Months(show) {
    return showSonoDescription(show, 'Trim', last3MonthsElementId);
  };

  var showSonoLastMonth = function showSonoLastMonth(show) {
    return showSonoDescription(show, 'Mês', lastMonthElementId);
  };

  var showSonoLast4Day = function showSonoLast4Day(show) {
    return showSonoDescription(show, weekDayName[last4DayDate.day()], last4DayElementId);
  };

  var showSonoLast3Days = function showSonoLast3Days(show) {
    return showSonoDescription(show, weekDayName[last3DaysDate.day()], last3DaysElementId);
  };

  var showSonoLast2Days = function showSonoLast2Days(show) {
    return showSonoDescription(show, weekDayName[last2DaysDate.day()], last2DaysElementId);
  };

  var showSonoYesterday = function showSonoYesterday(show) {
    return showSonoDescription(show, weekDayName[yesterdayDate.day()], yesterdayElementId);
  };

  var showSonoToday = function showSonoToday(show) {
    return showSonoDescription(show, 'Hoje', todayElementId);
  };

  var lastYearShow = !(!lastYear || lastYear.length <= 0 || lastYear[0] == 0 && lastYear[1] == 0 && lastYear[2] == 0 && lastYear[3] == 0);
  var last3MonthsShow = !(!last3Months || last3Months.length <= 0 || last3Months[0] == 0 && last3Months[1] == 0 && last3Months[2] == 0 && last3Months[3] == 0);
  var lastMonthShow = !(!lastMonth || lastMonth.length <= 0 || lastMonth[0] == 0 && lastMonth[1] == 0 && lastMonth[2] == 0 && lastMonth[3] == 0);
  var last4DayShow = false;
  var last3DaysShow = false;
  var last2DaysShow = !(!last2Days || last2Days.length <= 0 || last2Days[0] == 0 && last2Days[1] == 0 && last2Days[2] == 0 && last2Days[3] == 0);
  var yesterdayShow = !(!yesterday || yesterday.length <= 0 || yesterday[0] == 0 && yesterday[1] == 0 && yesterday[2] == 0 && yesterday[3] == 0);
  var todayShow = !(!today || today.length <= 0 || today[0] == 0 && today[1] == 0 && today[2] == 0 && today[3] == 0);
  showSonoLastYear(lastYearShow);
  showSonoLast3Months(last3MonthsShow);
  showSonoLastMonth(lastMonthShow);
  showSonoLast4Day(last4DayShow);
  showSonoLast3Days(last3DaysShow);
  showSonoLast2Days(last2DaysShow);
  showSonoYesterday(yesterdayShow);
  showSonoToday(todayShow);
  var colors = [chartColors.red, chartColors.orange, chartColors.blue, chartColors.green];

  var showSonoLabelDescription = function showSonoLabelDescription(show, label, elementId, color) {
    if (!elementId || !label) {
      return;
    }

    if (show) {
      document.getElementById(elementId).innerHTML = "<i class=\"fa fa-square\" style=\"color:".concat(color, "\"></i>").concat(label);
    } else {
      document.getElementById(elementId).innerHTML = "<i class=\"fa fa-square\" style=\"color:".concat(color, "\"></i><s>").concat(label, "</s>");
    }
  };

  var showSonoAcordadoLabel = function showSonoAcordadoLabel(show) {
    return showSonoLabelDescription(show, 'Acordado', acordadoElementId, colors[0]);
  };

  var showSonoRemLabel = function showSonoRemLabel(show) {
    return showSonoLabelDescription(show, 'REM', remElementId, colors[1]);
  };

  var showSonoProfundoLabel = function showSonoProfundoLabel(show) {
    return showSonoLabelDescription(show, 'Profundo', profundoElementId, colors[2]);
  };

  var showSonoLeveLabel = function showSonoLeveLabel(show) {
    return showSonoLabelDescription(show, 'Leve', leveElementId, colors[3]);
  };

  showSonoAcordadoLabel(true);
  showSonoRemLabel(true);
  showSonoProfundoLabel(true);
  showSonoLeveLabel(true);
  var ctx = document.getElementById(elementIdName);
  var sonoEstagiosChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ["Awake", "REM", "Deep", "Light"],
      datasets: [{
        backgroundColor: colors,
        data: lastYear,
        hidden: !lastYearShow
      }, {
        backgroundColor: colors,
        data: last3Months,
        hidden: !last3MonthsShow
      }, {
        backgroundColor: colors,
        data: lastMonth,
        hidden: !lastMonthShow
      }, {
        backgroundColor: colors,
        data: last4Day,
        hidden: !last4DayShow
      }, {
        backgroundColor: colors,
        data: last3Days,
        hidden: !last3DaysShow
      }, {
        backgroundColor: colors,
        data: last2Days,
        hidden: !last2DaysShow
      }, {
        backgroundColor: colors,
        data: yesterday,
        hidden: !yesterdayShow
      }, {
        backgroundColor: colors,
        data: today,
        hidden: !todayShow
      }] // hiddenSlices: [1, 3]

    },
    options: {
      responsive: true,
      legend: {
        display: false
      },
      circumference: Math.PI,
      rotation: Math.PI / 2
    }
  });

  var hiddeItem = function hiddeItem(hidde, index) {
    sonoEstagiosChart.data.datasets[index].hidden = hidde;
    sonoEstagiosChart.update();
  };

  document.getElementById(lastYearElementId).onclick = function () {
    var hidde = !sonoEstagiosChart.data.datasets[0].hidden;
    showSonoLastYear(!hidde);
    hiddeItem(hidde, 0);
  };

  document.getElementById(last3MonthsElementId).onclick = function () {
    var hidde = !sonoEstagiosChart.data.datasets[1].hidden;
    showSonoLast3Months(!hidde);
    hiddeItem(hidde, 1);
  };

  document.getElementById(lastMonthElementId).onclick = function () {
    var hidde = !sonoEstagiosChart.data.datasets[2].hidden;
    showSonoLastMonth(!hidde);
    hiddeItem(hidde, 2);
  };

  document.getElementById(last4DayElementId).onclick = function () {
    var hidde = !sonoEstagiosChart.data.datasets[3].hidden;
    showSonoLast4Day(!hidde);
    hiddeItem(hidde, 3);
  };

  document.getElementById(last3DaysElementId).onclick = function () {
    var hidde = !sonoEstagiosChart.data.datasets[4].hidden;
    showSonoLast3Days(!hidde);
    hiddeItem(hidde, 4);
  };

  document.getElementById(last2DaysElementId).onclick = function () {
    var hidde = !sonoEstagiosChart.data.datasets[5].hidden;
    showSonoLast2Days(!hidde);
    hiddeItem(hidde, 5);
  };

  document.getElementById(yesterdayElementId).onclick = function () {
    var hidde = !sonoEstagiosChart.data.datasets[6].hidden;
    showSonoYesterday(!hidde);
    hiddeItem(hidde, 6);
  };

  document.getElementById(todayElementId).onclick = function () {
    var hidde = !sonoEstagiosChart.data.datasets[7].hidden;
    showSonoToday(!hidde);
    hiddeItem(hidde, 7);
  };

  var hiddeLabel = function hiddeLabel(hidde, index) {
    var shouldHidde = hidde === true ? true : false;

    for (var i = 0; i < sonoEstagiosChart.data.datasets.length; ++i) {
      sonoEstagiosChart.getDatasetMeta(i).data[index].hidden = shouldHidde;
    }

    sonoEstagiosChart.update();
  };

  document.getElementById(acordadoElementId).onclick = function () {
    var hidde = !sonoEstagiosChart.getDatasetMeta(0).data[0].hidden;
    showSonoAcordadoLabel(!hidde);
    hiddeLabel(hidde, 0);
  };

  document.getElementById(remElementId).onclick = function () {
    var hidde = !sonoEstagiosChart.getDatasetMeta(0).data[1].hidden;
    showSonoRemLabel(!hidde);
    hiddeLabel(hidde, 1);
  };

  document.getElementById(profundoElementId).onclick = function () {
    var hidde = !sonoEstagiosChart.getDatasetMeta(0).data[2].hidden;
    showSonoProfundoLabel(!hidde);
    hiddeLabel(hidde, 2);
  };

  document.getElementById(leveElementId).onclick = function () {
    var hidde = !sonoEstagiosChart.getDatasetMeta(0).data[3].hidden;
    showSonoLeveLabel(!hidde);
    hiddeLabel(hidde, 3);
  };
}

function cardioAcompanhament(elementIdName, outOfRangeData, fatBurnData, cardioData, peakData, belowLowData) {
  var weekDayName = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
  var chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
  };
  var todayDate = new Date();
  var yesterdayDate = new moment(todayDate).subtract(1, 'days');
  var last2DaysDate = new moment(todayDate).subtract(2, 'days');
  var last3DaysDate = new moment(todayDate).subtract(3, 'days');
  var last4DayDate = new moment(todayDate).subtract(4, 'days');
  var ctx = document.getElementById(elementIdName);
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Ano', 'Trim.', 'Mês', weekDayName[last4DayDate.day()], weekDayName[last3DaysDate.day()], weekDayName[last2DaysDate.day()], weekDayName[yesterdayDate.day()], 'Hoje'],
      datasets: [{
        label: "Pico",
        backgroundColor: chartColors.orange,
        data: peakData
      }, {
        label: "Cardio",
        backgroundColor: chartColors.green,
        data: cardioData
      }, {
        label: "Queima gordura",
        backgroundColor: chartColors.blue,
        data: fatBurnData
      }, {
        label: "Baixo",
        backgroundColor: chartColors.red,
        data: outOfRangeData
      }, {
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
          stacked: true
        }],
        yAxes: [{
          stacked: true
        }]
      }
    }
  });
}
"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//EDGE cant understand object property "..."
function bugObjPropertyEdge(odata) {
  odata = _objectSpread({}, odata, {
    groups: _objectSpread({}, odata.groups, {
      url: odata.url + odata.groups.point,
      nameSpace: odata.nameSpace + odata.groups.nameSpacePoint
    }),
    datas: _objectSpread({}, odata.datas, {
      url: odata.url + odata.datas.point,
      nameSpace: odata.nameSpace + odata.datas.nameSpacePoint,
      bulkInsert: _objectSpread({}, odata.datas.bulkInsert, {
        url: odata.url + odata.datas.point + odata.datas.bulkInsert.point
      }),
      decimals: _objectSpread({}, odata.datas.decimals, {
        url: odata.url + odata.datas.decimals.point,
        nameSpace: odata.nameSpace + odata.datas.decimals.nameSpacePoint
      }),
      strings: _objectSpread({}, odata.datas.strings, {
        url: odata.url + odata.datas.strings.point,
        nameSpace: odata.nameSpace + odata.datas.strings.nameSpacePoint
      })
    })
  });
  return odata;
}
/**
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var CURRENT_URL = window.location.href.split('#')[0].split('?')[0],
    $BODY = $('body'),
    $MENU_TOGGLE = $('#menu_toggle'),
    $SIDEBAR_MENU = $('#sidebar-menu'),
    $SIDEBAR_FOOTER = $('.sidebar-footer'),
    $LEFT_COL = $('.left_col'),
    $RIGHT_COL = $('.right_col'),
    $NAV_MENU = $('.nav_menu'),
    $FOOTER = $('footer'); // Sidebar

$(document).ready(function () {
  // TODO: This is some kind of easy fix, maybe we can improve this
  var setContentHeight = function setContentHeight() {
    // reset height
    $RIGHT_COL.css('min-height', $(window).height());
    var bodyHeight = $BODY.outerHeight(),
        footerHeight = $BODY.hasClass('footer_fixed') ? -10 : $FOOTER.height(),
        leftColHeight = $LEFT_COL.eq(1).height() + $SIDEBAR_FOOTER.height(),
        contentHeight = bodyHeight < leftColHeight ? leftColHeight : bodyHeight; // normalize content

    contentHeight -= $NAV_MENU.height() + footerHeight;
    $RIGHT_COL.css('min-height', contentHeight);
  };

  $SIDEBAR_MENU.find('a').on('click', function (ev) {
    var $li = $(this).parent();

    if ($li.is('.active')) {
      $li.removeClass('active active-sm');
      $('ul:first', $li).slideUp(function () {
        setContentHeight();
      });
    } else {
      // prevent closing menu if we are on child menu
      if (!$li.parent().is('.child_menu')) {
        $SIDEBAR_MENU.find('li').removeClass('active active-sm');
        $SIDEBAR_MENU.find('li ul').slideUp();
      }

      $li.addClass('active');
      $('ul:first', $li).slideDown(function () {
        setContentHeight();
      });
    }
  }); // toggle small or large menu

  $MENU_TOGGLE.on('click', function () {
    if ($BODY.hasClass('nav-md')) {
      $SIDEBAR_MENU.find('li.active ul').hide();
      $SIDEBAR_MENU.find('li.active').addClass('active-sm').removeClass('active');
    } else {
      $SIDEBAR_MENU.find('li.active-sm ul').show();
      $SIDEBAR_MENU.find('li.active-sm').addClass('active').removeClass('active-sm');
    }

    $BODY.toggleClass('nav-md nav-sm');
    setContentHeight();
    $('.dataTable').each(function () {
      $(this).dataTable().fnDraw();
    });
  }); // check active menu

  $SIDEBAR_MENU.find('a[href="' + CURRENT_URL + '"]').parent('li').addClass('current-page');
  $SIDEBAR_MENU.find('a').filter(function () {
    return this.href == CURRENT_URL;
  }).parent('li').addClass('current-page').parents('ul').slideDown(function () {
    setContentHeight();
  }).parent().addClass('active'); // recompute content when resizing

  $(window).smartresize(function () {
    setContentHeight();
  });
  setContentHeight(); // fixed sidebar

  if ($.fn.mCustomScrollbar) {
    $('.menu_fixed').mCustomScrollbar({
      autoHideScrollbar: true,
      theme: 'minimal',
      mouseWheel: {
        preventDefault: true
      }
    });
  }
}); // /Sidebar
// Panel toolbox

$(document).ready(function () {
  $('.collapse-link').on('click', function () {
    var $BOX_PANEL = $(this).closest('.x_panel'),
        $ICON = $(this).find('i'),
        $BOX_CONTENT = $BOX_PANEL.find('.x_content'); // fix for some div with hardcoded fix class

    if ($BOX_PANEL.attr('style')) {
      $BOX_CONTENT.slideToggle(200, function () {
        $BOX_PANEL.removeAttr('style');
      });
    } else {
      $BOX_CONTENT.slideToggle(200);
      $BOX_PANEL.css('height', 'auto');
    }

    $ICON.toggleClass('fa-chevron-up fa-chevron-down');
  });
  $('.close-link').click(function () {
    var $BOX_PANEL = $(this).closest('.x_panel');
    $BOX_PANEL.remove();
  });
}); // /Panel toolbox
// Tooltip

$(document).ready(function () {
  $('[data-toggle="tooltip"]').tooltip({
    container: 'body'
  });
}); // /Tooltip
// Progressbar

$(document).ready(function () {
  if ($(".progress .progress-bar")[0]) {
    $('.progress .progress-bar').progressbar();
  }
}); // /Progressbar
// Switchery

$(document).ready(function () {
  if ($(".js-switch")[0]) {
    var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
    elems.forEach(function (html) {
      var switchery = new Switchery(html, {
        color: '#26B99A'
      });
    });
  }
}); // /Switchery
// iCheck

$(document).ready(function () {
  if ($("input.flat")[0]) {
    $(document).ready(function () {
      $('input.flat').iCheck({
        checkboxClass: 'icheckbox_flat-green',
        radioClass: 'iradio_flat-green'
      });
    });
  }
}); // /iCheck
// Table

$('table input').on('ifChecked', function () {
  checkState = '';
  $(this).parent().parent().parent().addClass('selected');
  countChecked();
});
$('table input').on('ifUnchecked', function () {
  checkState = '';
  $(this).parent().parent().parent().removeClass('selected');
  countChecked();
});
var checkState = '';
$('.bulk_action input').on('ifChecked', function () {
  checkState = '';
  $(this).parent().parent().parent().addClass('selected');
  countChecked();
});
$('.bulk_action input').on('ifUnchecked', function () {
  checkState = '';
  $(this).parent().parent().parent().removeClass('selected');
  countChecked();
});
$('.bulk_action input#check-all').on('ifChecked', function () {
  checkState = 'all';
  countChecked();
});
$('.bulk_action input#check-all').on('ifUnchecked', function () {
  checkState = 'none';
  countChecked();
});

function countChecked() {
  if (checkState === 'all') {
    $(".bulk_action input[name='table_records']").iCheck('check');
  }

  if (checkState === 'none') {
    $(".bulk_action input[name='table_records']").iCheck('uncheck');
  }

  var checkCount = $(".bulk_action input[name='table_records']:checked").length;

  if (checkCount) {
    $('.column-title').hide();
    $('.bulk-actions').show();
    $('.action-cnt').html(checkCount + ' Records Selected');
  } else {
    $('.column-title').show();
    $('.bulk-actions').hide();
  }
} // Accordion


$(document).ready(function () {
  $(".expand").on("click", function () {
    $(this).next().slideToggle(200);
    $expand = $(this).find(">:first-child");

    if ($expand.text() == "+") {
      $expand.text("-");
    } else {
      $expand.text("+");
    }
  });
}); // NProgress

if (typeof NProgress != 'undefined') {
  $(document).ready(function () {
    NProgress.start();
  });
  $(window).on('load', function () {
    NProgress.done();
  });
}
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

!function (e) {
  function t(r) {
    if (n[r]) return n[r].exports;
    var o = n[r] = {
      i: r,
      l: !1,
      exports: {}
    };
    return e[r].call(o.exports, o, o.exports, t), o.l = !0, o.exports;
  }

  var n = {};
  t.m = e, t.c = n, t.d = function (e, n, r) {
    t.o(e, n) || Object.defineProperty(e, n, {
      configurable: !1,
      enumerable: !0,
      get: r
    });
  }, t.n = function (e) {
    var n = e && e.__esModule ? function () {
      return e["default"];
    } : function () {
      return e;
    };
    return t.d(n, "a", n), n;
  }, t.o = function (e, t) {
    return Object.prototype.hasOwnProperty.call(e, t);
  }, t.p = "/react-saude-exams-app/", t(t.s = 4);
}([function (e, t, n) {
  "use strict";

  e.exports = n(11);
}, function (e, t, n) {
  "use strict";

  function r(e) {
    if (null === e || void 0 === e) throw new TypeError("Object.assign cannot be called with null or undefined");
    return Object(e);
  }

  var o = Object.getOwnPropertySymbols,
      i = Object.prototype.hasOwnProperty,
      a = Object.prototype.propertyIsEnumerable;
  e.exports = function () {
    try {
      if (!Object.assign) return !1;
      var e = new String("abc");
      if (e[5] = "de", "5" === Object.getOwnPropertyNames(e)[0]) return !1;

      for (var t = {}, n = 0; n < 10; n++) {
        t["_" + String.fromCharCode(n)] = n;
      }

      if ("0123456789" !== Object.getOwnPropertyNames(t).map(function (e) {
        return t[e];
      }).join("")) return !1;
      var r = {};
      return "abcdefghijklmnopqrst".split("").forEach(function (e) {
        r[e] = e;
      }), "abcdefghijklmnopqrst" === Object.keys(Object.assign({}, r)).join("");
    } catch (e) {
      return !1;
    }
  }() ? Object.assign : function (e, t) {
    for (var n, l, u = r(e), c = 1; c < arguments.length; c++) {
      n = Object(arguments[c]);

      for (var s in n) {
        i.call(n, s) && (u[s] = n[s]);
      }

      if (o) {
        l = o(n);

        for (var f = 0; f < l.length; f++) {
          a.call(n, l[f]) && (u[l[f]] = n[l[f]]);
        }
      }
    }

    return u;
  };
}, function (e, t, n) {
  "use strict";

  function r() {}

  function o(e) {
    try {
      return e.then;
    } catch (e) {
      return v = e, b;
    }
  }

  function i(e, t) {
    try {
      return e(t);
    } catch (e) {
      return v = e, b;
    }
  }

  function a(e, t, n) {
    try {
      e(t, n);
    } catch (e) {
      return v = e, b;
    }
  }

  function l(e) {
    if ("object" !== _typeof(this)) throw new TypeError("Promises must be constructed via new");
    if ("function" !== typeof e) throw new TypeError("Promise constructor's argument is not a function");
    this._75 = 0, this._83 = 0, this._18 = null, this._38 = null, e !== r && m(e, this);
  }

  function u(e, t, n) {
    return new e.constructor(function (o, i) {
      var a = new l(r);
      a.then(o, i), c(e, new h(t, n, a));
    });
  }

  function c(e, t) {
    for (; 3 === e._83;) {
      e = e._18;
    }

    if (l._47 && l._47(e), 0 === e._83) return 0 === e._75 ? (e._75 = 1, void (e._38 = t)) : 1 === e._75 ? (e._75 = 2, void (e._38 = [e._38, t])) : void e._38.push(t);
    s(e, t);
  }

  function s(e, t) {
    y(function () {
      var n = 1 === e._83 ? t.onFulfilled : t.onRejected;
      if (null === n) return void (1 === e._83 ? f(t.promise, e._18) : d(t.promise, e._18));
      var r = i(n, e._18);
      r === b ? d(t.promise, v) : f(t.promise, r);
    });
  }

  function f(e, t) {
    if (t === e) return d(e, new TypeError("A promise cannot be resolved with itself."));

    if (t && ("object" === _typeof(t) || "function" === typeof t)) {
      var n = o(t);
      if (n === b) return d(e, v);
      if (n === e.then && t instanceof l) return e._83 = 3, e._18 = t, void p(e);
      if ("function" === typeof n) return void m(n.bind(t), e);
    }

    e._83 = 1, e._18 = t, p(e);
  }

  function d(e, t) {
    e._83 = 2, e._18 = t, l._71 && l._71(e, t), p(e);
  }

  function p(e) {
    if (1 === e._75 && (c(e, e._38), e._38 = null), 2 === e._75) {
      for (var t = 0; t < e._38.length; t++) {
        c(e, e._38[t]);
      }

      e._38 = null;
    }
  }

  function h(e, t, n) {
    this.onFulfilled = "function" === typeof e ? e : null, this.onRejected = "function" === typeof t ? t : null, this.promise = n;
  }

  function m(e, t) {
    var n = !1,
        r = a(e, function (e) {
      n || (n = !0, f(t, e));
    }, function (e) {
      n || (n = !0, d(t, e));
    });
    n || r !== b || (n = !0, d(t, v));
  }

  var y = n(7),
      v = null,
      b = {};
  e.exports = l, l._47 = null, l._71 = null, l._44 = r, l.prototype.then = function (e, t) {
    if (this.constructor !== l) return u(this, e, t);
    var n = new l(r);
    return c(this, new h(e, t, n)), n;
  };
}, function (e, t) {
  var n;

  n = function () {
    return this;
  }();

  try {
    n = n || Function("return this")() || (0, eval)("this");
  } catch (e) {
    "object" === (typeof window === "undefined" ? "undefined" : _typeof(window)) && (n = window);
  }

  e.exports = n;
}, function (e, t, n) {
  n(5), e.exports = n(10);
}, function (e, t, n) {
  "use strict";

  "undefined" === typeof Promise && (n(6).enable(), window.Promise = n(8)), n(9), Object.assign = n(1);
}, function (e, t, n) {
  "use strict";

  function r() {
    c = !1, l._47 = null, l._71 = null;
  }

  function o(e) {
    function t(t) {
      (e.allRejections || a(f[t].error, e.whitelist || u)) && (f[t].displayId = s++, e.onUnhandled ? (f[t].logged = !0, e.onUnhandled(f[t].displayId, f[t].error)) : (f[t].logged = !0, i(f[t].displayId, f[t].error)));
    }

    function n(t) {
      f[t].logged && (e.onHandled ? e.onHandled(f[t].displayId, f[t].error) : f[t].onUnhandled || (console.warn("Promise Rejection Handled (id: " + f[t].displayId + "):"), console.warn('  This means you can ignore any previous messages of the form "Possible Unhandled Promise Rejection" with id ' + f[t].displayId + ".")));
    }

    e = e || {}, c && r(), c = !0;
    var o = 0,
        s = 0,
        f = {};
    l._47 = function (e) {
      2 === e._83 && f[e._56] && (f[e._56].logged ? n(e._56) : clearTimeout(f[e._56].timeout), delete f[e._56]);
    }, l._71 = function (e, n) {
      0 === e._75 && (e._56 = o++, f[e._56] = {
        displayId: null,
        error: n,
        timeout: setTimeout(t.bind(null, e._56), a(n, u) ? 100 : 2e3),
        logged: !1
      });
    };
  }

  function i(e, t) {
    console.warn("Possible Unhandled Promise Rejection (id: " + e + "):"), ((t && (t.stack || t)) + "").split("\n").forEach(function (e) {
      console.warn("  " + e);
    });
  }

  function a(e, t) {
    return t.some(function (t) {
      return e instanceof t;
    });
  }

  var l = n(2),
      u = [ReferenceError, TypeError, RangeError],
      c = !1;
  t.disable = r, t.enable = o;
}, function (e, t, n) {
  "use strict";

  (function (t) {
    function n(e) {
      a.length || (i(), l = !0), a[a.length] = e;
    }

    function r() {
      for (; u < a.length;) {
        var e = u;

        if (u += 1, a[e].call(), u > c) {
          for (var t = 0, n = a.length - u; t < n; t++) {
            a[t] = a[t + u];
          }

          a.length -= u, u = 0;
        }
      }

      a.length = 0, u = 0, l = !1;
    }

    function o(e) {
      return function () {
        function t() {
          clearTimeout(n), clearInterval(r), e();
        }

        var n = setTimeout(t, 0),
            r = setInterval(t, 50);
      };
    }

    e.exports = n;
    var i,
        a = [],
        l = !1,
        u = 0,
        c = 1024,
        s = "undefined" !== typeof t ? t : self,
        f = s.MutationObserver || s.WebKitMutationObserver;
    i = "function" === typeof f ? function (e) {
      var t = 1,
          n = new f(e),
          r = document.createTextNode("");
      return n.observe(r, {
        characterData: !0
      }), function () {
        t = -t, r.data = t;
      };
    }(r) : o(r), n.requestFlush = i, n.makeRequestCallFromTimer = o;
  }).call(t, n(3));
}, function (e, t, n) {
  "use strict";

  function r(e) {
    var t = new o(o._44);
    return t._83 = 1, t._18 = e, t;
  }

  var o = n(2);
  e.exports = o;
  var i = r(!0),
      a = r(!1),
      l = r(null),
      u = r(void 0),
      c = r(0),
      s = r("");
  o.resolve = function (e) {
    if (e instanceof o) return e;
    if (null === e) return l;
    if (void 0 === e) return u;
    if (!0 === e) return i;
    if (!1 === e) return a;
    if (0 === e) return c;
    if ("" === e) return s;
    if ("object" === _typeof(e) || "function" === typeof e) try {
      var t = e.then;
      if ("function" === typeof t) return new o(t.bind(e));
    } catch (e) {
      return new o(function (t, n) {
        n(e);
      });
    }
    return r(e);
  }, o.all = function (e) {
    var t = Array.prototype.slice.call(e);
    return new o(function (e, n) {
      function r(a, l) {
        if (l && ("object" === _typeof(l) || "function" === typeof l)) {
          if (l instanceof o && l.then === o.prototype.then) {
            for (; 3 === l._83;) {
              l = l._18;
            }

            return 1 === l._83 ? r(a, l._18) : (2 === l._83 && n(l._18), void l.then(function (e) {
              r(a, e);
            }, n));
          }

          var u = l.then;

          if ("function" === typeof u) {
            return void new o(u.bind(l)).then(function (e) {
              r(a, e);
            }, n);
          }
        }

        t[a] = l, 0 === --i && e(t);
      }

      if (0 === t.length) return e([]);

      for (var i = t.length, a = 0; a < t.length; a++) {
        r(a, t[a]);
      }
    });
  }, o.reject = function (e) {
    return new o(function (t, n) {
      n(e);
    });
  }, o.race = function (e) {
    return new o(function (t, n) {
      e.forEach(function (e) {
        o.resolve(e).then(t, n);
      });
    });
  }, o.prototype["catch"] = function (e) {
    return this.then(null, e);
  };
}, function (e, t) {
  !function (e) {
    "use strict";

    function t(e) {
      if ("string" !== typeof e && (e = String(e)), /[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(e)) throw new TypeError("Invalid character in header field name");
      return e.toLowerCase();
    }

    function n(e) {
      return "string" !== typeof e && (e = String(e)), e;
    }

    function r(e) {
      var t = {
        next: function next() {
          var t = e.shift();
          return {
            done: void 0 === t,
            value: t
          };
        }
      };
      return v.iterable && (t[Symbol.iterator] = function () {
        return t;
      }), t;
    }

    function o(e) {
      this.map = {}, e instanceof o ? e.forEach(function (e, t) {
        this.append(t, e);
      }, this) : Array.isArray(e) ? e.forEach(function (e) {
        this.append(e[0], e[1]);
      }, this) : e && Object.getOwnPropertyNames(e).forEach(function (t) {
        this.append(t, e[t]);
      }, this);
    }

    function i(e) {
      if (e.bodyUsed) return Promise.reject(new TypeError("Already read"));
      e.bodyUsed = !0;
    }

    function a(e) {
      return new Promise(function (t, n) {
        e.onload = function () {
          t(e.result);
        }, e.onerror = function () {
          n(e.error);
        };
      });
    }

    function l(e) {
      var t = new FileReader(),
          n = a(t);
      return t.readAsArrayBuffer(e), n;
    }

    function u(e) {
      var t = new FileReader(),
          n = a(t);
      return t.readAsText(e), n;
    }

    function c(e) {
      for (var t = new Uint8Array(e), n = new Array(t.length), r = 0; r < t.length; r++) {
        n[r] = String.fromCharCode(t[r]);
      }

      return n.join("");
    }

    function s(e) {
      if (e.slice) return e.slice(0);
      var t = new Uint8Array(e.byteLength);
      return t.set(new Uint8Array(e)), t.buffer;
    }

    function f() {
      return this.bodyUsed = !1, this._initBody = function (e) {
        if (this._bodyInit = e, e) {
          if ("string" === typeof e) this._bodyText = e;else if (v.blob && Blob.prototype.isPrototypeOf(e)) this._bodyBlob = e;else if (v.formData && FormData.prototype.isPrototypeOf(e)) this._bodyFormData = e;else if (v.searchParams && URLSearchParams.prototype.isPrototypeOf(e)) this._bodyText = e.toString();else if (v.arrayBuffer && v.blob && g(e)) this._bodyArrayBuffer = s(e.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer]);else {
            if (!v.arrayBuffer || !ArrayBuffer.prototype.isPrototypeOf(e) && !w(e)) throw new Error("unsupported BodyInit type");
            this._bodyArrayBuffer = s(e);
          }
        } else this._bodyText = "";
        this.headers.get("content-type") || ("string" === typeof e ? this.headers.set("content-type", "text/plain;charset=UTF-8") : this._bodyBlob && this._bodyBlob.type ? this.headers.set("content-type", this._bodyBlob.type) : v.searchParams && URLSearchParams.prototype.isPrototypeOf(e) && this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"));
      }, v.blob && (this.blob = function () {
        var e = i(this);
        if (e) return e;
        if (this._bodyBlob) return Promise.resolve(this._bodyBlob);
        if (this._bodyArrayBuffer) return Promise.resolve(new Blob([this._bodyArrayBuffer]));
        if (this._bodyFormData) throw new Error("could not read FormData body as blob");
        return Promise.resolve(new Blob([this._bodyText]));
      }, this.arrayBuffer = function () {
        return this._bodyArrayBuffer ? i(this) || Promise.resolve(this._bodyArrayBuffer) : this.blob().then(l);
      }), this.text = function () {
        var e = i(this);
        if (e) return e;
        if (this._bodyBlob) return u(this._bodyBlob);
        if (this._bodyArrayBuffer) return Promise.resolve(c(this._bodyArrayBuffer));
        if (this._bodyFormData) throw new Error("could not read FormData body as text");
        return Promise.resolve(this._bodyText);
      }, v.formData && (this.formData = function () {
        return this.text().then(h);
      }), this.json = function () {
        return this.text().then(JSON.parse);
      }, this;
    }

    function d(e) {
      var t = e.toUpperCase();
      return k.indexOf(t) > -1 ? t : e;
    }

    function p(e, t) {
      t = t || {};
      var n = t.body;

      if (e instanceof p) {
        if (e.bodyUsed) throw new TypeError("Already read");
        this.url = e.url, this.credentials = e.credentials, t.headers || (this.headers = new o(e.headers)), this.method = e.method, this.mode = e.mode, n || null == e._bodyInit || (n = e._bodyInit, e.bodyUsed = !0);
      } else this.url = String(e);

      if (this.credentials = t.credentials || this.credentials || "omit", !t.headers && this.headers || (this.headers = new o(t.headers)), this.method = d(t.method || this.method || "GET"), this.mode = t.mode || this.mode || null, this.referrer = null, ("GET" === this.method || "HEAD" === this.method) && n) throw new TypeError("Body not allowed for GET or HEAD requests");

      this._initBody(n);
    }

    function h(e) {
      var t = new FormData();
      return e.trim().split("&").forEach(function (e) {
        if (e) {
          var n = e.split("="),
              r = n.shift().replace(/\+/g, " "),
              o = n.join("=").replace(/\+/g, " ");
          t.append(decodeURIComponent(r), decodeURIComponent(o));
        }
      }), t;
    }

    function m(e) {
      var t = new o();
      return e.split(/\r?\n/).forEach(function (e) {
        var n = e.split(":"),
            r = n.shift().trim();

        if (r) {
          var o = n.join(":").trim();
          t.append(r, o);
        }
      }), t;
    }

    function y(e, t) {
      t || (t = {}), this.type = "default", this.status = "status" in t ? t.status : 200, this.ok = this.status >= 200 && this.status < 300, this.statusText = "statusText" in t ? t.statusText : "OK", this.headers = new o(t.headers), this.url = t.url || "", this._initBody(e);
    }

    if (!e.fetch) {
      var v = {
        searchParams: "URLSearchParams" in e,
        iterable: "Symbol" in e && "iterator" in Symbol,
        blob: "FileReader" in e && "Blob" in e && function () {
          try {
            return new Blob(), !0;
          } catch (e) {
            return !1;
          }
        }(),
        formData: "FormData" in e,
        arrayBuffer: "ArrayBuffer" in e
      };
      if (v.arrayBuffer) var b = ["[object Int8Array]", "[object Uint8Array]", "[object Uint8ClampedArray]", "[object Int16Array]", "[object Uint16Array]", "[object Int32Array]", "[object Uint32Array]", "[object Float32Array]", "[object Float64Array]"],
          g = function g(e) {
        return e && DataView.prototype.isPrototypeOf(e);
      },
          w = ArrayBuffer.isView || function (e) {
        return e && b.indexOf(Object.prototype.toString.call(e)) > -1;
      };
      o.prototype.append = function (e, r) {
        e = t(e), r = n(r);
        var o = this.map[e];
        this.map[e] = o ? o + "," + r : r;
      }, o.prototype["delete"] = function (e) {
        delete this.map[t(e)];
      }, o.prototype.get = function (e) {
        return e = t(e), this.has(e) ? this.map[e] : null;
      }, o.prototype.has = function (e) {
        return this.map.hasOwnProperty(t(e));
      }, o.prototype.set = function (e, r) {
        this.map[t(e)] = n(r);
      }, o.prototype.forEach = function (e, t) {
        for (var n in this.map) {
          this.map.hasOwnProperty(n) && e.call(t, this.map[n], n, this);
        }
      }, o.prototype.keys = function () {
        var e = [];
        return this.forEach(function (t, n) {
          e.push(n);
        }), r(e);
      }, o.prototype.values = function () {
        var e = [];
        return this.forEach(function (t) {
          e.push(t);
        }), r(e);
      }, o.prototype.entries = function () {
        var e = [];
        return this.forEach(function (t, n) {
          e.push([n, t]);
        }), r(e);
      }, v.iterable && (o.prototype[Symbol.iterator] = o.prototype.entries);
      var k = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"];
      p.prototype.clone = function () {
        return new p(this, {
          body: this._bodyInit
        });
      }, f.call(p.prototype), f.call(y.prototype), y.prototype.clone = function () {
        return new y(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new o(this.headers),
          url: this.url
        });
      }, y.error = function () {
        var e = new y(null, {
          status: 0,
          statusText: ""
        });
        return e.type = "error", e;
      };
      var x = [301, 302, 303, 307, 308];
      y.redirect = function (e, t) {
        if (-1 === x.indexOf(t)) throw new RangeError("Invalid status code");
        return new y(null, {
          status: t,
          headers: {
            location: e
          }
        });
      }, e.Headers = o, e.Request = p, e.Response = y, e.fetch = function (e, t) {
        return new Promise(function (n, r) {
          var o = new p(e, t),
              i = new XMLHttpRequest();
          i.onload = function () {
            var e = {
              status: i.status,
              statusText: i.statusText,
              headers: m(i.getAllResponseHeaders() || "")
            };
            e.url = "responseURL" in i ? i.responseURL : e.headers.get("X-Request-URL");
            var t = "response" in i ? i.response : i.responseText;
            n(new y(t, e));
          }, i.onerror = function () {
            r(new TypeError("Network request failed"));
          }, i.ontimeout = function () {
            r(new TypeError("Network request failed"));
          }, i.open(o.method, o.url, !0), "include" === o.credentials && (i.withCredentials = !0), "responseType" in i && v.blob && (i.responseType = "blob"), o.headers.forEach(function (e, t) {
            i.setRequestHeader(t, e);
          }), i.send("undefined" === typeof o._bodyInit ? null : o._bodyInit);
        });
      }, e.fetch.polyfill = !0;
    }
  }("undefined" !== typeof self ? self : this);
}, function (e, t, n) {
  "use strict";

  Object.defineProperty(t, "__esModule", {
    value: !0
  });
  var r = n(0),
      o = n.n(r),
      i = n(12),
      a = n.n(i),
      l = n(16);
  a.a.render(o.a.createElement(l.a, null), document.getElementById("saudeExams"));
}, function (e, t, n) {
  "use strict";

  function r(e, t, n, r, o, i, a, l) {
    if (!e) {
      if (e = void 0, void 0 === t) e = Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");else {
        var u = [n, r, o, i, a, l],
            c = 0;
        e = Error(t.replace(/%s/g, function () {
          return u[c++];
        })), e.name = "Invariant Violation";
      }
      throw e.framesToPop = 1, e;
    }
  }

  function o(e) {
    for (var t = arguments.length - 1, n = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, o = 0; o < t; o++) {
      n += "&args[]=" + encodeURIComponent(arguments[o + 1]);
    }

    r(!1, "Minified React error #" + e + "; visit %s for the full message or use the non-minified dev environment for full errors and additional helpful warnings. ", n);
  }

  function i(e, t, n) {
    this.props = e, this.context = t, this.refs = A, this.updater = n || U;
  }

  function a() {}

  function l(e, t, n) {
    this.props = e, this.context = t, this.refs = A, this.updater = n || U;
  }

  function u(e, t, n) {
    var r = void 0,
        o = {},
        i = null,
        a = null;
    if (null != t) for (r in void 0 !== t.ref && (a = t.ref), void 0 !== t.key && (i = "" + t.key), t) {
      B.call(t, r) && !W.hasOwnProperty(r) && (o[r] = t[r]);
    }
    var l = arguments.length - 2;
    if (1 === l) o.children = n;else if (1 < l) {
      for (var u = Array(l), c = 0; c < l; c++) {
        u[c] = arguments[c + 2];
      }

      o.children = u;
    }
    if (e && e.defaultProps) for (r in l = e.defaultProps) {
      void 0 === o[r] && (o[r] = l[r]);
    }
    return {
      $$typeof: _,
      type: e,
      key: i,
      ref: a,
      props: o,
      _owner: L.current
    };
  }

  function c(e, t) {
    return {
      $$typeof: _,
      type: e.type,
      key: t,
      ref: e.ref,
      props: e.props,
      _owner: e._owner
    };
  }

  function s(e) {
    return "object" === _typeof(e) && null !== e && e.$$typeof === _;
  }

  function f(e) {
    var t = {
      "=": "=0",
      ":": "=2"
    };
    return "$" + ("" + e).replace(/[=:]/g, function (e) {
      return t[e];
    });
  }

  function d(e, t, n, r) {
    if (H.length) {
      var o = H.pop();
      return o.result = e, o.keyPrefix = t, o.func = n, o.context = r, o.count = 0, o;
    }

    return {
      result: e,
      keyPrefix: t,
      func: n,
      context: r,
      count: 0
    };
  }

  function p(e) {
    e.result = null, e.keyPrefix = null, e.func = null, e.context = null, e.count = 0, 10 > H.length && H.push(e);
  }

  function h(e, t, n, r) {
    var i = _typeof(e);

    "undefined" !== i && "boolean" !== i || (e = null);
    var a = !1;
    if (null === e) a = !0;else switch (i) {
      case "string":
      case "number":
        a = !0;
        break;

      case "object":
        switch (e.$$typeof) {
          case _:
          case T:
            a = !0;
        }

    }
    if (a) return n(r, e, "" === t ? "." + y(e, 0) : t), 1;
    if (a = 0, t = "" === t ? "." : t + ":", Array.isArray(e)) for (var l = 0; l < e.length; l++) {
      i = e[l];
      var u = t + y(i, l);
      a += h(i, u, n, r);
    } else if (null === e || "object" !== _typeof(e) ? u = null : (u = I && e[I] || e["@@iterator"], u = "function" === typeof u ? u : null), "function" === typeof u) for (e = u.call(e), l = 0; !(i = e.next()).done;) {
      i = i.value, u = t + y(i, l++), a += h(i, u, n, r);
    } else "object" === i && (n = "" + e, o("31", "[object Object]" === n ? "object with keys {" + Object.keys(e).join(", ") + "}" : n, ""));
    return a;
  }

  function m(e, t, n) {
    return null == e ? 0 : h(e, "", t, n);
  }

  function y(e, t) {
    return "object" === _typeof(e) && null !== e && null != e.key ? f(e.key) : t.toString(36);
  }

  function v(e, t) {
    e.func.call(e.context, t, e.count++);
  }

  function b(e, t, n) {
    var r = e.result,
        o = e.keyPrefix;
    e = e.func.call(e.context, t, e.count++), Array.isArray(e) ? g(e, r, n, function (e) {
      return e;
    }) : null != e && (s(e) && (e = c(e, o + (!e.key || t && t.key === e.key ? "" : ("" + e.key).replace(V, "$&/") + "/") + n)), r.push(e));
  }

  function g(e, t, n, r, o) {
    var i = "";
    null != n && (i = ("" + n).replace(V, "$&/") + "/"), t = d(t, i, r, o), m(e, b, t), p(t);
  }

  function w() {
    var e = z.current;
    return null === e && o("321"), e;
  }

  var k = n(1),
      x = "function" === typeof Symbol && Symbol["for"],
      _ = x ? Symbol["for"]("react.element") : 60103,
      T = x ? Symbol["for"]("react.portal") : 60106,
      E = x ? Symbol["for"]("react.fragment") : 60107,
      C = x ? Symbol["for"]("react.strict_mode") : 60108,
      S = x ? Symbol["for"]("react.profiler") : 60114,
      P = x ? Symbol["for"]("react.provider") : 60109,
      O = x ? Symbol["for"]("react.context") : 60110,
      N = x ? Symbol["for"]("react.concurrent_mode") : 60111,
      D = x ? Symbol["for"]("react.forward_ref") : 60112,
      j = x ? Symbol["for"]("react.suspense") : 60113,
      M = x ? Symbol["for"]("react.memo") : 60115,
      R = x ? Symbol["for"]("react.lazy") : 60116,
      I = "function" === typeof Symbol && Symbol.iterator,
      U = {
    isMounted: function isMounted() {
      return !1;
    },
    enqueueForceUpdate: function enqueueForceUpdate() {},
    enqueueReplaceState: function enqueueReplaceState() {},
    enqueueSetState: function enqueueSetState() {}
  },
      A = {};

  i.prototype.isReactComponent = {}, i.prototype.setState = function (e, t) {
    "object" !== _typeof(e) && "function" !== typeof e && null != e && o("85"), this.updater.enqueueSetState(this, e, t, "setState");
  }, i.prototype.forceUpdate = function (e) {
    this.updater.enqueueForceUpdate(this, e, "forceUpdate");
  }, a.prototype = i.prototype;
  var F = l.prototype = new a();
  F.constructor = l, k(F, i.prototype), F.isPureReactComponent = !0;
  var z = {
    current: null
  },
      L = {
    current: null
  },
      B = Object.prototype.hasOwnProperty,
      W = {
    key: !0,
    ref: !0,
    __self: !0,
    __source: !0
  },
      V = /\/+/g,
      H = [],
      $ = {
    Children: {
      map: function map(e, t, n) {
        if (null == e) return e;
        var r = [];
        return g(e, r, null, t, n), r;
      },
      forEach: function forEach(e, t, n) {
        if (null == e) return e;
        t = d(null, null, t, n), m(e, v, t), p(t);
      },
      count: function count(e) {
        return m(e, function () {
          return null;
        }, null);
      },
      toArray: function toArray(e) {
        var t = [];
        return g(e, t, null, function (e) {
          return e;
        }), t;
      },
      only: function only(e) {
        return s(e) || o("143"), e;
      }
    },
    createRef: function createRef() {
      return {
        current: null
      };
    },
    Component: i,
    PureComponent: l,
    createContext: function createContext(e, t) {
      return void 0 === t && (t = null), e = {
        $$typeof: O,
        _calculateChangedBits: t,
        _currentValue: e,
        _currentValue2: e,
        _threadCount: 0,
        Provider: null,
        Consumer: null
      }, e.Provider = {
        $$typeof: P,
        _context: e
      }, e.Consumer = e;
    },
    forwardRef: function forwardRef(e) {
      return {
        $$typeof: D,
        render: e
      };
    },
    lazy: function lazy(e) {
      return {
        $$typeof: R,
        _ctor: e,
        _status: -1,
        _result: null
      };
    },
    memo: function memo(e, t) {
      return {
        $$typeof: M,
        type: e,
        compare: void 0 === t ? null : t
      };
    },
    useCallback: function useCallback(e, t) {
      return w().useCallback(e, t);
    },
    useContext: function useContext(e, t) {
      return w().useContext(e, t);
    },
    useEffect: function useEffect(e, t) {
      return w().useEffect(e, t);
    },
    useImperativeHandle: function useImperativeHandle(e, t, n) {
      return w().useImperativeHandle(e, t, n);
    },
    useDebugValue: function useDebugValue() {},
    useLayoutEffect: function useLayoutEffect(e, t) {
      return w().useLayoutEffect(e, t);
    },
    useMemo: function useMemo(e, t) {
      return w().useMemo(e, t);
    },
    useReducer: function useReducer(e, t, n) {
      return w().useReducer(e, t, n);
    },
    useRef: function useRef(e) {
      return w().useRef(e);
    },
    useState: function useState(e) {
      return w().useState(e);
    },
    Fragment: E,
    StrictMode: C,
    Suspense: j,
    createElement: u,
    cloneElement: function cloneElement(e, t, n) {
      (null === e || void 0 === e) && o("267", e);
      var r = void 0,
          i = k({}, e.props),
          a = e.key,
          l = e.ref,
          u = e._owner;

      if (null != t) {
        void 0 !== t.ref && (l = t.ref, u = L.current), void 0 !== t.key && (a = "" + t.key);
        var c = void 0;
        e.type && e.type.defaultProps && (c = e.type.defaultProps);

        for (r in t) {
          B.call(t, r) && !W.hasOwnProperty(r) && (i[r] = void 0 === t[r] && void 0 !== c ? c[r] : t[r]);
        }
      }

      if (1 === (r = arguments.length - 2)) i.children = n;else if (1 < r) {
        c = Array(r);

        for (var s = 0; s < r; s++) {
          c[s] = arguments[s + 2];
        }

        i.children = c;
      }
      return {
        $$typeof: _,
        type: e.type,
        key: a,
        ref: l,
        props: i,
        _owner: u
      };
    },
    createFactory: function createFactory(e) {
      var t = u.bind(null, e);
      return t.type = e, t;
    },
    isValidElement: s,
    version: "16.8.6",
    unstable_ConcurrentMode: N,
    unstable_Profiler: S,
    __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: {
      ReactCurrentDispatcher: z,
      ReactCurrentOwner: L,
      assign: k
    }
  },
      q = {
    "default": $
  },
      Q = q && $ || q;
  e.exports = Q["default"] || Q;
}, function (e, t, n) {
  "use strict";

  function r() {
    if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE) try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(r);
    } catch (e) {
      console.error(e);
    }
  }

  r(), e.exports = n(13);
}, function (e, t, n) {
  "use strict";

  function r(e, t, n, r, o, i, a, l) {
    if (!e) {
      if (e = void 0, void 0 === t) e = Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");else {
        var u = [n, r, o, i, a, l],
            c = 0;
        e = Error(t.replace(/%s/g, function () {
          return u[c++];
        })), e.name = "Invariant Violation";
      }
      throw e.framesToPop = 1, e;
    }
  }

  function o(e) {
    for (var t = arguments.length - 1, n = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, o = 0; o < t; o++) {
      n += "&args[]=" + encodeURIComponent(arguments[o + 1]);
    }

    r(!1, "Minified React error #" + e + "; visit %s for the full message or use the non-minified dev environment for full errors and additional helpful warnings. ", n);
  }

  function i(e, t, n, r, o, i, a, l, u) {
    var c = Array.prototype.slice.call(arguments, 3);

    try {
      t.apply(n, c);
    } catch (e) {
      this.onError(e);
    }
  }

  function a(e, t, n, r, o, a, l, u, c) {
    co = !1, so = null, i.apply(ho, arguments);
  }

  function l(e, t, n, r, i, l, u, c, s) {
    if (a.apply(this, arguments), co) {
      if (co) {
        var f = so;
        co = !1, so = null;
      } else o("198"), f = void 0;

      fo || (fo = !0, po = f);
    }
  }

  function u() {
    if (mo) for (var e in yo) {
      var t = yo[e],
          n = mo.indexOf(e);

      if (-1 < n || o("96", e), !vo[n]) {
        t.extractEvents || o("97", e), vo[n] = t, n = t.eventTypes;

        for (var r in n) {
          var i = void 0,
              a = n[r],
              l = t,
              u = r;
          bo.hasOwnProperty(u) && o("99", u), bo[u] = a;
          var s = a.phasedRegistrationNames;

          if (s) {
            for (i in s) {
              s.hasOwnProperty(i) && c(s[i], l, u);
            }

            i = !0;
          } else a.registrationName ? (c(a.registrationName, l, u), i = !0) : i = !1;

          i || o("98", r, e);
        }
      }
    }
  }

  function c(e, t, n) {
    go[e] && o("100", e), go[e] = t, wo[e] = t.eventTypes[n].dependencies;
  }

  function s(e, t, n) {
    var r = e.type || "unknown-event";
    e.currentTarget = _o(n), l(r, t, void 0, e), e.currentTarget = null;
  }

  function f(e, t) {
    return null == t && o("30"), null == e ? t : Array.isArray(e) ? Array.isArray(t) ? (e.push.apply(e, t), e) : (e.push(t), e) : Array.isArray(t) ? [e].concat(t) : [e, t];
  }

  function d(e, t, n) {
    Array.isArray(e) ? e.forEach(t, n) : e && t.call(n, e);
  }

  function p(e) {
    if (e) {
      var t = e._dispatchListeners,
          n = e._dispatchInstances;
      if (Array.isArray(t)) for (var r = 0; r < t.length && !e.isPropagationStopped(); r++) {
        s(e, t[r], n[r]);
      } else t && s(e, t, n);
      e._dispatchListeners = null, e._dispatchInstances = null, e.isPersistent() || e.constructor.release(e);
    }
  }

  function h(e, t) {
    var n = e.stateNode;
    if (!n) return null;
    var r = ko(n);
    if (!r) return null;
    n = r[t];

    e: switch (t) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
        (r = !r.disabled) || (e = e.type, r = !("button" === e || "input" === e || "select" === e || "textarea" === e)), e = !r;
        break e;

      default:
        e = !1;
    }

    return e ? null : (n && "function" !== typeof n && o("231", t, _typeof(n)), n);
  }

  function m(e) {
    if (null !== e && (To = f(To, e)), e = To, To = null, e && (d(e, p), To && o("95"), fo)) throw e = po, fo = !1, po = null, e;
  }

  function y(e) {
    if (e[So]) return e[So];

    for (; !e[So];) {
      if (!e.parentNode) return null;
      e = e.parentNode;
    }

    return e = e[So], 5 === e.tag || 6 === e.tag ? e : null;
  }

  function v(e) {
    return e = e[So], !e || 5 !== e.tag && 6 !== e.tag ? null : e;
  }

  function b(e) {
    if (5 === e.tag || 6 === e.tag) return e.stateNode;
    o("33");
  }

  function g(e) {
    return e[Po] || null;
  }

  function w(e) {
    do {
      e = e["return"];
    } while (e && 5 !== e.tag);

    return e || null;
  }

  function k(e, t, n) {
    (t = h(e, n.dispatchConfig.phasedRegistrationNames[t])) && (n._dispatchListeners = f(n._dispatchListeners, t), n._dispatchInstances = f(n._dispatchInstances, e));
  }

  function x(e) {
    if (e && e.dispatchConfig.phasedRegistrationNames) {
      for (var t = e._targetInst, n = []; t;) {
        n.push(t), t = w(t);
      }

      for (t = n.length; 0 < t--;) {
        k(n[t], "captured", e);
      }

      for (t = 0; t < n.length; t++) {
        k(n[t], "bubbled", e);
      }
    }
  }

  function _(e, t, n) {
    e && n && n.dispatchConfig.registrationName && (t = h(e, n.dispatchConfig.registrationName)) && (n._dispatchListeners = f(n._dispatchListeners, t), n._dispatchInstances = f(n._dispatchInstances, e));
  }

  function T(e) {
    e && e.dispatchConfig.registrationName && _(e._targetInst, null, e);
  }

  function E(e) {
    d(e, x);
  }

  function C(e, t) {
    var n = {};
    return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
  }

  function S(e) {
    if (Do[e]) return Do[e];
    if (!No[e]) return e;
    var t,
        n = No[e];

    for (t in n) {
      if (n.hasOwnProperty(t) && t in jo) return Do[e] = n[t];
    }

    return e;
  }

  function P() {
    if (Lo) return Lo;
    var e,
        t,
        n = zo,
        r = n.length,
        o = "value" in Fo ? Fo.value : Fo.textContent,
        i = o.length;

    for (e = 0; e < r && n[e] === o[e]; e++) {
      ;
    }

    var a = r - e;

    for (t = 1; t <= a && n[r - t] === o[i - t]; t++) {
      ;
    }

    return Lo = o.slice(e, 1 < t ? 1 - t : void 0);
  }

  function O() {
    return !0;
  }

  function N() {
    return !1;
  }

  function D(e, t, n, r) {
    this.dispatchConfig = e, this._targetInst = t, this.nativeEvent = n, e = this.constructor.Interface;

    for (var o in e) {
      e.hasOwnProperty(o) && ((t = e[o]) ? this[o] = t(n) : "target" === o ? this.target = r : this[o] = n[o]);
    }

    return this.isDefaultPrevented = (null != n.defaultPrevented ? n.defaultPrevented : !1 === n.returnValue) ? O : N, this.isPropagationStopped = N, this;
  }

  function j(e, t, n, r) {
    if (this.eventPool.length) {
      var o = this.eventPool.pop();
      return this.call(o, e, t, n, r), o;
    }

    return new this(e, t, n, r);
  }

  function M(e) {
    e instanceof this || o("279"), e.destructor(), 10 > this.eventPool.length && this.eventPool.push(e);
  }

  function R(e) {
    e.eventPool = [], e.getPooled = j, e.release = M;
  }

  function I(e, t) {
    switch (e) {
      case "keyup":
        return -1 !== Vo.indexOf(t.keyCode);

      case "keydown":
        return 229 !== t.keyCode;

      case "keypress":
      case "mousedown":
      case "blur":
        return !0;

      default:
        return !1;
    }
  }

  function U(e) {
    return e = e.detail, "object" === _typeof(e) && "data" in e ? e.data : null;
  }

  function A(e, t) {
    switch (e) {
      case "compositionend":
        return U(t);

      case "keypress":
        return 32 !== t.which ? null : (Xo = !0, Yo);

      case "textInput":
        return e = t.data, e === Yo && Xo ? null : e;

      default:
        return null;
    }
  }

  function F(e, t) {
    if (Go) return "compositionend" === e || !Ho && I(e, t) ? (e = P(), Lo = zo = Fo = null, Go = !1, e) : null;

    switch (e) {
      case "paste":
        return null;

      case "keypress":
        if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
          if (t["char"] && 1 < t["char"].length) return t["char"];
          if (t.which) return String.fromCharCode(t.which);
        }

        return null;

      case "compositionend":
        return Qo && "ko" !== t.locale ? null : t.data;

      default:
        return null;
    }
  }

  function z(e) {
    if (e = xo(e)) {
      "function" !== typeof Zo && o("280");
      var t = ko(e.stateNode);
      Zo(e.stateNode, e.type, t);
    }
  }

  function L(e) {
    ei ? ti ? ti.push(e) : ti = [e] : ei = e;
  }

  function B() {
    if (ei) {
      var e = ei,
          t = ti;
      if (ti = ei = null, z(e), t) for (e = 0; e < t.length; e++) {
        z(t[e]);
      }
    }
  }

  function W(e, t) {
    return e(t);
  }

  function V(e, t, n) {
    return e(t, n);
  }

  function H() {}

  function $(e, t) {
    if (ni) return e(t);
    ni = !0;

    try {
      return W(e, t);
    } finally {
      ni = !1, (null !== ei || null !== ti) && (H(), B());
    }
  }

  function q(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return "input" === t ? !!ri[e.type] : "textarea" === t;
  }

  function Q(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), 3 === e.nodeType ? e.parentNode : e;
  }

  function Y(e) {
    if (!Oo) return !1;
    e = "on" + e;
    var t = e in document;
    return t || (t = document.createElement("div"), t.setAttribute(e, "return;"), t = "function" === typeof t[e]), t;
  }

  function K(e) {
    var t = e.type;
    return (e = e.nodeName) && "input" === e.toLowerCase() && ("checkbox" === t || "radio" === t);
  }

  function X(e) {
    var t = K(e) ? "checked" : "value",
        n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t),
        r = "" + e[t];

    if (!e.hasOwnProperty(t) && "undefined" !== typeof n && "function" === typeof n.get && "function" === typeof n.set) {
      var o = n.get,
          i = n.set;
      return Object.defineProperty(e, t, {
        configurable: !0,
        get: function get() {
          return o.call(this);
        },
        set: function set(e) {
          r = "" + e, i.call(this, e);
        }
      }), Object.defineProperty(e, t, {
        enumerable: n.enumerable
      }), {
        getValue: function getValue() {
          return r;
        },
        setValue: function setValue(e) {
          r = "" + e;
        },
        stopTracking: function stopTracking() {
          e._valueTracker = null, delete e[t];
        }
      };
    }
  }

  function G(e) {
    e._valueTracker || (e._valueTracker = X(e));
  }

  function J(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var n = t.getValue(),
        r = "";
    return e && (r = K(e) ? e.checked ? "true" : "false" : e.value), (e = r) !== n && (t.setValue(e), !0);
  }

  function Z(e) {
    return null === e || "object" !== _typeof(e) ? null : (e = gi && e[gi] || e["@@iterator"], "function" === typeof e ? e : null);
  }

  function ee(e) {
    if (null == e) return null;
    if ("function" === typeof e) return e.displayName || e.name || null;
    if ("string" === typeof e) return e;

    switch (e) {
      case hi:
        return "ConcurrentMode";

      case ci:
        return "Fragment";

      case ui:
        return "Portal";

      case fi:
        return "Profiler";

      case si:
        return "StrictMode";

      case yi:
        return "Suspense";
    }

    if ("object" === _typeof(e)) switch (e.$$typeof) {
      case pi:
        return "Context.Consumer";

      case di:
        return "Context.Provider";

      case mi:
        var t = e.render;
        return t = t.displayName || t.name || "", e.displayName || ("" !== t ? "ForwardRef(" + t + ")" : "ForwardRef");

      case vi:
        return ee(e.type);

      case bi:
        if (e = 1 === e._status ? e._result : null) return ee(e);
    }
    return null;
  }

  function te(e) {
    var t = "";

    do {
      e: switch (e.tag) {
        case 3:
        case 4:
        case 6:
        case 7:
        case 10:
        case 9:
          var n = "";
          break e;

        default:
          var r = e._debugOwner,
              o = e._debugSource,
              i = ee(e.type);
          n = null, r && (n = ee(r.type)), r = i, i = "", o ? i = " (at " + o.fileName.replace(ii, "") + ":" + o.lineNumber + ")" : n && (i = " (created by " + n + ")"), n = "\n    in " + (r || "Unknown") + i;
      }

      t += n, e = e["return"];
    } while (e);

    return t;
  }

  function ne(e) {
    return !!ki.call(_i, e) || !ki.call(xi, e) && (wi.test(e) ? _i[e] = !0 : (xi[e] = !0, !1));
  }

  function re(e, t, n, r) {
    if (null !== n && 0 === n.type) return !1;

    switch (_typeof(t)) {
      case "function":
      case "symbol":
        return !0;

      case "boolean":
        return !r && (null !== n ? !n.acceptsBooleans : "data-" !== (e = e.toLowerCase().slice(0, 5)) && "aria-" !== e);

      default:
        return !1;
    }
  }

  function oe(e, t, n, r) {
    if (null === t || "undefined" === typeof t || re(e, t, n, r)) return !0;
    if (r) return !1;
    if (null !== n) switch (n.type) {
      case 3:
        return !t;

      case 4:
        return !1 === t;

      case 5:
        return isNaN(t);

      case 6:
        return isNaN(t) || 1 > t;
    }
    return !1;
  }

  function ie(e, t, n, r, o) {
    this.acceptsBooleans = 2 === t || 3 === t || 4 === t, this.attributeName = r, this.attributeNamespace = o, this.mustUseProperty = n, this.propertyName = e, this.type = t;
  }

  function ae(e) {
    return e[1].toUpperCase();
  }

  function le(e, t, n, r) {
    var o = Ti.hasOwnProperty(t) ? Ti[t] : null;
    (null !== o ? 0 === o.type : !r && 2 < t.length && ("o" === t[0] || "O" === t[0]) && ("n" === t[1] || "N" === t[1])) || (oe(t, n, o, r) && (n = null), r || null === o ? ne(t) && (null === n ? e.removeAttribute(t) : e.setAttribute(t, "" + n)) : o.mustUseProperty ? e[o.propertyName] = null === n ? 3 !== o.type && "" : n : (t = o.attributeName, r = o.attributeNamespace, null === n ? e.removeAttribute(t) : (o = o.type, n = 3 === o || 4 === o && !0 === n ? "" : "" + n, r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))));
  }

  function ue(e) {
    switch (_typeof(e)) {
      case "boolean":
      case "number":
      case "object":
      case "string":
      case "undefined":
        return e;

      default:
        return "";
    }
  }

  function ce(e, t) {
    var n = t.checked;
    return lo({}, t, {
      defaultChecked: void 0,
      defaultValue: void 0,
      value: void 0,
      checked: null != n ? n : e._wrapperState.initialChecked
    });
  }

  function se(e, t) {
    var n = null == t.defaultValue ? "" : t.defaultValue,
        r = null != t.checked ? t.checked : t.defaultChecked;
    n = ue(null != t.value ? t.value : n), e._wrapperState = {
      initialChecked: r,
      initialValue: n,
      controlled: "checkbox" === t.type || "radio" === t.type ? null != t.checked : null != t.value
    };
  }

  function fe(e, t) {
    null != (t = t.checked) && le(e, "checked", t, !1);
  }

  function de(e, t) {
    fe(e, t);
    var n = ue(t.value),
        r = t.type;
    if (null != n) "number" === r ? (0 === n && "" === e.value || e.value != n) && (e.value = "" + n) : e.value !== "" + n && (e.value = "" + n);else if ("submit" === r || "reset" === r) return void e.removeAttribute("value");
    t.hasOwnProperty("value") ? he(e, t.type, n) : t.hasOwnProperty("defaultValue") && he(e, t.type, ue(t.defaultValue)), null == t.checked && null != t.defaultChecked && (e.defaultChecked = !!t.defaultChecked);
  }

  function pe(e, t, n) {
    if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
      var r = t.type;
      if (!("submit" !== r && "reset" !== r || void 0 !== t.value && null !== t.value)) return;
      t = "" + e._wrapperState.initialValue, n || t === e.value || (e.value = t), e.defaultValue = t;
    }

    n = e.name, "" !== n && (e.name = ""), e.defaultChecked = !e.defaultChecked, e.defaultChecked = !!e._wrapperState.initialChecked, "" !== n && (e.name = n);
  }

  function he(e, t, n) {
    "number" === t && e.ownerDocument.activeElement === e || (null == n ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + n && (e.defaultValue = "" + n));
  }

  function me(e, t, n) {
    return e = D.getPooled(Ci.change, e, t, n), e.type = "change", L(n), E(e), e;
  }

  function ye(e) {
    m(e);
  }

  function ve(e) {
    if (J(b(e))) return e;
  }

  function be(e, t) {
    if ("change" === e) return t;
  }

  function ge() {
    Si && (Si.detachEvent("onpropertychange", we), Pi = Si = null);
  }

  function we(e) {
    "value" === e.propertyName && ve(Pi) && (e = me(Pi, e, Q(e)), $(ye, e));
  }

  function ke(e, t, n) {
    "focus" === e ? (ge(), Si = t, Pi = n, Si.attachEvent("onpropertychange", we)) : "blur" === e && ge();
  }

  function xe(e) {
    if ("selectionchange" === e || "keyup" === e || "keydown" === e) return ve(Pi);
  }

  function _e(e, t) {
    if ("click" === e) return ve(t);
  }

  function Te(e, t) {
    if ("input" === e || "change" === e) return ve(t);
  }

  function Ee(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : !!(e = ji[e]) && !!t[e];
  }

  function Ce() {
    return Ee;
  }

  function Se(e, t) {
    return e === t && (0 !== e || 1 / e === 1 / t) || e !== e && t !== t;
  }

  function Pe(e, t) {
    if (Se(e, t)) return !0;
    if ("object" !== _typeof(e) || null === e || "object" !== _typeof(t) || null === t) return !1;
    var n = Object.keys(e),
        r = Object.keys(t);
    if (n.length !== r.length) return !1;

    for (r = 0; r < n.length; r++) {
      if (!Bi.call(t, n[r]) || !Se(e[n[r]], t[n[r]])) return !1;
    }

    return !0;
  }

  function Oe(e) {
    var t = e;
    if (e.alternate) for (; t["return"];) {
      t = t["return"];
    } else {
      if (0 !== (2 & t.effectTag)) return 1;

      for (; t["return"];) {
        if (t = t["return"], 0 !== (2 & t.effectTag)) return 1;
      }
    }
    return 3 === t.tag ? 2 : 3;
  }

  function Ne(e) {
    2 !== Oe(e) && o("188");
  }

  function De(e) {
    var t = e.alternate;
    if (!t) return t = Oe(e), 3 === t && o("188"), 1 === t ? null : e;

    for (var n = e, r = t;;) {
      var i = n["return"],
          a = i ? i.alternate : null;
      if (!i || !a) break;

      if (i.child === a.child) {
        for (var l = i.child; l;) {
          if (l === n) return Ne(i), e;
          if (l === r) return Ne(i), t;
          l = l.sibling;
        }

        o("188");
      }

      if (n["return"] !== r["return"]) n = i, r = a;else {
        l = !1;

        for (var u = i.child; u;) {
          if (u === n) {
            l = !0, n = i, r = a;
            break;
          }

          if (u === r) {
            l = !0, r = i, n = a;
            break;
          }

          u = u.sibling;
        }

        if (!l) {
          for (u = a.child; u;) {
            if (u === n) {
              l = !0, n = a, r = i;
              break;
            }

            if (u === r) {
              l = !0, r = a, n = i;
              break;
            }

            u = u.sibling;
          }

          l || o("189");
        }
      }
      n.alternate !== r && o("190");
    }

    return 3 !== n.tag && o("188"), n.stateNode.current === n ? e : t;
  }

  function je(e) {
    if (!(e = De(e))) return null;

    for (var t = e;;) {
      if (5 === t.tag || 6 === t.tag) return t;
      if (t.child) t.child["return"] = t, t = t.child;else {
        if (t === e) break;

        for (; !t.sibling;) {
          if (!t["return"] || t["return"] === e) return null;
          t = t["return"];
        }

        t.sibling["return"] = t["return"], t = t.sibling;
      }
    }

    return null;
  }

  function Me(e) {
    var t = e.keyCode;
    return "charCode" in e ? 0 === (e = e.charCode) && 13 === t && (e = 13) : e = t, 10 === e && (e = 13), 32 <= e || 13 === e ? e : 0;
  }

  function Re(e, t) {
    var n = e[0];
    e = e[1];
    var r = "on" + (e[0].toUpperCase() + e.slice(1));
    t = {
      phasedRegistrationNames: {
        bubbled: r,
        captured: r + "Capture"
      },
      dependencies: [n],
      isInteractive: t
    }, Zi[e] = t, ea[n] = t;
  }

  function Ie(e) {
    var t = e.targetInst,
        n = t;

    do {
      if (!n) {
        e.ancestors.push(n);
        break;
      }

      var r;

      for (r = n; r["return"];) {
        r = r["return"];
      }

      if (!(r = 3 !== r.tag ? null : r.stateNode.containerInfo)) break;
      e.ancestors.push(n), n = y(r);
    } while (n);

    for (n = 0; n < e.ancestors.length; n++) {
      t = e.ancestors[n];
      var o = Q(e.nativeEvent);
      r = e.topLevelType;

      for (var i = e.nativeEvent, a = null, l = 0; l < vo.length; l++) {
        var u = vo[l];
        u && (u = u.extractEvents(r, t, i, o)) && (a = f(a, u));
      }

      m(a);
    }
  }

  function Ue(e, t) {
    if (!t) return null;
    var n = (na(e) ? Fe : ze).bind(null, e);
    t.addEventListener(e, n, !1);
  }

  function Ae(e, t) {
    if (!t) return null;
    var n = (na(e) ? Fe : ze).bind(null, e);
    t.addEventListener(e, n, !0);
  }

  function Fe(e, t) {
    V(ze, e, t);
  }

  function ze(e, t) {
    if (oa) {
      var n = Q(t);

      if (n = y(n), null === n || "number" !== typeof n.tag || 2 === Oe(n) || (n = null), ra.length) {
        var r = ra.pop();
        r.topLevelType = e, r.nativeEvent = t, r.targetInst = n, e = r;
      } else e = {
        topLevelType: e,
        nativeEvent: t,
        targetInst: n,
        ancestors: []
      };

      try {
        $(Ie, e);
      } finally {
        e.topLevelType = null, e.nativeEvent = null, e.targetInst = null, e.ancestors.length = 0, 10 > ra.length && ra.push(e);
      }
    }
  }

  function Le(e) {
    return Object.prototype.hasOwnProperty.call(e, la) || (e[la] = aa++, ia[e[la]] = {}), ia[e[la]];
  }

  function Be(e) {
    if ("undefined" === typeof (e = e || ("undefined" !== typeof document ? document : void 0))) return null;

    try {
      return e.activeElement || e.body;
    } catch (t) {
      return e.body;
    }
  }

  function We(e) {
    for (; e && e.firstChild;) {
      e = e.firstChild;
    }

    return e;
  }

  function Ve(e, t) {
    var n = We(e);
    e = 0;

    for (var r; n;) {
      if (3 === n.nodeType) {
        if (r = e + n.textContent.length, e <= t && r >= t) return {
          node: n,
          offset: t - e
        };
        e = r;
      }

      e: {
        for (; n;) {
          if (n.nextSibling) {
            n = n.nextSibling;
            break e;
          }

          n = n.parentNode;
        }

        n = void 0;
      }

      n = We(n);
    }
  }

  function He(e, t) {
    return !(!e || !t) && (e === t || (!e || 3 !== e.nodeType) && (t && 3 === t.nodeType ? He(e, t.parentNode) : "contains" in e ? e.contains(t) : !!e.compareDocumentPosition && !!(16 & e.compareDocumentPosition(t))));
  }

  function $e() {
    for (var e = window, t = Be(); t instanceof e.HTMLIFrameElement;) {
      try {
        var n = "string" === typeof t.contentWindow.location.href;
      } catch (e) {
        n = !1;
      }

      if (!n) break;
      e = t.contentWindow, t = Be(e.document);
    }

    return t;
  }

  function qe(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && ("input" === t && ("text" === e.type || "search" === e.type || "tel" === e.type || "url" === e.type || "password" === e.type) || "textarea" === t || "true" === e.contentEditable);
  }

  function Qe() {
    var e = $e();

    if (qe(e)) {
      if ("selectionStart" in e) var t = {
        start: e.selectionStart,
        end: e.selectionEnd
      };else e: {
        t = (t = e.ownerDocument) && t.defaultView || window;
        var n = t.getSelection && t.getSelection();

        if (n && 0 !== n.rangeCount) {
          t = n.anchorNode;
          var r = n.anchorOffset,
              o = n.focusNode;
          n = n.focusOffset;

          try {
            t.nodeType, o.nodeType;
          } catch (e) {
            t = null;
            break e;
          }

          var i = 0,
              a = -1,
              l = -1,
              u = 0,
              c = 0,
              s = e,
              f = null;

          t: for (;;) {
            for (var d; s !== t || 0 !== r && 3 !== s.nodeType || (a = i + r), s !== o || 0 !== n && 3 !== s.nodeType || (l = i + n), 3 === s.nodeType && (i += s.nodeValue.length), null !== (d = s.firstChild);) {
              f = s, s = d;
            }

            for (;;) {
              if (s === e) break t;
              if (f === t && ++u === r && (a = i), f === o && ++c === n && (l = i), null !== (d = s.nextSibling)) break;
              s = f, f = s.parentNode;
            }

            s = d;
          }

          t = -1 === a || -1 === l ? null : {
            start: a,
            end: l
          };
        } else t = null;
      }
      t = t || {
        start: 0,
        end: 0
      };
    } else t = null;

    return {
      focusedElem: e,
      selectionRange: t
    };
  }

  function Ye(e) {
    var t = $e(),
        n = e.focusedElem,
        r = e.selectionRange;

    if (t !== n && n && n.ownerDocument && He(n.ownerDocument.documentElement, n)) {
      if (null !== r && qe(n)) if (t = r.start, e = r.end, void 0 === e && (e = t), "selectionStart" in n) n.selectionStart = t, n.selectionEnd = Math.min(e, n.value.length);else if (e = (t = n.ownerDocument || document) && t.defaultView || window, e.getSelection) {
        e = e.getSelection();
        var o = n.textContent.length,
            i = Math.min(r.start, o);
        r = void 0 === r.end ? i : Math.min(r.end, o), !e.extend && i > r && (o = r, r = i, i = o), o = Ve(n, i);
        var a = Ve(n, r);
        o && a && (1 !== e.rangeCount || e.anchorNode !== o.node || e.anchorOffset !== o.offset || e.focusNode !== a.node || e.focusOffset !== a.offset) && (t = t.createRange(), t.setStart(o.node, o.offset), e.removeAllRanges(), i > r ? (e.addRange(t), e.extend(a.node, a.offset)) : (t.setEnd(a.node, a.offset), e.addRange(t)));
      }

      for (t = [], e = n; e = e.parentNode;) {
        1 === e.nodeType && t.push({
          element: e,
          left: e.scrollLeft,
          top: e.scrollTop
        });
      }

      for ("function" === typeof n.focus && n.focus(), n = 0; n < t.length; n++) {
        e = t[n], e.element.scrollLeft = e.left, e.element.scrollTop = e.top;
      }
    }
  }

  function Ke(e, t) {
    var n = t.window === t ? t.document : 9 === t.nodeType ? t : t.ownerDocument;
    return pa || null == sa || sa !== Be(n) ? null : (n = sa, "selectionStart" in n && qe(n) ? n = {
      start: n.selectionStart,
      end: n.selectionEnd
    } : (n = (n.ownerDocument && n.ownerDocument.defaultView || window).getSelection(), n = {
      anchorNode: n.anchorNode,
      anchorOffset: n.anchorOffset,
      focusNode: n.focusNode,
      focusOffset: n.focusOffset
    }), da && Pe(da, n) ? null : (da = n, e = D.getPooled(ca.select, fa, e, t), e.type = "select", e.target = sa, E(e), e));
  }

  function Xe(e) {
    var t = "";
    return ao.Children.forEach(e, function (e) {
      null != e && (t += e);
    }), t;
  }

  function Ge(e, t) {
    return e = lo({
      children: void 0
    }, t), (t = Xe(t.children)) && (e.children = t), e;
  }

  function Je(e, t, n, r) {
    if (e = e.options, t) {
      t = {};

      for (var o = 0; o < n.length; o++) {
        t["$" + n[o]] = !0;
      }

      for (n = 0; n < e.length; n++) {
        o = t.hasOwnProperty("$" + e[n].value), e[n].selected !== o && (e[n].selected = o), o && r && (e[n].defaultSelected = !0);
      }
    } else {
      for (n = "" + ue(n), t = null, o = 0; o < e.length; o++) {
        if (e[o].value === n) return e[o].selected = !0, void (r && (e[o].defaultSelected = !0));
        null !== t || e[o].disabled || (t = e[o]);
      }

      null !== t && (t.selected = !0);
    }
  }

  function Ze(e, t) {
    return null != t.dangerouslySetInnerHTML && o("91"), lo({}, t, {
      value: void 0,
      defaultValue: void 0,
      children: "" + e._wrapperState.initialValue
    });
  }

  function et(e, t) {
    var n = t.value;
    null == n && (n = t.defaultValue, t = t.children, null != t && (null != n && o("92"), Array.isArray(t) && (1 >= t.length || o("93"), t = t[0]), n = t), null == n && (n = "")), e._wrapperState = {
      initialValue: ue(n)
    };
  }

  function tt(e, t) {
    var n = ue(t.value),
        r = ue(t.defaultValue);
    null != n && (n = "" + n, n !== e.value && (e.value = n), null == t.defaultValue && e.defaultValue !== n && (e.defaultValue = n)), null != r && (e.defaultValue = "" + r);
  }

  function nt(e) {
    var t = e.textContent;
    t === e._wrapperState.initialValue && (e.value = t);
  }

  function rt(e) {
    switch (e) {
      case "svg":
        return "http://www.w3.org/2000/svg";

      case "math":
        return "http://www.w3.org/1998/Math/MathML";

      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }

  function ot(e, t) {
    return null == e || "http://www.w3.org/1999/xhtml" === e ? rt(t) : "http://www.w3.org/2000/svg" === e && "foreignObject" === t ? "http://www.w3.org/1999/xhtml" : e;
  }

  function it(e, t) {
    if (t) {
      var n = e.firstChild;
      if (n && n === e.lastChild && 3 === n.nodeType) return void (n.nodeValue = t);
    }

    e.textContent = t;
  }

  function at(e, t, n) {
    return null == t || "boolean" === typeof t || "" === t ? "" : n || "number" !== typeof t || 0 === t || ba.hasOwnProperty(e) && ba[e] ? ("" + t).trim() : t + "px";
  }

  function lt(e, t) {
    e = e.style;

    for (var n in t) {
      if (t.hasOwnProperty(n)) {
        var r = 0 === n.indexOf("--"),
            o = at(n, t[n], r);
        "float" === n && (n = "cssFloat"), r ? e.setProperty(n, o) : e[n] = o;
      }
    }
  }

  function ut(e, t) {
    t && (wa[e] && (null != t.children || null != t.dangerouslySetInnerHTML) && o("137", e, ""), null != t.dangerouslySetInnerHTML && (null != t.children && o("60"), "object" === _typeof(t.dangerouslySetInnerHTML) && "__html" in t.dangerouslySetInnerHTML || o("61")), null != t.style && "object" !== _typeof(t.style) && o("62", ""));
  }

  function ct(e, t) {
    if (-1 === e.indexOf("-")) return "string" === typeof t.is;

    switch (e) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;

      default:
        return !0;
    }
  }

  function st(e, t) {
    e = 9 === e.nodeType || 11 === e.nodeType ? e : e.ownerDocument;
    var n = Le(e);
    t = wo[t];

    for (var r = 0; r < t.length; r++) {
      var o = t[r];

      if (!n.hasOwnProperty(o) || !n[o]) {
        switch (o) {
          case "scroll":
            Ae("scroll", e);
            break;

          case "focus":
          case "blur":
            Ae("focus", e), Ae("blur", e), n.blur = !0, n.focus = !0;
            break;

          case "cancel":
          case "close":
            Y(o) && Ae(o, e);
            break;

          case "invalid":
          case "submit":
          case "reset":
            break;

          default:
            -1 === Ao.indexOf(o) && Ue(o, e);
        }

        n[o] = !0;
      }
    }
  }

  function ft() {}

  function dt(e, t) {
    switch (e) {
      case "button":
      case "input":
      case "select":
      case "textarea":
        return !!t.autoFocus;
    }

    return !1;
  }

  function pt(e, t) {
    return "textarea" === e || "option" === e || "noscript" === e || "string" === typeof t.children || "number" === typeof t.children || "object" === _typeof(t.dangerouslySetInnerHTML) && null !== t.dangerouslySetInnerHTML && null != t.dangerouslySetInnerHTML.__html;
  }

  function ht(e, t, n, r, o) {
    e[Po] = o, "input" === n && "radio" === o.type && null != o.name && fe(e, o), ct(n, r), r = ct(n, o);

    for (var i = 0; i < t.length; i += 2) {
      var a = t[i],
          l = t[i + 1];
      "style" === a ? lt(e, l) : "dangerouslySetInnerHTML" === a ? va(e, l) : "children" === a ? it(e, l) : le(e, a, l, r);
    }

    switch (n) {
      case "input":
        de(e, o);
        break;

      case "textarea":
        tt(e, o);
        break;

      case "select":
        t = e._wrapperState.wasMultiple, e._wrapperState.wasMultiple = !!o.multiple, n = o.value, null != n ? Je(e, !!o.multiple, n, !1) : t !== !!o.multiple && (null != o.defaultValue ? Je(e, !!o.multiple, o.defaultValue, !0) : Je(e, !!o.multiple, o.multiple ? [] : "", !1));
    }
  }

  function mt(e) {
    for (e = e.nextSibling; e && 1 !== e.nodeType && 3 !== e.nodeType;) {
      e = e.nextSibling;
    }

    return e;
  }

  function yt(e) {
    for (e = e.firstChild; e && 1 !== e.nodeType && 3 !== e.nodeType;) {
      e = e.nextSibling;
    }

    return e;
  }

  function vt(e) {
    0 > Pa || (e.current = Sa[Pa], Sa[Pa] = null, Pa--);
  }

  function bt(e, t) {
    Pa++, Sa[Pa] = e.current, e.current = t;
  }

  function gt(e, t) {
    var n = e.type.contextTypes;
    if (!n) return Oa;
    var r = e.stateNode;
    if (r && r.__reactInternalMemoizedUnmaskedChildContext === t) return r.__reactInternalMemoizedMaskedChildContext;
    var o,
        i = {};

    for (o in n) {
      i[o] = t[o];
    }

    return r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = t, e.__reactInternalMemoizedMaskedChildContext = i), i;
  }

  function wt(e) {
    return null !== (e = e.childContextTypes) && void 0 !== e;
  }

  function kt(e) {
    vt(Da, e), vt(Na, e);
  }

  function xt(e) {
    vt(Da, e), vt(Na, e);
  }

  function _t(e, t, n) {
    Na.current !== Oa && o("168"), bt(Na, t, e), bt(Da, n, e);
  }

  function Tt(e, t, n) {
    var r = e.stateNode;
    if (e = t.childContextTypes, "function" !== typeof r.getChildContext) return n;
    r = r.getChildContext();

    for (var i in r) {
      i in e || o("108", ee(t) || "Unknown", i);
    }

    return lo({}, n, r);
  }

  function Et(e) {
    var t = e.stateNode;
    return t = t && t.__reactInternalMemoizedMergedChildContext || Oa, ja = Na.current, bt(Na, t, e), bt(Da, Da.current, e), !0;
  }

  function Ct(e, t, n) {
    var r = e.stateNode;
    r || o("169"), n ? (t = Tt(e, t, ja), r.__reactInternalMemoizedMergedChildContext = t, vt(Da, e), vt(Na, e), bt(Na, t, e)) : vt(Da, e), bt(Da, n, e);
  }

  function St(e) {
    return function (t) {
      try {
        return e(t);
      } catch (e) {}
    };
  }

  function Pt(e) {
    if ("undefined" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) return !1;
    var t = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (t.isDisabled || !t.supportsFiber) return !0;

    try {
      var n = t.inject(e);
      Ma = St(function (e) {
        return t.onCommitFiberRoot(n, e);
      }), Ra = St(function (e) {
        return t.onCommitFiberUnmount(n, e);
      });
    } catch (e) {}

    return !0;
  }

  function Ot(e, t, n, r) {
    this.tag = e, this.key = n, this.sibling = this.child = this["return"] = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t, this.contextDependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.effectTag = 0, this.lastEffect = this.firstEffect = this.nextEffect = null, this.childExpirationTime = this.expirationTime = 0, this.alternate = null;
  }

  function Nt(e, t, n, r) {
    return new Ot(e, t, n, r);
  }

  function Dt(e) {
    return !(!(e = e.prototype) || !e.isReactComponent);
  }

  function jt(e) {
    if ("function" === typeof e) return Dt(e) ? 1 : 0;

    if (void 0 !== e && null !== e) {
      if ((e = e.$$typeof) === mi) return 11;
      if (e === vi) return 14;
    }

    return 2;
  }

  function Mt(e, t) {
    var n = e.alternate;
    return null === n ? (n = Nt(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.effectTag = 0, n.nextEffect = null, n.firstEffect = null, n.lastEffect = null), n.childExpirationTime = e.childExpirationTime, n.expirationTime = e.expirationTime, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, n.contextDependencies = e.contextDependencies, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n;
  }

  function Rt(e, t, n, r, i, a) {
    var l = 2;
    if (r = e, "function" === typeof e) Dt(e) && (l = 1);else if ("string" === typeof e) l = 5;else e: switch (e) {
      case ci:
        return It(n.children, i, a, t);

      case hi:
        return Ut(n, 3 | i, a, t);

      case si:
        return Ut(n, 2 | i, a, t);

      case fi:
        return e = Nt(12, n, t, 4 | i), e.elementType = fi, e.type = fi, e.expirationTime = a, e;

      case yi:
        return e = Nt(13, n, t, i), e.elementType = yi, e.type = yi, e.expirationTime = a, e;

      default:
        if ("object" === _typeof(e) && null !== e) switch (e.$$typeof) {
          case di:
            l = 10;
            break e;

          case pi:
            l = 9;
            break e;

          case mi:
            l = 11;
            break e;

          case vi:
            l = 14;
            break e;

          case bi:
            l = 16, r = null;
            break e;
        }
        o("130", null == e ? e : _typeof(e), "");
    }
    return t = Nt(l, n, t, i), t.elementType = e, t.type = r, t.expirationTime = a, t;
  }

  function It(e, t, n, r) {
    return e = Nt(7, e, r, t), e.expirationTime = n, e;
  }

  function Ut(e, t, n, r) {
    return e = Nt(8, e, r, t), t = 0 === (1 & t) ? si : hi, e.elementType = t, e.type = t, e.expirationTime = n, e;
  }

  function At(e, t, n) {
    return e = Nt(6, e, null, t), e.expirationTime = n, e;
  }

  function Ft(e, t, n) {
    return t = Nt(4, null !== e.children ? e.children : [], e.key, t), t.expirationTime = n, t.stateNode = {
      containerInfo: e.containerInfo,
      pendingChildren: null,
      implementation: e.implementation
    }, t;
  }

  function zt(e, t) {
    e.didError = !1;
    var n = e.earliestPendingTime;
    0 === n ? e.earliestPendingTime = e.latestPendingTime = t : n < t ? e.earliestPendingTime = t : e.latestPendingTime > t && (e.latestPendingTime = t), Vt(t, e);
  }

  function Lt(e, t) {
    if (e.didError = !1, 0 === t) e.earliestPendingTime = 0, e.latestPendingTime = 0, e.earliestSuspendedTime = 0, e.latestSuspendedTime = 0, e.latestPingedTime = 0;else {
      t < e.latestPingedTime && (e.latestPingedTime = 0);
      var n = e.latestPendingTime;
      0 !== n && (n > t ? e.earliestPendingTime = e.latestPendingTime = 0 : e.earliestPendingTime > t && (e.earliestPendingTime = e.latestPendingTime)), n = e.earliestSuspendedTime, 0 === n ? zt(e, t) : t < e.latestSuspendedTime ? (e.earliestSuspendedTime = 0, e.latestSuspendedTime = 0, e.latestPingedTime = 0, zt(e, t)) : t > n && zt(e, t);
    }
    Vt(0, e);
  }

  function Bt(e, t) {
    e.didError = !1, e.latestPingedTime >= t && (e.latestPingedTime = 0);
    var n = e.earliestPendingTime,
        r = e.latestPendingTime;
    n === t ? e.earliestPendingTime = r === t ? e.latestPendingTime = 0 : r : r === t && (e.latestPendingTime = n), n = e.earliestSuspendedTime, r = e.latestSuspendedTime, 0 === n ? e.earliestSuspendedTime = e.latestSuspendedTime = t : n < t ? e.earliestSuspendedTime = t : r > t && (e.latestSuspendedTime = t), Vt(t, e);
  }

  function Wt(e, t) {
    var n = e.earliestPendingTime;
    return e = e.earliestSuspendedTime, n > t && (t = n), e > t && (t = e), t;
  }

  function Vt(e, t) {
    var n = t.earliestSuspendedTime,
        r = t.latestSuspendedTime,
        o = t.earliestPendingTime,
        i = t.latestPingedTime;
    o = 0 !== o ? o : i, 0 === o && (0 === e || r < e) && (o = r), e = o, 0 !== e && n > e && (e = n), t.nextExpirationTimeToWorkOn = o, t.expirationTime = e;
  }

  function Ht(e, t) {
    if (e && e.defaultProps) {
      t = lo({}, t), e = e.defaultProps;

      for (var n in e) {
        void 0 === t[n] && (t[n] = e[n]);
      }
    }

    return t;
  }

  function $t(e) {
    var t = e._result;

    switch (e._status) {
      case 1:
        return t;

      case 2:
      case 0:
        throw t;

      default:
        switch (e._status = 0, t = e._ctor, t = t(), t.then(function (t) {
          0 === e._status && (t = t["default"], e._status = 1, e._result = t);
        }, function (t) {
          0 === e._status && (e._status = 2, e._result = t);
        }), e._status) {
          case 1:
            return e._result;

          case 2:
            throw e._result;
        }

        throw e._result = t, t;
    }
  }

  function qt(e, t, n, r) {
    t = e.memoizedState, n = n(r, t), n = null === n || void 0 === n ? t : lo({}, t, n), e.memoizedState = n, null !== (r = e.updateQueue) && 0 === e.expirationTime && (r.baseState = n);
  }

  function Qt(e, t, n, r, o, i, a) {
    return e = e.stateNode, "function" === typeof e.shouldComponentUpdate ? e.shouldComponentUpdate(r, i, a) : !t.prototype || !t.prototype.isPureReactComponent || !Pe(n, r) || !Pe(o, i);
  }

  function Yt(e, t, n) {
    var r = !1,
        o = Oa,
        i = t.contextType;
    return "object" === _typeof(i) && null !== i ? i = Bn(i) : (o = wt(t) ? ja : Na.current, r = t.contextTypes, i = (r = null !== r && void 0 !== r) ? gt(e, o) : Oa), t = new t(n, i), e.memoizedState = null !== t.state && void 0 !== t.state ? t.state : null, t.updater = Ua, e.stateNode = t, t._reactInternalFiber = e, r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = o, e.__reactInternalMemoizedMaskedChildContext = i), t;
  }

  function Kt(e, t, n, r) {
    e = t.state, "function" === typeof t.componentWillReceiveProps && t.componentWillReceiveProps(n, r), "function" === typeof t.UNSAFE_componentWillReceiveProps && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && Ua.enqueueReplaceState(t, t.state, null);
  }

  function Xt(e, t, n, r) {
    var o = e.stateNode;
    o.props = n, o.state = e.memoizedState, o.refs = Ia;
    var i = t.contextType;
    "object" === _typeof(i) && null !== i ? o.context = Bn(i) : (i = wt(t) ? ja : Na.current, o.context = gt(e, i)), i = e.updateQueue, null !== i && (Xn(e, i, n, o, r), o.state = e.memoizedState), i = t.getDerivedStateFromProps, "function" === typeof i && (qt(e, t, i, n), o.state = e.memoizedState), "function" === typeof t.getDerivedStateFromProps || "function" === typeof o.getSnapshotBeforeUpdate || "function" !== typeof o.UNSAFE_componentWillMount && "function" !== typeof o.componentWillMount || (t = o.state, "function" === typeof o.componentWillMount && o.componentWillMount(), "function" === typeof o.UNSAFE_componentWillMount && o.UNSAFE_componentWillMount(), t !== o.state && Ua.enqueueReplaceState(o, o.state, null), null !== (i = e.updateQueue) && (Xn(e, i, n, o, r), o.state = e.memoizedState)), "function" === typeof o.componentDidMount && (e.effectTag |= 4);
  }

  function Gt(e, t, n) {
    if (null !== (e = n.ref) && "function" !== typeof e && "object" !== _typeof(e)) {
      if (n._owner) {
        n = n._owner;
        var r = void 0;
        n && (1 !== n.tag && o("309"), r = n.stateNode), r || o("147", e);
        var i = "" + e;
        return null !== t && null !== t.ref && "function" === typeof t.ref && t.ref._stringRef === i ? t.ref : (t = function t(e) {
          var t = r.refs;
          t === Ia && (t = r.refs = {}), null === e ? delete t[i] : t[i] = e;
        }, t._stringRef = i, t);
      }

      "string" !== typeof e && o("284"), n._owner || o("290", e);
    }

    return e;
  }

  function Jt(e, t) {
    "textarea" !== e.type && o("31", "[object Object]" === Object.prototype.toString.call(t) ? "object with keys {" + Object.keys(t).join(", ") + "}" : t, "");
  }

  function Zt(e) {
    function t(t, n) {
      if (e) {
        var r = t.lastEffect;
        null !== r ? (r.nextEffect = n, t.lastEffect = n) : t.firstEffect = t.lastEffect = n, n.nextEffect = null, n.effectTag = 8;
      }
    }

    function n(n, r) {
      if (!e) return null;

      for (; null !== r;) {
        t(n, r), r = r.sibling;
      }

      return null;
    }

    function r(e, t) {
      for (e = new Map(); null !== t;) {
        null !== t.key ? e.set(t.key, t) : e.set(t.index, t), t = t.sibling;
      }

      return e;
    }

    function i(e, t, n) {
      return e = Mt(e, t, n), e.index = 0, e.sibling = null, e;
    }

    function a(t, n, r) {
      return t.index = r, e ? null !== (r = t.alternate) ? (r = r.index, r < n ? (t.effectTag = 2, n) : r) : (t.effectTag = 2, n) : n;
    }

    function l(t) {
      return e && null === t.alternate && (t.effectTag = 2), t;
    }

    function u(e, t, n, r) {
      return null === t || 6 !== t.tag ? (t = At(n, e.mode, r), t["return"] = e, t) : (t = i(t, n, r), t["return"] = e, t);
    }

    function c(e, t, n, r) {
      return null !== t && t.elementType === n.type ? (r = i(t, n.props, r), r.ref = Gt(e, t, n), r["return"] = e, r) : (r = Rt(n.type, n.key, n.props, null, e.mode, r), r.ref = Gt(e, t, n), r["return"] = e, r);
    }

    function s(e, t, n, r) {
      return null === t || 4 !== t.tag || t.stateNode.containerInfo !== n.containerInfo || t.stateNode.implementation !== n.implementation ? (t = Ft(n, e.mode, r), t["return"] = e, t) : (t = i(t, n.children || [], r), t["return"] = e, t);
    }

    function f(e, t, n, r, o) {
      return null === t || 7 !== t.tag ? (t = It(n, e.mode, r, o), t["return"] = e, t) : (t = i(t, n, r), t["return"] = e, t);
    }

    function d(e, t, n) {
      if ("string" === typeof t || "number" === typeof t) return t = At("" + t, e.mode, n), t["return"] = e, t;

      if ("object" === _typeof(t) && null !== t) {
        switch (t.$$typeof) {
          case li:
            return n = Rt(t.type, t.key, t.props, null, e.mode, n), n.ref = Gt(e, null, t), n["return"] = e, n;

          case ui:
            return t = Ft(t, e.mode, n), t["return"] = e, t;
        }

        if (Aa(t) || Z(t)) return t = It(t, e.mode, n, null), t["return"] = e, t;
        Jt(e, t);
      }

      return null;
    }

    function p(e, t, n, r) {
      var o = null !== t ? t.key : null;
      if ("string" === typeof n || "number" === typeof n) return null !== o ? null : u(e, t, "" + n, r);

      if ("object" === _typeof(n) && null !== n) {
        switch (n.$$typeof) {
          case li:
            return n.key === o ? n.type === ci ? f(e, t, n.props.children, r, o) : c(e, t, n, r) : null;

          case ui:
            return n.key === o ? s(e, t, n, r) : null;
        }

        if (Aa(n) || Z(n)) return null !== o ? null : f(e, t, n, r, null);
        Jt(e, n);
      }

      return null;
    }

    function h(e, t, n, r, o) {
      if ("string" === typeof r || "number" === typeof r) return e = e.get(n) || null, u(t, e, "" + r, o);

      if ("object" === _typeof(r) && null !== r) {
        switch (r.$$typeof) {
          case li:
            return e = e.get(null === r.key ? n : r.key) || null, r.type === ci ? f(t, e, r.props.children, o, r.key) : c(t, e, r, o);

          case ui:
            return e = e.get(null === r.key ? n : r.key) || null, s(t, e, r, o);
        }

        if (Aa(r) || Z(r)) return e = e.get(n) || null, f(t, e, r, o, null);
        Jt(t, r);
      }

      return null;
    }

    function m(o, i, l, u) {
      for (var c = null, s = null, f = i, m = i = 0, y = null; null !== f && m < l.length; m++) {
        f.index > m ? (y = f, f = null) : y = f.sibling;
        var v = p(o, f, l[m], u);

        if (null === v) {
          null === f && (f = y);
          break;
        }

        e && f && null === v.alternate && t(o, f), i = a(v, i, m), null === s ? c = v : s.sibling = v, s = v, f = y;
      }

      if (m === l.length) return n(o, f), c;

      if (null === f) {
        for (; m < l.length; m++) {
          (f = d(o, l[m], u)) && (i = a(f, i, m), null === s ? c = f : s.sibling = f, s = f);
        }

        return c;
      }

      for (f = r(o, f); m < l.length; m++) {
        (y = h(f, o, m, l[m], u)) && (e && null !== y.alternate && f["delete"](null === y.key ? m : y.key), i = a(y, i, m), null === s ? c = y : s.sibling = y, s = y);
      }

      return e && f.forEach(function (e) {
        return t(o, e);
      }), c;
    }

    function y(i, l, u, c) {
      var s = Z(u);
      "function" !== typeof s && o("150"), null == (u = s.call(u)) && o("151");

      for (var f = s = null, m = l, y = l = 0, v = null, b = u.next(); null !== m && !b.done; y++, b = u.next()) {
        m.index > y ? (v = m, m = null) : v = m.sibling;
        var g = p(i, m, b.value, c);

        if (null === g) {
          m || (m = v);
          break;
        }

        e && m && null === g.alternate && t(i, m), l = a(g, l, y), null === f ? s = g : f.sibling = g, f = g, m = v;
      }

      if (b.done) return n(i, m), s;

      if (null === m) {
        for (; !b.done; y++, b = u.next()) {
          null !== (b = d(i, b.value, c)) && (l = a(b, l, y), null === f ? s = b : f.sibling = b, f = b);
        }

        return s;
      }

      for (m = r(i, m); !b.done; y++, b = u.next()) {
        null !== (b = h(m, i, y, b.value, c)) && (e && null !== b.alternate && m["delete"](null === b.key ? y : b.key), l = a(b, l, y), null === f ? s = b : f.sibling = b, f = b);
      }

      return e && m.forEach(function (e) {
        return t(i, e);
      }), s;
    }

    return function (e, r, a, u) {
      var c = "object" === _typeof(a) && null !== a && a.type === ci && null === a.key;
      c && (a = a.props.children);
      var s = "object" === _typeof(a) && null !== a;
      if (s) switch (a.$$typeof) {
        case li:
          e: {
            for (s = a.key, c = r; null !== c;) {
              if (c.key === s) {
                if (7 === c.tag ? a.type === ci : c.elementType === a.type) {
                  n(e, c.sibling), r = i(c, a.type === ci ? a.props.children : a.props, u), r.ref = Gt(e, c, a), r["return"] = e, e = r;
                  break e;
                }

                n(e, c);
                break;
              }

              t(e, c), c = c.sibling;
            }

            a.type === ci ? (r = It(a.props.children, e.mode, u, a.key), r["return"] = e, e = r) : (u = Rt(a.type, a.key, a.props, null, e.mode, u), u.ref = Gt(e, r, a), u["return"] = e, e = u);
          }

          return l(e);

        case ui:
          e: {
            for (c = a.key; null !== r;) {
              if (r.key === c) {
                if (4 === r.tag && r.stateNode.containerInfo === a.containerInfo && r.stateNode.implementation === a.implementation) {
                  n(e, r.sibling), r = i(r, a.children || [], u), r["return"] = e, e = r;
                  break e;
                }

                n(e, r);
                break;
              }

              t(e, r), r = r.sibling;
            }

            r = Ft(a, e.mode, u), r["return"] = e, e = r;
          }

          return l(e);
      }
      if ("string" === typeof a || "number" === typeof a) return a = "" + a, null !== r && 6 === r.tag ? (n(e, r.sibling), r = i(r, a, u), r["return"] = e, e = r) : (n(e, r), r = At(a, e.mode, u), r["return"] = e, e = r), l(e);
      if (Aa(a)) return m(e, r, a, u);
      if (Z(a)) return y(e, r, a, u);
      if (s && Jt(e, a), "undefined" === typeof a && !c) switch (e.tag) {
        case 1:
        case 0:
          u = e.type, o("152", u.displayName || u.name || "Component");
      }
      return n(e, r);
    };
  }

  function en(e) {
    return e === La && o("174"), e;
  }

  function tn(e, t) {
    bt(Va, t, e), bt(Wa, e, e), bt(Ba, La, e);
    var n = t.nodeType;

    switch (n) {
      case 9:
      case 11:
        t = (t = t.documentElement) ? t.namespaceURI : ot(null, "");
        break;

      default:
        n = 8 === n ? t.parentNode : t, t = n.namespaceURI || null, n = n.tagName, t = ot(t, n);
    }

    vt(Ba, e), bt(Ba, t, e);
  }

  function nn(e) {
    vt(Ba, e), vt(Wa, e), vt(Va, e);
  }

  function rn(e) {
    en(Va.current);
    var t = en(Ba.current),
        n = ot(t, e.type);
    t !== n && (bt(Wa, e, e), bt(Ba, n, e));
  }

  function on(e) {
    Wa.current === e && (vt(Ba, e), vt(Wa, e));
  }

  function an() {
    o("321");
  }

  function ln(e, t) {
    if (null === t) return !1;

    for (var n = 0; n < t.length && n < e.length; n++) {
      if (!Se(e[n], t[n])) return !1;
    }

    return !0;
  }

  function un(e, t, n, r, i, a) {
    if (Za = a, el = t, nl = null !== e ? e.memoizedState : null, Ja.current = null === nl ? pl : hl, t = n(r, i), cl) {
      do {
        cl = !1, fl += 1, nl = null !== e ? e.memoizedState : null, il = rl, ll = ol = tl = null, Ja.current = hl, t = n(r, i);
      } while (cl);

      sl = null, fl = 0;
    }

    return Ja.current = dl, e = el, e.memoizedState = rl, e.expirationTime = al, e.updateQueue = ll, e.effectTag |= ul, e = null !== tl && null !== tl.next, Za = 0, il = ol = rl = nl = tl = el = null, al = 0, ll = null, ul = 0, e && o("300"), t;
  }

  function cn() {
    Ja.current = dl, Za = 0, il = ol = rl = nl = tl = el = null, al = 0, ll = null, ul = 0, cl = !1, sl = null, fl = 0;
  }

  function sn() {
    var e = {
      memoizedState: null,
      baseState: null,
      queue: null,
      baseUpdate: null,
      next: null
    };
    return null === ol ? rl = ol = e : ol = ol.next = e, ol;
  }

  function fn() {
    if (null !== il) ol = il, il = ol.next, tl = nl, nl = null !== tl ? tl.next : null;else {
      null === nl && o("310"), tl = nl;
      var e = {
        memoizedState: tl.memoizedState,
        baseState: tl.baseState,
        queue: tl.queue,
        baseUpdate: tl.baseUpdate,
        next: null
      };
      ol = null === ol ? rl = e : ol.next = e, nl = tl.next;
    }
    return ol;
  }

  function dn(e, t) {
    return "function" === typeof t ? t(e) : t;
  }

  function pn(e) {
    var t = fn(),
        n = t.queue;

    if (null === n && o("311"), n.lastRenderedReducer = e, 0 < fl) {
      var r = n.dispatch;

      if (null !== sl) {
        var i = sl.get(n);

        if (void 0 !== i) {
          sl["delete"](n);
          var a = t.memoizedState;

          do {
            a = e(a, i.action), i = i.next;
          } while (null !== i);

          return Se(a, t.memoizedState) || (gl = !0), t.memoizedState = a, t.baseUpdate === n.last && (t.baseState = a), n.lastRenderedState = a, [a, r];
        }
      }

      return [t.memoizedState, r];
    }

    r = n.last;
    var l = t.baseUpdate;

    if (a = t.baseState, null !== l ? (null !== r && (r.next = null), r = l.next) : r = null !== r ? r.next : null, null !== r) {
      var u = i = null,
          c = r,
          s = !1;

      do {
        var f = c.expirationTime;
        f < Za ? (s || (s = !0, u = l, i = a), f > al && (al = f)) : a = c.eagerReducer === e ? c.eagerState : e(a, c.action), l = c, c = c.next;
      } while (null !== c && c !== r);

      s || (u = l, i = a), Se(a, t.memoizedState) || (gl = !0), t.memoizedState = a, t.baseUpdate = u, t.baseState = i, n.lastRenderedState = a;
    }

    return [t.memoizedState, n.dispatch];
  }

  function hn(e, t, n, r) {
    return e = {
      tag: e,
      create: t,
      destroy: n,
      deps: r,
      next: null
    }, null === ll ? (ll = {
      lastEffect: null
    }, ll.lastEffect = e.next = e) : (t = ll.lastEffect, null === t ? ll.lastEffect = e.next = e : (n = t.next, t.next = e, e.next = n, ll.lastEffect = e)), e;
  }

  function mn(e, t, n, r) {
    var o = sn();
    ul |= e, o.memoizedState = hn(t, n, void 0, void 0 === r ? null : r);
  }

  function yn(e, t, n, r) {
    var o = fn();
    r = void 0 === r ? null : r;
    var i = void 0;

    if (null !== tl) {
      var a = tl.memoizedState;
      if (i = a.destroy, null !== r && ln(r, a.deps)) return void hn(Ha, n, i, r);
    }

    ul |= e, o.memoizedState = hn(t, n, i, r);
  }

  function vn(e, t) {
    return "function" === typeof t ? (e = e(), t(e), function () {
      t(null);
    }) : null !== t && void 0 !== t ? (e = e(), t.current = e, function () {
      t.current = null;
    }) : void 0;
  }

  function bn() {}

  function gn(e, t, n) {
    25 > fl || o("301");
    var r = e.alternate;
    if (e === el || null !== r && r === el) {
      if (cl = !0, e = {
        expirationTime: Za,
        action: n,
        eagerReducer: null,
        eagerState: null,
        next: null
      }, null === sl && (sl = new Map()), void 0 === (n = sl.get(t))) sl.set(t, e);else {
        for (t = n; null !== t.next;) {
          t = t.next;
        }

        t.next = e;
      }
    } else {
      br();
      var i = Ir();
      i = Tr(i, e);
      var a = {
        expirationTime: i,
        action: n,
        eagerReducer: null,
        eagerState: null,
        next: null
      },
          l = t.last;
      if (null === l) a.next = a;else {
        var u = l.next;
        null !== u && (a.next = u), l.next = a;
      }
      if (t.last = a, 0 === e.expirationTime && (null === r || 0 === r.expirationTime) && null !== (r = t.lastRenderedReducer)) try {
        var c = t.lastRenderedState,
            s = r(c, n);
        if (a.eagerReducer = r, a.eagerState = s, Se(s, c)) return;
      } catch (e) {}
      Pr(e, i);
    }
  }

  function wn(e, t) {
    var n = Nt(5, null, null, 0);
    n.elementType = "DELETED", n.type = "DELETED", n.stateNode = t, n["return"] = e, n.effectTag = 8, null !== e.lastEffect ? (e.lastEffect.nextEffect = n, e.lastEffect = n) : e.firstEffect = e.lastEffect = n;
  }

  function kn(e, t) {
    switch (e.tag) {
      case 5:
        var n = e.type;
        return null !== (t = 1 !== t.nodeType || n.toLowerCase() !== t.nodeName.toLowerCase() ? null : t) && (e.stateNode = t, !0);

      case 6:
        return null !== (t = "" === e.pendingProps || 3 !== t.nodeType ? null : t) && (e.stateNode = t, !0);

      case 13:
      default:
        return !1;
    }
  }

  function xn(e) {
    if (vl) {
      var t = yl;

      if (t) {
        var n = t;

        if (!kn(e, t)) {
          if (!(t = mt(n)) || !kn(e, t)) return e.effectTag |= 2, vl = !1, void (ml = e);
          wn(ml, n);
        }

        ml = e, yl = yt(t);
      } else e.effectTag |= 2, vl = !1, ml = e;
    }
  }

  function _n(e) {
    for (e = e["return"]; null !== e && 5 !== e.tag && 3 !== e.tag && 18 !== e.tag;) {
      e = e["return"];
    }

    ml = e;
  }

  function Tn(e) {
    if (e !== ml) return !1;
    if (!vl) return _n(e), vl = !0, !1;
    var t = e.type;
    if (5 !== e.tag || "head" !== t && "body" !== t && !pt(t, e.memoizedProps)) for (t = yl; t;) {
      wn(e, t), t = mt(t);
    }
    return _n(e), yl = ml ? mt(e.stateNode) : null, !0;
  }

  function En() {
    yl = ml = null, vl = !1;
  }

  function Cn(e, t, n, r) {
    t.child = null === e ? za(t, null, n, r) : Fa(t, e.child, n, r);
  }

  function Sn(e, t, n, r, o) {
    n = n.render;
    var i = t.ref;
    return Ln(t, o), r = un(e, t, n, r, i, o), null === e || gl ? (t.effectTag |= 1, Cn(e, t, r, o), t.child) : (t.updateQueue = e.updateQueue, t.effectTag &= -517, e.expirationTime <= o && (e.expirationTime = 0), Un(e, t, o));
  }

  function Pn(e, t, n, r, o, i) {
    if (null === e) {
      var a = n.type;
      return "function" !== typeof a || Dt(a) || void 0 !== a.defaultProps || null !== n.compare || void 0 !== n.defaultProps ? (e = Rt(n.type, null, r, null, t.mode, i), e.ref = t.ref, e["return"] = t, t.child = e) : (t.tag = 15, t.type = a, On(e, t, a, r, o, i));
    }

    return a = e.child, o < i && (o = a.memoizedProps, n = n.compare, (n = null !== n ? n : Pe)(o, r) && e.ref === t.ref) ? Un(e, t, i) : (t.effectTag |= 1, e = Mt(a, r, i), e.ref = t.ref, e["return"] = t, t.child = e);
  }

  function On(e, t, n, r, o, i) {
    return null !== e && Pe(e.memoizedProps, r) && e.ref === t.ref && (gl = !1, o < i) ? Un(e, t, i) : Dn(e, t, n, r, i);
  }

  function Nn(e, t) {
    var n = t.ref;
    (null === e && null !== n || null !== e && e.ref !== n) && (t.effectTag |= 128);
  }

  function Dn(e, t, n, r, o) {
    var i = wt(n) ? ja : Na.current;
    return i = gt(t, i), Ln(t, o), n = un(e, t, n, r, i, o), null === e || gl ? (t.effectTag |= 1, Cn(e, t, n, o), t.child) : (t.updateQueue = e.updateQueue, t.effectTag &= -517, e.expirationTime <= o && (e.expirationTime = 0), Un(e, t, o));
  }

  function jn(e, t, n, r, o) {
    if (wt(n)) {
      var i = !0;
      Et(t);
    } else i = !1;

    if (Ln(t, o), null === t.stateNode) null !== e && (e.alternate = null, t.alternate = null, t.effectTag |= 2), Yt(t, n, r, o), Xt(t, n, r, o), r = !0;else if (null === e) {
      var a = t.stateNode,
          l = t.memoizedProps;
      a.props = l;
      var u = a.context,
          c = n.contextType;
      "object" === _typeof(c) && null !== c ? c = Bn(c) : (c = wt(n) ? ja : Na.current, c = gt(t, c));
      var s = n.getDerivedStateFromProps,
          f = "function" === typeof s || "function" === typeof a.getSnapshotBeforeUpdate;
      f || "function" !== typeof a.UNSAFE_componentWillReceiveProps && "function" !== typeof a.componentWillReceiveProps || (l !== r || u !== c) && Kt(t, a, r, c), Pl = !1;
      var d = t.memoizedState;
      u = a.state = d;
      var p = t.updateQueue;
      null !== p && (Xn(t, p, r, a, o), u = t.memoizedState), l !== r || d !== u || Da.current || Pl ? ("function" === typeof s && (qt(t, n, s, r), u = t.memoizedState), (l = Pl || Qt(t, n, l, r, d, u, c)) ? (f || "function" !== typeof a.UNSAFE_componentWillMount && "function" !== typeof a.componentWillMount || ("function" === typeof a.componentWillMount && a.componentWillMount(), "function" === typeof a.UNSAFE_componentWillMount && a.UNSAFE_componentWillMount()), "function" === typeof a.componentDidMount && (t.effectTag |= 4)) : ("function" === typeof a.componentDidMount && (t.effectTag |= 4), t.memoizedProps = r, t.memoizedState = u), a.props = r, a.state = u, a.context = c, r = l) : ("function" === typeof a.componentDidMount && (t.effectTag |= 4), r = !1);
    } else a = t.stateNode, l = t.memoizedProps, a.props = t.type === t.elementType ? l : Ht(t.type, l), u = a.context, c = n.contextType, "object" === _typeof(c) && null !== c ? c = Bn(c) : (c = wt(n) ? ja : Na.current, c = gt(t, c)), s = n.getDerivedStateFromProps, (f = "function" === typeof s || "function" === typeof a.getSnapshotBeforeUpdate) || "function" !== typeof a.UNSAFE_componentWillReceiveProps && "function" !== typeof a.componentWillReceiveProps || (l !== r || u !== c) && Kt(t, a, r, c), Pl = !1, u = t.memoizedState, d = a.state = u, p = t.updateQueue, null !== p && (Xn(t, p, r, a, o), d = t.memoizedState), l !== r || u !== d || Da.current || Pl ? ("function" === typeof s && (qt(t, n, s, r), d = t.memoizedState), (s = Pl || Qt(t, n, l, r, u, d, c)) ? (f || "function" !== typeof a.UNSAFE_componentWillUpdate && "function" !== typeof a.componentWillUpdate || ("function" === typeof a.componentWillUpdate && a.componentWillUpdate(r, d, c), "function" === typeof a.UNSAFE_componentWillUpdate && a.UNSAFE_componentWillUpdate(r, d, c)), "function" === typeof a.componentDidUpdate && (t.effectTag |= 4), "function" === typeof a.getSnapshotBeforeUpdate && (t.effectTag |= 256)) : ("function" !== typeof a.componentDidUpdate || l === e.memoizedProps && u === e.memoizedState || (t.effectTag |= 4), "function" !== typeof a.getSnapshotBeforeUpdate || l === e.memoizedProps && u === e.memoizedState || (t.effectTag |= 256), t.memoizedProps = r, t.memoizedState = d), a.props = r, a.state = d, a.context = c, r = s) : ("function" !== typeof a.componentDidUpdate || l === e.memoizedProps && u === e.memoizedState || (t.effectTag |= 4), "function" !== typeof a.getSnapshotBeforeUpdate || l === e.memoizedProps && u === e.memoizedState || (t.effectTag |= 256), r = !1);
    return Mn(e, t, n, r, i, o);
  }

  function Mn(e, t, n, r, o, i) {
    Nn(e, t);
    var a = 0 !== (64 & t.effectTag);
    if (!r && !a) return o && Ct(t, n, !1), Un(e, t, i);
    r = t.stateNode, bl.current = t;
    var l = a && "function" !== typeof n.getDerivedStateFromError ? null : r.render();
    return t.effectTag |= 1, null !== e && a ? (t.child = Fa(t, e.child, null, i), t.child = Fa(t, null, l, i)) : Cn(e, t, l, i), t.memoizedState = r.state, o && Ct(t, n, !0), t.child;
  }

  function Rn(e) {
    var t = e.stateNode;
    t.pendingContext ? _t(e, t.pendingContext, t.pendingContext !== t.context) : t.context && _t(e, t.context, !1), tn(e, t.containerInfo);
  }

  function In(e, t, n) {
    var r = t.mode,
        o = t.pendingProps,
        i = t.memoizedState;

    if (0 === (64 & t.effectTag)) {
      i = null;
      var a = !1;
    } else i = {
      timedOutAt: null !== i ? i.timedOutAt : 0
    }, a = !0, t.effectTag &= -65;

    if (null === e) {
      if (a) {
        var l = o.fallback;
        e = It(null, r, 0, null), 0 === (1 & t.mode) && (e.child = null !== t.memoizedState ? t.child.child : t.child), r = It(l, r, n, null), e.sibling = r, n = e, n["return"] = r["return"] = t;
      } else n = r = za(t, null, o.children, n);
    } else null !== e.memoizedState ? (r = e.child, l = r.sibling, a ? (n = o.fallback, o = Mt(r, r.pendingProps, 0), 0 === (1 & t.mode) && (a = null !== t.memoizedState ? t.child.child : t.child) !== r.child && (o.child = a), r = o.sibling = Mt(l, n, l.expirationTime), n = o, o.childExpirationTime = 0, n["return"] = r["return"] = t) : n = r = Fa(t, r.child, o.children, n)) : (l = e.child, a ? (a = o.fallback, o = It(null, r, 0, null), o.child = l, 0 === (1 & t.mode) && (o.child = null !== t.memoizedState ? t.child.child : t.child), r = o.sibling = It(a, r, n, null), r.effectTag |= 2, n = o, o.childExpirationTime = 0, n["return"] = r["return"] = t) : r = n = Fa(t, l, o.children, n)), t.stateNode = e.stateNode;
    return t.memoizedState = i, t.child = n, r;
  }

  function Un(e, t, n) {
    if (null !== e && (t.contextDependencies = e.contextDependencies), t.childExpirationTime < n) return null;

    if (null !== e && t.child !== e.child && o("153"), null !== t.child) {
      for (e = t.child, n = Mt(e, e.pendingProps, e.expirationTime), t.child = n, n["return"] = t; null !== e.sibling;) {
        e = e.sibling, n = n.sibling = Mt(e, e.pendingProps, e.expirationTime), n["return"] = t;
      }

      n.sibling = null;
    }

    return t.child;
  }

  function An(e, t, n) {
    var r = t.expirationTime;

    if (null !== e) {
      if (e.memoizedProps !== t.pendingProps || Da.current) gl = !0;else if (r < n) {
        switch (gl = !1, t.tag) {
          case 3:
            Rn(t), En();
            break;

          case 5:
            rn(t);
            break;

          case 1:
            wt(t.type) && Et(t);
            break;

          case 4:
            tn(t, t.stateNode.containerInfo);
            break;

          case 10:
            Fn(t, t.memoizedProps.value);
            break;

          case 13:
            if (null !== t.memoizedState) return 0 !== (r = t.child.childExpirationTime) && r >= n ? In(e, t, n) : (t = Un(e, t, n), null !== t ? t.sibling : null);
        }

        return Un(e, t, n);
      }
    } else gl = !1;

    switch (t.expirationTime = 0, t.tag) {
      case 2:
        r = t.elementType, null !== e && (e.alternate = null, t.alternate = null, t.effectTag |= 2), e = t.pendingProps;
        var i = gt(t, Na.current);

        if (Ln(t, n), i = un(null, t, r, e, i, n), t.effectTag |= 1, "object" === _typeof(i) && null !== i && "function" === typeof i.render && void 0 === i.$$typeof) {
          if (t.tag = 1, cn(), wt(r)) {
            var a = !0;
            Et(t);
          } else a = !1;

          t.memoizedState = null !== i.state && void 0 !== i.state ? i.state : null;
          var l = r.getDerivedStateFromProps;
          "function" === typeof l && qt(t, r, l, e), i.updater = Ua, t.stateNode = i, i._reactInternalFiber = t, Xt(t, r, e, n), t = Mn(null, t, r, !0, a, n);
        } else t.tag = 0, Cn(null, t, i, n), t = t.child;

        return t;

      case 16:
        switch (i = t.elementType, null !== e && (e.alternate = null, t.alternate = null, t.effectTag |= 2), a = t.pendingProps, e = $t(i), t.type = e, i = t.tag = jt(e), a = Ht(e, a), l = void 0, i) {
          case 0:
            l = Dn(null, t, e, a, n);
            break;

          case 1:
            l = jn(null, t, e, a, n);
            break;

          case 11:
            l = Sn(null, t, e, a, n);
            break;

          case 14:
            l = Pn(null, t, e, Ht(e.type, a), r, n);
            break;

          default:
            o("306", e, "");
        }

        return l;

      case 0:
        return r = t.type, i = t.pendingProps, i = t.elementType === r ? i : Ht(r, i), Dn(e, t, r, i, n);

      case 1:
        return r = t.type, i = t.pendingProps, i = t.elementType === r ? i : Ht(r, i), jn(e, t, r, i, n);

      case 3:
        return Rn(t), r = t.updateQueue, null === r && o("282"), i = t.memoizedState, i = null !== i ? i.element : null, Xn(t, r, t.pendingProps, null, n), r = t.memoizedState.element, r === i ? (En(), t = Un(e, t, n)) : (i = t.stateNode, (i = (null === e || null === e.child) && i.hydrate) && (yl = yt(t.stateNode.containerInfo), ml = t, i = vl = !0), i ? (t.effectTag |= 2, t.child = za(t, null, r, n)) : (Cn(e, t, r, n), En()), t = t.child), t;

      case 5:
        return rn(t), null === e && xn(t), r = t.type, i = t.pendingProps, a = null !== e ? e.memoizedProps : null, l = i.children, pt(r, i) ? l = null : null !== a && pt(r, a) && (t.effectTag |= 16), Nn(e, t), 1 !== n && 1 & t.mode && i.hidden ? (t.expirationTime = t.childExpirationTime = 1, t = null) : (Cn(e, t, l, n), t = t.child), t;

      case 6:
        return null === e && xn(t), null;

      case 13:
        return In(e, t, n);

      case 4:
        return tn(t, t.stateNode.containerInfo), r = t.pendingProps, null === e ? t.child = Fa(t, null, r, n) : Cn(e, t, r, n), t.child;

      case 11:
        return r = t.type, i = t.pendingProps, i = t.elementType === r ? i : Ht(r, i), Sn(e, t, r, i, n);

      case 7:
        return Cn(e, t, t.pendingProps, n), t.child;

      case 8:
      case 12:
        return Cn(e, t, t.pendingProps.children, n), t.child;

      case 10:
        e: {
          if (r = t.type._context, i = t.pendingProps, l = t.memoizedProps, a = i.value, Fn(t, a), null !== l) {
            var u = l.value;

            if (0 === (a = Se(u, a) ? 0 : 0 | ("function" === typeof r._calculateChangedBits ? r._calculateChangedBits(u, a) : 1073741823))) {
              if (l.children === i.children && !Da.current) {
                t = Un(e, t, n);
                break e;
              }
            } else for (null !== (u = t.child) && (u["return"] = t); null !== u;) {
              var c = u.contextDependencies;

              if (null !== c) {
                l = u.child;

                for (var s = c.first; null !== s;) {
                  if (s.context === r && 0 !== (s.observedBits & a)) {
                    1 === u.tag && (s = Hn(n), s.tag = Cl, qn(u, s)), u.expirationTime < n && (u.expirationTime = n), s = u.alternate, null !== s && s.expirationTime < n && (s.expirationTime = n), s = n;

                    for (var f = u["return"]; null !== f;) {
                      var d = f.alternate;
                      if (f.childExpirationTime < s) f.childExpirationTime = s, null !== d && d.childExpirationTime < s && (d.childExpirationTime = s);else {
                        if (!(null !== d && d.childExpirationTime < s)) break;
                        d.childExpirationTime = s;
                      }
                      f = f["return"];
                    }

                    c.expirationTime < n && (c.expirationTime = n);
                    break;
                  }

                  s = s.next;
                }
              } else l = 10 === u.tag && u.type === t.type ? null : u.child;

              if (null !== l) l["return"] = u;else for (l = u; null !== l;) {
                if (l === t) {
                  l = null;
                  break;
                }

                if (null !== (u = l.sibling)) {
                  u["return"] = l["return"], l = u;
                  break;
                }

                l = l["return"];
              }
              u = l;
            }
          }

          Cn(e, t, i.children, n), t = t.child;
        }

        return t;

      case 9:
        return i = t.type, a = t.pendingProps, r = a.children, Ln(t, n), i = Bn(i, a.unstable_observedBits), r = r(i), t.effectTag |= 1, Cn(e, t, r, n), t.child;

      case 14:
        return i = t.type, a = Ht(i, t.pendingProps), a = Ht(i.type, a), Pn(e, t, i, a, r, n);

      case 15:
        return On(e, t, t.type, t.pendingProps, r, n);

      case 17:
        return r = t.type, i = t.pendingProps, i = t.elementType === r ? i : Ht(r, i), null !== e && (e.alternate = null, t.alternate = null, t.effectTag |= 2), t.tag = 1, wt(r) ? (e = !0, Et(t)) : e = !1, Ln(t, n), Yt(t, r, i, n), Xt(t, r, i, n), Mn(null, t, r, !0, e, n);
    }

    o("156");
  }

  function Fn(e, t) {
    var n = e.type._context;
    bt(wl, n._currentValue, e), n._currentValue = t;
  }

  function zn(e) {
    var t = wl.current;
    vt(wl, e), e.type._context._currentValue = t;
  }

  function Ln(e, t) {
    kl = e, _l = xl = null;
    var n = e.contextDependencies;
    null !== n && n.expirationTime >= t && (gl = !0), e.contextDependencies = null;
  }

  function Bn(e, t) {
    return _l !== e && !1 !== t && 0 !== t && ("number" === typeof t && 1073741823 !== t || (_l = e, t = 1073741823), t = {
      context: e,
      observedBits: t,
      next: null
    }, null === xl ? (null === kl && o("308"), xl = t, kl.contextDependencies = {
      first: t,
      expirationTime: 0
    }) : xl = xl.next = t), e._currentValue;
  }

  function Wn(e) {
    return {
      baseState: e,
      firstUpdate: null,
      lastUpdate: null,
      firstCapturedUpdate: null,
      lastCapturedUpdate: null,
      firstEffect: null,
      lastEffect: null,
      firstCapturedEffect: null,
      lastCapturedEffect: null
    };
  }

  function Vn(e) {
    return {
      baseState: e.baseState,
      firstUpdate: e.firstUpdate,
      lastUpdate: e.lastUpdate,
      firstCapturedUpdate: null,
      lastCapturedUpdate: null,
      firstEffect: null,
      lastEffect: null,
      firstCapturedEffect: null,
      lastCapturedEffect: null
    };
  }

  function Hn(e) {
    return {
      expirationTime: e,
      tag: Tl,
      payload: null,
      callback: null,
      next: null,
      nextEffect: null
    };
  }

  function $n(e, t) {
    null === e.lastUpdate ? e.firstUpdate = e.lastUpdate = t : (e.lastUpdate.next = t, e.lastUpdate = t);
  }

  function qn(e, t) {
    var n = e.alternate;

    if (null === n) {
      var r = e.updateQueue,
          o = null;
      null === r && (r = e.updateQueue = Wn(e.memoizedState));
    } else r = e.updateQueue, o = n.updateQueue, null === r ? null === o ? (r = e.updateQueue = Wn(e.memoizedState), o = n.updateQueue = Wn(n.memoizedState)) : r = e.updateQueue = Vn(o) : null === o && (o = n.updateQueue = Vn(r));

    null === o || r === o ? $n(r, t) : null === r.lastUpdate || null === o.lastUpdate ? ($n(r, t), $n(o, t)) : ($n(r, t), o.lastUpdate = t);
  }

  function Qn(e, t) {
    var n = e.updateQueue;
    n = null === n ? e.updateQueue = Wn(e.memoizedState) : Yn(e, n), null === n.lastCapturedUpdate ? n.firstCapturedUpdate = n.lastCapturedUpdate = t : (n.lastCapturedUpdate.next = t, n.lastCapturedUpdate = t);
  }

  function Yn(e, t) {
    var n = e.alternate;
    return null !== n && t === n.updateQueue && (t = e.updateQueue = Vn(t)), t;
  }

  function Kn(e, t, n, r, o, i) {
    switch (n.tag) {
      case El:
        return e = n.payload, "function" === typeof e ? e.call(i, r, o) : e;

      case Sl:
        e.effectTag = -2049 & e.effectTag | 64;

      case Tl:
        if (e = n.payload, null === (o = "function" === typeof e ? e.call(i, r, o) : e) || void 0 === o) break;
        return lo({}, r, o);

      case Cl:
        Pl = !0;
    }

    return r;
  }

  function Xn(e, t, n, r, o) {
    Pl = !1, t = Yn(e, t);

    for (var i = t.baseState, a = null, l = 0, u = t.firstUpdate, c = i; null !== u;) {
      var s = u.expirationTime;
      s < o ? (null === a && (a = u, i = c), l < s && (l = s)) : (c = Kn(e, t, u, c, n, r), null !== u.callback && (e.effectTag |= 32, u.nextEffect = null, null === t.lastEffect ? t.firstEffect = t.lastEffect = u : (t.lastEffect.nextEffect = u, t.lastEffect = u))), u = u.next;
    }

    for (s = null, u = t.firstCapturedUpdate; null !== u;) {
      var f = u.expirationTime;
      f < o ? (null === s && (s = u, null === a && (i = c)), l < f && (l = f)) : (c = Kn(e, t, u, c, n, r), null !== u.callback && (e.effectTag |= 32, u.nextEffect = null, null === t.lastCapturedEffect ? t.firstCapturedEffect = t.lastCapturedEffect = u : (t.lastCapturedEffect.nextEffect = u, t.lastCapturedEffect = u))), u = u.next;
    }

    null === a && (t.lastUpdate = null), null === s ? t.lastCapturedUpdate = null : e.effectTag |= 32, null === a && null === s && (i = c), t.baseState = i, t.firstUpdate = a, t.firstCapturedUpdate = s, e.expirationTime = l, e.memoizedState = c;
  }

  function Gn(e, t, n) {
    null !== t.firstCapturedUpdate && (null !== t.lastUpdate && (t.lastUpdate.next = t.firstCapturedUpdate, t.lastUpdate = t.lastCapturedUpdate), t.firstCapturedUpdate = t.lastCapturedUpdate = null), Jn(t.firstEffect, n), t.firstEffect = t.lastEffect = null, Jn(t.firstCapturedEffect, n), t.firstCapturedEffect = t.lastCapturedEffect = null;
  }

  function Jn(e, t) {
    for (; null !== e;) {
      var n = e.callback;

      if (null !== n) {
        e.callback = null;
        var r = t;
        "function" !== typeof n && o("191", n), n.call(r);
      }

      e = e.nextEffect;
    }
  }

  function Zn(e, t) {
    return {
      value: e,
      source: t,
      stack: te(t)
    };
  }

  function er(e) {
    e.effectTag |= 4;
  }

  function tr(e, t) {
    var n = t.source,
        r = t.stack;
    null === r && null !== n && (r = te(n)), null !== n && ee(n.type), t = t.value, null !== e && 1 === e.tag && ee(e.type);

    try {
      console.error(t);
    } catch (e) {
      setTimeout(function () {
        throw e;
      });
    }
  }

  function nr(e) {
    var t = e.ref;
    if (null !== t) if ("function" === typeof t) try {
      t(null);
    } catch (t) {
      _r(e, t);
    } else t.current = null;
  }

  function rr(e, t, n) {
    if (n = n.updateQueue, null !== (n = null !== n ? n.lastEffect : null)) {
      var r = n = n.next;

      do {
        if ((r.tag & e) !== Ha) {
          var o = r.destroy;
          r.destroy = void 0, void 0 !== o && o();
        }

        (r.tag & t) !== Ha && (o = r.create, r.destroy = o()), r = r.next;
      } while (r !== n);
    }
  }

  function or(e, t) {
    for (var n = e;;) {
      if (5 === n.tag) {
        var r = n.stateNode;
        if (t) r.style.display = "none";else {
          r = n.stateNode;
          var o = n.memoizedProps.style;
          o = void 0 !== o && null !== o && o.hasOwnProperty("display") ? o.display : null, r.style.display = at("display", o);
        }
      } else if (6 === n.tag) n.stateNode.nodeValue = t ? "" : n.memoizedProps;else {
        if (13 === n.tag && null !== n.memoizedState) {
          r = n.child.sibling, r["return"] = n, n = r;
          continue;
        }

        if (null !== n.child) {
          n.child["return"] = n, n = n.child;
          continue;
        }
      }

      if (n === e) break;

      for (; null === n.sibling;) {
        if (null === n["return"] || n["return"] === e) return;
        n = n["return"];
      }

      n.sibling["return"] = n["return"], n = n.sibling;
    }
  }

  function ir(e) {
    switch ("function" === typeof Ra && Ra(e), e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        var t = e.updateQueue;

        if (null !== t && null !== (t = t.lastEffect)) {
          var n = t = t.next;

          do {
            var r = n.destroy;

            if (void 0 !== r) {
              var o = e;

              try {
                r();
              } catch (e) {
                _r(o, e);
              }
            }

            n = n.next;
          } while (n !== t);
        }

        break;

      case 1:
        if (nr(e), t = e.stateNode, "function" === typeof t.componentWillUnmount) try {
          t.props = e.memoizedProps, t.state = e.memoizedState, t.componentWillUnmount();
        } catch (t) {
          _r(e, t);
        }
        break;

      case 5:
        nr(e);
        break;

      case 4:
        ur(e);
    }
  }

  function ar(e) {
    return 5 === e.tag || 3 === e.tag || 4 === e.tag;
  }

  function lr(e) {
    e: {
      for (var t = e["return"]; null !== t;) {
        if (ar(t)) {
          var n = t;
          break e;
        }

        t = t["return"];
      }

      o("160"), n = void 0;
    }

    var r = t = void 0;

    switch (n.tag) {
      case 5:
        t = n.stateNode, r = !1;
        break;

      case 3:
      case 4:
        t = n.stateNode.containerInfo, r = !0;
        break;

      default:
        o("161");
    }

    16 & n.effectTag && (it(t, ""), n.effectTag &= -17);

    e: t: for (n = e;;) {
      for (; null === n.sibling;) {
        if (null === n["return"] || ar(n["return"])) {
          n = null;
          break e;
        }

        n = n["return"];
      }

      for (n.sibling["return"] = n["return"], n = n.sibling; 5 !== n.tag && 6 !== n.tag && 18 !== n.tag;) {
        if (2 & n.effectTag) continue t;
        if (null === n.child || 4 === n.tag) continue t;
        n.child["return"] = n, n = n.child;
      }

      if (!(2 & n.effectTag)) {
        n = n.stateNode;
        break e;
      }
    }

    for (var i = e;;) {
      if (5 === i.tag || 6 === i.tag) {
        if (n) {
          if (r) {
            var a = t,
                l = i.stateNode,
                u = n;
            8 === a.nodeType ? a.parentNode.insertBefore(l, u) : a.insertBefore(l, u);
          } else t.insertBefore(i.stateNode, n);
        } else r ? (l = t, u = i.stateNode, 8 === l.nodeType ? (a = l.parentNode, a.insertBefore(u, l)) : (a = l, a.appendChild(u)), null !== (l = l._reactRootContainer) && void 0 !== l || null !== a.onclick || (a.onclick = ft)) : t.appendChild(i.stateNode);
      } else if (4 !== i.tag && null !== i.child) {
        i.child["return"] = i, i = i.child;
        continue;
      }
      if (i === e) break;

      for (; null === i.sibling;) {
        if (null === i["return"] || i["return"] === e) return;
        i = i["return"];
      }

      i.sibling["return"] = i["return"], i = i.sibling;
    }
  }

  function ur(e) {
    for (var t = e, n = !1, r = void 0, i = void 0;;) {
      if (!n) {
        n = t["return"];

        e: for (;;) {
          switch (null === n && o("160"), n.tag) {
            case 5:
              r = n.stateNode, i = !1;
              break e;

            case 3:
            case 4:
              r = n.stateNode.containerInfo, i = !0;
              break e;
          }

          n = n["return"];
        }

        n = !0;
      }

      if (5 === t.tag || 6 === t.tag) {
        e: for (var a = t, l = a;;) {
          if (ir(l), null !== l.child && 4 !== l.tag) l.child["return"] = l, l = l.child;else {
            if (l === a) break;

            for (; null === l.sibling;) {
              if (null === l["return"] || l["return"] === a) break e;
              l = l["return"];
            }

            l.sibling["return"] = l["return"], l = l.sibling;
          }
        }

        i ? (a = r, l = t.stateNode, 8 === a.nodeType ? a.parentNode.removeChild(l) : a.removeChild(l)) : r.removeChild(t.stateNode);
      } else if (4 === t.tag) {
        if (null !== t.child) {
          r = t.stateNode.containerInfo, i = !0, t.child["return"] = t, t = t.child;
          continue;
        }
      } else if (ir(t), null !== t.child) {
        t.child["return"] = t, t = t.child;
        continue;
      }

      if (t === e) break;

      for (; null === t.sibling;) {
        if (null === t["return"] || t["return"] === e) return;
        t = t["return"], 4 === t.tag && (n = !1);
      }

      t.sibling["return"] = t["return"], t = t.sibling;
    }
  }

  function cr(e, t) {
    switch (t.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        rr(qa, Qa, t);
        break;

      case 1:
        break;

      case 5:
        var n = t.stateNode;

        if (null != n) {
          var r = t.memoizedProps;
          e = null !== e ? e.memoizedProps : r;
          var i = t.type,
              a = t.updateQueue;
          t.updateQueue = null, null !== a && ht(n, a, i, e, r, t);
        }

        break;

      case 6:
        null === t.stateNode && o("162"), t.stateNode.nodeValue = t.memoizedProps;
        break;

      case 3:
      case 12:
        break;

      case 13:
        if (n = t.memoizedState, r = void 0, e = t, null === n ? r = !1 : (r = !0, e = t.child, 0 === n.timedOutAt && (n.timedOutAt = Ir())), null !== e && or(e, r), null !== (n = t.updateQueue)) {
          t.updateQueue = null;
          var l = t.stateNode;
          null === l && (l = t.stateNode = new Ml()), n.forEach(function (e) {
            var n = Cr.bind(null, t, e);
            l.has(e) || (l.add(e), e.then(n, n));
          });
        }

        break;

      case 17:
        break;

      default:
        o("163");
    }
  }

  function sr(e, t, n) {
    n = Hn(n), n.tag = Sl, n.payload = {
      element: null
    };
    var r = t.value;
    return n.callback = function () {
      Hr(r), tr(e, t);
    }, n;
  }

  function fr(e, t, n) {
    n = Hn(n), n.tag = Sl;
    var r = e.type.getDerivedStateFromError;

    if ("function" === typeof r) {
      var o = t.value;

      n.payload = function () {
        return r(o);
      };
    }

    var i = e.stateNode;
    return null !== i && "function" === typeof i.componentDidCatch && (n.callback = function () {
      "function" !== typeof r && (null === Kl ? Kl = new Set([this]) : Kl.add(this));
      var n = t.value,
          o = t.stack;
      tr(e, t), this.componentDidCatch(n, {
        componentStack: null !== o ? o : ""
      });
    }), n;
  }

  function dr(e) {
    switch (e.tag) {
      case 1:
        wt(e.type) && kt(e);
        var t = e.effectTag;
        return 2048 & t ? (e.effectTag = -2049 & t | 64, e) : null;

      case 3:
        return nn(e), xt(e), t = e.effectTag, 0 !== (64 & t) && o("285"), e.effectTag = -2049 & t | 64, e;

      case 5:
        return on(e), null;

      case 13:
        return t = e.effectTag, 2048 & t ? (e.effectTag = -2049 & t | 64, e) : null;

      case 18:
        return null;

      case 4:
        return nn(e), null;

      case 10:
        return zn(e), null;

      default:
        return null;
    }
  }

  function pr() {
    if (null !== zl) for (var e = zl["return"]; null !== e;) {
      var t = e;

      switch (t.tag) {
        case 1:
          var n = t.type.childContextTypes;
          null !== n && void 0 !== n && kt(t);
          break;

        case 3:
          nn(t), xt(t);
          break;

        case 5:
          on(t);
          break;

        case 4:
          nn(t);
          break;

        case 10:
          zn(t);
      }

      e = e["return"];
    }
    Ll = null, Bl = 0, Wl = -1, Vl = !1, zl = null;
  }

  function hr() {
    for (; null !== Hl;) {
      var e = Hl.effectTag;

      if (16 & e && it(Hl.stateNode, ""), 128 & e) {
        var t = Hl.alternate;
        null !== t && null !== (t = t.ref) && ("function" === typeof t ? t(null) : t.current = null);
      }

      switch (14 & e) {
        case 2:
          lr(Hl), Hl.effectTag &= -3;
          break;

        case 6:
          lr(Hl), Hl.effectTag &= -3, cr(Hl.alternate, Hl);
          break;

        case 4:
          cr(Hl.alternate, Hl);
          break;

        case 8:
          e = Hl, ur(e), e["return"] = null, e.child = null, e.memoizedState = null, e.updateQueue = null, null !== (e = e.alternate) && (e["return"] = null, e.child = null, e.memoizedState = null, e.updateQueue = null);
      }

      Hl = Hl.nextEffect;
    }
  }

  function mr() {
    for (; null !== Hl;) {
      if (256 & Hl.effectTag) e: {
        var e = Hl.alternate,
            t = Hl;

        switch (t.tag) {
          case 0:
          case 11:
          case 15:
            rr($a, Ha, t);
            break e;

          case 1:
            if (256 & t.effectTag && null !== e) {
              var n = e.memoizedProps,
                  r = e.memoizedState;
              e = t.stateNode, t = e.getSnapshotBeforeUpdate(t.elementType === t.type ? n : Ht(t.type, n), r), e.__reactInternalSnapshotBeforeUpdate = t;
            }

            break e;

          case 3:
          case 5:
          case 6:
          case 4:
          case 17:
            break e;

          default:
            o("163");
        }
      }
      Hl = Hl.nextEffect;
    }
  }

  function yr(e, t) {
    for (; null !== Hl;) {
      var n = Hl.effectTag;

      if (36 & n) {
        var r = Hl.alternate,
            i = Hl,
            a = t;

        switch (i.tag) {
          case 0:
          case 11:
          case 15:
            rr(Ya, Ka, i);
            break;

          case 1:
            var l = i.stateNode;
            if (4 & i.effectTag) if (null === r) l.componentDidMount();else {
              var u = i.elementType === i.type ? r.memoizedProps : Ht(i.type, r.memoizedProps);
              l.componentDidUpdate(u, r.memoizedState, l.__reactInternalSnapshotBeforeUpdate);
            }
            r = i.updateQueue, null !== r && Gn(i, r, l, a);
            break;

          case 3:
            if (null !== (r = i.updateQueue)) {
              if (l = null, null !== i.child) switch (i.child.tag) {
                case 5:
                  l = i.child.stateNode;
                  break;

                case 1:
                  l = i.child.stateNode;
              }
              Gn(i, r, l, a);
            }

            break;

          case 5:
            a = i.stateNode, null === r && 4 & i.effectTag && dt(i.type, i.memoizedProps) && a.focus();
            break;

          case 6:
          case 4:
          case 12:
          case 13:
          case 17:
            break;

          default:
            o("163");
        }
      }

      128 & n && null !== (i = Hl.ref) && (a = Hl.stateNode, "function" === typeof i ? i(a) : i.current = a), 512 & n && (ql = e), Hl = Hl.nextEffect;
    }
  }

  function vr(e, t) {
    Yl = Ql = ql = null;
    var n = eu;
    eu = !0;

    do {
      if (512 & t.effectTag) {
        var r = !1,
            o = void 0;

        try {
          var i = t;
          rr(Ga, Ha, i), rr(Ha, Xa, i);
        } catch (e) {
          r = !0, o = e;
        }

        r && _r(t, o);
      }

      t = t.nextEffect;
    } while (null !== t);

    eu = n, n = e.expirationTime, 0 !== n && Ur(e, n), au || eu || Lr(1073741823, !1);
  }

  function br() {
    null !== Ql && Ca(Ql), null !== Yl && Yl();
  }

  function gr(e, t) {
    $l = Fl = !0, e.current === t && o("177");
    var n = e.pendingCommitExpirationTime;
    0 === n && o("261"), e.pendingCommitExpirationTime = 0;
    var r = t.expirationTime,
        i = t.childExpirationTime;

    for (Lt(e, i > r ? i : r), Ul.current = null, r = void 0, 1 < t.effectTag ? null !== t.lastEffect ? (t.lastEffect.nextEffect = t, r = t.firstEffect) : r = t : r = t.firstEffect, ka = oa, xa = Qe(), oa = !1, Hl = r; null !== Hl;) {
      i = !1;
      var a = void 0;

      try {
        mr();
      } catch (e) {
        i = !0, a = e;
      }

      i && (null === Hl && o("178"), _r(Hl, a), null !== Hl && (Hl = Hl.nextEffect));
    }

    for (Hl = r; null !== Hl;) {
      i = !1, a = void 0;

      try {
        hr();
      } catch (e) {
        i = !0, a = e;
      }

      i && (null === Hl && o("178"), _r(Hl, a), null !== Hl && (Hl = Hl.nextEffect));
    }

    for (Ye(xa), xa = null, oa = !!ka, ka = null, e.current = t, Hl = r; null !== Hl;) {
      i = !1, a = void 0;

      try {
        yr(e, n);
      } catch (e) {
        i = !0, a = e;
      }

      i && (null === Hl && o("178"), _r(Hl, a), null !== Hl && (Hl = Hl.nextEffect));
    }

    if (null !== r && null !== ql) {
      var l = vr.bind(null, e, r);
      Ql = uo.unstable_runWithPriority(uo.unstable_NormalPriority, function () {
        return Ea(l);
      }), Yl = l;
    }

    Fl = $l = !1, "function" === typeof Ma && Ma(t.stateNode), n = t.expirationTime, t = t.childExpirationTime, t = t > n ? t : n, 0 === t && (Kl = null), Rr(e, t);
  }

  function wr(e) {
    for (;;) {
      var t = e.alternate,
          n = e["return"],
          r = e.sibling;

      if (0 === (1024 & e.effectTag)) {
        zl = e;

        e: {
          var i = t;
          t = e;
          var a = Bl,
              l = t.pendingProps;

          switch (t.tag) {
            case 2:
            case 16:
              break;

            case 15:
            case 0:
              break;

            case 1:
              wt(t.type) && kt(t);
              break;

            case 3:
              nn(t), xt(t), l = t.stateNode, l.pendingContext && (l.context = l.pendingContext, l.pendingContext = null), null !== i && null !== i.child || (Tn(t), t.effectTag &= -3), Nl(t);
              break;

            case 5:
              on(t);
              var u = en(Va.current);
              if (a = t.type, null !== i && null != t.stateNode) Dl(i, t, a, l, u), i.ref !== t.ref && (t.effectTag |= 128);else if (l) {
                var c = en(Ba.current);

                if (Tn(t)) {
                  l = t, i = l.stateNode;
                  var s = l.type,
                      f = l.memoizedProps,
                      d = u;

                  switch (i[So] = l, i[Po] = f, a = void 0, u = s) {
                    case "iframe":
                    case "object":
                      Ue("load", i);
                      break;

                    case "video":
                    case "audio":
                      for (s = 0; s < Ao.length; s++) {
                        Ue(Ao[s], i);
                      }

                      break;

                    case "source":
                      Ue("error", i);
                      break;

                    case "img":
                    case "image":
                    case "link":
                      Ue("error", i), Ue("load", i);
                      break;

                    case "form":
                      Ue("reset", i), Ue("submit", i);
                      break;

                    case "details":
                      Ue("toggle", i);
                      break;

                    case "input":
                      se(i, f), Ue("invalid", i), st(d, "onChange");
                      break;

                    case "select":
                      i._wrapperState = {
                        wasMultiple: !!f.multiple
                      }, Ue("invalid", i), st(d, "onChange");
                      break;

                    case "textarea":
                      et(i, f), Ue("invalid", i), st(d, "onChange");
                  }

                  ut(u, f), s = null;

                  for (a in f) {
                    f.hasOwnProperty(a) && (c = f[a], "children" === a ? "string" === typeof c ? i.textContent !== c && (s = ["children", c]) : "number" === typeof c && i.textContent !== "" + c && (s = ["children", "" + c]) : go.hasOwnProperty(a) && null != c && st(d, a));
                  }

                  switch (u) {
                    case "input":
                      G(i), pe(i, f, !0);
                      break;

                    case "textarea":
                      G(i), nt(i, f);
                      break;

                    case "select":
                    case "option":
                      break;

                    default:
                      "function" === typeof f.onClick && (i.onclick = ft);
                  }

                  a = s, l.updateQueue = a, l = null !== a, l && er(t);
                } else {
                  f = t, d = a, i = l, s = 9 === u.nodeType ? u : u.ownerDocument, c === ma.html && (c = rt(d)), c === ma.html ? "script" === d ? (i = s.createElement("div"), i.innerHTML = "<script><\/script>", s = i.removeChild(i.firstChild)) : "string" === typeof i.is ? s = s.createElement(d, {
                    is: i.is
                  }) : (s = s.createElement(d), "select" === d && (d = s, i.multiple ? d.multiple = !0 : i.size && (d.size = i.size))) : s = s.createElementNS(c, d), i = s, i[So] = f, i[Po] = l, Ol(i, t, !1, !1), d = i, s = a, f = l;
                  var p = u,
                      h = ct(s, f);

                  switch (s) {
                    case "iframe":
                    case "object":
                      Ue("load", d), u = f;
                      break;

                    case "video":
                    case "audio":
                      for (u = 0; u < Ao.length; u++) {
                        Ue(Ao[u], d);
                      }

                      u = f;
                      break;

                    case "source":
                      Ue("error", d), u = f;
                      break;

                    case "img":
                    case "image":
                    case "link":
                      Ue("error", d), Ue("load", d), u = f;
                      break;

                    case "form":
                      Ue("reset", d), Ue("submit", d), u = f;
                      break;

                    case "details":
                      Ue("toggle", d), u = f;
                      break;

                    case "input":
                      se(d, f), u = ce(d, f), Ue("invalid", d), st(p, "onChange");
                      break;

                    case "option":
                      u = Ge(d, f);
                      break;

                    case "select":
                      d._wrapperState = {
                        wasMultiple: !!f.multiple
                      }, u = lo({}, f, {
                        value: void 0
                      }), Ue("invalid", d), st(p, "onChange");
                      break;

                    case "textarea":
                      et(d, f), u = Ze(d, f), Ue("invalid", d), st(p, "onChange");
                      break;

                    default:
                      u = f;
                  }

                  ut(s, u), c = void 0;
                  var m = s,
                      y = d,
                      v = u;

                  for (c in v) {
                    if (v.hasOwnProperty(c)) {
                      var b = v[c];
                      "style" === c ? lt(y, b) : "dangerouslySetInnerHTML" === c ? null != (b = b ? b.__html : void 0) && va(y, b) : "children" === c ? "string" === typeof b ? ("textarea" !== m || "" !== b) && it(y, b) : "number" === typeof b && it(y, "" + b) : "suppressContentEditableWarning" !== c && "suppressHydrationWarning" !== c && "autoFocus" !== c && (go.hasOwnProperty(c) ? null != b && st(p, c) : null != b && le(y, c, b, h));
                    }
                  }

                  switch (s) {
                    case "input":
                      G(d), pe(d, f, !1);
                      break;

                    case "textarea":
                      G(d), nt(d, f);
                      break;

                    case "option":
                      null != f.value && d.setAttribute("value", "" + ue(f.value));
                      break;

                    case "select":
                      u = d, u.multiple = !!f.multiple, d = f.value, null != d ? Je(u, !!f.multiple, d, !1) : null != f.defaultValue && Je(u, !!f.multiple, f.defaultValue, !0);
                      break;

                    default:
                      "function" === typeof u.onClick && (d.onclick = ft);
                  }

                  (l = dt(a, l)) && er(t), t.stateNode = i;
                }

                null !== t.ref && (t.effectTag |= 128);
              } else null === t.stateNode && o("166");
              break;

            case 6:
              i && null != t.stateNode ? jl(i, t, i.memoizedProps, l) : ("string" !== typeof l && null === t.stateNode && o("166"), i = en(Va.current), en(Ba.current), Tn(t) ? (l = t, a = l.stateNode, i = l.memoizedProps, a[So] = l, (l = a.nodeValue !== i) && er(t)) : (a = t, l = (9 === i.nodeType ? i : i.ownerDocument).createTextNode(l), l[So] = t, a.stateNode = l));
              break;

            case 11:
              break;

            case 13:
              if (l = t.memoizedState, 0 !== (64 & t.effectTag)) {
                t.expirationTime = a, zl = t;
                break e;
              }

              l = null !== l, a = null !== i && null !== i.memoizedState, null !== i && !l && a && null !== (i = i.child.sibling) && (u = t.firstEffect, null !== u ? (t.firstEffect = i, i.nextEffect = u) : (t.firstEffect = t.lastEffect = i, i.nextEffect = null), i.effectTag = 8), (l || a) && (t.effectTag |= 4);
              break;

            case 7:
            case 8:
            case 12:
              break;

            case 4:
              nn(t), Nl(t);
              break;

            case 10:
              zn(t);
              break;

            case 9:
            case 14:
              break;

            case 17:
              wt(t.type) && kt(t);
              break;

            case 18:
              break;

            default:
              o("156");
          }

          zl = null;
        }

        if (t = e, 1 === Bl || 1 !== t.childExpirationTime) {
          for (l = 0, a = t.child; null !== a;) {
            i = a.expirationTime, u = a.childExpirationTime, i > l && (l = i), u > l && (l = u), a = a.sibling;
          }

          t.childExpirationTime = l;
        }

        if (null !== zl) return zl;
        null !== n && 0 === (1024 & n.effectTag) && (null === n.firstEffect && (n.firstEffect = e.firstEffect), null !== e.lastEffect && (null !== n.lastEffect && (n.lastEffect.nextEffect = e.firstEffect), n.lastEffect = e.lastEffect), 1 < e.effectTag && (null !== n.lastEffect ? n.lastEffect.nextEffect = e : n.firstEffect = e, n.lastEffect = e));
      } else {
        if (null !== (e = dr(e, Bl))) return e.effectTag &= 1023, e;
        null !== n && (n.firstEffect = n.lastEffect = null, n.effectTag |= 1024);
      }

      if (null !== r) return r;
      if (null === n) break;
      e = n;
    }

    return null;
  }

  function kr(e) {
    var t = An(e.alternate, e, Bl);
    return e.memoizedProps = e.pendingProps, null === t && (t = wr(e)), Ul.current = null, t;
  }

  function xr(e, t) {
    Fl && o("243"), br(), Fl = !0;
    var n = Il.current;
    Il.current = dl;
    var r = e.nextExpirationTimeToWorkOn;
    r === Bl && e === Ll && null !== zl || (pr(), Ll = e, Bl = r, zl = Mt(Ll.current, null, Bl), e.pendingCommitExpirationTime = 0);

    for (var i = !1;;) {
      try {
        if (t) for (; null !== zl && !Fr();) {
          zl = kr(zl);
        } else for (; null !== zl;) {
          zl = kr(zl);
        }
      } catch (t) {
        if (_l = xl = kl = null, cn(), null === zl) i = !0, Hr(t);else {
          null === zl && o("271");
          var a = zl,
              l = a["return"];

          if (null !== l) {
            e: {
              var u = e,
                  c = l,
                  s = a,
                  f = t;

              if (l = Bl, s.effectTag |= 1024, s.firstEffect = s.lastEffect = null, null !== f && "object" === _typeof(f) && "function" === typeof f.then) {
                var d = f;
                f = c;
                var p = -1,
                    h = -1;

                do {
                  if (13 === f.tag) {
                    var m = f.alternate;

                    if (null !== m && null !== (m = m.memoizedState)) {
                      h = 10 * (1073741822 - m.timedOutAt);
                      break;
                    }

                    m = f.pendingProps.maxDuration, "number" === typeof m && (0 >= m ? p = 0 : (-1 === p || m < p) && (p = m));
                  }

                  f = f["return"];
                } while (null !== f);

                f = c;

                do {
                  if ((m = 13 === f.tag) && (m = void 0 !== f.memoizedProps.fallback && null === f.memoizedState), m) {
                    if (c = f.updateQueue, null === c ? (c = new Set(), c.add(d), f.updateQueue = c) : c.add(d), 0 === (1 & f.mode)) {
                      f.effectTag |= 64, s.effectTag &= -1957, 1 === s.tag && (null === s.alternate ? s.tag = 17 : (l = Hn(1073741823), l.tag = Cl, qn(s, l))), s.expirationTime = 1073741823;
                      break e;
                    }

                    s = u, c = l;
                    var y = s.pingCache;
                    null === y ? (y = s.pingCache = new Rl(), m = new Set(), y.set(d, m)) : void 0 === (m = y.get(d)) && (m = new Set(), y.set(d, m)), m.has(c) || (m.add(c), s = Er.bind(null, s, d, c), d.then(s, s)), -1 === p ? u = 1073741823 : (-1 === h && (h = 10 * (1073741822 - Wt(u, l)) - 5e3), u = h + p), 0 <= u && Wl < u && (Wl = u), f.effectTag |= 2048, f.expirationTime = l;
                    break e;
                  }

                  f = f["return"];
                } while (null !== f);

                f = Error((ee(s.type) || "A React component") + " suspended while rendering, but no fallback UI was specified.\n\nAdd a <Suspense fallback=...> component higher in the tree to provide a loading indicator or placeholder to display." + te(s));
              }

              Vl = !0, f = Zn(f, s), u = c;

              do {
                switch (u.tag) {
                  case 3:
                    u.effectTag |= 2048, u.expirationTime = l, l = sr(u, f, l), Qn(u, l);
                    break e;

                  case 1:
                    if (p = f, h = u.type, s = u.stateNode, 0 === (64 & u.effectTag) && ("function" === typeof h.getDerivedStateFromError || null !== s && "function" === typeof s.componentDidCatch && (null === Kl || !Kl.has(s)))) {
                      u.effectTag |= 2048, u.expirationTime = l, l = fr(u, p, l), Qn(u, l);
                      break e;
                    }

                }

                u = u["return"];
              } while (null !== u);
            }

            zl = wr(a);
            continue;
          }

          i = !0, Hr(t);
        }
      }

      break;
    }

    if (Fl = !1, Il.current = n, _l = xl = kl = null, cn(), i) Ll = null, e.finishedWork = null;else if (null !== zl) e.finishedWork = null;else {
      if (n = e.current.alternate, null === n && o("281"), Ll = null, Vl) {
        if (i = e.latestPendingTime, a = e.latestSuspendedTime, l = e.latestPingedTime, 0 !== i && i < r || 0 !== a && a < r || 0 !== l && l < r) return Bt(e, r), void jr(e, n, r, e.expirationTime, -1);
        if (!e.didError && t) return e.didError = !0, r = e.nextExpirationTimeToWorkOn = r, t = e.expirationTime = 1073741823, void jr(e, n, r, t, -1);
      }

      t && -1 !== Wl ? (Bt(e, r), t = 10 * (1073741822 - Wt(e, r)), t < Wl && (Wl = t), t = 10 * (1073741822 - Ir()), t = Wl - t, jr(e, n, r, e.expirationTime, 0 > t ? 0 : t)) : (e.pendingCommitExpirationTime = r, e.finishedWork = n);
    }
  }

  function _r(e, t) {
    for (var n = e["return"]; null !== n;) {
      switch (n.tag) {
        case 1:
          var r = n.stateNode;
          if ("function" === typeof n.type.getDerivedStateFromError || "function" === typeof r.componentDidCatch && (null === Kl || !Kl.has(r))) return e = Zn(t, e), e = fr(n, e, 1073741823), qn(n, e), void Pr(n, 1073741823);
          break;

        case 3:
          return e = Zn(t, e), e = sr(n, e, 1073741823), qn(n, e), void Pr(n, 1073741823);
      }

      n = n["return"];
    }

    3 === e.tag && (n = Zn(t, e), n = sr(e, n, 1073741823), qn(e, n), Pr(e, 1073741823));
  }

  function Tr(e, t) {
    var n = uo.unstable_getCurrentPriorityLevel(),
        r = void 0;
    if (0 === (1 & t.mode)) r = 1073741823;else if (Fl && !$l) r = Bl;else {
      switch (n) {
        case uo.unstable_ImmediatePriority:
          r = 1073741823;
          break;

        case uo.unstable_UserBlockingPriority:
          r = 1073741822 - 10 * (1 + ((1073741822 - e + 15) / 10 | 0));
          break;

        case uo.unstable_NormalPriority:
          r = 1073741822 - 25 * (1 + ((1073741822 - e + 500) / 25 | 0));
          break;

        case uo.unstable_LowPriority:
        case uo.unstable_IdlePriority:
          r = 1;
          break;

        default:
          o("313");
      }

      null !== Ll && r === Bl && --r;
    }
    return n === uo.unstable_UserBlockingPriority && (0 === ru || r < ru) && (ru = r), r;
  }

  function Er(e, t, n) {
    var r = e.pingCache;
    null !== r && r["delete"](t), null !== Ll && Bl === n ? Ll = null : (t = e.earliestSuspendedTime, r = e.latestSuspendedTime, 0 !== t && n <= t && n >= r && (e.didError = !1, t = e.latestPingedTime, (0 === t || t > n) && (e.latestPingedTime = n), Vt(n, e), 0 !== (n = e.expirationTime) && Ur(e, n)));
  }

  function Cr(e, t) {
    var n = e.stateNode;
    null !== n && n["delete"](t), t = Ir(), t = Tr(t, e), null !== (e = Sr(e, t)) && (zt(e, t), 0 !== (t = e.expirationTime) && Ur(e, t));
  }

  function Sr(e, t) {
    e.expirationTime < t && (e.expirationTime = t);
    var n = e.alternate;
    null !== n && n.expirationTime < t && (n.expirationTime = t);
    var r = e["return"],
        o = null;
    if (null === r && 3 === e.tag) o = e.stateNode;else for (; null !== r;) {
      if (n = r.alternate, r.childExpirationTime < t && (r.childExpirationTime = t), null !== n && n.childExpirationTime < t && (n.childExpirationTime = t), null === r["return"] && 3 === r.tag) {
        o = r.stateNode;
        break;
      }

      r = r["return"];
    }
    return o;
  }

  function Pr(e, t) {
    null !== (e = Sr(e, t)) && (!Fl && 0 !== Bl && t > Bl && pr(), zt(e, t), Fl && !$l && Ll === e || Ur(e, e.expirationTime), pu > du && (pu = 0, o("185")));
  }

  function Or(e, t, n, r, o) {
    return uo.unstable_runWithPriority(uo.unstable_ImmediatePriority, function () {
      return e(t, n, r, o);
    });
  }

  function Nr() {
    su = 1073741822 - ((uo.unstable_now() - cu) / 10 | 0);
  }

  function Dr(e, t) {
    if (0 !== Jl) {
      if (t < Jl) return;
      null !== Zl && uo.unstable_cancelCallback(Zl);
    }

    Jl = t, e = uo.unstable_now() - cu, Zl = uo.unstable_scheduleCallback(zr, {
      timeout: 10 * (1073741822 - t) - e
    });
  }

  function jr(e, t, n, r, o) {
    e.expirationTime = r, 0 !== o || Fr() ? 0 < o && (e.timeoutHandle = _a(Mr.bind(null, e, t, n), o)) : (e.pendingCommitExpirationTime = n, e.finishedWork = t);
  }

  function Mr(e, t, n) {
    e.pendingCommitExpirationTime = n, e.finishedWork = t, Nr(), fu = su, Br(e, n);
  }

  function Rr(e, t) {
    e.expirationTime = t, e.finishedWork = null;
  }

  function Ir() {
    return eu ? fu : (Ar(), 0 !== nu && 1 !== nu || (Nr(), fu = su), fu);
  }

  function Ur(e, t) {
    null === e.nextScheduledRoot ? (e.expirationTime = t, null === Gl ? (Xl = Gl = e, e.nextScheduledRoot = e) : (Gl = Gl.nextScheduledRoot = e, Gl.nextScheduledRoot = Xl)) : t > e.expirationTime && (e.expirationTime = t), eu || (au ? lu && (tu = e, nu = 1073741823, Wr(e, 1073741823, !1)) : 1073741823 === t ? Lr(1073741823, !1) : Dr(e, t));
  }

  function Ar() {
    var e = 0,
        t = null;
    if (null !== Gl) for (var n = Gl, r = Xl; null !== r;) {
      var i = r.expirationTime;

      if (0 === i) {
        if ((null === n || null === Gl) && o("244"), r === r.nextScheduledRoot) {
          Xl = Gl = r.nextScheduledRoot = null;
          break;
        }

        if (r === Xl) Xl = i = r.nextScheduledRoot, Gl.nextScheduledRoot = i, r.nextScheduledRoot = null;else {
          if (r === Gl) {
            Gl = n, Gl.nextScheduledRoot = Xl, r.nextScheduledRoot = null;
            break;
          }

          n.nextScheduledRoot = r.nextScheduledRoot, r.nextScheduledRoot = null;
        }
        r = n.nextScheduledRoot;
      } else {
        if (i > e && (e = i, t = r), r === Gl) break;
        if (1073741823 === e) break;
        n = r, r = r.nextScheduledRoot;
      }
    }
    tu = t, nu = e;
  }

  function Fr() {
    return !!mu || !!uo.unstable_shouldYield() && (mu = !0);
  }

  function zr() {
    try {
      if (!Fr() && null !== Xl) {
        Nr();
        var e = Xl;

        do {
          var t = e.expirationTime;
          0 !== t && su <= t && (e.nextExpirationTimeToWorkOn = su), e = e.nextScheduledRoot;
        } while (e !== Xl);
      }

      Lr(0, !0);
    } finally {
      mu = !1;
    }
  }

  function Lr(e, t) {
    if (Ar(), t) for (Nr(), fu = su; null !== tu && 0 !== nu && e <= nu && !(mu && su > nu);) {
      Wr(tu, nu, su > nu), Ar(), Nr(), fu = su;
    } else for (; null !== tu && 0 !== nu && e <= nu;) {
      Wr(tu, nu, !1), Ar();
    }
    if (t && (Jl = 0, Zl = null), 0 !== nu && Dr(tu, nu), pu = 0, hu = null, null !== uu) for (e = uu, uu = null, t = 0; t < e.length; t++) {
      var n = e[t];

      try {
        n._onComplete();
      } catch (e) {
        ou || (ou = !0, iu = e);
      }
    }
    if (ou) throw e = iu, iu = null, ou = !1, e;
  }

  function Br(e, t) {
    eu && o("253"), tu = e, nu = t, Wr(e, t, !1), Lr(1073741823, !1);
  }

  function Wr(e, t, n) {
    if (eu && o("245"), eu = !0, n) {
      var r = e.finishedWork;
      null !== r ? Vr(e, r, t) : (e.finishedWork = null, r = e.timeoutHandle, -1 !== r && (e.timeoutHandle = -1, Ta(r)), xr(e, n), null !== (r = e.finishedWork) && (Fr() ? e.finishedWork = r : Vr(e, r, t)));
    } else r = e.finishedWork, null !== r ? Vr(e, r, t) : (e.finishedWork = null, r = e.timeoutHandle, -1 !== r && (e.timeoutHandle = -1, Ta(r)), xr(e, n), null !== (r = e.finishedWork) && Vr(e, r, t));

    eu = !1;
  }

  function Vr(e, t, n) {
    var r = e.firstBatch;
    if (null !== r && r._expirationTime >= n && (null === uu ? uu = [r] : uu.push(r), r._defer)) return e.finishedWork = t, void (e.expirationTime = 0);
    e.finishedWork = null, e === hu ? pu++ : (hu = e, pu = 0), uo.unstable_runWithPriority(uo.unstable_ImmediatePriority, function () {
      gr(e, t);
    });
  }

  function Hr(e) {
    null === tu && o("246"), tu.expirationTime = 0, ou || (ou = !0, iu = e);
  }

  function $r(e, t) {
    var n = au;
    au = !0;

    try {
      return e(t);
    } finally {
      (au = n) || eu || Lr(1073741823, !1);
    }
  }

  function qr(e, t) {
    if (au && !lu) {
      lu = !0;

      try {
        return e(t);
      } finally {
        lu = !1;
      }
    }

    return e(t);
  }

  function Qr(e, t, n) {
    au || eu || 0 === ru || (Lr(ru, !1), ru = 0);
    var r = au;
    au = !0;

    try {
      return uo.unstable_runWithPriority(uo.unstable_UserBlockingPriority, function () {
        return e(t, n);
      });
    } finally {
      (au = r) || eu || Lr(1073741823, !1);
    }
  }

  function Yr(e, t, n, r, i) {
    var a = t.current;

    e: if (n) {
      n = n._reactInternalFiber;

      t: {
        2 === Oe(n) && 1 === n.tag || o("170");
        var l = n;

        do {
          switch (l.tag) {
            case 3:
              l = l.stateNode.context;
              break t;

            case 1:
              if (wt(l.type)) {
                l = l.stateNode.__reactInternalMemoizedMergedChildContext;
                break t;
              }

          }

          l = l["return"];
        } while (null !== l);

        o("171"), l = void 0;
      }

      if (1 === n.tag) {
        var u = n.type;

        if (wt(u)) {
          n = Tt(n, u, l);
          break e;
        }
      }

      n = l;
    } else n = Oa;

    return null === t.context ? t.context = n : t.pendingContext = n, t = i, i = Hn(r), i.payload = {
      element: e
    }, t = void 0 === t ? null : t, null !== t && (i.callback = t), br(), qn(a, i), Pr(a, r), r;
  }

  function Kr(e, t, n, r) {
    var o = t.current;
    return o = Tr(Ir(), o), Yr(e, t, n, o, r);
  }

  function Xr(e) {
    if (e = e.current, !e.child) return null;

    switch (e.child.tag) {
      case 5:
      default:
        return e.child.stateNode;
    }
  }

  function Gr(e, t, n) {
    var r = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
    return {
      $$typeof: ui,
      key: null == r ? null : "" + r,
      children: e,
      containerInfo: t,
      implementation: n
    };
  }

  function Jr(e) {
    var t = 1073741822 - 25 * (1 + ((1073741822 - Ir() + 500) / 25 | 0));
    t >= Al && (t = Al - 1), this._expirationTime = Al = t, this._root = e, this._callbacks = this._next = null, this._hasChildren = this._didComplete = !1, this._children = null, this._defer = !0;
  }

  function Zr() {
    this._callbacks = null, this._didCommit = !1, this._onCommit = this._onCommit.bind(this);
  }

  function eo(e, t, n) {
    t = Nt(3, null, null, t ? 3 : 0), e = {
      current: t,
      containerInfo: e,
      pendingChildren: null,
      pingCache: null,
      earliestPendingTime: 0,
      latestPendingTime: 0,
      earliestSuspendedTime: 0,
      latestSuspendedTime: 0,
      latestPingedTime: 0,
      didError: !1,
      pendingCommitExpirationTime: 0,
      finishedWork: null,
      timeoutHandle: -1,
      context: null,
      pendingContext: null,
      hydrate: n,
      nextExpirationTimeToWorkOn: 0,
      expirationTime: 0,
      firstBatch: null,
      nextScheduledRoot: null
    }, this._internalRoot = t.stateNode = e;
  }

  function to(e) {
    return !(!e || 1 !== e.nodeType && 9 !== e.nodeType && 11 !== e.nodeType && (8 !== e.nodeType || " react-mount-point-unstable " !== e.nodeValue));
  }

  function no(e, t) {
    if (t || (t = e ? 9 === e.nodeType ? e.documentElement : e.firstChild : null, t = !(!t || 1 !== t.nodeType || !t.hasAttribute("data-reactroot"))), !t) for (var n; n = e.lastChild;) {
      e.removeChild(n);
    }
    return new eo(e, !1, t);
  }

  function ro(e, t, n, r, o) {
    var i = n._reactRootContainer;

    if (i) {
      if ("function" === typeof o) {
        var a = o;

        o = function o() {
          var e = Xr(i._internalRoot);
          a.call(e);
        };
      }

      null != e ? i.legacy_renderSubtreeIntoContainer(e, t, o) : i.render(t, o);
    } else {
      if (i = n._reactRootContainer = no(n, r), "function" === typeof o) {
        var l = o;

        o = function o() {
          var e = Xr(i._internalRoot);
          l.call(e);
        };
      }

      qr(function () {
        null != e ? i.legacy_renderSubtreeIntoContainer(e, t, o) : i.render(t, o);
      });
    }

    return Xr(i._internalRoot);
  }

  function oo(e, t) {
    var n = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
    return to(t) || o("200"), Gr(e, t, null, n);
  }

  function io(e, t) {
    return to(e) || o("299", "unstable_createRoot"), new eo(e, !0, null != t && !0 === t.hydrate);
  }

  var ao = n(0),
      lo = n(1),
      uo = n(14);
  ao || o("227");
  var co = !1,
      so = null,
      fo = !1,
      po = null,
      ho = {
    onError: function onError(e) {
      co = !0, so = e;
    }
  },
      mo = null,
      yo = {},
      vo = [],
      bo = {},
      go = {},
      wo = {},
      ko = null,
      xo = null,
      _o = null,
      To = null,
      Eo = {
    injectEventPluginOrder: function injectEventPluginOrder(e) {
      mo && o("101"), mo = Array.prototype.slice.call(e), u();
    },
    injectEventPluginsByName: function injectEventPluginsByName(e) {
      var t,
          n = !1;

      for (t in e) {
        if (e.hasOwnProperty(t)) {
          var r = e[t];
          yo.hasOwnProperty(t) && yo[t] === r || (yo[t] && o("102", t), yo[t] = r, n = !0);
        }
      }

      n && u();
    }
  },
      Co = Math.random().toString(36).slice(2),
      So = "__reactInternalInstance$" + Co,
      Po = "__reactEventHandlers$" + Co,
      Oo = !("undefined" === typeof window || !window.document || !window.document.createElement),
      No = {
    animationend: C("Animation", "AnimationEnd"),
    animationiteration: C("Animation", "AnimationIteration"),
    animationstart: C("Animation", "AnimationStart"),
    transitionend: C("Transition", "TransitionEnd")
  },
      Do = {},
      jo = {};
  Oo && (jo = document.createElement("div").style, "AnimationEvent" in window || (delete No.animationend.animation, delete No.animationiteration.animation, delete No.animationstart.animation), "TransitionEvent" in window || delete No.transitionend.transition);
  var Mo = S("animationend"),
      Ro = S("animationiteration"),
      Io = S("animationstart"),
      Uo = S("transitionend"),
      Ao = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),
      Fo = null,
      zo = null,
      Lo = null;
  lo(D.prototype, {
    preventDefault: function preventDefault() {
      this.defaultPrevented = !0;
      var e = this.nativeEvent;
      e && (e.preventDefault ? e.preventDefault() : "unknown" !== typeof e.returnValue && (e.returnValue = !1), this.isDefaultPrevented = O);
    },
    stopPropagation: function stopPropagation() {
      var e = this.nativeEvent;
      e && (e.stopPropagation ? e.stopPropagation() : "unknown" !== typeof e.cancelBubble && (e.cancelBubble = !0), this.isPropagationStopped = O);
    },
    persist: function persist() {
      this.isPersistent = O;
    },
    isPersistent: N,
    destructor: function destructor() {
      var e,
          t = this.constructor.Interface;

      for (e in t) {
        this[e] = null;
      }

      this.nativeEvent = this._targetInst = this.dispatchConfig = null, this.isPropagationStopped = this.isDefaultPrevented = N, this._dispatchInstances = this._dispatchListeners = null;
    }
  }), D.Interface = {
    type: null,
    target: null,
    currentTarget: function currentTarget() {
      return null;
    },
    eventPhase: null,
    bubbles: null,
    cancelable: null,
    timeStamp: function timeStamp(e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: null,
    isTrusted: null
  }, D.extend = function (e) {
    function t() {}

    function n() {
      return r.apply(this, arguments);
    }

    var r = this;
    t.prototype = r.prototype;
    var o = new t();
    return lo(o, n.prototype), n.prototype = o, n.prototype.constructor = n, n.Interface = lo({}, r.Interface, e), n.extend = r.extend, R(n), n;
  }, R(D);
  var Bo = D.extend({
    data: null
  }),
      Wo = D.extend({
    data: null
  }),
      Vo = [9, 13, 27, 32],
      Ho = Oo && "CompositionEvent" in window,
      $o = null;
  Oo && "documentMode" in document && ($o = document.documentMode);
  var qo = Oo && "TextEvent" in window && !$o,
      Qo = Oo && (!Ho || $o && 8 < $o && 11 >= $o),
      Yo = String.fromCharCode(32),
      Ko = {
    beforeInput: {
      phasedRegistrationNames: {
        bubbled: "onBeforeInput",
        captured: "onBeforeInputCapture"
      },
      dependencies: ["compositionend", "keypress", "textInput", "paste"]
    },
    compositionEnd: {
      phasedRegistrationNames: {
        bubbled: "onCompositionEnd",
        captured: "onCompositionEndCapture"
      },
      dependencies: "blur compositionend keydown keypress keyup mousedown".split(" ")
    },
    compositionStart: {
      phasedRegistrationNames: {
        bubbled: "onCompositionStart",
        captured: "onCompositionStartCapture"
      },
      dependencies: "blur compositionstart keydown keypress keyup mousedown".split(" ")
    },
    compositionUpdate: {
      phasedRegistrationNames: {
        bubbled: "onCompositionUpdate",
        captured: "onCompositionUpdateCapture"
      },
      dependencies: "blur compositionupdate keydown keypress keyup mousedown".split(" ")
    }
  },
      Xo = !1,
      Go = !1,
      Jo = {
    eventTypes: Ko,
    extractEvents: function extractEvents(e, t, n, r) {
      var o = void 0,
          i = void 0;
      if (Ho) e: {
        switch (e) {
          case "compositionstart":
            o = Ko.compositionStart;
            break e;

          case "compositionend":
            o = Ko.compositionEnd;
            break e;

          case "compositionupdate":
            o = Ko.compositionUpdate;
            break e;
        }

        o = void 0;
      } else Go ? I(e, n) && (o = Ko.compositionEnd) : "keydown" === e && 229 === n.keyCode && (o = Ko.compositionStart);
      return o ? (Qo && "ko" !== n.locale && (Go || o !== Ko.compositionStart ? o === Ko.compositionEnd && Go && (i = P()) : (Fo = r, zo = "value" in Fo ? Fo.value : Fo.textContent, Go = !0)), o = Bo.getPooled(o, t, n, r), i ? o.data = i : null !== (i = U(n)) && (o.data = i), E(o), i = o) : i = null, (e = qo ? A(e, n) : F(e, n)) ? (t = Wo.getPooled(Ko.beforeInput, t, n, r), t.data = e, E(t)) : t = null, null === i ? t : null === t ? i : [i, t];
    }
  },
      Zo = null,
      ei = null,
      ti = null,
      ni = !1,
      ri = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0
  },
      oi = ao.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  oi.hasOwnProperty("ReactCurrentDispatcher") || (oi.ReactCurrentDispatcher = {
    current: null
  });
  var ii = /^(.*)[\\\/]/,
      ai = "function" === typeof Symbol && Symbol["for"],
      li = ai ? Symbol["for"]("react.element") : 60103,
      ui = ai ? Symbol["for"]("react.portal") : 60106,
      ci = ai ? Symbol["for"]("react.fragment") : 60107,
      si = ai ? Symbol["for"]("react.strict_mode") : 60108,
      fi = ai ? Symbol["for"]("react.profiler") : 60114,
      di = ai ? Symbol["for"]("react.provider") : 60109,
      pi = ai ? Symbol["for"]("react.context") : 60110,
      hi = ai ? Symbol["for"]("react.concurrent_mode") : 60111,
      mi = ai ? Symbol["for"]("react.forward_ref") : 60112,
      yi = ai ? Symbol["for"]("react.suspense") : 60113,
      vi = ai ? Symbol["for"]("react.memo") : 60115,
      bi = ai ? Symbol["for"]("react.lazy") : 60116,
      gi = "function" === typeof Symbol && Symbol.iterator,
      wi = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,
      ki = Object.prototype.hasOwnProperty,
      xi = {},
      _i = {},
      Ti = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function (e) {
    Ti[e] = new ie(e, 0, !1, e, null);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function (e) {
    var t = e[0];
    Ti[t] = new ie(t, 1, !1, e[1], null);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function (e) {
    Ti[e] = new ie(e, 2, !1, e.toLowerCase(), null);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function (e) {
    Ti[e] = new ie(e, 2, !1, e, null);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function (e) {
    Ti[e] = new ie(e, 3, !1, e.toLowerCase(), null);
  }), ["checked", "multiple", "muted", "selected"].forEach(function (e) {
    Ti[e] = new ie(e, 3, !0, e, null);
  }), ["capture", "download"].forEach(function (e) {
    Ti[e] = new ie(e, 4, !1, e, null);
  }), ["cols", "rows", "size", "span"].forEach(function (e) {
    Ti[e] = new ie(e, 6, !1, e, null);
  }), ["rowSpan", "start"].forEach(function (e) {
    Ti[e] = new ie(e, 5, !1, e.toLowerCase(), null);
  });
  var Ei = /[\-:]([a-z])/g;
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function (e) {
    var t = e.replace(Ei, ae);
    Ti[t] = new ie(t, 1, !1, e, null);
  }), "xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function (e) {
    var t = e.replace(Ei, ae);
    Ti[t] = new ie(t, 1, !1, e, "http://www.w3.org/1999/xlink");
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function (e) {
    var t = e.replace(Ei, ae);
    Ti[t] = new ie(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace");
  }), ["tabIndex", "crossOrigin"].forEach(function (e) {
    Ti[e] = new ie(e, 1, !1, e.toLowerCase(), null);
  });
  var Ci = {
    change: {
      phasedRegistrationNames: {
        bubbled: "onChange",
        captured: "onChangeCapture"
      },
      dependencies: "blur change click focus input keydown keyup selectionchange".split(" ")
    }
  },
      Si = null,
      Pi = null,
      Oi = !1;
  Oo && (Oi = Y("input") && (!document.documentMode || 9 < document.documentMode));
  var Ni = {
    eventTypes: Ci,
    _isInputEventSupported: Oi,
    extractEvents: function extractEvents(e, t, n, r) {
      var o = t ? b(t) : window,
          i = void 0,
          a = void 0,
          l = o.nodeName && o.nodeName.toLowerCase();
      if ("select" === l || "input" === l && "file" === o.type ? i = be : q(o) ? Oi ? i = Te : (i = xe, a = ke) : (l = o.nodeName) && "input" === l.toLowerCase() && ("checkbox" === o.type || "radio" === o.type) && (i = _e), i && (i = i(e, t))) return me(i, n, r);
      a && a(e, o, t), "blur" === e && (e = o._wrapperState) && e.controlled && "number" === o.type && he(o, "number", o.value);
    }
  },
      Di = D.extend({
    view: null,
    detail: null
  }),
      ji = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  },
      Mi = 0,
      Ri = 0,
      Ii = !1,
      Ui = !1,
      Ai = Di.extend({
    screenX: null,
    screenY: null,
    clientX: null,
    clientY: null,
    pageX: null,
    pageY: null,
    ctrlKey: null,
    shiftKey: null,
    altKey: null,
    metaKey: null,
    getModifierState: Ce,
    button: null,
    buttons: null,
    relatedTarget: function relatedTarget(e) {
      return e.relatedTarget || (e.fromElement === e.srcElement ? e.toElement : e.fromElement);
    },
    movementX: function movementX(e) {
      if ("movementX" in e) return e.movementX;
      var t = Mi;
      return Mi = e.screenX, Ii ? "mousemove" === e.type ? e.screenX - t : 0 : (Ii = !0, 0);
    },
    movementY: function movementY(e) {
      if ("movementY" in e) return e.movementY;
      var t = Ri;
      return Ri = e.screenY, Ui ? "mousemove" === e.type ? e.screenY - t : 0 : (Ui = !0, 0);
    }
  }),
      Fi = Ai.extend({
    pointerId: null,
    width: null,
    height: null,
    pressure: null,
    tangentialPressure: null,
    tiltX: null,
    tiltY: null,
    twist: null,
    pointerType: null,
    isPrimary: null
  }),
      zi = {
    mouseEnter: {
      registrationName: "onMouseEnter",
      dependencies: ["mouseout", "mouseover"]
    },
    mouseLeave: {
      registrationName: "onMouseLeave",
      dependencies: ["mouseout", "mouseover"]
    },
    pointerEnter: {
      registrationName: "onPointerEnter",
      dependencies: ["pointerout", "pointerover"]
    },
    pointerLeave: {
      registrationName: "onPointerLeave",
      dependencies: ["pointerout", "pointerover"]
    }
  },
      Li = {
    eventTypes: zi,
    extractEvents: function extractEvents(e, t, n, r) {
      var o = "mouseover" === e || "pointerover" === e,
          i = "mouseout" === e || "pointerout" === e;
      if (o && (n.relatedTarget || n.fromElement) || !i && !o) return null;
      if (o = r.window === r ? r : (o = r.ownerDocument) ? o.defaultView || o.parentWindow : window, i ? (i = t, t = (t = n.relatedTarget || n.toElement) ? y(t) : null) : i = null, i === t) return null;
      var a = void 0,
          l = void 0,
          u = void 0,
          c = void 0;
      "mouseout" === e || "mouseover" === e ? (a = Ai, l = zi.mouseLeave, u = zi.mouseEnter, c = "mouse") : "pointerout" !== e && "pointerover" !== e || (a = Fi, l = zi.pointerLeave, u = zi.pointerEnter, c = "pointer");
      var s = null == i ? o : b(i);
      if (o = null == t ? o : b(t), e = a.getPooled(l, i, n, r), e.type = c + "leave", e.target = s, e.relatedTarget = o, n = a.getPooled(u, t, n, r), n.type = c + "enter", n.target = o, n.relatedTarget = s, r = t, i && r) e: {
        for (t = i, o = r, c = 0, a = t; a; a = w(a)) {
          c++;
        }

        for (a = 0, u = o; u; u = w(u)) {
          a++;
        }

        for (; 0 < c - a;) {
          t = w(t), c--;
        }

        for (; 0 < a - c;) {
          o = w(o), a--;
        }

        for (; c--;) {
          if (t === o || t === o.alternate) break e;
          t = w(t), o = w(o);
        }

        t = null;
      } else t = null;

      for (o = t, t = []; i && i !== o && (null === (c = i.alternate) || c !== o);) {
        t.push(i), i = w(i);
      }

      for (i = []; r && r !== o && (null === (c = r.alternate) || c !== o);) {
        i.push(r), r = w(r);
      }

      for (r = 0; r < t.length; r++) {
        _(t[r], "bubbled", e);
      }

      for (r = i.length; 0 < r--;) {
        _(i[r], "captured", n);
      }

      return [e, n];
    }
  },
      Bi = Object.prototype.hasOwnProperty,
      Wi = D.extend({
    animationName: null,
    elapsedTime: null,
    pseudoElement: null
  }),
      Vi = D.extend({
    clipboardData: function clipboardData(e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    }
  }),
      Hi = Di.extend({
    relatedTarget: null
  }),
      $i = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  },
      qi = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  },
      Qi = Di.extend({
    key: function key(e) {
      if (e.key) {
        var t = $i[e.key] || e.key;
        if ("Unidentified" !== t) return t;
      }

      return "keypress" === e.type ? (e = Me(e), 13 === e ? "Enter" : String.fromCharCode(e)) : "keydown" === e.type || "keyup" === e.type ? qi[e.keyCode] || "Unidentified" : "";
    },
    location: null,
    ctrlKey: null,
    shiftKey: null,
    altKey: null,
    metaKey: null,
    repeat: null,
    locale: null,
    getModifierState: Ce,
    charCode: function charCode(e) {
      return "keypress" === e.type ? Me(e) : 0;
    },
    keyCode: function keyCode(e) {
      return "keydown" === e.type || "keyup" === e.type ? e.keyCode : 0;
    },
    which: function which(e) {
      return "keypress" === e.type ? Me(e) : "keydown" === e.type || "keyup" === e.type ? e.keyCode : 0;
    }
  }),
      Yi = Ai.extend({
    dataTransfer: null
  }),
      Ki = Di.extend({
    touches: null,
    targetTouches: null,
    changedTouches: null,
    altKey: null,
    metaKey: null,
    ctrlKey: null,
    shiftKey: null,
    getModifierState: Ce
  }),
      Xi = D.extend({
    propertyName: null,
    elapsedTime: null,
    pseudoElement: null
  }),
      Gi = Ai.extend({
    deltaX: function deltaX(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function deltaY(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: null,
    deltaMode: null
  }),
      Ji = [["abort", "abort"], [Mo, "animationEnd"], [Ro, "animationIteration"], [Io, "animationStart"], ["canplay", "canPlay"], ["canplaythrough", "canPlayThrough"], ["drag", "drag"], ["dragenter", "dragEnter"], ["dragexit", "dragExit"], ["dragleave", "dragLeave"], ["dragover", "dragOver"], ["durationchange", "durationChange"], ["emptied", "emptied"], ["encrypted", "encrypted"], ["ended", "ended"], ["error", "error"], ["gotpointercapture", "gotPointerCapture"], ["load", "load"], ["loadeddata", "loadedData"], ["loadedmetadata", "loadedMetadata"], ["loadstart", "loadStart"], ["lostpointercapture", "lostPointerCapture"], ["mousemove", "mouseMove"], ["mouseout", "mouseOut"], ["mouseover", "mouseOver"], ["playing", "playing"], ["pointermove", "pointerMove"], ["pointerout", "pointerOut"], ["pointerover", "pointerOver"], ["progress", "progress"], ["scroll", "scroll"], ["seeking", "seeking"], ["stalled", "stalled"], ["suspend", "suspend"], ["timeupdate", "timeUpdate"], ["toggle", "toggle"], ["touchmove", "touchMove"], [Uo, "transitionEnd"], ["waiting", "waiting"], ["wheel", "wheel"]],
      Zi = {},
      ea = {};
  [["blur", "blur"], ["cancel", "cancel"], ["click", "click"], ["close", "close"], ["contextmenu", "contextMenu"], ["copy", "copy"], ["cut", "cut"], ["auxclick", "auxClick"], ["dblclick", "doubleClick"], ["dragend", "dragEnd"], ["dragstart", "dragStart"], ["drop", "drop"], ["focus", "focus"], ["input", "input"], ["invalid", "invalid"], ["keydown", "keyDown"], ["keypress", "keyPress"], ["keyup", "keyUp"], ["mousedown", "mouseDown"], ["mouseup", "mouseUp"], ["paste", "paste"], ["pause", "pause"], ["play", "play"], ["pointercancel", "pointerCancel"], ["pointerdown", "pointerDown"], ["pointerup", "pointerUp"], ["ratechange", "rateChange"], ["reset", "reset"], ["seeked", "seeked"], ["submit", "submit"], ["touchcancel", "touchCancel"], ["touchend", "touchEnd"], ["touchstart", "touchStart"], ["volumechange", "volumeChange"]].forEach(function (e) {
    Re(e, !0);
  }), Ji.forEach(function (e) {
    Re(e, !1);
  });
  var ta = {
    eventTypes: Zi,
    isInteractiveTopLevelEventType: function isInteractiveTopLevelEventType(e) {
      return void 0 !== (e = ea[e]) && !0 === e.isInteractive;
    },
    extractEvents: function extractEvents(e, t, n, r) {
      var o = ea[e];
      if (!o) return null;

      switch (e) {
        case "keypress":
          if (0 === Me(n)) return null;

        case "keydown":
        case "keyup":
          e = Qi;
          break;

        case "blur":
        case "focus":
          e = Hi;
          break;

        case "click":
          if (2 === n.button) return null;

        case "auxclick":
        case "dblclick":
        case "mousedown":
        case "mousemove":
        case "mouseup":
        case "mouseout":
        case "mouseover":
        case "contextmenu":
          e = Ai;
          break;

        case "drag":
        case "dragend":
        case "dragenter":
        case "dragexit":
        case "dragleave":
        case "dragover":
        case "dragstart":
        case "drop":
          e = Yi;
          break;

        case "touchcancel":
        case "touchend":
        case "touchmove":
        case "touchstart":
          e = Ki;
          break;

        case Mo:
        case Ro:
        case Io:
          e = Wi;
          break;

        case Uo:
          e = Xi;
          break;

        case "scroll":
          e = Di;
          break;

        case "wheel":
          e = Gi;
          break;

        case "copy":
        case "cut":
        case "paste":
          e = Vi;
          break;

        case "gotpointercapture":
        case "lostpointercapture":
        case "pointercancel":
        case "pointerdown":
        case "pointermove":
        case "pointerout":
        case "pointerover":
        case "pointerup":
          e = Fi;
          break;

        default:
          e = D;
      }

      return t = e.getPooled(o, t, n, r), E(t), t;
    }
  },
      na = ta.isInteractiveTopLevelEventType,
      ra = [],
      oa = !0,
      ia = {},
      aa = 0,
      la = "_reactListenersID" + ("" + Math.random()).slice(2),
      ua = Oo && "documentMode" in document && 11 >= document.documentMode,
      ca = {
    select: {
      phasedRegistrationNames: {
        bubbled: "onSelect",
        captured: "onSelectCapture"
      },
      dependencies: "blur contextmenu dragend focus keydown keyup mousedown mouseup selectionchange".split(" ")
    }
  },
      sa = null,
      fa = null,
      da = null,
      pa = !1,
      ha = {
    eventTypes: ca,
    extractEvents: function extractEvents(e, t, n, r) {
      var o,
          i = r.window === r ? r.document : 9 === r.nodeType ? r : r.ownerDocument;

      if (!(o = !i)) {
        e: {
          i = Le(i), o = wo.onSelect;

          for (var a = 0; a < o.length; a++) {
            var l = o[a];

            if (!i.hasOwnProperty(l) || !i[l]) {
              i = !1;
              break e;
            }
          }

          i = !0;
        }

        o = !i;
      }

      if (o) return null;

      switch (i = t ? b(t) : window, e) {
        case "focus":
          (q(i) || "true" === i.contentEditable) && (sa = i, fa = t, da = null);
          break;

        case "blur":
          da = fa = sa = null;
          break;

        case "mousedown":
          pa = !0;
          break;

        case "contextmenu":
        case "mouseup":
        case "dragend":
          return pa = !1, Ke(n, r);

        case "selectionchange":
          if (ua) break;

        case "keydown":
        case "keyup":
          return Ke(n, r);
      }

      return null;
    }
  };
  Eo.injectEventPluginOrder("ResponderEventPlugin SimpleEventPlugin EnterLeaveEventPlugin ChangeEventPlugin SelectEventPlugin BeforeInputEventPlugin".split(" ")), ko = g, xo = v, _o = b, Eo.injectEventPluginsByName({
    SimpleEventPlugin: ta,
    EnterLeaveEventPlugin: Li,
    ChangeEventPlugin: Ni,
    SelectEventPlugin: ha,
    BeforeInputEventPlugin: Jo
  });

  var ma = {
    html: "http://www.w3.org/1999/xhtml",
    mathml: "http://www.w3.org/1998/Math/MathML",
    svg: "http://www.w3.org/2000/svg"
  },
      ya = void 0,
      va = function (e) {
    return "undefined" !== typeof MSApp && MSApp.execUnsafeLocalFunction ? function (t, n, r, o) {
      MSApp.execUnsafeLocalFunction(function () {
        return e(t, n);
      });
    } : e;
  }(function (e, t) {
    if (e.namespaceURI !== ma.svg || "innerHTML" in e) e.innerHTML = t;else {
      for (ya = ya || document.createElement("div"), ya.innerHTML = "<svg>" + t + "</svg>", t = ya.firstChild; e.firstChild;) {
        e.removeChild(e.firstChild);
      }

      for (; t.firstChild;) {
        e.appendChild(t.firstChild);
      }
    }
  }),
      ba = {
    animationIterationCount: !0,
    borderImageOutset: !0,
    borderImageSlice: !0,
    borderImageWidth: !0,
    boxFlex: !0,
    boxFlexGroup: !0,
    boxOrdinalGroup: !0,
    columnCount: !0,
    columns: !0,
    flex: !0,
    flexGrow: !0,
    flexPositive: !0,
    flexShrink: !0,
    flexNegative: !0,
    flexOrder: !0,
    gridArea: !0,
    gridRow: !0,
    gridRowEnd: !0,
    gridRowSpan: !0,
    gridRowStart: !0,
    gridColumn: !0,
    gridColumnEnd: !0,
    gridColumnSpan: !0,
    gridColumnStart: !0,
    fontWeight: !0,
    lineClamp: !0,
    lineHeight: !0,
    opacity: !0,
    order: !0,
    orphans: !0,
    tabSize: !0,
    widows: !0,
    zIndex: !0,
    zoom: !0,
    fillOpacity: !0,
    floodOpacity: !0,
    stopOpacity: !0,
    strokeDasharray: !0,
    strokeDashoffset: !0,
    strokeMiterlimit: !0,
    strokeOpacity: !0,
    strokeWidth: !0
  },
      ga = ["Webkit", "ms", "Moz", "O"];

  Object.keys(ba).forEach(function (e) {
    ga.forEach(function (t) {
      t = t + e.charAt(0).toUpperCase() + e.substring(1), ba[t] = ba[e];
    });
  });

  var wa = lo({
    menuitem: !0
  }, {
    area: !0,
    base: !0,
    br: !0,
    col: !0,
    embed: !0,
    hr: !0,
    img: !0,
    input: !0,
    keygen: !0,
    link: !0,
    meta: !0,
    param: !0,
    source: !0,
    track: !0,
    wbr: !0
  }),
      ka = null,
      xa = null,
      _a = "function" === typeof setTimeout ? setTimeout : void 0,
      Ta = "function" === typeof clearTimeout ? clearTimeout : void 0,
      Ea = uo.unstable_scheduleCallback,
      Ca = uo.unstable_cancelCallback;

  new Set();
  var Sa = [],
      Pa = -1,
      Oa = {},
      Na = {
    current: Oa
  },
      Da = {
    current: !1
  },
      ja = Oa,
      Ma = null,
      Ra = null,
      Ia = new ao.Component().refs,
      Ua = {
    isMounted: function isMounted(e) {
      return !!(e = e._reactInternalFiber) && 2 === Oe(e);
    },
    enqueueSetState: function enqueueSetState(e, t, n) {
      e = e._reactInternalFiber;
      var r = Ir();
      r = Tr(r, e);
      var o = Hn(r);
      o.payload = t, void 0 !== n && null !== n && (o.callback = n), br(), qn(e, o), Pr(e, r);
    },
    enqueueReplaceState: function enqueueReplaceState(e, t, n) {
      e = e._reactInternalFiber;
      var r = Ir();
      r = Tr(r, e);
      var o = Hn(r);
      o.tag = El, o.payload = t, void 0 !== n && null !== n && (o.callback = n), br(), qn(e, o), Pr(e, r);
    },
    enqueueForceUpdate: function enqueueForceUpdate(e, t) {
      e = e._reactInternalFiber;
      var n = Ir();
      n = Tr(n, e);
      var r = Hn(n);
      r.tag = Cl, void 0 !== t && null !== t && (r.callback = t), br(), qn(e, r), Pr(e, n);
    }
  },
      Aa = Array.isArray,
      Fa = Zt(!0),
      za = Zt(!1),
      La = {},
      Ba = {
    current: La
  },
      Wa = {
    current: La
  },
      Va = {
    current: La
  },
      Ha = 0,
      $a = 2,
      qa = 4,
      Qa = 8,
      Ya = 16,
      Ka = 32,
      Xa = 64,
      Ga = 128,
      Ja = oi.ReactCurrentDispatcher,
      Za = 0,
      el = null,
      tl = null,
      nl = null,
      rl = null,
      ol = null,
      il = null,
      al = 0,
      ll = null,
      ul = 0,
      cl = !1,
      sl = null,
      fl = 0,
      dl = {
    readContext: Bn,
    useCallback: an,
    useContext: an,
    useEffect: an,
    useImperativeHandle: an,
    useLayoutEffect: an,
    useMemo: an,
    useReducer: an,
    useRef: an,
    useState: an,
    useDebugValue: an
  },
      pl = {
    readContext: Bn,
    useCallback: function useCallback(e, t) {
      return sn().memoizedState = [e, void 0 === t ? null : t], e;
    },
    useContext: Bn,
    useEffect: function useEffect(e, t) {
      return mn(516, Ga | Xa, e, t);
    },
    useImperativeHandle: function useImperativeHandle(e, t, n) {
      return n = null !== n && void 0 !== n ? n.concat([e]) : null, mn(4, qa | Ka, vn.bind(null, t, e), n);
    },
    useLayoutEffect: function useLayoutEffect(e, t) {
      return mn(4, qa | Ka, e, t);
    },
    useMemo: function useMemo(e, t) {
      var n = sn();
      return t = void 0 === t ? null : t, e = e(), n.memoizedState = [e, t], e;
    },
    useReducer: function useReducer(e, t, n) {
      var r = sn();
      return t = void 0 !== n ? n(t) : t, r.memoizedState = r.baseState = t, e = r.queue = {
        last: null,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: t
      }, e = e.dispatch = gn.bind(null, el, e), [r.memoizedState, e];
    },
    useRef: function useRef(e) {
      var t = sn();
      return e = {
        current: e
      }, t.memoizedState = e;
    },
    useState: function useState(e) {
      var t = sn();
      return "function" === typeof e && (e = e()), t.memoizedState = t.baseState = e, e = t.queue = {
        last: null,
        dispatch: null,
        lastRenderedReducer: dn,
        lastRenderedState: e
      }, e = e.dispatch = gn.bind(null, el, e), [t.memoizedState, e];
    },
    useDebugValue: bn
  },
      hl = {
    readContext: Bn,
    useCallback: function useCallback(e, t) {
      var n = fn();
      t = void 0 === t ? null : t;
      var r = n.memoizedState;
      return null !== r && null !== t && ln(t, r[1]) ? r[0] : (n.memoizedState = [e, t], e);
    },
    useContext: Bn,
    useEffect: function useEffect(e, t) {
      return yn(516, Ga | Xa, e, t);
    },
    useImperativeHandle: function useImperativeHandle(e, t, n) {
      return n = null !== n && void 0 !== n ? n.concat([e]) : null, yn(4, qa | Ka, vn.bind(null, t, e), n);
    },
    useLayoutEffect: function useLayoutEffect(e, t) {
      return yn(4, qa | Ka, e, t);
    },
    useMemo: function useMemo(e, t) {
      var n = fn();
      t = void 0 === t ? null : t;
      var r = n.memoizedState;
      return null !== r && null !== t && ln(t, r[1]) ? r[0] : (e = e(), n.memoizedState = [e, t], e);
    },
    useReducer: pn,
    useRef: function useRef() {
      return fn().memoizedState;
    },
    useState: function useState(e) {
      return pn(dn);
    },
    useDebugValue: bn
  },
      ml = null,
      yl = null,
      vl = !1,
      bl = oi.ReactCurrentOwner,
      gl = !1,
      wl = {
    current: null
  },
      kl = null,
      xl = null,
      _l = null,
      Tl = 0,
      El = 1,
      Cl = 2,
      Sl = 3,
      Pl = !1,
      Ol = void 0,
      Nl = void 0,
      Dl = void 0,
      jl = void 0;
  Ol = function Ol(e, t) {
    for (var n = t.child; null !== n;) {
      if (5 === n.tag || 6 === n.tag) e.appendChild(n.stateNode);else if (4 !== n.tag && null !== n.child) {
        n.child["return"] = n, n = n.child;
        continue;
      }
      if (n === t) break;

      for (; null === n.sibling;) {
        if (null === n["return"] || n["return"] === t) return;
        n = n["return"];
      }

      n.sibling["return"] = n["return"], n = n.sibling;
    }
  }, Nl = function Nl() {}, Dl = function Dl(e, t, n, r, o) {
    var i = e.memoizedProps;

    if (i !== r) {
      var a = t.stateNode;

      switch (en(Ba.current), e = null, n) {
        case "input":
          i = ce(a, i), r = ce(a, r), e = [];
          break;

        case "option":
          i = Ge(a, i), r = Ge(a, r), e = [];
          break;

        case "select":
          i = lo({}, i, {
            value: void 0
          }), r = lo({}, r, {
            value: void 0
          }), e = [];
          break;

        case "textarea":
          i = Ze(a, i), r = Ze(a, r), e = [];
          break;

        default:
          "function" !== typeof i.onClick && "function" === typeof r.onClick && (a.onclick = ft);
      }

      ut(n, r), a = n = void 0;
      var l = null;

      for (n in i) {
        if (!r.hasOwnProperty(n) && i.hasOwnProperty(n) && null != i[n]) if ("style" === n) {
          var u = i[n];

          for (a in u) {
            u.hasOwnProperty(a) && (l || (l = {}), l[a] = "");
          }
        } else "dangerouslySetInnerHTML" !== n && "children" !== n && "suppressContentEditableWarning" !== n && "suppressHydrationWarning" !== n && "autoFocus" !== n && (go.hasOwnProperty(n) ? e || (e = []) : (e = e || []).push(n, null));
      }

      for (n in r) {
        var c = r[n];
        if (u = null != i ? i[n] : void 0, r.hasOwnProperty(n) && c !== u && (null != c || null != u)) if ("style" === n) {
          if (u) {
            for (a in u) {
              !u.hasOwnProperty(a) || c && c.hasOwnProperty(a) || (l || (l = {}), l[a] = "");
            }

            for (a in c) {
              c.hasOwnProperty(a) && u[a] !== c[a] && (l || (l = {}), l[a] = c[a]);
            }
          } else l || (e || (e = []), e.push(n, l)), l = c;
        } else "dangerouslySetInnerHTML" === n ? (c = c ? c.__html : void 0, u = u ? u.__html : void 0, null != c && u !== c && (e = e || []).push(n, "" + c)) : "children" === n ? u === c || "string" !== typeof c && "number" !== typeof c || (e = e || []).push(n, "" + c) : "suppressContentEditableWarning" !== n && "suppressHydrationWarning" !== n && (go.hasOwnProperty(n) ? (null != c && st(o, n), e || u === c || (e = [])) : (e = e || []).push(n, c));
      }

      l && (e = e || []).push("style", l), o = e, (t.updateQueue = o) && er(t);
    }
  }, jl = function jl(e, t, n, r) {
    n !== r && er(t);
  };
  var Ml = "function" === typeof WeakSet ? WeakSet : Set,
      Rl = "function" === typeof WeakMap ? WeakMap : Map,
      Il = oi.ReactCurrentDispatcher,
      Ul = oi.ReactCurrentOwner,
      Al = 1073741822,
      Fl = !1,
      zl = null,
      Ll = null,
      Bl = 0,
      Wl = -1,
      Vl = !1,
      Hl = null,
      $l = !1,
      ql = null,
      Ql = null,
      Yl = null,
      Kl = null,
      Xl = null,
      Gl = null,
      Jl = 0,
      Zl = void 0,
      eu = !1,
      tu = null,
      nu = 0,
      ru = 0,
      ou = !1,
      iu = null,
      au = !1,
      lu = !1,
      uu = null,
      cu = uo.unstable_now(),
      su = 1073741822 - (cu / 10 | 0),
      fu = su,
      du = 50,
      pu = 0,
      hu = null,
      mu = !1;
  Zo = function Zo(e, t, n) {
    switch (t) {
      case "input":
        if (de(e, n), t = n.name, "radio" === n.type && null != t) {
          for (n = e; n.parentNode;) {
            n = n.parentNode;
          }

          for (n = n.querySelectorAll("input[name=" + JSON.stringify("" + t) + '][type="radio"]'), t = 0; t < n.length; t++) {
            var r = n[t];

            if (r !== e && r.form === e.form) {
              var i = g(r);
              i || o("90"), J(r), de(r, i);
            }
          }
        }

        break;

      case "textarea":
        tt(e, n);
        break;

      case "select":
        null != (t = n.value) && Je(e, !!n.multiple, t, !1);
    }
  }, Jr.prototype.render = function (e) {
    this._defer || o("250"), this._hasChildren = !0, this._children = e;
    var t = this._root._internalRoot,
        n = this._expirationTime,
        r = new Zr();
    return Yr(e, t, null, n, r._onCommit), r;
  }, Jr.prototype.then = function (e) {
    if (this._didComplete) e();else {
      var t = this._callbacks;
      null === t && (t = this._callbacks = []), t.push(e);
    }
  }, Jr.prototype.commit = function () {
    var e = this._root._internalRoot,
        t = e.firstBatch;

    if (this._defer && null !== t || o("251"), this._hasChildren) {
      var n = this._expirationTime;

      if (t !== this) {
        this._hasChildren && (n = this._expirationTime = t._expirationTime, this.render(this._children));

        for (var r = null, i = t; i !== this;) {
          r = i, i = i._next;
        }

        null === r && o("251"), r._next = i._next, this._next = t, e.firstBatch = this;
      }

      this._defer = !1, Br(e, n), t = this._next, this._next = null, t = e.firstBatch = t, null !== t && t._hasChildren && t.render(t._children);
    } else this._next = null, this._defer = !1;
  }, Jr.prototype._onComplete = function () {
    if (!this._didComplete) {
      this._didComplete = !0;
      var e = this._callbacks;
      if (null !== e) for (var t = 0; t < e.length; t++) {
        (0, e[t])();
      }
    }
  }, Zr.prototype.then = function (e) {
    if (this._didCommit) e();else {
      var t = this._callbacks;
      null === t && (t = this._callbacks = []), t.push(e);
    }
  }, Zr.prototype._onCommit = function () {
    if (!this._didCommit) {
      this._didCommit = !0;
      var e = this._callbacks;
      if (null !== e) for (var t = 0; t < e.length; t++) {
        var n = e[t];
        "function" !== typeof n && o("191", n), n();
      }
    }
  }, eo.prototype.render = function (e, t) {
    var n = this._internalRoot,
        r = new Zr();
    return t = void 0 === t ? null : t, null !== t && r.then(t), Kr(e, n, null, r._onCommit), r;
  }, eo.prototype.unmount = function (e) {
    var t = this._internalRoot,
        n = new Zr();
    return e = void 0 === e ? null : e, null !== e && n.then(e), Kr(null, t, null, n._onCommit), n;
  }, eo.prototype.legacy_renderSubtreeIntoContainer = function (e, t, n) {
    var r = this._internalRoot,
        o = new Zr();
    return n = void 0 === n ? null : n, null !== n && o.then(n), Kr(t, r, e, o._onCommit), o;
  }, eo.prototype.createBatch = function () {
    var e = new Jr(this),
        t = e._expirationTime,
        n = this._internalRoot,
        r = n.firstBatch;
    if (null === r) n.firstBatch = e, e._next = null;else {
      for (n = null; null !== r && r._expirationTime >= t;) {
        n = r, r = r._next;
      }

      e._next = r, null !== n && (n._next = e);
    }
    return e;
  }, W = $r, V = Qr, H = function H() {
    eu || 0 === ru || (Lr(ru, !1), ru = 0);
  };
  var yu = {
    createPortal: oo,
    findDOMNode: function findDOMNode(e) {
      if (null == e) return null;
      if (1 === e.nodeType) return e;
      var t = e._reactInternalFiber;
      return void 0 === t && ("function" === typeof e.render ? o("188") : o("268", Object.keys(e))), e = je(t), e = null === e ? null : e.stateNode;
    },
    hydrate: function hydrate(e, t, n) {
      return to(t) || o("200"), ro(null, e, t, !0, n);
    },
    render: function render(e, t, n) {
      return to(t) || o("200"), ro(null, e, t, !1, n);
    },
    unstable_renderSubtreeIntoContainer: function unstable_renderSubtreeIntoContainer(e, t, n, r) {
      return to(n) || o("200"), (null == e || void 0 === e._reactInternalFiber) && o("38"), ro(e, t, n, !1, r);
    },
    unmountComponentAtNode: function unmountComponentAtNode(e) {
      return to(e) || o("40"), !!e._reactRootContainer && (qr(function () {
        ro(null, null, e, !1, function () {
          e._reactRootContainer = null;
        });
      }), !0);
    },
    unstable_createPortal: function unstable_createPortal() {
      return oo.apply(void 0, arguments);
    },
    unstable_batchedUpdates: $r,
    unstable_interactiveUpdates: Qr,
    flushSync: function flushSync(e, t) {
      eu && o("187");
      var n = au;
      au = !0;

      try {
        return Or(e, t);
      } finally {
        au = n, Lr(1073741823, !1);
      }
    },
    unstable_createRoot: io,
    unstable_flushControlled: function unstable_flushControlled(e) {
      var t = au;
      au = !0;

      try {
        Or(e);
      } finally {
        (au = t) || eu || Lr(1073741823, !1);
      }
    },
    __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: {
      Events: [v, b, g, Eo.injectEventPluginsByName, bo, E, function (e) {
        d(e, T);
      }, L, B, ze, m]
    }
  };
  !function (e) {
    var t = e.findFiberByHostInstance;
    Pt(lo({}, e, {
      overrideProps: null,
      currentDispatcherRef: oi.ReactCurrentDispatcher,
      findHostInstanceByFiber: function findHostInstanceByFiber(e) {
        return e = je(e), null === e ? null : e.stateNode;
      },
      findFiberByHostInstance: function findFiberByHostInstance(e) {
        return t ? t(e) : null;
      }
    }));
  }({
    findFiberByHostInstance: y,
    bundleType: 0,
    version: "16.8.6",
    rendererPackageName: "react-dom"
  });
  var vu = {
    "default": yu
  },
      bu = vu && yu || vu;
  e.exports = bu["default"] || bu;
}, function (e, t, n) {
  "use strict";

  e.exports = n(15);
}, function (e, t, n) {
  "use strict";

  (function (e) {
    function n() {
      if (!h) {
        var e = c.expirationTime;
        m ? _() : m = !0, _x(i, e);
      }
    }

    function r() {
      var e = c,
          t = c.next;
      if (c === t) c = null;else {
        var r = c.previous;
        c = r.next = t, t.previous = r;
      }
      e.next = e.previous = null, r = e.callback, t = e.expirationTime, e = e.priorityLevel;
      var o = f,
          i = p;
      f = e, p = t;

      try {
        var a = r();
      } finally {
        f = o, p = i;
      }

      if ("function" === typeof a) if (a = {
        callback: a,
        priorityLevel: e,
        expirationTime: t,
        next: null,
        previous: null
      }, null === c) c = a.next = a.previous = a;else {
        r = null, e = c;

        do {
          if (e.expirationTime >= t) {
            r = e;
            break;
          }

          e = e.next;
        } while (e !== c);

        null === r ? r = c : r === c && (c = a, n()), t = r.previous, t.next = r.previous = a, a.next = r, a.previous = t;
      }
    }

    function o() {
      if (-1 === d && null !== c && 1 === c.priorityLevel) {
        h = !0;

        try {
          do {
            r();
          } while (null !== c && 1 === c.priorityLevel);
        } finally {
          h = !1, null !== c ? n() : m = !1;
        }
      }
    }

    function i(e) {
      h = !0;
      var i = s;
      s = e;

      try {
        if (e) for (; null !== c;) {
          var a = t.unstable_now();
          if (!(c.expirationTime <= a)) break;

          do {
            r();
          } while (null !== c && c.expirationTime <= a);
        } else if (null !== c) do {
          r();
        } while (null !== c && !T());
      } finally {
        h = !1, s = i, null !== c ? n() : m = !1, o();
      }
    }

    function a(e) {
      l = g(function (t) {
        b(u), e(t);
      }), u = v(function () {
        w(l), e(t.unstable_now());
      }, 100);
    }

    Object.defineProperty(t, "__esModule", {
      value: !0
    });
    var l,
        u,
        c = null,
        s = !1,
        f = 3,
        d = -1,
        p = -1,
        h = !1,
        m = !1,
        y = Date,
        v = "function" === typeof setTimeout ? setTimeout : void 0,
        b = "function" === typeof clearTimeout ? clearTimeout : void 0,
        g = "function" === typeof requestAnimationFrame ? requestAnimationFrame : void 0,
        w = "function" === typeof cancelAnimationFrame ? cancelAnimationFrame : void 0;

    if ("object" === (typeof performance === "undefined" ? "undefined" : _typeof(performance)) && "function" === typeof performance.now) {
      var k = performance;

      t.unstable_now = function () {
        return k.now();
      };
    } else t.unstable_now = function () {
      return y.now();
    };

    var _x,
        _,
        T,
        E = null;

    if ("undefined" !== typeof window ? E = window : "undefined" !== typeof e && (E = e), E && E._schedMock) {
      var C = E._schedMock;
      _x = C[0], _ = C[1], T = C[2], t.unstable_now = C[3];
    } else if ("undefined" === typeof window || "function" !== typeof MessageChannel) {
      var S = null,
          P = function P(e) {
        if (null !== S) try {
          S(e);
        } finally {
          S = null;
        }
      };

      _x = function x(e) {
        null !== S ? setTimeout(_x, 0, e) : (S = e, setTimeout(P, 0, !1));
      }, _ = function _() {
        S = null;
      }, T = function T() {
        return !1;
      };
    } else {
      "undefined" !== typeof console && ("function" !== typeof g && console.error("This browser doesn't support requestAnimationFrame. Make sure that you load a polyfill in older browsers. https://fb.me/react-polyfills"), "function" !== typeof w && console.error("This browser doesn't support cancelAnimationFrame. Make sure that you load a polyfill in older browsers. https://fb.me/react-polyfills"));
      var O = null,
          N = !1,
          D = -1,
          j = !1,
          M = !1,
          R = 0,
          I = 33,
          U = 33;

      T = function T() {
        return R <= t.unstable_now();
      };

      var A = new MessageChannel(),
          F = A.port2;

      A.port1.onmessage = function () {
        N = !1;
        var e = O,
            n = D;
        O = null, D = -1;
        var r = t.unstable_now(),
            o = !1;

        if (0 >= R - r) {
          if (!(-1 !== n && n <= r)) return j || (j = !0, a(z)), O = e, void (D = n);
          o = !0;
        }

        if (null !== e) {
          M = !0;

          try {
            e(o);
          } finally {
            M = !1;
          }
        }
      };

      var z = function z(e) {
        if (null !== O) {
          a(z);
          var t = e - R + U;
          t < U && I < U ? (8 > t && (t = 8), U = t < I ? I : t) : I = t, R = e + U, N || (N = !0, F.postMessage(void 0));
        } else j = !1;
      };

      _x = function _x(e, t) {
        O = e, D = t, M || 0 > t ? F.postMessage(void 0) : j || (j = !0, a(z));
      }, _ = function _() {
        O = null, N = !1, D = -1;
      };
    }

    t.unstable_ImmediatePriority = 1, t.unstable_UserBlockingPriority = 2, t.unstable_NormalPriority = 3, t.unstable_IdlePriority = 5, t.unstable_LowPriority = 4, t.unstable_runWithPriority = function (e, n) {
      switch (e) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;

        default:
          e = 3;
      }

      var r = f,
          i = d;
      f = e, d = t.unstable_now();

      try {
        return n();
      } finally {
        f = r, d = i, o();
      }
    }, t.unstable_next = function (e) {
      switch (f) {
        case 1:
        case 2:
        case 3:
          var n = 3;
          break;

        default:
          n = f;
      }

      var r = f,
          i = d;
      f = n, d = t.unstable_now();

      try {
        return e();
      } finally {
        f = r, d = i, o();
      }
    }, t.unstable_scheduleCallback = function (e, r) {
      var o = -1 !== d ? d : t.unstable_now();
      if ("object" === _typeof(r) && null !== r && "number" === typeof r.timeout) r = o + r.timeout;else switch (f) {
        case 1:
          r = o + -1;
          break;

        case 2:
          r = o + 250;
          break;

        case 5:
          r = o + 1073741823;
          break;

        case 4:
          r = o + 1e4;
          break;

        default:
          r = o + 5e3;
      }
      if (e = {
        callback: e,
        priorityLevel: f,
        expirationTime: r,
        next: null,
        previous: null
      }, null === c) c = e.next = e.previous = e, n();else {
        o = null;
        var i = c;

        do {
          if (i.expirationTime > r) {
            o = i;
            break;
          }

          i = i.next;
        } while (i !== c);

        null === o ? o = c : o === c && (c = e, n()), r = o.previous, r.next = o.previous = e, e.next = o, e.previous = r;
      }
      return e;
    }, t.unstable_cancelCallback = function (e) {
      var t = e.next;

      if (null !== t) {
        if (t === e) c = null;else {
          e === c && (c = t);
          var n = e.previous;
          n.next = t, t.previous = n;
        }
        e.next = e.previous = null;
      }
    }, t.unstable_wrapCallback = function (e) {
      var n = f;
      return function () {
        var r = f,
            i = d;
        f = n, d = t.unstable_now();

        try {
          return e.apply(this, arguments);
        } finally {
          f = r, d = i, o();
        }
      };
    }, t.unstable_getCurrentPriorityLevel = function () {
      return f;
    }, t.unstable_shouldYield = function () {
      return !s && (null !== c && c.expirationTime < p || T());
    }, t.unstable_continueExecution = function () {
      null !== c && n();
    }, t.unstable_pauseExecution = function () {}, t.unstable_getFirstCallbackNode = function () {
      return c;
    };
  }).call(t, n(3));
}, function (e, t, n) {
  "use strict";

  function r(e) {
    if (Array.isArray(e)) {
      for (var t = 0, n = Array(e.length); t < e.length; t++) {
        n[t] = e[t];
      }

      return n;
    }

    return Array.from(e);
  }

  function o(e, t, n) {
    return t in e ? Object.defineProperty(e, t, {
      value: n,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }) : e[t] = n, e;
  }

  function i(e, t) {
    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
  }

  function a(e, t) {
    if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return !t || "object" !== _typeof(t) && "function" !== typeof t ? e : t;
  }

  function l(e, t) {
    if ("function" !== typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + _typeof(t));
    e.prototype = Object.create(t && t.prototype, {
      constructor: {
        value: e,
        enumerable: !1,
        writable: !0,
        configurable: !0
      }
    }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t);
  }

  var u = n(0),
      c = n.n(u),
      s = n(17),
      f = (n.n(s), function () {
    function e(e, t) {
      for (var n = 0; n < t.length; n++) {
        var r = t[n];
        r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
      }
    }

    return function (t, n, r) {
      return n && e(t.prototype, n), r && e(t, r), t;
    };
  }()),
      d = function (e) {
    function t(e) {
      i(this, t);
      var n = a(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
      n.groupedDictionaryForEach = function (e, t) {
        Object.keys(e).forEach(function (n, r) {
          var o = e[n];
          Array.isArray(o) && t(o, n);
        });
      }, n.groupedDictionaryCast = function (e, t) {
        var n = {};
        return e.forEach(function (e, r) {
          return n = Object.assign({}, n, t(e, r));
        }), n;
      }, n.dateFormatToYYYY_MM_DD = function (e) {
        var t = "" + (e.getMonth() + 1),
            n = "" + e.getDate(),
            r = e.getFullYear();
        return t.length < 2 && (t = "0" + t), n.length < 2 && (n = "0" + n), [r, t, n].join("-");
      }, n.dateFormatToDD_MM_YY = function (e) {
        var t = "" + (e.getMonth() + 1),
            n = "" + e.getDate(),
            r = e.getFullYear();
        return t.length < 2 && (t = "0" + t), n.length < 2 && (n = "0" + n), [n, t, r - 2e3].join("/");
      }, n.arrayGroupBy = function (e, t) {
        var r = {};
        return e.forEach(function (e) {
          var n = t(e);
          r[n] || (r[n] = []), r[n].push(e);
        }), r.forEach || (r.forEach = function (e) {
          return n.groupedDictionaryForEach(r, e);
        }), r.cast || (r.cast = function (e) {
          return n.groupedDictionaryCast(r, e);
        }), r.keys || (r.keys = function () {
          return Object.keys(r).filter(function (e) {
            return Array.isArray(r[e]);
          });
        }), r;
      }, n.arrayDistinct = function (e) {
        return e.filter(function (e, t, n) {
          return n.indexOf(e) === t;
        });
      }, n.handleFilterChange = function (e) {
        e ? n.setState({
          search: function search(t) {
            return t.Name.toLowerCase().indexOf(e.toLowerCase()) >= 0;
          }
        }) : n.setState({
          search: function search(e) {
            return !0;
          }
        });
      }, n.state = {
        search: function search(e) {
          return !0;
        },
        data: null,
        keys: null
      };

      var r = function e(t, n, r) {
        return t ? Object.assign({}, r(t), o({}, n, t[n].map(function (t) {
          return e(t, n, r);
        }))) : null;
      };

      return fetch("http://" + process.env.REACT_APP_DATA_POINT + "/groups?$filter=Id eq 98B34F14-6DAA-3EE4-4EB1-E6D4F691960E&$expand=Childs($levels=max;$expand=Datas($expand=Data.Models.DataDecimal/LimitDenormalized,Data.Models.DataString/LimitDenormalized))").then(function (e) {
        return e.json();
      }).then(function (e) {
        var t = e.value[0];

        t.cast = function (e) {
          return r(t, "Childs", e);
        };

        var i = [],
            a = t.cast(function (e) {
          var t = {
            Id: e.Id,
            Name: e.Name,
            Initials: e.Initials,
            MeasureUnit: e.MeasureUnit,
            ParentId: e.ParentId
          };

          if (e.Datas) {
            var r = n.arrayGroupBy(e.Datas, function (e) {
              return n.dateFormatToYYYY_MM_DD(new Date(e.CollectionDate)) + "T00:00:00";
            });
            i = i.concat(r.keys());
            var a = r.cast(function (e, t) {
              return o({}, t, n.valueCol(e[0]));
            });
            t = Object.assign({}, t, a);
            var l = e.Datas.map(function (e) {
              return n.getLimitDescription(e);
            }).filter(function (e) {
              return null != e || "" !== e;
            });
            t.LimitDescription || (t.LimitDescription = l[0]);
          }

          return t;
        });
        n.setState({
          data: a,
          keys: n.arrayDistinct(i)
        });
      }), n;
    }

    return l(t, e), f(t, [{
      key: "getLimitDescription",
      value: function value(e) {
        var t = "";

        switch (e["@odata.type"]) {
          case "#Data.Models.DataDecimal":
            var n = e.LimitDenormalized;
            n && (n.Name && (t += n.Name + ":"), "BiggerThan" === n.MinType ? t += " > " + n.Min : "EqualsOrBiggerThan" === n.MinType && (t += " >= " + n.Min), n.MinType && n.MaxType && (t += " e"), "SmallThan" === n.MaxType ? t += " < " + n.Max : "SmallOrEqualsThan" === n.MaxType && (t += " <= " + n.Max));
            break;

          case "#Data.Models.DataString":
            var r = e.LimitDenormalized;
            t = r ? r.Expected : null;
        }

        return t;
      }
    }, {
      key: "valueCol",
      value: function value(e) {
        var t = null,
            n = null;

        switch (e["@odata.type"]) {
          case "#Data.Models.DataDecimal":
            t = e.DecimalValue, n = e.LimitDenormalized ? e.LimitDenormalized.Color : null;
            break;

          case "#Data.Models.DataString":
            t = e.StringValue, n = e.LimitDenormalized ? e.LimitDenormalized.Color : null;
            break;

          default:
            throw new Error("exam type not identified");
        }

        return c.a.createElement("div", {
          style: n ? {
            backgroundColor: "#" + n.toString(16)
          } : null
        }, c.a.createElement("center", null, t));
      }
    }, {
      key: "headColumns",
      value: function value() {
        var e = this,
            t = c.a.createElement("div", null, "Nome", c.a.createElement("br", null), c.a.createElement("input", {
          size: 10,
          onChange: function onChange(t) {
            return e.handleFilterChange(t.target.value);
          }
        })),
            n = this.state.keys,
            o = n.sort(function (e, t) {
          return new Date(t) - new Date(e);
        }),
            i = o.map(function (t) {
          return {
            description: c.a.createElement("center", null, c.a.createElement("b", null, e.dateFormatToDD_MM_YY(new Date(t)))),
            name: t
          };
        });
        return [{
          description: c.a.createElement("b", null, t),
          name: "Name"
        }].concat(r(i), [{
          description: c.a.createElement("center", null, c.a.createElement("b", null, "Un")),
          name: "MeasureUnit"
        }, {
          description: c.a.createElement("b", null, "Refer\xeancia"),
          name: "LimitDescription"
        }]);
      }
    }, {
      key: "getChilds",
      value: function value(e) {
        return e.Childs;
      }
    }, {
      key: "render",
      value: function value() {
        return this.state.data ? c.a.createElement(s.TreeTable, {
          expand: !1,
          style: {
            borderCollapse: "collapse",
            borderSpacing: 0,
            width: "100%",
            border: "1px solid #ddd",
            row: {
              nthChild: "#f2f2f2"
            }
          },
          head: this.headColumns(),
          getChilds: this.getChilds,
          filter: this.state.search
        }, this.state.data.Childs) : c.a.createElement("label", null, "Loading...");
      }
    }]), t;
  }(u.Component);

  t.a = d;
}, function (e, t, n) {
  e.exports = function (e) {
    function t(r) {
      if (n[r]) return n[r].exports;
      var o = n[r] = {
        i: r,
        l: !1,
        exports: {}
      };
      return e[r].call(o.exports, o, o.exports, t), o.l = !0, o.exports;
    }

    var n = {};
    return t.m = e, t.c = n, t.d = function (e, n, r) {
      t.o(e, n) || Object.defineProperty(e, n, {
        configurable: !1,
        enumerable: !0,
        get: r
      });
    }, t.n = function (e) {
      var n = e && e.__esModule ? function () {
        return e["default"];
      } : function () {
        return e;
      };
      return t.d(n, "a", n), n;
    }, t.o = function (e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    }, t.p = "", t(t.s = 7);
  }([function (e, t) {
    e.exports = n(0);
  }, function (e, t, n) {
    (function (t) {
      if ("production" !== t.env.NODE_ENV) {
        var r = "function" === typeof Symbol && Symbol["for"] && Symbol["for"]("react.element") || 60103,
            o = function o(e) {
          return "object" === _typeof(e) && null !== e && e.$$typeof === r;
        };

        e.exports = n(9)(o, !0);
      } else e.exports = n(12)();
    }).call(t, n(2));
  }, function (e, t) {
    function n() {
      throw new Error("setTimeout has not been defined");
    }

    function r() {
      throw new Error("clearTimeout has not been defined");
    }

    function o(e) {
      if (s === setTimeout) return setTimeout(e, 0);
      if ((s === n || !s) && setTimeout) return s = setTimeout, setTimeout(e, 0);

      try {
        return s(e, 0);
      } catch (t) {
        try {
          return s.call(null, e, 0);
        } catch (t) {
          return s.call(this, e, 0);
        }
      }
    }

    function i(e) {
      if (f === clearTimeout) return clearTimeout(e);
      if ((f === r || !f) && clearTimeout) return f = clearTimeout, clearTimeout(e);

      try {
        return f(e);
      } catch (t) {
        try {
          return f.call(null, e);
        } catch (t) {
          return f.call(this, e);
        }
      }
    }

    function a() {
      m && p && (m = !1, p.length ? h = p.concat(h) : y = -1, h.length && l());
    }

    function l() {
      if (!m) {
        var e = o(a);
        m = !0;

        for (var t = h.length; t;) {
          for (p = h, h = []; ++y < t;) {
            p && p[y].run();
          }

          y = -1, t = h.length;
        }

        p = null, m = !1, i(e);
      }
    }

    function u(e, t) {
      this.fun = e, this.array = t;
    }

    function c() {}

    var s,
        f,
        d = e.exports = {};
    !function () {
      try {
        s = "function" === typeof setTimeout ? setTimeout : n;
      } catch (e) {
        s = n;
      }

      try {
        f = "function" === typeof clearTimeout ? clearTimeout : r;
      } catch (e) {
        f = r;
      }
    }();
    var p,
        h = [],
        m = !1,
        y = -1;
    d.nextTick = function (e) {
      var t = new Array(arguments.length - 1);
      if (arguments.length > 1) for (var n = 1; n < arguments.length; n++) {
        t[n - 1] = arguments[n];
      }
      h.push(new u(e, t)), 1 !== h.length || m || o(l);
    }, u.prototype.run = function () {
      this.fun.apply(null, this.array);
    }, d.title = "browser", d.browser = !0, d.env = {}, d.argv = [], d.version = "", d.versions = {}, d.on = c, d.addListener = c, d.once = c, d.off = c, d.removeListener = c, d.removeAllListeners = c, d.emit = c, d.prependListener = c, d.prependOnceListener = c, d.listeners = function (e) {
      return [];
    }, d.binding = function (e) {
      throw new Error("process.binding is not supported");
    }, d.cwd = function () {
      return "/";
    }, d.chdir = function (e) {
      throw new Error("process.chdir is not supported");
    }, d.umask = function () {
      return 0;
    };
  }, function (e, t, n) {
    "use strict";

    e.exports = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
  }, function (e, t, n) {
    "use strict";

    function r(e) {
      return e && e.__esModule ? e : {
        "default": e
      };
    }

    Object.defineProperty(t, "__esModule", {
      value: !0
    });

    var o = Object.assign || function (e) {
      for (var t = 1; t < arguments.length; t++) {
        var n = arguments[t];

        for (var r in n) {
          Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
        }
      }

      return e;
    },
        i = n(0),
        a = r(i),
        l = n(1),
        u = (r(l), n(13)),
        c = r(u),
        s = n(5),
        f = r(s),
        d = n(16),
        p = r(d),
        h = function h(e) {
      return a["default"].createElement(c["default"], o({}, e, {
        row: p["default"],
        cols: f["default"]
      }), e.children);
    };

    t["default"] = h;
  }, function (e, t, n) {
    "use strict";

    function r(e) {
      return e && e.__esModule ? e : {
        "default": e
      };
    }

    Object.defineProperty(t, "__esModule", {
      value: !0
    });

    var o = Object.assign || function (e) {
      for (var t = 1; t < arguments.length; t++) {
        var n = arguments[t];

        for (var r in n) {
          Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
        }
      }

      return e;
    },
        i = n(0),
        a = (r(i), n(1)),
        l = (r(a), n(14)),
        u = r(l),
        c = n(15),
        s = r(c),
        f = function f(e) {
      return (0, u["default"])(o({}, e, {
        col: s["default"]
      }));
    };

    t["default"] = f;
  }, function (e, t, n) {
    "use strict";

    function r(e) {
      return e && e.__esModule ? e : {
        "default": e
      };
    }

    Object.defineProperty(t, "__esModule", {
      value: !0
    });

    var o = n(0),
        i = r(o),
        a = n(1),
        l = (r(a), n(5)),
        u = r(l),
        c = function c(e) {
      return i["default"].createElement("tr", null, i["default"].createElement(u["default"], {
        onClick: e.onClick
      }, e.children));
    };

    t["default"] = c;
  }, function (e, t, n) {
    "use strict";

    function r(e) {
      return e && e.__esModule ? e : {
        "default": e
      };
    }

    Object.defineProperty(t, "__esModule", {
      value: !0
    }), t.TreeTable = void 0;
    var o = n(8),
        i = r(o),
        a = n(17),
        l = r(a);
    t.TreeTable = i["default"], t["default"] = l["default"];
  }, function (e, t, n) {
    "use strict";

    function r(e) {
      return e && e.__esModule ? e : {
        "default": e
      };
    }

    function o(e) {
      if (Array.isArray(e)) {
        for (var t = 0, n = Array(e.length); t < e.length; t++) {
          n[t] = e[t];
        }

        return n;
      }

      return Array.from(e);
    }

    function i(e, t) {
      if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
    }

    function a(e, t) {
      if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      return !t || "object" !== ("undefined" === typeof t ? "undefined" : u(t)) && "function" !== typeof t ? e : t;
    }

    function l(e, t) {
      if ("function" !== typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + ("undefined" === typeof t ? "undefined" : u(t)));
      e.prototype = Object.create(t && t.prototype, {
        constructor: {
          value: e,
          enumerable: !1,
          writable: !0,
          configurable: !0
        }
      }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t);
    }

    var u = "function" === typeof Symbol && "symbol" === _typeof(Symbol.iterator) ? function (e) {
      return _typeof(e);
    } : function (e) {
      return e && "function" === typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : _typeof(e);
    };
    Object.defineProperty(t, "__esModule", {
      value: !0
    });

    var c = Object.assign || function (e) {
      for (var t = 1; t < arguments.length; t++) {
        var n = arguments[t];

        for (var r in n) {
          Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
        }
      }

      return e;
    },
        s = function () {
      function e(e, t) {
        for (var n = 0; n < t.length; n++) {
          var r = t[n];
          r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
        }
      }

      return function (t, n, r) {
        return n && e(t.prototype, n), r && e(t, r), t;
      };
    }(),
        f = n(0),
        d = r(f),
        p = n(1),
        h = r(p),
        m = n(4),
        y = r(m),
        v = n(6),
        b = r(v),
        g = function g(e) {
      return d["default"].createElement("button", e, null === e.expanded ? d["default"].createElement("span", null, "\xa0") : e.expanded ? "-" : "+");
    };

    g.propTypes = {
      expanded: h["default"].bool
    };

    var w = function (e) {
      function t(e) {
        i(this, t);
        var n = a(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
        return n.expandLine = function (e) {
          var t = [].concat(o(n.state.body));
          n.loop(t, function (r) {
            e === r && r.hasChilds && (r.showChilds = !r.showChilds, n.setState({
              body: t
            }));
          });
        }, n.expandAll = function () {
          var e = [].concat(o(n.state.body));
          n.expandDefault = !n.expandDefault, n.loop(e, function (e) {
            e.hasChilds && (e.showChilds = n.expandDefault);
          }), n.setState({
            body: e
          });
        }, n.mapLine = function (e) {
          var t = d["default"].createElement(g, {
            expanded: e.showChilds,
            onClick: function onClick() {
              return n.expandLine(e);
            }
          });
          return c({
            expandButton: t
          }, e.originalData);
        }, n.filter = function (e) {
          if (!n.props.filter) return !0;
          var t = !1;
          return n.loop([e], function (e) {
            t = t || n.props.filter(e.originalData);
          }), t;
        }, n.expandDefault = null == e.expand || e.expand, n.originalData = e.children, n.initialBody = n.map(n.originalData), n.state = {
          body: n.initialBody
        }, n;
      }

      return l(t, e), s(t, [{
        key: "getChilds",
        value: function value(e) {
          return e.showChilds ? e.childs : [];
        }
      }, {
        key: "map",
        value: function value(e) {
          var t = this;
          return e.map(function (e) {
            var n = t.props.getChilds(e),
                r = n.length > 0;
            return {
              originalData: e,
              childs: t.map(n),
              hasChilds: r,
              showChilds: r ? t.expandDefault : null
            };
          });
        }
      }, {
        key: "loop",
        value: function value(e, t) {
          var n = this;
          e.forEach(function (e) {
            if (t(e), e.childs.length > 0) return n.loop(e.childs, t);
          });
        }
      }, {
        key: "handleClick",
        value: function value(e, t) {}
      }, {
        key: "getHead",
        value: function value(e, t, n) {
          e.forEach(function (e) {
            e && (e.description ? (t.push(e.description), e.name && n.push(e.name)) : t.push(e));
          });
        }
      }, {
        key: "render",
        value: function value() {
          var e = d["default"].createElement(g, {
            expanded: this.expandDefault,
            onClick: this.expandAll
          }),
              t = {
            description: e,
            name: "expandButton"
          },
              n = [t].concat(o(this.props.head)),
              r = [],
              i = [];
          return this.getHead(n, r, i), d["default"].createElement("table", {
            style: this.props.style
          }, d["default"].createElement("thead", null, r ? d["default"].createElement(b["default"], null, r) : null), d["default"].createElement("tbody", null, d["default"].createElement(y["default"], c({}, this.props, {
            style: this.props.style.row,
            getChilds: this.getChilds,
            colsName: i,
            rowMap: this.mapLine,
            onClick: this.handleClick,
            filter: this.filter
          }), this.state.body)));
        }
      }]), t;
    }(f.Component);

    t["default"] = w;
  }, function (e, t, n) {
    "use strict";

    (function (t) {
      function r() {
        return null;
      }

      var o = n(10),
          i = n(3),
          a = n(11),
          l = function l() {};

      "production" !== t.env.NODE_ENV && (l = function l(e) {
        var t = "Warning: " + e;
        "undefined" !== typeof console && console.error(t);

        try {
          throw new Error(t);
        } catch (e) {}
      }), e.exports = function (e, n) {
        function u(e) {
          var t = e && (C && e[C] || e[S]);
          if ("function" === typeof t) return t;
        }

        function c(e, t) {
          return e === t ? 0 !== e || 1 / e === 1 / t : e !== e && t !== t;
        }

        function s(e) {
          this.message = e, this.stack = "";
        }

        function f(e) {
          function r(r, u, c, f, d, p, h) {
            if (f = f || P, p = p || c, h !== i) {
              if (n) {
                var m = new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use `PropTypes.checkPropTypes()` to call them. Read more at http://fb.me/use-check-prop-types");
                throw m.name = "Invariant Violation", m;
              }

              if ("production" !== t.env.NODE_ENV && "undefined" !== typeof console) {
                var y = f + ":" + c;
                !o[y] && a < 3 && (l("You are manually calling a React.PropTypes validation function for the `" + p + "` prop on `" + f + "`. This is deprecated and will throw in the standalone `prop-types` package. You may be seeing this warning due to a third-party PropTypes library. See https://fb.me/react-warning-dont-call-proptypes for details."), o[y] = !0, a++);
              }
            }

            return null == u[c] ? r ? new s(null === u[c] ? "The " + d + " `" + p + "` is marked as required in `" + f + "`, but its value is `null`." : "The " + d + " `" + p + "` is marked as required in `" + f + "`, but its value is `undefined`.") : null : e(u, c, f, d, p);
          }

          if ("production" !== t.env.NODE_ENV) var o = {},
              a = 0;
          var u = r.bind(null, !1);
          return u.isRequired = r.bind(null, !0), u;
        }

        function d(e) {
          function t(t, n, r, o, i, a) {
            var l = t[n];
            if (x(l) !== e) return new s("Invalid " + o + " `" + i + "` of type `" + _(l) + "` supplied to `" + r + "`, expected `" + e + "`.");
            return null;
          }

          return f(t);
        }

        function p(e) {
          function t(t, n, r, o, a) {
            if ("function" !== typeof e) return new s("Property `" + a + "` of component `" + r + "` has invalid PropType notation inside arrayOf.");
            var l = t[n];

            if (!Array.isArray(l)) {
              return new s("Invalid " + o + " `" + a + "` of type `" + x(l) + "` supplied to `" + r + "`, expected an array.");
            }

            for (var u = 0; u < l.length; u++) {
              var c = e(l, u, r, o, a + "[" + u + "]", i);
              if (c instanceof Error) return c;
            }

            return null;
          }

          return f(t);
        }

        function h(e) {
          function t(t, n, r, o, i) {
            if (!(t[n] instanceof e)) {
              var a = e.name || P;
              return new s("Invalid " + o + " `" + i + "` of type `" + E(t[n]) + "` supplied to `" + r + "`, expected instance of `" + a + "`.");
            }

            return null;
          }

          return f(t);
        }

        function m(e) {
          function n(t, n, r, o, i) {
            for (var a = t[n], l = 0; l < e.length; l++) {
              if (c(a, e[l])) return null;
            }

            return new s("Invalid " + o + " `" + i + "` of value `" + a + "` supplied to `" + r + "`, expected one of " + JSON.stringify(e) + ".");
          }

          return Array.isArray(e) ? f(n) : ("production" !== t.env.NODE_ENV && l("Invalid argument supplied to oneOf, expected an instance of array."), r);
        }

        function y(e) {
          function t(t, n, r, o, a) {
            if ("function" !== typeof e) return new s("Property `" + a + "` of component `" + r + "` has invalid PropType notation inside objectOf.");
            var l = t[n],
                u = x(l);
            if ("object" !== u) return new s("Invalid " + o + " `" + a + "` of type `" + u + "` supplied to `" + r + "`, expected an object.");

            for (var c in l) {
              if (l.hasOwnProperty(c)) {
                var f = e(l, c, r, o, a + "." + c, i);
                if (f instanceof Error) return f;
              }
            }

            return null;
          }

          return f(t);
        }

        function v(e) {
          function n(t, n, r, o, a) {
            for (var l = 0; l < e.length; l++) {
              if (null == (0, e[l])(t, n, r, o, a, i)) return null;
            }

            return new s("Invalid " + o + " `" + a + "` supplied to `" + r + "`.");
          }

          if (!Array.isArray(e)) return "production" !== t.env.NODE_ENV && l("Invalid argument supplied to oneOfType, expected an instance of array."), r;

          for (var o = 0; o < e.length; o++) {
            var a = e[o];
            if ("function" !== typeof a) return l("Invalid argument supplied to oneOfType. Expected an array of check functions, but received " + T(a) + " at index " + o + "."), r;
          }

          return f(n);
        }

        function b(e) {
          function t(t, n, r, o, a) {
            var l = t[n],
                u = x(l);
            if ("object" !== u) return new s("Invalid " + o + " `" + a + "` of type `" + u + "` supplied to `" + r + "`, expected `object`.");

            for (var c in e) {
              var f = e[c];

              if (f) {
                var d = f(l, c, r, o, a + "." + c, i);
                if (d) return d;
              }
            }

            return null;
          }

          return f(t);
        }

        function g(e) {
          function t(t, n, r, a, l) {
            var u = t[n],
                c = x(u);
            if ("object" !== c) return new s("Invalid " + a + " `" + l + "` of type `" + c + "` supplied to `" + r + "`, expected `object`.");
            var f = o({}, t[n], e);

            for (var d in f) {
              var p = e[d];
              if (!p) return new s("Invalid " + a + " `" + l + "` key `" + d + "` supplied to `" + r + "`.\nBad object: " + JSON.stringify(t[n], null, "  ") + "\nValid keys: " + JSON.stringify(Object.keys(e), null, "  "));
              var h = p(u, d, r, a, l + "." + d, i);
              if (h) return h;
            }

            return null;
          }

          return f(t);
        }

        function w(t) {
          switch (_typeof(t)) {
            case "number":
            case "string":
            case "undefined":
              return !0;

            case "boolean":
              return !t;

            case "object":
              if (Array.isArray(t)) return t.every(w);
              if (null === t || e(t)) return !0;
              var n = u(t);
              if (!n) return !1;
              var r,
                  o = n.call(t);

              if (n !== t.entries) {
                for (; !(r = o.next()).done;) {
                  if (!w(r.value)) return !1;
                }
              } else for (; !(r = o.next()).done;) {
                var i = r.value;
                if (i && !w(i[1])) return !1;
              }

              return !0;

            default:
              return !1;
          }
        }

        function k(e, t) {
          return "symbol" === e || "Symbol" === t["@@toStringTag"] || "function" === typeof Symbol && t instanceof Symbol;
        }

        function x(e) {
          var t = _typeof(e);

          return Array.isArray(e) ? "array" : e instanceof RegExp ? "object" : k(t, e) ? "symbol" : t;
        }

        function _(e) {
          if ("undefined" === typeof e || null === e) return "" + e;
          var t = x(e);

          if ("object" === t) {
            if (e instanceof Date) return "date";
            if (e instanceof RegExp) return "regexp";
          }

          return t;
        }

        function T(e) {
          var t = _(e);

          switch (t) {
            case "array":
            case "object":
              return "an " + t;

            case "boolean":
            case "date":
            case "regexp":
              return "a " + t;

            default:
              return t;
          }
        }

        function E(e) {
          return e.constructor && e.constructor.name ? e.constructor.name : P;
        }

        var C = "function" === typeof Symbol && Symbol.iterator,
            S = "@@iterator",
            P = "<<anonymous>>",
            O = {
          array: d("array"),
          bool: d("boolean"),
          func: d("function"),
          number: d("number"),
          object: d("object"),
          string: d("string"),
          symbol: d("symbol"),
          any: function () {
            return f(r);
          }(),
          arrayOf: p,
          element: function () {
            function t(t, n, r, o, i) {
              var a = t[n];

              if (!e(a)) {
                return new s("Invalid " + o + " `" + i + "` of type `" + x(a) + "` supplied to `" + r + "`, expected a single ReactElement.");
              }

              return null;
            }

            return f(t);
          }(),
          instanceOf: h,
          node: function () {
            function e(e, t, n, r, o) {
              return w(e[t]) ? null : new s("Invalid " + r + " `" + o + "` supplied to `" + n + "`, expected a ReactNode.");
            }

            return f(e);
          }(),
          objectOf: y,
          oneOf: m,
          oneOfType: v,
          shape: b,
          exact: g
        };
        return s.prototype = Error.prototype, O.checkPropTypes = a, O.PropTypes = O, O;
      };
    }).call(t, n(2));
  }, function (e, t, n) {
    "use strict";

    function r(e) {
      if (null === e || void 0 === e) throw new TypeError("Object.assign cannot be called with null or undefined");
      return Object(e);
    }

    var o = Object.getOwnPropertySymbols,
        i = Object.prototype.hasOwnProperty,
        a = Object.prototype.propertyIsEnumerable;
    e.exports = function () {
      try {
        if (!Object.assign) return !1;
        var e = new String("abc");
        if (e[5] = "de", "5" === Object.getOwnPropertyNames(e)[0]) return !1;

        for (var t = {}, n = 0; n < 10; n++) {
          t["_" + String.fromCharCode(n)] = n;
        }

        if ("0123456789" !== Object.getOwnPropertyNames(t).map(function (e) {
          return t[e];
        }).join("")) return !1;
        var r = {};
        return "abcdefghijklmnopqrst".split("").forEach(function (e) {
          r[e] = e;
        }), "abcdefghijklmnopqrst" === Object.keys(Object.assign({}, r)).join("");
      } catch (e) {
        return !1;
      }
    }() ? Object.assign : function (e, t) {
      for (var n, l, u = r(e), c = 1; c < arguments.length; c++) {
        n = Object(arguments[c]);

        for (var s in n) {
          i.call(n, s) && (u[s] = n[s]);
        }

        if (o) {
          l = o(n);

          for (var f = 0; f < l.length; f++) {
            a.call(n, l[f]) && (u[l[f]] = n[l[f]]);
          }
        }
      }

      return u;
    };
  }, function (e, t, n) {
    "use strict";

    (function (t) {
      function r(e, n, r, l, u) {
        if ("production" !== t.env.NODE_ENV) for (var c in e) {
          if (e.hasOwnProperty(c)) {
            var s;

            try {
              if ("function" !== typeof e[c]) {
                var f = Error((l || "React class") + ": " + r + " type `" + c + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + _typeof(e[c]) + "`.");
                throw f.name = "Invariant Violation", f;
              }

              s = e[c](n, c, l, r, null, i);
            } catch (e) {
              s = e;
            }

            if (!s || s instanceof Error || o((l || "React class") + ": type specification of " + r + " `" + c + "` is invalid; the type checker function must return `null` or an `Error` but returned a " + _typeof(s) + ". You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument)."), s instanceof Error && !(s.message in a)) {
              a[s.message] = !0;
              var d = u ? u() : "";
              o("Failed " + r + " type: " + s.message + (null != d ? d : ""));
            }
          }
        }
      }

      var o = function o() {};

      if ("production" !== t.env.NODE_ENV) {
        var i = n(3),
            a = {};

        o = function o(e) {
          var t = "Warning: " + e;
          "undefined" !== typeof console && console.error(t);

          try {
            throw new Error(t);
          } catch (e) {}
        };
      }

      e.exports = r;
    }).call(t, n(2));
  }, function (e, t, n) {
    "use strict";

    function r() {}

    var o = n(3);

    e.exports = function () {
      function e(e, t, n, r, i, a) {
        if (a !== o) {
          var l = new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");
          throw l.name = "Invariant Violation", l;
        }
      }

      function t() {
        return e;
      }

      e.isRequired = e;
      var n = {
        array: e,
        bool: e,
        func: e,
        number: e,
        object: e,
        string: e,
        symbol: e,
        any: e,
        arrayOf: t,
        element: e,
        instanceOf: t,
        node: e,
        objectOf: t,
        oneOf: t,
        oneOfType: t,
        shape: t,
        exact: t
      };
      return n.checkPropTypes = r, n.PropTypes = n, n;
    };
  }, function (e, t, n) {
    "use strict";

    function r(e) {
      return e && e.__esModule ? e : {
        "default": e
      };
    }

    Object.defineProperty(t, "__esModule", {
      value: !0
    });

    var o = Object.assign || function (e) {
      for (var t = 1; t < arguments.length; t++) {
        var n = arguments[t];

        for (var r in n) {
          Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
        }
      }

      return e;
    },
        i = n(0),
        a = r(i),
        l = n(1),
        u = r(l),
        c = function e(t) {
      var n = !!t.highLight;
      return t.children.map(function (r, i) {
        var l = t.style && t.style.nthChild ? t.style.nthChild : "#FFFFFF",
            u = t.id ? t.id + i : i,
            c = t.rowMap ? t.rowMap(r) : r,
            s = t.getChilds ? t.getChilds(r) : [];
        return t.filter && !t.filter(r) ? null : (n = !n, a["default"].createElement(a["default"].Fragment, null, a["default"].createElement(t.row, {
          key: u,
          style: n ? {
            backgroundColor: l
          } : null
        }, a["default"].createElement(t.cols, {
          colsName: t.colsName,
          onClick: function onClick(e) {
            return t.onClick(r, e);
          }
        }, c)), s.length > 0 ? a["default"].createElement(e, o({}, t, {
          id: u + 1,
          key: u + 1,
          highLight: n
        }), s) : null));
      });
    };

    c.propTypes = {
      row: u["default"].func.isRequired,
      cols: u["default"].func.isRequired
    }, t["default"] = c;
  }, function (e, t, n) {
    "use strict";

    function r(e) {
      return e && e.__esModule ? e : {
        "default": e
      };
    }

    Object.defineProperty(t, "__esModule", {
      value: !0
    });

    var o = n(0),
        i = (r(o), n(1)),
        a = r(i),
        l = function l(e) {
      return e.colsName && e.colsName.length > 0 ? e.colsName.map(function (t, n) {
        return e.col(e.children[t], t, e.onClick);
      }) : e.children.map(function (t, n) {
        return e.col(t, n, e.onClick);
      });
    };

    l.propTypes = {
      children: a["default"].object,
      col: a["default"].func.isRequired,
      colsName: a["default"].array
    }, t["default"] = l;
  }, function (e, t, n) {
    "use strict";

    function r(e) {
      return e && e.__esModule ? e : {
        "default": e
      };
    }

    Object.defineProperty(t, "__esModule", {
      value: !0
    });
    var o = n(0),
        i = r(o),
        a = n(1),
        l = (r(a), function (e) {
      var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null,
          n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null;
      return i["default"].createElement("td", {
        key: t,
        onClick: function onClick() {
          return n ? n(t) : null;
        }
      }, e);
    });
    t["default"] = l;
  }, function (e, t, n) {
    "use strict";

    function r(e) {
      return e && e.__esModule ? e : {
        "default": e
      };
    }

    Object.defineProperty(t, "__esModule", {
      value: !0
    });
    var o = n(0),
        i = r(o),
        a = n(1),
        l = (r(a), function (e) {
      return i["default"].createElement("tr", e, e.children);
    });
    t["default"] = l;
  }, function (e, t, n) {
    "use strict";

    function r(e) {
      return e && e.__esModule ? e : {
        "default": e
      };
    }

    function o(e, t) {
      if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
    }

    function i(e, t) {
      if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      return !t || "object" !== ("undefined" === typeof t ? "undefined" : l(t)) && "function" !== typeof t ? e : t;
    }

    function a(e, t) {
      if ("function" !== typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + ("undefined" === typeof t ? "undefined" : l(t)));
      e.prototype = Object.create(t && t.prototype, {
        constructor: {
          value: e,
          enumerable: !1,
          writable: !0,
          configurable: !0
        }
      }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t);
    }

    var l = "function" === typeof Symbol && "symbol" === _typeof(Symbol.iterator) ? function (e) {
      return _typeof(e);
    } : function (e) {
      return e && "function" === typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : _typeof(e);
    };
    Object.defineProperty(t, "__esModule", {
      value: !0
    });

    var u = Object.assign || function (e) {
      for (var t = 1; t < arguments.length; t++) {
        var n = arguments[t];

        for (var r in n) {
          Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
        }
      }

      return e;
    },
        c = function () {
      function e(e, t) {
        for (var n = 0; n < t.length; n++) {
          var r = t[n];
          r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, r.key, r);
        }
      }

      return function (t, n, r) {
        return n && e(t.prototype, n), r && e(t, r), t;
      };
    }(),
        s = n(0),
        f = r(s),
        d = n(1),
        p = r(d),
        h = n(4),
        m = r(h),
        y = n(6),
        v = r(y),
        b = function (e) {
      function t(e) {
        o(this, t);
        var n = i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
        return n.handleBodyClick = function (e, t) {
          console.log(e, t), n.props.onClick && n.props.onClick(e, t);
        }, n.initialBody = e.children, n.state = {
          body: n.initialBody
        }, n;
      }

      return a(t, e), c(t, [{
        key: "handleHeadClick",
        value: function value(e) {
          console.log(e);
        }
      }, {
        key: "getHead",
        value: function value(e, t, n) {
          e.forEach(function (e) {
            e && (e.description ? (t.push(e.description), e.name && n.push(e.name)) : t.push(e));
          });
        }
      }, {
        key: "render",
        value: function value() {
          var e = this.props.head ? this.props.head : [],
              t = [],
              n = [];
          return this.getHead(e, t, n), f["default"].createElement("table", {
            style: this.props.style
          }, f["default"].createElement("thead", null, !t || t.length <= 0 ? null : f["default"].createElement(v["default"], {
            onClick: this.handleHeadClick
          }, t)), f["default"].createElement("tbody", null, f["default"].createElement(m["default"], u({}, this.props, {
            onClick: this.handleBodyClick,
            colsName: n
          }), this.state.body)));
        }
      }]), t;
    }(s.Component);

    t["default"] = b, b.propTypes = {
      head: p["default"].array
    };
  }]);
}]);
"use strict";

function loadDictionaryFunctions(dictionary) {
  dictionary.forEach = function (callBackFn) {
    Object.keys(dictionary).forEach(function (key, index) {
      callBackFn(dictionary[key], key);
    });
  };

  dictionary.map = function (callBackFn) {
    var ret = [];
    dictionary.forEach(function (value, key) {
      if (!Array.isArray(value)) {
        return;
      }

      var element = callBackFn(value, key);

      if (element) {
        ret.push(element);
      }
    });
    return ret;
  };

  dictionary.filter = function (callBackFn) {
    return dictionary.map(function (value, key) {
      if (callBackFn(value, key)) {
        return value;
      }
    });
  };

  dictionary.keys = function () {
    return Object.keys(dictionary).filter(function (key) {
      return Array.isArray(dictionary[key]);
    });
  };
}

function loadMomentPrototype(prototype) {
  var _this = this;

  prototype.time = function () {
    var hourStr = _this.format('hh:mm:ss Z');

    return new moment(hourStr, 'hh:mm:ss Z');
  };
}

function loadStringPrototype(prototype) {
  var _this2 = this;

  prototype.padLeft = function (totalWidth) {
    var paddingChar = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var ret = _this2;

    while (ret.length < (totalWidth || 2)) {
      ret = paddingChar + ret;
    }

    return ret;
  };
}

function loadArrayPrototype(prototype) {
  Array.prototype.GroupBy = function (callBackFn) {
    var ret = {};
    this.forEach(function (element) {
      var key = callBackFn(element);

      if (!ret[key]) {
        ret[key] = [];
      }

      ret[key].push(element);
    });
    loadDictionaryFunctions(ret);
    return ret;
  };

  Array.prototype.Sum = function (callBackFn) {
    if (this.length == 0) {
      return 0;
    }

    return this.reduce(function (previous, current) {
      return previous + callBackFn(current);
    }, 0);
  };

  Array.prototype.Average = function () {
    var callBackFn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    callBackFn = callBackFn ? callBackFn : function (item) {
      return item;
    };

    if (this.length == 0) {
      return 0;
    }

    return this.Sum(callBackFn) / this.length;
  };

  Array.prototype.Distinct = function () {
    return this.filter(function (value, index, self) {
      return self.indexOf(value) === index;
    });
  };

  Array.prototype.Last = function () {
    return this[this.length - 1];
  };
}
"use strict";

function loadTreeFunctions(rootNode, nodeIdVariableName, childsVariableName, parentVariableName, parentIdVariableName) {
  var parentNode = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;

  if (!rootNode) {
    return;
  }

  rootNode[parentVariableName] = parentNode;

  rootNode.forEachTree = function (callBackFuncion) {
    return forEachRecursively(rootNode, childsVariableName, callBackFuncion);
  };

  rootNode.parentReducer = function (reduceItem, aggregatorCallBack) {
    return parentReduce(rootNode, parentVariableName, reduceItem, aggregatorCallBack);
  };

  rootNode.toArray = function () {
    return toArray(rootNode, childsVariableName);
  };

  rootNode.findChild = function (finderVariableName, keys) {
    return findChild(rootNode, childsVariableName, finderVariableName, keys);
  };

  rootNode.getFull = function (elementVariableName) {
    return getFull(rootNode, elementVariableName);
  };

  if (parentNode && rootNode[parentIdVariableName] !== parentNode[nodeIdVariableName]) {
    console.log('node and parent node dont match. rootChildId: ' + rootNode[nodeIdVariableName]);
  }

  if (rootNode[childsVariableName]) {
    rootNode[childsVariableName].forEach(function (element) {
      loadTreeFunctions(element, nodeIdVariableName, childsVariableName, parentVariableName, parentIdVariableName, rootNode);
    });
  }
}

function toArray(treeNode) {
  var ret = [treeNode];
  treeNode.forEachTree(function (child) {
    return ret.push(child);
  });
  return ret;
}

function arrayOfTreeToArrayRecursively(array) {
  var ret = [];
  array.forEach(function (tree) {
    ret.push(tree);
    tree.forEachTree(function (child) {
      return ret.push(child);
    });
  });
  return ret;
}

function parentReduce(treeNode, parentVariableName, reduceItem, aggregatorCallBack) {
  var ret = aggregatorCallBack(null, reduceItem(treeNode));
  var parent = treeNode[parentVariableName];

  while (parent) {
    ret = aggregatorCallBack(ret, reduceItem(parent));
    parent = parent[parentVariableName];
  }

  return ret;
}

function treeExtensions(prototype) {
  prototype.parentReducer = function (reduceItem, callBack) {
    return parentReduce(this, 'Parent', reduceItem, callBack);
  };

  prototype.toArray = function () {
    return toArray(this, 'Childs');
  };
}

function findChild(node, childsVariableName, finderVariableName, keys) {
  var keyIndex = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
  var nextchild = node[childsVariableName].find(function (child) {
    return child[finderVariableName] === keys[keyIndex];
  });

  if (keyIndex + 1 === keys.length) {
    return nextchild;
  } else {
    return findChild(nextchild, childsVariableName, finderVariableName, keys, keyIndex + 1);
  }
}

function getFull(node, elementVariableName) {
  var separator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '\\';

  var reduceItemFn = function reduceItemFn(element) {
    return element[elementVariableName];
  };

  var accumulatorFn = function accumulatorFn(accumulator, currentValue) {
    return accumulator ? currentValue + separator + accumulator : currentValue;
  };

  return node.parentReducer(reduceItemFn, accumulatorFn);
}

function forEachRecursively(node, childsVariableName, callBackFuncion) {
  var callBackFunctionRecursively = function callBackFunctionRecursively(element) {
    callBackFuncion(element);
    forEachRecursively(element, childsVariableName, callBackFuncion);
  };

  if (!node[childsVariableName]) {
    return;
  }

  node[childsVariableName].forEach(callBackFunctionRecursively);
}