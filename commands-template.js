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
