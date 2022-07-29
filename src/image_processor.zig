const allocator = @import("lib.zig").allocator;
const jslogNum = @import("lib.zig").jslogNum;

pub const kernel_offsets: [9][2]i4 = .{
    .{ -1, -1 }, .{ 0, -1 }, .{ 1, -1 },
    .{ -1, 0 },  .{ 0, 0 },  .{ 1, 0 },
    .{ -1, -1 }, .{ 0, -1 }, .{ 1, -1 },
};

fn clamp(val:anytype) u32 {
    return @intCast(u32, @minimum(255, @maximum(val, 0)));
}

pub const ImageProcessor = struct {
    kernel: [9]i16 = .{
        -2, -1, 0,
        -1, 1, 1,
        0, 1, 2,
    },

    width: usize,
    height: usize,
    image_data: [*]u8 = undefined,
    image_data_swap: [*]u8 = undefined,
    byte_size: usize,

    pub fn create(width: usize, height: usize) *ImageProcessor {
        const byte_size = width * height * 4;
        const ptr = allocator.create(ImageProcessor) catch @panic("alloc err");

        var img_data = allocator.alloc(u8, byte_size) catch @panic("alloc err");
        var img_data_swap = allocator.alloc(u8, byte_size) catch @panic("alloc err");

        ptr.* = ImageProcessor {
            .width = width,
            .height = height,
            .byte_size = byte_size,
            .image_data = @ptrCast([*]u8, img_data) ,
            .image_data_swap = @ptrCast([*]u8, img_data_swap),
        };
        return ptr;
    }

    pub fn free(self: *ImageProcessor) void {
        allocator.free(self.image_data);
        allocator.free(self.image_data_swap);
    }

    pub fn swapBuffers(self: *ImageProcessor) void {
        const tmp = self.image_data;
        self.image_data = self.image_data_swap;
        self.image_data_swap = tmp;
    }

    pub fn applyKernel(self: *ImageProcessor) void {
        var x:i32 = 0;
        var y:i32 = 0;
        const w = @intCast(i32, self.width);
        const h = @intCast(i32, self.height);
        const buffer32 = @intToPtr([*]u32, @ptrToInt(self.image_data_swap));

        while(y < h) : (y += 1) {
            x = 0;
            while(x < w) : (x += 1) {
                var r:i32 = 0;
                var g:i32 = 0;
                var b:i32 = 0;

                const off:usize = @intCast(usize, y * w + x);
                
                for(kernel_offsets) | offset, index | {
                    if(!(
                        x + offset[0] < 0 or 
                        x + offset[0] >= w or 
                        y + offset[1] < 0 or 
                        y + offset[1] >= h
                    )){
                        const byte_i = @intCast(usize, ((y + offset[1]) * w + (x + offset[0])) * 4);

                        r += self.image_data[byte_i] * self.kernel[index];
                        g += self.image_data[byte_i + 1] * self.kernel[index];
                        b += self.image_data[byte_i + 2] * self.kernel[index];
                    }
                }

                buffer32[off] = clamp(r) | (clamp(g) << 8) | (clamp(b) << 16) | 0xFF000000;
            }
        }
        self.swapBuffers();
    }
};
