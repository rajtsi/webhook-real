const notification_service = require('./whatsapp-notification-service');

const handlers = {
    "user.created": async (data) => {
        console.log("New user:", data);
    },
    "user.updated": async (data) => {
        console.log("User updated:", data);
    },
    "user.deleted": async (data) => {
        console.log("User deleted:", data);
    },
    "order.paid": async (data) => {
        console.log("Order payment successful:", data);
    },
    "order.pending": async (data) => {
        console.log("Order pending:", data);
    },
    "order.failed": async (data) => {
        console.log("Order payment failed:", data);
    },
    "order.shipped": async (data) => {
        console.log("Order shipped:", data);
    },
    "order.delivered": async (data) => {
        console.log("Order delivered:", data);
    },
    "email.opened": async () => {
        console.log("Email opened");
    },
    "email.clicked": async (data) => {
        console.log("Email clicked:", data);
    },
    "email.bounced": async (data) => {
        console.log("Email bounced:", data);
    },
    "payment.success": async (data) => {
        console.log("Payment successful:", data);
    },
    "payment.refunded": async (data) => {
        console.log("Payment refunded:", data);
    },
    "subscription.activated": async (data) => {
        console.log("Subscription activated:", data);
    },
    "subscription.cancelled": async (data) => {
        console.log("Subscription cancelled:", data);
    },
    "notification.sent": async (data) => {
        console.log("Notification sent:", data);
    },
    "report.generated": async (data) => {
        console.log("Report generated:", data);
    },
    "backup.completed": async (data) => {
        console.log("Backup completed:", data);
    },
    "sync.started": async (data) => {
        console.log("Sync started:", data);
    },
    "sync.completed": async (data) => {
        console.log("Sync completed:", data);
    },
};

const defaultHandler = async (event, data) => {
    console.log("Unknown event:", event, data);
};

const handleEvent = async (event, data) => {
    let dataArray = [];
    dataArray.push('Webhook Testing');
    dataArray.push('Do Not Reply');
    dataArray.push('Sucess');
    dataArray.push(new Date().toISOString());
    notification_service('917007721209', 'status_update_alert', dataArray);
    const fn = handlers[event];
    if (fn) return fn(data);
    return defaultHandler(event, data);
};

const registerHandler = (event, fn) => {
    handlers[event] = fn;
};

module.exports = {
    handleEvent,
    registerHandler,
    events: Object.keys(handlers),
};