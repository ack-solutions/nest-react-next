import ReactApexChart from 'react-apexcharts';


function PieChart({pieChartOptions, series}) {
    return (
        <ReactApexChart
            options={pieChartOptions}
            series={series}
            type="donut"
            height={330}
            width="100%"
        />
    );
}

export default PieChart;
