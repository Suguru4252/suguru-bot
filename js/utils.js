// ========== ФУНКЦИИ ФОРМАТИРОВАНИЯ ==========
function formatNumber(num) {
    if (num === undefined || num === null || isNaN(num)) return "0";
    if (num >= 1e18) return (num / 1e18).toFixed(2) + 'Qi';
    if (num >= 1e15) return (num / 1e15).toFixed(2) + 'Q';
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return Math.floor(num).toString();
}

function formatFullNumber(num) {
    if (num === undefined || num === null || isNaN(num)) return "0";
    return Math.floor(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function formatMoney(num) {
    if (num === undefined || num === null || isNaN(num)) return "$ 0";
    return '$ ' + formatFullNumber(num);
}

function formatTime(ms) {
    if (ms < 0) return "00:00:00";
    const hours = Math.floor(ms / (60 * 60 * 1000));
    const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((ms % (60 * 1000)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function formatTimeShort(ms) {
    if (ms < 0) return "00:00";
    const hours = Math.floor(ms / (60 * 60 * 1000));
    const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
    return `${hours}ч ${minutes}м`;
}

function getDeviceId() {
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
        deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('deviceId', deviceId);
    }
    return deviceId;
}

currentUserId = getDeviceId();