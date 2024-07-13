/// <reference types="vite/client" />
declare module 'cornerstone-tools' {
    export const external: {
      cornerstone: any;
      Hammer: any;
    };
    export function init(): void;
    export function addStackStateManager(element: HTMLElement, tools: string[]): void;
    export function addToolState(element: HTMLElement, toolType: string, data: any): void;
    export function setToolActive(toolName: string, options: { mouseButtonMask: number }): void;
    export function getToolState(element: HTMLElement, toolType: string): any;
  }
  
  declare module 'cornerstone-wado-image-loader' {
    export const external: {
      cornerstone: any;
      dicomParser: any;
    };
    export function loadImage(imageId: string): Promise<any>;
    export function configure(options: any): void;
    export function registerImageLoader(scheme: string, callback: Function): void;
  }