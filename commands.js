const util = require('util');

module.exports = [
  {
    cmd: 'ps -eo pcpu --sort=-pcpu',
    actions: [
      data => {
        let stats = [];
        data.replace(/([\d\.]{3,})/gm, (str, match) => stats.push(Number(match)));
        // Reduce to single decimal
        let total = stats.reduce((a, b) => a + b);
        total = (total * 10 | 0) / 10;
        return util.format('%d% (%s%)', total, stats[0]);
      }
    ]
  },
  {
    cmd: 'ps -eo size --sort=-size',
    actions: [
      data => {
        let stats = [];
        data.replace(/([\d\.]{3,})/gm, (str, match) => stats.push(Number(match) / 1000 | 0));
        // Reduce to single decimal
        let total = stats.reduce((a, b) => a + b);
        // Reduce to single decimal
        return util.format('%d MiB (%d MiB)  |', total, stats[0]);
      }
    ]
  },
  // Networking
  {
    cmd: 'ip address',
    actions: [
      data => {
        let matches = [];
        data.replace(/([\d.]{8,20})/g, (str, match) => matches.push(match));
        matches = matches.filter(m => !m.startsWith('127'));
        return 'IP: ' + matches[0];
      }
    ]
  },
  {
    cmd: 'nmcli -t -f DEVICE,TYPE,NAME c show --active',
    actions: [
      data => {
        let matches = [];
        data.replace(/wireless:(\S+)/, (str, match) => matches.push(match));
        if (!matches.length) {
          return 'WiFi: no';
        }
        return 'WiFi: ' + matches[0];
      },
      data => {
        let matches = [];
        data.replace(/vpn:(.+)/m, (str, match) => matches.push(match));
        if (!matches.length) {
          return 'VPN: no';
        }
        return 'VPN: ' + matches[0];
      }
    ]
  },
  {
    cmd: 'cat /sys/devices/virtual/thermal/thermal_zone0/temp &&' +
         'cat /sys/devices/virtual/thermal/thermal_zone1/temp &&' +
         'cat /sys/devices/virtual/thermal/thermal_zone2/temp',
    actions: [
      data => {
        let matches = [];
        data.replace(/(\d{4,6})/g, (str, match) => matches.push(match));
        matches = matches.map(m => Number(m) / 1000 | 0);
        return util.format('❄ %s° %s° %s°', ...matches);
      }
    ]
  },
  {
    cmd: 'amixer get Master',
    actions: [
      data => {
        let volume = data.match(/\[(\d{1,3}%)]/)[1];
        let muted = data.match(/(\[off\])/);
        return util.format('♬ %s', muted ? '(Muted)' : volume);
      }
    ]
  },
  // Brightness
  {
    cmd: 'setbrightness',
    actions: [
      data => '☀ ' + data.match(/level is (\d+)/)[1]
    ]
  },
  // Battery
  {
    cmd: 'acpi --battery',
    actions: [
      data => '♥ ' + data.match(/(\d{1,3}%)/)[1]
    ]
  },
  // Time
  {
    cmd: 'date +"%F %R:%S"',
    actions: [
      data => data.replace('\n', '')
    ]
  }
];
