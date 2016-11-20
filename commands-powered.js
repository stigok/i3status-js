/*
* Customised commands file for stigok/statusbar-js
*/
const util = require('util');

module.exports = [
  {
    cmd: '# Lucky charms',
    actions: [
      () => "⚥⚥⚥ xxx"
    ]
  },
  {
    cmd: 'mpstat -P ALL | grep all | xcol 4',
    actions: [
      data => `${data}%`
    ]
  },
  {
    cmd: 'cat /proc/meminfo | xcol 2',
    actions: [
      data => `${Number(data) / 1024 | 0} MB`
    ]
  },
  // Networking
  {
    cmd: 'curl -sS https://whatismyip.stigok.com | grep -oe \'[a-f0-9\.]\\{7,15\\}$\'',
    actions: [
      ip => `WAN: ${ip || 'N/A'}`
    ]
  },
  {
    cmd: 'ip address show dev wlp2s0 | grep inet | xcol 2',
    actions: [
      data => {
        if (!data || !data.length) return 'LAN: N/A'
        ips = data.split(/\n/);
        return `LAN: ${ips[0]}`;
      }
    ]
  },
  {
    cmd: `nmcli --terse --fields NAME,TYPE c show --active | grep ':802-11-wireless' | xcol 1`,
    actions: [
      data => `WiFi: ${data ? data.split(':')[0] : "no"}`,
    ]
  },
  {
    cmd: `nmcli --terse --fields NAME,TYPE c show --active | grep ':vpn' | xcol 1`,
    actions: [
      data => `VPN: ${data ? data.split(':')[0] : "no"}`,
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
        return util.format('♬ %s', muted ? '(V)' : volume);
      }
    ]
  },
  // Brightness
  {
    cmd: '~/bin/setbrightness',
    actions: [
      data => '☀ ' + data.match(/level is (\d+)/)[1]
    ]
  },
  // Battery
  {
    cmd: 'acpi --battery',
    actions: [
      function (data) {
        var chargeStatus = data.match(/discharging/ig) === null ? ' ↯' : '♥';
        var chargeLevel = data.match(/(\d{1,3}%)/)[1];
        return `${chargeStatus} ${chargeLevel}`;
      }
    ]
  },
  // Time
  {
    cmd: 'date +"%d/%m/%y %R:%S"',
    actions: [
      data => data.replace('\n', '')
    ]
  }
];
