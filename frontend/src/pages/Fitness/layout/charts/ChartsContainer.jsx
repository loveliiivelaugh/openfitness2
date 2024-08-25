import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box, IconButton, Grid, Stack, Typography } from '@mui/material';
import { ArrowLeft, ArrowRight, BarChartOutlined, LineAxisOutlined, PieChartOutline, TableChart } from '@mui/icons-material';

const defaults = {
    bar: {
        series: [
            { data: [35, 44, 24, 34] },
            { data: [51, 6, 49, 30] },
            { data: [15, 25, 30, 50] },
            { data: [60, 50, 15, 25] },
        ],
        xAxis: [{ data: ['Q1', 'Q2', 'Q3', 'Q4'], scaleType: 'band' }]
    },
    line: {
        series: [
            {
                data: [2, 5.5, 2, 8.5, 1.5, 5],
            },
        ],
        xAxis: [{ data: [1, 2, 3, 5, 8, 10] }]
    },
    pie: {
        data: [
            { id: 0, value: 10, label: 'series A' },
            { id: 1, value: 15, label: 'series B' },
            { id: 2, value: 20, label: 'series C' },
        ]
    },
}

const rows = [
    { id: 1, col1: 'Hello', col2: 'World' },
    { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
    { id: 3, col1: 'MUI', col2: 'is Amazing' },
];

const columns = [
    { field: 'col1', headerName: 'Column 1', width: 150 },
    { field: 'col2', headerName: 'Column 2', width: 150 },
];


const ChartButtons = (props) => {
    const [showButtons, setShowButtons] = React.useState(false);
    const buttons = [
        {
            label: "Bar",
            value: "bar",
            icon: <BarChartOutlined />
        },
        {
            label: "Line",
            value: "line",
            icon: <LineAxisOutlined />
        },
        {
            label: "Pie",
            value: "pie",
            icon: <PieChartOutline />
        },
        {
            label: "Table",
            value: "table",
            icon: <TableChart />
        }
    ];

    return (
        <Box sx={{ display:"flex", justifyContent: "space-between", gap: 1 }}>
            <IconButton color="inherit" onClick={() => setShowButtons(!showButtons)}>
                {showButtons ? <ArrowRight /> : <ArrowLeft />}
            </IconButton>
            {showButtons && buttons.map((button) => (
                <IconButton
                    key={`${button.value}-chart-button`}
                    variant="contained"
                    color="inherit"
                    size="small"
                    onClick={() => props.setActiveChart(button.value)}
                >
                    {button.icon || button.label}
                </IconButton>
            ))}
        </Box>
    )
}

const FilterButtons = (props) => {

    const filterButtons = ["Today", "Yesterday", "Last Week", "Last 30 Days", "All Time"];
    return (
        <Grid container>
            {filterButtons.map((button) => (
                <Grid item key={`${button}-filter-button`}>
                    <IconButton
                        key={`${button}-filter-button`}
                        color="inherit"
                        size="small"
                        onClick={() => props.setFilter(button)}
                    >
                        <Typography variant="caption">{button}</Typography>
                    </IconButton>
                </Grid>
            ))}
        </Grid>
    )
}


const ChartsContainer = ({ 
    charts, 
    label = undefined, 
    defaultChart = "table", 
    disableChartButtons = false, 
    disableFilterButtons = false
}) => {
    
    const [activeChart, setActiveChart] = React.useState(defaultChart);
    const [filter, setFilter] = React.useState("Today");
    // console.log("ChartsContainer.data: ", filter);

    return (
        <>

            {/* Chart Container Header */}
            <Box sx={{ display:"flex", justifyContent: "space-between", p: 1 }}>
                <Typography variant="body1">
                    {charts?.[activeChart].title || label}
                </Typography>

                <Stack>
                    {!disableChartButtons && <ChartButtons setActiveChart={setActiveChart} />}
                    {!disableFilterButtons && <FilterButtons setFilter={setFilter} />}
                </Stack>
            </Box>

            {disableChartButtons
                ? (
                    <div style={{ maxWidth: "94vw" }}>
                        <DataGrid {...charts.table} />
                    </div>
                ) : ({
                    bar: (
                        <BarChart
                            series={charts?.bar.series || defaults.bar.series}
                            height={290}
                            xAxis={charts?.bar.xAxis || defaults.bar.xAxis}
                            margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
                            sx={{ maxWidth: "100%" }}
                        />
                    ),
                    line: (
                        <LineChart
                            xAxis={charts?.line.xAxis || defaults.line.xAxis}
                            series={charts?.line.series || defaults.line.series}
                            // width={500}
                            height={300}
                            sx={{ height: 300, maxHeight: 300, width: '100%' }}
                        />
                    ),
                    pie: (
                        <PieChart
                            series={[
                                {
                                    data: charts?.pie.data || defaults.pie.data,
                                },
                            ]}
                            // width={400}
                            height={200}
                            sx={{ maxWidth: "100%" }}
                        />
                    ),
                    table: (
                        <div style={{ height: 300, maxHeight: 300, width: '100%' }}>
                            <DataGrid 
                                rows={charts?.table.rows || []} 
                                columns={charts?.table.columns || []} 
                                slots={{ toolbar: GridToolbar }} 
                            />
                        </div>
                    )
                }[activeChart])
            }
        </>
    )
}

export default ChartsContainer