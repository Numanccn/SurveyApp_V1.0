function display() {
  var questionId = document.getElementById("q-selection").value;


  if (questionId === "Q1") {

    document.getElementById("chart_pieOne").style.visibility= "visible"
    document.getElementById("chart_pieTwo").style.visibility= "hidden"
    document.getElementById("chart_pieGen").style.visibility= "hidden"

  } else if (questionId === "Q2") {
    document.getElementById("chart_pieTwo").style.visibility= "visible"
    document.getElementById("chart_pieOne").style.visibility= "hidden"
    document.getElementById("chart_pieGen").style.visibility= "hidden"
   
  } else if (questionId ==="gen") {
    document.getElementById("chart_pieGen").style.visibility= "visible"
    document.getElementById("chart_pieOne").style.visibility= "hidden"
    document.getElementById("chart_pieTwo").style.visibility= "hidden"
    
  } else {
    console.log(questionId);
  }
 
};


// Bar chart

const fetchDataFromServerDrawBarChart = async () => {
  const response = await fetch('http://localhost:3006/fetchData', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const fetchedData = await response.json(); 
  console.log("myJson = ", fetchedData)


  var options = {

    series: fetchedData,
      chart: {
      type: 'bar',
      
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '35%',
        endingShape: 'rounded'
      },
    },
    dataLabels: {
      enabled: true,
      dropShadow: {
      enabled: true,
      left: 2,
      top: 2,
      opacity: 0.5
      }
    },
    stroke: {
    show: true,
    width: 2,
    colors: ['transparent']
    },
    
    xaxis: {
    categories: ['Worst', 'Bad', 'Average', 'Good', 'Excellent'],
    title: {
    text: 'Service standard'
    }
    
  },
  yaxis: {
  title: {
    text: 'Number of user response'
    }
  },
  
  fill: {
    opacity: 1
  },
  
  tooltip: {
     y: {
      formatter: function (val) {
      return "⭐ " + val + " ratings"
      }
    }
  }
  
  };
  
  var chartBar = new ApexCharts(document.querySelector("#chart_bar"), options);
  chartBar.render();

}

fetchDataFromServerDrawBarChart()


// Time series chart


const fetchDataFromServerDrawTimeSeries = async () => {
  const response = await fetch('http://localhost:3006/fetchTimeSeriesData', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const myJson = await response.json(); 
  console.log("fetchDataFromServerDrawTimeSeries  = ", myJson)

  var options = {
    series: myJson.fetchedData,
    chart: {
    height: 350,
    type: 'line',
  },
  stroke: {
    curve: 'smooth'
  },
  fill: {
    type:'solid',
    opacity: [0.35, 1],
  },
  labels: myJson.lebel,
  markers: {
    size: 0
  },
  yaxis: [
    {
      title: {
        text: 'Number of user response',
      },
    },
  ],
  tooltip: {
    shared: true,
    intersect: false,
    y: {
      formatter: function (y) {
        if(typeof y !== "undefined") {
          return  y.toFixed(0) + " points";
        }
        return y;
      }
    }
  }
  };
  
var chartTimeSeries = new ApexCharts(document.querySelector("#chart_time_series"), options);
chartTimeSeries.render();
}

fetchDataFromServerDrawTimeSeries()


// General pie chart

var options = {
  series: [1,1, 1, 1, 1],
  chart: {
  width: 380,
  type: 'pie',
},
labels: ['Area A', 'Area B', 'Area C', 'Area D', 'Area E'],
title: {
  text: 'Customer satisfaction survey 📢'
  },
responsive: [{
  breakpoint: 480,
  options: {
    chart: {
      width: 200
    },
    legend: {
      position: 'bottom'
    }
  }
}]
};

var chart = new ApexCharts(document.querySelector("#chart_pieGen"), options);
chart.render();



// Pie chart for question 1

const fetchDataFromServerDrawPieChart = async (questionIndex, questionLeble, questionQuerySelector) => {
  const response = await fetch('http://localhost:3006/fetchData', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const fetchedData = await response.json(); 

  var options = {
    series: fetchedData[questionIndex]["data"],
    chart: {
    width: 380,
    type: 'pie',
  },
  labels: ['Worst', 'Bad', 'Average', 'Good', 'Excellent'],
  title: {
    text: questionLeble
    },

  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: 200
      },
      legend: {
        position: 'bottom'
      }
    }
  }]
  };

  var chartTwo = new ApexCharts(document.querySelector(questionQuerySelector), options);
  chartTwo.render();
}


fetchDataFromServerDrawPieChart(1, "Question 1: ", "#chart_pieOne")
fetchDataFromServerDrawPieChart(0, "Question 2: ", "#chart_pieTwo")
