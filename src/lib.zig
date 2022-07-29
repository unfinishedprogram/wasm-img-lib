const std = @import("std");
const ImageProcessor = @import("image_processor.zig").ImageProcessor;

pub fn log(
    comptime level: std.log.Level,
    comptime scope: @TypeOf(.EnumLiteral),
    comptime format: []const u8,
    args: anytype,
) void {
    _ = level;
    _ = scope;
    _ = format;
    _ = args; 
}

pub extern fn jslogNum(number:i32) void;

var gpa = std.heap.GeneralPurposeAllocator(.{}){};
pub const allocator = gpa.allocator();

export fn getImageProcessor(width: usize, height: usize) *ImageProcessor {
    return ImageProcessor.create(width, height);
}

export fn getImageBuffer(self: *ImageProcessor) usize {
    var data = self.image_data;

    return @ptrToInt(data);
}

export fn applyKernel(self: *ImageProcessor) void {
    self.applyKernel();
}
