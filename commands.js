const util = require('util');

module.exports = [
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
    cmd: 'ps -eo pcpu --sort=-pcpu',
    actions: [
      data => {
        let total = 0;
        data.replace(/([\d\.]{3,})/gm, function (str, match) {
          total += Number(match);
        });
        // Reduce to single decimal
        total = (total * 10 | 0) / 10;
        return util.format('CPU: %d%', total);
      }
    ]
  },
  {
    cmd: 'ps -eo size --sort=-size',
    actions: [
      data => {
        let total = 0;
        data.replace(/([\d\.]{3,})/gm, function (str, match) {
          total += Number(match);
        });
        // Reduce to single decimal
        return util.format('RAM: %s MiB', total / 1000 | 0);
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
        return util.format('Temp: %s° %s° %s°', ...matches);
      }
    ]
  },
  {
    cmd: 'nmcli connection show --active',
    actions: [
      data => {
        let matches = [];
        data.replace(/(^\w+)(?:.+vpn)/m, (str, match) => matches.push(match));
        if (!matches.length) {
          return 'VPN: no';
        }
        return 'VPN: ' + matches[0];
      },
      data => {
        let matches = [];
        data.replace(/(^\w+)(?:.+wifi)/m, (str, match) => matches.push(match));
        if (!matches.length) {
          return 'WiFi: no';
        }
        return 'WiFi: ' + matches[0];
      }
    ]
  },
  // Brightness
  {
    cmd: 'setbrightness',
    actions: [
      data => 'Brightness: ' + data.match(/level is (\d+)/)[1]
    ]
  },
  // Battery
  {
    cmd: 'acpi --battery',
    actions: [
      data => 'Battery: ' + data.match(/(\d{1,3}%)/)[1]
    ]
  },
  // Time
  {
    cmd: 'date +"%F %R:%S"',
    actions: [
      data => 'Time: ' + data.replace('\n', '')
    ]
  }
];
