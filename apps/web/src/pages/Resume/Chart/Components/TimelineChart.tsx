import { Typography } from "@mui/joy";
import { useGoogleChartAutoHeight } from "@/pages/Resume/Chart/Components/useGoogleChartAutoHeight.ts";
import { useEffect } from "react";
import Chart from "react-google-charts";

type TimelineChartProps = {
  chartData: Array<unknown>;
  options: Record<string, unknown>;
  onChartIsReady?: (b: boolean) => void;
};

export const TimelineChart = ({
  chartData,
  options,
  onChartIsReady,
}: TimelineChartProps) => {
  const { chartContainerRef, chartHeight, chartEvents, chartIsReady } =
    useGoogleChartAutoHeight(chartData);

  useEffect(() => {
    onChartIsReady && onChartIsReady(chartIsReady);
  }, [onChartIsReady, chartIsReady]);

  // First row is the chart header so there should be at least one element
  const isDataEmpty = chartData.length <= 1;

  return (
    <>
      {isDataEmpty ? (
        <Typography>
          Insufficient data provided for the chart: no technologies found in the
          job descriptions or durations are not found or specified
        </Typography>
      ) : (
        <div ref={chartContainerRef}>
          <Chart
            chartType="Timeline"
            width="100%"
            height={chartHeight}
            options={options}
            chartEvents={chartEvents}
            data={chartData}
            loader={<Typography>Loading Chart...</Typography>}
          />
        </div>
      )}
    </>
  );
};
