import { useCallback, useState, RefObject } from "react";

export function useGoogleChartAutoHeight(chartContainerRef: RefObject<HTMLElement | null>) {
    const [chartHeight, setChartHeight] = useState<string>("20px");

    const updateHeight = useCallback(() => {
        const scrollableDiv = chartContainerRef.current?.querySelector(
            "div[style*='overflow: hidden scroll']"
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
    }, [updateHeight]);


    return {chartHeight, handleChartResize, setChartHeight};
}
