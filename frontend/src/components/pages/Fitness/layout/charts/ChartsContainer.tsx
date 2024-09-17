// Packages
import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box, Stack, Typography } from '@mui/material';

// Components
import ChartButtons from './ChartButtons';
import FilterButtons from './FilterButtons';
import { defaults } from './defaultData';


// Render
const ChartsContainer = ({ 
    charts, 
    label = undefined, 
    defaultChart = "table", 
    disableChartButtons = false, 
    disableFilterButtons = false,
    setIsOpen = () => {},
}: {
    charts: any,
    label?: string,
    defaultChart?: string,
    disableChartButtons?: boolean,
    disableFilterButtons?: boolean,
    setIsOpen?: (open: boolean) => void
}) => {
    
    const [activeChart, setActiveChart] = React.useState(defaultChart);
    const [_, setFilter] = React.useState("Today");
    // console.log("ChartsContainer.data: ", filter);

    const handleSetActiveChart = (value: string) => {
        if (value === "expand") setIsOpen(true);
        else setActiveChart(value);
    };

    return (
        <>

            {/* Chart Container Header */}
            <Box sx={{ display:"flex", justifyContent: "space-between", p: 1 }}>
                <Typography variant="body1">
                    {charts?.[activeChart]?.title || label}
                </Typography>

                <Stack>
                    {!disableChartButtons && <ChartButtons setActiveChart={(value: string) => handleSetActiveChart(value)} />}
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
                            series={charts?.bar?.series || [] || defaults.bar.series}
                            height={290}
                            xAxis={charts?.bar?.xAxis || [] || defaults.bar.xAxis}
                            margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
                            sx={{ maxWidth: "100%" }}
                        />
                    ),
                    line: (
                        <LineChart
                            xAxis={charts?.line?.xAxis || [] || defaults.line.xAxis}
                            series={charts?.line?.series || [] || defaults.line.series}
                            // width={500}
                            height={300}
                            sx={{ height: 300, maxHeight: 300, width: '100%' }}
                        />
                    ),
                    pie: (
                        <PieChart
                            series={[
                                {
                                    data: charts?.pie?.data || [] || defaults.pie.data,
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
                                rows={charts?.table?.rows || []} 
                                columns={charts?.table?.columns || []} 
                                slots={{ toolbar: GridToolbar }} 
                            />
                        </div>
                    )
                }[activeChart])
            }
        </>
    );
};

export default ChartsContainer;