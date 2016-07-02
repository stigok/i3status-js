# statusbar-js

> Made this for my i3wm i3-status bar

## Usage

1. Clone repo
2. Install dependencies `npm i`
3. Rename `commands-template.js` to `commands.js`
4. Customize commands to your likings
5. Run with `node index.js [ updateInterval ]` where `updateInterval` is time in milliseconds

## Example output

    IP: 192.168.77.5 | VPN: Netherlands | Time: 2016-07-02 23:08:23

## Commands

The program reads `commands.js` and expects it to export an array of command objects to execute.

A command object describes what command to execute and action(s) to perform once the command is completed. The return value of these functions are used in the main program output.

    [
      {
        cmd: 'echo -n "Hello world!"',
        actions: [
          data => '1: ' + data,
          data => '2: ' + data.replace('Hello', 'Goodbye')
        ]
      },
      {
        cmd: 'date +"%F %R:%S"',
        actions: [
          data => 'Time: ' + data.replace('\n', '')
        ]
      }
    ]

    // Output
    // 1: Hello world! | 2: Goodbye world! | Time: 2016-07-03 00:06:23

### Example

Get VPN status and WiFi information from the same output

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
    }

All functions in `command.actions` are called with a single param `stdout`.

## Using with i3
Find the line where `bar` is set in `~/.config/i3/config` and update `status_command` to run this script instead

    bar {
      # Update interval 3000ms
      status_command node ~/i3status-js/index.js 3000
    }

## License

MIT
