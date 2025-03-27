import { BrowserWindow, BrowserWindowConstructorOptions } from "electron";

export default class AppWindow {
    private static instance: BrowserWindow;

    static getInstance(): BrowserWindow {
        if(!AppWindow.instance || AppWindow.instance.isDestroyed())
            throw new Error('Window not initialized or destroyed');
        return AppWindow.instance;
    }

    static createWindow(options: Electron.BrowserViewConstructorOptions): BrowserWindow{
        if(AppWindow.instance && !AppWindow.instance.isDestroyed())
            AppWindow.instance.close();

        AppWindow.instance = new BrowserWindow(options);

        AppWindow.instance.on('closed', () => {
            AppWindow.instance = null;
        })
        return AppWindow.instance;
    }

    static isWindowAvailable(): boolean {
        return !!AppWindow.instance && !AppWindow.instance.isDestroyed();
    }
}