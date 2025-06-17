import { useCallback, useState, useEffect, useRef, RefObject } from "react";
import { ReactGoogleChartEvent } from "react-google-charts";

export function useGoogleChartAutoHeight(chartData: Array<unknown>) {
  const chartContainerRef: RefObject<HTMLDivElement | null> = useRef(null);
  const [chartHeight, setChartHeight] = useState<string>("50px");
  const [chartIsReady, setChartIsReady] = useState(false);

  // rerender chart to adapt height for new data row amount
  // so the dependency on chartData is essential
  useEffect(() => {
    setChartIsReady(false);
    setChartHeight("50px");
  }, [setChartIsReady, setChartHeight, chartData]);

  const updateHeight = useCallback(() => {
    const scrollableDiv = chartContainerRef.current?.querySelector(
      "div[style*='overflow: hidden scroll']",
    );

    if (scrollableDiv instanceof HTMLElement) {
      const trueHeight = scrollableDiv.scrollHeight;
      setChartHeight(`${trueHeight + 50}px`); // add padding if needed
    }
    // const chartSvg = chartContainerRef.current?.querySelector("svg");
    // const groupElement = chartSvg?.querySelector("g"); // Find the <g> element
    // if (groupElement instanceof SVGGElement) {
    //     const height = groupElement.getBBox().height; // Use getBBox to measure rendered content
    //     setChartHeight(`${height + 50}px`); // Add padding if desired
    // }
  }, [chartContainerRef]);

  const handleChartResize = useCallback(() => {
    requestAnimationFrame(() => {
      updateHeight();
    });
    setChartIsReady(true);
  }, [updateHeight]);

  const chartEvents: ReactGoogleChartEvent[] = [
    {
      eventName: "ready",
      callback: handleChartResize,
    },
  ];
  return {
    chartHeight,
    handleChartResize,
    chartIsReady,
    chartContainerRef,
    chartEvents,
  };
}
