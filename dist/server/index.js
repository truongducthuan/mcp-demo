import { McpServer, registerOpenAIWidget, startOpenAIWidgetHttpServer } from '@fractal-mcp/oai-server';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let tasks = [
    {
        id: '1',
        title: 'Học Fractal MCP SDK',
        completed: false,
        priority: 'high',
        createdAt: new Date().toISOString()
    },
    {
        id: '2',
        title: 'Xây dựng demo widget',
        completed: true,
        priority: 'medium',
        createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
        id: '3',
        title: 'Tích hợp với ChatGPT',
        completed: false,
        priority: 'high',
        createdAt: new Date().toISOString()
    }
];
function createServer() {
    const server = new McpServer({
        name: 'task-manager-widget',
        version: '1.0.0'
    });
    // Đọc bundled widget HTML
    const widgetHtmlPath = path.join(__dirname, '../../dist/ui/index.html');
    const widgetHtml = fs.readFileSync(widgetHtmlPath, 'utf-8');
    // ===== TOOL 1: List Tasks =====
    registerOpenAIWidget(server, {
        id: 'list-tasks',
        title: 'Xem Danh Sách Tasks',
        description: 'Hiển thị tất cả tasks với widget tương tác',
        templateUri: 'ui://widget/task-list.html',
        invoking: 'Đang tải danh sách tasks...',
        invoked: 'Danh sách tasks đã được tải!',
        html: widgetHtml,
        responseText: 'Đây là danh sách tasks hiện tại của bạn',
        inputSchema: z.object({})
    }, async () => ({
        content: [{
                type: 'text',
                text: `Hiện có ${tasks.length} tasks: ${tasks.filter(t => !t.completed).length} đang làm, ${tasks.filter(t => t.completed).length} hoàn thành`
            }],
        structuredContent: {
            tasks,
            action: 'list',
            message: 'Danh sách tasks của bạn'
        }
    }));
    // ===== TOOL 2: Add Task =====
    registerOpenAIWidget(server, {
        id: 'add-task',
        title: 'Thêm Task Mới',
        description: 'Tạo task mới với title và priority',
        templateUri: 'ui://widget/task-add.html',
        invoking: 'Đang thêm task mới...',
        invoked: 'Task đã được thêm thành công!',
        html: widgetHtml,
        responseText: 'Task mới đã được thêm',
        inputSchema: z.object({
            title: z.string().describe('Tiêu đề task'),
            priority: z.enum(['low', 'medium', 'high']).default('medium').describe('Độ ưu tiên: low, medium, hoặc high')
        })
    }, async (args) => {
        const newTask = {
            id: Date.now().toString(),
            title: args.title,
            completed: false,
            priority: args.priority,
            createdAt: new Date().toISOString()
        };
        tasks.push(newTask);
        return {
            content: [{
                    type: 'text',
                    text: `✅ Đã thêm task: "${args.title}" với độ ưu tiên ${args.priority}`
                }],
            structuredContent: {
                tasks,
                action: 'add',
                message: `Task "${args.title}" đã được thêm thành công!`
            }
        };
    });
    // ===== TOOL 3: Complete Task =====
    registerOpenAIWidget(server, {
        id: 'complete-task',
        title: 'Hoàn Thành Task',
        description: 'Đánh dấu task là hoàn thành',
        templateUri: 'ui://widget/task-complete.html',
        invoking: 'Đang cập nhật task...',
        invoked: 'Task đã được hoàn thành!',
        html: widgetHtml,
        responseText: 'Task đã được đánh dấu hoàn thành',
        inputSchema: z.object({
            taskId: z.string().describe('ID của task cần hoàn thành')
        })
    }, async (args) => {
        const task = tasks.find(t => t.id === args.taskId);
        if (!task) {
            return {
                content: [{ type: 'text', text: '❌ Không tìm thấy task với ID này' }],
                structuredContent: {
                    tasks,
                    action: 'complete',
                    message: 'Task không tồn tại'
                }
            };
        }
        task.completed = true;
        return {
            content: [{
                    type: 'text',
                    text: `✅ Đã hoàn thành task: "${task.title}"`
                }],
            structuredContent: {
                tasks,
                action: 'complete',
                message: `Task "${task.title}" đã hoàn thành! 🎉`
            }
        };
    });
    // ===== TOOL 4: Delete Task =====
    registerOpenAIWidget(server, {
        id: 'delete-task',
        title: 'Xóa Task',
        description: 'Xóa task khỏi danh sách',
        templateUri: 'ui://widget/task-delete.html',
        invoking: 'Đang xóa task...',
        invoked: 'Task đã được xóa!',
        html: widgetHtml,
        responseText: 'Task đã được xóa',
        inputSchema: z.object({
            taskId: z.string().describe('ID của task cần xóa')
        })
    }, async (args) => {
        const taskIndex = tasks.findIndex(t => t.id === args.taskId);
        if (taskIndex === -1) {
            return {
                content: [{ type: 'text', text: '❌ Không tìm thấy task với ID này' }],
                structuredContent: {
                    tasks,
                    action: 'delete',
                    message: 'Task không tồn tại'
                }
            };
        }
        const deletedTask = tasks.splice(taskIndex, 1)[0];
        return {
            content: [{
                    type: 'text',
                    text: `🗑️ Đã xóa task: "${deletedTask.title}"`
                }],
            structuredContent: {
                tasks,
                action: 'delete',
                message: `Task "${deletedTask.title}" đã được xóa`
            }
        };
    });
    return server;
}
// Khởi động server
const PORT = parseInt(process.env.PORT ?? '8000', 10);
startOpenAIWidgetHttpServer({
    port: PORT,
    serverFactory: createServer
});
console.log(`
🚀 Task Manager MCP Server đang chạy tại http://localhost:${PORT}

📚 Available Tools:
  - list-tasks: Xem danh sách tasks
  - add-task: Thêm task mới
  - complete-task: Hoàn thành task
  - delete-task: Xóa task

🔗 Để kết nối với ChatGPT:
  1. Mở ChatGPT Settings
  2. Vào Apps SDK section
  3. Thêm MCP server URL: http://localhost:${PORT}
  4. Bắt đầu chat và yêu cầu ChatGPT sử dụng task manager!

💡 Ví dụ câu lệnh:
  - "Hiển thị danh sách tasks của tôi"
  - "Thêm task mới: Học React với priority cao"
  - "Hoàn thành task có ID là 1"
  - "Xóa task có ID là 2"
`);
