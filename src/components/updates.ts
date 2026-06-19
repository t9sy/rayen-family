function getShift(popover: HTMLElement, container: HTMLElement) {
    const popoverBox = popover.getBoundingClientRect();
    const cardBox = popover.parentElement!.getBoundingClientRect();
    const containerBox = container?.getBoundingClientRect();
    // console.log(
    //     "popoverBox:",
    //     popoverBox,
    //     "cardBox:",
    //     cardBox,
    //     "containerBox:",
    //     containerBox,
    // );

    const viewportWidth =
        window.visualViewport?.width ?? document.documentElement.clientWidth;
    // console.log("viewportWidth:", viewportWidth);

    const viewportOffset = window.visualViewport?.offsetLeft ?? 0;
    // console.log("viewportOffset:", viewportOffset);

    const currentLeft = cardBox.left;

    const minLeft = Math.max(
        containerBox.left,
        viewportOffset,
    );

    const maxLeft = Math.min(
        containerBox.right - popoverBox.width,
        viewportOffset + viewportWidth - popoverBox.width,
    );
    // console.log(
    //     "currentLeft:",
    //     currentLeft,
    //     "minLeft:",
    //     minLeft,
    //     "maxLeft:",
    //     maxLeft,
    // );

    const clampedLeft = Math.max(minLeft, Math.min(currentLeft, maxLeft));

    return clampedLeft - currentLeft;
}

export function updateLegend() {
    const root = document.getElementById("legend-root");
    const container = document.getElementById("root");
    // console.log("Running popover position update...");
    // console.log("Root element:", root);
    // console.log("Container element:", container);
    if (root && container) {
        // console.log("shift:", getShift(root, container), "px");
        root.style.setProperty(
            "--popover-shift",
            `${getShift(root, container)}px`,
        );
    }

    const root2 = document.getElementById("hero-root");
    // console.log("Running popover position update...");
    // console.log("Root element:", root2);
    // console.log("Container element:", container);
    if (!root2 || !container) {
        console.warn(
            "Root or container element not found, skipping position update.",
        );
        return;
    }
    // console.log("shift:", getShift(root2, container), "px");
    root2.style.setProperty("--popover-shift", `${getShift(root2, container)}px`);
}
