setup();

function setup() {
  const memoryButton = document.querySelector('.lineData');
  memoryButton.addEventListener('click', memoryData);
  const timeButton = document.querySelector('.pieData');
  timeButton.addEventListener('click', uptimeData);
}

async function memoryData() {
  const data = await getMemoryData();
  if(data){
    const cleanedData = formatMemoryData(data.data);
    console.log(cleanedData);
    displayMemoryData(cleanedData);
  }
}
async function getMemoryData() {
  try {
    const response = await fetch('http://216.48.189.38:9090/api/v1/query_range?query=container_memory_working_set_bytes%7Bnamespace=%22sathiyapk%22,container=%22POD%22%7D&start=1654856265&end=1654942666&step=9000');
    const data = await response.json();
    return data;
  } catch (error) {
    const errorText = document.querySelector('#error');
    console.log(error)
    errorText.textContent = 'Unable to get Data';
  }
}
function formatMemoryData(data) {
  let result = [];
  data.result.forEach(item => {
    let times = [];
    let usageBytes = [];
    let pod = item.metric.pod;
    item.values.forEach(value => {    //Splits Time and Memory Used into seperate Arrays
      times.push(value[0]);
      usageBytes.push(parseInt(value[1]));
    });
    result.push({ pod, times, usageBytes });
  });
  return result;
}
function displayMemoryData(data) {
  let options = {
    chart: {
      type: 'line',
    },
    title: {
      text: 'CPU Memory Usage',
    },
    yAxis: {
      title: {
        text: 'Work Load',
      }
    },
    xAxis: {
      categories: [],
    },
    series: [],
  };
  for (item of data) {
    if (!options.xAxis.categories.length) {
      options.xAxis.categories = item.times.map(time => new Date(time * 1000).toLocaleTimeString());
    }
    options.series.push({
      name: item.pod,
      data: item.usageBytes,
    });
  }
  const chart = Highcharts.chart('cpuMemory', options);
}


async function uptimeData() {
  const data = await getUptimeData();
  if(data){
    const cleanedData = formatUptimeData(data.data);  
    console.log(cleanedData);
    displayUptimeData(cleanedData);
  }
}
async function getUptimeData() {
  try {
    const response = await fetch('http://216.48.189.38:9090/api/v1/query?query=container_cpu_usage_seconds_total{namespace=%22sathiyapk%22,container=%22POD%22}');
    const data = await response.json();
    return data;
  } catch (error) {
    const errorText = document.querySelector('#error');
    console.log(error);
    errorText.textContent = 'Unable to get Data';
  }
}
function formatUptimeData(data) {
  let result = [];
  data.result.forEach(item =>{
    let pod = item.metric.pod;
    let uptimePercent = parseFloat(item.value[1]);
    result.push({pod,uptimePercent});
  });
  return result;
}
function displayUptimeData(data) {
  let options = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie',
    },
    title: {
      text: 'CPU Uptime'
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    accessibility: {
      point: {
        valueSuffix: '%'
      }
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
        }
      }
    },
    series: [{
      name:'Uptime',
      colorByPoint: true,
      data:[]
    }],
  };
  for (item of data) {
    options.series[0].data.push({
      name: item.pod,
      y: item.uptimePercent,
    });
  }
  const chart = Highcharts.chart('cpuUptime', options);
}