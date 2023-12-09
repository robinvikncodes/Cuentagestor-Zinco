import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  interaction: {
    mode: "index",
    intersect: false,
  },
  stacked: false,
  plugins: {
    title: {
      display: true,
      text: "Chart.js Line Chart - Multi Axis",
    },
  },
  scales: {
    y: {
      type: "linear",
      display: true,
      position: "left",
    },
    y1: {
      type: "linear",
      display: true,
      position: "right",
      grid: {
        drawOnChartArea: false,
      },
    },
  },
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

export const data = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      // data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      data: [42, 34, 32, 65, 23],
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
      yAxisID: "y",
    },
    {
      label: "Dataset 2",
      // data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      data: [21, 23, 54, 23, 45],
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
      yAxisID: "y1",
    },
  ],
};


const col = [
    "rgba(255, 99, 132)",
    "rgba(54, 162, 235)",
    "rgba(255, 206, 86)",
    "rgba(75, 192, 192)",
    "rgba(153, 102, 255)",
    "rgba(255, 159, 64)",
  ];

const AssetGraph = (props) => {
  // console.log(props.assetData?.map(item => item.x_axis));
  return (
    <>
      <div className="flex justify-between mb-1">
          <div>
            {/* <Line options={props.assetData?.map(item => item.["x-axis"])} data={data} /> */}
          </div>
          <div className="donet">
            <div className=" mr-3 bg-[#F6F6F6]  px-5 py-6 rounded-2xl mb-4">
              <p className="text-[17px]">Expenses</p>
              <div className="flex">
                <div className="w-[200px] h-[200px]">
                  <Doughnut
                    data={{
                      labels: [],
                      datasets: [
                        {
                          data: props.assetData?.expense_account_list?.map(
                            (data) => data.amount ?? data.balance
                          ),
                          backgroundColor: col,
                          borderJoinStyle: "bevel",
                        },
                      ],
                    }}
                  />
                </div>

                <div className="mt-3">
                  {props.assetData?.expense_account_list?.map((data, key) => (
                    <div key={key + 1} className="flex items-center">
                      <div
                        className="h-[11px] w-[11px] rounded-md mr-2"
                        style={{ backgroundColor: col[key] }}
                      />
                      <span className="text-[#858585] text-[14px] font-[400]">
                        {data.amount ?? data.balance} % {data.account_name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className=" mr-3 bg-[#F6F6F6] px-5 py-6 rounded-2xl">
              <p className="text-[17px]">Income</p>
              <div className="flex">
                <div className="w-[200px] h-[200px]">
                  <Doughnut
                    data={{
                      labels: [],
                      datasets: [
                        {
                          data: props.assetData?.expense_account_list?.map(
                            (data) => data.amount ?? data.balance
                          ),
                          backgroundColor: col,
                          borderJoinStyle: "bevel",
                        },
                      ],
                    }}
                  />
                </div>

                <div className="mt-3">
                  {props.assetData?.expense_account_list?.map((data, key) => (
                    <div key={key + 1} className="flex items-center">
                      <div
                        className="h-[11px] w-[11px] rounded-md mr-2"
                        style={{ backgroundColor: col[key] }}
                      />
                      <span className="text-[#858585] text-[14px] font-[400]">
                        {data.amount ?? data.balance} % {data.account_name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
    </>
  );
};

export default AssetGraph;
