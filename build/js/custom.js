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
    exams: _objectSpread({}, odata.exams, {
      url: odata.url + odata.exams.point,
      nameSpace: odata.nameSpace + odata.exams.nameSpacePoint,
      bulkInsert: _objectSpread({}, odata.exams.bulkInsert, {
        url: odata.url + odata.exams.point + odata.exams.bulkInsert.point
      }),
      decimals: _objectSpread({}, odata.exams.decimals, {
        url: odata.url + odata.exams.decimals.point,
        nameSpace: odata.nameSpace + odata.exams.decimals.nameSpacePoint
      }),
      strings: _objectSpread({}, odata.exams.strings, {
        url: odata.url + odata.exams.strings.point,
        nameSpace: odata.nameSpace + odata.exams.strings.nameSpacePoint
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
      return e.default;
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
      return v = e, g;
    }
  }

  function i(e, t) {
    try {
      return e(t);
    } catch (e) {
      return v = e, g;
    }
  }

  function a(e, t, n) {
    try {
      e(t, n);
    } catch (e) {
      return v = e, g;
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
      r === g ? d(t.promise, v) : f(t.promise, r);
    });
  }

  function f(e, t) {
    if (t === e) return d(e, new TypeError("A promise cannot be resolved with itself."));

    if (t && ("object" === _typeof(t) || "function" === typeof t)) {
      var n = o(t);
      if (n === g) return d(e, v);
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
    n || r !== g || (n = !0, d(t, v));
  }

  var y = n(7),
      v = null,
      g = {};
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
  }, o.prototype.catch = function (e) {
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
          if ("string" === typeof e) this._bodyText = e;else if (v.blob && Blob.prototype.isPrototypeOf(e)) this._bodyBlob = e;else if (v.formData && FormData.prototype.isPrototypeOf(e)) this._bodyFormData = e;else if (v.searchParams && URLSearchParams.prototype.isPrototypeOf(e)) this._bodyText = e.toString();else if (v.arrayBuffer && v.blob && b(e)) this._bodyArrayBuffer = s(e.buffer), this._bodyInit = new Blob([this._bodyArrayBuffer]);else {
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
      if (v.arrayBuffer) var g = ["[object Int8Array]", "[object Uint8Array]", "[object Uint8ClampedArray]", "[object Int16Array]", "[object Uint16Array]", "[object Int32Array]", "[object Uint32Array]", "[object Float32Array]", "[object Float64Array]"],
          b = function b(e) {
        return e && DataView.prototype.isPrototypeOf(e);
      },
          w = ArrayBuffer.isView || function (e) {
        return e && g.indexOf(Object.prototype.toString.call(e)) > -1;
      };
      o.prototype.append = function (e, r) {
        e = t(e), r = n(r);
        var o = this.map[e];
        this.map[e] = o ? o + "," + r : r;
      }, o.prototype.delete = function (e) {
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
      var _ = [301, 302, 303, 307, 308];
      y.redirect = function (e, t) {
        if (-1 === _.indexOf(t)) throw new RangeError("Invalid status code");
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
    this.props = e, this.context = t, this.refs = R, this.updater = n || A;
  }

  function a() {}

  function l(e, t, n) {
    this.props = e, this.context = t, this.refs = R, this.updater = n || A;
  }

  function u(e, t, n) {
    var r = void 0,
        o = {},
        i = null,
        a = null;
    if (null != t) for (r in void 0 !== t.ref && (a = t.ref), void 0 !== t.key && (i = "" + t.key), t) {
      L.call(t, r) && !z.hasOwnProperty(r) && (o[r] = t[r]);
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
      _owner: F.current
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
    if (V.length) {
      var o = V.pop();
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
    e.result = null, e.keyPrefix = null, e.func = null, e.context = null, e.count = 0, 10 > V.length && V.push(e);
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
          case x:
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

  function g(e, t, n) {
    var r = e.result,
        o = e.keyPrefix;
    e = e.func.call(e.context, t, e.count++), Array.isArray(e) ? b(e, r, n, function (e) {
      return e;
    }) : null != e && (s(e) && (e = c(e, o + (!e.key || t && t.key === e.key ? "" : ("" + e.key).replace(B, "$&/") + "/") + n)), r.push(e));
  }

  function b(e, t, n, r, o) {
    var i = "";
    null != n && (i = ("" + n).replace(B, "$&/") + "/"), t = d(t, i, r, o), m(e, g, t), p(t);
  }

  var w = n(1),
      k = "function" === typeof Symbol && Symbol.for,
      _ = k ? Symbol.for("react.element") : 60103,
      x = k ? Symbol.for("react.portal") : 60106,
      T = k ? Symbol.for("react.fragment") : 60107,
      E = k ? Symbol.for("react.strict_mode") : 60108,
      C = k ? Symbol.for("react.profiler") : 60114,
      S = k ? Symbol.for("react.provider") : 60109,
      P = k ? Symbol.for("react.context") : 60110,
      O = k ? Symbol.for("react.concurrent_mode") : 60111,
      N = k ? Symbol.for("react.forward_ref") : 60112,
      D = k ? Symbol.for("react.suspense") : 60113,
      j = k ? Symbol.for("react.memo") : 60115,
      M = k ? Symbol.for("react.lazy") : 60116,
      I = "function" === typeof Symbol && Symbol.iterator,
      A = {
    isMounted: function isMounted() {
      return !1;
    },
    enqueueForceUpdate: function enqueueForceUpdate() {},
    enqueueReplaceState: function enqueueReplaceState() {},
    enqueueSetState: function enqueueSetState() {}
  },
      R = {};

  i.prototype.isReactComponent = {}, i.prototype.setState = function (e, t) {
    "object" !== _typeof(e) && "function" !== typeof e && null != e && o("85"), this.updater.enqueueSetState(this, e, t, "setState");
  }, i.prototype.forceUpdate = function (e) {
    this.updater.enqueueForceUpdate(this, e, "forceUpdate");
  }, a.prototype = i.prototype;
  var U = l.prototype = new a();
  U.constructor = l, w(U, i.prototype), U.isPureReactComponent = !0;
  var F = {
    current: null,
    currentDispatcher: null
  },
      L = Object.prototype.hasOwnProperty,
      z = {
    key: !0,
    ref: !0,
    __self: !0,
    __source: !0
  },
      B = /\/+/g,
      V = [],
      W = {
    Children: {
      map: function map(e, t, n) {
        if (null == e) return e;
        var r = [];
        return b(e, r, null, t, n), r;
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
        return b(e, t, null, function (e) {
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
        $$typeof: P,
        _calculateChangedBits: t,
        _currentValue: e,
        _currentValue2: e,
        _threadCount: 0,
        Provider: null,
        Consumer: null
      }, e.Provider = {
        $$typeof: S,
        _context: e
      }, e.Consumer = e;
    },
    forwardRef: function forwardRef(e) {
      return {
        $$typeof: N,
        render: e
      };
    },
    lazy: function lazy(e) {
      return {
        $$typeof: M,
        _ctor: e,
        _status: -1,
        _result: null
      };
    },
    memo: function memo(e, t) {
      return {
        $$typeof: j,
        type: e,
        compare: void 0 === t ? null : t
      };
    },
    Fragment: T,
    StrictMode: E,
    Suspense: D,
    createElement: u,
    cloneElement: function cloneElement(e, t, n) {
      (null === e || void 0 === e) && o("267", e);
      var r = void 0,
          i = w({}, e.props),
          a = e.key,
          l = e.ref,
          u = e._owner;

      if (null != t) {
        void 0 !== t.ref && (l = t.ref, u = F.current), void 0 !== t.key && (a = "" + t.key);
        var c = void 0;
        e.type && e.type.defaultProps && (c = e.type.defaultProps);

        for (r in t) {
          L.call(t, r) && !z.hasOwnProperty(r) && (i[r] = void 0 === t[r] && void 0 !== c ? c[r] : t[r]);
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
    version: "16.7.0",
    unstable_ConcurrentMode: O,
    unstable_Profiler: C,
    __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: {
      ReactCurrentOwner: F,
      assign: w
    }
  },
      H = {
    default: W
  },
      $ = H && W || H;
  e.exports = $.default || $;
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
    Lr = !1, zr = null, i.apply(Wr, arguments);
  }

  function l(e, t, n, r, i, l, u, c, s) {
    if (a.apply(this, arguments), Lr) {
      if (Lr) {
        var f = zr;
        Lr = !1, zr = null;
      } else o("198"), f = void 0;

      Br || (Br = !0, Vr = f);
    }
  }

  function u() {
    if (Hr) for (var e in $r) {
      var t = $r[e],
          n = Hr.indexOf(e);

      if (-1 < n || o("96", e), !qr[n]) {
        t.extractEvents || o("97", e), qr[n] = t, n = t.eventTypes;

        for (var r in n) {
          var i = void 0,
              a = n[r],
              l = t,
              u = r;
          Yr.hasOwnProperty(u) && o("99", u), Yr[u] = a;
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
    Qr[e] && o("100", e), Qr[e] = t, Kr[e] = t.eventTypes[n].dependencies;
  }

  function s(e, t, n) {
    var r = e.type || "unknown-event";
    e.currentTarget = Jr(n), l(r, t, void 0, e), e.currentTarget = null;
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
    var r = Xr(n);
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
    if (null !== e && (Zr = f(Zr, e)), e = Zr, Zr = null, e && (d(e, p), Zr && o("95"), Br)) throw e = Vr, Br = !1, Vr = null, e;
  }

  function y(e) {
    if (e[no]) return e[no];

    for (; !e[no];) {
      if (!e.parentNode) return null;
      e = e.parentNode;
    }

    return e = e[no], 5 === e.tag || 6 === e.tag ? e : null;
  }

  function v(e) {
    return e = e[no], !e || 5 !== e.tag && 6 !== e.tag ? null : e;
  }

  function g(e) {
    if (5 === e.tag || 6 === e.tag) return e.stateNode;
    o("33");
  }

  function b(e) {
    return e[ro] || null;
  }

  function w(e) {
    do {
      e = e.return;
    } while (e && 5 !== e.tag);

    return e || null;
  }

  function k(e, t, n) {
    (t = h(e, n.dispatchConfig.phasedRegistrationNames[t])) && (n._dispatchListeners = f(n._dispatchListeners, t), n._dispatchInstances = f(n._dispatchInstances, e));
  }

  function _(e) {
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

  function x(e, t, n) {
    e && n && n.dispatchConfig.registrationName && (t = h(e, n.dispatchConfig.registrationName)) && (n._dispatchListeners = f(n._dispatchListeners, t), n._dispatchInstances = f(n._dispatchInstances, e));
  }

  function T(e) {
    e && e.dispatchConfig.registrationName && x(e._targetInst, null, e);
  }

  function E(e) {
    d(e, _);
  }

  function C(e, t) {
    var n = {};
    return n[e.toLowerCase()] = t.toLowerCase(), n["Webkit" + e] = "webkit" + t, n["Moz" + e] = "moz" + t, n;
  }

  function S(e) {
    if (ao[e]) return ao[e];
    if (!io[e]) return e;
    var t,
        n = io[e];

    for (t in n) {
      if (n.hasOwnProperty(t) && t in lo) return ao[e] = n[t];
    }

    return e;
  }

  function P() {
    if (yo) return yo;
    var e,
        t,
        n = mo,
        r = n.length,
        o = "value" in ho ? ho.value : ho.textContent,
        i = o.length;

    for (e = 0; e < r && n[e] === o[e]; e++) {
      ;
    }

    var a = r - e;

    for (t = 1; t <= a && n[r - t] === o[i - t]; t++) {
      ;
    }

    return yo = o.slice(e, 1 < t ? 1 - t : void 0);
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

  function I(e) {
    e.eventPool = [], e.getPooled = j, e.release = M;
  }

  function A(e, t) {
    switch (e) {
      case "keyup":
        return -1 !== bo.indexOf(t.keyCode);

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

  function R(e) {
    return e = e.detail, "object" === _typeof(e) && "data" in e ? e.data : null;
  }

  function U(e, t) {
    switch (e) {
      case "compositionend":
        return R(t);

      case "keypress":
        return 32 !== t.which ? null : (Co = !0, To);

      case "textInput":
        return e = t.data, e === To && Co ? null : e;

      default:
        return null;
    }
  }

  function F(e, t) {
    if (So) return "compositionend" === e || !wo && A(e, t) ? (e = P(), yo = mo = ho = null, So = !1, e) : null;

    switch (e) {
      case "paste":
        return null;

      case "keypress":
        if (!(t.ctrlKey || t.altKey || t.metaKey) || t.ctrlKey && t.altKey) {
          if (t.char && 1 < t.char.length) return t.char;
          if (t.which) return String.fromCharCode(t.which);
        }

        return null;

      case "compositionend":
        return xo && "ko" !== t.locale ? null : t.data;

      default:
        return null;
    }
  }

  function L(e) {
    if (e = Gr(e)) {
      "function" !== typeof Oo && o("280");
      var t = Xr(e.stateNode);
      Oo(e.stateNode, e.type, t);
    }
  }

  function z(e) {
    No ? Do ? Do.push(e) : Do = [e] : No = e;
  }

  function B() {
    if (No) {
      var e = No,
          t = Do;
      if (Do = No = null, L(e), t) for (e = 0; e < t.length; e++) {
        L(t[e]);
      }
    }
  }

  function V(e, t) {
    return e(t);
  }

  function W(e, t, n) {
    return e(t, n);
  }

  function H() {}

  function $(e, t) {
    if (jo) return e(t);
    jo = !0;

    try {
      return V(e, t);
    } finally {
      jo = !1, (null !== No || null !== Do) && (H(), B());
    }
  }

  function q(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return "input" === t ? !!Mo[e.type] : "textarea" === t;
  }

  function Y(e) {
    return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), 3 === e.nodeType ? e.parentNode : e;
  }

  function Q(e) {
    if (!oo) return !1;
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
    return null === e || "object" !== _typeof(e) ? null : (e = Ko && e[Ko] || e["@@iterator"], "function" === typeof e ? e : null);
  }

  function ee(e) {
    if (null == e) return null;
    if ("function" === typeof e) return e.displayName || e.name || null;
    if ("string" === typeof e) return e;

    switch (e) {
      case Ho:
        return "ConcurrentMode";

      case Lo:
        return "Fragment";

      case Fo:
        return "Portal";

      case Bo:
        return "Profiler";

      case zo:
        return "StrictMode";

      case qo:
        return "Suspense";
    }

    if ("object" === _typeof(e)) switch (e.$$typeof) {
      case Wo:
        return "Context.Consumer";

      case Vo:
        return "Context.Provider";

      case $o:
        var t = e.render;
        return t = t.displayName || t.name || "", e.displayName || ("" !== t ? "ForwardRef(" + t + ")" : "ForwardRef");

      case Yo:
        return ee(e.type);

      case Qo:
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
          n = null, r && (n = ee(r.type)), r = i, i = "", o ? i = " (at " + o.fileName.replace(Ao, "") + ":" + o.lineNumber + ")" : n && (i = " (created by " + n + ")"), n = "\n    in " + (r || "Unknown") + i;
      }

      t += n, e = e.return;
    } while (e);

    return t;
  }

  function ne(e) {
    return !!Go.call(Zo, e) || !Go.call(Jo, e) && (Xo.test(e) ? Zo[e] = !0 : (Jo[e] = !0, !1));
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
    var o = ei.hasOwnProperty(t) ? ei[t] : null;
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
    return Ur({}, t, {
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
    return e = D.getPooled(ni.change, e, t, n), e.type = "change", z(n), E(e), e;
  }

  function ye(e) {
    m(e);
  }

  function ve(e) {
    if (J(g(e))) return e;
  }

  function ge(e, t) {
    if ("change" === e) return t;
  }

  function be() {
    ri && (ri.detachEvent("onpropertychange", we), oi = ri = null);
  }

  function we(e) {
    "value" === e.propertyName && ve(oi) && (e = me(oi, e, Y(e)), $(ye, e));
  }

  function ke(e, t, n) {
    "focus" === e ? (be(), ri = t, oi = n, ri.attachEvent("onpropertychange", we)) : "blur" === e && be();
  }

  function _e(e) {
    if ("selectionchange" === e || "keyup" === e || "keydown" === e) return ve(oi);
  }

  function xe(e, t) {
    if ("click" === e) return ve(t);
  }

  function Te(e, t) {
    if ("input" === e || "change" === e) return ve(t);
  }

  function Ee(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : !!(e = ui[e]) && !!t[e];
  }

  function Ce() {
    return Ee;
  }

  function Se(e, t) {
    return e === t ? 0 !== e || 0 !== t || 1 / e === 1 / t : e !== e && t !== t;
  }

  function Pe(e, t) {
    if (Se(e, t)) return !0;
    if ("object" !== _typeof(e) || null === e || "object" !== _typeof(t) || null === t) return !1;
    var n = Object.keys(e),
        r = Object.keys(t);
    if (n.length !== r.length) return !1;

    for (r = 0; r < n.length; r++) {
      if (!vi.call(t, n[r]) || !Se(e[n[r]], t[n[r]])) return !1;
    }

    return !0;
  }

  function Oe(e) {
    var t = e;
    if (e.alternate) for (; t.return;) {
      t = t.return;
    } else {
      if (0 !== (2 & t.effectTag)) return 1;

      for (; t.return;) {
        if (t = t.return, 0 !== (2 & t.effectTag)) return 1;
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
      var i = n.return,
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

      if (n.return !== r.return) n = i, r = a;else {
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
      if (t.child) t.child.return = t, t = t.child;else {
        if (t === e) break;

        for (; !t.sibling;) {
          if (!t.return || t.return === e) return null;
          t = t.return;
        }

        t.sibling.return = t.return, t = t.sibling;
      }
    }

    return null;
  }

  function Me(e) {
    var t = e.keyCode;
    return "charCode" in e ? 0 === (e = e.charCode) && 13 === t && (e = 13) : e = t, 10 === e && (e = 13), 32 <= e || 13 === e ? e : 0;
  }

  function Ie(e, t) {
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
    }, Oi[e] = t, Ni[n] = t;
  }

  function Ae(e) {
    var t = e.targetInst,
        n = t;

    do {
      if (!n) {
        e.ancestors.push(n);
        break;
      }

      var r;

      for (r = n; r.return;) {
        r = r.return;
      }

      if (!(r = 3 !== r.tag ? null : r.stateNode.containerInfo)) break;
      e.ancestors.push(n), n = y(r);
    } while (n);

    for (n = 0; n < e.ancestors.length; n++) {
      t = e.ancestors[n];
      var o = Y(e.nativeEvent);
      r = e.topLevelType;

      for (var i = e.nativeEvent, a = null, l = 0; l < qr.length; l++) {
        var u = qr[l];
        u && (u = u.extractEvents(r, t, i, o)) && (a = f(a, u));
      }

      m(a);
    }
  }

  function Re(e, t) {
    if (!t) return null;
    var n = (ji(e) ? Fe : Le).bind(null, e);
    t.addEventListener(e, n, !1);
  }

  function Ue(e, t) {
    if (!t) return null;
    var n = (ji(e) ? Fe : Le).bind(null, e);
    t.addEventListener(e, n, !0);
  }

  function Fe(e, t) {
    W(Le, e, t);
  }

  function Le(e, t) {
    if (Ii) {
      var n = Y(t);

      if (n = y(n), null === n || "number" !== typeof n.tag || 2 === Oe(n) || (n = null), Mi.length) {
        var r = Mi.pop();
        r.topLevelType = e, r.nativeEvent = t, r.targetInst = n, e = r;
      } else e = {
        topLevelType: e,
        nativeEvent: t,
        targetInst: n,
        ancestors: []
      };

      try {
        $(Ae, e);
      } finally {
        e.topLevelType = null, e.nativeEvent = null, e.targetInst = null, e.ancestors.length = 0, 10 > Mi.length && Mi.push(e);
      }
    }
  }

  function ze(e) {
    return Object.prototype.hasOwnProperty.call(e, Ui) || (e[Ui] = Ri++, Ai[e[Ui]] = {}), Ai[e[Ui]];
  }

  function Be(e) {
    if ("undefined" === typeof (e = e || ("undefined" !== typeof document ? document : void 0))) return null;

    try {
      return e.activeElement || e.body;
    } catch (t) {
      return e.body;
    }
  }

  function Ve(e) {
    for (; e && e.firstChild;) {
      e = e.firstChild;
    }

    return e;
  }

  function We(e, t) {
    var n = Ve(e);
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

      n = Ve(n);
    }
  }

  function He(e, t) {
    return !(!e || !t) && (e === t || (!e || 3 !== e.nodeType) && (t && 3 === t.nodeType ? He(e, t.parentNode) : "contains" in e ? e.contains(t) : !!e.compareDocumentPosition && !!(16 & e.compareDocumentPosition(t))));
  }

  function $e() {
    for (var e = window, t = Be(); t instanceof e.HTMLIFrameElement;) {
      try {
        e = t.contentDocument.defaultView;
      } catch (e) {
        break;
      }

      t = Be(e.document);
    }

    return t;
  }

  function qe(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t && ("input" === t && ("text" === e.type || "search" === e.type || "tel" === e.type || "url" === e.type || "password" === e.type) || "textarea" === t || "true" === e.contentEditable);
  }

  function Ye(e, t) {
    var n = t.window === t ? t.document : 9 === t.nodeType ? t : t.ownerDocument;
    return Wi || null == zi || zi !== Be(n) ? null : (n = zi, "selectionStart" in n && qe(n) ? n = {
      start: n.selectionStart,
      end: n.selectionEnd
    } : (n = (n.ownerDocument && n.ownerDocument.defaultView || window).getSelection(), n = {
      anchorNode: n.anchorNode,
      anchorOffset: n.anchorOffset,
      focusNode: n.focusNode,
      focusOffset: n.focusOffset
    }), Vi && Pe(Vi, n) ? null : (Vi = n, e = D.getPooled(Li.select, Bi, e, t), e.type = "select", e.target = zi, E(e), e));
  }

  function Qe(e) {
    var t = "";
    return Rr.Children.forEach(e, function (e) {
      null != e && (t += e);
    }), t;
  }

  function Ke(e, t) {
    return e = Ur({
      children: void 0
    }, t), (t = Qe(t.children)) && (e.children = t), e;
  }

  function Xe(e, t, n, r) {
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

  function Ge(e, t) {
    return null != t.dangerouslySetInnerHTML && o("91"), Ur({}, t, {
      value: void 0,
      defaultValue: void 0,
      children: "" + e._wrapperState.initialValue
    });
  }

  function Je(e, t) {
    var n = t.value;
    null == n && (n = t.defaultValue, t = t.children, null != t && (null != n && o("92"), Array.isArray(t) && (1 >= t.length || o("93"), t = t[0]), n = t), null == n && (n = "")), e._wrapperState = {
      initialValue: ue(n)
    };
  }

  function Ze(e, t) {
    var n = ue(t.value),
        r = ue(t.defaultValue);
    null != n && (n = "" + n, n !== e.value && (e.value = n), null == t.defaultValue && e.defaultValue !== n && (e.defaultValue = n)), null != r && (e.defaultValue = "" + r);
  }

  function et(e) {
    var t = e.textContent;
    t === e._wrapperState.initialValue && (e.value = t);
  }

  function tt(e) {
    switch (e) {
      case "svg":
        return "http://www.w3.org/2000/svg";

      case "math":
        return "http://www.w3.org/1998/Math/MathML";

      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }

  function nt(e, t) {
    return null == e || "http://www.w3.org/1999/xhtml" === e ? tt(t) : "http://www.w3.org/2000/svg" === e && "foreignObject" === t ? "http://www.w3.org/1999/xhtml" : e;
  }

  function rt(e, t) {
    if (t) {
      var n = e.firstChild;
      if (n && n === e.lastChild && 3 === n.nodeType) return void (n.nodeValue = t);
    }

    e.textContent = t;
  }

  function ot(e, t, n) {
    return null == t || "boolean" === typeof t || "" === t ? "" : n || "number" !== typeof t || 0 === t || Qi.hasOwnProperty(e) && Qi[e] ? ("" + t).trim() : t + "px";
  }

  function it(e, t) {
    e = e.style;

    for (var n in t) {
      if (t.hasOwnProperty(n)) {
        var r = 0 === n.indexOf("--"),
            o = ot(n, t[n], r);
        "float" === n && (n = "cssFloat"), r ? e.setProperty(n, o) : e[n] = o;
      }
    }
  }

  function at(e, t) {
    t && (Xi[e] && (null != t.children || null != t.dangerouslySetInnerHTML) && o("137", e, ""), null != t.dangerouslySetInnerHTML && (null != t.children && o("60"), "object" === _typeof(t.dangerouslySetInnerHTML) && "__html" in t.dangerouslySetInnerHTML || o("61")), null != t.style && "object" !== _typeof(t.style) && o("62", ""));
  }

  function lt(e, t) {
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

  function ut(e, t) {
    e = 9 === e.nodeType || 11 === e.nodeType ? e : e.ownerDocument;
    var n = ze(e);
    t = Kr[t];

    for (var r = 0; r < t.length; r++) {
      var o = t[r];

      if (!n.hasOwnProperty(o) || !n[o]) {
        switch (o) {
          case "scroll":
            Ue("scroll", e);
            break;

          case "focus":
          case "blur":
            Ue("focus", e), Ue("blur", e), n.blur = !0, n.focus = !0;
            break;

          case "cancel":
          case "close":
            Q(o) && Ue(o, e);
            break;

          case "invalid":
          case "submit":
          case "reset":
            break;

          default:
            -1 === po.indexOf(o) && Re(o, e);
        }

        n[o] = !0;
      }
    }
  }

  function ct() {}

  function st(e, t) {
    switch (e) {
      case "button":
      case "input":
      case "select":
      case "textarea":
        return !!t.autoFocus;
    }

    return !1;
  }

  function ft(e, t) {
    return "textarea" === e || "option" === e || "noscript" === e || "string" === typeof t.children || "number" === typeof t.children || "object" === _typeof(t.dangerouslySetInnerHTML) && null !== t.dangerouslySetInnerHTML && null != t.dangerouslySetInnerHTML.__html;
  }

  function dt(e, t, n, r, o) {
    e[ro] = o, "input" === n && "radio" === o.type && null != o.name && fe(e, o), lt(n, r), r = lt(n, o);

    for (var i = 0; i < t.length; i += 2) {
      var a = t[i],
          l = t[i + 1];
      "style" === a ? it(e, l) : "dangerouslySetInnerHTML" === a ? Yi(e, l) : "children" === a ? rt(e, l) : le(e, a, l, r);
    }

    switch (n) {
      case "input":
        de(e, o);
        break;

      case "textarea":
        Ze(e, o);
        break;

      case "select":
        t = e._wrapperState.wasMultiple, e._wrapperState.wasMultiple = !!o.multiple, n = o.value, null != n ? Xe(e, !!o.multiple, n, !1) : t !== !!o.multiple && (null != o.defaultValue ? Xe(e, !!o.multiple, o.defaultValue, !0) : Xe(e, !!o.multiple, o.multiple ? [] : "", !1));
    }
  }

  function pt(e) {
    for (e = e.nextSibling; e && 1 !== e.nodeType && 3 !== e.nodeType;) {
      e = e.nextSibling;
    }

    return e;
  }

  function ht(e) {
    for (e = e.firstChild; e && 1 !== e.nodeType && 3 !== e.nodeType;) {
      e = e.nextSibling;
    }

    return e;
  }

  function mt(e) {
    0 > na || (e.current = ta[na], ta[na] = null, na--);
  }

  function yt(e, t) {
    na++, ta[na] = e.current, e.current = t;
  }

  function vt(e, t) {
    var n = e.type.contextTypes;
    if (!n) return ra;
    var r = e.stateNode;
    if (r && r.__reactInternalMemoizedUnmaskedChildContext === t) return r.__reactInternalMemoizedMaskedChildContext;
    var o,
        i = {};

    for (o in n) {
      i[o] = t[o];
    }

    return r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = t, e.__reactInternalMemoizedMaskedChildContext = i), i;
  }

  function gt(e) {
    return null !== (e = e.childContextTypes) && void 0 !== e;
  }

  function bt(e) {
    mt(ia, e), mt(oa, e);
  }

  function wt(e) {
    mt(ia, e), mt(oa, e);
  }

  function kt(e, t, n) {
    oa.current !== ra && o("168"), yt(oa, t, e), yt(ia, n, e);
  }

  function _t(e, t, n) {
    var r = e.stateNode;
    if (e = t.childContextTypes, "function" !== typeof r.getChildContext) return n;
    r = r.getChildContext();

    for (var i in r) {
      i in e || o("108", ee(t) || "Unknown", i);
    }

    return Ur({}, n, r);
  }

  function xt(e) {
    var t = e.stateNode;
    return t = t && t.__reactInternalMemoizedMergedChildContext || ra, aa = oa.current, yt(oa, t, e), yt(ia, ia.current, e), !0;
  }

  function Tt(e, t, n) {
    var r = e.stateNode;
    r || o("169"), n ? (t = _t(e, t, aa), r.__reactInternalMemoizedMergedChildContext = t, mt(ia, e), mt(oa, e), yt(oa, t, e)) : mt(ia, e), yt(ia, n, e);
  }

  function Et(e) {
    return function (t) {
      try {
        return e(t);
      } catch (e) {}
    };
  }

  function Ct(e) {
    if ("undefined" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) return !1;
    var t = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (t.isDisabled || !t.supportsFiber) return !0;

    try {
      var n = t.inject(e);
      la = Et(function (e) {
        return t.onCommitFiberRoot(n, e);
      }), ua = Et(function (e) {
        return t.onCommitFiberUnmount(n, e);
      });
    } catch (e) {}

    return !0;
  }

  function St(e, t, n, r) {
    this.tag = e, this.key = n, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = t, this.firstContextDependency = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.effectTag = 0, this.lastEffect = this.firstEffect = this.nextEffect = null, this.childExpirationTime = this.expirationTime = 0, this.alternate = null;
  }

  function Pt(e, t, n, r) {
    return new St(e, t, n, r);
  }

  function Ot(e) {
    return !(!(e = e.prototype) || !e.isReactComponent);
  }

  function Nt(e) {
    if ("function" === typeof e) return Ot(e) ? 1 : 0;

    if (void 0 !== e && null !== e) {
      if ((e = e.$$typeof) === $o) return 11;
      if (e === Yo) return 14;
    }

    return 2;
  }

  function Dt(e, t) {
    var n = e.alternate;
    return null === n ? (n = Pt(e.tag, t, e.key, e.mode), n.elementType = e.elementType, n.type = e.type, n.stateNode = e.stateNode, n.alternate = e, e.alternate = n) : (n.pendingProps = t, n.effectTag = 0, n.nextEffect = null, n.firstEffect = null, n.lastEffect = null), n.childExpirationTime = e.childExpirationTime, n.expirationTime = e.expirationTime, n.child = e.child, n.memoizedProps = e.memoizedProps, n.memoizedState = e.memoizedState, n.updateQueue = e.updateQueue, n.firstContextDependency = e.firstContextDependency, n.sibling = e.sibling, n.index = e.index, n.ref = e.ref, n;
  }

  function jt(e, t, n, r, i, a) {
    var l = 2;
    if (r = e, "function" === typeof e) Ot(e) && (l = 1);else if ("string" === typeof e) l = 5;else e: switch (e) {
      case Lo:
        return Mt(n.children, i, a, t);

      case Ho:
        return It(n, 3 | i, a, t);

      case zo:
        return It(n, 2 | i, a, t);

      case Bo:
        return e = Pt(12, n, t, 4 | i), e.elementType = Bo, e.type = Bo, e.expirationTime = a, e;

      case qo:
        return e = Pt(13, n, t, i), e.elementType = qo, e.type = qo, e.expirationTime = a, e;

      default:
        if ("object" === _typeof(e) && null !== e) switch (e.$$typeof) {
          case Vo:
            l = 10;
            break e;

          case Wo:
            l = 9;
            break e;

          case $o:
            l = 11;
            break e;

          case Yo:
            l = 14;
            break e;

          case Qo:
            l = 16, r = null;
            break e;
        }
        o("130", null == e ? e : _typeof(e), "");
    }
    return t = Pt(l, n, t, i), t.elementType = e, t.type = r, t.expirationTime = a, t;
  }

  function Mt(e, t, n, r) {
    return e = Pt(7, e, r, t), e.expirationTime = n, e;
  }

  function It(e, t, n, r) {
    return e = Pt(8, e, r, t), t = 0 === (1 & t) ? zo : Ho, e.elementType = t, e.type = t, e.expirationTime = n, e;
  }

  function At(e, t, n) {
    return e = Pt(6, e, null, t), e.expirationTime = n, e;
  }

  function Rt(e, t, n) {
    return t = Pt(4, null !== e.children ? e.children : [], e.key, t), t.expirationTime = n, t.stateNode = {
      containerInfo: e.containerInfo,
      pendingChildren: null,
      implementation: e.implementation
    }, t;
  }

  function Ut(e, t) {
    e.didError = !1;
    var n = e.earliestPendingTime;
    0 === n ? e.earliestPendingTime = e.latestPendingTime = t : n < t ? e.earliestPendingTime = t : e.latestPendingTime > t && (e.latestPendingTime = t), zt(t, e);
  }

  function Ft(e, t) {
    e.didError = !1, e.latestPingedTime >= t && (e.latestPingedTime = 0);
    var n = e.earliestPendingTime,
        r = e.latestPendingTime;
    n === t ? e.earliestPendingTime = r === t ? e.latestPendingTime = 0 : r : r === t && (e.latestPendingTime = n), n = e.earliestSuspendedTime, r = e.latestSuspendedTime, 0 === n ? e.earliestSuspendedTime = e.latestSuspendedTime = t : n < t ? e.earliestSuspendedTime = t : r > t && (e.latestSuspendedTime = t), zt(t, e);
  }

  function Lt(e, t) {
    var n = e.earliestPendingTime;
    return e = e.earliestSuspendedTime, n > t && (t = n), e > t && (t = e), t;
  }

  function zt(e, t) {
    var n = t.earliestSuspendedTime,
        r = t.latestSuspendedTime,
        o = t.earliestPendingTime,
        i = t.latestPingedTime;
    o = 0 !== o ? o : i, 0 === o && (0 === e || r < e) && (o = r), e = o, 0 !== e && n > e && (e = n), t.nextExpirationTimeToWorkOn = o, t.expirationTime = e;
  }

  function Bt(e) {
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

  function Vt(e) {
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

  function Wt(e) {
    return {
      expirationTime: e,
      tag: 0,
      payload: null,
      callback: null,
      next: null,
      nextEffect: null
    };
  }

  function Ht(e, t) {
    null === e.lastUpdate ? e.firstUpdate = e.lastUpdate = t : (e.lastUpdate.next = t, e.lastUpdate = t);
  }

  function $t(e, t) {
    var n = e.alternate;

    if (null === n) {
      var r = e.updateQueue,
          o = null;
      null === r && (r = e.updateQueue = Bt(e.memoizedState));
    } else r = e.updateQueue, o = n.updateQueue, null === r ? null === o ? (r = e.updateQueue = Bt(e.memoizedState), o = n.updateQueue = Bt(n.memoizedState)) : r = e.updateQueue = Vt(o) : null === o && (o = n.updateQueue = Vt(r));

    null === o || r === o ? Ht(r, t) : null === r.lastUpdate || null === o.lastUpdate ? (Ht(r, t), Ht(o, t)) : (Ht(r, t), o.lastUpdate = t);
  }

  function qt(e, t) {
    var n = e.updateQueue;
    n = null === n ? e.updateQueue = Bt(e.memoizedState) : Yt(e, n), null === n.lastCapturedUpdate ? n.firstCapturedUpdate = n.lastCapturedUpdate = t : (n.lastCapturedUpdate.next = t, n.lastCapturedUpdate = t);
  }

  function Yt(e, t) {
    var n = e.alternate;
    return null !== n && t === n.updateQueue && (t = e.updateQueue = Vt(t)), t;
  }

  function Qt(e, t, n, r, o, i) {
    switch (n.tag) {
      case 1:
        return e = n.payload, "function" === typeof e ? e.call(i, r, o) : e;

      case 3:
        e.effectTag = -2049 & e.effectTag | 64;

      case 0:
        if (e = n.payload, null === (o = "function" === typeof e ? e.call(i, r, o) : e) || void 0 === o) break;
        return Ur({}, r, o);

      case 2:
        ca = !0;
    }

    return r;
  }

  function Kt(e, t, n, r, o) {
    ca = !1, t = Yt(e, t);

    for (var i = t.baseState, a = null, l = 0, u = t.firstUpdate, c = i; null !== u;) {
      var s = u.expirationTime;
      s < o ? (null === a && (a = u, i = c), l < s && (l = s)) : (c = Qt(e, t, u, c, n, r), null !== u.callback && (e.effectTag |= 32, u.nextEffect = null, null === t.lastEffect ? t.firstEffect = t.lastEffect = u : (t.lastEffect.nextEffect = u, t.lastEffect = u))), u = u.next;
    }

    for (s = null, u = t.firstCapturedUpdate; null !== u;) {
      var f = u.expirationTime;
      f < o ? (null === s && (s = u, null === a && (i = c)), l < f && (l = f)) : (c = Qt(e, t, u, c, n, r), null !== u.callback && (e.effectTag |= 32, u.nextEffect = null, null === t.lastCapturedEffect ? t.firstCapturedEffect = t.lastCapturedEffect = u : (t.lastCapturedEffect.nextEffect = u, t.lastCapturedEffect = u))), u = u.next;
    }

    null === a && (t.lastUpdate = null), null === s ? t.lastCapturedUpdate = null : e.effectTag |= 32, null === a && null === s && (i = c), t.baseState = i, t.firstUpdate = a, t.firstCapturedUpdate = s, e.expirationTime = l, e.memoizedState = c;
  }

  function Xt(e, t, n) {
    null !== t.firstCapturedUpdate && (null !== t.lastUpdate && (t.lastUpdate.next = t.firstCapturedUpdate, t.lastUpdate = t.lastCapturedUpdate), t.firstCapturedUpdate = t.lastCapturedUpdate = null), Gt(t.firstEffect, n), t.firstEffect = t.lastEffect = null, Gt(t.firstCapturedEffect, n), t.firstCapturedEffect = t.lastCapturedEffect = null;
  }

  function Gt(e, t) {
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

  function Jt(e, t) {
    return {
      value: e,
      source: t,
      stack: te(t)
    };
  }

  function Zt(e, t) {
    var n = e.type._context;
    yt(sa, n._currentValue, e), n._currentValue = t;
  }

  function en(e) {
    var t = sa.current;
    mt(sa, e), e.type._context._currentValue = t;
  }

  function tn(e) {
    fa = e, pa = da = null, e.firstContextDependency = null;
  }

  function nn(e, t) {
    return pa !== e && !1 !== t && 0 !== t && ("number" === typeof t && 1073741823 !== t || (pa = e, t = 1073741823), t = {
      context: e,
      observedBits: t,
      next: null
    }, null === da ? (null === fa && o("293"), fa.firstContextDependency = da = t) : da = da.next = t), e._currentValue;
  }

  function rn(e) {
    return e === ha && o("174"), e;
  }

  function on(e, t) {
    yt(va, t, e), yt(ya, e, e), yt(ma, ha, e);
    var n = t.nodeType;

    switch (n) {
      case 9:
      case 11:
        t = (t = t.documentElement) ? t.namespaceURI : nt(null, "");
        break;

      default:
        n = 8 === n ? t.parentNode : t, t = n.namespaceURI || null, n = n.tagName, t = nt(t, n);
    }

    mt(ma, e), yt(ma, t, e);
  }

  function an(e) {
    mt(ma, e), mt(ya, e), mt(va, e);
  }

  function ln(e) {
    rn(va.current);
    var t = rn(ma.current),
        n = nt(t, e.type);
    t !== n && (yt(ya, e, e), yt(ma, n, e));
  }

  function un(e) {
    ya.current === e && (mt(ma, e), mt(ya, e));
  }

  function cn(e, t) {
    if (e && e.defaultProps) {
      t = Ur({}, t), e = e.defaultProps;

      for (var n in e) {
        void 0 === t[n] && (t[n] = e[n]);
      }
    }

    return t;
  }

  function sn(e) {
    var t = e._result;

    switch (e._status) {
      case 1:
        return t;

      case 2:
      case 0:
        throw t;

      default:
        throw e._status = 0, t = e._ctor, t = t(), t.then(function (t) {
          0 === e._status && (t = t.default, e._status = 1, e._result = t);
        }, function (t) {
          0 === e._status && (e._status = 2, e._result = t);
        }), e._result = t, t;
    }
  }

  function fn(e, t, n, r) {
    t = e.memoizedState, n = n(r, t), n = null === n || void 0 === n ? t : Ur({}, t, n), e.memoizedState = n, null !== (r = e.updateQueue) && 0 === e.expirationTime && (r.baseState = n);
  }

  function dn(e, t, n, r, o, i, a) {
    return e = e.stateNode, "function" === typeof e.shouldComponentUpdate ? e.shouldComponentUpdate(r, i, a) : !t.prototype || !t.prototype.isPureReactComponent || !Pe(n, r) || !Pe(o, i);
  }

  function pn(e, t, n) {
    var r = !1,
        o = ra,
        i = t.contextType;
    return "object" === _typeof(i) && null !== i ? i = ga.currentDispatcher.readContext(i) : (o = gt(t) ? aa : oa.current, r = t.contextTypes, i = (r = null !== r && void 0 !== r) ? vt(e, o) : ra), t = new t(n, i), e.memoizedState = null !== t.state && void 0 !== t.state ? t.state : null, t.updater = wa, e.stateNode = t, t._reactInternalFiber = e, r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = o, e.__reactInternalMemoizedMaskedChildContext = i), t;
  }

  function hn(e, t, n, r) {
    e = t.state, "function" === typeof t.componentWillReceiveProps && t.componentWillReceiveProps(n, r), "function" === typeof t.UNSAFE_componentWillReceiveProps && t.UNSAFE_componentWillReceiveProps(n, r), t.state !== e && wa.enqueueReplaceState(t, t.state, null);
  }

  function mn(e, t, n, r) {
    var o = e.stateNode;
    o.props = n, o.state = e.memoizedState, o.refs = ba;
    var i = t.contextType;
    "object" === _typeof(i) && null !== i ? o.context = ga.currentDispatcher.readContext(i) : (i = gt(t) ? aa : oa.current, o.context = vt(e, i)), i = e.updateQueue, null !== i && (Kt(e, i, n, o, r), o.state = e.memoizedState), i = t.getDerivedStateFromProps, "function" === typeof i && (fn(e, t, i, n), o.state = e.memoizedState), "function" === typeof t.getDerivedStateFromProps || "function" === typeof o.getSnapshotBeforeUpdate || "function" !== typeof o.UNSAFE_componentWillMount && "function" !== typeof o.componentWillMount || (t = o.state, "function" === typeof o.componentWillMount && o.componentWillMount(), "function" === typeof o.UNSAFE_componentWillMount && o.UNSAFE_componentWillMount(), t !== o.state && wa.enqueueReplaceState(o, o.state, null), null !== (i = e.updateQueue) && (Kt(e, i, n, o, r), o.state = e.memoizedState)), "function" === typeof o.componentDidMount && (e.effectTag |= 4);
  }

  function yn(e, t, n) {
    if (null !== (e = n.ref) && "function" !== typeof e && "object" !== _typeof(e)) {
      if (n._owner) {
        n = n._owner;
        var r = void 0;
        n && (1 !== n.tag && o("289"), r = n.stateNode), r || o("147", e);
        var i = "" + e;
        return null !== t && null !== t.ref && "function" === typeof t.ref && t.ref._stringRef === i ? t.ref : (t = function t(e) {
          var t = r.refs;
          t === ba && (t = r.refs = {}), null === e ? delete t[i] : t[i] = e;
        }, t._stringRef = i, t);
      }

      "string" !== typeof e && o("284"), n._owner || o("290", e);
    }

    return e;
  }

  function vn(e, t) {
    "textarea" !== e.type && o("31", "[object Object]" === Object.prototype.toString.call(t) ? "object with keys {" + Object.keys(t).join(", ") + "}" : t, "");
  }

  function gn(e) {
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
      return e = Dt(e, t, n), e.index = 0, e.sibling = null, e;
    }

    function a(t, n, r) {
      return t.index = r, e ? null !== (r = t.alternate) ? (r = r.index, r < n ? (t.effectTag = 2, n) : r) : (t.effectTag = 2, n) : n;
    }

    function l(t) {
      return e && null === t.alternate && (t.effectTag = 2), t;
    }

    function u(e, t, n, r) {
      return null === t || 6 !== t.tag ? (t = At(n, e.mode, r), t.return = e, t) : (t = i(t, n, r), t.return = e, t);
    }

    function c(e, t, n, r) {
      return null !== t && t.elementType === n.type ? (r = i(t, n.props, r), r.ref = yn(e, t, n), r.return = e, r) : (r = jt(n.type, n.key, n.props, null, e.mode, r), r.ref = yn(e, t, n), r.return = e, r);
    }

    function s(e, t, n, r) {
      return null === t || 4 !== t.tag || t.stateNode.containerInfo !== n.containerInfo || t.stateNode.implementation !== n.implementation ? (t = Rt(n, e.mode, r), t.return = e, t) : (t = i(t, n.children || [], r), t.return = e, t);
    }

    function f(e, t, n, r, o) {
      return null === t || 7 !== t.tag ? (t = Mt(n, e.mode, r, o), t.return = e, t) : (t = i(t, n, r), t.return = e, t);
    }

    function d(e, t, n) {
      if ("string" === typeof t || "number" === typeof t) return t = At("" + t, e.mode, n), t.return = e, t;

      if ("object" === _typeof(t) && null !== t) {
        switch (t.$$typeof) {
          case Uo:
            return n = jt(t.type, t.key, t.props, null, e.mode, n), n.ref = yn(e, null, t), n.return = e, n;

          case Fo:
            return t = Rt(t, e.mode, n), t.return = e, t;
        }

        if (ka(t) || Z(t)) return t = Mt(t, e.mode, n, null), t.return = e, t;
        vn(e, t);
      }

      return null;
    }

    function p(e, t, n, r) {
      var o = null !== t ? t.key : null;
      if ("string" === typeof n || "number" === typeof n) return null !== o ? null : u(e, t, "" + n, r);

      if ("object" === _typeof(n) && null !== n) {
        switch (n.$$typeof) {
          case Uo:
            return n.key === o ? n.type === Lo ? f(e, t, n.props.children, r, o) : c(e, t, n, r) : null;

          case Fo:
            return n.key === o ? s(e, t, n, r) : null;
        }

        if (ka(n) || Z(n)) return null !== o ? null : f(e, t, n, r, null);
        vn(e, n);
      }

      return null;
    }

    function h(e, t, n, r, o) {
      if ("string" === typeof r || "number" === typeof r) return e = e.get(n) || null, u(t, e, "" + r, o);

      if ("object" === _typeof(r) && null !== r) {
        switch (r.$$typeof) {
          case Uo:
            return e = e.get(null === r.key ? n : r.key) || null, r.type === Lo ? f(t, e, r.props.children, o, r.key) : c(t, e, r, o);

          case Fo:
            return e = e.get(null === r.key ? n : r.key) || null, s(t, e, r, o);
        }

        if (ka(r) || Z(r)) return e = e.get(n) || null, f(t, e, r, o, null);
        vn(t, r);
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
        (y = h(f, o, m, l[m], u)) && (e && null !== y.alternate && f.delete(null === y.key ? m : y.key), i = a(y, i, m), null === s ? c = y : s.sibling = y, s = y);
      }

      return e && f.forEach(function (e) {
        return t(o, e);
      }), c;
    }

    function y(i, l, u, c) {
      var s = Z(u);
      "function" !== typeof s && o("150"), null == (u = s.call(u)) && o("151");

      for (var f = s = null, m = l, y = l = 0, v = null, g = u.next(); null !== m && !g.done; y++, g = u.next()) {
        m.index > y ? (v = m, m = null) : v = m.sibling;
        var b = p(i, m, g.value, c);

        if (null === b) {
          m || (m = v);
          break;
        }

        e && m && null === b.alternate && t(i, m), l = a(b, l, y), null === f ? s = b : f.sibling = b, f = b, m = v;
      }

      if (g.done) return n(i, m), s;

      if (null === m) {
        for (; !g.done; y++, g = u.next()) {
          null !== (g = d(i, g.value, c)) && (l = a(g, l, y), null === f ? s = g : f.sibling = g, f = g);
        }

        return s;
      }

      for (m = r(i, m); !g.done; y++, g = u.next()) {
        null !== (g = h(m, i, y, g.value, c)) && (e && null !== g.alternate && m.delete(null === g.key ? y : g.key), l = a(g, l, y), null === f ? s = g : f.sibling = g, f = g);
      }

      return e && m.forEach(function (e) {
        return t(i, e);
      }), s;
    }

    return function (e, r, a, u) {
      var c = "object" === _typeof(a) && null !== a && a.type === Lo && null === a.key;
      c && (a = a.props.children);
      var s = "object" === _typeof(a) && null !== a;
      if (s) switch (a.$$typeof) {
        case Uo:
          e: {
            for (s = a.key, c = r; null !== c;) {
              if (c.key === s) {
                if (7 === c.tag ? a.type === Lo : c.elementType === a.type) {
                  n(e, c.sibling), r = i(c, a.type === Lo ? a.props.children : a.props, u), r.ref = yn(e, c, a), r.return = e, e = r;
                  break e;
                }

                n(e, c);
                break;
              }

              t(e, c), c = c.sibling;
            }

            a.type === Lo ? (r = Mt(a.props.children, e.mode, u, a.key), r.return = e, e = r) : (u = jt(a.type, a.key, a.props, null, e.mode, u), u.ref = yn(e, r, a), u.return = e, e = u);
          }

          return l(e);

        case Fo:
          e: {
            for (c = a.key; null !== r;) {
              if (r.key === c) {
                if (4 === r.tag && r.stateNode.containerInfo === a.containerInfo && r.stateNode.implementation === a.implementation) {
                  n(e, r.sibling), r = i(r, a.children || [], u), r.return = e, e = r;
                  break e;
                }

                n(e, r);
                break;
              }

              t(e, r), r = r.sibling;
            }

            r = Rt(a, e.mode, u), r.return = e, e = r;
          }

          return l(e);
      }
      if ("string" === typeof a || "number" === typeof a) return a = "" + a, null !== r && 6 === r.tag ? (n(e, r.sibling), r = i(r, a, u), r.return = e, e = r) : (n(e, r), r = At(a, e.mode, u), r.return = e, e = r), l(e);
      if (ka(a)) return m(e, r, a, u);
      if (Z(a)) return y(e, r, a, u);
      if (s && vn(e, a), "undefined" === typeof a && !c) switch (e.tag) {
        case 1:
        case 0:
          u = e.type, o("152", u.displayName || u.name || "Component");
      }
      return n(e, r);
    };
  }

  function bn(e, t) {
    var n = Pt(5, null, null, 0);
    n.elementType = "DELETED", n.type = "DELETED", n.stateNode = t, n.return = e, n.effectTag = 8, null !== e.lastEffect ? (e.lastEffect.nextEffect = n, e.lastEffect = n) : e.firstEffect = e.lastEffect = n;
  }

  function wn(e, t) {
    switch (e.tag) {
      case 5:
        var n = e.type;
        return null !== (t = 1 !== t.nodeType || n.toLowerCase() !== t.nodeName.toLowerCase() ? null : t) && (e.stateNode = t, !0);

      case 6:
        return null !== (t = "" === e.pendingProps || 3 !== t.nodeType ? null : t) && (e.stateNode = t, !0);

      default:
        return !1;
    }
  }

  function kn(e) {
    if (Ca) {
      var t = Ea;

      if (t) {
        var n = t;

        if (!wn(e, t)) {
          if (!(t = pt(n)) || !wn(e, t)) return e.effectTag |= 2, Ca = !1, void (Ta = e);
          bn(Ta, n);
        }

        Ta = e, Ea = ht(t);
      } else e.effectTag |= 2, Ca = !1, Ta = e;
    }
  }

  function _n(e) {
    for (e = e.return; null !== e && 5 !== e.tag && 3 !== e.tag;) {
      e = e.return;
    }

    Ta = e;
  }

  function xn(e) {
    if (e !== Ta) return !1;
    if (!Ca) return _n(e), Ca = !0, !1;
    var t = e.type;
    if (5 !== e.tag || "head" !== t && "body" !== t && !ft(t, e.memoizedProps)) for (t = Ea; t;) {
      bn(e, t), t = pt(t);
    }
    return _n(e), Ea = Ta ? pt(e.stateNode) : null, !0;
  }

  function Tn() {
    Ea = Ta = null, Ca = !1;
  }

  function En(e, t, n, r) {
    t.child = null === e ? xa(t, null, n, r) : _a(t, e.child, n, r);
  }

  function Cn(e, t, n, r, o) {
    n = n.render;
    var i = t.ref;
    return tn(t, o), r = n(r, i), t.effectTag |= 1, En(e, t, r, o), t.child;
  }

  function Sn(e, t, n, r, o, i) {
    if (null === e) {
      var a = n.type;
      return "function" !== typeof a || Ot(a) || void 0 !== a.defaultProps || null !== n.compare || void 0 !== n.defaultProps ? (e = jt(n.type, null, r, null, t.mode, i), e.ref = t.ref, e.return = t, t.child = e) : (t.tag = 15, t.type = a, Pn(e, t, a, r, o, i));
    }

    return a = e.child, o < i && (o = a.memoizedProps, n = n.compare, (n = null !== n ? n : Pe)(o, r) && e.ref === t.ref) ? An(e, t, i) : (t.effectTag |= 1, e = Dt(a, r, i), e.ref = t.ref, e.return = t, t.child = e);
  }

  function Pn(e, t, n, r, o, i) {
    return null !== e && o < i && Pe(e.memoizedProps, r) && e.ref === t.ref ? An(e, t, i) : Nn(e, t, n, r, i);
  }

  function On(e, t) {
    var n = t.ref;
    (null === e && null !== n || null !== e && e.ref !== n) && (t.effectTag |= 128);
  }

  function Nn(e, t, n, r, o) {
    var i = gt(n) ? aa : oa.current;
    return i = vt(t, i), tn(t, o), n = n(r, i), t.effectTag |= 1, En(e, t, n, o), t.child;
  }

  function Dn(e, t, n, r, o) {
    if (gt(n)) {
      var i = !0;
      xt(t);
    } else i = !1;

    if (tn(t, o), null === t.stateNode) null !== e && (e.alternate = null, t.alternate = null, t.effectTag |= 2), pn(t, n, r, o), mn(t, n, r, o), r = !0;else if (null === e) {
      var a = t.stateNode,
          l = t.memoizedProps;
      a.props = l;
      var u = a.context,
          c = n.contextType;
      "object" === _typeof(c) && null !== c ? c = ga.currentDispatcher.readContext(c) : (c = gt(n) ? aa : oa.current, c = vt(t, c));
      var s = n.getDerivedStateFromProps,
          f = "function" === typeof s || "function" === typeof a.getSnapshotBeforeUpdate;
      f || "function" !== typeof a.UNSAFE_componentWillReceiveProps && "function" !== typeof a.componentWillReceiveProps || (l !== r || u !== c) && hn(t, a, r, c), ca = !1;
      var d = t.memoizedState;
      u = a.state = d;
      var p = t.updateQueue;
      null !== p && (Kt(t, p, r, a, o), u = t.memoizedState), l !== r || d !== u || ia.current || ca ? ("function" === typeof s && (fn(t, n, s, r), u = t.memoizedState), (l = ca || dn(t, n, l, r, d, u, c)) ? (f || "function" !== typeof a.UNSAFE_componentWillMount && "function" !== typeof a.componentWillMount || ("function" === typeof a.componentWillMount && a.componentWillMount(), "function" === typeof a.UNSAFE_componentWillMount && a.UNSAFE_componentWillMount()), "function" === typeof a.componentDidMount && (t.effectTag |= 4)) : ("function" === typeof a.componentDidMount && (t.effectTag |= 4), t.memoizedProps = r, t.memoizedState = u), a.props = r, a.state = u, a.context = c, r = l) : ("function" === typeof a.componentDidMount && (t.effectTag |= 4), r = !1);
    } else a = t.stateNode, l = t.memoizedProps, a.props = t.type === t.elementType ? l : cn(t.type, l), u = a.context, c = n.contextType, "object" === _typeof(c) && null !== c ? c = ga.currentDispatcher.readContext(c) : (c = gt(n) ? aa : oa.current, c = vt(t, c)), s = n.getDerivedStateFromProps, (f = "function" === typeof s || "function" === typeof a.getSnapshotBeforeUpdate) || "function" !== typeof a.UNSAFE_componentWillReceiveProps && "function" !== typeof a.componentWillReceiveProps || (l !== r || u !== c) && hn(t, a, r, c), ca = !1, u = t.memoizedState, d = a.state = u, p = t.updateQueue, null !== p && (Kt(t, p, r, a, o), d = t.memoizedState), l !== r || u !== d || ia.current || ca ? ("function" === typeof s && (fn(t, n, s, r), d = t.memoizedState), (s = ca || dn(t, n, l, r, u, d, c)) ? (f || "function" !== typeof a.UNSAFE_componentWillUpdate && "function" !== typeof a.componentWillUpdate || ("function" === typeof a.componentWillUpdate && a.componentWillUpdate(r, d, c), "function" === typeof a.UNSAFE_componentWillUpdate && a.UNSAFE_componentWillUpdate(r, d, c)), "function" === typeof a.componentDidUpdate && (t.effectTag |= 4), "function" === typeof a.getSnapshotBeforeUpdate && (t.effectTag |= 256)) : ("function" !== typeof a.componentDidUpdate || l === e.memoizedProps && u === e.memoizedState || (t.effectTag |= 4), "function" !== typeof a.getSnapshotBeforeUpdate || l === e.memoizedProps && u === e.memoizedState || (t.effectTag |= 256), t.memoizedProps = r, t.memoizedState = d), a.props = r, a.state = d, a.context = c, r = s) : ("function" !== typeof a.componentDidUpdate || l === e.memoizedProps && u === e.memoizedState || (t.effectTag |= 4), "function" !== typeof a.getSnapshotBeforeUpdate || l === e.memoizedProps && u === e.memoizedState || (t.effectTag |= 256), r = !1);
    return jn(e, t, n, r, i, o);
  }

  function jn(e, t, n, r, o, i) {
    On(e, t);
    var a = 0 !== (64 & t.effectTag);
    if (!r && !a) return o && Tt(t, n, !1), An(e, t, i);
    r = t.stateNode, Sa.current = t;
    var l = a && "function" !== typeof n.getDerivedStateFromError ? null : r.render();
    return t.effectTag |= 1, null !== e && a ? (t.child = _a(t, e.child, null, i), t.child = _a(t, null, l, i)) : En(e, t, l, i), t.memoizedState = r.state, o && Tt(t, n, !0), t.child;
  }

  function Mn(e) {
    var t = e.stateNode;
    t.pendingContext ? kt(e, t.pendingContext, t.pendingContext !== t.context) : t.context && kt(e, t.context, !1), on(e, t.containerInfo);
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
        e = Mt(null, r, 0, null), 0 === (1 & t.mode) && (e.child = null !== t.memoizedState ? t.child.child : t.child), r = Mt(l, r, n, null), e.sibling = r, n = e, n.return = r.return = t;
      } else n = r = xa(t, null, o.children, n);
    } else null !== e.memoizedState ? (r = e.child, l = r.sibling, a ? (n = o.fallback, o = Dt(r, r.pendingProps, 0), 0 === (1 & t.mode) && (a = null !== t.memoizedState ? t.child.child : t.child) !== r.child && (o.child = a), r = o.sibling = Dt(l, n, l.expirationTime), n = o, o.childExpirationTime = 0, n.return = r.return = t) : n = r = _a(t, r.child, o.children, n)) : (l = e.child, a ? (a = o.fallback, o = Mt(null, r, 0, null), o.child = l, 0 === (1 & t.mode) && (o.child = null !== t.memoizedState ? t.child.child : t.child), r = o.sibling = Mt(a, r, n, null), r.effectTag |= 2, n = o, o.childExpirationTime = 0, n.return = r.return = t) : r = n = _a(t, l, o.children, n)), t.stateNode = e.stateNode;
    return t.memoizedState = i, t.child = n, r;
  }

  function An(e, t, n) {
    if (null !== e && (t.firstContextDependency = e.firstContextDependency), t.childExpirationTime < n) return null;

    if (null !== e && t.child !== e.child && o("153"), null !== t.child) {
      for (e = t.child, n = Dt(e, e.pendingProps, e.expirationTime), t.child = n, n.return = t; null !== e.sibling;) {
        e = e.sibling, n = n.sibling = Dt(e, e.pendingProps, e.expirationTime), n.return = t;
      }

      n.sibling = null;
    }

    return t.child;
  }

  function Rn(e, t, n) {
    var r = t.expirationTime;

    if (null !== e && e.memoizedProps === t.pendingProps && !ia.current && r < n) {
      switch (t.tag) {
        case 3:
          Mn(t), Tn();
          break;

        case 5:
          ln(t);
          break;

        case 1:
          gt(t.type) && xt(t);
          break;

        case 4:
          on(t, t.stateNode.containerInfo);
          break;

        case 10:
          Zt(t, t.memoizedProps.value);
          break;

        case 13:
          if (null !== t.memoizedState) return 0 !== (r = t.child.childExpirationTime) && r >= n ? In(e, t, n) : (t = An(e, t, n), null !== t ? t.sibling : null);
      }

      return An(e, t, n);
    }

    switch (t.expirationTime = 0, t.tag) {
      case 2:
        r = t.elementType, null !== e && (e.alternate = null, t.alternate = null, t.effectTag |= 2), e = t.pendingProps;
        var i = vt(t, oa.current);

        if (tn(t, n), i = r(e, i), t.effectTag |= 1, "object" === _typeof(i) && null !== i && "function" === typeof i.render && void 0 === i.$$typeof) {
          if (t.tag = 1, gt(r)) {
            var a = !0;
            xt(t);
          } else a = !1;

          t.memoizedState = null !== i.state && void 0 !== i.state ? i.state : null;
          var l = r.getDerivedStateFromProps;
          "function" === typeof l && fn(t, r, l, e), i.updater = wa, t.stateNode = i, i._reactInternalFiber = t, mn(t, r, e, n), t = jn(null, t, r, !0, a, n);
        } else t.tag = 0, En(null, t, i, n), t = t.child;

        return t;

      case 16:
        switch (i = t.elementType, null !== e && (e.alternate = null, t.alternate = null, t.effectTag |= 2), a = t.pendingProps, e = sn(i), t.type = e, i = t.tag = Nt(e), a = cn(e, a), l = void 0, i) {
          case 0:
            l = Nn(null, t, e, a, n);
            break;

          case 1:
            l = Dn(null, t, e, a, n);
            break;

          case 11:
            l = Cn(null, t, e, a, n);
            break;

          case 14:
            l = Sn(null, t, e, cn(e.type, a), r, n);
            break;

          default:
            o("306", e, "");
        }

        return l;

      case 0:
        return r = t.type, i = t.pendingProps, i = t.elementType === r ? i : cn(r, i), Nn(e, t, r, i, n);

      case 1:
        return r = t.type, i = t.pendingProps, i = t.elementType === r ? i : cn(r, i), Dn(e, t, r, i, n);

      case 3:
        return Mn(t), r = t.updateQueue, null === r && o("282"), i = t.memoizedState, i = null !== i ? i.element : null, Kt(t, r, t.pendingProps, null, n), r = t.memoizedState.element, r === i ? (Tn(), t = An(e, t, n)) : (i = t.stateNode, (i = (null === e || null === e.child) && i.hydrate) && (Ea = ht(t.stateNode.containerInfo), Ta = t, i = Ca = !0), i ? (t.effectTag |= 2, t.child = xa(t, null, r, n)) : (En(e, t, r, n), Tn()), t = t.child), t;

      case 5:
        return ln(t), null === e && kn(t), r = t.type, i = t.pendingProps, a = null !== e ? e.memoizedProps : null, l = i.children, ft(r, i) ? l = null : null !== a && ft(r, a) && (t.effectTag |= 16), On(e, t), 1 !== n && 1 & t.mode && i.hidden ? (t.expirationTime = 1, t = null) : (En(e, t, l, n), t = t.child), t;

      case 6:
        return null === e && kn(t), null;

      case 13:
        return In(e, t, n);

      case 4:
        return on(t, t.stateNode.containerInfo), r = t.pendingProps, null === e ? t.child = _a(t, null, r, n) : En(e, t, r, n), t.child;

      case 11:
        return r = t.type, i = t.pendingProps, i = t.elementType === r ? i : cn(r, i), Cn(e, t, r, i, n);

      case 7:
        return En(e, t, t.pendingProps, n), t.child;

      case 8:
      case 12:
        return En(e, t, t.pendingProps.children, n), t.child;

      case 10:
        e: {
          if (r = t.type._context, i = t.pendingProps, l = t.memoizedProps, a = i.value, Zt(t, a), null !== l) {
            var u = l.value;

            if (0 === (a = u === a && (0 !== u || 1 / u === 1 / a) || u !== u && a !== a ? 0 : 0 | ("function" === typeof r._calculateChangedBits ? r._calculateChangedBits(u, a) : 1073741823))) {
              if (l.children === i.children && !ia.current) {
                t = An(e, t, n);
                break e;
              }
            } else for (null !== (l = t.child) && (l.return = t); null !== l;) {
              if (null !== (u = l.firstContextDependency)) do {
                if (u.context === r && 0 !== (u.observedBits & a)) {
                  if (1 === l.tag) {
                    var c = Wt(n);
                    c.tag = 2, $t(l, c);
                  }

                  l.expirationTime < n && (l.expirationTime = n), c = l.alternate, null !== c && c.expirationTime < n && (c.expirationTime = n);

                  for (var s = l.return; null !== s;) {
                    if (c = s.alternate, s.childExpirationTime < n) s.childExpirationTime = n, null !== c && c.childExpirationTime < n && (c.childExpirationTime = n);else {
                      if (!(null !== c && c.childExpirationTime < n)) break;
                      c.childExpirationTime = n;
                    }
                    s = s.return;
                  }
                }

                c = l.child, u = u.next;
              } while (null !== u);else c = 10 === l.tag && l.type === t.type ? null : l.child;
              if (null !== c) c.return = l;else for (c = l; null !== c;) {
                if (c === t) {
                  c = null;
                  break;
                }

                if (null !== (l = c.sibling)) {
                  l.return = c.return, c = l;
                  break;
                }

                c = c.return;
              }
              l = c;
            }
          }

          En(e, t, i.children, n), t = t.child;
        }

        return t;

      case 9:
        return i = t.type, a = t.pendingProps, r = a.children, tn(t, n), i = nn(i, a.unstable_observedBits), r = r(i), t.effectTag |= 1, En(e, t, r, n), t.child;

      case 14:
        return i = t.type, a = cn(i, t.pendingProps), a = cn(i.type, a), Sn(e, t, i, a, r, n);

      case 15:
        return Pn(e, t, t.type, t.pendingProps, r, n);

      case 17:
        return r = t.type, i = t.pendingProps, i = t.elementType === r ? i : cn(r, i), null !== e && (e.alternate = null, t.alternate = null, t.effectTag |= 2), t.tag = 1, gt(r) ? (e = !0, xt(t)) : e = !1, tn(t, n), pn(t, r, i, n), mn(t, r, i, n), jn(null, t, r, !0, e, n);

      default:
        o("156");
    }
  }

  function Un(e) {
    e.effectTag |= 4;
  }

  function Fn(e, t) {
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

  function Ln(e) {
    var t = e.ref;
    if (null !== t) if ("function" === typeof t) try {
      t(null);
    } catch (t) {
      er(e, t);
    } else t.current = null;
  }

  function zn(e, t) {
    for (var n = e;;) {
      if (5 === n.tag) {
        var r = n.stateNode;
        if (t) r.style.display = "none";else {
          r = n.stateNode;
          var o = n.memoizedProps.style;
          o = void 0 !== o && null !== o && o.hasOwnProperty("display") ? o.display : null, r.style.display = ot("display", o);
        }
      } else if (6 === n.tag) n.stateNode.nodeValue = t ? "" : n.memoizedProps;else {
        if (13 === n.tag && null !== n.memoizedState) {
          r = n.child.sibling, r.return = n, n = r;
          continue;
        }

        if (null !== n.child) {
          n.child.return = n, n = n.child;
          continue;
        }
      }

      if (n === e) break;

      for (; null === n.sibling;) {
        if (null === n.return || n.return === e) return;
        n = n.return;
      }

      n.sibling.return = n.return, n = n.sibling;
    }
  }

  function Bn(e) {
    switch ("function" === typeof ua && ua(e), e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        var t = e.updateQueue;

        if (null !== t && null !== (t = t.lastEffect)) {
          var n = t = t.next;

          do {
            var r = n.destroy;

            if (null !== r) {
              var o = e;

              try {
                r();
              } catch (e) {
                er(o, e);
              }
            }

            n = n.next;
          } while (n !== t);
        }

        break;

      case 1:
        if (Ln(e), t = e.stateNode, "function" === typeof t.componentWillUnmount) try {
          t.props = e.memoizedProps, t.state = e.memoizedState, t.componentWillUnmount();
        } catch (t) {
          er(e, t);
        }
        break;

      case 5:
        Ln(e);
        break;

      case 4:
        Hn(e);
    }
  }

  function Vn(e) {
    return 5 === e.tag || 3 === e.tag || 4 === e.tag;
  }

  function Wn(e) {
    e: {
      for (var t = e.return; null !== t;) {
        if (Vn(t)) {
          var n = t;
          break e;
        }

        t = t.return;
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

    16 & n.effectTag && (rt(t, ""), n.effectTag &= -17);

    e: t: for (n = e;;) {
      for (; null === n.sibling;) {
        if (null === n.return || Vn(n.return)) {
          n = null;
          break e;
        }

        n = n.return;
      }

      for (n.sibling.return = n.return, n = n.sibling; 5 !== n.tag && 6 !== n.tag;) {
        if (2 & n.effectTag) continue t;
        if (null === n.child || 4 === n.tag) continue t;
        n.child.return = n, n = n.child;
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
        } else r ? (l = t, u = i.stateNode, 8 === l.nodeType ? (a = l.parentNode, a.insertBefore(u, l)) : (a = l, a.appendChild(u)), null !== (l = l._reactRootContainer) && void 0 !== l || null !== a.onclick || (a.onclick = ct)) : t.appendChild(i.stateNode);
      } else if (4 !== i.tag && null !== i.child) {
        i.child.return = i, i = i.child;
        continue;
      }
      if (i === e) break;

      for (; null === i.sibling;) {
        if (null === i.return || i.return === e) return;
        i = i.return;
      }

      i.sibling.return = i.return, i = i.sibling;
    }
  }

  function Hn(e) {
    for (var t = e, n = !1, r = void 0, i = void 0;;) {
      if (!n) {
        n = t.return;

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

          n = n.return;
        }

        n = !0;
      }

      if (5 === t.tag || 6 === t.tag) {
        e: for (var a = t, l = a;;) {
          if (Bn(l), null !== l.child && 4 !== l.tag) l.child.return = l, l = l.child;else {
            if (l === a) break;

            for (; null === l.sibling;) {
              if (null === l.return || l.return === a) break e;
              l = l.return;
            }

            l.sibling.return = l.return, l = l.sibling;
          }
        }

        i ? (a = r, l = t.stateNode, 8 === a.nodeType ? a.parentNode.removeChild(l) : a.removeChild(l)) : r.removeChild(t.stateNode);
      } else if (4 === t.tag ? (r = t.stateNode.containerInfo, i = !0) : Bn(t), null !== t.child) {
        t.child.return = t, t = t.child;
        continue;
      }

      if (t === e) break;

      for (; null === t.sibling;) {
        if (null === t.return || t.return === e) return;
        t = t.return, 4 === t.tag && (n = !1);
      }

      t.sibling.return = t.return, t = t.sibling;
    }
  }

  function $n(e, t) {
    switch (t.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
      case 1:
        break;

      case 5:
        var n = t.stateNode;

        if (null != n) {
          var r = t.memoizedProps;
          e = null !== e ? e.memoizedProps : r;
          var i = t.type,
              a = t.updateQueue;
          t.updateQueue = null, null !== a && dt(n, a, i, e, r, t);
        }

        break;

      case 6:
        null === t.stateNode && o("162"), t.stateNode.nodeValue = t.memoizedProps;
        break;

      case 3:
      case 12:
        break;

      case 13:
        if (n = t.memoizedState, r = void 0, e = t, null === n ? r = !1 : (r = !0, e = t.child, 0 === n.timedOutAt && (n.timedOutAt = fr())), null !== e && zn(e, r), null !== (n = t.updateQueue)) {
          t.updateQueue = null;
          var l = t.stateNode;
          null === l && (l = t.stateNode = new ja()), n.forEach(function (e) {
            var n = rr.bind(null, t, e);
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

  function qn(e, t, n) {
    n = Wt(n), n.tag = 3, n.payload = {
      element: null
    };
    var r = t.value;
    return n.callback = function () {
      wr(r), Fn(e, t);
    }, n;
  }

  function Yn(e, t, n) {
    n = Wt(n), n.tag = 3;
    var r = e.type.getDerivedStateFromError;

    if ("function" === typeof r) {
      var o = t.value;

      n.payload = function () {
        return r(o);
      };
    }

    var i = e.stateNode;
    return null !== i && "function" === typeof i.componentDidCatch && (n.callback = function () {
      "function" !== typeof r && (null === Qa ? Qa = new Set([this]) : Qa.add(this));
      var n = t.value,
          o = t.stack;
      Fn(e, t), this.componentDidCatch(n, {
        componentStack: null !== o ? o : ""
      });
    }), n;
  }

  function Qn(e) {
    switch (e.tag) {
      case 1:
        gt(e.type) && bt(e);
        var t = e.effectTag;
        return 2048 & t ? (e.effectTag = -2049 & t | 64, e) : null;

      case 3:
        return an(e), wt(e), t = e.effectTag, 0 !== (64 & t) && o("285"), e.effectTag = -2049 & t | 64, e;

      case 5:
        return un(e), null;

      case 13:
        return t = e.effectTag, 2048 & t ? (e.effectTag = -2049 & t | 64, e) : null;

      case 4:
        return an(e), null;

      case 10:
        return en(e), null;

      default:
        return null;
    }
  }

  function Kn() {
    if (null !== La) for (var e = La.return; null !== e;) {
      var t = e;

      switch (t.tag) {
        case 1:
          var n = t.type.childContextTypes;
          null !== n && void 0 !== n && bt(t);
          break;

        case 3:
          an(t), wt(t);
          break;

        case 5:
          un(t);
          break;

        case 4:
          an(t);
          break;

        case 10:
          en(t);
      }

      e = e.return;
    }
    za = null, Ba = 0, Va = -1, Wa = !1, La = null;
  }

  function Xn() {
    null !== Ya && (Fr.unstable_cancelCallback(qa), Ya());
  }

  function Gn(e) {
    for (;;) {
      var t = e.alternate,
          n = e.return,
          r = e.sibling;

      if (0 === (1024 & e.effectTag)) {
        La = e;

        e: {
          var i = t;
          t = e;
          var a = Ba,
              l = t.pendingProps;

          switch (t.tag) {
            case 2:
            case 16:
              break;

            case 15:
            case 0:
              break;

            case 1:
              gt(t.type) && bt(t);
              break;

            case 3:
              an(t), wt(t), l = t.stateNode, l.pendingContext && (l.context = l.pendingContext, l.pendingContext = null), null !== i && null !== i.child || (xn(t), t.effectTag &= -3), Oa(t);
              break;

            case 5:
              un(t);
              var u = rn(va.current);
              if (a = t.type, null !== i && null != t.stateNode) Na(i, t, a, l, u), i.ref !== t.ref && (t.effectTag |= 128);else if (l) {
                var c = rn(ma.current);

                if (xn(t)) {
                  l = t, i = l.stateNode;
                  var s = l.type,
                      f = l.memoizedProps,
                      d = u;

                  switch (i[no] = l, i[ro] = f, a = void 0, u = s) {
                    case "iframe":
                    case "object":
                      Re("load", i);
                      break;

                    case "video":
                    case "audio":
                      for (s = 0; s < po.length; s++) {
                        Re(po[s], i);
                      }

                      break;

                    case "source":
                      Re("error", i);
                      break;

                    case "img":
                    case "image":
                    case "link":
                      Re("error", i), Re("load", i);
                      break;

                    case "form":
                      Re("reset", i), Re("submit", i);
                      break;

                    case "details":
                      Re("toggle", i);
                      break;

                    case "input":
                      se(i, f), Re("invalid", i), ut(d, "onChange");
                      break;

                    case "select":
                      i._wrapperState = {
                        wasMultiple: !!f.multiple
                      }, Re("invalid", i), ut(d, "onChange");
                      break;

                    case "textarea":
                      Je(i, f), Re("invalid", i), ut(d, "onChange");
                  }

                  at(u, f), s = null;

                  for (a in f) {
                    f.hasOwnProperty(a) && (c = f[a], "children" === a ? "string" === typeof c ? i.textContent !== c && (s = ["children", c]) : "number" === typeof c && i.textContent !== "" + c && (s = ["children", "" + c]) : Qr.hasOwnProperty(a) && null != c && ut(d, a));
                  }

                  switch (u) {
                    case "input":
                      G(i), pe(i, f, !0);
                      break;

                    case "textarea":
                      G(i), et(i, f);
                      break;

                    case "select":
                    case "option":
                      break;

                    default:
                      "function" === typeof f.onClick && (i.onclick = ct);
                  }

                  a = s, l.updateQueue = a, l = null !== a, l && Un(t);
                } else {
                  f = t, i = a, d = l, s = 9 === u.nodeType ? u : u.ownerDocument, c === $i.html && (c = tt(i)), c === $i.html ? "script" === i ? (i = s.createElement("div"), i.innerHTML = "<script><\/script>", s = i.removeChild(i.firstChild)) : "string" === typeof d.is ? s = s.createElement(i, {
                    is: d.is
                  }) : (s = s.createElement(i), "select" === i && d.multiple && (s.multiple = !0)) : s = s.createElementNS(c, i), i = s, i[no] = f, i[ro] = l, Pa(i, t, !1, !1), d = i, s = a, f = l;
                  var p = u,
                      h = lt(s, f);

                  switch (s) {
                    case "iframe":
                    case "object":
                      Re("load", d), u = f;
                      break;

                    case "video":
                    case "audio":
                      for (u = 0; u < po.length; u++) {
                        Re(po[u], d);
                      }

                      u = f;
                      break;

                    case "source":
                      Re("error", d), u = f;
                      break;

                    case "img":
                    case "image":
                    case "link":
                      Re("error", d), Re("load", d), u = f;
                      break;

                    case "form":
                      Re("reset", d), Re("submit", d), u = f;
                      break;

                    case "details":
                      Re("toggle", d), u = f;
                      break;

                    case "input":
                      se(d, f), u = ce(d, f), Re("invalid", d), ut(p, "onChange");
                      break;

                    case "option":
                      u = Ke(d, f);
                      break;

                    case "select":
                      d._wrapperState = {
                        wasMultiple: !!f.multiple
                      }, u = Ur({}, f, {
                        value: void 0
                      }), Re("invalid", d), ut(p, "onChange");
                      break;

                    case "textarea":
                      Je(d, f), u = Ge(d, f), Re("invalid", d), ut(p, "onChange");
                      break;

                    default:
                      u = f;
                  }

                  at(s, u), c = void 0;
                  var m = s,
                      y = d,
                      v = u;

                  for (c in v) {
                    if (v.hasOwnProperty(c)) {
                      var g = v[c];
                      "style" === c ? it(y, g) : "dangerouslySetInnerHTML" === c ? null != (g = g ? g.__html : void 0) && Yi(y, g) : "children" === c ? "string" === typeof g ? ("textarea" !== m || "" !== g) && rt(y, g) : "number" === typeof g && rt(y, "" + g) : "suppressContentEditableWarning" !== c && "suppressHydrationWarning" !== c && "autoFocus" !== c && (Qr.hasOwnProperty(c) ? null != g && ut(p, c) : null != g && le(y, c, g, h));
                    }
                  }

                  switch (s) {
                    case "input":
                      G(d), pe(d, f, !1);
                      break;

                    case "textarea":
                      G(d), et(d, f);
                      break;

                    case "option":
                      null != f.value && d.setAttribute("value", "" + ue(f.value));
                      break;

                    case "select":
                      u = d, u.multiple = !!f.multiple, d = f.value, null != d ? Xe(u, !!f.multiple, d, !1) : null != f.defaultValue && Xe(u, !!f.multiple, f.defaultValue, !0);
                      break;

                    default:
                      "function" === typeof u.onClick && (d.onclick = ct);
                  }

                  (l = st(a, l)) && Un(t), t.stateNode = i;
                }

                null !== t.ref && (t.effectTag |= 128);
              } else null === t.stateNode && o("166");
              break;

            case 6:
              i && null != t.stateNode ? Da(i, t, i.memoizedProps, l) : ("string" !== typeof l && null === t.stateNode && o("166"), i = rn(va.current), rn(ma.current), xn(t) ? (l = t, a = l.stateNode, i = l.memoizedProps, a[no] = l, (l = a.nodeValue !== i) && Un(t)) : (a = t, l = (9 === i.nodeType ? i : i.ownerDocument).createTextNode(l), l[no] = t, a.stateNode = l));
              break;

            case 11:
              break;

            case 13:
              if (l = t.memoizedState, 0 !== (64 & t.effectTag)) {
                t.expirationTime = a, La = t;
                break e;
              }

              l = null !== l, a = null !== i && null !== i.memoizedState, null !== i && !l && a && null !== (i = i.child.sibling) && (u = t.firstEffect, null !== u ? (t.firstEffect = i, i.nextEffect = u) : (t.firstEffect = t.lastEffect = i, i.nextEffect = null), i.effectTag = 8), (l !== a || 0 === (1 & t.effectTag) && l) && (t.effectTag |= 4);
              break;

            case 7:
            case 8:
            case 12:
              break;

            case 4:
              an(t), Oa(t);
              break;

            case 10:
              en(t);
              break;

            case 9:
            case 14:
              break;

            case 17:
              gt(t.type) && bt(t);
              break;

            default:
              o("156");
          }

          La = null;
        }

        if (t = e, 1 === Ba || 1 !== t.childExpirationTime) {
          for (l = 0, a = t.child; null !== a;) {
            i = a.expirationTime, u = a.childExpirationTime, i > l && (l = i), u > l && (l = u), a = a.sibling;
          }

          t.childExpirationTime = l;
        }

        if (null !== La) return La;
        null !== n && 0 === (1024 & n.effectTag) && (null === n.firstEffect && (n.firstEffect = e.firstEffect), null !== e.lastEffect && (null !== n.lastEffect && (n.lastEffect.nextEffect = e.firstEffect), n.lastEffect = e.lastEffect), 1 < e.effectTag && (null !== n.lastEffect ? n.lastEffect.nextEffect = e : n.firstEffect = e, n.lastEffect = e));
      } else {
        if (null !== (e = Qn(e, Ba))) return e.effectTag &= 1023, e;
        null !== n && (n.firstEffect = n.lastEffect = null, n.effectTag |= 1024);
      }

      if (null !== r) return r;
      if (null === n) break;
      e = n;
    }

    return null;
  }

  function Jn(e) {
    var t = Rn(e.alternate, e, Ba);
    return e.memoizedProps = e.pendingProps, null === t && (t = Gn(e)), Aa.current = null, t;
  }

  function Zn(e, t) {
    Fa && o("243"), Xn(), Fa = !0, Aa.currentDispatcher = Ia;
    var n = e.nextExpirationTimeToWorkOn;
    n === Ba && e === za && null !== La || (Kn(), za = e, Ba = n, La = Dt(za.current, null, Ba), e.pendingCommitExpirationTime = 0);

    for (var r = !1;;) {
      try {
        if (t) for (; null !== La && !hr();) {
          La = Jn(La);
        } else for (; null !== La;) {
          La = Jn(La);
        }
      } catch (t) {
        if (pa = da = fa = null, null === La) r = !0, wr(t);else {
          null === La && o("271");
          var i = La,
              a = i.return;

          if (null !== a) {
            e: {
              var l = e,
                  u = a,
                  c = i,
                  s = t;

              if (a = Ba, c.effectTag |= 1024, c.firstEffect = c.lastEffect = null, null !== s && "object" === _typeof(s) && "function" === typeof s.then) {
                var f = s;
                s = u;
                var d = -1,
                    p = -1;

                do {
                  if (13 === s.tag) {
                    var h = s.alternate;

                    if (null !== h && null !== (h = h.memoizedState)) {
                      p = 10 * (1073741822 - h.timedOutAt);
                      break;
                    }

                    h = s.pendingProps.maxDuration, "number" === typeof h && (0 >= h ? d = 0 : (-1 === d || h < d) && (d = h));
                  }

                  s = s.return;
                } while (null !== s);

                s = u;

                do {
                  if ((h = 13 === s.tag) && (h = void 0 !== s.memoizedProps.fallback && null === s.memoizedState), h) {
                    if (u = s.updateQueue, null === u ? s.updateQueue = new Set([f]) : u.add(f), 0 === (1 & s.mode)) {
                      s.effectTag |= 64, c.effectTag &= -1957, 1 === c.tag && (null === c.alternate ? c.tag = 17 : (a = Wt(1073741823), a.tag = 2, $t(c, a))), c.expirationTime = 1073741823;
                      break e;
                    }

                    c = l.pingCache, null === c ? (c = l.pingCache = new Ma(), u = new Set(), c.set(f, u)) : void 0 === (u = c.get(f)) && (u = new Set(), c.set(f, u)), u.has(a) || (u.add(a), c = nr.bind(null, l, f, a), f.then(c, c)), -1 === d ? l = 1073741823 : (-1 === p && (p = 10 * (1073741822 - Lt(l, a)) - 5e3), l = p + d), 0 <= l && Va < l && (Va = l), s.effectTag |= 2048, s.expirationTime = a;
                    break e;
                  }

                  s = s.return;
                } while (null !== s);

                s = Error((ee(c.type) || "A React component") + " suspended while rendering, but no fallback UI was specified.\n\nAdd a <Suspense fallback=...> component higher in the tree to provide a loading indicator or placeholder to display." + te(c));
              }

              Wa = !0, s = Jt(s, c), l = u;

              do {
                switch (l.tag) {
                  case 3:
                    l.effectTag |= 2048, l.expirationTime = a, a = qn(l, s, a), qt(l, a);
                    break e;

                  case 1:
                    if (f = s, d = l.type, p = l.stateNode, 0 === (64 & l.effectTag) && ("function" === typeof d.getDerivedStateFromError || null !== p && "function" === typeof p.componentDidCatch && (null === Qa || !Qa.has(p)))) {
                      l.effectTag |= 2048, l.expirationTime = a, a = Yn(l, f, a), qt(l, a);
                      break e;
                    }

                }

                l = l.return;
              } while (null !== l);
            }

            La = Gn(i);
            continue;
          }

          r = !0, wr(t);
        }
      }

      break;
    }

    if (Fa = !1, pa = da = fa = Aa.currentDispatcher = null, r) za = null, e.finishedWork = null;else if (null !== La) e.finishedWork = null;else {
      if (r = e.current.alternate, null === r && o("281"), za = null, Wa) {
        if (i = e.latestPendingTime, a = e.latestSuspendedTime, l = e.latestPingedTime, 0 !== i && i < n || 0 !== a && a < n || 0 !== l && l < n) return Ft(e, n), void cr(e, r, n, e.expirationTime, -1);
        if (!e.didError && t) return e.didError = !0, n = e.nextExpirationTimeToWorkOn = n, t = e.expirationTime = 1073741823, void cr(e, r, n, t, -1);
      }

      t && -1 !== Va ? (Ft(e, n), t = 10 * (1073741822 - Lt(e, n)), t < Va && (Va = t), t = 10 * (1073741822 - fr()), t = Va - t, cr(e, r, n, e.expirationTime, 0 > t ? 0 : t)) : (e.pendingCommitExpirationTime = n, e.finishedWork = r);
    }
  }

  function er(e, t) {
    for (var n = e.return; null !== n;) {
      switch (n.tag) {
        case 1:
          var r = n.stateNode;
          if ("function" === typeof n.type.getDerivedStateFromError || "function" === typeof r.componentDidCatch && (null === Qa || !Qa.has(r))) return e = Jt(t, e), e = Yn(n, e, 1073741823), $t(n, e), void ir(n, 1073741823);
          break;

        case 3:
          return e = Jt(t, e), e = qn(n, e, 1073741823), $t(n, e), void ir(n, 1073741823);
      }

      n = n.return;
    }

    3 === e.tag && (n = Jt(t, e), n = qn(e, n, 1073741823), $t(e, n), ir(e, 1073741823));
  }

  function tr(e, t) {
    return 0 !== Ua ? e = Ua : Fa ? e = $a ? 1073741823 : Ba : 1 & t.mode ? (e = ll ? 1073741822 - 10 * (1 + ((1073741822 - e + 15) / 10 | 0)) : 1073741822 - 25 * (1 + ((1073741822 - e + 500) / 25 | 0)), null !== za && e === Ba && --e) : e = 1073741823, ll && (0 === nl || e < nl) && (nl = e), e;
  }

  function nr(e, t, n) {
    var r = e.pingCache;
    null !== r && r.delete(t), null !== za && Ba === n ? za = null : (t = e.earliestSuspendedTime, r = e.latestSuspendedTime, 0 !== t && n <= t && n >= r && (e.didError = !1, t = e.latestPingedTime, (0 === t || t > n) && (e.latestPingedTime = n), zt(n, e), 0 !== (n = e.expirationTime) && dr(e, n)));
  }

  function rr(e, t) {
    var n = e.stateNode;
    null !== n && n.delete(t), t = fr(), t = tr(t, e), null !== (e = or(e, t)) && (Ut(e, t), 0 !== (t = e.expirationTime) && dr(e, t));
  }

  function or(e, t) {
    e.expirationTime < t && (e.expirationTime = t);
    var n = e.alternate;
    null !== n && n.expirationTime < t && (n.expirationTime = t);
    var r = e.return,
        o = null;
    if (null === r && 3 === e.tag) o = e.stateNode;else for (; null !== r;) {
      if (n = r.alternate, r.childExpirationTime < t && (r.childExpirationTime = t), null !== n && n.childExpirationTime < t && (n.childExpirationTime = t), null === r.return && 3 === r.tag) {
        o = r.stateNode;
        break;
      }

      r = r.return;
    }
    return o;
  }

  function ir(e, t) {
    null !== (e = or(e, t)) && (!Fa && 0 !== Ba && t > Ba && Kn(), Ut(e, t), Fa && !$a && za === e || dr(e, e.expirationTime), pl > dl && (pl = 0, o("185")));
  }

  function ar(e, t, n, r, o) {
    var i = Ua;
    Ua = 1073741823;

    try {
      return e(t, n, r, o);
    } finally {
      Ua = i;
    }
  }

  function lr() {
    sl = 1073741822 - ((Fr.unstable_now() - cl) / 10 | 0);
  }

  function ur(e, t) {
    if (0 !== Ga) {
      if (t < Ga) return;
      null !== Ja && Fr.unstable_cancelCallback(Ja);
    }

    Ga = t, e = Fr.unstable_now() - cl, Ja = Fr.unstable_scheduleCallback(mr, {
      timeout: 10 * (1073741822 - t) - e
    });
  }

  function cr(e, t, n, r, o) {
    e.expirationTime = r, 0 !== o || hr() ? 0 < o && (e.timeoutHandle = Zi(sr.bind(null, e, t, n), o)) : (e.pendingCommitExpirationTime = n, e.finishedWork = t);
  }

  function sr(e, t, n) {
    e.pendingCommitExpirationTime = n, e.finishedWork = t, lr(), fl = sl, vr(e, n);
  }

  function fr() {
    return Za ? fl : (pr(), 0 !== tl && 1 !== tl || (lr(), fl = sl), fl);
  }

  function dr(e, t) {
    null === e.nextScheduledRoot ? (e.expirationTime = t, null === Xa ? (Ka = Xa = e, e.nextScheduledRoot = e) : (Xa = Xa.nextScheduledRoot = e, Xa.nextScheduledRoot = Ka)) : t > e.expirationTime && (e.expirationTime = t), Za || (il ? al && (el = e, tl = 1073741823, gr(e, 1073741823, !1)) : 1073741823 === t ? yr(1073741823, !1) : ur(e, t));
  }

  function pr() {
    var e = 0,
        t = null;
    if (null !== Xa) for (var n = Xa, r = Ka; null !== r;) {
      var i = r.expirationTime;

      if (0 === i) {
        if ((null === n || null === Xa) && o("244"), r === r.nextScheduledRoot) {
          Ka = Xa = r.nextScheduledRoot = null;
          break;
        }

        if (r === Ka) Ka = i = r.nextScheduledRoot, Xa.nextScheduledRoot = i, r.nextScheduledRoot = null;else {
          if (r === Xa) {
            Xa = n, Xa.nextScheduledRoot = Ka, r.nextScheduledRoot = null;
            break;
          }

          n.nextScheduledRoot = r.nextScheduledRoot, r.nextScheduledRoot = null;
        }
        r = n.nextScheduledRoot;
      } else {
        if (i > e && (e = i, t = r), r === Xa) break;
        if (1073741823 === e) break;
        n = r, r = r.nextScheduledRoot;
      }
    }
    el = t, tl = e;
  }

  function hr() {
    return !!ml || !!Fr.unstable_shouldYield() && (ml = !0);
  }

  function mr() {
    try {
      if (!hr() && null !== Ka) {
        lr();
        var e = Ka;

        do {
          var t = e.expirationTime;
          0 !== t && sl <= t && (e.nextExpirationTimeToWorkOn = sl), e = e.nextScheduledRoot;
        } while (e !== Ka);
      }

      yr(0, !0);
    } finally {
      ml = !1;
    }
  }

  function yr(e, t) {
    if (pr(), t) for (lr(), fl = sl; null !== el && 0 !== tl && e <= tl && !(ml && sl > tl);) {
      gr(el, tl, sl > tl), pr(), lr(), fl = sl;
    } else for (; null !== el && 0 !== tl && e <= tl;) {
      gr(el, tl, !1), pr();
    }
    if (t && (Ga = 0, Ja = null), 0 !== tl && ur(el, tl), pl = 0, hl = null, null !== ul) for (e = ul, ul = null, t = 0; t < e.length; t++) {
      var n = e[t];

      try {
        n._onComplete();
      } catch (e) {
        rl || (rl = !0, ol = e);
      }
    }
    if (rl) throw e = ol, ol = null, rl = !1, e;
  }

  function vr(e, t) {
    Za && o("253"), el = e, tl = t, gr(e, t, !1), yr(1073741823, !1);
  }

  function gr(e, t, n) {
    if (Za && o("245"), Za = !0, n) {
      var r = e.finishedWork;
      null !== r ? br(e, r, t) : (e.finishedWork = null, r = e.timeoutHandle, -1 !== r && (e.timeoutHandle = -1, ea(r)), Zn(e, n), null !== (r = e.finishedWork) && (hr() ? e.finishedWork = r : br(e, r, t)));
    } else r = e.finishedWork, null !== r ? br(e, r, t) : (e.finishedWork = null, r = e.timeoutHandle, -1 !== r && (e.timeoutHandle = -1, ea(r)), Zn(e, n), null !== (r = e.finishedWork) && br(e, r, t));

    Za = !1;
  }

  function br(e, t, n) {
    var r = e.firstBatch;
    if (null !== r && r._expirationTime >= n && (null === ul ? ul = [r] : ul.push(r), r._defer)) return e.finishedWork = t, void (e.expirationTime = 0);
    e.finishedWork = null, e === hl ? pl++ : (hl = e, pl = 0), $a = Fa = !0, e.current === t && o("177"), n = e.pendingCommitExpirationTime, 0 === n && o("261"), e.pendingCommitExpirationTime = 0, r = t.expirationTime;
    var i = t.childExpirationTime;

    if (r = i > r ? i : r, e.didError = !1, 0 === r ? (e.earliestPendingTime = 0, e.latestPendingTime = 0, e.earliestSuspendedTime = 0, e.latestSuspendedTime = 0, e.latestPingedTime = 0) : (r < e.latestPingedTime && (e.latestPingedTime = 0), i = e.latestPendingTime, 0 !== i && (i > r ? e.earliestPendingTime = e.latestPendingTime = 0 : e.earliestPendingTime > r && (e.earliestPendingTime = e.latestPendingTime)), i = e.earliestSuspendedTime, 0 === i ? Ut(e, r) : r < e.latestSuspendedTime ? (e.earliestSuspendedTime = 0, e.latestSuspendedTime = 0, e.latestPingedTime = 0, Ut(e, r)) : r > i && Ut(e, r)), zt(0, e), Aa.current = null, 1 < t.effectTag ? null !== t.lastEffect ? (t.lastEffect.nextEffect = t, r = t.firstEffect) : r = t : r = t.firstEffect, Gi = Ii, i = $e(), qe(i)) {
      if ("selectionStart" in i) var a = {
        start: i.selectionStart,
        end: i.selectionEnd
      };else e: {
        a = (a = i.ownerDocument) && a.defaultView || window;
        var l = a.getSelection && a.getSelection();

        if (l && 0 !== l.rangeCount) {
          a = l.anchorNode;
          var u = l.anchorOffset,
              c = l.focusNode;
          l = l.focusOffset;

          try {
            a.nodeType, c.nodeType;
          } catch (e) {
            a = null;
            break e;
          }

          var s = 0,
              f = -1,
              d = -1,
              p = 0,
              h = 0,
              m = i,
              y = null;

          t: for (;;) {
            for (var v; m !== a || 0 !== u && 3 !== m.nodeType || (f = s + u), m !== c || 0 !== l && 3 !== m.nodeType || (d = s + l), 3 === m.nodeType && (s += m.nodeValue.length), null !== (v = m.firstChild);) {
              y = m, m = v;
            }

            for (;;) {
              if (m === i) break t;
              if (y === a && ++p === u && (f = s), y === c && ++h === l && (d = s), null !== (v = m.nextSibling)) break;
              m = y, y = m.parentNode;
            }

            m = v;
          }

          a = -1 === f || -1 === d ? null : {
            start: f,
            end: d
          };
        } else a = null;
      }
      a = a || {
        start: 0,
        end: 0
      };
    } else a = null;

    for (Ji = {
      focusedElem: i,
      selectionRange: a
    }, Ii = !1, Ha = r; null !== Ha;) {
      i = !1, a = void 0;

      try {
        for (; null !== Ha;) {
          if (256 & Ha.effectTag) e: {
            var g = Ha.alternate;

            switch (u = Ha, u.tag) {
              case 0:
              case 11:
              case 15:
                break e;

              case 1:
                if (256 & u.effectTag && null !== g) {
                  var b = g.memoizedProps,
                      w = g.memoizedState,
                      k = u.stateNode,
                      _ = k.getSnapshotBeforeUpdate(u.elementType === u.type ? b : cn(u.type, b), w);

                  k.__reactInternalSnapshotBeforeUpdate = _;
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
          Ha = Ha.nextEffect;
        }
      } catch (e) {
        i = !0, a = e;
      }

      i && (null === Ha && o("178"), er(Ha, a), null !== Ha && (Ha = Ha.nextEffect));
    }

    for (Ha = r; null !== Ha;) {
      g = !1, b = void 0;

      try {
        for (; null !== Ha;) {
          var x = Ha.effectTag;

          if (16 & x && rt(Ha.stateNode, ""), 128 & x) {
            var T = Ha.alternate;

            if (null !== T) {
              var E = T.ref;
              null !== E && ("function" === typeof E ? E(null) : E.current = null);
            }
          }

          switch (14 & x) {
            case 2:
              Wn(Ha), Ha.effectTag &= -3;
              break;

            case 6:
              Wn(Ha), Ha.effectTag &= -3, $n(Ha.alternate, Ha);
              break;

            case 4:
              $n(Ha.alternate, Ha);
              break;

            case 8:
              w = Ha, Hn(w), w.return = null, w.child = null, w.memoizedState = null, w.updateQueue = null;
              var C = w.alternate;
              null !== C && (C.return = null, C.child = null, C.memoizedState = null, C.updateQueue = null);
          }

          Ha = Ha.nextEffect;
        }
      } catch (e) {
        g = !0, b = e;
      }

      g && (null === Ha && o("178"), er(Ha, b), null !== Ha && (Ha = Ha.nextEffect));
    }

    if (E = Ji, T = $e(), x = E.focusedElem, g = E.selectionRange, T !== x && x && x.ownerDocument && He(x.ownerDocument.documentElement, x)) {
      null !== g && qe(x) && (T = g.start, E = g.end, void 0 === E && (E = T), "selectionStart" in x ? (x.selectionStart = T, x.selectionEnd = Math.min(E, x.value.length)) : (E = (T = x.ownerDocument || document) && T.defaultView || window, E.getSelection && (E = E.getSelection(), b = x.textContent.length, C = Math.min(g.start, b), g = void 0 === g.end ? C : Math.min(g.end, b), !E.extend && C > g && (b = g, g = C, C = b), b = We(x, C), w = We(x, g), b && w && (1 !== E.rangeCount || E.anchorNode !== b.node || E.anchorOffset !== b.offset || E.focusNode !== w.node || E.focusOffset !== w.offset) && (T = T.createRange(), T.setStart(b.node, b.offset), E.removeAllRanges(), C > g ? (E.addRange(T), E.extend(w.node, w.offset)) : (T.setEnd(w.node, w.offset), E.addRange(T)))))), T = [];

      for (E = x; E = E.parentNode;) {
        1 === E.nodeType && T.push({
          element: E,
          left: E.scrollLeft,
          top: E.scrollTop
        });
      }

      for ("function" === typeof x.focus && x.focus(), x = 0; x < T.length; x++) {
        E = T[x], E.element.scrollLeft = E.left, E.element.scrollTop = E.top;
      }
    }

    for (Ji = null, Ii = !!Gi, Gi = null, e.current = t, Ha = r; null !== Ha;) {
      r = !1, x = void 0;

      try {
        for (T = n; null !== Ha;) {
          var S = Ha.effectTag;

          if (36 & S) {
            var P = Ha.alternate;

            switch (E = Ha, C = T, E.tag) {
              case 0:
              case 11:
              case 15:
                break;

              case 1:
                var O = E.stateNode;
                if (4 & E.effectTag) if (null === P) O.componentDidMount();else {
                  var N = E.elementType === E.type ? P.memoizedProps : cn(E.type, P.memoizedProps);
                  O.componentDidUpdate(N, P.memoizedState, O.__reactInternalSnapshotBeforeUpdate);
                }
                var D = E.updateQueue;
                null !== D && Xt(E, D, O, C);
                break;

              case 3:
                var j = E.updateQueue;

                if (null !== j) {
                  if (g = null, null !== E.child) switch (E.child.tag) {
                    case 5:
                      g = E.child.stateNode;
                      break;

                    case 1:
                      g = E.child.stateNode;
                  }
                  Xt(E, j, g, C);
                }

                break;

              case 5:
                var M = E.stateNode;
                null === P && 4 & E.effectTag && st(E.type, E.memoizedProps) && M.focus();
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

          if (128 & S) {
            var I = Ha.ref;

            if (null !== I) {
              var A = Ha.stateNode;

              switch (Ha.tag) {
                case 5:
                  var R = A;
                  break;

                default:
                  R = A;
              }

              "function" === typeof I ? I(R) : I.current = R;
            }
          }

          Ha = Ha.nextEffect;
        }
      } catch (e) {
        r = !0, x = e;
      }

      r && (null === Ha && o("178"), er(Ha, x), null !== Ha && (Ha = Ha.nextEffect));
    }

    Fa = $a = !1, "function" === typeof la && la(t.stateNode), S = t.expirationTime, t = t.childExpirationTime, t = t > S ? t : S, 0 === t && (Qa = null), e.expirationTime = t, e.finishedWork = null;
  }

  function wr(e) {
    null === el && o("246"), el.expirationTime = 0, rl || (rl = !0, ol = e);
  }

  function kr(e, t) {
    var n = il;
    il = !0;

    try {
      return e(t);
    } finally {
      (il = n) || Za || yr(1073741823, !1);
    }
  }

  function _r(e, t) {
    if (il && !al) {
      al = !0;

      try {
        return e(t);
      } finally {
        al = !1;
      }
    }

    return e(t);
  }

  function xr(e, t, n) {
    if (ll) return e(t, n);
    il || Za || 0 === nl || (yr(nl, !1), nl = 0);
    var r = ll,
        o = il;
    il = ll = !0;

    try {
      return e(t, n);
    } finally {
      ll = r, (il = o) || Za || yr(1073741823, !1);
    }
  }

  function Tr(e, t, n, r, i) {
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
              if (gt(l.type)) {
                l = l.stateNode.__reactInternalMemoizedMergedChildContext;
                break t;
              }

          }

          l = l.return;
        } while (null !== l);

        o("171"), l = void 0;
      }

      if (1 === n.tag) {
        var u = n.type;

        if (gt(u)) {
          n = _t(n, u, l);
          break e;
        }
      }

      n = l;
    } else n = ra;

    return null === t.context ? t.context = n : t.pendingContext = n, t = i, i = Wt(r), i.payload = {
      element: e
    }, t = void 0 === t ? null : t, null !== t && (i.callback = t), Xn(), $t(a, i), ir(a, r), r;
  }

  function Er(e, t, n, r) {
    var o = t.current;
    return o = tr(fr(), o), Tr(e, t, n, o, r);
  }

  function Cr(e) {
    if (e = e.current, !e.child) return null;

    switch (e.child.tag) {
      case 5:
      default:
        return e.child.stateNode;
    }
  }

  function Sr(e, t, n) {
    var r = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
    return {
      $$typeof: Fo,
      key: null == r ? null : "" + r,
      children: e,
      containerInfo: t,
      implementation: n
    };
  }

  function Pr(e) {
    var t = 1073741822 - 25 * (1 + ((1073741822 - fr() + 500) / 25 | 0));
    t >= Ra && (t = Ra - 1), this._expirationTime = Ra = t, this._root = e, this._callbacks = this._next = null, this._hasChildren = this._didComplete = !1, this._children = null, this._defer = !0;
  }

  function Or() {
    this._callbacks = null, this._didCommit = !1, this._onCommit = this._onCommit.bind(this);
  }

  function Nr(e, t, n) {
    t = Pt(3, null, null, t ? 3 : 0), e = {
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

  function Dr(e) {
    return !(!e || 1 !== e.nodeType && 9 !== e.nodeType && 11 !== e.nodeType && (8 !== e.nodeType || " react-mount-point-unstable " !== e.nodeValue));
  }

  function jr(e, t) {
    if (t || (t = e ? 9 === e.nodeType ? e.documentElement : e.firstChild : null, t = !(!t || 1 !== t.nodeType || !t.hasAttribute("data-reactroot"))), !t) for (var n; n = e.lastChild;) {
      e.removeChild(n);
    }
    return new Nr(e, !1, t);
  }

  function Mr(e, t, n, r, i) {
    Dr(n) || o("200");
    var a = n._reactRootContainer;

    if (a) {
      if ("function" === typeof i) {
        var l = i;

        i = function i() {
          var e = Cr(a._internalRoot);
          l.call(e);
        };
      }

      null != e ? a.legacy_renderSubtreeIntoContainer(e, t, i) : a.render(t, i);
    } else {
      if (a = n._reactRootContainer = jr(n, r), "function" === typeof i) {
        var u = i;

        i = function i() {
          var e = Cr(a._internalRoot);
          u.call(e);
        };
      }

      _r(function () {
        null != e ? a.legacy_renderSubtreeIntoContainer(e, t, i) : a.render(t, i);
      });
    }

    return Cr(a._internalRoot);
  }

  function Ir(e, t) {
    var n = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
    return Dr(t) || o("200"), Sr(e, t, null, n);
  }

  function Ar(e, t) {
    return Dr(e) || o("299", "unstable_createRoot"), new Nr(e, !0, null != t && !0 === t.hydrate);
  }

  var Rr = n(0),
      Ur = n(1),
      Fr = n(14);
  Rr || o("227");
  var Lr = !1,
      zr = null,
      Br = !1,
      Vr = null,
      Wr = {
    onError: function onError(e) {
      Lr = !0, zr = e;
    }
  },
      Hr = null,
      $r = {},
      qr = [],
      Yr = {},
      Qr = {},
      Kr = {},
      Xr = null,
      Gr = null,
      Jr = null,
      Zr = null,
      eo = {
    injectEventPluginOrder: function injectEventPluginOrder(e) {
      Hr && o("101"), Hr = Array.prototype.slice.call(e), u();
    },
    injectEventPluginsByName: function injectEventPluginsByName(e) {
      var t,
          n = !1;

      for (t in e) {
        if (e.hasOwnProperty(t)) {
          var r = e[t];
          $r.hasOwnProperty(t) && $r[t] === r || ($r[t] && o("102", t), $r[t] = r, n = !0);
        }
      }

      n && u();
    }
  },
      to = Math.random().toString(36).slice(2),
      no = "__reactInternalInstance$" + to,
      ro = "__reactEventHandlers$" + to,
      oo = !("undefined" === typeof window || !window.document || !window.document.createElement),
      io = {
    animationend: C("Animation", "AnimationEnd"),
    animationiteration: C("Animation", "AnimationIteration"),
    animationstart: C("Animation", "AnimationStart"),
    transitionend: C("Transition", "TransitionEnd")
  },
      ao = {},
      lo = {};
  oo && (lo = document.createElement("div").style, "AnimationEvent" in window || (delete io.animationend.animation, delete io.animationiteration.animation, delete io.animationstart.animation), "TransitionEvent" in window || delete io.transitionend.transition);
  var uo = S("animationend"),
      co = S("animationiteration"),
      so = S("animationstart"),
      fo = S("transitionend"),
      po = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),
      ho = null,
      mo = null,
      yo = null;
  Ur(D.prototype, {
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
    return Ur(o, n.prototype), n.prototype = o, n.prototype.constructor = n, n.Interface = Ur({}, r.Interface, e), n.extend = r.extend, I(n), n;
  }, I(D);
  var vo = D.extend({
    data: null
  }),
      go = D.extend({
    data: null
  }),
      bo = [9, 13, 27, 32],
      wo = oo && "CompositionEvent" in window,
      ko = null;
  oo && "documentMode" in document && (ko = document.documentMode);

  var _o = oo && "TextEvent" in window && !ko,
      xo = oo && (!wo || ko && 8 < ko && 11 >= ko),
      To = String.fromCharCode(32),
      Eo = {
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
      Co = !1,
      So = !1,
      Po = {
    eventTypes: Eo,
    extractEvents: function extractEvents(e, t, n, r) {
      var o = void 0,
          i = void 0;
      if (wo) e: {
        switch (e) {
          case "compositionstart":
            o = Eo.compositionStart;
            break e;

          case "compositionend":
            o = Eo.compositionEnd;
            break e;

          case "compositionupdate":
            o = Eo.compositionUpdate;
            break e;
        }

        o = void 0;
      } else So ? A(e, n) && (o = Eo.compositionEnd) : "keydown" === e && 229 === n.keyCode && (o = Eo.compositionStart);
      return o ? (xo && "ko" !== n.locale && (So || o !== Eo.compositionStart ? o === Eo.compositionEnd && So && (i = P()) : (ho = r, mo = "value" in ho ? ho.value : ho.textContent, So = !0)), o = vo.getPooled(o, t, n, r), i ? o.data = i : null !== (i = R(n)) && (o.data = i), E(o), i = o) : i = null, (e = _o ? U(e, n) : F(e, n)) ? (t = go.getPooled(Eo.beforeInput, t, n, r), t.data = e, E(t)) : t = null, null === i ? t : null === t ? i : [i, t];
    }
  },
      Oo = null,
      No = null,
      Do = null,
      jo = !1,
      Mo = {
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
      Io = Rr.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
      Ao = /^(.*)[\\\/]/,
      Ro = "function" === typeof Symbol && Symbol.for,
      Uo = Ro ? Symbol.for("react.element") : 60103,
      Fo = Ro ? Symbol.for("react.portal") : 60106,
      Lo = Ro ? Symbol.for("react.fragment") : 60107,
      zo = Ro ? Symbol.for("react.strict_mode") : 60108,
      Bo = Ro ? Symbol.for("react.profiler") : 60114,
      Vo = Ro ? Symbol.for("react.provider") : 60109,
      Wo = Ro ? Symbol.for("react.context") : 60110,
      Ho = Ro ? Symbol.for("react.concurrent_mode") : 60111,
      $o = Ro ? Symbol.for("react.forward_ref") : 60112,
      qo = Ro ? Symbol.for("react.suspense") : 60113,
      Yo = Ro ? Symbol.for("react.memo") : 60115,
      Qo = Ro ? Symbol.for("react.lazy") : 60116,
      Ko = "function" === typeof Symbol && Symbol.iterator,
      Xo = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,
      Go = Object.prototype.hasOwnProperty,
      Jo = {},
      Zo = {},
      ei = {};

  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function (e) {
    ei[e] = new ie(e, 0, !1, e, null);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function (e) {
    var t = e[0];
    ei[t] = new ie(t, 1, !1, e[1], null);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function (e) {
    ei[e] = new ie(e, 2, !1, e.toLowerCase(), null);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function (e) {
    ei[e] = new ie(e, 2, !1, e, null);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function (e) {
    ei[e] = new ie(e, 3, !1, e.toLowerCase(), null);
  }), ["checked", "multiple", "muted", "selected"].forEach(function (e) {
    ei[e] = new ie(e, 3, !0, e, null);
  }), ["capture", "download"].forEach(function (e) {
    ei[e] = new ie(e, 4, !1, e, null);
  }), ["cols", "rows", "size", "span"].forEach(function (e) {
    ei[e] = new ie(e, 6, !1, e, null);
  }), ["rowSpan", "start"].forEach(function (e) {
    ei[e] = new ie(e, 5, !1, e.toLowerCase(), null);
  });
  var ti = /[\-:]([a-z])/g;
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function (e) {
    var t = e.replace(ti, ae);
    ei[t] = new ie(t, 1, !1, e, null);
  }), "xlink:actuate xlink:arcrole xlink:href xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function (e) {
    var t = e.replace(ti, ae);
    ei[t] = new ie(t, 1, !1, e, "http://www.w3.org/1999/xlink");
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function (e) {
    var t = e.replace(ti, ae);
    ei[t] = new ie(t, 1, !1, e, "http://www.w3.org/XML/1998/namespace");
  }), ei.tabIndex = new ie("tabIndex", 1, !1, "tabindex", null);
  var ni = {
    change: {
      phasedRegistrationNames: {
        bubbled: "onChange",
        captured: "onChangeCapture"
      },
      dependencies: "blur change click focus input keydown keyup selectionchange".split(" ")
    }
  },
      ri = null,
      oi = null,
      ii = !1;
  oo && (ii = Q("input") && (!document.documentMode || 9 < document.documentMode));
  var ai = {
    eventTypes: ni,
    _isInputEventSupported: ii,
    extractEvents: function extractEvents(e, t, n, r) {
      var o = t ? g(t) : window,
          i = void 0,
          a = void 0,
          l = o.nodeName && o.nodeName.toLowerCase();
      if ("select" === l || "input" === l && "file" === o.type ? i = ge : q(o) ? ii ? i = Te : (i = _e, a = ke) : (l = o.nodeName) && "input" === l.toLowerCase() && ("checkbox" === o.type || "radio" === o.type) && (i = xe), i && (i = i(e, t))) return me(i, n, r);
      a && a(e, o, t), "blur" === e && (e = o._wrapperState) && e.controlled && "number" === o.type && he(o, "number", o.value);
    }
  },
      li = D.extend({
    view: null,
    detail: null
  }),
      ui = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  },
      ci = 0,
      si = 0,
      fi = !1,
      di = !1,
      pi = li.extend({
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
      var t = ci;
      return ci = e.screenX, fi ? "mousemove" === e.type ? e.screenX - t : 0 : (fi = !0, 0);
    },
    movementY: function movementY(e) {
      if ("movementY" in e) return e.movementY;
      var t = si;
      return si = e.screenY, di ? "mousemove" === e.type ? e.screenY - t : 0 : (di = !0, 0);
    }
  }),
      hi = pi.extend({
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
      mi = {
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
      yi = {
    eventTypes: mi,
    extractEvents: function extractEvents(e, t, n, r) {
      var o = "mouseover" === e || "pointerover" === e,
          i = "mouseout" === e || "pointerout" === e;
      if (o && (n.relatedTarget || n.fromElement) || !i && !o) return null;
      if (o = r.window === r ? r : (o = r.ownerDocument) ? o.defaultView || o.parentWindow : window, i ? (i = t, t = (t = n.relatedTarget || n.toElement) ? y(t) : null) : i = null, i === t) return null;
      var a = void 0,
          l = void 0,
          u = void 0,
          c = void 0;
      "mouseout" === e || "mouseover" === e ? (a = pi, l = mi.mouseLeave, u = mi.mouseEnter, c = "mouse") : "pointerout" !== e && "pointerover" !== e || (a = hi, l = mi.pointerLeave, u = mi.pointerEnter, c = "pointer");
      var s = null == i ? o : g(i);
      if (o = null == t ? o : g(t), e = a.getPooled(l, i, n, r), e.type = c + "leave", e.target = s, e.relatedTarget = o, n = a.getPooled(u, t, n, r), n.type = c + "enter", n.target = o, n.relatedTarget = s, r = t, i && r) e: {
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
        x(t[r], "bubbled", e);
      }

      for (r = i.length; 0 < r--;) {
        x(i[r], "captured", n);
      }

      return [e, n];
    }
  },
      vi = Object.prototype.hasOwnProperty,
      gi = D.extend({
    animationName: null,
    elapsedTime: null,
    pseudoElement: null
  }),
      bi = D.extend({
    clipboardData: function clipboardData(e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    }
  }),
      wi = li.extend({
    relatedTarget: null
  }),
      ki = {
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
      _i = {
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
      xi = li.extend({
    key: function key(e) {
      if (e.key) {
        var t = ki[e.key] || e.key;
        if ("Unidentified" !== t) return t;
      }

      return "keypress" === e.type ? (e = Me(e), 13 === e ? "Enter" : String.fromCharCode(e)) : "keydown" === e.type || "keyup" === e.type ? _i[e.keyCode] || "Unidentified" : "";
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
      Ti = pi.extend({
    dataTransfer: null
  }),
      Ei = li.extend({
    touches: null,
    targetTouches: null,
    changedTouches: null,
    altKey: null,
    metaKey: null,
    ctrlKey: null,
    shiftKey: null,
    getModifierState: Ce
  }),
      Ci = D.extend({
    propertyName: null,
    elapsedTime: null,
    pseudoElement: null
  }),
      Si = pi.extend({
    deltaX: function deltaX(e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function deltaY(e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: null,
    deltaMode: null
  }),
      Pi = [["abort", "abort"], [uo, "animationEnd"], [co, "animationIteration"], [so, "animationStart"], ["canplay", "canPlay"], ["canplaythrough", "canPlayThrough"], ["drag", "drag"], ["dragenter", "dragEnter"], ["dragexit", "dragExit"], ["dragleave", "dragLeave"], ["dragover", "dragOver"], ["durationchange", "durationChange"], ["emptied", "emptied"], ["encrypted", "encrypted"], ["ended", "ended"], ["error", "error"], ["gotpointercapture", "gotPointerCapture"], ["load", "load"], ["loadeddata", "loadedData"], ["loadedmetadata", "loadedMetadata"], ["loadstart", "loadStart"], ["lostpointercapture", "lostPointerCapture"], ["mousemove", "mouseMove"], ["mouseout", "mouseOut"], ["mouseover", "mouseOver"], ["playing", "playing"], ["pointermove", "pointerMove"], ["pointerout", "pointerOut"], ["pointerover", "pointerOver"], ["progress", "progress"], ["scroll", "scroll"], ["seeking", "seeking"], ["stalled", "stalled"], ["suspend", "suspend"], ["timeupdate", "timeUpdate"], ["toggle", "toggle"], ["touchmove", "touchMove"], [fo, "transitionEnd"], ["waiting", "waiting"], ["wheel", "wheel"]],
      Oi = {},
      Ni = {};
  [["blur", "blur"], ["cancel", "cancel"], ["click", "click"], ["close", "close"], ["contextmenu", "contextMenu"], ["copy", "copy"], ["cut", "cut"], ["auxclick", "auxClick"], ["dblclick", "doubleClick"], ["dragend", "dragEnd"], ["dragstart", "dragStart"], ["drop", "drop"], ["focus", "focus"], ["input", "input"], ["invalid", "invalid"], ["keydown", "keyDown"], ["keypress", "keyPress"], ["keyup", "keyUp"], ["mousedown", "mouseDown"], ["mouseup", "mouseUp"], ["paste", "paste"], ["pause", "pause"], ["play", "play"], ["pointercancel", "pointerCancel"], ["pointerdown", "pointerDown"], ["pointerup", "pointerUp"], ["ratechange", "rateChange"], ["reset", "reset"], ["seeked", "seeked"], ["submit", "submit"], ["touchcancel", "touchCancel"], ["touchend", "touchEnd"], ["touchstart", "touchStart"], ["volumechange", "volumeChange"]].forEach(function (e) {
    Ie(e, !0);
  }), Pi.forEach(function (e) {
    Ie(e, !1);
  });
  var Di = {
    eventTypes: Oi,
    isInteractiveTopLevelEventType: function isInteractiveTopLevelEventType(e) {
      return void 0 !== (e = Ni[e]) && !0 === e.isInteractive;
    },
    extractEvents: function extractEvents(e, t, n, r) {
      var o = Ni[e];
      if (!o) return null;

      switch (e) {
        case "keypress":
          if (0 === Me(n)) return null;

        case "keydown":
        case "keyup":
          e = xi;
          break;

        case "blur":
        case "focus":
          e = wi;
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
          e = pi;
          break;

        case "drag":
        case "dragend":
        case "dragenter":
        case "dragexit":
        case "dragleave":
        case "dragover":
        case "dragstart":
        case "drop":
          e = Ti;
          break;

        case "touchcancel":
        case "touchend":
        case "touchmove":
        case "touchstart":
          e = Ei;
          break;

        case uo:
        case co:
        case so:
          e = gi;
          break;

        case fo:
          e = Ci;
          break;

        case "scroll":
          e = li;
          break;

        case "wheel":
          e = Si;
          break;

        case "copy":
        case "cut":
        case "paste":
          e = bi;
          break;

        case "gotpointercapture":
        case "lostpointercapture":
        case "pointercancel":
        case "pointerdown":
        case "pointermove":
        case "pointerout":
        case "pointerover":
        case "pointerup":
          e = hi;
          break;

        default:
          e = D;
      }

      return t = e.getPooled(o, t, n, r), E(t), t;
    }
  },
      ji = Di.isInteractiveTopLevelEventType,
      Mi = [],
      Ii = !0,
      Ai = {},
      Ri = 0,
      Ui = "_reactListenersID" + ("" + Math.random()).slice(2),
      Fi = oo && "documentMode" in document && 11 >= document.documentMode,
      Li = {
    select: {
      phasedRegistrationNames: {
        bubbled: "onSelect",
        captured: "onSelectCapture"
      },
      dependencies: "blur contextmenu dragend focus keydown keyup mousedown mouseup selectionchange".split(" ")
    }
  },
      zi = null,
      Bi = null,
      Vi = null,
      Wi = !1,
      Hi = {
    eventTypes: Li,
    extractEvents: function extractEvents(e, t, n, r) {
      var o,
          i = r.window === r ? r.document : 9 === r.nodeType ? r : r.ownerDocument;

      if (!(o = !i)) {
        e: {
          i = ze(i), o = Kr.onSelect;

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

      switch (i = t ? g(t) : window, e) {
        case "focus":
          (q(i) || "true" === i.contentEditable) && (zi = i, Bi = t, Vi = null);
          break;

        case "blur":
          Vi = Bi = zi = null;
          break;

        case "mousedown":
          Wi = !0;
          break;

        case "contextmenu":
        case "mouseup":
        case "dragend":
          return Wi = !1, Ye(n, r);

        case "selectionchange":
          if (Fi) break;

        case "keydown":
        case "keyup":
          return Ye(n, r);
      }

      return null;
    }
  };
  eo.injectEventPluginOrder("ResponderEventPlugin SimpleEventPlugin EnterLeaveEventPlugin ChangeEventPlugin SelectEventPlugin BeforeInputEventPlugin".split(" ")), Xr = b, Gr = v, Jr = g, eo.injectEventPluginsByName({
    SimpleEventPlugin: Di,
    EnterLeaveEventPlugin: yi,
    ChangeEventPlugin: ai,
    SelectEventPlugin: Hi,
    BeforeInputEventPlugin: Po
  });

  var $i = {
    html: "http://www.w3.org/1999/xhtml",
    mathml: "http://www.w3.org/1998/Math/MathML",
    svg: "http://www.w3.org/2000/svg"
  },
      qi = void 0,
      Yi = function (e) {
    return "undefined" !== typeof MSApp && MSApp.execUnsafeLocalFunction ? function (t, n, r, o) {
      MSApp.execUnsafeLocalFunction(function () {
        return e(t, n);
      });
    } : e;
  }(function (e, t) {
    if (e.namespaceURI !== $i.svg || "innerHTML" in e) e.innerHTML = t;else {
      for (qi = qi || document.createElement("div"), qi.innerHTML = "<svg>" + t + "</svg>", t = qi.firstChild; e.firstChild;) {
        e.removeChild(e.firstChild);
      }

      for (; t.firstChild;) {
        e.appendChild(t.firstChild);
      }
    }
  }),
      Qi = {
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
      Ki = ["Webkit", "ms", "Moz", "O"];

  Object.keys(Qi).forEach(function (e) {
    Ki.forEach(function (t) {
      t = t + e.charAt(0).toUpperCase() + e.substring(1), Qi[t] = Qi[e];
    });
  });
  var Xi = Ur({
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
      Gi = null,
      Ji = null,
      Zi = "function" === typeof setTimeout ? setTimeout : void 0,
      ea = "function" === typeof clearTimeout ? clearTimeout : void 0;
  new Set();

  var ta = [],
      na = -1,
      ra = {},
      oa = {
    current: ra
  },
      ia = {
    current: !1
  },
      aa = ra,
      la = null,
      ua = null,
      ca = !1,
      sa = {
    current: null
  },
      fa = null,
      da = null,
      pa = null,
      ha = {},
      ma = {
    current: ha
  },
      ya = {
    current: ha
  },
      va = {
    current: ha
  },
      ga = Io.ReactCurrentOwner,
      ba = new Rr.Component().refs,
      wa = {
    isMounted: function isMounted(e) {
      return !!(e = e._reactInternalFiber) && 2 === Oe(e);
    },
    enqueueSetState: function enqueueSetState(e, t, n) {
      e = e._reactInternalFiber;
      var r = fr();
      r = tr(r, e);
      var o = Wt(r);
      o.payload = t, void 0 !== n && null !== n && (o.callback = n), Xn(), $t(e, o), ir(e, r);
    },
    enqueueReplaceState: function enqueueReplaceState(e, t, n) {
      e = e._reactInternalFiber;
      var r = fr();
      r = tr(r, e);
      var o = Wt(r);
      o.tag = 1, o.payload = t, void 0 !== n && null !== n && (o.callback = n), Xn(), $t(e, o), ir(e, r);
    },
    enqueueForceUpdate: function enqueueForceUpdate(e, t) {
      e = e._reactInternalFiber;
      var n = fr();
      n = tr(n, e);
      var r = Wt(n);
      r.tag = 2, void 0 !== t && null !== t && (r.callback = t), Xn(), $t(e, r), ir(e, n);
    }
  },
      ka = Array.isArray,
      _a = gn(!0),
      xa = gn(!1),
      Ta = null,
      Ea = null,
      Ca = !1,
      Sa = Io.ReactCurrentOwner,
      Pa = void 0,
      Oa = void 0,
      Na = void 0,
      Da = void 0;

  Pa = function Pa(e, t) {
    for (var n = t.child; null !== n;) {
      if (5 === n.tag || 6 === n.tag) e.appendChild(n.stateNode);else if (4 !== n.tag && null !== n.child) {
        n.child.return = n, n = n.child;
        continue;
      }
      if (n === t) break;

      for (; null === n.sibling;) {
        if (null === n.return || n.return === t) return;
        n = n.return;
      }

      n.sibling.return = n.return, n = n.sibling;
    }
  }, Oa = function Oa() {}, Na = function Na(e, t, n, r, o) {
    var i = e.memoizedProps;

    if (i !== r) {
      var a = t.stateNode;

      switch (rn(ma.current), e = null, n) {
        case "input":
          i = ce(a, i), r = ce(a, r), e = [];
          break;

        case "option":
          i = Ke(a, i), r = Ke(a, r), e = [];
          break;

        case "select":
          i = Ur({}, i, {
            value: void 0
          }), r = Ur({}, r, {
            value: void 0
          }), e = [];
          break;

        case "textarea":
          i = Ge(a, i), r = Ge(a, r), e = [];
          break;

        default:
          "function" !== typeof i.onClick && "function" === typeof r.onClick && (a.onclick = ct);
      }

      at(n, r), a = n = void 0;
      var l = null;

      for (n in i) {
        if (!r.hasOwnProperty(n) && i.hasOwnProperty(n) && null != i[n]) if ("style" === n) {
          var u = i[n];

          for (a in u) {
            u.hasOwnProperty(a) && (l || (l = {}), l[a] = "");
          }
        } else "dangerouslySetInnerHTML" !== n && "children" !== n && "suppressContentEditableWarning" !== n && "suppressHydrationWarning" !== n && "autoFocus" !== n && (Qr.hasOwnProperty(n) ? e || (e = []) : (e = e || []).push(n, null));
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
        } else "dangerouslySetInnerHTML" === n ? (c = c ? c.__html : void 0, u = u ? u.__html : void 0, null != c && u !== c && (e = e || []).push(n, "" + c)) : "children" === n ? u === c || "string" !== typeof c && "number" !== typeof c || (e = e || []).push(n, "" + c) : "suppressContentEditableWarning" !== n && "suppressHydrationWarning" !== n && (Qr.hasOwnProperty(n) ? (null != c && ut(o, n), e || u === c || (e = [])) : (e = e || []).push(n, c));
      }

      l && (e = e || []).push("style", l), o = e, (t.updateQueue = o) && Un(t);
    }
  }, Da = function Da(e, t, n, r) {
    n !== r && Un(t);
  };
  var ja = "function" === typeof WeakSet ? WeakSet : Set,
      Ma = "function" === typeof WeakMap ? WeakMap : Map,
      Ia = {
    readContext: nn
  },
      Aa = Io.ReactCurrentOwner,
      Ra = 1073741822,
      Ua = 0,
      Fa = !1,
      La = null,
      za = null,
      Ba = 0,
      Va = -1,
      Wa = !1,
      Ha = null,
      $a = !1,
      qa = null,
      Ya = null,
      Qa = null,
      Ka = null,
      Xa = null,
      Ga = 0,
      Ja = void 0,
      Za = !1,
      el = null,
      tl = 0,
      nl = 0,
      rl = !1,
      ol = null,
      il = !1,
      al = !1,
      ll = !1,
      ul = null,
      cl = Fr.unstable_now(),
      sl = 1073741822 - (cl / 10 | 0),
      fl = sl,
      dl = 50,
      pl = 0,
      hl = null,
      ml = !1;
  Oo = function Oo(e, t, n) {
    switch (t) {
      case "input":
        if (de(e, n), t = n.name, "radio" === n.type && null != t) {
          for (n = e; n.parentNode;) {
            n = n.parentNode;
          }

          for (n = n.querySelectorAll("input[name=" + JSON.stringify("" + t) + '][type="radio"]'), t = 0; t < n.length; t++) {
            var r = n[t];

            if (r !== e && r.form === e.form) {
              var i = b(r);
              i || o("90"), J(r), de(r, i);
            }
          }
        }

        break;

      case "textarea":
        Ze(e, n);
        break;

      case "select":
        null != (t = n.value) && Xe(e, !!n.multiple, t, !1);
    }
  }, Pr.prototype.render = function (e) {
    this._defer || o("250"), this._hasChildren = !0, this._children = e;
    var t = this._root._internalRoot,
        n = this._expirationTime,
        r = new Or();
    return Tr(e, t, null, n, r._onCommit), r;
  }, Pr.prototype.then = function (e) {
    if (this._didComplete) e();else {
      var t = this._callbacks;
      null === t && (t = this._callbacks = []), t.push(e);
    }
  }, Pr.prototype.commit = function () {
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

      this._defer = !1, vr(e, n), t = this._next, this._next = null, t = e.firstBatch = t, null !== t && t._hasChildren && t.render(t._children);
    } else this._next = null, this._defer = !1;
  }, Pr.prototype._onComplete = function () {
    if (!this._didComplete) {
      this._didComplete = !0;
      var e = this._callbacks;
      if (null !== e) for (var t = 0; t < e.length; t++) {
        (0, e[t])();
      }
    }
  }, Or.prototype.then = function (e) {
    if (this._didCommit) e();else {
      var t = this._callbacks;
      null === t && (t = this._callbacks = []), t.push(e);
    }
  }, Or.prototype._onCommit = function () {
    if (!this._didCommit) {
      this._didCommit = !0;
      var e = this._callbacks;
      if (null !== e) for (var t = 0; t < e.length; t++) {
        var n = e[t];
        "function" !== typeof n && o("191", n), n();
      }
    }
  }, Nr.prototype.render = function (e, t) {
    var n = this._internalRoot,
        r = new Or();
    return t = void 0 === t ? null : t, null !== t && r.then(t), Er(e, n, null, r._onCommit), r;
  }, Nr.prototype.unmount = function (e) {
    var t = this._internalRoot,
        n = new Or();
    return e = void 0 === e ? null : e, null !== e && n.then(e), Er(null, t, null, n._onCommit), n;
  }, Nr.prototype.legacy_renderSubtreeIntoContainer = function (e, t, n) {
    var r = this._internalRoot,
        o = new Or();
    return n = void 0 === n ? null : n, null !== n && o.then(n), Er(t, r, e, o._onCommit), o;
  }, Nr.prototype.createBatch = function () {
    var e = new Pr(this),
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
  }, V = kr, W = xr, H = function H() {
    Za || 0 === nl || (yr(nl, !1), nl = 0);
  };
  var yl = {
    createPortal: Ir,
    findDOMNode: function findDOMNode(e) {
      if (null == e) return null;
      if (1 === e.nodeType) return e;
      var t = e._reactInternalFiber;
      return void 0 === t && ("function" === typeof e.render ? o("188") : o("268", Object.keys(e))), e = je(t), e = null === e ? null : e.stateNode;
    },
    hydrate: function hydrate(e, t, n) {
      return Mr(null, e, t, !0, n);
    },
    render: function render(e, t, n) {
      return Mr(null, e, t, !1, n);
    },
    unstable_renderSubtreeIntoContainer: function unstable_renderSubtreeIntoContainer(e, t, n, r) {
      return (null == e || void 0 === e._reactInternalFiber) && o("38"), Mr(e, t, n, !1, r);
    },
    unmountComponentAtNode: function unmountComponentAtNode(e) {
      return Dr(e) || o("40"), !!e._reactRootContainer && (_r(function () {
        Mr(null, null, e, !1, function () {
          e._reactRootContainer = null;
        });
      }), !0);
    },
    unstable_createPortal: function unstable_createPortal() {
      return Ir.apply(void 0, arguments);
    },
    unstable_batchedUpdates: kr,
    unstable_interactiveUpdates: xr,
    flushSync: function flushSync(e, t) {
      Za && o("187");
      var n = il;
      il = !0;

      try {
        return ar(e, t);
      } finally {
        il = n, yr(1073741823, !1);
      }
    },
    unstable_createRoot: Ar,
    unstable_flushControlled: function unstable_flushControlled(e) {
      var t = il;
      il = !0;

      try {
        ar(e);
      } finally {
        (il = t) || Za || yr(1073741823, !1);
      }
    },
    __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: {
      Events: [v, g, b, eo.injectEventPluginsByName, Yr, E, function (e) {
        d(e, T);
      }, z, B, Le, m]
    }
  };
  !function (e) {
    var t = e.findFiberByHostInstance;
    Ct(Ur({}, e, {
      overrideProps: null,
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
    version: "16.7.0",
    rendererPackageName: "react-dom"
  });
  var vl = {
    default: yl
  },
      gl = vl && yl || vl;
  e.exports = gl.default || gl;
}, function (e, t, n) {
  "use strict";

  e.exports = n(15);
}, function (e, t, n) {
  "use strict";

  (function (e) {
    function n() {
      if (!h) {
        var e = c.expirationTime;
        m ? x() : m = !0, _2(i, e);
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
      l = b(function (t) {
        g(u), e(t);
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
        g = "function" === typeof clearTimeout ? clearTimeout : void 0,
        b = "function" === typeof requestAnimationFrame ? requestAnimationFrame : void 0,
        w = "function" === typeof cancelAnimationFrame ? cancelAnimationFrame : void 0;

    if ("object" === (typeof performance === "undefined" ? "undefined" : _typeof(performance)) && "function" === typeof performance.now) {
      var k = performance;

      t.unstable_now = function () {
        return k.now();
      };
    } else t.unstable_now = function () {
      return y.now();
    };

    var _2,
        x,
        T,
        E = null;

    if ("undefined" !== typeof window ? E = window : "undefined" !== typeof e && (E = e), E && E._schedMock) {
      var C = E._schedMock;
      _2 = C[0], x = C[1], T = C[2], t.unstable_now = C[3];
    } else if ("undefined" === typeof window || "function" !== typeof MessageChannel) {
      var S = null,
          P = function P(e) {
        if (null !== S) try {
          S(e);
        } finally {
          S = null;
        }
      };

      _2 = function _(e) {
        null !== S ? setTimeout(_2, 0, e) : (S = e, setTimeout(P, 0, !1));
      }, x = function x() {
        S = null;
      }, T = function T() {
        return !1;
      };
    } else {
      "undefined" !== typeof console && ("function" !== typeof b && console.error("This browser doesn't support requestAnimationFrame. Make sure that you load a polyfill in older browsers. https://fb.me/react-polyfills"), "function" !== typeof w && console.error("This browser doesn't support cancelAnimationFrame. Make sure that you load a polyfill in older browsers. https://fb.me/react-polyfills"));
      var O = null,
          N = !1,
          D = -1,
          j = !1,
          M = !1,
          I = 0,
          A = 33,
          R = 33;

      T = function T() {
        return I <= t.unstable_now();
      };

      var U = new MessageChannel(),
          F = U.port2;

      U.port1.onmessage = function () {
        N = !1;
        var e = O,
            n = D;
        O = null, D = -1;
        var r = t.unstable_now(),
            o = !1;

        if (0 >= I - r) {
          if (!(-1 !== n && n <= r)) return j || (j = !0, a(L)), O = e, void (D = n);
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

      var L = function L(e) {
        if (null !== O) {
          a(L);
          var t = e - I + R;
          t < R && A < R ? (8 > t && (t = 8), R = t < A ? A : t) : A = t, I = e + R, N || (N = !0, F.postMessage(void 0));
        } else j = !1;
      };

      _2 = function _2(e, t) {
        O = e, D = t, M || 0 > t ? F.postMessage(void 0) : j || (j = !0, a(L));
      }, x = function x() {
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
      n.handleFilterChange = function (e) {
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
      }, n.loadPrototypes();

      var r = function e(t, n, r) {
        return t ? Object.assign({}, r(t), o({}, n, t[n].map(function (t) {
          return e(t, n, r);
        }))) : null;
      };

      return fetch("http://192.168.15.250/data/odata/v4/groups?$filter=Id eq 98B34F14-6DAA-3EE4-4EB1-E6D4F691960E&$expand=Childs($levels=max;$expand=Exams($expand=Data.Models.ExamDecimal/LimitDenormalized,Data.Models.ExamString/LimitDenormalized))").then(function (e) {
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

          if (e.Exams) {
            var r = e.Exams.GroupBy(function (e) {
              return new Date(e.CollectionDate).formatToYYYY_MM_DD() + "T00:00:00";
            });
            i = i.concat(r.keys());
            var a = r.cast2(function (e, t) {
              return o({}, t, n.valueCol(e[0]));
            });
            t = Object.assign({}, t, a);
            var l = e.Exams.map(function (e) {
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
          keys: i.Distinct()
        });
      }), n;
    }

    return l(t, e), f(t, [{
      key: "loadPrototypes",
      value: function value() {
        var e = function e(_e2, t) {
          Object.keys(_e2).forEach(function (n, r) {
            var o = _e2[n];
            Array.isArray(o) && t(o, n);
          });
        },
            t = function t(e, _t2) {
          var n = {};
          return e.forEach(function (e, r) {
            return n = Object.assign({}, n, _t2(e, r));
          }), n;
        };

        Date.prototype.formatToYYYY_MM_DD = function () {
          var e = "" + (this.getMonth() + 1),
              t = "" + this.getDate(),
              n = this.getFullYear();
          return e.length < 2 && (e = "0" + e), t.length < 2 && (t = "0" + t), [n, e, t].join("-");
        }, Date.prototype.formatToDD_MM_YY = function () {
          var e = "" + (this.getMonth() + 1),
              t = "" + this.getDate(),
              n = this.getFullYear();
          return e.length < 2 && (e = "0" + e), t.length < 2 && (t = "0" + t), [t, e, n - 2e3].join("/");
        }, Array.prototype.GroupBy = function (n) {
          var r = {};
          return this.forEach(function (e) {
            var t = n(e);
            r[t] || (r[t] = []), r[t].push(e);
          }), r.forEach || (r.forEach = function (t) {
            return e(r, t);
          }), r.cast2 || (r.cast2 = function (e) {
            return t(r, e);
          }), r.keys || (r.keys = function () {
            return Object.keys(r).filter(function (e) {
              return Array.isArray(r[e]);
            });
          }), r;
        }, Array.prototype.Distinct = function () {
          return this.filter(function (e, t, n) {
            return n.indexOf(e) === t;
          });
        };
      }
    }, {
      key: "getLimitDescription",
      value: function value(e) {
        var t = "";

        switch (e["@odata.type"]) {
          case "#Data.Models.ExamDecimal":
            var n = e.LimitDenormalized;
            n && (n.Name && (t += n.Name + ":"), "BiggerThan" === n.MinType ? t += " > " + n.Min : "EqualsOrBiggerThan" === n.MinType && (t += " >= " + n.Min), n.MinType && n.MaxType && (t += " e"), "SmallThan" === n.MaxType ? t += " < " + n.Max : "SmallOrEqualsThan" === n.MaxType && (t += " <= " + n.Max));
            break;

          case "#Data.Models.ExamString":
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
          case "#Data.Models.ExamDecimal":
            t = e.DecimalValue, n = e.LimitDenormalized ? e.LimitDenormalized.Color : null;
            break;

          case "#Data.Models.ExamString":
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
            i = o.map(function (e) {
          return {
            description: c.a.createElement("center", null, c.a.createElement("b", null, new Date(e).formatToDD_MM_YY())),
            name: e
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
        return e.default;
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
        var r = "function" === typeof Symbol && Symbol.for && Symbol.for("react.element") || 60103,
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
        default: e
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
      return a.default.createElement(c.default, o({}, e, {
        row: p.default,
        cols: f.default
      }), e.children);
    };

    t.default = h;
  }, function (e, t, n) {
    "use strict";

    function r(e) {
      return e && e.__esModule ? e : {
        default: e
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
      return (0, u.default)(o({}, e, {
        col: s.default
      }));
    };

    t.default = f;
  }, function (e, t, n) {
    "use strict";

    function r(e) {
      return e && e.__esModule ? e : {
        default: e
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
      return i.default.createElement("tr", null, i.default.createElement(u.default, {
        onClick: e.onClick
      }, e.children));
    };

    t.default = c;
  }, function (e, t, n) {
    "use strict";

    function r(e) {
      return e && e.__esModule ? e : {
        default: e
      };
    }

    Object.defineProperty(t, "__esModule", {
      value: !0
    }), t.TreeTable = void 0;
    var o = n(8),
        i = r(o),
        a = n(17),
        l = r(a);
    t.TreeTable = i.default, t.default = l.default;
  }, function (e, t, n) {
    "use strict";

    function r(e) {
      return e && e.__esModule ? e : {
        default: e
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
        g = r(v),
        b = function b(e) {
      return d.default.createElement("button", e, null === e.expanded ? d.default.createElement("span", null, "\xa0") : e.expanded ? "-" : "+");
    };

    b.propTypes = {
      expanded: h.default.bool
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
          var t = d.default.createElement(b, {
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
          var e = d.default.createElement(b, {
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
          return this.getHead(n, r, i), d.default.createElement("table", {
            style: this.props.style
          }, d.default.createElement("thead", null, r ? d.default.createElement(g.default, null, r) : null), d.default.createElement("tbody", null, d.default.createElement(y.default, c({}, this.props, {
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

    t.default = w;
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
            if (_(l) !== e) return new s("Invalid " + o + " `" + i + "` of type `" + x(l) + "` supplied to `" + r + "`, expected `" + e + "`.");
            return null;
          }

          return f(t);
        }

        function p(e) {
          function t(t, n, r, o, a) {
            if ("function" !== typeof e) return new s("Property `" + a + "` of component `" + r + "` has invalid PropType notation inside arrayOf.");
            var l = t[n];

            if (!Array.isArray(l)) {
              return new s("Invalid " + o + " `" + a + "` of type `" + _(l) + "` supplied to `" + r + "`, expected an array.");
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
                u = _(l);

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

        function g(e) {
          function t(t, n, r, o, a) {
            var l = t[n],
                u = _(l);

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

        function b(e) {
          function t(t, n, r, a, l) {
            var u = t[n],
                c = _(u);

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

        function _(e) {
          var t = _typeof(e);

          return Array.isArray(e) ? "array" : e instanceof RegExp ? "object" : k(t, e) ? "symbol" : t;
        }

        function x(e) {
          if ("undefined" === typeof e || null === e) return "" + e;

          var t = _(e);

          if ("object" === t) {
            if (e instanceof Date) return "date";
            if (e instanceof RegExp) return "regexp";
          }

          return t;
        }

        function T(e) {
          var t = x(e);

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
                return new s("Invalid " + o + " `" + i + "` of type `" + _(a) + "` supplied to `" + r + "`, expected a single ReactElement.");
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
          shape: g,
          exact: b
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
        default: e
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
        return t.filter && !t.filter(r) ? null : (n = !n, a.default.createElement(a.default.Fragment, null, a.default.createElement(t.row, {
          key: u,
          style: n ? {
            backgroundColor: l
          } : null
        }, a.default.createElement(t.cols, {
          colsName: t.colsName,
          onClick: function onClick(e) {
            return t.onClick(r, e);
          }
        }, c)), s.length > 0 ? a.default.createElement(e, o({}, t, {
          id: u + 1,
          key: u + 1,
          highLight: n
        }), s) : null));
      });
    };

    c.propTypes = {
      row: u.default.func.isRequired,
      cols: u.default.func.isRequired
    }, t.default = c;
  }, function (e, t, n) {
    "use strict";

    function r(e) {
      return e && e.__esModule ? e : {
        default: e
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
      children: a.default.object,
      col: a.default.func.isRequired,
      colsName: a.default.array
    }, t.default = l;
  }, function (e, t, n) {
    "use strict";

    function r(e) {
      return e && e.__esModule ? e : {
        default: e
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
      return i.default.createElement("td", {
        key: t,
        onClick: function onClick() {
          return n ? n(t) : null;
        }
      }, e);
    });
    t.default = l;
  }, function (e, t, n) {
    "use strict";

    function r(e) {
      return e && e.__esModule ? e : {
        default: e
      };
    }

    Object.defineProperty(t, "__esModule", {
      value: !0
    });
    var o = n(0),
        i = r(o),
        a = n(1),
        l = (r(a), function (e) {
      return i.default.createElement("tr", e, e.children);
    });
    t.default = l;
  }, function (e, t, n) {
    "use strict";

    function r(e) {
      return e && e.__esModule ? e : {
        default: e
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
        g = function (e) {
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
          return this.getHead(e, t, n), f.default.createElement("table", {
            style: this.props.style
          }, f.default.createElement("thead", null, !t || t.length <= 0 ? null : f.default.createElement(v.default, {
            onClick: this.handleHeadClick
          }, t)), f.default.createElement("tbody", null, f.default.createElement(m.default, u({}, this.props, {
            onClick: this.handleBodyClick,
            colsName: n
          }), this.state.body)));
        }
      }]), t;
    }(s.Component);

    t.default = g, g.propTypes = {
      head: p.default.array
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

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function toListRecursively(treeNode, childsVariableName) {
  var ret = [];
  treeNode[childsVariableName].forEach(function (child) {
    ret.push(child);
    ret.push.apply(ret, _toConsumableArray(toListRecursively(child, childsVariableName)));
  });
  return ret;
}

function toList(treeNode, childsVariableName) {
  var ret = toListRecursively(treeNode, childsVariableName);
  ret.push(treeNode);
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
} // const castArrayToTreeRecursively = (list, nodesToBeMapped, nodesToBeMappedParent = null, nodeIdVariableName, childsVariableName, parentVariableName, parentIdVariableName) => {
//     nodesToBeMapped.forEach(parent => {
//       parent[parentVariableName] = nodesToBeMappedParent;
//       parent.parentReducer = (reduceItem, aggregatorCallBack) => parentReduce(parent, parentVariableName, reduceItem, aggregatorCallBack)
//       parent.toList = () => toList(parent, childsVariableName)
//       parent.findChild = (finderVariableName, keys) => findChild(parent, childsVariableName, finderVariableName, keys)
//       parent.getFull = (elementVariableName) => getFull(parent, elementVariableName)
//       parent.forEachTree = (callBackFuncion) => forEachTree(parent, childsVariableName, callBackFuncion)
//       if(!parent[childsVariableName]) {
//         parent[childsVariableName] = [];
//       }
//       let childs = list.filter((child) => child[parentIdVariableName] == parent[nodeIdVariableName]);
//       if(!childs || childs.length <= 0) {
//         return;
//       }
//       castArrayToTreeRecursively(list, childs, parent, nodeIdVariableName, childsVariableName, parentVariableName, parentIdVariableName)
//       childs.forEach(e => {
//         parent[childsVariableName].push(e)
//       });
//     })
// }


function loadTreeFunctions(rootNode, nodeIdVariableName, childsVariableName, parentVariableName, parentIdVariableName) {
  var parentNode = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;

  if (!rootNode) {
    return;
  }

  rootNode[parentVariableName] = parentNode;

  rootNode.parentReducer = function (reduceItem, aggregatorCallBack) {
    return parentReduce(rootNode, parentVariableName, reduceItem, aggregatorCallBack);
  };

  rootNode.toList = function () {
    return toList(rootNode, childsVariableName);
  };

  rootNode.findChild = function (finderVariableName, keys) {
    return findChild(rootNode, childsVariableName, finderVariableName, keys);
  };

  rootNode.getFull = function (elementVariableName) {
    return getFull(rootNode, elementVariableName);
  };

  rootNode.forEachTree = function (callBackFuncion) {
    return forEachTree(rootNode, childsVariableName, callBackFuncion);
  };

  if (parentNode && rootNode[parentIdVariableName] != parentNode[nodeIdVariableName]) {
    console.log('node and parent node dont match. rootChildId: ' + rootNode[nodeIdVariableName]);
  }

  rootNode[childsVariableName].forEach(function (element) {
    loadTreeFunctions(element, nodeIdVariableName, childsVariableName, parentVariableName, parentIdVariableName, rootNode);
  });
}

function treeExtensions(prototype) {
  var _this = this;

  prototype.parentReducer = function (reduceItem, callBack) {
    return parentReduce(_this, 'Parent', reduceItem, callBack);
  };

  prototype.toList = function () {
    return toList(_this, 'Childs');
  };
} // export const castArrayToTree = (array, rootNodeToBeMapped, nodeIdVariableName, childsVariableName, parentVariableName, parentIdVariableName) => {
//     castArrayToTreeRecursively(array, [rootNodeToBeMapped], null, nodeIdVariableName, childsVariableName, parentVariableName, parentIdVariableName);
//     return rootNodeToBeMapped;
// }
// export const castArrayToArrayOfTree = (array, nodesToBeMapped, nodeIdVariableName, childsVariableName, parentVariableName, parentIdVariableName) => {
//     castArrayToTreeRecursively(array, nodesToBeMapped, null, nodeIdVariableName, childsVariableName, parentVariableName, parentIdVariableName);
//     nodesToBeMapped.toList = () => arrayOfTreeToList(nodesToBeMapped)
//     return nodesToBeMapped;
// }
// const arrayOfTreeToList = (array) => {
//   let ret = []
//   array.forEach(item => {
//     ret.push(...item.toList())
//   });
//   return ret;
// }


function findChild(node, childsVariableName, finderVariableName, keys) {
  var keyIndex = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
  var nextchild = node[childsVariableName].find(function (child) {
    return child[finderVariableName] == keys[keyIndex];
  });

  if (keyIndex + 1 == keys.length) {
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

function forEachTree(node, childsVariableName, callBackFuncion) {
  var callBackFunctionRecursively = function callBackFunctionRecursively(element) {
    callBackFuncion(element);
    forEachTree(element, childsVariableName, callBackFuncion);
  };

  node[childsVariableName].forEach(callBackFunctionRecursively);
}