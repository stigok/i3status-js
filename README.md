# statusbar-js

> Text based system status bar

## Install

    git clone https://github.com/stigok/statusbar-js
    cd statusbar-js
    npm install
    mv commands.sample.js commands.js

## Usage

    // updateInterval in milliseconds
    node index.js [updateInterval] [--debug]

Debug messages written to `stderr`

### Example

    $: node index.js 3000

### Using with i3 window manager

Find the line where `bar` is set in `~/.config/i3/config` and update `status_command` to run this script instead

    bar {
      # Update interval 3000ms
      status_command node ~/repos/statusbar-js/index.js 3000 --debug 2>> ~/i3status.log
    }

## Example output

    IP: 10.10.13.37 | VPN: Japan | WiFi: ossss | Brightness: 7 | Battery: 76% | Time: 2016-07-03 00:04:20

## Commands

The program reads `commands.js` and expects it to export an array of command objects to execute.

A command object describes what command to execute and action(s) to perform once the command is completed. The return value of the action function is used in the main program output.

    [
      {
        cmd: 'echo -n "Hello world!"',
        actions: [
          data => '1: ' + data,
          data => '2: ' + data.replace('Hello', 'Goodbye')
        ]
      }
    ]

    // Output
    // 1: Hello world! 2: Goodbye world!

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

## License

MIT
