export { };

declare global {
    interface Window {
        QRCode: {
            new(
                el: HTMLElement,
                options: {
                    text: string;
                    width?: number;
                    height?: number;
                    colorDark?: string;
                    colorLight?: string;
                    correctLevel?: number;
                }
            ): void;
            CorrectLevel: {
                L: number;
                M: number;
                Q: number;
                H: number;
            };
        };
    }
}
