# Task Manager Widget cho ChatGPT

Demo sử dụng Fractal MCP SDK để tạo widget quản lý task tích hợp ChatGPT.

## 🚀 Cài Đặt

```bash
# Clone hoặc tạo project
npm install

# Build UI và Server
npm run build

# Chạy server
npm start
```

## 📁 Cấu Trúc Project

```
project/
├── src/
│   ├── ui/
│   │   └── TaskWidget.tsx        # React widget component
│   └── server/
│       └── index.ts               # MCP server
├── dist/
│   ├── ui/
│   │   └── index.html            # Bundled widget
│   └── server/
│       └── index.js              # Compiled server
├── package.json
└── tsconfig.json
```

## 🔧 Cách Hoạt Động

1. **Widget UI** (TaskWidget.tsx):

   - Hiển thị danh sách tasks
   - Filter: tất cả / đang làm / hoàn thành
   - Sort: theo ngày hoặc độ ưu tiên
   - State persistence với useWidgetState

2. **MCP Server** (index.ts):

   - 4 tools: list, add, complete, delete
   - In-memory storage (có thể thay bằng DB)
   - Trả về structured content cho widget

3. **Data Flow**:
   User → ChatGPT → MCP Server → Widget Render

## 🎯 Sử Dụng với ChatGPT

### Kết nối MCP Server:

1. Mở ChatGPT Settings > Apps SDK
2. Add server: http://localhost:8000
3. Enable server

### Câu lệnh mẫu:

- "Cho tôi xem danh sách tasks"
- "Thêm task: Học TypeScript, priority cao"
- "Hoàn thành task đầu tiên"
- "Xóa task có ID là 2"

## 🎨 Tính Năng Widget

- ✅ Filter theo trạng thái
- ✅ Sort theo ngày / priority
- ✅ Visual priority indicators
- ✅ Task completion tracking
- ✅ Responsive design
- ✅ State persistence

## 🔄 Development Workflow

```bash
# Development mode với auto-rebuild
npm run build:ui   # Build widget
npm run build:server   # Build server
npm run dev        # Build all và start

# Production
npm run build
npm start
```

## 📝 Customize

### Thêm field mới cho Task:

1. Update interface Task trong cả ui và server
2. Update UI rendering
3. Update inputSchema trong tool registration

### Thêm tool mới:

1. Thêm registerOpenAIWidget() trong server
2. Define inputSchema với Zod
3. Implement handler function
4. Update widget UI để hiển thị action mới

## 🚀 Deploy Production

### Option 1: Docker

```dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install && npm run build
EXPOSE 8000
CMD ["npm", "start"]
```

### Option 2: Cloud Platform

- Deploy lên Railway, Render, hoặc Vercel
- Expose port 8000
- Set environment variables nếu cần

## 🔐 Security Notes

- Hiện tại dùng in-memory storage (mất data khi restart)
- Nên thêm authentication cho production
- Validate inputs với Zod schema
- Rate limiting cho API endpoints

## 📚 Tài Liệu Tham Khảo

- Fractal MCP SDK: https://github.com/fractal-mcp/sdk
- OpenAI Apps SDK: https://developers.openai.com/apps-sdk/
- Model Context Protocol: https://modelcontextprotocol.io

## 🤝 Contributing

Mọi đóng góp đều được hoan nghênh! Tạo issue hoặc pull request.

## 📄 License

MIT License
\*/
