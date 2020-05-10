var cpuDataUrl = "https://api.myjson.com/bins/1e3nwg";
var gpuDataUrl = "https://api.myjson.com/bins/yoc40";

var cpuData = [], gpuData = [], motherboardData = [], ramData = [];

var cpuDataEvent = new Event("cpuDataReceived");
var gpuDataEvent = new Event("gpuDataReceived");

$(document).on("cpuDataReceived", function() {
    console.log("CPU 데이터를 받았어요!");
    cpuData.sort(function(a, b) {
    if (parseInt(a["Actual Score (No Overclock)"]) < parseInt(b["Actual Score (No Overclock)"])) {
        return 1;
    } else {
        return -1;
    }
});

$("#cpuDataTable").DataTable({
    data: cpuData,
    dataSrc: "",
    lengthMenu: [[10, 25, 50, 100, -1], ["10", "25", "50", "100", "All"]],
    iDisplayLength: 10,
    columns: [
        { data: "Manufacterer" },
        { data: "CPU Name" },
        { data: "Price" },
        { data: "Sell Price" },
        { data: "Score" },
        { data: "Actual Score (No Overclock)" },
        { data: "Actual Score (Overclock)" },
        { data: "Level Requirement" },
        { data: "Overclock CPU Score Increase" }
    ]
});
createCpuChart();
});

$(document).on("gpuDataReceived", function() {
    console.log("GPU 데이터를 받았어요!");
    gpuData.sort(function(a, b) {
        if (parseInt(a["Actual Score (Single)"]) < parseInt(b["Actual Score (Single)"])) {
            return 1;
        } else {
            return -1;
        }
});

$("#gpuDataTable").DataTable({
    data: gpuData,
    dataSrc: "",
    lengthMenu: [[10, 25, 50, 100, -1], ["10", "25", "50", "100", "All"]],
    iDisplayLength: 10,
    columns: [
        { data: "Manufacterer" },
        { data: "GPU" },
        { data: "Buy Price" },
        { data: "Sell Price" },
        { data: "Score" },
        { data: "Actual Score (Single)" },
        { data: "Actual Score (Dual)" },
        { data: "Level Requirement" },
        { data: "Dual GPU Performance Increase" }
    ]
});
createGpuChart();
});

$.ajax({
    url: cpuDataUrl,
    method: "GET",
    success: function(data) {
        cpuData = data;
        $(document).trigger("cpuDataReceived");
    }
});

$.ajax({
    url: gpuDataUrl,
    method: "GET",
    success: function(data) {
        gpuData = data;
        $(document).trigger("gpuDataReceived");
    }
});

function createCpuChart() {
var ctx = document.getElementById("cpuChart").getContext("2d");
var myChart = new Chart(ctx, {
type: "horizontalBar",
data: {
    labels: getCpuData("names"),
    datasets: [
    {
        label: "3DMark Score (No Overclock)",
        data: getCpuData("scores")["cpuScoresNoOverclock"],
        backgroundColor: "rgba(150, 150, 150, 0.3)",
        borderColor: "rgba(0, 0, 0, 1)",
        hoverBackgroundColor: "rgba(0, 0, 0, 0.3)",
        borderWidth: 1
    },
    {
        label: "3DMark Score (Overclock)",
        data: getCpuData("scores")["cpuScoresOverclock"],
        backgroundColor: "rgba(200, 100, 100, 0.3)",
        borderColor: "rgba(0, 0, 0, 0.3)",
        borderWidth: 1
    }
    ]
},
options: {
    layout: {},
    scales: {
        yAxes: [
            {
                ticks: {
                    beginAtZero: true,
                    fontColor: "#000",
                    fontSize: 14,
                    barPercentage: 0.7,
                    categoryPercentage: 1
                }
            }
        ]
    }
    }
});
}

function createGpuChart() {
var ctx = document.getElementById("gpuChart").getContext("2d");
var myChart = new Chart(ctx, {
type: "horizontalBar",
data: {
labels: getGpuData("names"),
datasets: [
{
label: "3DMark Score (Single)",
data: getGpuData("scores")["gpuScoresSingle"],
backgroundColor: "rgba(150, 150, 150, 0.3)",
borderColor: "rgba(0, 0, 0, 1)",
hoverBackgroundColor: "rgba(0, 0, 0, 0.3)",
borderWidth: 1
},
{
label: "3DMark Score (Dual)",
data: getGpuData("scores")["gpuScoresDual"],
backgroundColor: "rgba(200, 100, 100, 0.3)",
borderColor: "rgba(0, 0, 0, 0.3)",
borderWidth: 1
}
]
},
options: {
scales: {
yAxes: [
{
    ticks: {
    beginAtZero: true,
    fontColor: "#000",
    fontSize: 14,
    barPercentage: 0.7,
    categoryPercentage: 1
}
}
]
}
}
});
}

function getCpuData(dataSrc) {
var cpuScoresNoOverclock = [];
var cpuScoresOverclock = [];
var cpuNames = [];

if (dataSrc === "scores") {
for (var i = 0; i < cpuData.length; i++) {
cpuScoresNoOverclock.push(cpuData[i]["Actual Score (No Overclock)"]);
cpuScoresOverclock.push(cpuData[i]["Actual Score (Overclock)"]);
}
return { cpuScoresNoOverclock, cpuScoresOverclock };
} else if (dataSrc === "names") {
for (var i = 0; i < cpuData.length; i++) {
cpuNames.push(cpuData[i]["CPU Name"]);
}
return cpuNames;
}
}

function getGpuData(dataSrc) {
var gpuScores = [];
var gpuScoresSingle = [];
var gpuScoresDual = [];
var gpuNames = [];

if (dataSrc === "scores") {
for (var i = 0; i < gpuData.length; i++) {
gpuScores.push(gpuData[i]["Score"]);
gpuScoresSingle.push(gpuData[i]["Actual Score (Single)"]);
gpuScoresDual.push(parseInt(gpuData[i]["Actual Score (Dual)"]));
}
return { gpuScores, gpuScoresSingle, gpuScoresDual };
} else if (dataSrc === "names") {
for (var i = 0; i < gpuData.length; i++) {
gpuNames.push(gpuData[i].GPU);
}
return gpuNames;
}
}