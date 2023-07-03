const tableBody = document.querySelector(".tableBody");
const stockChart = document.getElementById("stockChart");
const stockResultDiv = document.querySelector(".stockResultDiv")
const stockDateP = document.querySelector(".stockDate")

var newChart = null;

console.log(stockChart);

async function fetchStock() {
  var stockName = document.getElementById("stockName").value;
  var selectedTime = document.querySelector(
    'input[name="radiotime"]:checked'
  ).value;
  console.log(selectedTime);
  console.log("inside fun");
  if (!stockName) {
    alert("Please enter stock name!");
  } else {
    if (newChart && tableBody) {
      tableBody.innerHTML = "";
      newChart.destroy();
    }

    var URL = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${stockName}&interval=${selectedTime}&apikey=DXC0E34BWLMFE7M5`;

    var requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "request",
      },
    };

    await fetch(URL, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log("inside fetch");
        var stockValueData = Object.entries(
          data[`Time Series (${selectedTime})`]
        );

        var latestStockValueData = stockValueData.slice(0, 5);
        console.log(latestStockValueData, "stock data");
        var date = latestStockValueData.map((x) => x[0].split(" ")[1]);
        var price = latestStockValueData.map((x) => x[1][["4. close"]]);
        console.log(date, "date");
        console.log(price, "price");
        var maxPrice = Math.max(...price);
        var minPrice = Math.min(...price);
        console.log(maxPrice, minPrice);
        var dateTime = latestStockValueData[0][0].split(" ")[0]
        console.log(dateTime)
        newChart = new Chart(stockChart, {
          type: "line",
          data: {
            labels: date,
            datasets: [
              {
                label: "Stock Value (USD)",
                data: price,
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                //   beginAtZero: false,
                suggestedMax: maxPrice + 0.2,
                suggestedMin: minPrice - 0.2,
              },
              x: {
                reverse: true,
              },
            },
            // layout: {
            //   padding: {
            //     right: 10, // Adjust the padding value as needed
            //   },
            // },
          },
        });

        for (let i = 0; i < 5; i++) {
          var lateststockPrice = latestStockValueData[i];

          var tr = document.createElement("tr");

          var td1 = document.createElement("td");
          var td2 = document.createElement("td");
          var td3 = document.createElement("td");
          var td4 = document.createElement("td");
          var td5 = document.createElement("td");
          var td6 = document.createElement("td");

          td1.textContent = lateststockPrice[0].split(" ")[1];
          td2.textContent = lateststockPrice[1]["1. open"];
          td3.textContent = lateststockPrice[1]["2. high"];
          td4.textContent = lateststockPrice[1]["3. low"];
          td5.textContent = lateststockPrice[1]["4. close"];
          td6.textContent = lateststockPrice[1]["5. volume"];

          tr.appendChild(td1);
          tr.appendChild(td2);
          tr.appendChild(td3);
          tr.appendChild(td4);
          tr.appendChild(td5);
          tr.appendChild(td6);

          tableBody.appendChild(tr);
        }
      })
      .catch((error) => console.log(error));

    console.log("Fetching completed");

    //   setInterval(() => {
    //     tableBody.innerHTML = "";
    //     newChart.destroy();
    //     fetchStock();
    //   }, 5000);
  }
}

async function getStockDetails(event) {
  event.preventDefault();
  tableBody.innerHTML = "";
  stockResultDiv.classList.remove("hidden");
  await fetchStock();
}

async function updateStock(event) {
  let stockName = document.getElementById("stockName").value;
  if (!stockName) {
    alert("Please enter stock name!");
  } else {
    event.preventDefault();
    tableBody.innerHTML = "";
    newChart.destroy();
    const btn = event.target;
    btn.disabled = true;
    await fetchStock();
    btn.disabled = false;
  }
}

function downloadCSV(event) {
  event.preventDefault();
  let stockName = document.getElementById("stockName").value;
  if (stockName) {
    fetch(
      `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${stockName}&interval=5min&apikey=DXC0E34BWLMFE7M5&datatype=csv`
    )
      .then((response) => response.blob())
      .then((blob) => {
        // Create a temporary <a> element to trigger the download
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "data.csv";
        link.click();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } else {
    alert("Please enter stock name!");
  }
}
