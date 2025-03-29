import { useCallback, useEffect, useRef, useState } from "react";

export function useGoogleChartAutoHeight(chartContainerRef: React.RefObject<HTMLElement | null>) {
    const [chartHeight, setChartHeight] = useState<string>("200px");
    const observerRef = useRef<MutationObserver | null>(null);

    const updateHeight = useCallback(() => {
        const scrollableDiv = chartContainerRef.current?.querySelector(
            "div[style*='overflow: hidden scroll']"
        );
        if (scrollableDiv instanceof HTMLElement) {
            const trueHeight = scrollableDiv.scrollHeight;
            setChartHeight(`${trueHeight + 50}px`); // add padding if needed
        }
    }, [chartContainerRef]);

    const handleChartReady = useCallback(() => {
        requestAnimationFrame(() => {
            updateHeight();
        });
    }, [updateHeight]);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const targetNode = chartContainerRef.current;
        const observer = new MutationObserver(() => {
            updateHeight();
        });

        observer.observe(targetNode, {
            childList: true,
            subtree: true,
        });

        observerRef.current = observer;

        return () => {
            observer.disconnect();
        };
    }, [chartContainerRef, updateHeight]);

    return {chartHeight, handleChartReady};
}
