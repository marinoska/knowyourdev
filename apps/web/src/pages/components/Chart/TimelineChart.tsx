import { useGoogleChartAutoHeight } from "@/pages/components/Chart/useGoogleChartAutoHeight.ts";
import { useEffect } from "react";
import Chart from "react-google-charts";
import { Regular } from "@/components/typography.tsx";

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
        <Regular>
          Insufficient data provided for the chart: no technologies found in the
          job descriptions or durations are not found or specified
        </Regular>
      ) : (
        <div ref={chartContainerRef}>
          <Chart
            chartType="Timeline"
            width="100%"
            height={chartHeight}
            options={options}
            chartEvents={chartEvents}
            data={chartData}
            loader={<Regular>Loading Chart...</Regular>}
          />
        </div>
      )}
    </>
  );
};
