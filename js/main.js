const earthquakeFullPage = new fullpage('#fullpage', {
    continuousVertical: true,
    anchors: ['firstPage', 'secondPage', '3rdPage', '4thPage', '5thPage'],
    sectionsColor: ['#343A40', '#424c50', '#395260', '#2e4e7e', '#808080'],
});

tippy('.mag-5', {
    content: "7.0+",
    followCursor: true
});

tippy('.mag-4', {
    content: "6.0 - 7.0",
    followCursor: true
});

tippy('.mag-3', {
    content: "5.0 - 6.0",
    followCursor: true
});

tippy('.mag-2', {
    content: "4.0 - 5.0",
    followCursor: true
});

tippy('.mag-1', {
    content: "3.0 - 4.0",
    followCursor: true
});

month_eq_num = []

for (let key in month_eq_data) {
    month_eq_num.push({
        "month": key, "num": month_eq_data[key]
    });
}

const monthEarthquakeNumber = echarts.init(document.getElementById("month-eq-num"));
const monthEarthquakeNumberOption = {
    dataset: {
        dimensions: ["month", "num"],
        source: month_eq_num
    },
    xAxis: { type: "category" },
    yAxis: { },
    series: [
        { type: "line" }
    ],
    textStyle: {
        color: "#ffffff"
    },
    itemStyle: {
        color: "#ffffff"
    },
    dataZoom: {
        type: "slider"
    },
    tooltip: {
        trigger: "axis",
        formatter: params => {
            console.log(params);
            return `month: ${params[0].data["month"]}<br /> number: ${params[0].data["num"]}`
        }
    }
}
monthEarthquakeNumber.setOption(monthEarthquakeNumberOption);


