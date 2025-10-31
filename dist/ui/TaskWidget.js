import React from 'react';
import { useWidgetProps, useWidgetState } from '@fractal-mcp/oai-hooks';
export default function TaskWidget() {
    const props = useWidgetProps();
    const [state, setState] = useWidgetState({
        filter: 'all',
        sortBy: 'date'
    });
    const filteredTasks = props.tasks.filter(task => {
        if (state.filter === 'active')
            return !task.completed;
        if (state.filter === 'completed')
            return task.completed;
        return true;
    });
    const sortedTasks = [...filteredTasks].sort((a, b) => {
        if (state.sortBy === 'priority') {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return '#ef4444';
            case 'medium': return '#f59e0b';
            case 'low': return '#10b981';
            default: return '#6b7280';
        }
    };
    const getPriorityLabel = (priority) => {
        switch (priority) {
            case 'high': return 'Cao';
            case 'medium': return 'Trung bình';
            case 'low': return 'Thấp';
            default: return priority;
        }
    };
    return (React.createElement("div", { style: {
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            padding: '20px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            maxWidth: '600px',
            margin: '0 auto'
        } },
        React.createElement("div", { style: { marginBottom: '20px' } },
            React.createElement("h2", { style: {
                    margin: '0 0 8px 0',
                    fontSize: '24px',
                    fontWeight: '600',
                    color: '#1f2937'
                } }, "\uD83D\uDCDD Task Manager"),
            React.createElement("p", { style: {
                    margin: 0,
                    fontSize: '14px',
                    color: '#6b7280'
                } }, props.message)),
        React.createElement("div", { style: {
                display: 'flex',
                gap: '12px',
                marginBottom: '20px',
                flexWrap: 'wrap'
            } },
            React.createElement("div", { style: { display: 'flex', gap: '8px' } },
                React.createElement("button", { onClick: () => setState({ ...state, filter: 'all' }), style: {
                        padding: '8px 16px',
                        border: state.filter === 'all' ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                        borderRadius: '8px',
                        backgroundColor: state.filter === 'all' ? '#eff6ff' : '#ffffff',
                        color: state.filter === 'all' ? '#3b82f6' : '#6b7280',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    } },
                    "T\u1EA5t c\u1EA3 (",
                    props.tasks.length,
                    ")"),
                React.createElement("button", { onClick: () => setState({ ...state, filter: 'active' }), style: {
                        padding: '8px 16px',
                        border: state.filter === 'active' ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                        borderRadius: '8px',
                        backgroundColor: state.filter === 'active' ? '#eff6ff' : '#ffffff',
                        color: state.filter === 'active' ? '#3b82f6' : '#6b7280',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    } },
                    "\u0110ang l\u00E0m (",
                    props.tasks.filter(t => !t.completed).length,
                    ")"),
                React.createElement("button", { onClick: () => setState({ ...state, filter: 'completed' }), style: {
                        padding: '8px 16px',
                        border: state.filter === 'completed' ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                        borderRadius: '8px',
                        backgroundColor: state.filter === 'completed' ? '#eff6ff' : '#ffffff',
                        color: state.filter === 'completed' ? '#3b82f6' : '#6b7280',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    } },
                    "Ho\u00E0n th\u00E0nh (",
                    props.tasks.filter(t => t.completed).length,
                    ")")),
            React.createElement("select", { value: state.sortBy, onChange: (e) => setState({ ...state, sortBy: e.target.value }), style: {
                    padding: '8px 12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: '#ffffff',
                    color: '#6b7280',
                    cursor: 'pointer'
                } },
                React.createElement("option", { value: "date" }, "S\u1EAFp x\u1EBFp: Ng\u00E0y t\u1EA1o"),
                React.createElement("option", { value: "priority" }, "S\u1EAFp x\u1EBFp: \u0110\u1ED9 \u01B0u ti\u00EAn"))),
        React.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: '12px' } }, sortedTasks.length === 0 ? (React.createElement("div", { style: {
                padding: '40px',
                textAlign: 'center',
                color: '#9ca3af',
                fontSize: '14px'
            } }, state.filter === 'completed' ? '🎉 Chưa có task nào hoàn thành' :
            state.filter === 'active' ? '✨ Không có task đang làm' :
                '📋 Danh sách task trống')) : (sortedTasks.map(task => (React.createElement("div", { key: task.id, style: {
                padding: '16px',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                backgroundColor: task.completed ? '#f9fafb' : '#ffffff',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.2s',
                opacity: task.completed ? 0.7 : 1
            } },
            React.createElement("div", { style: {
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    border: task.completed ? '2px solid #10b981' : '2px solid #d1d5db',
                    backgroundColor: task.completed ? '#10b981' : '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                } }, task.completed && (React.createElement("span", { style: { color: '#ffffff', fontSize: '16px' } }, "\u2713"))),
            React.createElement("div", { style: { flex: 1 } },
                React.createElement("div", { style: {
                        fontSize: '16px',
                        fontWeight: '500',
                        color: task.completed ? '#9ca3af' : '#1f2937',
                        textDecoration: task.completed ? 'line-through' : 'none',
                        marginBottom: '4px'
                    } }, task.title),
                React.createElement("div", { style: {
                        fontSize: '12px',
                        color: '#9ca3af',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    } },
                    React.createElement("span", { style: {
                            padding: '2px 8px',
                            borderRadius: '4px',
                            backgroundColor: getPriorityColor(task.priority) + '20',
                            color: getPriorityColor(task.priority),
                            fontWeight: '500'
                        } }, getPriorityLabel(task.priority)),
                    React.createElement("span", null, new Date(task.createdAt).toLocaleDateString('vi-VN'))))))))),
        React.createElement("div", { style: {
                marginTop: '20px',
                padding: '16px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-around',
                fontSize: '14px'
            } },
            React.createElement("div", { style: { textAlign: 'center' } },
                React.createElement("div", { style: { fontWeight: '600', color: '#1f2937', fontSize: '20px' } }, props.tasks.length),
                React.createElement("div", { style: { color: '#6b7280' } }, "T\u1ED5ng s\u1ED1")),
            React.createElement("div", { style: { textAlign: 'center' } },
                React.createElement("div", { style: { fontWeight: '600', color: '#3b82f6', fontSize: '20px' } }, props.tasks.filter(t => !t.completed).length),
                React.createElement("div", { style: { color: '#6b7280' } }, "\u0110ang l\u00E0m")),
            React.createElement("div", { style: { textAlign: 'center' } },
                React.createElement("div", { style: { fontWeight: '600', color: '#10b981', fontSize: '20px' } }, props.tasks.filter(t => t.completed).length),
                React.createElement("div", { style: { color: '#6b7280' } }, "Ho\u00E0n th\u00E0nh"))),
        React.createElement("div", { style: {
                marginTop: '16px',
                padding: '12px',
                backgroundColor: '#eff6ff',
                borderRadius: '8px',
                fontSize: '13px',
                color: '#3b82f6',
                border: '1px solid #dbeafe'
            } },
            "\uD83D\uDCA1 ",
            React.createElement("strong", null, "M\u1EB9o:"),
            " N\u00F3i v\u1EDBi ChatGPT \u0111\u1EC3 th\u00EAm, ho\u00E0n th\u00E0nh, ho\u1EB7c x\u00F3a task!")));
}
