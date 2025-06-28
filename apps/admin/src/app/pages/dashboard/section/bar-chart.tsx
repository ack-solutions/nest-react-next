import ReactApexChart from 'react-apexcharts';


function BarChart({ barChartOptions, series }) {
    return (
        <ReactApexChart
            options={barChartOptions}
            series={series}
            type="line"
            height={330}
            width="100%"
        />
    );
}

export default BarChart;
