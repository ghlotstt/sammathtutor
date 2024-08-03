// utils.js

export function scrollToBottom(outputArea) {
    outputArea.scrollTop = outputArea.scrollHeight;
}

export function formatAssistantMessage(message) {
    // Convert line breaks to <br> tags
    message = message.replace(/\n/g, "<br>");
    // Convert numbered lists
    message = message.replace(/(\d+\.)\s/g, "$1&nbsp;");
    // Convert bullet points
    message = message.replace(/-\s/g, "&nbsp;&nbsp;&nbsp;&nbsp;- ");
    // Ensure consistent formatting for sections and lists
    message = message.replace(/(\*\*.+?\*\*)/g, "<strong>$1</strong>");
    message = message.replace(/<strong>\*\*(.+?)\*\*<\/strong>/g, "<strong>$1</strong>");
    message = message.replace(/###\s/g, "<h3>").replace(/(<br>)+/g, "<br>");
    return `<div>${message}</div>`;
}


