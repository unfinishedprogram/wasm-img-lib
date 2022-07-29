export enum LogLevel {
	NONE = "",
	WASM = "WASM", 
	IMG_LOADER = "IMG-Load"
}

const enabledLogLevels = new Set([
	LogLevel.NONE,
	LogLevel.IMG_LOADER, 
	LogLevel.WASM,
]);

export default function log ( value:any, level:LogLevel = LogLevel.NONE ) {
	if(!enabledLogLevels.has(level)) return;
	console.log(level, value);
}