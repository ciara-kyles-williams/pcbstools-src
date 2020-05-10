$("#cpuDataTable").DataTable({
    ajax: {
        url: "https://raw.githubusercontent.com/pcbstools/PCBSTools-JSON/master/cpu_data.json",
        dataSrc: ""
    },
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

$("#gpuDataTable").DataTable({
    ajax: {
        url: "https://raw.githubusercontent.com/pcbstools/PCBSTools-JSON/master/gpu_data.json",
        dataSrc: ""
    },
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
